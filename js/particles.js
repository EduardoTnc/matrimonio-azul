/**
 * Lluvia Suave de Brillos Dorados
 * Efecto sereno y elegante de partículas doradas flotando lentamente
 */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let sparkles = [];
  const particleCount = 75; // Cantidad equilibrada y suave de brillos

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Partícula de lluvia dorada suave
  class GoldDrop {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -15 - Math.random() * 40;
      this.size = Math.random() * 2.2 + 0.8;
      
      // Velocidad lenta y tranquila (caída suave y flotante)
      this.speedY = Math.random() * 0.35 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.15;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.012 + 0.005;
      this.swayDistance = Math.random() * 1.2 + 0.4;
      
      this.opacity = Math.random() * 0.65 + 0.3;
      this.twinkleSpeed = Math.random() * 0.018 + 0.008;
      this.twinklePhase = Math.random() * Math.PI * 2;

      const tones = [
        '255, 245, 200', // Oro brillante luz
        '245, 215, 110', // Oro 24k
        '212, 175, 55',  // Oro clásico
        '255, 240, 180', // Oro champaña
        '250, 200, 95'   // Oro cálido
      ];
      this.color = tones[Math.floor(Math.random() * tones.length)];
    }

    update() {
      this.y += this.speedY;
      this.sway += this.swaySpeed;
      this.x += Math.sin(this.sway) * this.swayDistance + this.speedX;
      this.twinklePhase += this.twinkleSpeed;

      // Brillo pulsante suave
      const currentOpacity = Math.max(0.12, Math.min(0.9, this.opacity + Math.sin(this.twinklePhase) * 0.25));

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset(false);
      }

      this.currentOpacity = currentOpacity;
    }

    draw() {
      const op = this.currentOpacity;
      ctx.save();
      ctx.translate(this.x, this.y);

      // Partícula circular suave con halo dorado
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${op})`;
      ctx.shadowBlur = this.size * 3.5;
      ctx.shadowColor = `rgba(${this.color}, ${op * 0.8})`;
      ctx.fill();

      ctx.restore();
    }
  }

  // Inicializar partículas
  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldDrop());
  }

  // Destellos suaves al mover/tocar pantalla
  function addSparkle(x, y) {
    if (sparkles.length > 20) sparkles.shift();
    sparkles.push({
      x: x + (Math.random() - 0.5) * 16,
      y: y + (Math.random() - 0.5) * 16,
      size: Math.random() * 2.5 + 1.2,
      opacity: 0.85,
      decay: Math.random() * 0.025 + 0.015,
      color: '255, 235, 170'
    });
  }

  window.addEventListener('pointermove', (e) => {
    if (Math.random() > 0.7) {
      addSparkle(e.clientX, e.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0] && Math.random() > 0.6) {
      addSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Bucle de animación optimizado a velocidad lenta y suave
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar lluvia de brillos suaves
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Dibujar destellos circulares
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sp = sparkles[i];
      sp.opacity -= sp.decay;
      if (sp.opacity <= 0) {
        sparkles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${sp.color}, ${sp.opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(212, 175, 55, 0.7)';
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
