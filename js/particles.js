/**
 * Lluvia Ultra-Suave de Brillos Dorados (Micro-partículas circulares)
 * Caída extremadamente lenta, serena y elegante de polvo de oro
 */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 65; // Densidad ideal para una atmósfera limpia y elegante

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  // Partícula circular de polvo dorado
  class GoldDrop {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10 - Math.random() * 30;
      this.size = Math.random() * 1.8 + 0.6; // Partículas finas y sutiles
      
      // Caída ultra lenta y suave (flotación tranquila)
      this.speedY = Math.random() * 0.18 + 0.08;
      this.speedX = (Math.random() - 0.5) * 0.08;
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.008 + 0.003;
      this.swayDistance = Math.random() * 0.8 + 0.2;
      
      this.opacity = Math.random() * 0.6 + 0.25;
      this.twinkleSpeed = Math.random() * 0.012 + 0.005;
      this.twinklePhase = Math.random() * Math.PI * 2;

      const tones = [
        '255, 245, 200', // Oro brillante luz
        '245, 215, 110', // Oro 24k
        '212, 175, 55',  // Oro clásico
        '255, 240, 180', // Oro champaña
        '250, 205, 100'  // Oro cálido
      ];
      this.color = tones[Math.floor(Math.random() * tones.length)];
    }

    update() {
      this.y += this.speedY;
      this.sway += this.swaySpeed;
      this.x += Math.sin(this.sway) * this.swayDistance + this.speedX;
      this.twinklePhase += this.twinkleSpeed;

      // Brillo pulsante tenue y suave
      const currentOpacity = Math.max(0.1, Math.min(0.85, this.opacity + Math.sin(this.twinklePhase) * 0.2));

      if (this.y > height + 15 || this.x < -15 || this.x > width + 15) {
        this.reset(false);
      }

      this.currentOpacity = currentOpacity;
    }

    draw() {
      const op = this.currentOpacity;
      ctx.save();
      ctx.translate(this.x, this.y);

      // Partícula circular de polvo dorado (sin estrellas)
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${op})`;
      ctx.shadowBlur = this.size * 3;
      ctx.shadowColor = `rgba(${this.color}, ${op * 0.75})`;
      ctx.fill();

      ctx.restore();
    }
  }

  // Inicializar partículas
  for (let i = 0; i < particleCount; i++) {
    particles.push(new GoldDrop());
  }

  // Bucle de animación optimizado
  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();
})();
