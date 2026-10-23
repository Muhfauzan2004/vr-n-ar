// ar.js - Universal WebAR Racing Helper

// 1. Komponen auto-model:
// Menghitung bounding box 3D secara otomatis agar model (Ferrari, Red Bull, Ducati)
// selalu pas berukuran proporsional (~85cm di meja), berada di titik pusat kartu,
// dan roda menempel pas di atas permukaan kartu target.
AFRAME.registerComponent('auto-model', {
    schema: { length: { type: 'number', default: 0.85 } },
    init: function () {
        this.el.addEventListener('model-loaded', () => {
            const mesh = this.el.getObject3D('mesh');
            if (!mesh) return;

            mesh.position.set(0, 0, 0);
            mesh.scale.set(1, 1, 1);

            const box = new THREE.Box3().setFromObject(mesh);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = this.data.length / (maxDim || 1);

            mesh.scale.set(scale, scale, scale);
            mesh.position.x = -center.x * scale;
            mesh.position.y = -box.min.y * scale;
            mesh.position.z = -center.z * scale;
        });
    }
});

// 2. Komponen anchor-hold:
// Mengunci model agar tetap muncul dan diam di posisi terakhirnya meskipun:
// - Kamera HP bergerak/bergoyang
// - Pengguna berputar mengelilingi meja untuk melihat dari belakang mobil
// - Kartu berada di sudut miring
AFRAME.registerComponent('anchor-hold', {
    init: function () {
        this.isCurrent = false;
        this.el.addEventListener('targetFound', () => {
            document.querySelectorAll('[anchor-hold]').forEach(other => {
                if (other !== this.el) {
                    other.object3D.visible = false;
                    if (other.components['anchor-hold']) {
                        other.components['anchor-hold'].isCurrent = false;
                    }
                }
            });
            this.isCurrent = true;
            this.el.object3D.visible = true;
        });
    },
    tick: function () {
        if (this.isCurrent) {
            this.el.object3D.visible = true;
        }
    }
});

// 3. Sentuh Layar untuk Putar Mobil 360 Derajat (Swipe to Rotate):
// Pengguna dapat menggeser layar HP ke kiri/kanan untuk memutar mobil dan melihat
// bagian belakang (sayap belakang, knalpot, diffuser) secara langsung!
window.addEventListener('DOMContentLoaded', () => {
    let startX = 0;
    let isTouching = false;

    window.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            isTouching = true;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isTouching || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - startX;
        startX = e.touches[0].clientX;

        document.querySelectorAll('a-gltf-model').forEach(m => {
            const rot = m.getAttribute('rotation') || { x: 90, y: 0, z: 0 };
            m.setAttribute('rotation', {
                x: rot.x,
                y: rot.y,
                z: rot.z + deltaX * 0.8
            });
        });
    }, { passive: true });

    window.addEventListener('touchend', () => { isTouching = false; });
});
