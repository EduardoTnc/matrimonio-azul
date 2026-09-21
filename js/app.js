/**
 * Logica de la Aplicacion de Invitacion de Boda
 * Cuenta regresiva dinamica, animaciones de scroll y utilidades
 */
document.addEventListener("DOMContentLoaded", () => {
  // Fecha objetivo de la boda: 28 de Noviembre de 2026 a las 17:00 (UTC-5)
  const weddingDate = new Date("2026-11-28T17:00:00-05:00").getTime();

  const daysEl = document.getElementById("count-days");
  const hoursEl = document.getElementById("count-hours");
  const minutesEl = document.getElementById("count-minutes");
  const secondsEl = document.getElementById("count-seconds");

  // Efecto de flip suave cuando cambia el numero
  function setDigit(el, value) {
    if (!el) return;
    const padded = String(value).padStart(2, "0");
    if (el.textContent !== padded) {
      el.style.transition = "opacity 0.15s ease, transform 0.15s ease";
      el.style.opacity = "0.3";
      el.style.transform = "translateY(-5px)";
      setTimeout(() => {
        el.textContent = padded;
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 150);
    }
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
      if (daysEl) daysEl.textContent = "00";
      if (hoursEl) hoursEl.textContent = "00";
      if (minutesEl) minutesEl.textContent = "00";
      if (secondsEl) secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setDigit(daysEl, days);
    setDigit(hoursEl, hours);
    setDigit(minutesEl, minutes);
    setDigit(secondsEl, seconds);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Animaciones de aparicion al hacer scroll con stagger escalonado
  const animateElements = document.querySelectorAll("[data-animate]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.dataset.delay || 0;
          setTimeout(() => {
            el.classList.add("in-view");
          }, parseInt(delay));
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -30px 0px"
    });

    animateElements.forEach((el, i) => {
      if (!el.dataset.delay) {
        el.dataset.delay = (i % 8) * 80;
      }
      observer.observe(el);
    });
  } else {
    animateElements.forEach((el) => el.classList.add("in-view"));
  }

  // ===================================================
  // MODAL YAPE / MESA DE REGALOS (TABS & COPIAR)
  // ===================================================
  const yapeModal = document.getElementById("yape-modal");
  const openYapeBtn = document.getElementById("open-yape-btn");
  const closeYapeBtn = document.getElementById("close-yape-btn");
  const tabBtns = document.querySelectorAll(".yape-tab-btn");
  const tabContents = document.querySelectorAll(".yape-tab-content");
  const copyActionBtns = document.querySelectorAll(".yape-copy-action-btn");
  const yapeToastMsg = document.getElementById("yape-toast-msg");

  function openYape() {
    if (yapeModal) {
      yapeModal.classList.add("open");
      yapeModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeYape() {
    if (yapeModal) {
      yapeModal.classList.remove("open");
      yapeModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (openYapeBtn) {
    openYapeBtn.addEventListener("click", openYape);
  }

  if (closeYapeBtn) {
    closeYapeBtn.addEventListener("click", closeYape);
  }

  if (yapeModal) {
    yapeModal.addEventListener("click", (e) => {
      if (e.target === yapeModal) {
        closeYape();
      }
    });
  }

  // Cambio de pestañas (Erica / Roosvelt)
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetContent = document.getElementById(`yape-tab-${target}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  // Copiar número al portapapeles
  copyActionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const phoneNumber = btn.dataset.number || "970146838";
      const textSpan = btn.querySelector(".copy-action-text");
      const originalText = textSpan ? textSpan.textContent : "COPIAR NÚMERO YAPE";
      
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(phoneNumber).then(showCopiedSuccess).catch(fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        const tempInput = document.createElement("input");
        tempInput.value = phoneNumber;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand("copy");
          showCopiedSuccess();
        } catch (err) {
          console.error("No se pudo copiar el número:", err);
        }
        document.body.removeChild(tempInput);
      }

      function showCopiedSuccess() {
        if (textSpan) textSpan.textContent = "✓ ¡NÚMERO COPIADO!";
        btn.classList.add("copied");
        if (yapeToastMsg) yapeToastMsg.classList.add("visible");
        
        setTimeout(() => {
          if (textSpan) textSpan.textContent = originalText;
          btn.classList.remove("copied");
          if (yapeToastMsg) yapeToastMsg.classList.remove("visible");
        }, 2500);
      }
    });
  });
});
