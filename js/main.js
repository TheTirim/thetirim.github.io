// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const heroWords = document.querySelectorAll(".hero-reveal-group .hero-word");
heroWords.forEach((word, index) => {
  word.style.setProperty("--word-index", index);
});

const heroCursor = document.querySelector(".hero-cursor");
if (heroCursor) {
  window.setTimeout(() => {
    heroCursor.style.display = "none";
  }, 8000);
}

const hero = document.getElementById("hero");
if (hero) {
  const updateHeroDepth = (xRatio, yRatio) => {
    hero.style.setProperty("--hero-shift-x", `${xRatio * 4}px`);
    hero.style.setProperty("--hero-shift-y", `${yRatio * 3}px`);
  };

  window.addEventListener("mousemove", (event) => {
    const xRatio = (event.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (event.clientY / window.innerHeight - 0.5) * 2;
    updateHeroDepth(xRatio, yRatio);
  });

  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY, 200);
    hero.style.setProperty("--hero-shift-y", `${Math.max(-2, -y * 0.02)}px`);
  }, { passive: true });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealElements.length > 0) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach((el) => observer.observe(el));
} else {
  revealElements.forEach((el) => el.classList.add("is-visible"));
}
