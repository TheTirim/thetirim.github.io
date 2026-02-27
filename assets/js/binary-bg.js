(() => {
  const canvas = document.getElementById('binary-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let width = 0;
  let height = 0;
  let fontSize = 16;
  let drops = [];
  let speeds = [];
  let colDigits = [];
  let colHold = [];
  let speedScale = 0.30;
  let rafId = null;
  let resizeTimer = null;
  let pointerX = 0.5;
  let pointerY = 0.5;
  let lastFrameTime = 0;

  const baseColor = '120, 255, 210';

  function resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    width = window.innerWidth;
    height = window.innerHeight;
    ctx.textBaseline = 'top';

    fontSize = Math.max(14, Math.min(18, Math.round(width / 90)));
    ctx.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;

    const columns = Math.ceil(width / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * (height / fontSize)));
    speeds = Array.from({ length: columns }, () => 0.30 + Math.random() * 0.55);
    colDigits = Array.from({ length: drops.length }, () => (Math.random() > 0.5 ? '1' : '0'));
    colHold = Array.from({ length: drops.length }, () => 12 + Math.floor(Math.random() * 28));

    renderFrame(true);
  }

  function debounce(fn, delay) {
    return (...args) => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => fn(...args), delay);
    };
  }

  function renderFrame(clearOnly = false) {
    const driftX = Math.round((pointerX - 0.5) * 6);
    const driftY = (pointerY - 0.5) * 4;
    const tailLength = 14;
    const tailStep = 1;
    const headMaxAlpha = 0.55;
    const tailMinAlpha = 0.04;

    ctx.fillStyle = 'rgba(11, 16, 32, 0.12)';
    ctx.globalAlpha = 1;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.shadowBlur = 0;

    if (clearOnly) return;

    for (let i = 0; i < drops.length; i += 1) {
      const x = i * fontSize + driftX;
      const headY = drops[i] * fontSize + driftY;

      colHold[i] -= 1;
      if (colHold[i] <= 0) {
        if (Math.random() < 0.30) {
          colDigits[i] = (colDigits[i] === '1' ? '0' : '1');
        }
        colHold[i] = 12 + Math.floor(Math.random() * 28);
      }

      for (let t = 0; t < tailLength; t += 1) {
        const y = headY - (t * tailStep * fontSize);
        if (y < -fontSize) break;

        const k = t / Math.max(tailLength - 1, 1);
        const a = Math.max(tailMinAlpha, headMaxAlpha * (1 - k) * (1 - k));

        const d = (t % 6 === 0 && Math.random() < 0.35)
          ? (colDigits[i] === '1' ? '0' : '1')
          : colDigits[i];

        ctx.fillStyle = `rgba(${baseColor}, ${a})`;
        ctx.fillText(d, x, y);
      }

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
        colDigits[i] = (Math.random() > 0.5 ? '1' : '0');
      }

      drops[i] += speeds[i] * speedScale;
    }

    ctx.shadowBlur = 0;

    ctx.globalAlpha = 1;
  }

  function animationLoop(timestamp) {
    if (prefersReducedMotion.matches) {
      rafId = null;
      renderFrame(true);
      return;
    }

    const frameInterval = document.hidden ? 320 : 24;
    if (!lastFrameTime || timestamp - lastFrameTime >= frameInterval) {
      lastFrameTime = timestamp;
      renderFrame();
    }

    rafId = window.requestAnimationFrame(animationLoop);
  }

  function startLoop() {
    if (rafId !== null || prefersReducedMotion.matches) return;
    lastFrameTime = 0;
    rafId = window.requestAnimationFrame(animationLoop);
  }

  function stopLoop() {
    if (rafId === null) return;
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  window.addEventListener('mousemove', (event) => {
    pointerX = event.clientX / Math.max(window.innerWidth, 1);
    pointerY = event.clientY / Math.max(window.innerHeight, 1);
  }, { passive: true });

  window.addEventListener('resize', debounce(resize, 150));

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (prefersReducedMotion.matches) {
        stopLoop();
      }
      return;
    }

    if (!prefersReducedMotion.matches) {
      startLoop();
    } else {
      renderFrame(true);
    }
  });

  prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) {
      stopLoop();
      renderFrame(true);
    } else {
      resize();
      startLoop();
    }
  });

  resize();
  if (!prefersReducedMotion.matches) {
    startLoop();
  }
})();
