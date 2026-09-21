/**
 * Lluvia de Brillos Dorados y Destellos Mágicos de Boda
 * Efecto de partículas doradas cayendo suavemente con estrellas parpadeantes y destellos interactivos
 */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let sparkles = [];
  const particleCount = 85; // Lluvia elegante y fluida con alta densidad de brillos

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Partícula de lluvia dorada
  class GoldDrop {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20 - Math.random() * 50;
      this.size = Math.random() * 3.2 + 0.9;
      this.speedY = Math.random() * 0.95 + 0.45; // Caída suave hacia abajo (lluvia de brillo)
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.025 + 0.01;
      this.swayDistance = Math.random() * 1.8 + 0.6;
      
      this.opacity = Math.random() * 0.75 + 0.35;
      this.twinkleSpeed = Math.random() * 0.035 + 0.015;
      this.twinklePhase = Math.random() * Math.PI * 2;
      
      // Tipo: 0 = círculo de polvo dorado, 1 = estrella de 4 puntas centelleante (✦)
      this.type = Math.random() > 0.55 ? 1 : 0;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;

      const tones = [
        '255, 245, 200', // Oro brillante luz
        '245, 215, 110', // Oro 24k
        '212, 175, 55',  // Oro clásico
        '255, 255, 240', // Destello diamante blanco-dorado
        '250, 195, 85',  // Oro cálido
        '255, 230, 150'  // Oro champaña
      ];
      this.color = tones[Math.floor(Math.random() * tones.length)];
    }

    update() {
      this.y += this.speedY;
      this.sway += this.swaySpeed;
      this.x += Math.sin(this.sway) * this.swayDistance + this.speedX;
      this.rotation += this.rotSpeed;
      this.twinklePhase += this.twinkleSpeed;

      // Brillo pulsante
      const currentOpacity = Math.max(0.1, Math.min(1, this.opacity + Math.sin(this.twinklePhase) * 0.35));

      if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }

      this.currentOpacity = currentOpacity;
    }

    draw() {
      const op = this.currentOpacity;
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.type === 1) {
        // Estrella de 4 puntas brillante (✦)
        ctx.rotate(this.rotation);
        const s = this.size * 2.4;
        
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.quadraticCurveTo(0, 0, s, 0);
        ctx.quadraticCurveTo(0, 0, 0, s);
        ctx.quadraticCurveTo(0, 0, -s, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s);
        ctx.closePath();

        ctx.fillStyle = `rgba(${this.color}, ${op})`;
        ctx.shadowBlur = s * 3;
        ctx.shadowColor = `rgba(${this.color}, ${op * 0.9})`;
        ctx.fill();

        // Destello central blanco puro
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, op * 1.2)})`;
        ctx.fill();
      } else {
        // Polvo dorado suave con halo
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${op})`;
        ctx.shadowBlur = this.size * 4;
        ctx.shadowColor = `rgba(${this.color}, ${op * 0.85})`;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // Inicializar partículas
  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldDrop());
  }

  // Destellos interactivos al mover/tocar pantalla
  function addSparkle(x, y) {
    if (sparkles.length > 25) sparkles.shift();
    sparkles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      size: Math.random() * 3 + 2,
      opacity: 1,
      decay: Math.random() * 0.03 + 0.02,
      color: '255, 235, 160'
    });
  }

  window.addEventListener('pointermove', (e) => {
    if (Math.random() > 0.6) {
      addSparkle(e.clientX, e.clientY);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0] && Math.random() > 0.5) {
      addSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Bucle de animación optimizado
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar lluvia de brillos
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    // Dibujar destellos interactivos
    for (let i = sparkles.length - 1; i >= 0; i--) {
      const sp = sparkles[i];
      sp.opacity -= sp.decay;
      if (sp.opacity <= 0) {
        sparkles.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.translate(sp.x, sp.y);
      const s = sp.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s);
      ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s);
      ctx.fillStyle = `rgba(${sp.color}, ${sp.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.9)';
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
