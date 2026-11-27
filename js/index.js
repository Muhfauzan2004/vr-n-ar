// Data Kendaraan Sesuai QR Code (Sumber 3D Model Dinamis / Lazy Loaded)
const VEHICLES = {
    'redbull': {
        name: 'Red Bull Racing RB19',
        cat: 'Oracle Red Bull • Formula 1',
        color: '#0284c7',
        src: './assets/models/redbull_RB19.glb',
        sound: './assets/audio/redbull_sound.mp3',
        qr: './assets/qr/qr_redbull.png',
        tag: 'FORMULA 1',
        year: '2023 (Musim Formula 1 2023)',
        drivers: 'Max Verstappen (#1) & Sergio Pérez (#11)',
        hp: '~1.000+ HP',
        topSpeed: '~355 km/jam',
        accel: '~2,6 detik',
        weight: '798 kg (FIA)',
        engine: 'Honda RBPTH001 • 1.6L V6 Turbo Hybrid (8-Speed Semi-Otomatis)',
        championship: 'Juara Dunia Pembalap & Konstruktor F1 2023 (21 menang dari 22 seri • Rekor 95,5% kemenangan)',
        fact: 'Dirancang oleh Adrian Newey, RB19 tercatat sebagai mobil F1 paling dominan sepanjang sejarah — mencetak 14 kemenangan beruntun di 2023 (15 beruntun tim sejak akhir 2022), plus rekor 10 kemenangan beruntun dan 19 kemenangan Max Verstappen dalam satu musim.'
    },
    'ferrari': {
        name: 'Ferrari F1-75',
        cat: 'Scuderia Ferrari • Formula 1',
        color: '#e11d48',
        src: './assets/models/ferarri_f1-75.glb',
        sound: './assets/audio/ferrari_sound.mp3',
        qr: './assets/qr/qr_ferrari.png',
        tag: 'FORMULA 1',
        year: '2022 (Musim Formula 1 2022)',
        drivers: 'Charles Leclerc (#16) & Carlos Sainz Jr. (#55)',
        hp: '~1.000 HP',
        topSpeed: '~350 km/jam',
        accel: '~2,6 detik',
        weight: '798 kg (FIA)',
        engine: 'Ferrari 066/7 • 1.6L V6 Turbo Hybrid (8-Speed Semi-Otomatis)',
        championship: 'Runner-Up Konstruktor (554 Poin) & Pembalap F1 2022 (4 Kemenangan GP, 12 Pole Position, 20 Podium)',
        fact: 'Dinamai F1-75 untuk merayakan 75 tahun mobil produksi pertama Ferrari (125 S, 1947). Menjadi comeback terbaik Ferrari di era ground-effect dengan desain sidepod "bathtub" agresif dan kecepatan kualifikasi terkencang di 2022.'
    },
    'mercedes': {
        name: 'Mercedes-AMG F1 W15',
        cat: 'Mercedes-AMG PETRONAS • Formula 1',
        color: '#00a19c',
        src: './assets/models/mercy-w15.glb',
        sound: './assets/audio/mercedes_sound.mp3',
        qr: './assets/qr/qr_mercedes.png',
        tag: 'FORMULA 1',
        year: '2024 (Musim Formula 1 2024)',
        drivers: 'Lewis Hamilton (#44) & George Russell (#63)',
        hp: '~1.000+ HP',
        topSpeed: '~352 km/jam',
        accel: '~2,6 detik',
        weight: '798 kg (FIA)',
        engine: 'Mercedes-AMG F1 M15 E Performance • 1.6L V6 Turbo Hybrid (8-Speed)',
        championship: '4 Kemenangan GP Musim F1 2024 (Austria, Inggris/Silverstone, Belgia, Las Vegas) • P4 Konstruktor (468 Poin)',
        fact: 'Mobil terakhir Lewis Hamilton bersama Mercedes sebelum pindah ke Ferrari. Mencetak rekor 9 kemenangan Hamilton di kandangnya Silverstone serta finis dominan 1–2 di GP Las Vegas 2024.'
    },
    'astonmartin': {
        name: 'Aston Martin AMR23',
        cat: 'Aston Martin Aramco • Formula 1',
        color: '#00594f',
        src: './assets/models/f1-amr23.glb',
        sound: './assets/audio/astonmartin_sound.mp3',
        qr: './assets/qr/qr_astonmartin.png',
        tag: 'FORMULA 1',
        year: '2023 (Musim Formula 1 2023)',
        drivers: 'Fernando Alonso (#14) & Lance Stroll (#18)',
        hp: '~1.000 HP',
        topSpeed: '~348 km/jam',
        accel: '~2,6 detik',
        weight: '798 kg (FIA)',
        engine: 'Mercedes-AMG F1 M14 E Performance • 1.6L V6 Turbo Hybrid (8-Speed)',
        championship: '8 Podium di Musim F1 2023 (3x P2 di Monako/Kanada/Belanda & 5x P3 oleh Fernando Alonso) • P5 Konstruktor (280 Poin)',
        fact: 'Menjadi kejutan terbesar F1 2023 setelah melesat dari peringkat 7 musim 2022 ke barisan podium sejak seri pembuka Bahrain dan mengantar Fernando Alonso meraih podium ke-100 sepanjang kariernya di GP Arab Saudi.'
    },
    'ducati': {
        name: 'Ducati Desmosedici GP',
        cat: 'Ducati Lenovo • MotoGP',
        color: '#f59e0b',
        src: './assets/models/ducati_desmo.glb',
        sound: null,
        qr: './assets/qr/qr_ducati.png',
        tag: 'MOTOGP'
    }
};

// Normalisasi Semua Alias Parameter & Text Scan
function resolveModelKey(raw) {
    if (!raw) return null;
    const str = raw.toLowerCase().trim();
    if (str.includes('redbull') || str.includes('rb19') || str === 'redbull' || str === 'rb19') return 'redbull';
    if (str.includes('ferrari') || str.includes('f1-75') || str === 'ferrari' || str === 'f1-75') return 'ferrari';
    if (str.includes('mercedes') || str.includes('mercy') || str.includes('w15') || str === 'mercedes' || str === 'w15') return 'mercedes';
    if (str.includes('astonmartin') || str.includes('aston') || str.includes('amr23') || str === 'astonmartin' || str === 'amr23') return 'astonmartin';
    if (str.includes('ducati') || str.includes('desmo') || str === 'ducati' || str === 'desmo') return 'ducati';
    return null;
}

let currentActiveModel = null;
let isTransitioning = false;
let soundEnabled = true;
let videoStream = null;
let isScanning = true;
let currentFacingMode = 'environment';
let audioCtx = null;
let lastScannedText = '';
let lastScanTime = 0;
let themeFadeTimer = null;

