(() => {
  const host = document.getElementById('status-matrix');
  const canvas = document.getElementById('status-matrix-canvas');
  const percentEl = document.getElementById('status-matrix-percent');
  const textEl = document.getElementById('status-matrix-text');

  if (!host || !canvas || !percentEl || !textEl) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let w = 0;
  let h = 0;
  let dpr = 1;

  // progress model: fake boot loop (tool-like)
  let progress = 0;
  let target = 0.86; // stays "in progress" (portfolio in build)
  let boost = 0;     // hover intensity
  let pointer = 0.5; // 0..1 mouse x within host
  let raf = null;
  let t0 = 0;

  const baseRGB = '110, 243, 197'; // matches --accent
  const bgRGB = '11, 16, 32';

  const lines = [
    'booting…',
    'loading_modules…',
    'linking_projects…',
    'syncing_assets…',
    'ready_for_input…'
  ];
  let lineIdx = 0;

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.floor(rect.width));
    h = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textBaseline = 'middle';
    ctx.font = `12px ui-monospace, Menlo, Consolas, monospace`;
  }

  function rand01(seed) {
    // deterministic-ish noise (fast)
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function drawScanlines(time) {
    const step = 3;
    const a = 0.05 + boost * 0.06;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    for (let y = 0; y < h; y += step) {
      if (((y + (time * 0.02)) | 0) % (step * 2) === 0) {
        ctx.fillRect(0, y, w, 1);
      }
    }
  }

  function drawNoise(time) {
    const a = 0.03 + boost * 0.07;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    const dots = 90 + Math.floor(boost * 120);
    for (let i = 0; i < dots; i++) {
      const nx = rand01(time * 0.001 + i * 12.3);
      const ny = rand01(time * 0.001 + i * 45.6);
      ctx.fillRect(nx * w, ny * h, 1, 1);
    }
  }

  function drawFrame(time) {
    // background clear
    ctx.fillStyle = `rgba(${bgRGB}, 0.55)`;
    ctx.fillRect(0, 0, w, h);

    // frame border inset
    ctx.strokeStyle = `rgba(255,255,255,0.08)`;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

    // progress easing (slow, tool-like)
    const speed = 0.004 + boost * 0.007;
    progress += (target - progress) * speed;
    if (progress > target - 0.005) {
      // small jitter so it feels alive
      progress = target - (0.006 + rand01(time * 0.002) * 0.01);
    }
    progress = Math.max(0, Math.min(0.99, progress));

    const barPad = 8;
    const barW = w - barPad * 2;
    const barH = h - 16;
    const barX = barPad;
    const barY = 8;

    // bar background
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillRect(barX, barY, barW, barH);

    // filled area
    const fillW = Math.floor(barW * progress);

    // binary pattern inside fill (retro)
    const cell = 10;
    for (let x = 0; x < fillW; x += cell) {
      for (let y = 0; y < barH; y += cell) {
        const s = (x * 0.13 + y * 0.31 + time * 0.002);
        const bit = rand01(s) > 0.5 ? '1' : '0';
        const a = 0.10 + boost * 0.08;
        ctx.fillStyle = `rgba(${baseRGB}, ${a})`;
        ctx.fillText(bit, barX + x + 3, barY + y + cell / 2);
      }
    }

    // glow head line (subtle)
    const headX = barX + fillW;
    ctx.fillStyle = `rgba(${baseRGB}, ${0.20 + boost * 0.20})`;
    ctx.fillRect(barX, barY, fillW, barH);
    ctx.fillStyle = `rgba(${baseRGB}, ${0.55 + boost * 0.15})`;
    ctx.fillRect(headX - 2, barY, 2, barH);

    // moving scan highlight (depends on pointer)
    const scanX = barX + Math.floor(barW * pointer);
    ctx.fillStyle = `rgba(${baseRGB}, ${0.06 + boost * 0.10})`;
    ctx.fillRect(scanX - 10, barY, 20, barH);

    // overlays
    drawScanlines(time);
    drawNoise(time);

    // HUD ticks
    ctx.fillStyle = `rgba(255,255,255,${0.10 + boost * 0.08})`;
    for (let x = 0; x <= barW; x += 28) {
      ctx.fillRect(barX + x, barY + barH - 2, 1, 2);
    }

    // text update
    const pct = Math.round(progress * 100);
    percentEl.textContent = `${pct}%`;
  }

  function loop(ts) {
    if (prefersReducedMotion.matches) {
      drawFrame(performance.now());
      raf = null;
      return;
    }
    if (!t0) t0 = ts;
    drawFrame(ts);
    raf = window.requestAnimationFrame(loop);
  }

  function start() {
    if (raf !== null) return;
    resize();
    raf = window.requestAnimationFrame(loop);
  }

  function stop() {
    if (raf === null) return;
    window.cancelAnimationFrame(raf);
    raf = null;
  }

  // rotate status lines (tool-like)
  window.setInterval(() => {
    lineIdx = (lineIdx + 1) % lines.length;
    textEl.textContent = lines[lineIdx];
  }, 1400);

  // interaction
  host.addEventListener('mouseenter', () => { boost = 1; }, { passive: true });
  host.addEventListener('mouseleave', () => { boost = 0; }, { passive: true });
  host.addEventListener('mousemove', (e) => {
    const r = host.getBoundingClientRect();
    pointer = (e.clientX - r.left) / Math.max(1, r.width);
    pointer = Math.max(0, Math.min(1, pointer));
  }, { passive: true });

  window.addEventListener('resize', () => resize(), { passive: true });

  prefersReducedMotion.addEventListener('change', () => {
    if (prefersReducedMotion.matches) stop();
    else start();
  });

  start();
})();
