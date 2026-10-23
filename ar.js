// Komponen "tetap-tampil":
// Setelah kartu pernah terdeteksi, model TIDAK hilang walau kamera bergerak / kartu sempat tak terlihat.
// Model diam di posisi terakhirnya sampai kartu terdeteksi lagi.
AFRAME.registerComponent('tetap-tampil', {
    init: function () {
        this.aktif = false;
        this.el.addEventListener('targetFound', () => {
            // Hanya satu target yang boleh "ditahan" agar model tidak dobel
            document.querySelectorAll('[tetap-tampil]').forEach(e => e.components['tetap-tampil'].aktif = false);
            this.aktif = true;
        });
    },
    tick: function () {
        if (this.aktif) this.el.object3D.visible = true;
    }
});

// Tampilkan status "memuat model" agar user tahu model sedang diunduh
document.addEventListener('DOMContentLoaded', () => {
    const badge = document.getElementById('badge');
    const models = [...document.querySelectorAll('a-gltf-model[src]')];
    if (!badge || models.length === 0) return;

    const teksAwal = badge.innerText;
    let sisa = models.length;
    badge.innerText = '⏳ Memuat model 3D...';

    models.forEach(m => m.addEventListener('model-loaded', () => {
        if (--sisa === 0 && badge.innerText.startsWith('⏳')) badge.innerText = teksAwal;
    }));
});
