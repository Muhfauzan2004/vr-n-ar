// Data Kendaraan & Model 3D
        const VEHICLES = {
            'redbull': {
                name: 'Red Bull Racing RB19',
                cat: 'Oracle Red Bull • Formula 1',
                color: '#0284c7',
                src: './assets/models/redbull_RB19.glb',
                sound: './assets/audio/redbull_sound.mp3',
                scale: 1.0,
                yOffset: 0.05,
                year: '2023',
                drivers: 'Max Verstappen & Sergio Pérez'
            },
            'ferrari': {
                name: 'Ferrari F1-75',
                cat: 'Scuderia Ferrari • Formula 1',
                color: '#e11d48',
                src: './assets/models/ferarri_f1-75.glb',
                sound: './assets/audio/ferrari_sound.mp3',
                scale: 1.0,
                yOffset: 0.05,
                year: '2022',
                drivers: 'Charles Leclerc & Carlos Sainz Jr.'
            },
            'mercedes': {
                name: 'Mercedes-AMG F1 W15',
                cat: 'Mercedes-AMG PETRONAS • Formula 1',
                color: '#00a19c',
                src: './assets/models/mercy-w15.glb',
                sound: './assets/audio/mercedes_sound.mp3',
                scale: 1.0,
                yOffset: 0.05,
                year: '2024',
                drivers: 'Lewis Hamilton & George Russell'
            },
            'astonmartin': {
                name: 'Aston Martin AMR23',
                cat: 'Aston Martin Aramco • Formula 1',
                color: '#00594f',
                src: './assets/models/f1-amr23.glb',
                sound: './assets/audio/astonmartin_sound.mp3',
                scale: 1.0,
                yOffset: 0.05,
                year: '2023',
                drivers: 'Fernando Alonso & Lance Stroll'
            },
            'ducati': {
                name: 'Ducati Desmosedici GP',
                cat: 'Ducati Lenovo • MotoGP',
                color: '#f59e0b',
                src: './assets/models/ducati_desmo.glb',
                sound: null,
                scale: 1.1,
                yOffset: 0.08
            }
        };

        // Ambil parameter model mobil dari URL (contoh: ?model=ferrari)
        const urlParams = new URLSearchParams(window.location.search);
        let selectedCarKey = urlParams.get('model') || urlParams.get('mobil') || 'redbull';
        if (!VEHICLES[selectedCarKey]) selectedCarKey = 'redbull';
        const carData = VEHICLES[selectedCarKey];

        // Update HUD Info (Detail spesifikasi F1 hanya ditampilkan di halaman AR, tidak di sirkuit)
        document.getElementById('hud-car-name').innerText = carData.name;
        document.getElementById('hud-car-badge').style.borderColor = carData.color;
        document.getElementById('btn-back').href = `./index.html?model=${selectedCarKey}`;

        const hudF1Meta = document.getElementById('hud-car-f1-meta');
        if (hudF1Meta) {
            hudF1Meta.style.display = 'none';
        }

        // Setup Three.js Scene
        const canvas = document.getElementById('webgl-canvas');
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x060913);
        scene.fog = new THREE.FogExp2(0x060913, 0.0006);

        // Pencahayaan Sirkuit Siang Hari (Barcelona Spanish F1 GP Daylight)
        scene.background = new THREE.Color(0x93c5fd);
        scene.fog = new THREE.FogExp2(0x93c5fd, 0.00035);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
        scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x475569, 0.75);
        scene.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xfffaf0, 1.6);
        sunLight.position.set(300, 500, 250);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 10;
        sunLight.shadow.camera.far = 1500;
        const d = 500;
        sunLight.shadow.camera.left = -d;
        sunLight.shadow.camera.right = d;
        sunLight.shadow.camera.top = d;
        sunLight.shadow.camera.bottom = -d;
        scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.5);
        fillLight.position.set(-300, 300, -250);
        scene.add(fillLight);

        // Kamera & Controls
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 3500);
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.01;
        camera.position.set(185, 12, 181.8);
        controls.target.set(148, 6, 181.8);

        // ========================================================
        // 1. JALUR SIRKUIT BALAP F1 CIRCUIT DE BARCELONA-CATALUNYA
        // ========================================================
        // 183 Koordinat waypoint presisi menyusuri aspal Circuit de Barcelona-Catalunya (~4.7 km loop)
        const trackPoints = [
    new THREE.Vector3(148.86, 5.90, 181.55),
    new THREE.Vector3(123.65, 5.90, 181.51),
    new THREE.Vector3(98.37, 5.90, 181.47),
    new THREE.Vector3(73.58, 5.91, 181.42),
    new THREE.Vector3(48.45, 5.91, 181.38),
    new THREE.Vector3(22.56, 5.86, 181.33),
    new THREE.Vector3(-3.46, 5.69, 181.28),
    new THREE.Vector3(-30.60, 5.42, 181.24),
    new THREE.Vector3(-55.40, 5.14, 181.19),
    new THREE.Vector3(-83.79, 4.79, 181.14),
    new THREE.Vector3(-109.19, 4.41, 181.10),
    new THREE.Vector3(-134.89, 3.92, 181.05),
    new THREE.Vector3(-163.43, 3.30, 181.00),
    new THREE.Vector3(-189.56, 2.70, 180.95),
    new THREE.Vector3(-216.07, 2.05, 180.91),
    new THREE.Vector3(-243.97, 1.38, 180.86),
    new THREE.Vector3(-273.85, 0.75, 180.80),
    new THREE.Vector3(-294.49, 0.36, 180.77),
    new THREE.Vector3(-315.19, 0.02, 180.73),
    new THREE.Vector3(-335.85, -0.28, 180.69),
    new THREE.Vector3(-356.59, -0.54, 180.66),
    new THREE.Vector3(-377.30, -0.78, 180.62),
    new THREE.Vector3(-397.99, -1.02, 180.58),
    new THREE.Vector3(-418.65, -1.27, 180.55),
    new THREE.Vector3(-444.87, -1.59, 180.50),
    new THREE.Vector3(-470.28, -1.91, 179.78),
    new THREE.Vector3(-498.06, -2.13, 177.09),
    new THREE.Vector3(-517.85, -2.20, 161.01),
    new THREE.Vector3(-524.50, -1.97, 132.75),
    new THREE.Vector3(-524.35, -1.44, 104.23),
    new THREE.Vector3(-532.47, -0.75, 80.91),
    new THREE.Vector3(-549.94, 0.15, 62.23),
    new THREE.Vector3(-572.98, 1.23, 51.35),
    new THREE.Vector3(-597.56, 2.43, 41.43),
    new THREE.Vector3(-622.37, 3.64, 31.24),
    new THREE.Vector3(-646.29, 4.81, 20.66),
    new THREE.Vector3(-667.49, 5.97, 5.63),
    new THREE.Vector3(-683.85, 7.08, -13.30),
    new THREE.Vector3(-695.74, 8.13, -36.38),
    new THREE.Vector3(-702.17, 9.05, -60.45),
    new THREE.Vector3(-702.70, 9.86, -85.85),
    new THREE.Vector3(-697.55, 10.56, -110.62),
    new THREE.Vector3(-685.11, 11.23, -137.13),
    new THREE.Vector3(-668.62, 11.73, -158.78),
    new THREE.Vector3(-647.94, 12.17, -177.56),
    new THREE.Vector3(-626.73, 12.52, -190.87),
    new THREE.Vector3(-603.38, 12.85, -202.20),
    new THREE.Vector3(-579.31, 13.17, -210.59),
    new THREE.Vector3(-554.24, 13.51, -216.48),
    new THREE.Vector3(-527.86, 13.86, -219.80),
    new THREE.Vector3(-500.77, 14.21, -220.22),
    new THREE.Vector3(-475.41, 14.55, -220.12),
    new THREE.Vector3(-449.73, 14.91, -219.97),
    new THREE.Vector3(-420.79, 15.31, -219.85),
    new THREE.Vector3(-395.81, 15.66, -219.74),
    new THREE.Vector3(-370.28, 16.02, -219.65),
    new THREE.Vector3(-343.73, 16.39, -219.42),
    new THREE.Vector3(-316.48, 16.77, -219.52),
    new THREE.Vector3(-289.94, 17.13, -219.38),
    new THREE.Vector3(-265.25, 17.47, -215.01),
    new THREE.Vector3(-245.61, 17.80, -200.54),
    new THREE.Vector3(-234.31, 18.12, -179.30),
    new THREE.Vector3(-233.18, 18.45, -153.07),
    new THREE.Vector3(-241.62, 18.79, -127.24),
    new THREE.Vector3(-257.52, 18.99, -106.39),
    new THREE.Vector3(-277.44, 19.06, -91.11),
    new THREE.Vector3(-301.17, 18.99, -80.25),
    new THREE.Vector3(-325.69, 18.79, -75.22),
    new THREE.Vector3(-351.65, 18.44, -74.66),
    new THREE.Vector3(-379.30, 17.93, -74.79),
    new THREE.Vector3(-404.82, 17.41, -74.88),
    new THREE.Vector3(-431.36, 16.86, -75.00),
    new THREE.Vector3(-458.58, 16.27, -75.25),
    new THREE.Vector3(-484.26, 15.58, -75.33),
    new THREE.Vector3(-509.35, 14.74, -75.45),
    new THREE.Vector3(-533.83, 13.70, -68.52),
    new THREE.Vector3(-547.40, 12.58, -48.36),
    new THREE.Vector3(-542.97, 11.13, -21.72),
    new THREE.Vector3(-522.78, 9.54, -4.25),
    new THREE.Vector3(-500.16, 7.89, 11.00),
    new THREE.Vector3(-476.45, 6.17, 27.09),
    new THREE.Vector3(-453.45, 4.60, 42.57),
    new THREE.Vector3(-430.41, 3.27, 58.38),
    new THREE.Vector3(-407.50, 2.22, 72.50),
    new THREE.Vector3(-390.00, 1.61, 81.50),
    new THREE.Vector3(-372.00, 1.12, 88.20),
    new THREE.Vector3(-354.00, 0.76, 93.20),
    new THREE.Vector3(-334.00, 0.48, 97.50),
    new THREE.Vector3(-308.00, 0.29, 99.60),
    new THREE.Vector3(-280.17, 0.32, 100.41),
    new THREE.Vector3(-253.40, 0.56, 100.69),
    new THREE.Vector3(-227.42, 1.00, 100.74),
    new THREE.Vector3(-203.33, 1.64, 98.53),
    new THREE.Vector3(-184.08, 2.50, 83.95),
    new THREE.Vector3(-176.66, 3.55, 59.06),
    new THREE.Vector3(-176.73, 4.89, 31.14),
    new THREE.Vector3(-171.94, 6.47, 4.48),
    new THREE.Vector3(-158.76, 8.17, -20.23),
    new THREE.Vector3(-142.60, 9.87, -43.32),
    new THREE.Vector3(-127.84, 11.44, -64.66),
    new THREE.Vector3(-112.40, 13.05, -86.63),
    new THREE.Vector3(-97.94, 14.56, -107.32),
    new THREE.Vector3(-83.15, 16.11, -128.63),
    new THREE.Vector3(-67.94, 17.69, -150.39),
    new THREE.Vector3(-52.10, 19.13, -171.17),
    new THREE.Vector3(-29.65, 20.39, -187.70),
    new THREE.Vector3(-4.77, 21.32, -196.16),
    new THREE.Vector3(21.10, 21.98, -196.70),
    new THREE.Vector3(76.00, 22.58, -174.50),
    new THREE.Vector3(94.00, 22.50, -164.00),
    new THREE.Vector3(112.00, 22.30, -153.20),
    new THREE.Vector3(130.00, 22.04, -142.20),
    new THREE.Vector3(148.00, 21.77, -131.20),
    new THREE.Vector3(166.00, 21.52, -120.40),
    new THREE.Vector3(184.00, 21.29, -109.60),
    new THREE.Vector3(202.00, 21.08, -98.80),
    new THREE.Vector3(220.00, 20.86, -88.00),
    new THREE.Vector3(236.00, 20.66, -78.50),
    new THREE.Vector3(252.00, 20.44, -69.00),
    new THREE.Vector3(274.71, 20.12, -55.29),
    new THREE.Vector3(296.80, 19.78, -42.13),
    new THREE.Vector3(319.69, 19.42, -28.20),
    new THREE.Vector3(342.37, 19.09, -14.37),
    new THREE.Vector3(365.03, 18.79, -0.88),
    new THREE.Vector3(387.70, 18.50, 12.94),
    new THREE.Vector3(411.36, 18.19, 27.05),
    new THREE.Vector3(435.69, 17.82, 41.30),
    new THREE.Vector3(456.73, 17.50, 53.64),
    new THREE.Vector3(480.27, 17.16, 67.50),
    new THREE.Vector3(502.50, 16.89, 81.50),
    new THREE.Vector3(526.01, 16.68, 88.12),
    new THREE.Vector3(548.73, 16.54, 76.74),
    new THREE.Vector3(559.89, 16.57, 51.87),
    new THREE.Vector3(558.64, 16.78, 25.72),
    new THREE.Vector3(550.93, 17.17, 0.76),
    new THREE.Vector3(536.40, 17.79, -22.92),
    new THREE.Vector3(518.61, 18.48, -40.01),
    new THREE.Vector3(502.78, 19.14, -50.56),
    new THREE.Vector3(484.00, 19.92, -57.50),
    new THREE.Vector3(458.00, 21.00, -64.00),
    new THREE.Vector3(430.00, 22.20, -74.00),
    new THREE.Vector3(401.39, 23.81, -96.20),
    new THREE.Vector3(390.54, 24.82, -118.66),
    new THREE.Vector3(390.06, 25.75, -143.89),
    new THREE.Vector3(402.30, 26.55, -169.04),
    new THREE.Vector3(423.18, 27.10, -184.78),
    new THREE.Vector3(451.68, 27.46, -189.06),
    new THREE.Vector3(476.62, 27.56, -181.93),
    new THREE.Vector3(501.36, 27.48, -173.71),
    new THREE.Vector3(526.13, 27.18, -165.30),
    new THREE.Vector3(552.09, 26.66, -156.57),
    new THREE.Vector3(577.94, 25.94, -147.79),
    new THREE.Vector3(600.73, 25.04, -138.12),
    new THREE.Vector3(625.20, 23.96, -125.20),
    new THREE.Vector3(643.50, 22.75, -106.00),
    new THREE.Vector3(651.50, 21.10, -78.00),
    new THREE.Vector3(652.00, 19.68, -52.00),
    new THREE.Vector3(651.50, 18.42, -28.00),
    new THREE.Vector3(651.00, 17.17, -4.00),
    new THREE.Vector3(651.50, 15.97, 20.00),
    new THREE.Vector3(651.50, 14.68, 46.00),
    new THREE.Vector3(651.50, 13.53, 71.00),
    new THREE.Vector3(651.62, 12.47, 97.01),
    new THREE.Vector3(647.90, 11.57, 120.82),
    new THREE.Vector3(637.40, 10.76, 142.93),
    new THREE.Vector3(621.58, 10.08, 161.60),
    new THREE.Vector3(600.47, 9.48, 175.66),
    new THREE.Vector3(573.29, 8.96, 183.81),
    new THREE.Vector3(542.00, 8.40, 182.20),
    new THREE.Vector3(512.44, 7.98, 182.20),
    new THREE.Vector3(486.78, 7.64, 182.16),
    new THREE.Vector3(460.33, 7.29, 182.11),
    new THREE.Vector3(434.88, 6.96, 182.06),
    new THREE.Vector3(409.13, 6.60, 182.02),
    new THREE.Vector3(383.18, 6.28, 181.97),
    new THREE.Vector3(356.62, 6.05, 181.92),
    new THREE.Vector3(331.47, 5.94, 181.88),
    new THREE.Vector3(305.83, 5.92, 181.83),
    new THREE.Vector3(279.62, 5.92, 181.79),
    new THREE.Vector3(252.38, 5.92, 181.74),
    new THREE.Vector3(227.10, 5.92, 181.69),
    new THREE.Vector3(201.98, 5.92, 181.65),
    new THREE.Vector3(177.09, 5.91, 181.61)
];
        const trackCurve = new THREE.CatmullRomCurve3(trackPoints, true, 'centripetal');

        // ========================================================
        // 1B. 3D DYNAMIC F1 RACING LINE (Visual Ribbon di Atas Aspal)
        // ========================================================
        let racingLineMesh = null;
        let showRacingLine = true;

        function createF1RacingLineMesh() {
            const numSamples = 800;
            const ribbonWidth = 1.35; // Lebar racing line ~1.35 meter
            const vertices = [];
            const colors = [];
            const indices = [];

            // Algoritma warna F1 Racing Line dinamis:
            // - HIJAU: Akselerasi penuh / Gas pol (Straightaway, DRS Zone, Exit)
            // - KUNING: Transisi pengereman bertahap & Apex tikungan
            // - MERAH: Titik pengereman keras (Heavy Braking Zone masuk tikungan)
            function getLineColor(t) {
                // Zona Pengereman Keras (Braking Zone - Sesuai Layout Resmi 14 Tikungan Barcelona-Catalunya)
                // Turn 1-2 Elf: 0.124 - 0.143
                // Turn 4 Repsol: 0.308 - 0.328
                // Turn 5 Seat Hairpin: 0.394 - 0.412
                // Turn 10 La Caixa: 0.688 - 0.710
                if ((t >= 0.124 && t <= 0.143) ||
                    (t >= 0.308 && t <= 0.328) ||
                    (t >= 0.394 && t <= 0.412) ||
                    (t >= 0.688 && t <= 0.710)) {
                    return new THREE.Color(0xef4444); // Merah pengereman
                }
                // Zona Transisi / Apex Tikungan (T1-2, T4, T5, T7-8, T9 Campsa, T10-11, T12, T13-14)
                if ((t > 0.143 && t < 0.176) ||
                    (t > 0.328 && t < 0.354) ||
                    (t > 0.412 && t < 0.435) ||
                    (t > 0.486 && t < 0.520) ||
                    (t > 0.562 && t < 0.586) ||
                    (t > 0.710 && t < 0.745) ||
                    (t > 0.766 && t < 0.808) ||
                    (t > 0.832 && t < 0.855) ||
                    (t > 0.882 && t < 0.912)) {
                    return new THREE.Color(0xfacc15); // Kuning apex
                }
                // Jalur Akselerasi Penuh / DRS / Flat Out (Main Straight & Back Straight)
                return new THREE.Color(0x22c55e); // Hijau akselerasi
            }

            for (let i = 0; i <= numSamples; i++) {
                const t = i / numSamples;
                const pt = trackCurve.getPointAt(t);
                const tangent = trackCurve.getTangentAt(t).normalize();
                const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();

                const halfW = ribbonWidth / 2;
                const pLeft = pt.clone().add(normal.clone().multiplyScalar(halfW));
                const pRight = pt.clone().add(normal.clone().multiplyScalar(-halfW));
                pLeft.y += 0.08;  // Mengambang tipis 8cm di atas aspal agar tidak z-fighting
                pRight.y += 0.08;

                vertices.push(pLeft.x, pLeft.y, pLeft.z);
                vertices.push(pRight.x, pRight.y, pRight.z);

                const col = getLineColor(t);
                colors.push(col.r, col.g, col.b);
                colors.push(col.r, col.g, col.b);

                if (i < numSamples) {
                    const base = i * 2;
                    indices.push(base, base + 1, base + 2);
                    indices.push(base + 1, base + 3, base + 2);
                }
            }

            const geom = new THREE.BufferGeometry();
            geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geom.setIndex(indices);

            const mat = new THREE.MeshBasicMaterial({
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            racingLineMesh = new THREE.Mesh(geom, mat);
            scene.add(racingLineMesh);
        }

        function toggleRacingLine() {
            showRacingLine = !showRacingLine;
            if (racingLineMesh) {
                racingLineMesh.visible = showRacingLine;
            }
            const btn = document.getElementById('racing-line-btn');
            if (btn) {
                btn.style.opacity = showRacingLine ? '1.0' : '0.5';
                btn.style.background = showRacingLine ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            }
        }

        // Langsung generate 3D F1 Racing Line di sirkuit
        createF1RacingLineMesh();

        // ========================================================
        // 2. LOAD MODEL 3D CIRCUIT DE BARCELONA-CATALUNYA & MOBIL F1
        // ========================================================
        let circuitModel = null;
        let carModel = null;
        let circuitLoaded = false;
        let carLoaded = false;

        const loader = new THREE.GLTFLoader();

        // Dukungan Draco Mesh Compression untuk GLB
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        loader.setDRACOLoader(dracoLoader);

        function checkLoadComplete() {
            if (circuitLoaded && carLoaded) {
                const loaderEl = document.getElementById('circuit-loader');
                loaderEl.classList.add('fade-out');
                setTimeout(() => loaderEl.style.display = 'none', 500);

                if (soundEnabled) {
                    playCarEngineAudio();
                }
            }
        }

        // 1. Memuat Model 3D Circuit de Barcelona-Catalunya (Skala Penuh 1:1 Nyata ~51.4MB)
        loader.load('./assets/models/circuit_de_catalunya.glb', (gltf) => {
            circuitModel = gltf.scene;
            // Skala 100x untuk menyesuaikan koordinat asli FBX Sketchfab ke skala meter dunia nyata
            circuitModel.scale.set(100, 100, 100);
            circuitModel.updateMatrixWorld(true);
            circuitModel.traverse((child) => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                }
            });
            scene.add(circuitModel);
            circuitLoaded = true;
            document.getElementById('loader-status').innerText = `Memuat Mobil: ${carData.name}...`;
            checkLoadComplete();
        }, (xhr) => {
            if (xhr.lengthComputable && !circuitLoaded) {
                const p = Math.round((xhr.loaded / xhr.total) * 100);
                document.getElementById('loader-status').innerText = `Memuat Circuit de Barcelona-Catalunya... ${p}%`;
            }
        }, (err) => {
            console.warn('Gagal memuat sirkuit Catalunya:', err);
            circuitLoaded = true;
            checkLoadComplete();
        });

        // Fallback mobil balap prosedural
        function createFallbackCar(colorHex) {
            const group = new THREE.Group();
            const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, metalness: 0.8, roughness: 0.2 });
            const blackMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });

            const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.5, 4.5), bodyMat);
            body.position.y = 0.35;
            body.castShadow = true;
            group.add(body);

            const nose = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 4), bodyMat);
            nose.rotation.x = Math.PI / 2;
            nose.position.set(0, 0.25, 2.5);
            nose.castShadow = true;
            group.add(nose);

            const fWing = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.6), blackMat);
            fWing.position.set(0, 0.15, 3.1);
            fWing.castShadow = true;
            group.add(fWing);

            const rWing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.7), blackMat);
            rWing.position.set(0, 0.95, -2.1);
            rWing.castShadow = true;
            group.add(rWing);

            const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.45, 16);
            wheelGeo.rotateZ(Math.PI / 2);
            [
                [-1.1, 0.42, 1.6],
                [1.1, 0.42, 1.6],
                [-1.15, 0.45, -1.5],
                [1.15, 0.45, -1.5]
            ].forEach(pos => {
                const w = new THREE.Mesh(wheelGeo, blackMat);
                w.position.set(pos[0], pos[1], pos[2]);
                w.castShadow = true;
                w.userData.isFallbackWheel = true;
                group.add(w);
            });

            return group;
        }

        // ========================================================
        // SISTEM ANIMASI RODA BERPUTAR 3D REALISTIS DI SIRKUIT
        // ========================================================
        let spinningWheels = [];

        function repivotCircuitWheel(obj) {
            const parent = obj.parent;
            if (!parent) return null;
            obj.updateMatrixWorld(true);
            parent.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(obj);
            if (box.isEmpty()) return null;

            const worldCenter = box.getCenter(new THREE.Vector3());
            const localCenter = parent.worldToLocal(worldCenter.clone());

            const pivot = new THREE.Group();
            pivot.position.copy(localCenter);
            parent.add(pivot);
            pivot.attach(obj);

            const size = box.getSize(new THREE.Vector3());
            return { pivot, size };
        }

        function extractBakedCircuitWheels(root) {
            const wheels = [];
            root.updateMatrixWorld(true);
            const invRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();

            const meshes = [];
            root.traverse((c) => {
                if (c.isMesh && c.geometry && c.geometry.attributes && c.geometry.attributes.position) {
                    meshes.push(c);
                }
            });
            if (meshes.length === 0) return wheels;

            // Langkah 1: Hitung bounding box mobil dalam ruang LOKAL root (0mm pergeseran!)
            const carBox = new THREE.Box3();
            const v = new THREE.Vector3();
            const meshToRoots = meshes.map((mesh) => new THREE.Matrix4().multiplyMatrices(invRoot, mesh.matrixWorld));

            for (let mi = 0; mi < meshes.length; mi++) {
                const pos = meshes[mi].geometry.attributes.position;
                const m2r = meshToRoots[mi];
                for (let i = 0; i < pos.count; i++) {
                    v.fromBufferAttribute(pos, i).applyMatrix4(m2r);
                    carBox.expandByPoint(v);
                }
            }

            const size = carBox.getSize(new THREE.Vector3());
            const center = carBox.getCenter(new THREE.Vector3());
            const min = carBox.min;

            const longIsZ = size.z >= size.x;
            const W = longIsZ ? size.x : size.z;
            const L = longIsZ ? size.z : size.x;
            const midLat = longIsZ ? center.x : center.z;
            const midLong = longIsZ ? center.z : center.x;

            // Langkah 2: Deteksi eksak 4 tapak ban paling bawah yang menyentuh aspal
            // Langkah 2: Connected Components (Union-Find) berbasis posisi 3D terkuantisasi (~1.4 mm)
            let totalVerts = 0;
            const meshOffsets = [];
            for (let mi = 0; mi < meshes.length; mi++) {
                meshOffsets.push(totalVerts);
                totalVerts += meshes[mi].geometry.attributes.position.count;
            }
            const maxDim = Math.max(size.x, size.y, size.z, 1e-5);
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
                    const ix = Math.round((v.x - min.x) * qScale);
                    const iy = Math.round((v.y - min.y) * qScale);
                    const iz = Math.round((v.z - min.z) * qScale);
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
                if (st.minY > min.y + 0.12 * size.y) return;
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
                    side: (cLat >= midLat) ? 1 : -1,
                    center: longIsZ ? new THREE.Vector3(cLat, cY, cLng) : new THREE.Vector3(cLng, cY, cLat),
                    cLat, cY, cLng, r,
                    minLat: tire.minLat, maxLat: tire.maxLat,
                    minY: tire.minY, maxY: tire.maxY,
                    minLng: tire.minLng, maxLng: tire.maxLng,
                    axisVec: longIsZ ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1),
                    trisByMat: new Map()
                };
                validZones.push(zone);
                quadToZone[qi] = zone;
                compToZone.set(tire.cid, zIdx);
            }

            // Mirror fallback jika 1 kuadran ban menempel ke hub/suspensi
            for (let qi = 0; qi < 4; qi++) {
                if (quadToZone[qi]) continue;
                const opp = quadToZone[qi ^ 1];
                if (!opp) continue;
                const mSide = -opp.side;
                const mCLat = 2 * midLat - opp.cLat;
                const zone = {
                    qi,
                    isMirrorFallback: true,
                    side: mSide,
                    center: longIsZ ? new THREE.Vector3(mCLat, opp.cY, opp.cLng) : new THREE.Vector3(opp.cLng, opp.cY, mCLat),
                    cLat: mCLat, cY: opp.cY, cLng: opp.cLng, r: opp.r,
                    minLat: 2 * midLat - opp.maxLat, maxLat: 2 * midLat - opp.minLat,
                    minY: opp.minY, maxY: opp.maxY,
                    minLng: opp.minLng, maxLng: opp.maxLng,
                    axisVec: longIsZ ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1),
                    trisByMat: new Map()
                };
                validZones.push(zone);
                quadToZone[qi] = zone;
            }

            // Kåsa Circle Fit + 3x3 Covariance Axle Vector agar putaran roda 0° goyang
            const canonicalAxis = longIsZ ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
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
                if (n < 30) continue;

                let sumU = 0, sumW = 0, cnt = 0;
                const ringU = [], ringW = [];
                const rMinSq = (z.r * 0.65) * (z.r * 0.65);
                for (let i = 0; i < n; i++) {
                    const px = pts[i * 3], py = pts[i * 3 + 1], pz = pts[i * 3 + 2];
                    const lng = longIsZ ? pz : px;
                    const du = py - z.cY;
                    const dw = lng - z.cLng;
                    if (du * du + dw * dw >= rMinSq) {
                        ringU.push(py); ringW.push(lng);
                        sumU += py; sumW += lng; cnt++;
                    }
                }
                if (cnt >= 24) {
                    const mu = sumU / cnt, mw = sumW / cnt;
                    let a11 = 0, a12 = 0, a22 = 0, b1 = 0, b2 = 0;
                    for (let i = 0; i < cnt; i++) {
                        const u = ringU[i] - mu, w = ringW[i] - mw;
                        const r2 = u * u + w * w;
                        a11 += u * u; a12 += u * w; a22 += w * w;
                        b1 += u * r2; b2 += w * r2;
                    }
                    const det = a11 * a22 - a12 * a12;
                    if (Math.abs(det) > 1e-12) {
                        const fitY = mu + (0.5 * (b1 * a22 - b2 * a12)) / det;
                        const fitLng = mw + (0.5 * (a11 * b2 - a12 * b1)) / det;
                        if (Math.hypot(fitY - z.cY, fitLng - z.cLng) < 0.25 * z.r) {
                            z.cY = fitY; z.cLng = fitLng;
                            z.center = longIsZ ? new THREE.Vector3(z.cLat, z.cY, z.cLng) : new THREE.Vector3(z.cLng, z.cY, z.cLat);
                        }
                    }
                }

                let cxx = 0, cyy = 0, czz = 0, cxy = 0, cxz = 0, cyz = 0;
                for (let i = 0; i < n; i++) {
                    const dx = pts[i * 3] - z.center.x;
                    const dy = pts[i * 3 + 1] - z.center.y;
                    const dz = pts[i * 3 + 2] - z.center.z;
                    cxx += dx * dx; cyy += dy * dy; czz += dz * dz;
                    cxy += dx * dy; cxz += dx * dz; cyz += dy * dz;
                }
                const tr = cxx + cyy + czz;
                if (tr > 1e-10) {
                    const m00 = tr - cxx, m11 = tr - cyy, m22 = tr - czz;
                    const m01 = -cxy, m02 = -cxz, m12 = -cyz;
                    let ax = canonicalAxis.x, ay = canonicalAxis.y, az = canonicalAxis.z;
                    for (let it = 0; it < 14; it++) {
                        const nx = m00 * ax + m01 * ay + m02 * az;
                        const ny = m01 * ax + m11 * ay + m12 * az;
                        const nz = m02 * ax + m12 * ay + m22 * az;
                        const len = Math.hypot(nx, ny, nz);
                        if (len < 1e-12) break;
                        ax = nx / len; ay = ny / len; az = nz / len;
                    }
                    const dot = ax * canonicalAxis.x + ay * canonicalAxis.y + az * canonicalAxis.z;
                    if (dot < 0) { ax = -ax; ay = -ay; az = -az; }
                    if (Math.abs(dot) >= 0.94) {
                        z.axisVec = new THREE.Vector3(ax, ay, az);
                    }
                }
            }

            for (const z of validZones) {
                if (!z.isMirrorFallback) continue;
                const opp = quadToZone[z.qi ^ 1];
                if (opp && opp.axisVec) {
                    z.cY = opp.cY; z.cLng = opp.cLng;
                    z.center = longIsZ ? new THREE.Vector3(z.cLat, z.cY, z.cLng) : new THREE.Vector3(z.cLng, z.cY, z.cLat);
                    z.axisVec = longIsZ
                        ? new THREE.Vector3(opp.axisVec.x, -opp.axisVec.y, -opp.axisVec.z)
                        : new THREE.Vector3(-opp.axisVec.x, -opp.axisVec.y, opp.axisVec.z);
                    z.axisVec.normalize();
                }
            }

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

            const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
            const n0 = new THREE.Vector3();

            // Langkah 4: Pisahkan 100% segitiga komponen roda secara utuh dalam ruang LOKAL root
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
                let moved = false;

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
                        moved = true;
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
                            bucket.pos.push(verts[k].x - z.center.x, verts[k].y - z.center.y, verts[k].z - z.center.z);
                            if (norm) {
                                n0.fromBufferAttribute(norm, inds[k]).transformDirection(m2r);
                                bucket.norm.push(n0.x, n0.y, n0.z);
                            }
                            if (uv) bucket.uv.push(uv.getX(inds[k]), uv.getY(inds[k]));
                        }
                    } else {
                        chassisIdx.push(i0, i1, i2);
                    }
                }

                if (moved) {
                    geom.setIndex(chassisIdx);
                }
            }

            // Langkah 5: Pasang 4 Pivot Group roda tepat pada as lokal root dengan sumbu putar eksak anti-goyang
            for (const z of validZones) {
                if (z.trisByMat.size === 0) continue;
                const pivot = new THREE.Group();
                pivot.position.copy(z.center);

                z.trisByMat.forEach((bucket, mat) => {
                    const g = new THREE.BufferGeometry();
                    g.setAttribute('position', new THREE.Float32BufferAttribute(bucket.pos, 3));
                    if (bucket.hasNorm && bucket.norm.length > 0) {
                        g.setAttribute('normal', new THREE.Float32BufferAttribute(bucket.norm, 3));
                    } else {
                        g.computeVertexNormals();
                    }
                    if (bucket.hasUv && bucket.uv.length > 0) {
                        g.setAttribute('uv', new THREE.Float32BufferAttribute(bucket.uv, 2));
                    }
                    const wMesh = new THREE.Mesh(g, mat);
                    wMesh.castShadow = true;
                    wMesh.receiveShadow = true;
                    pivot.add(wMesh);
                });

                root.add(pivot);
                wheels.push({ pivot, axis: longIsZ ? 'x' : 'z', axisVec: z.axisVec, dir: 1 });
            }

            return wheels;
        }

        function setupCircuitWheels(root, carKey) {
            spinningWheels = [];
            try {
                if (carKey === 'ferrari') {
                    const wheelNodes = [];
                    root.traverse((c) => {
                        if (c.name && /^WHEEL_(LF|RF|LR|RR)/i.test(c.name)) wheelNodes.push(c);
                    });
                    wheelNodes.forEach((wn) => {
                        const res = repivotCircuitWheel(wn);
                        if (res) spinningWheels.push({ pivot: res.pivot, axis: 'x', dir: 1 });
                    });
                } else if (carKey === 'ducati') {
                    const wheelMeshes = [];
                    root.traverse((c) => {
                        if (c.isMesh && c.material && c.material.name === 'Part8_Mat') wheelMeshes.push(c);
                    });
                    wheelMeshes.forEach((wm) => {
                        const res = repivotCircuitWheel(wm);
                        if (res) spinningWheels.push({ pivot: res.pivot, axis: 'x', dir: 1 });
                    });
                } else {
                    const fallbackWheels = [];
                    root.traverse((c) => { if (c.userData && c.userData.isFallbackWheel) fallbackWheels.push(c); });
                    if (fallbackWheels.length > 0) {
                        fallbackWheels.forEach((fw) => spinningWheels.push({ pivot: fw, axis: 'x', dir: 1 }));
                    } else {
                        spinningWheels = extractBakedCircuitWheels(root);
                    }
                }
                console.log(`🛞 Roda berputar aktif di sirkuit (${spinningWheels.length} roda)`);
            } catch (e) {
                console.warn('Circuit wheel setup skipped:', e);
            }
        }

        // 2. Memuat Model 3D Mobil Formula 1
        loader.load(carData.src, (gltf) => {
            carModel = gltf.scene;

            // Auto-scale & Adjust Pivot
            const bbox = new THREE.Box3().setFromObject(carModel);
            const size = bbox.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const targetLength = 5.2; // Panjang mobil F1 ~5.2 meter
            const s = (targetLength / maxDim) * carData.scale;
            carModel.scale.set(s, s, s);

            carModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            setupCircuitWheels(carModel, selectedCarKey);

            scene.add(carModel);
            carLoaded = true;
            checkLoadComplete();
        }, (xhr) => {
            if (xhr.lengthComputable && circuitLoaded && !carLoaded) {
                const p = Math.round((xhr.loaded / xhr.total) * 100);
                document.getElementById('loader-status').innerText = `Memuat Mobil: ${carData.name}... ${p}%`;
            }
        }, (err) => {
            console.warn('Gagal memuat mobil utama, menggunakan mobil cadangan:', err);
            carModel = createFallbackCar(carData.color || 0xe10600);
            setupCircuitWheels(carModel, 'fallback');
            scene.add(carModel);
            carLoaded = true;
            checkLoadComplete();
        });

        // ========================================================
        // 3. TELEMETRY, INTERACTIVE DRIVING CONTROLS & PHYSICS
        // ========================================================
        let trackProgress = 0.0;
        let baseSpeed = 0.00024;
        let currentSpeedKmh = 0;
        let drsActive = false;
        let currentLap = 1;
        let lapStartTime = performance.now();

        // Status Kontrol Kemudi & Kecepatan Pengguna
        let isSteerLeft = false;
        let isSteerRight = false;
        let isGas = false;
        let isBrake = false;

        let lateralOffset = 0.0;          // Offset jalur (-5.2m kiri s/d +5.2m kanan)
        let currentLateralOffset = 0.0;   // Lerp offset aktual
        let steeringVisualAngle = 0.0;    // Rotasi visual bodi mobil saat belok
        let userSpeedMultiplier = 1.0;    // Multiplier akselerasi gas/rem
        let targetUserSpeed = 1.0;

        function setupDrivingControls() {
            function bindControl(btnId, setFlag) {
                const el = document.getElementById(btnId);
                if (!el) return;

                const start = (e) => {
                    e.preventDefault();
                    setFlag(true);
                    el.classList.add('active');
                    if (navigator.vibrate) navigator.vibrate(12);
                    unlockCircuitAudio();
                };

                const stop = (e) => {
                    if (e) e.preventDefault();
                    setFlag(false);
                    el.classList.remove('active');
                };

                el.addEventListener('touchstart', start, { passive: false });
                el.addEventListener('touchend', stop, { passive: false });
                el.addEventListener('touchcancel', stop, { passive: false });

                el.addEventListener('mousedown', start);
                el.addEventListener('mouseup', stop);
                el.addEventListener('mouseleave', stop);
            }

            bindControl('btn-steer-left', (v) => isSteerLeft = v);
            bindControl('btn-steer-right', (v) => isSteerRight = v);
            bindControl('btn-brake', (v) => isBrake = v);
            bindControl('btn-gas', (v) => isGas = v);

            // Dukungan Keyboard Desktop (WASD & Tombol Panah)
            window.addEventListener('keydown', (e) => {
                unlockCircuitAudio();

                if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                    isSteerLeft = true;
                    document.getElementById('btn-steer-left')?.classList.add('active');
                }
                if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                    isSteerRight = true;
                    document.getElementById('btn-steer-right')?.classList.add('active');
                }
                if (e.code === 'KeyW' || e.code === 'ArrowUp') {
                    isGas = true;
                    document.getElementById('btn-gas')?.classList.add('active');
                }
                if (e.code === 'KeyS' || e.code === 'ArrowDown') {
                    isBrake = true;
                    document.getElementById('btn-brake')?.classList.add('active');
                }
                if (e.code === 'Space') {
                    toggleDRS();
                }
                if (e.code === 'KeyC') {
                    cycleCamera();
                }
                if (e.code === 'KeyM') {
                    toggleSound();
                }
            });

            window.addEventListener('keyup', (e) => {
                if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                    isSteerLeft = false;
                    document.getElementById('btn-steer-left')?.classList.remove('active');
                }
                if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                    isSteerRight = false;
                    document.getElementById('btn-steer-right')?.classList.remove('active');
                }
                if (e.code === 'KeyW' || e.code === 'ArrowUp') {
                    isGas = false;
                    document.getElementById('btn-gas')?.classList.remove('active');
                }
                if (e.code === 'KeyS' || e.code === 'ArrowDown') {
                    isBrake = false;
                    document.getElementById('btn-brake')?.classList.remove('active');
                }
            });
        }
        setupDrivingControls();

        // Camera Modes: 'chase', 'drone', 'cockpit', 'orbit'
        const CAM_MODES = ['chase', 'drone', 'cockpit', 'orbit'];
        let camIndex = 0;
        let currentCamMode = 'chase';

        function cycleCamera() {
            camIndex = (camIndex + 1) % CAM_MODES.length;
            currentCamMode = CAM_MODES[camIndex];
            const labels = {
                'chase': 'Chase Cam',
                'drone': 'Drone Cam',
                'cockpit': 'Cockpit Cam',
                'orbit': 'Free Orbit'
            };
            document.getElementById('cam-label').innerText = labels[currentCamMode];

            if (currentCamMode === 'orbit') {
                controls.enabled = true;
            } else {
                controls.enabled = false;
            }
        }

        function toggleDRS() {
            drsActive = !drsActive;
            const btn = document.getElementById('drs-toggle');
            if (drsActive) {
                btn.style.background = 'linear-gradient(135deg, #e11d48, #f43f5e)';
                btn.innerText = '🔥 DRS AKTIF!';
            } else {
                btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                btn.innerText = '⚡ DRS BOOST';
            }
        }

        // Dynamic Engine Audio Pitch Synthesizer
        let audioCtx = null;
        let engineOsc = null;
        let engineGain = null;
        let soundEnabled = true;

        function initEngineAudio() {
            try {
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (audioCtx.state === 'suspended') audioCtx.resume();

                engineOsc = audioCtx.createOscillator();
                engineGain = audioCtx.createGain();

                engineOsc.type = 'sawtooth';
                engineOsc.frequency.setValueAtTime(140, audioCtx.currentTime);

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
                filter.Q.setValueAtTime(2.5, audioCtx.currentTime);

                engineGain.gain.setValueAtTime(soundEnabled ? 0.22 : 0, audioCtx.currentTime);

                engineOsc.connect(filter);
                filter.connect(engineGain);
                engineGain.connect(audioCtx.destination);

                engineOsc.start();
            } catch (e) {}
        }

        // Putar Suara Mesin Asli Khusus Mobil yang Dipilih (Tanpa Theme Song F1)
        function playCarEngineAudio() {
            const engAudio = document.getElementById('car-engine-audio');
            if (engAudio && soundEnabled && carData.sound) {
                if (!engAudio.src.endsWith(carData.sound.replace(/^\.\//, ''))) {
                    engAudio.src = carData.sound;
                }
                engAudio.volume = 0.7;
                engAudio.play().catch(() => {});
            }
        }

        function unlockCircuitAudio() {
            if (!carData.sound && !audioCtx) {
                initEngineAudio();
            }
            if (soundEnabled) {
                playCarEngineAudio();
            }
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            document.getElementById('sound-btn').innerText = soundEnabled ? '🔊' : '🔇';
            const engAudio = document.getElementById('car-engine-audio');
            if (engAudio) {
                if (soundEnabled) playCarEngineAudio();
                else engAudio.pause();
            }
            if (engineGain && audioCtx) {
                engineGain.gain.setValueAtTime(soundEnabled ? 0.22 : 0, audioCtx.currentTime);
            }
        }

        window.addEventListener('click', unlockCircuitAudio, { once: true });
        window.addEventListener('touchstart', unlockCircuitAudio, { once: true, passive: true });

        // Animasi Loop Balapan
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            if (carModel) {
                // Kecepatan adaptif sirkuit (Sesuai Layout Resmi 14 Tikungan Spain_Circuit)
                let speedFactor = 1.0;
                // Tikungan tajam & zona pengereman (T1-2: 0.124-0.176, T4: 0.308-0.354, T5: 0.394-0.435, T10-11: 0.688-0.745, T12: 0.766-0.808)
                if ((trackProgress > 0.124 && trackProgress < 0.176) || 
                    (trackProgress > 0.308 && trackProgress < 0.354) || 
                    (trackProgress > 0.394 && trackProgress < 0.435) || 
                    (trackProgress > 0.688 && trackProgress < 0.745) || 
                    (trackProgress > 0.766 && trackProgress < 0.808)) {
                    speedFactor = 0.60; // Pengereman di tikungan tajam
                } else if ((trackProgress >= 0.0 && trackProgress < 0.124) || 
                           (trackProgress > 0.590 && trackProgress < 0.688) || 
                           (trackProgress > 0.912 && trackProgress <= 1.0)) {
                    speedFactor = 1.38; // Akselerasi penuh di trek lurus (Main Straight & Back Straight)
                } else {
                    speedFactor = 1.05;
                }

                // 1. Logika Kecepatan Berdasarkan Pedal Gas & Rem Pengguna
                if (isGas) {
                    targetUserSpeed = 1.65; // Akselerasi penuh saat tombol GAS ditekan (~320-350 km/h)
                } else if (isBrake) {
                    targetUserSpeed = 0.18; // Pengereman tajam saat tombol REM ditekan (~30-45 km/h)
                } else {
                    targetUserSpeed = 1.0;  // Kecepatan jelajah normal saat pedal dilepas (~200 km/h)
                }
                userSpeedMultiplier += (targetUserSpeed - userSpeedMultiplier) * 0.08;

                let totalSpeedFactor = speedFactor * userSpeedMultiplier;
                if (drsActive) totalSpeedFactor *= 1.45; // Boost DRS

                trackProgress = (trackProgress + baseSpeed * totalSpeedFactor * (delta * 60)) % 1.0;

                // 2. Logika Kemudi Belok Kanan & Kiri (Steering)
                const steerRate = 8.5 * delta; // Kecepatan perpindahan jalur melintang (meter/detik)
                if (isSteerLeft) {
                    lateralOffset = Math.max(-5.2, lateralOffset - steerRate);
                } else if (isSteerRight) {
                    lateralOffset = Math.min(5.2, lateralOffset + steerRate);
                } else {
                    // Auto-centering lembut kembali ke tengah racing line saat tombol dilepas
                    lateralOffset += (0 - lateralOffset) * 0.04;
                }

                currentLateralOffset += (lateralOffset - currentLateralOffset) * 0.22;

                const targetSteerAngle = isSteerRight ? 0.38 : (isSteerLeft ? -0.38 : 0.0);
                steeringVisualAngle += (targetSteerAngle - steeringVisualAngle) * 0.16;

                // Cek putaran Lap
                if (trackProgress < 0.002 && performance.now() - lapStartTime > 5000) {
                    currentLap++;
                    document.getElementById('lap-counter').innerText = currentLap;
                    lapStartTime = performance.now();
                }

                // Hitung Lap Time
                const elapsedLapMs = performance.now() - lapStartTime;
                const lapSec = Math.floor(elapsedLapMs / 1000);
                const lapMs = Math.floor((elapsedLapMs % 1000) / 10);
                document.getElementById('lap-time').innerText = 
                    `${String(lapSec).padStart(2, '0')}:${String(lapMs).padStart(2, '0')}`;

                // 3. Posisi & Rotasi Mobil di Sepanjang Jalur Sirkuit dengan Offset Kemudi
                const currentPos = trackCurve.getPointAt(trackProgress);
                const lookAheadProgress = (trackProgress + 0.0012) % 1.0;
                const lookAheadPos = trackCurve.getPointAt(lookAheadProgress);
                const tangent = lookAheadPos.clone().sub(currentPos).normalize();

                // Vektor normal tegak lurus mengarah ke kanan mobil
                const upVec = new THREE.Vector3(0, 1, 0);
                const normalRight = tangent.clone().cross(upVec).normalize();

                // Posisi aktual mobil setelah dibelokkan ke kiri/kanan
                const actualCarPos = currentPos.clone().addScaledVector(normalRight, currentLateralOffset);
                carModel.position.copy(actualCarPos);
                carModel.position.y += carData.yOffset;

                // Arah hadap moncong mobil menyusuri jalur belokan
                const actualLookAheadPos = lookAheadPos.clone().addScaledVector(normalRight, currentLateralOffset);
                carModel.lookAt(actualLookAheadPos.x, actualCarPos.y, actualLookAheadPos.z);

                // Animasi visual moncong menoleh (yaw) & suspensi miring (body roll) saat belok
                if (Math.abs(steeringVisualAngle) > 0.005) {
                    carModel.rotateY(-steeringVisualAngle * 0.35);
                    carModel.rotateZ(-steeringVisualAngle * 0.10);
                }

                // Animasi putaran roda 3D sinkron dengan kecepatan mobil (km/h)
                if (spinningWheels.length > 0 && currentSpeedKmh > 1) {
                    const wheelSpinStep = ((currentSpeedKmh / 3.6) / 0.34) * Math.min(delta, 0.05) * 0.35;
                    for (let i = 0; i < spinningWheels.length; i++) {
                        const w = spinningWheels[i];
                        if (w.axisVec && typeof w.pivot.rotateOnAxis === 'function') {
                            w.pivot.rotateOnAxis(w.axisVec, wheelSpinStep * w.dir);
                        } else {
                            w.pivot.rotation[w.axis] += wheelSpinStep * w.dir;
                        }
                    }
                }

                // Update Telemetry Speedometer aktual
                const targetKmh = Math.round(180 * totalSpeedFactor + (Math.sin(performance.now() * 0.005) * 6));
                currentSpeedKmh += (targetKmh - currentSpeedKmh) * 0.12;
                document.getElementById('speedo-number').innerText = Math.max(0, Math.round(currentSpeedKmh));

                // Gear indicator (1 - 8)
                const gear = Math.min(8, Math.max(1, Math.floor(currentSpeedKmh / 42) + 1));
                document.getElementById('gear-indicator').innerText = gear;

                // Update RPM LEDs
                const rpmRatio = (currentSpeedKmh % 45) / 45;
                const dots = document.querySelectorAll('.rpm-dot');
                dots.forEach((dot, idx) => {
                    if (idx / dots.length <= rpmRatio) dot.classList.add('active');
                    else dot.classList.remove('active');
                });

                // Update Audio Pitch Suara Mesin
                if (engineOsc && audioCtx && soundEnabled) {
                    const targetFreq = 160 + (currentSpeedKmh * 3.8);
                    engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.08);
                }
                const engAudio = document.getElementById('car-engine-audio');
                if (engAudio && soundEnabled && !engAudio.paused) {
                    // Modulasi pitch suara mesin asli sesuai kecepatan mobil (0.85x s/d 1.35x)
                    const targetRate = Math.min(1.35, Math.max(0.85, 0.85 + (currentSpeedKmh / 350) * 0.45));
                    engAudio.playbackRate = targetRate;
                }

                // ========================================================
                // 4. SISTEM KAMERA INTERAKTIF (CHASE / DRONE / COCKPIT)
                // ========================================================
                if (currentCamMode === 'chase') {
                    // Kamera mengejar di belakang mobil mengikuti kemudi aktual
                    const cameraOffset = tangent.clone().multiplyScalar(-14).add(new THREE.Vector3(0, 4.8, 0));
                    camera.position.copy(actualCarPos).add(cameraOffset);
                    camera.lookAt(actualCarPos.clone().add(new THREE.Vector3(0, 1.4, 0)));
                } else if (currentCamMode === 'drone') {
                    // Kamera helikopter dari atas menyusuri sirkuit
                    const cameraOffset = tangent.clone().multiplyScalar(-26).add(new THREE.Vector3(0, 32, 0));
                    camera.position.copy(actualCarPos).add(cameraOffset);
                    camera.lookAt(actualCarPos);
                } else if (currentCamMode === 'cockpit') {
                    // Kamera tepat di atas kokpit helm pembalap
                    const cameraOffset = tangent.clone().multiplyScalar(0.4).add(new THREE.Vector3(0, 1.25, 0));
                    camera.position.copy(actualCarPos).add(cameraOffset);
                    camera.lookAt(actualCarPos.clone().add(tangent.clone().multiplyScalar(20)));
                } else if (currentCamMode === 'orbit') {
                    controls.target.copy(actualCarPos);
                    controls.update();
                }
            }

            renderer.render(scene, camera);
        }

        animate();

        // Responsive Window Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
