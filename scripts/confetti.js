const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiPieces = [];
const colors = ['#4361ee', '#3a0ca3', '#4cc9f0', '#f72585', '#7209b7'];
let animationId = null;
let confettiDuration = 3000; // 3 seconds

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
        opacity: Math.random() * 0.7 + 0.3,
        shape: Math.random() > 0.5 ? 'circle' : 'rect'
    };
}

function startConfetti(duration = 3000) {
    // Clear any existing confetti
    stopConfetti();
    
    // Create confetti pieces
    confettiPieces = [];
    for (let i = 0; i < 150; i++) {
        confettiPieces.push(createConfetti());
    }
    
    confettiDuration = duration;
    const startTime = Date.now();
    
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed > confettiDuration) {
            stopConfetti();
            return;
        }
        
        // Fade out towards the end
        const fadeProgress = Math.min(elapsed / confettiDuration, 1);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach((confetti, index) => {
            // Update position
            confetti.y += confetti.velocity;
            confetti.rotation += confetti.rotationSpeed;
            
            // Apply fade out effect
            const currentOpacity = confetti.opacity * (1 - fadeProgress);
            
            // Draw confetti
            ctx.save();
            ctx.translate(confetti.x, confetti.y);
            ctx.rotate(confetti.rotation * Math.PI / 180);
            ctx.globalAlpha = currentOpacity;
            ctx.fillStyle = confetti.color;
            
            if (confetti.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(0, 0, confetti.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-confetti.size/2, -confetti.size/2, confetti.size, confetti.size);
            }
            
            ctx.restore();
            
            // Recycle pieces that fall off screen
            if (confetti.y > canvas.height) {
                confettiPieces[index] = createConfetti();
            }
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function stopConfetti() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces = [];
}

// Make functions globally available
window.startConfetti = startConfetti;
window.stopConfetti = stopConfetti;

window.addEventListener('resize', resizeCanvas);