const video = document.getElementById('camera-video');
const canvas = document.getElementById('scan-canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const scannerOverlay = document.getElementById('scanner-overlay');
const arUiOverlay = document.getElementById('ar-ui-overlay');
const badgeTitle = document.getElementById('badge-title');
const badgeCat = document.getElementById('badge-cat');
const modelBadge = document.getElementById('model-badge');
const mainViewer = document.getElementById('main-model-viewer');
const modelLoader = document.getElementById('model-loader');
const loaderText = document.getElementById('loader-text');
const f1InfoCard = document.getElementById('f1-info-card');
const f1InfoHp = document.getElementById('f1-info-hp');
const f1InfoTopSpeed = document.getElementById('f1-info-topspeed');
const f1InfoAccel = document.getElementById('f1-info-accel');
const f1InfoWeight = document.getElementById('f1-info-weight');
const f1InfoYear = document.getElementById('f1-info-year');
const f1InfoDrivers = document.getElementById('f1-info-drivers');
const f1InfoEngine = document.getElementById('f1-info-engine');
const f1InfoChampionship = document.getElementById('f1-info-championship');
const f1InfoFact = document.getElementById('f1-info-fact');
const f1InfoTag = document.getElementById('f1-info-tag');
const f1InfoToggleBtn = document.getElementById('f1-info-toggle-btn');

function updateF1InfoCard(data) {
    if (!f1InfoCard) return;
    if (data && data.year && data.drivers) {
        if (f1InfoHp) f1InfoHp.innerText = data.hp || '-';
        if (f1InfoTopSpeed) f1InfoTopSpeed.innerText = data.topSpeed || '-';
        if (f1InfoAccel) f1InfoAccel.innerText = data.accel || '-';
        if (f1InfoWeight) f1InfoWeight.innerText = data.weight || '-';
        if (f1InfoYear) f1InfoYear.innerText = data.year;
        if (f1InfoDrivers) f1InfoDrivers.innerText = data.drivers;
        if (f1InfoEngine) f1InfoEngine.innerText = data.engine || '-';
        if (f1InfoChampionship) f1InfoChampionship.innerText = data.championship || '-';
        if (f1InfoFact) f1InfoFact.innerText = data.fact || '-';
        f1InfoCard.style.borderLeftColor = data.color || '#0284c7';
        if (f1InfoTag) f1InfoTag.style.color = data.color === '#00594f' ? '#2dd4bf' : (data.color || '#38bdf8');
        f1InfoCard.classList.remove('collapsed');
        if (f1InfoToggleBtn) f1InfoToggleBtn.innerText = 'Sembunyikan ▾';
        f1InfoCard.classList.add('show');
    } else {
        f1InfoCard.classList.remove('show', 'collapsed');
    }
}

function toggleF1InfoCard() {
    if (!f1InfoCard) return;
    const isCollapsed = f1InfoCard.classList.toggle('collapsed');
    if (f1InfoToggleBtn) {
        f1InfoToggleBtn.innerText = isCollapsed ? 'Lihat Detail ▴' : 'Sembunyikan ▾';
    }
}

const loadedModelKeys = new Set();

// Setup Event Listener pada Single Model Viewer (Hemat Memori & Loading Cepat)
if (mainViewer) {
    mainViewer.addEventListener('progress', (e) => {
        const percent = Math.round(e.detail.totalProgress * 100);
        if (loaderText && percent < 100) {
            loaderText.innerText = `Memuat 3D... ${percent}%`;
        }
    });

    mainViewer.addEventListener('load', () => {
        hideLoader();
        if (currentActiveModel) {
            loadedModelKeys.add(currentActiveModel);
        }
        setupARWheelSpin();
        console.log(`✅ Model 3D berhasil dimuat ke GPU!`);
    });

    mainViewer.addEventListener('error', (err) => {
        hideLoader();
        console.warn('Model loading error:', err);
    });
}

// ========================================================
// ANIMASI RODA BERPUTAR REALISTIS PADA MODEL 3D AR (<model-viewer>)
// ========================================================
let arWheelPivots = [];
let arWheelScene = null;
let arWheelRaf = null;
let arWheelLastTime = 0;

function stopARWheelSpin() {
    if (arWheelRaf) {
        cancelAnimationFrame(arWheelRaf);
        arWheelRaf = null;
    }
    arWheelPivots = [];
    arWheelScene = null;
}

function getMeshLocalBox(obj, Vec3) {
    const min = new Vec3(Infinity, Infinity, Infinity);
    const max = new Vec3(-Infinity, -Infinity, -Infinity);
    const v = new Vec3();
    let count = 0;
    obj.updateMatrixWorld(true);
    obj.traverse((child) => {
        if (!child.isMesh || !child.geometry || !child.geometry.attributes || !child.geometry.attributes.position) return;
        const pos = child.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld);
            if (v.x < min.x) min.x = v.x;
            if (v.y < min.y) min.y = v.y;
            if (v.z < min.z) min.z = v.z;
            if (v.x > max.x) max.x = v.x;
            if (v.y > max.y) max.y = v.y;
            if (v.z > max.z) max.z = v.z;
            count++;
        }
    });
    return count > 0 ? { min, max } : null;
}

function repivotARObject(obj, parent, Vec3, GroupCtor) {
    const box = getMeshLocalBox(obj, Vec3);
    if (!box || !parent) return null;
    parent.updateMatrixWorld(true);
    const worldCenter = new Vec3(
        (box.min.x + box.max.x) * 0.5,
        (box.min.y + box.max.y) * 0.5,
        (box.min.z + box.max.z) * 0.5
    );
    const localCenter = worldCenter.clone();
    parent.worldToLocal(localCenter);

    const pivot = new GroupCtor();
    pivot.position.copy(localCenter);
    parent.add(pivot);

    // Pindahkan obj ke dalam pivot sambil mempertahankan posisi dunia aktualnya
    if (typeof pivot.attach === 'function') {
        pivot.attach(obj);
    } else {
        obj.position.sub(localCenter);
        pivot.add(obj);
    }
    return { pivot, box };
}

