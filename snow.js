const canvas = document.getElementById('snow');
const ctx = canvas.getContext('2d');

let width, height, flakes;

function initSnow() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    flakes = [];
    const count = Math.floor((width * height) / 10000); // Scale count with screen size

    for (let i = 0; i < count; i++) {
        flakes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 3 + 1, // Radius 1-4
            d: Math.random() * 1, // Density/Speed factor
            a: Math.random() * Math.PI // Starting angle
        });
    }
}

function drawSnow() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();

    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        ctx.moveTo(f.x, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2, true);
    }
    ctx.fill();
    updateSnow();
}

function updateSnow() {
    for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.y += Math.cos(f.a) + 1 + f.r / 2;
        f.x += Math.sin(f.a) * 2;
        f.a += 0.01;

        if (f.y > height) {
            f.y = -10;
            f.x = Math.random() * width;
        }
        if (f.x > width + 5 || f.x < -5) {
            f.x = Math.random() * width;
        }
    }
}

function animateSnow() {
    drawSnow();
    requestAnimationFrame(animateSnow);
}

window.addEventListener('resize', initSnow);
initSnow();
animateSnow();
