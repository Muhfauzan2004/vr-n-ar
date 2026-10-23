// ar.js - Universal WebAR Racing Engine
// Fitur:
// 1. Putar Mobil 360° (Swipe Layar & Mouse Drag)
// 2. Tombol Pintas Inspeksi: Depan, Belakang (Diffuser & Knalpot), dan Auto-Putar 360°
// 3. Status Badge & Tracking Stabil

let currentAngle = 0;
let isSpinning = false;
let spinInterval = null;

// Mengatur sudut putaran mobil (misal 0 untuk depan, 180 untuk belakang)
function setAngle(deg) {
    currentAngle = deg;
    isSpinning = false;
    updatePivots();
    updateSpinButton();
}

// Menyalakan / mematikan putaran otomatis 360 derajat
function toggleSpin() {
    isSpinning = !isSpinning;
    updateSpinButton();
}

function updateSpinButton() {
    const btn = document.getElementById('btn-spin');
    if (btn) {
        btn.innerText = isSpinning ? '⏸️ Berhenti' : '▶️ Putar 360°';
        btn.style.background = isSpinning ? '#e11d48' : 'rgba(15, 23, 42, 0.85)';
    }
}

function updatePivots() {
    document.querySelectorAll('.ar-pivot').forEach(pivot => {
        pivot.setAttribute('rotation', `0 0 ${currentAngle}`);
    });
}

// Loop animasi putaran otomatis
function animLoop() {
    if (isSpinning) {
        currentAngle = (currentAngle + 0.8) % 360;
        updatePivots();
    }
    requestAnimationFrame(animLoop);
}
requestAnimationFrame(animLoop);

// Kontrol Sentuh Layar (Touch Swipe) & Mouse Drag
window.addEventListener('DOMContentLoaded', () => {
    let startX = 0;
    let isDragging = false;

    // Mobile Touch
    window.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            startX = e.touches[0].clientX;
            isDragging = true;
            isSpinning = false;
            updateSpinButton();
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;
        const deltaX = e.touches[0].clientX - startX;
        startX = e.touches[0].clientX;
        currentAngle += deltaX * 0.6;
        updatePivots();
    }, { passive: true });

    window.addEventListener('touchend', () => { isDragging = false; });

    // Desktop Mouse Drag
    window.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        startX = e.clientX;
        isDragging = true;
        isSpinning = false;
        updateSpinButton();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        startX = e.clientX;
        currentAngle += deltaX * 0.6;
        updatePivots();
    });

    window.addEventListener('mouseup', () => { isDragging = false; });
});