function extractBakedWheelsGeneric(root, Vec3, GroupCtor, MeshCtor, GeomCtor, AttrCtor) {
    const wheels = [];
    root.updateMatrixWorld(true);
    const invRoot = root.matrixWorld.clone().invert();

    const meshes = [];
    root.traverse((c) => {
        if (c.isMesh && c.geometry && c.geometry.attributes && c.geometry.attributes.position) {
            meshes.push(c);
        }
    });
    if (meshes.length === 0) return wheels;

    // Langkah 1: Hitung bounding box mobil dalam ruang LOKAL root
    const carMin = new Vec3(Infinity, Infinity, Infinity);
    const carMax = new Vec3(-Infinity, -Infinity, -Infinity);
    const v = new Vec3();
    const meshToRoots = meshes.map((mesh) => invRoot.clone().multiply(mesh.matrixWorld));

    let totalVerts = 0;
    const meshOffsets = [];
    for (let mi = 0; mi < meshes.length; mi++) {
        meshOffsets.push(totalVerts);
        const pos = meshes[mi].geometry.attributes.position;
        totalVerts += pos.count;
        const m2r = meshToRoots[mi];
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i).applyMatrix4(m2r);
            if (v.x < carMin.x) carMin.x = v.x;
            if (v.y < carMin.y) carMin.y = v.y;
            if (v.z < carMin.z) carMin.z = v.z;
            if (v.x > carMax.x) carMax.x = v.x;
            if (v.y > carMax.y) carMax.y = v.y;
            if (v.z > carMax.z) carMax.z = v.z;
        }
    }

    const sizeX = carMax.x - carMin.x;
    const sizeY = carMax.y - carMin.y;
    const sizeZ = carMax.z - carMin.z;
    const longIsZ = sizeZ >= sizeX;
    const W = longIsZ ? sizeX : sizeZ;
    const L = longIsZ ? sizeZ : sizeX;
    const midLat = longIsZ ? (carMin.x + carMax.x) * 0.5 : (carMin.z + carMax.z) * 0.5;
    const midLong = longIsZ ? (carMin.z + carMax.z) * 0.5 : (carMin.x + carMax.x) * 0.5;
    const minY = carMin.y;
    const maxDim = Math.max(sizeX, sizeY, sizeZ, 1e-5);

    // Langkah 2: Connected Components (Union-Find) berbasis posisi 3D terkuantisasi (~1.4 mm)
    // Menyatukan jahitan UV & pecahan chunk Draco untuk tiap ban secara UTUH (0% kopong!),
    // sekaligus memisahkan ban dari wheel brow, sayap depan, sidepod, dan suspensi secara topologis!
    const parent = new Int32Array(totalVerts);
    for (let i = 0; i < totalVerts; i++) parent[i] = i;

    function find(x) {
        let r = x;
        while (parent[r] !== r) r = parent[r];
        while (parent[x] !== r) {
            const nxt = parent[x];
            parent[x] = r;
            x = nxt;
        }
        return r;
    }
    function unite(a, b) {
        const ra = find(a);
        const rb = find(b);
        if (ra !== rb) parent[rb] = ra;
    }

    const qScale = 12000 / maxDim;
    const posMap = new Map();
    for (let mi = 0; mi < meshes.length; mi++) {
        const pos = meshes[mi].geometry.attributes.position;
        const m2r = meshToRoots[mi];
        const off = meshOffsets[mi];
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i).applyMatrix4(m2r);
            const ix = Math.round((v.x - carMin.x) * qScale);
            const iy = Math.round((v.y - carMin.y) * qScale);
            const iz = Math.round((v.z - carMin.z) * qScale);
            const key = ix * 268435456 + iy * 16384 + iz;
            const prev = posMap.get(key);
            const gid = off + i;
            if (prev === undefined) {
                posMap.set(key, gid);
            } else {
                unite(prev, gid);
            }
        }
    }
    posMap.clear();

    // Hubungkan 3 vertex dalam setiap segitiga
    for (let mi = 0; mi < meshes.length; mi++) {
        const geom = meshes[mi].geometry;
        const pos = geom.attributes.position;
        const idx = geom.index;
        const off = meshOffsets[mi];
        const triCount = idx ? Math.floor(idx.count / 3) : Math.floor(pos.count / 3);
        for (let t = 0; t < triCount; t++) {
            const i0 = off + (idx ? idx.getX(t * 3) : t * 3);
            const i1 = off + (idx ? idx.getX(t * 3 + 1) : t * 3 + 1);
            const i2 = off + (idx ? idx.getX(t * 3 + 2) : t * 3 + 2);
            unite(i0, i1);
            unite(i0, i2);
        }
    }

    // Langkah 3: Hitung bounding box & jumlah segitiga tiap Connected Component
    const compStats = new Map();
    for (let mi = 0; mi < meshes.length; mi++) {
        const geom = meshes[mi].geometry;
        const pos = geom.attributes.position;
        const idx = geom.index;
        const m2r = meshToRoots[mi];
        const off = meshOffsets[mi];
        const triCount = idx ? Math.floor(idx.count / 3) : Math.floor(pos.count / 3);
        for (let t = 0; t < triCount; t++) {
            const li0 = idx ? idx.getX(t * 3) : t * 3;
            const li1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
            const li2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
            const cid = find(off + li0);
            let st = compStats.get(cid);
            if (!st) {
                st = {
                    cid, triCount: 0,
                    minLat: Infinity, maxLat: -Infinity,
                    minY: Infinity, maxY: -Infinity,
                    minLng: Infinity, maxLng: -Infinity
                };
                compStats.set(cid, st);
            }
            st.triCount++;
            const lis = [li0, li1, li2];
            for (let k = 0; k < 3; k++) {
                v.fromBufferAttribute(pos, lis[k]).applyMatrix4(m2r);
                const lat = longIsZ ? v.x : v.z;
                const lng = longIsZ ? v.z : v.x;
                if (lat < st.minLat) st.minLat = lat;
                if (lat > st.maxLat) st.maxLat = lat;
                if (v.y < st.minY) st.minY = v.y;
                if (v.y > st.maxY) st.maxY = v.y;
                if (lng < st.minLng) st.minLng = lng;
                if (lng > st.maxLng) st.maxLng = lng;
            }
        }
    }

    // Langkah 4: Pilih tepat 4 komponen BAN UTAMA (1 per kuadran FL/FR/RL/RR)
    const quadBest = [null, null, null, null];
    compStats.forEach((st) => {
        if (st.triCount < 35) return;
        const sY = st.maxY - st.minY;
        const sLng = st.maxLng - st.minLng;
        const sLat = st.maxLat - st.minLat;
        if (sY < 0.065 * L || sY > 0.22 * L) return;
        const aspect = sY / Math.max(sLng, 1e-5);
        if (aspect < 0.78 || aspect > 1.28) return;
        if (sLat < 0.04 * W || sLat > 0.30 * W) return;
        if (st.minY > minY + 0.12 * sizeY) return;
        const cLat = (st.minLat + st.maxLat) * 0.5;
        const cLng = (st.minLng + st.maxLng) * 0.5;
        const dLat = cLat - midLat;
        const dLng = cLng - midLong;
        const outerAbs = Math.max(Math.abs(st.minLat - midLat), Math.abs(st.maxLat - midLat));
        if (outerAbs < 0.41 * W) return;

        const qIdx = (dLng >= 0 ? 2 : 0) + (dLat >= 0 ? 1 : 0);
        if (!quadBest[qIdx] || st.triCount > quadBest[qIdx].triCount) {
            quadBest[qIdx] = st;
        }
    });

    const validZones = [];
    const compToZone = new Map();
    const quadToZone = [null, null, null, null];

    for (let qi = 0; qi < 4; qi++) {
        const tire = quadBest[qi];
        if (!tire) continue;
        const cLat = (tire.minLat + tire.maxLat) * 0.5;
        const cY = (tire.minY + tire.maxY) * 0.5;
        const cLng = (tire.minLng + tire.maxLng) * 0.5;
        const r = Math.max((tire.maxY - tire.minY) * 0.5, (tire.maxLng - tire.minLng) * 0.5);
        const zIdx = validZones.length;
        const zone = {
            qi,
            isMirrorFallback: false,
            tireCid: tire.cid,
            side: (cLat >= midLat) ? 1 : -1,
            center: longIsZ ? new Vec3(cLat, cY, cLng) : new Vec3(cLng, cY, cLat),
            cLat, cY, cLng, r,
            minLat: tire.minLat, maxLat: tire.maxLat,
            minY: tire.minY, maxY: tire.maxY,
            minLng: tire.minLng, maxLng: tire.maxLng,
            axisVec: longIsZ ? new Vec3(1, 0, 0) : new Vec3(0, 0, 1),
            trisByMat: new Map()
        };
        validZones.push(zone);
        quadToZone[qi] = zone;
        compToZone.set(tire.cid, zIdx);
    }

    // Jika 1 dari 4 kuadran tidak terdeteksi sebagai komponen terpisah (mis. menempel 1 vertex ke hub di AMR23),
    // cerminkan geometri eksak dari ban sisi seberangnya (kiri <-> kanan) agar keempat roda selalu berputar!
    for (let qi = 0; qi < 4; qi++) {
        if (quadToZone[qi]) continue;
        const opp = quadToZone[qi ^ 1];
        if (!opp) continue;
        const mSide = -opp.side;
        const mCLat = 2 * midLat - opp.cLat;
        const mMinLat = 2 * midLat - opp.maxLat;
        const mMaxLat = 2 * midLat - opp.minLat;
        const zone = {
            qi,
            isMirrorFallback: true,
            tireCid: -1,
            side: mSide,
            center: longIsZ ? new Vec3(mCLat, opp.cY, opp.cLng) : new Vec3(opp.cLng, opp.cY, mCLat),
            cLat: mCLat, cY: opp.cY, cLng: opp.cLng, r: opp.r,
            minLat: mMinLat, maxLat: mMaxLat,
            minY: opp.minY, maxY: opp.maxY,
            minLng: opp.minLng, maxLng: opp.maxLng,
            axisVec: longIsZ ? new Vec3(1, 0, 0) : new Vec3(0, 0, 1),
            trisByMat: new Map()
        };
        validZones.push(zone);
        quadToZone[qi] = zone;
    }

    // Langkah 4B: Hitung pusat lingkaran ban (cY, cLng) super presisi dengan 36-Bin Opposite-Pair Median
    // 100% kebal terhadap kepadatan vertex tidak merata, tapak rata (flat-spot), dan tonjolan kecil -> 0mm goyang!
    // Sumbu putar selalu memakai sumbu kanonik murni ('x' atau 'z') seperti RB19 & Ferrari agar tidak oleng!
    const tireVertsByZone = validZones.map(() => []);
    for (let mi = 0; mi < meshes.length; mi++) {
        const pos = meshes[mi].geometry.attributes.position;
        const m2r = meshToRoots[mi];
        const off = meshOffsets[mi];
        for (let i = 0; i < pos.count; i++) {
            const zIdx = compToZone.get(find(off + i));
            if (zIdx !== undefined) {
                v.fromBufferAttribute(pos, i).applyMatrix4(m2r);
                tireVertsByZone[zIdx].push(v.x, v.y, v.z);
            }
        }
    }

    for (let zi = 0; zi < validZones.length; zi++) {
        const z = validZones[zi];
        const pts = tireVertsByZone[zi];
        const n = Math.floor(pts.length / 3);
        if (n < 36) continue;

        const bins = 36;
        const maxR2 = new Float64Array(bins);
        const binY = new Float64Array(bins);
        const binL = new Float64Array(bins);
        maxR2.fill(-1);

        const cy0 = z.cY;
        const cl0 = z.cLng;
        for (let i = 0; i < n; i++) {
            const py = pts[i * 3 + 1];
            const pl = longIsZ ? pts[i * 3 + 2] : pts[i * 3];
            const dy = py - cy0;
            const dl = pl - cl0;
            const r2 = dy * dy + dl * dl;
            const ang = Math.atan2(dy, dl) + Math.PI;
            let k = Math.floor((ang / (2 * Math.PI)) * bins);
            if (k < 0) k = 0;
            if (k >= bins) k = bins - 1;
            if (r2 > maxR2[k]) {
                maxR2[k] = r2;
                binY[k] = py;
                binL[k] = pl;
            }
        }

        const midYs = [], midLs = [];
        for (let k = 0; k < 18; k++) {
            if (maxR2[k] > 0 && maxR2[k + 18] > 0) {
                midYs.push((binY[k] + binY[k + 18]) * 0.5);
                midLs.push((binL[k] + binL[k + 18]) * 0.5);
            }
        }
        if (midYs.length >= 8) {
            midYs.sort((a, b) => a - b);
            midLs.sort((a, b) => a - b);
            const medY = midYs[Math.floor(midYs.length / 2)];
            const medL = midLs[Math.floor(midLs.length / 2)];
            if (Math.hypot(medY - z.cY, medL - z.cLng) < 0.20 * z.r) {
                z.cY = medY;
                z.cLng = medL;
                z.center = longIsZ ? new Vec3(z.cLat, z.cY, z.cLng) : new Vec3(z.cLng, z.cY, z.cLat);
            }
        }
    }

    // Jika ada kuadran mirror-fallback, sinkronkan pusat (cY, cLng) eksak dari ban sisi seberang
    for (const z of validZones) {
        if (!z.isMirrorFallback) continue;
        const opp = quadToZone[z.qi ^ 1];
        if (opp) {
            z.cY = opp.cY;
            z.cLng = opp.cLng;
            z.center = longIsZ ? new Vec3(z.cLat, z.cY, z.cLng) : new Vec3(z.cLng, z.cY, z.cLat);
        }
    }

    // Langkah 5: Gabungkan komponen velg / wheel cover / logo Pirelli yang berada 100% DI DALAM kotak ban
    if (validZones.length > 0) {
        compStats.forEach((st) => {
            if (compToZone.has(st.cid)) return;
            for (let zi = 0; zi < validZones.length; zi++) {
                const z = validZones[zi];
                if (z.isMirrorFallback) continue;
                const tolR = z.r * 0.025;
                const tolLatIn = 0.004 * W;
                const tolLatOut = 0.015 * W;
                const latOk = z.side > 0
                    ? (st.minLat >= z.minLat - tolLatIn && st.maxLat <= z.maxLat + tolLatOut)
                    : (st.minLat >= z.minLat - tolLatOut && st.maxLat <= z.maxLat + tolLatIn);
                if (latOk &&
                    st.minY >= z.minY - tolR && st.maxY <= z.maxY + tolR &&
                    st.minLng >= z.minLng - tolR && st.maxLng <= z.maxLng + tolR) {
                    compToZone.set(st.cid, zi);
                    break;
                }
            }
        });
    }

    if (validZones.length === 0) return wheels;

    const mirrorZones = validZones
        .map((z, idx) => ({ z, idx }))
        .filter((item) => item.z.isMirrorFallback);

    function classifyMirrorPoint(pt) {
        const lat = longIsZ ? pt.x : pt.z;
        const lng = longIsZ ? pt.z : pt.x;
        for (let i = 0; i < mirrorZones.length; i++) {
            const { z, idx } = mirrorZones[i];
            const tolLatIn = 0.003 * W;
            const tolLatOut = 0.015 * W;
            const inLat = z.side > 0
                ? (lat >= z.minLat + tolLatIn && lat <= z.maxLat + tolLatOut)
                : (lat >= z.minLat - tolLatOut && lat <= z.maxLat - tolLatIn);
            if (!inLat) continue;
            const dY = pt.y - z.cY;
            const dLng = lng - z.cLng;
            const maxR = z.r * 1.025;
            if (dY * dY + dLng * dLng <= maxR * maxR) return idx;
        }
        return -1;
    }

    const v0 = new Vec3(), v1 = new Vec3(), v2 = new Vec3();
    const n0 = new Vec3();

    // Langkah 6: Pindahkan 100% segitiga tiap komponen roda ke Pivot Group lokal root (0mm geser, 0% kopong!)
    for (let mi = 0; mi < meshes.length; mi++) {
        const mesh = meshes[mi];
        const m2r = meshToRoots[mi];
        const geom = mesh.geometry;
        const pos = geom.attributes.position;
        const norm = geom.attributes.normal;
        const uv = geom.attributes.uv;
        const idx = geom.index;
        const off = meshOffsets[mi];
        const triCount = idx ? Math.floor(idx.count / 3) : Math.floor(pos.count / 3);

        const chassisIdx = [];
        let movedAny = false;

        for (let t = 0; t < triCount; t++) {
            const i0 = idx ? idx.getX(t * 3) : t * 3;
            const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
            const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;

            let zIdx = compToZone.get(find(off + i0));
            let vertsLoaded = false;

            if (zIdx === undefined && mirrorZones.length > 0) {
                v0.fromBufferAttribute(pos, i0).applyMatrix4(m2r);
                v1.fromBufferAttribute(pos, i1).applyMatrix4(m2r);
                v2.fromBufferAttribute(pos, i2).applyMatrix4(m2r);
                vertsLoaded = true;
                const m0 = classifyMirrorPoint(v0);
                if (m0 >= 0 && classifyMirrorPoint(v1) === m0 && classifyMirrorPoint(v2) === m0) {
                    zIdx = m0;
                }
            }

            if (zIdx !== undefined) {
                movedAny = true;
                const z = validZones[zIdx];
                if (!vertsLoaded) {
                    v0.fromBufferAttribute(pos, i0).applyMatrix4(m2r);
                    v1.fromBufferAttribute(pos, i1).applyMatrix4(m2r);
                    v2.fromBufferAttribute(pos, i2).applyMatrix4(m2r);
                }

                let bucket = z.trisByMat.get(mesh.material);
                if (!bucket) {
                    bucket = { pos: [], norm: [], uv: [], hasNorm: !!norm, hasUv: !!uv };
                    z.trisByMat.set(mesh.material, bucket);
                }
                const verts = [v0, v1, v2];
                const inds = [i0, i1, i2];
                for (let k = 0; k < 3; k++) {
                    bucket.pos.push(
                        verts[k].x - z.center.x,
                        verts[k].y - z.center.y,
                        verts[k].z - z.center.z
                    );
                    if (norm) {
                        n0.fromBufferAttribute(norm, inds[k]).transformDirection(m2r);
                        bucket.norm.push(n0.x, n0.y, n0.z);
                    }
                    if (uv) {
                        bucket.uv.push(uv.getX(inds[k]), uv.getY(inds[k]));
                    }
                }
            } else {
                chassisIdx.push(i0, i1, i2);
            }
        }

        if (movedAny) {
            geom.setIndex(chassisIdx);
        }
    }

    // Langkah 7: Pasang 4 Pivot Group roda tepat di as roda lokal root (skala 1:1)
    // + Auto-simetri lateral: jika salah satu ban (mis. kiri depan AMR23) lebih keluar dari sisi seberangnya,
    // rapatkan ban yang lebih keluar ke jarak simetris terhadap garis tengah sasis!
    let topMinLat = Infinity, topMaxLat = -Infinity;
    for (let mi = 0; mi < meshes.length; mi++) {
        const pos = meshes[mi].geometry.attributes.position;
        const m2r = meshToRoots[mi];
        for (let i = 0; i < pos.count; i++) {
            v.fromBufferAttribute(pos, i).applyMatrix4(m2r);
            if (v.y >= minY + 0.68 * sizeY) {
                const lat = longIsZ ? v.x : v.z;
                if (lat < topMinLat) topMinLat = lat;
                if (lat > topMaxLat) topMaxLat = lat;
            }
        }
    }
    const chassisMidLat = (Number.isFinite(topMinLat) && Number.isFinite(topMaxLat))
        ? (topMinLat + topMaxLat) * 0.5
        : midLat;

    const zonePivots = new Map();
    for (const z of validZones) {
        if (z.trisByMat.size === 0) continue;
        const pivot = new GroupCtor();
        pivot.position.copy(z.center);

        z.trisByMat.forEach((bucket, mat) => {
            const g = new GeomCtor();
            g.setAttribute('position', new AttrCtor(new Float32Array(bucket.pos), 3));
            if (bucket.hasNorm && bucket.norm.length > 0) {
                g.setAttribute('normal', new AttrCtor(new Float32Array(bucket.norm), 3));
            } else {
                g.computeVertexNormals();
            }
            if (bucket.hasUv && bucket.uv.length > 0) {
                g.setAttribute('uv', new AttrCtor(new Float32Array(bucket.uv), 2));
            }
            const wMesh = new MeshCtor(g, mat);
            wMesh.castShadow = true;
            wMesh.receiveShadow = true;
            pivot.add(wMesh);
        });

        root.add(pivot);
        zonePivots.set(z.qi, { z, pivot });
        wheels.push({ pivot, axis: longIsZ ? 'x' : 'z', dir: 1 });
    }

    // Rapatkan pasangan roda kiri-kanan (belakang: 0&1, depan: 2&3) jika ada celah asimetris pada model asli
    const latAxis = longIsZ ? 'x' : 'z';
    for (const [qL, qR] of [[0, 1], [2, 3]]) {
        const left = zonePivots.get(qL);
        const right = zonePivots.get(qR);
        if (!left || !right) continue;
        const distL = Math.abs(left.z.cLat - chassisMidLat);
        const distR = Math.abs(right.z.cLat - chassisMidLat);
        const diff = Math.abs(distL - distR);
        if (diff > 0.002 * W && diff < 0.045 * W) {
            if (distL > distR) {
                left.pivot.position[latAxis] = chassisMidLat + Math.sign(left.z.cLat - chassisMidLat) * distR;
            } else {
                right.pivot.position[latAxis] = chassisMidLat + Math.sign(right.z.cLat - chassisMidLat) * distL;
            }
        }
    }

    return wheels;
}

