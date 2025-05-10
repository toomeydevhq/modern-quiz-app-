const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confettiPieces = [];
const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7'];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createConfetti() {
    return {
        x: Math.random() * canvas.width,
        y: -10,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        velocity: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 10 - 5,
        opacity: Math.random() * 0.7 + 0.3
    };
}

function startConfetti() {
    // Create 100 confetti pieces
    for (let i = 0; i < 100; i++) {
        confettiPieces.push(createConfetti());
    }
    
    // Start animation
    if (!window.confettiAnimation) {
        window.confettiAnimation = true;
        animateConfetti();
    }
}

function stopConfetti() {
    window.confettiAnimation = false;
    confettiPieces.length = 0;
}

function animateConfetti() {
    if (!window.confettiAnimation) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces.forEach((confetti, index) => {
        // Update position
        confetti.y += confetti.velocity;
        confetti.rotation += confetti.rotationSpeed;
        
        // Remove if off screen
        if (confetti.y > canvas.height) {
            confettiPieces.splice(index, 1);
            confettiPieces.push(createConfetti());
        }
        
        // Draw confetti
        ctx.save();
        ctx.translate(confetti.x, confetti.y);
        ctx.rotate(confetti.rotation * Math.PI / 180);
        ctx.globalAlpha = confetti.opacity;
        ctx.fillStyle = confetti.color;
        ctx.fillRect(-confetti.size/2, -confetti.size/2, confetti.size, confetti.size);
        ctx.restore();
    });
    
    requestAnimationFrame(animateConfetti);
}

window.addEventListener('resize', resizeCanvas);