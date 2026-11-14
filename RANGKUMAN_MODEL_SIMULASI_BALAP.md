# Rangkuman Model Aset 3D & Model Matematika Simulasi Balap F1 WebAR

Dokumen ini merangkum secara komprehensif seluruh **Model Aset 3D**, **Model Komputasi/Matematika**, serta **Fisika Pergerakan** yang digunakan untuk membuat mobil Formula 1 dan MotoGP dapat melaju, berbelok, dan dikendalikan secara interaktif di **Circuit de Barcelona-Catalunya** pada aplikasi WebAR balap ini.

---

## 1. Daftar Model Aset 3D (3D Mesh Assets)

Aplikasi ini menggunakan format **GLTF / GLB (GL Transmission Format Binary)** yang didukung oleh Three.js dan dioptimalkan dengan kompresi **Draco Mesh Compression** untuk efisiensi transfer data web.

| No | Nama File Model | Kategori | Deskripsi & Spesifikasi |
|---|---|---|---|
| **1** | [`circuit_de_catalunya.glb`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/circuit_de_catalunya.glb) | **Environment / Racetrack** | Model 3D sirkuit balap Formula 1 Circuit de Barcelona-Catalunya (~53.89 MB) dengan skala 1:1 dunia nyata (~4.7 km keliling loop). Mencakup seluruh aspal lintasan, *pit building*, *pit lane*, tribun penonton utama (*grandstands*), tiang lampu start (*start lights gantry*), menara pit (*pit tower*), pagar pembatas (*catch fences*), kerb merah-putih, dan pepohonan. Dikalibrasi dengan matriks `scale.set(100, 100, 100)` dari unit sentimeter FBX ke skala meter Three.js. |
| **2** | [`redbull_RB19.glb`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/redbull_RB19.glb) | **Mobil Balap F1** | Model 3D mobil F1 Oracle Red Bull Racing RB19 (~9.78 MB). Dilengkapi material PBR (*Physically Based Rendering*), aero package sayap depan-belakang, ban Pirelli F1, dan livery khas Red Bull dengan audio mesin Honda RBPT. |
| **3** | [`ferarri_f1-75.glb`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/ferarri_f1-75.glb) | **Mobil Balap F1** | Model 3D Scuderia Ferrari F1-75 (~11.20 MB). Menampilkan sidepod khas cekung *tub-style*, livery merah matte khas Ferrari, halo kokpit, dan audio mesin Ferrari 066/7 V6 Turbo. |
| **4** | [`mercy-w15.glb`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/mercy-w15.glb) | **Mobil Balap F1** | Model 3D Mercedes-AMG PETRONAS F1 W15 (~3.09 MB). Livery perak-hitam dengan aksen hijau toska PETRONAS dan audio mesin Mercedes-AMG M15 E Performance. |
| **5** | [`f1-amr23.glb`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/f1-amr23.glb) | **Mobil Balap F1** | Model 3D Aston Martin Aramco F1 AMR23 (~5.03 MB). Livery British Racing Green dengan aksen kuning fluorescent dan audio mesin Aston Martin. |
| **6** | [`ducati_desmo.glb`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/ducati_desmo.glb) | **Motor Balap MotoGP** | Model 3D Ducati Desmosedici GP (~3.86 MB). Motor balap MotoGP pabrikan Ducati dengan skala proporsional dan aero winglet. |
| **7** | `createFallbackCar()` | **Model Prosedural Fallback** | Model mobil F1 geometris Three.js prosedural (*BoxGeometry*, *CylinderGeometry*, *ConeGeometry*) yang otomatis dibuat di memori jika jaringan internet pengguna lambat atau gagal mengunduh GLB utama. |

---

## 2. Model Komputasi, Matematika & Fisika Pergerakan

Agar mobil dapat melaju mulus menyusuri aspal sirkuit Catalunya, berbelok, dan merespon pedal gas serta rem, sistem menerapkan serangkaian **model matematika dan kinematika**:

```
[183 Waypoints Sirkuit]
         │
         ▼
[Catmull-Rom Centripetal Spline Curve] ──► Posisi Dasar P(t) & Tangen T(t)
         │                                            │
         ├────────────────────────────────────────────┤
         │                                            ▼
[Input Pengemudi: Gas & Rem]             [Input Kemudi: Kiri & Kanan]
         │                                            │
         ▼                                            ▼
[Model Kecepatan & Telemetri]            [Model Pergeseran Melintang (Lateral Offset)]
         │                                            │
         └──────────────────┬─────────────────────────┘
                            ▼
               [Posisi Aktual Mobil P_aktual]
               [Rotasi Hadap (LookAt) & Yaw]
               [Kemiringan Bodi (Body Roll)]
                            │
                            ▼
              [Render Tiga Dimensi WebGL]
```