function setupARWheelSpin() {
    stopARWheelSpin();
    if (!mainViewer || !currentActiveModel) return;
    try {
        const sceneSym = Object.getOwnPropertySymbols(mainViewer).find((s) => s.description === 'scene');
        if (!sceneSym) return;
        const mvScene = mainViewer[sceneSym];
        if (!mvScene || !mvScene.model) return;

        const root = mvScene.model;
        let sampleMesh = null;
        root.traverse((c) => { if (!sampleMesh && c.isMesh) sampleMesh = c; });
        if (!sampleMesh) return;

        const Vec3 = sampleMesh.position.constructor;
        const GroupCtor = root.constructor;
        const MeshCtor = sampleMesh.constructor;
        const GeomCtor = sampleMesh.geometry.constructor;
        const AttrCtor = sampleMesh.geometry.attributes.position.constructor;

        const pivots = [];

        if (currentActiveModel === 'ferrari') {
            const wheelNodes = [];
            root.traverse((c) => {
                if (c.name && /^WHEEL_(LF|RF|LR|RR)/i.test(c.name)) wheelNodes.push(c);
            });
            wheelNodes.forEach((wn) => {
                const res = repivotARObject(wn, wn.parent, Vec3, GroupCtor);
                if (res) pivots.push({ pivot: res.pivot, axis: 'x', dir: 1 });
            });
        } else if (currentActiveModel === 'ducati') {
            const wheelMeshes = [];
            root.traverse((c) => {
                if (c.isMesh && c.material && c.material.name === 'Part8_Mat') wheelMeshes.push(c);
            });
            wheelMeshes.forEach((wm) => {
                const res = repivotARObject(wm, wm.parent, Vec3, GroupCtor);
                if (res) {
                    // Dalam ruang lokal parent Ducati, poros as roda selalu sumbu X (lebar terkecil)
                    pivots.push({ pivot: res.pivot, axis: 'x', dir: 1 });
                }
            });
        } else {
            const baked = extractBakedWheelsGeneric(root, Vec3, GroupCtor, MeshCtor, GeomCtor, AttrCtor);
            pivots.push(...baked);
        }

        if (pivots.length > 0) {
            arWheelPivots = pivots;
            arWheelScene = mvScene;
            arWheelLastTime = performance.now();
            const spinLoop = (now) => {
                if (!arWheelScene || arWheelPivots.length === 0) return;
                const dt = Math.min(0.05, (now - arWheelLastTime) / 1000);
                arWheelLastTime = now;
                const spinStep = dt * 11.5; // Putaran roda stabil seperti mobil melaju
                for (let i = 0; i < arWheelPivots.length; i++) {
                    const w = arWheelPivots[i];
                    if (w.axisVec && typeof w.pivot.rotateOnAxis === 'function') {
                        w.pivot.rotateOnAxis(w.axisVec, spinStep * w.dir);
                    } else {
                        w.pivot.rotation[w.axis] += spinStep * w.dir;
                    }
                }
                if (typeof arWheelScene.queueRender === 'function') {
                    arWheelScene.queueRender();
                }
                arWheelRaf = requestAnimationFrame(spinLoop);
            };
            arWheelRaf = requestAnimationFrame(spinLoop);
            console.log(`🛞 Animasi roda berputar aktif (${pivots.length} roda) di AR Viewer!`);
        }
    } catch (e) {
        console.warn('AR wheel spin skipped:', e);
    }
}

