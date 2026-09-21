/**
 * Animación interactiva del sobre y reproducción automática instantánea de música ("al toque")
 */
document.addEventListener('DOMContentLoaded', () => {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeContainer = document.querySelector('.envelope-container');
  const waxSeal = document.getElementById('wax-seal');
  const weddingAudio = document.getElementById('wedding-audio');
  const musicPill = document.getElementById('music-pill');
  const musicPlayBtn = document.getElementById('music-play-btn');
  const floatingAudioBtn = document.getElementById('floating-audio-btn');
  const openInstruction = document.querySelector('.open-instruction');

  let isAudioPlaying = false;
  let hasOpened = false;

  // Pre-cargar audio para reproducción sin latencia
  if (weddingAudio) {
    weddingAudio.load();
  }

  // Reproducción inmediata al toque
  function playAudioImmediately() {
    if (!weddingAudio) return;
    try {
      weddingAudio.volume = 0.95;
      const playPromise = weddingAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isAudioPlaying = true;
            updateAudioUI(true);
          })
          .catch((err) => {
            console.log('Autoplay restriction retry:', err);
            const unlockAudio = () => {
              weddingAudio.volume = 0.95;
              weddingAudio.play().then(() => {
                isAudioPlaying = true;
                updateAudioUI(true);
              }).catch(e => console.log('Unlock failed:', e));
            };
            document.addEventListener('click', unlockAudio, { once: true });
            document.addEventListener('touchstart', unlockAudio, { once: true });
            document.addEventListener('pointerdown', unlockAudio, { once: true });
          });
      }
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Conmutar reproducción de audio
  function toggleAudio(e) {
    if (e) {
      e.stopPropagation();
    }
    if (!weddingAudio) return;
    if (weddingAudio.paused) {
      weddingAudio.volume = 0.95;
      weddingAudio.play()
        .then(() => {
          isAudioPlaying = true;
          updateAudioUI(true);
        })
        .catch(e => console.log('Audio toggle err:', e));
    } else {
      weddingAudio.pause();
      isAudioPlaying = false;
      updateAudioUI(false);
    }
  }

  function updateAudioUI(playing) {
    if (musicPlayBtn) {
      if (playing) {
        musicPlayBtn.classList.add('playing');
        musicPlayBtn.innerHTML = `
          <svg viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" fill="#fbe69e" rx="1"/>
            <rect x="14" y="5" width="4" height="14" fill="#fbe69e" rx="1"/>
          </svg>
        `;
      } else {
        musicPlayBtn.classList.remove('playing');
        musicPlayBtn.innerHTML = `
          <svg viewBox="0 0 24 24">
            <polygon points="6 4 20 12 6 20 6 4" fill="#fbe69e"/>
          </svg>
        `;
      }
    }

    if (floatingAudioBtn) {
      if (playing) {
        floatingAudioBtn.classList.add('playing');
        floatingAudioBtn.setAttribute('title', 'Pausar música');
      } else {
        floatingAudioBtn.classList.remove('playing');
        floatingAudioBtn.setAttribute('title', 'Reproducir música');
      }
    }
  }

  // Apertura inmediata del sobre al pulsar el sello
  function openEnvelope(e) {
    if (hasOpened) return;
    hasOpened = true;

    // 1. Iniciar audio instantáneamente ("al toque") en la interacción del usuario
    playAudioImmediately();

    // 2. Activar animación 3D del sobre y despliegue de la tarjeta
    if (envelopeContainer) {
      envelopeContainer.classList.add('opening');
    }
    const appWrapper = document.querySelector('.app-wrapper');
    if (appWrapper) {
      appWrapper.classList.add('unfolding');
    }

    // 3. Revelar invitación
    setTimeout(() => {
      if (envelopeScreen) {
        envelopeScreen.classList.add('opened');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Verificación de respaldo para asegurar reproducción
      if (weddingAudio && weddingAudio.paused) {
        playAudioImmediately();
      }

      // Mostrar indicador de deslizar
      const scrollHint = document.getElementById('scroll-hint');
      if (scrollHint) {
        setTimeout(() => {
          scrollHint.classList.add('visible');
        }, 800);
      }
    }, 1000);
  }

  // Event Listeners para abrir: Sello de cera, Sobre, Texto instructivo o Pantalla
  if (waxSeal) {
    waxSeal.addEventListener('click', openEnvelope);
    waxSeal.addEventListener('pointerdown', openEnvelope);
  }
  if (envelopeContainer) {
    envelopeContainer.addEventListener('click', openEnvelope);
  }
  if (openInstruction) {
    openInstruction.addEventListener('click', openEnvelope);
    openInstruction.addEventListener('pointerdown', openEnvelope);
  }
  if (envelopeScreen) {
    envelopeScreen.addEventListener('click', (e) => {
      if (!hasOpened) openEnvelope(e);
    });
  }

  // Control del indicador de deslizar
  const scrollHint = document.getElementById('scroll-hint');
  if (scrollHint) {
    scrollHint.addEventListener('click', () => {
      window.scrollBy({ top: 450, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        scrollHint.classList.add('hidden');
      }
    }, { passive: true });
  }

  // Controles de audio interactivos
  if (musicPill) {
    musicPill.addEventListener('click', toggleAudio);
  }
  if (floatingAudioBtn) {
    floatingAudioBtn.addEventListener('click', toggleAudio);
  }

  // Exponer a window por si se requiere invocar
  window.weddingAudioToggle = toggleAudio;
  window.openWeddingEnvelope = openEnvelope;
});

