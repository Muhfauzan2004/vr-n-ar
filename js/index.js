// Data Kendaraan Sesuai QR Code (Sumber 3D Model Dinamis / Lazy Loaded)
const VEHICLES = {
    'redbull': {
        name: 'Red Bull Racing RB19',
        cat: 'Oracle Red Bull • Formula 1',
        color: '#0284c7',
        src: './assets/models/redbull_RB19.glb',
        sound: './assets/audio/redbull_sound.mp3',
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
        sound: null
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
        console.log(`✅ Model 3D berhasil dimuat ke GPU!`);
    });

    mainViewer.addEventListener('error', (err) => {
        hideLoader();
        console.warn('Model loading error:', err);
    });
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

// Menyalakan Kamera HP dengan Continuous Autofocus & Macro
async function startCamera() {
    document.getElementById('camera-error').style.display = 'none';
    if (videoStream) {
        videoStream.getTracks().forEach(t => t.stop());
        videoStream = null;
    }

    try {
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

        // Cek ketersediaan tombol lampu senter / torch
        checkTorchSupport();

        isScanning = true;
        requestAnimationFrame(scanLoop);
    } catch (err) {
        console.warn('Camera error:', err);
        document.getElementById('camera-error').style.display = 'flex';
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

// Inisialisasi Saat Halaman Dimuat
window.addEventListener('DOMContentLoaded', () => {
    startCamera();

    const params = new URLSearchParams(window.location.search);
    const rawParam = params.get('model') || params.get('mobil') || params.get('car') || '';
    const matchedKey = resolveModelKey(rawParam);
    if (matchedKey) {
        setTimeout(() => {
            switchVehicleTo(matchedKey);
        }, 500);
    } else {
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