function showLoader(vehicleName) {
    if (modelLoader) {
        if (loaderText) loaderText.innerText = `Memuat ${vehicleName || 'Model 3D'}... 0%`;
        modelLoader.classList.add('show');
    }
}

function hideLoader() {
    if (modelLoader) {
        modelLoader.classList.remove('show');
    }
}

// Mengunduh Model 3D hingga 100% Selesai Sebelum Membunyikan Suara
async function ensureModelPreloaded(key) {
    if (loadedModelKeys.has(key)) return;
    const data = VEHICLES[key];
    if (!data || !data.src) return;

    showLoader(data.name);

    try {
        const response = await fetch(data.src);
        if (!response.ok) throw new Error('Fetch failed');

        const contentLength = +response.headers.get('Content-Length');
        const reader = response.body ? response.body.getReader() : null;

        if (reader && contentLength) {
            let received = 0;
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                received += value.length;
                const pct = Math.min(100, Math.round((received / contentLength) * 100));
                if (loaderText) {
                    loaderText.innerText = `Memuat ${data.name}... ${pct}%`;
                }
            }
        }
        loadedModelKeys.add(key);
    } catch (e) {
        console.warn('Preload fetch fallback:', e);
        loadedModelKeys.add(key);
    } finally {
        hideLoader();
    }
}