---

### A. Model Kurva Lintasan (Trajectory Spline Model)
Alih-alih menggerakkan mobil secara kaku dari titik ke titik, lintasan dimodelkan menggunakan **Catmull-Rom Centripetal Spline Curve**:

$$\mathbf{C}(t) = \text{CatmullRomSpline}(\mathbf{P}_0, \mathbf{P}_1, \dots, \mathbf{P}_{182}, \text{centripetal})$$

* **183 Koordinat Waypoint Tiga Dimensi:** Titik koordinat $(X, Y, Z)$ disurvei presisi dari geometri aspal sirkuit Catalunya yang sebenarnya.
* **Arah Searah Jarum Jam (*Clockwise*):** Titik urutan dibalik sesuai arah balap resmi FIA Spanish GP. Titik ke-0 berada di garis start/finish di depan *pit tower* $(X=148.86, Y=5.86, Z=178.20)$.
* **Parameter Progres Lintasan:** Didefinisikan sebagai nilai ternormalisasi $t \in [0.0, 1.0)$. Ketika $t \ge 1.0$, nilainya kembali ke $0.0$ melalui operasi modulo ($t \pmod{1.0}$) yang merepresentasikan pergantian putaran lap.

---

### B. Model Vektor Arah & Kinematika Hadap (Tangent & Lookahead Kinematics)
Untuk menentukan ke mana moncong mobil harus menghadap secara mulus, sistem menggunakan algoritma **Lookahead Vector**:

$$\vec{T}(t) = \frac{\mathbf{P}(t + \Delta t) - \mathbf{P}(t)}{\|\mathbf{P}(t + \Delta t) - \mathbf{P}(t)\|}$$

* Nilai $\Delta t = 0.0012$ memproyeksikan target pandang sekitar 6 meter di depan mobil.
* Mobil diarahkan ke titik proyeksi tersebut menggunakan fungsi matriks orientasi `carModel.lookAt(targetPos)`. Dengan cara ini, moncong mobil selalu otomatis mengikuti kelokan lintasan tanpa patah-patah (*jitter-free*).

---

### C. Model Kemudi Jalur Melintang (Lateral Offset & Normal Vector Steering)
Agar pengguna dapat **membelokkan mobil ke kanan dan ke kiri** di atas lebar aspal sirkuit (~12–14 meter), sistem menghitung vektor normal horizontal yang tegak lurus terhadap arah laju mobil:

$$\vec{N}_{\text{right}} = \frac{\vec{T} \times \vec{U}}{\|\vec{T} \times \vec{U}\|}, \quad \text{dengan } \vec{U} = (0, 1, 0)$$

Posisi akhir mobil setelah dikemudikan adalah:

$$\mathbf{P}_{\text{aktual}} = \mathbf{P}(t) + d_{\text{lateral}} \cdot \vec{N}_{\text{right}}$$

* **Batas Lintasan ($d_{\text{lateral}}$):** Dibatasi pada rentang $[-5.2\text{ m}, +5.2\text{ m}]$.
  * Tombol **KIRI (◀)**: Menambah offset negatif (bergerak ke arah luar/tribun utama).
  * Tombol **KANAN (▶)**: Menambah offset positif (bergerak ke arah dalam/pit lane).
* **Auto-Centering Spring Effect:** Saat tombol kemudi dilepas, gaya pegas pemulih (*spring lerp*) secara otomatis mengembalikan mobil merapat kembali ke *racing line* ideal di tengah sirkuit:

$$d_{\text{lateral}} \leftarrow d_{\text{lateral}} + (0 - d_{\text{lateral}}) \times 0.04$$

---

### D. Model Dinamika Visual Belokan (Yaw & Suspension Body Roll)
Ketika mobil berbelok tajam, mobil tidak hanya bergeser secara lateral, tetapi juga mengalami rotasi bodi dan kemiringan suspensi realistis:

$$\theta_{\text{yaw}} = -\theta_{\text{steer}} \times 0.35 \quad (\text{moncong mobil menoleh ke arah tikungan})$$

