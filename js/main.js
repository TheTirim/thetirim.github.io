const HERO_SEL = "#hero";

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(HERO_SEL);
  if (!hero) return;

  window.requestAnimationFrame(() => {
    hero.classList.add("is-loaded");
  });
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reducedMotion) {
  const headlineWords = document.querySelectorAll(".hero-headline .hero-word.keyword-focus");
  headlineWords.forEach((word, index) => {
    window.setTimeout(() => {
      word.classList.add("is-keyword-focus");
      window.setTimeout(() => word.classList.remove("is-keyword-focus"), 420);
    }, index * 430);
  });
}

const revealElements = document.querySelectorAll("main .section:not(#hero) .reveal");
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

const confidenceElements = document.querySelectorAll(".confidence-reveal");
if ("IntersectionObserver" in window && confidenceElements.length > 0) {
  const confidenceObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-confident");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  confidenceElements.forEach((el) => confidenceObserver.observe(el));
} else {
  confidenceElements.forEach((el) => el.classList.add("is-confident"));
}