// Kontrol Suara (Mute / Unmute)
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btns = document.querySelectorAll('.sound-toggle-btn');
    btns.forEach(b => b.innerText = soundEnabled ? '🔊' : '🔇');
    showToast(soundEnabled ? 'Suara & Musik F1: Aktif 🔊' : 'Suara Dimatikan 🔇', soundEnabled ? '🔊' : '🔇');
    if (soundEnabled) {
        unlockAudio();
        if (currentActiveModel) {
            // Saat model mobil muncul, hanya mainkan sound mesin mobil
            if (VEHICLES[currentActiveModel] && VEHICLES[currentActiveModel].sound) {
                startCarEngineSound(VEHICLES[currentActiveModel].sound);
            }
        } else {
            // Di tampilan awal scanner sebelum scan, mainkan F1 Theme Song
            startF1Theme();
        }
    } else {
        stopF1Theme(false);
        stopCarEngineSound(false);
    }
}

// Auto-unlock AudioContext & HTML5 Audio untuk aturan Autoplay Policy browser HP
function unlockAudio() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // Pre-warm audio elements agar instan saat dimainkan
        const themeEl = document.getElementById('snd-f1-theme');
        const engEl = document.getElementById('snd-car-engine');
        if (themeEl && themeEl.paused) { themeEl.load(); }
        if (engEl && engEl.paused) { engEl.load(); }

        // Jika di tampilan awal scanner dan belum ada mobil aktif, mulai putar F1 Theme Song
        if (!currentActiveModel && soundEnabled) {
            startF1Theme();
        }
    } catch (e) {}
}
window.addEventListener('click', unlockAudio, { passive: true });
window.addEventListener('touchstart', unlockAudio, { passive: true });

// Memutar Theme Song Resmi Formula 1 (Brian Tyler) di Tampilan Awal Scanner
function startF1Theme() {
    if (!soundEnabled || currentActiveModel) return; // Tidak diputar jika model 3D mobil sedang aktif
    const themeEl = document.getElementById('snd-f1-theme');
    if (!themeEl) return;

    if (themeFadeTimer) {
        clearInterval(themeFadeTimer);
        themeFadeTimer = null;
    }

    try {
        themeEl.volume = 0.05;
        const playPromise = themeEl.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Smooth fade-in volume ke ~0.55 agar terdengar megah dan tidak bising
                let vol = 0.05;
                themeFadeTimer = setInterval(() => {
                    vol += 0.05;
                    if (vol >= 0.55) {
                        vol = 0.55;
                        clearInterval(themeFadeTimer);
                        themeFadeTimer = null;
                    }
                    themeEl.volume = vol;
                }, 50);
            }).catch(e => {
                console.log('Autoplay audio theme prevented:', e);
            });
        }
    } catch (e) {
        console.warn('F1 theme play error:', e);
    }
}

// Menghentikan Theme Song Formula 1 dengan Fade Out
function stopF1Theme(fadeOut = true) {
    const themeEl = document.getElementById('snd-f1-theme');
    if (!themeEl) return;

    if (themeFadeTimer) {
        clearInterval(themeFadeTimer);
        themeFadeTimer = null;
    }

    if (!fadeOut) {
        themeEl.pause();
        themeEl.currentTime = 0;
        return;
    }

    let vol = themeEl.volume;
    themeFadeTimer = setInterval(() => {
        vol -= 0.1;
        if (vol <= 0.02) {
            themeEl.pause();
            themeEl.currentTime = 0;
            themeEl.volume = 0.55;
            clearInterval(themeFadeTimer);
            themeFadeTimer = null;
        } else {
            themeEl.volume = vol;
        }
    }, 35);
}

let engineFadeTimer = null;

// Memutar Sound Mesin Asli Khusus Mobil F1 (Red Bull, Ferrari, Mercedes, Aston Martin)
function startCarEngineSound(soundUrl) {
    if (!soundEnabled || !soundUrl) return;
    const engEl = document.getElementById('snd-car-engine');
    if (!engEl) return;

    if (engineFadeTimer) {
        clearInterval(engineFadeTimer);
        engineFadeTimer = null;
    }

    try {
        // Pasang file audio mobil spesifik jika berbeda
        if (!engEl.src.endsWith(soundUrl.replace(/^\.\//, ''))) {
            engEl.src = soundUrl;
            engEl.load();
        }
        engEl.currentTime = 0;
        engEl.volume = 0.05;
        const playPromise = engEl.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                let vol = 0.05;
                engineFadeTimer = setInterval(() => {
                    vol += 0.05;
                    if (vol >= 0.65) {
                        vol = 0.65;
                        clearInterval(engineFadeTimer);
                        engineFadeTimer = null;
                    }
                    engEl.volume = vol;
                }, 50);
            }).catch(e => {
                console.log('Autoplay car engine sound prevented:', e);
            });
        }
    } catch (e) {
        console.warn('Car engine sound error:', e);
    }
}

// Menghentikan Sound Mesin Mobil dengan Fade Out Halus
function stopCarEngineSound(fadeOut = true) {
    const engEl = document.getElementById('snd-car-engine');
    if (!engEl) return;

    if (engineFadeTimer) {
        clearInterval(engineFadeTimer);
        engineFadeTimer = null;
    }

    if (!fadeOut) {
        engEl.pause();
        engEl.currentTime = 0;
        return;
    }

    let vol = engEl.volume;
    engineFadeTimer = setInterval(() => {
        vol -= 0.1;
        if (vol <= 0.04) {
            engEl.pause();
            engEl.currentTime = 0;
            engEl.volume = 0.65;
            clearInterval(engineFadeTimer);
            engineFadeTimer = null;
        } else {
            engEl.volume = vol;
        }
    }, 30);
}

// Mengatur Suara Mobil Formula 1 Saat Model Masuk / Keluar
function playF1EngineSound(type = 'in', vehicleKey = null) {
    if (!soundEnabled) return;
    unlockAudio();

    // Putar sound mesin mobil autentik jika mobil masuk
    if (type === 'in' && vehicleKey && VEHICLES[vehicleKey] && VEHICLES[vehicleKey].sound) {
        startCarEngineSound(VEHICLES[vehicleKey].sound);
    } else if (type === 'out') {
        stopCarEngineSound(true);
    }

    // Haptic Feedback / Getaran Ponsel
    if (navigator.vibrate) {
        try {
            if (type === 'in') {
                navigator.vibrate([60, 40, 100, 50, 150]);
            } else {
                navigator.vibrate([100, 40, 180]);
            }
        } catch (e) {}
    }
}

// Memicu Efek Visual Kecepatan & Getaran Layar
function triggerSpeedFx() {
    const fx = document.getElementById('speed-fx');
    if (fx) {
        fx.classList.remove('active');
        void fx.offsetWidth;
        fx.classList.add('active');
        setTimeout(() => fx.classList.remove('active'), 650);
    }
    document.body.classList.remove('rumble');
    void document.body.offsetWidth;
    document.body.classList.add('rumble');
    setTimeout(() => document.body.classList.remove('rumble'), 380);
}