$$\theta_{\text{roll}} = -\theta_{\text{steer}} \times 0.10 \quad (\text{kemiringan bodi akibat gaya sentrifugal})$$

---

### E. Model Kecepatan, Akselerasi & Pengereman (Dynamic Telemetry Model)
Laju kemajuan lintasan mobil dihitung setiap frame animasi dengan integrasi waktu delta ($\Delta t_{\text{frame}}$):

$$v_{\text{aktual}} = v_{\text{base}} \times f_{\text{track}}(t) \times f_{\text{user}} \times f_{\text{DRS}}$$

$$\Delta \text{progress} = v_{\text{aktual}} \times (\Delta t_{\text{frame}} \times 60)$$

1. **Faktor Geometri Sirkuit ($f_{\text{track}}$):**
   * **Trek Lurus Utama & Belakang:** $f_{\text{track}} = 1.38$ (akselerasi penuh).
   * **Tikungan Tajam & Chicane (Elf, Stadium, La Caixa):** $f_{\text{track}} = 0.60$ (deselerasi pengereman realistis).
2. **Faktor Kontrol Pengemudi ($f_{\text{user}}$):**
   * **Pedal GAS Ditekan:** $f_{\text{user}} \rightarrow 1.65$ (melesat hingga $330 - 350\text{ km/jam}$).
   * **Pedal REM Ditekan:** $f_{\text{user}} \rightarrow 0.18$ (mengerem keras hingga $25 - 40\text{ km/jam}$).
   * **Pedal Dilepas (Cruising):** $f_{\text{user}} \rightarrow 1.00$ (stabil pada kecepatan jelajah $\sim 200\text{ km/jam}$).
3. **DRS Boost ($f_{\text{DRS}}$):** Mengalikan kecepatan sebesar $1.45\times$ saat sayap belakang dibuka.

---

### F. Model Kamera Kinematik (Cinematic Camera Rig Model)
Sistem kamera terikat secara parametrik pada posisi $\mathbf{P}_{\text{aktual}}$ dan vektor tangen $\vec{T}$:
* **Chase Cam:** Kamera mengejar di belakang mobil berjarak $-14\text{ m}$ dan tinggi $+4.8\text{ m}$.
* **Cockpit Cam:** Kamera berada tepat di helm pembalap di atas kokpit halo ($+0.4\text{ m}$ ke depan, $+1.25\text{ m}$ ke atas).
* **Drone Cam:** Kamera helikopter aerial berjarak $-26\text{ m}$ ke belakang dan $+32\text{ m}$ di atas mobil.
* **Free Orbit:** Kamera orbit bebas Three.js yang memungkinkan pengguna menginspeksi mobil 360 derajat.

---

### G. Model Sintesis Suara Mesin (Audio Pitch Synthesis Model)
* **Web Audio API Oscillator:** Menggunakan gelombang *sawtooth* dengan filter *bandpass* ($Q=2.5$). Frekuensi suara dinaikkan linier sesuai kecepatan:

$$f_{\text{audio}} = 160 + (v_{\text{kmh}} \times 3.8)\text{ Hz}$$

* **Audio Mesin Asli F1:** Memodulasi nilai `playbackRate` file audio asli mobil dari $0.85\times$ (kecepatan rendah) hingga $1.35\times$ (kecepatan puncak).

---

## 3. Kesimpulan

Untuk mewujudkan pengalaman balap F1 interaktif di sirkuit Catalunya, sistem mengombinasikan:
1. **7 Model 3D Asset** (Sirkuit Catalunya skala penuh 1:1, 4 model mobil F1 Red Bull/Ferrari/Mercedes/Aston Martin, 1 motor Ducati MotoGP, dan 1 model prosedural fallback).
2. **5 Model Matematika & Fisika** (Interpolasi *Catmull-Rom Spline*, vektor arah *Lookahead Tangent*, kemudi melintang *Lateral Vector Steering*, kinematika *Dynamic Acceleration/Braking*, dan *Cinematic Camera Rig*).

Seluruh implementasi kode dapat diakses langsung pada file sumber utama:
* **Halaman Sirkuit & Simulasi:** [`sirkuit.html`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/sirkuit.html)
* **Service Worker Caching:** [`sw.js`](file:///c:/Users/fakba/OneDrive/Dokumen/BSI/SEMESTER%205/TUGAS/VIRTUAL%20N%20AR/sw.js)
