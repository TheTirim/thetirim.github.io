(() => {
  const host = document.getElementById('status-matrix');
  const canvas = document.getElementById('status-matrix-canvas');
  const percentEl = document.getElementById('status-matrix-percent');
  const textEl = document.getElementById('status-matrix-text');
  const setLine = (s) => { textEl.textContent = s; };

  if (!host || !canvas || !percentEl || !textEl) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let w = 0;
  let h = 0;
  let dpr = 1;

  // progress model: fake boot loop (tool-like)
  let progress = 0;
  const BOOT_CAP = 0.58;     // stop at 58%
  const HOLD_MIN = 0.54;     // oscillation min
  const HOLD_MAX = 0.60;     // oscillation max
  let bootDone = false;
  let boost = 0;     // hover intensity
  let pointer = 0.5; // 0..1 mouse x within host
  let blip = 0;      // 0..1 short pulse
  let tickPulse = 0; // 0..1 short pulse
  let raf = null;
  let t0 = 0;

  const baseRGB = '110, 243, 197'; // matches --accent
  const bgRGB = '11, 16, 32';

  const bootLines = [
    'booting…',
    'loading_modules…',
    'linking_projects…',
    'mounting_io…',
    'allocating_buffers…'
  ];

  const holdLines = [
    'waiting_for_input…',
    'awaiting_timeout…',
    'handshake_pending…',
    'link_idle…',
    'retrying_channel…'
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
    ctx.font = `13px ui-monospace, Menlo, Consolas, monospace`;
  }

  function rand01(seed) {
    // deterministic-ish noise (fast)
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function drawScanlines(time) {
    const step = 2;
    const a = 0.09 + boost * 0.08;
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

    // progress model: boot to BOOT_CAP, then hold/oscillate (never "complete")
    const bootSpeed = 0.010 + boost * 0.010;   // faster early boot
    const holdSpeed = 0.003 + boost * 0.003;   // gentle drift in hold state

    if (!bootDone) {
      progress += (BOOT_CAP - progress) * bootSpeed;
      if (progress >= BOOT_CAP - 0.006) {
        bootDone = true;
        progress = BOOT_CAP - 0.010;
      }
    } else {
      // oscillate between HOLD_MIN..HOLD_MAX with subtle noise
      const wave = Math.sin(time * 0.0012) * 0.012;      // slow wave
      const noise = (rand01(time * 0.0023) - 0.5) * 0.010; // small jitter
      const desired = BOOT_CAP + wave + noise;
      const clamped = Math.max(HOLD_MIN, Math.min(HOLD_MAX, desired));
      progress += (clamped - progress) * holdSpeed;
    }

    progress = Math.max(0, Math.min(HOLD_MAX, progress));

    // micro impulses (rare)
    if (rand01(time * 0.006) < (0.020 + boost * 0.030)) blip = 1;
    if (rand01(time * 0.004) < (0.030 + boost * 0.040)) tickPulse = 1;

    // decay
    blip *= 0.72;
    tickPulse *= 0.78;

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

    // rare glitch blocks (1-2 frames) for retro tool feel
    const glitchChance = 0.035 + boost * 0.04;
    if (fillW > 40 && rand01(time * 0.004) < glitchChance) {
      const gx = barX + Math.floor(rand01(time * 0.009) * Math.max(1, fillW - 18));
      const gy = barY + Math.floor(rand01(time * 0.013) * Math.max(1, barH - 10));
      const gw = 10 + Math.floor(rand01(time * 0.017) * 22);
      const gh = 6 + Math.floor(rand01(time * 0.019) * 12);
      ctx.fillStyle = `rgba(${baseRGB}, ${0.10 + boost * 0.14})`;
      ctx.fillRect(gx, gy, gw, gh);
    }

    // glow head line (subtle)
    const headJitter = bootDone ? (rand01(time * 0.01) > 0.5 ? 1 : 0) : 0;
    const headX = barX + fillW + headJitter;
    ctx.fillStyle = `rgba(${baseRGB}, ${0.16 + boost * 0.18})`;
    ctx.fillRect(barX, barY, fillW, barH);
    // head blip: a tiny overbright flash (subtle)
    const blipA = blip * (0.18 + boost * 0.18);
    if (blipA > 0.01) {
      ctx.fillStyle = `rgba(${baseRGB}, ${blipA})`;
      ctx.fillRect(headX - 6, barY, 6, barH);
    }
    ctx.fillStyle = `rgba(${baseRGB}, ${0.55 + boost * 0.15})`;
    ctx.fillRect(headX - 2, barY, 2, barH);

    // scan sweep (slow) + pointer influence
    const sweep = (time * (0.00012 + boost * 0.00008)) % 1; // 0..1
    const scanX = barX + Math.floor(barW * (0.25 * pointer + 0.75 * sweep));
    const scanW = 42;
    const scanA = 0.08 + boost * 0.14;
    ctx.fillStyle = `rgba(${baseRGB}, ${scanA})`;
    ctx.fillRect(scanX - scanW / 2, barY, scanW, barH);

    // bright core line inside sweep
    ctx.fillStyle = `rgba(${baseRGB}, ${0.22 + boost * 0.22})`;
    ctx.fillRect(scanX - 1, barY, 2, barH);

    // overlays
    drawScanlines(time);
    drawNoise(time);

    // phosphor afterglow (very subtle) - only inside bar area
    const glowA = 0.06 + boost * 0.06;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(${baseRGB}, ${glowA})`;
    // thin horizontal glow band drifting slowly
    const gy = barY + Math.floor((rand01(time * 0.0017) * 0.6 + 0.2) * barH);
    ctx.fillRect(barX, gy, barW, 2);
    ctx.restore();

    // CRT vignette (subtle)
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.1, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.28)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // HUD ticks (top + bottom)
    const tickA = (0.12 + boost * 0.10) + tickPulse * (0.18 + boost * 0.12);
    ctx.fillStyle = `rgba(255,255,255,${tickA})`;
    for (let x = 0; x <= barW; x += 24) {
      ctx.fillRect(barX + x, barY, 1, 3);
      ctx.fillRect(barX + x, barY + barH - 3, 1, 3);
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

  // rotate status lines (boot -> hold)
  window.setInterval(() => {
    if (!bootDone) {
      lineIdx = (lineIdx + 1) % bootLines.length;
      setLine(bootLines[lineIdx]);
      return;
    }
    lineIdx = (lineIdx + 1) % holdLines.length;
    setLine(holdLines[lineIdx]);
  }, 1200);

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