// Tampilkan Notifikasi Toast
function showToast(msg, icon = '🏎️') {
    const toast = document.getElementById('toast');
    document.getElementById('toast-msg').innerText = msg;
    document.getElementById('toast-icon').innerText = icon;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Detector Native Barcode (Hardware acceleration pada browser modern)
let barcodeDetector = null;
if ('BarcodeDetector' in window) {
    try {
        barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });
        console.log('⚡ Native Hardware BarcodeDetector aktif!');
    } catch (e) {
        barcodeDetector = null;
    }
}

let isProcessingFrame = false;
let torchActive = false;

function checkTorchSupport() {
    if (!videoStream) return;
    const track = videoStream.getVideoTracks()[0];
    const capabilities = track.getCapabilities ? track.getCapabilities() : {};
    const torchBtn = document.getElementById('torch-btn');
    if (torchBtn) {
        torchBtn.style.display = capabilities.torch ? 'flex' : 'none';
    }
}

async function toggleTorch() {
    if (!videoStream) return;
    const track = videoStream.getVideoTracks()[0];
    try {
        torchActive = !torchActive;
        await track.applyConstraints({
            advanced: [{ torch: torchActive }]
        });
        const torchBtn = document.getElementById('torch-btn');
        if (torchBtn) {
            torchBtn.innerText = torchActive ? '💡' : '🔦';
            torchBtn.style.background = torchActive ? '#eab308' : 'rgba(15, 23, 42, 0.85)';
        }
    } catch (e) {
        console.log('Torch error:', e);
    }
}

function flashReticle() {
    const reticle = document.querySelector('.reticle-container');
    if (reticle) {
        reticle.classList.add('locked');
        setTimeout(() => reticle.classList.remove('locked'), 500);
    }
}

// Tampilkan / Sembunyikan Layar Izin Kamera (AR Explorer Style)
function showCameraPermissionScreen(errorMsg = '') {
    const screen = document.getElementById('camera-permission-screen');
    const note = document.getElementById('camera-perm-note');
    if (screen) screen.classList.remove('hidden');
    if (note) {
        if (errorMsg) {
            note.innerText = errorMsg;
            note.classList.add('show');
        } else {
            note.innerText = '';
            note.classList.remove('show');
        }
    }
}

function hideCameraPermissionScreen() {
    const screen = document.getElementById('camera-permission-screen');
    const note = document.getElementById('camera-perm-note');
    if (screen) screen.classList.add('hidden');
    if (note) {
        note.innerText = '';
        note.classList.remove('show');
    }
}

async function requestCameraAndStart() {
    unlockAudio();
    const ok = await startCamera();
    if (ok && !currentActiveModel && soundEnabled) {
        startF1Theme();
    }
}

// Menyalakan Kamera HP dengan Continuous Autofocus & Macro
async function startCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(t => t.stop());
        videoStream = null;
    }

    try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error('Browser tidak mendukung akses kamera.');
        }
        const constraints = {
            video: {
                facingMode: currentFacingMode,
                width: { ideal: 1280, min: 640 },
                height: { ideal: 720, min: 480 },
                advanced: [
                    { focusMode: 'continuous' },
                    { exposureMode: 'continuous' }
                ]
            },
            audio: false
        };
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
        await video.play();

        hideCameraPermissionScreen();
        try { localStorage.setItem('webar_camera_granted', '1'); } catch (e) {}

        // Cek ketersediaan tombol lampu senter / torch
        checkTorchSupport();

        isScanning = true;
        requestAnimationFrame(scanLoop);
        return true;
    } catch (err) {
        console.warn('Camera error:', err);
        try { localStorage.removeItem('webar_camera_granted'); } catch (e) {}
        showCameraPermissionScreen('Akses kamera belum diizinkan. Mohon izinkan kamera pada browser Anda lalu tekan tombol di bawah.');
        return false;
    }
}

function switchCamera() {
    currentFacingMode = (currentFacingMode === 'environment') ? 'user' : 'environment';
    startCamera();
}

// Loop Deteksi QR Code di Kamera (Dual-Engine: Native Hardware BarcodeDetector + jsQR Optimized)
async function scanLoop() {
    if (!isScanning) return;

    if (!isTransitioning && !isProcessingFrame && video.readyState === video.HAVE_ENOUGH_DATA) {
        isProcessingFrame = true;
        let detectedData = null;

        // 1. STRATEGI UTAMA: Hardware BarcodeDetector (Paling Akurat & Super Cepat ~5ms untuk Kertas Print)
        if (barcodeDetector) {
            try {
                const barcodes = await barcodeDetector.detect(video);
                if (barcodes && barcodes.length > 0) {
                    detectedData = barcodes[0].rawValue;
                }
            } catch (e) {
                // fallback ke jsQR jika detector browser mengalami kendala
            }
        }

        // 2. STRATEGI KEDUA: jsQR dengan Downscaling & Center-Crop Khusus Kertas Print
        if (!detectedData) {
            // Batasi resolusi maksimal ke 640px agar ringan 60fps & peka terhadap kertas print
            const maxDim = 640;
            const sw = video.videoWidth;
            const sh = video.videoHeight;
            const scale = Math.min(1, maxDim / Math.max(sw, sh));

            canvas.width = Math.floor(sw * scale);
            canvas.height = Math.floor(sh * scale);
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // A. Prioritas: Scan area tengah (area kotak bidik reticle)
            // Mengisolasi satu QR code yang sedang dibidik di antara beberapa QR pada kertas print
            const cropSize = Math.floor(Math.min(canvas.width, canvas.height) * 0.7);
            const cropX = Math.floor((canvas.width - cropSize) / 2);
            const cropY = Math.floor((canvas.height - cropSize) / 2);

            const centerImgData = ctx.getImageData(cropX, cropY, cropSize, cropSize);
            let code = jsQR(centerImgData.data, centerImgData.width, centerImgData.height, {
                inversionAttempts: 'attemptBoth'
            });

            // B. Jika tidak ditemukan di kotak tengah, scan keseluruhan layar
            if (!code) {
                const fullImgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                code = jsQR(fullImgData.data, fullImgData.width, fullImgData.height, {
                    inversionAttempts: 'attemptBoth'
                });
            }

            if (code && code.data) {
                detectedData = code.data;
            }
        }

        // Jika terdeteksi QR Code kendaraan
        if (detectedData) {
            const now = Date.now();
            const matchedKey = resolveModelKey(detectedData);

            if (matchedKey && VEHICLES[matchedKey]) {
                // Feedback visual: Kotak bidik menyala hijau seketika
                flashReticle();

                // Jalankan pergantian mobil jika berbeda dari yang sedang aktif
                if (matchedKey !== currentActiveModel) {
                    if (detectedData !== lastScannedText || (now - lastScanTime) > 1000) {
                        lastScannedText = detectedData;
                        lastScanTime = now;
                        switchVehicleTo(matchedKey);
                    }
                }
            }
        }

        isProcessingFrame = false;
    }

    requestAnimationFrame(scanLoop);
}

// Mengatur Transisi Pergantian Mobil (Tunggu 100% Terload Baru Muncul Suara Keluar & Masuk)
async function switchVehicleTo(newKey) {
    if (!VEHICLES[newKey] || isTransitioning) return;
    if (currentActiveModel === newKey) return;

    isTransitioning = true;
    const oldKey = currentActiveModel;
    const newData = VEHICLES[newKey];

    // 1. JIKA MODEL BELUM 100% TERLOAD, UNDUH HINGGA SELESAI (SUARA BELUM DIBUNYIKAN)
    if (!loadedModelKeys.has(newKey)) {
        await ensureModelPreloaded(newKey);
    }

    // 2. SETELAH 100% SELESAI, BARU JALANKAN SUARA & ANIMASI KELUAR / MASUK
    stopF1Theme(true);
    stopCarEngineSound(true);
    scannerOverlay.style.display = 'none';

    // KASUS 1: Ada mobil lama yang sedang tampil -> Mobil lama melaju keluar dulu dengan suara
    if (oldKey && oldKey !== newKey && mainViewer && mainViewer.classList.contains('active')) {
        console.log(`🚀 Model 100% siap. Mobil ${oldKey} melaju pergi...`);
        updateF1InfoCard(null);

        // BARU MAINKAN SOUND KELUAR
        playF1EngineSound('out');
        triggerSpeedFx();

        mainViewer.autoRotate = false;
        mainViewer.classList.remove('drive-in');
        mainViewer.classList.add('drive-out');

        // Tunggu animasi melaju pergi selesai (~420ms), lalu munculkan mobil baru
        setTimeout(() => {
            mainViewer.classList.remove('active', 'drive-out');

            // Mobil baru melaju masuk ke depan!
            launchNewCar(newKey, newData, true);
        }, 430);
        return;
    }

    // KASUS 2: Scan Pertama Kali (Belum ada mobil aktif)
    launchNewCar(newKey, newData, false);
}

