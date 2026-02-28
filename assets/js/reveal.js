(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) return;

  // selectors: extend if your project uses different class names
  const selectors = [
    '.card',
    '.project-card',
    '.skill-card',
    'section',
    '.panel',
    '.glass-card'
  ];

  const nodes = new Set();
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => nodes.add(el));
  });

  const elements = Array.from(nodes).filter((el) => {
    // avoid animating tiny elements like pills/tags
    if (el.classList.contains('tag') || el.classList.contains('pill') || el.classList.contains('chip')) return false;
    return true;
  });

  // mark reveal + per-parent stagger
  const parentIndex = new Map();
  elements.forEach((el) => {
    el.classList.add('reveal');

    const parent = el.closest('section') || el.parentElement;
    const idx = parentIndex.get(parent) ?? 0;
    parentIndex.set(parent, idx + 1);

    // stagger within same section only a bit
    const delay = Math.min(idx * 70, 280);
    el.style.setProperty('--reveal-delay', `${delay}ms`);
    el.setAttribute('data-reveal-delay', '1');
  });

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  }, { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' });

  elements.forEach((el) => io.observe(el));
})();