// Meluncurkan Mobil Baru: Melaju Masuk ke Depan Layar Kamera
function launchNewCar(key, data, isSwitching) {
    console.log(`🏎️ Mobil ${key} melaju masuk ke depan!`);
    currentActiveModel = key;

    // Pasang src model yang sudah 100% di-cache
    mainViewer.src = data.src;

    // BARU MAINKAN SOUND FORMULA 1 MASUK
    // Putar sound mesin autentik khusus mobil yang discan (Red Bull, Ferrari, Mercedes, Aston Martin)
    playF1EngineSound('in', key);
    triggerSpeedFx();

    // Perbarui Badge HUD di Atas & Kartu Detail F1 (Khusus Mobil F1, bukan Ducati)
    badgeTitle.innerText = data.name;
    badgeCat.innerText = data.cat;
    modelBadge.style.borderColor = data.color;
    arUiOverlay.style.display = 'flex';
    updateF1InfoCard(data);

    showToast(isSwitching ? `🔄 Ganti ke ${data.name}!` : `🏎️ ${data.name} Melaju Masuk!`);

    // Posisi menghadap depan dan jalankan animasi meluncur masuk
    mainViewer.cameraOrbit = '0deg 75deg 105%';
    mainViewer.autoRotate = false;
    mainViewer.classList.remove('drive-out');
    mainViewer.classList.add('active', 'drive-in');

    // Setelah mobil sampai di depan (780ms), mulai rotasi interaktif 3D (Hanya sound mobil yang aktif)
    setTimeout(() => {
        mainViewer.classList.remove('drive-in');
        mainViewer.autoRotate = true;
        isTransitioning = false;
    }, 780);

    isScanning = true;
}

// Kembali ke Mode Scanner (Mobil Aktif Melaju Pergi Dahulu)
function resetToScanner() {
    if (isTransitioning) return;
    const oldKey = currentActiveModel;

    // Matikan Suara Mesin mobil saat kembali ke scanner
    stopCarEngineSound(true);

    if (oldKey && mainViewer && mainViewer.classList.contains('active')) {
        isTransitioning = true;
        updateF1InfoCard(null);
        playF1EngineSound('out');
        triggerSpeedFx();
        mainViewer.autoRotate = false;
        mainViewer.classList.remove('drive-in');
        mainViewer.classList.add('drive-out');

        setTimeout(() => {
            mainViewer.classList.remove('active', 'drive-out');
            mainViewer.removeAttribute('src'); // Kosongkan VRAM
            finishReset();
        }, 430);
        return;
    }

    finishReset();
}

function finishReset() {
    stopARWheelSpin();
    currentActiveModel = null;
    hideLoader();
    if (mainViewer) {
        mainViewer.classList.remove('active', 'drive-in', 'drive-out');
    }
    arUiOverlay.style.display = 'none';
    updateF1InfoCard(null);
    scannerOverlay.style.display = 'flex';
    lastScannedText = '';
    isScanning = true;
    isTransitioning = false;

    // Kembali ke tampilan awal: nyalakan kembali Theme Song F1
    startF1Theme();

    const url = new URL(window.location);
    url.searchParams.delete('model');
    window.history.replaceState({}, '', url);
}

// Menuju Sirkuit Balap F1 Circuit de Barcelona-Catalunya
function goToCircuit() {
    const key = currentActiveModel || 'redbull';
    window.location.href = `./sirkuit.html?model=${encodeURIComponent(key)}`;
}

// ========================================================
// MODAL DAFTAR MARKER & QR DIGITAL (SIMULASI SCAN LANGSUNG)
// ========================================================
let qrCatalogRendered = false;

function renderQrCatalog() {
    const listEl = document.getElementById('qr-catalog-list');
    if (!listEl || qrCatalogRendered) return;

    const fragment = document.createDocumentFragment();
    Object.entries(VEHICLES).forEach(([key, data]) => {
        const card = document.createElement('div');
        card.className = 'qr-item-card';

        const isMoto = key === 'ducati';
        const safeFilename = `QR_${data.name.replace(/[^A-Za-z0-9]+/g, '_')}.png`;

        card.innerHTML = `
            <div class="qr-item-top">
                <span class="qr-item-name">${data.name}</span>
                <span class="qr-item-tag ${isMoto ? 'motogp' : ''}">${data.tag || 'PATTERN'}</span>
            </div>
            <div class="qr-item-preview">
                <img src="${data.qr}" alt="QR ${data.name}" loading="lazy">
            </div>
            <div class="qr-item-caption">Pindai QR Marker ${data.name}</div>
            <div class="qr-item-actions">
                <a class="qr-btn-download" href="${data.qr}" download="${safeFilename}">Unduh Marker</a>
                <button type="button" class="qr-btn-simulate" onclick="simulateQrScan('${key}')">Simulasi Scan</button>
            </div>
        `;
        fragment.appendChild(card);
    });

    listEl.innerHTML = '';
    listEl.appendChild(fragment);
    qrCatalogRendered = true;
}

function openQrCatalogModal() {
    renderQrCatalog();
    const modal = document.getElementById('qr-catalog-modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeQrCatalogModal() {
    const modal = document.getElementById('qr-catalog-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function simulateQrScan(key) {
    if (!VEHICLES[key]) return;
    unlockAudio();
    closeQrCatalogModal();
    flashReticle();
    switchVehicleTo(key);
}

// Inisialisasi Saat Halaman Dimuat
window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const rawParam = params.get('model') || params.get('mobil') || params.get('car') || '';
    const matchedKey = resolveModelKey(rawParam);

    // Cek status izin kamera terlebih dahulu:
    // Jika sudah pernah diizinkan (via Permissions API atau localStorage) -> langsung nyalakan kamera tanpa memunculkan layar izin!
    // Jika belum dapat akses kamera -> tampilkan layar izin kamera AR Explorer.
    let permState = 'unknown';
    if (navigator.permissions && navigator.permissions.query) {
        try {
            const status = await navigator.permissions.query({ name: 'camera' });
            permState = status.state;
        } catch (e) {
            permState = 'unknown';
        }
    }

    let storedGranted = false;
    try { storedGranted = localStorage.getItem('webar_camera_granted') === '1'; } catch (e) {}

    const alreadyGranted = (permState === 'granted') || (storedGranted && permState !== 'denied');

    if (alreadyGranted) {
        hideCameraPermissionScreen();
        await startCamera();
    } else {
        showCameraPermissionScreen();
    }

    if (matchedKey) {
        setTimeout(() => {
            switchVehicleTo(matchedKey);
        }, 500);
    } else if (alreadyGranted) {
        // Di tampilan awal sebelum discan, putar theme song F1
        startF1Theme();
    }
});

// Registrasi Service Worker PWA untuk Caching Offline Otomatis
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('✅ Service Worker PWA aktif'))
            .catch(e => console.log('SW registration error:', e));
    });
}
