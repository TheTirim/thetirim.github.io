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

const projectsSlider = document.querySelector("[data-projects-slider]");
const projectsTrack = document.querySelector("[data-projects-track]");
const projectsPrev = document.querySelector("[data-projects-prev]");
const projectsNext = document.querySelector("[data-projects-next]");
const projectsToggle = document.querySelector("[data-projects-toggle]");

if (projectsSlider && projectsTrack && projectsPrev && projectsNext && projectsToggle) {
  const projectCards = Array.from(projectsTrack.children);
  let currentPage = 0;
  let listMode = false;

  const getVisibleCount = () => (window.innerWidth <= 900 ? 1 : 3);

  const clampPage = () => {
    const visibleCount = getVisibleCount();
    const maxPage = Math.max(0, Math.ceil(projectCards.length / visibleCount) - 1);
    currentPage = Math.min(currentPage, maxPage);
    return { visibleCount, maxPage };
  };

  const updateProjectsSlider = () => {
    const { visibleCount, maxPage } = clampPage();

    if (listMode) {
      projectsSlider.classList.add("is-list");
      projectsTrack.style.transform = "translateX(0)";
      projectsPrev.disabled = true;
      projectsNext.disabled = true;
      projectsToggle.textContent = "Slider Ansicht";
      projectsToggle.setAttribute("aria-pressed", "true");
      return;
    }

    projectsSlider.classList.remove("is-list");
    const firstCard = projectCards[0];
    const trackStyles = window.getComputedStyle(projectsTrack);
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "16");
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const offset = currentPage * visibleCount * (cardWidth + gap);

    projectsTrack.style.transform = `translateX(-${offset}px)`;
    projectsPrev.disabled = currentPage === 0;
    projectsNext.disabled = currentPage >= maxPage;
    projectsToggle.textContent = "Alle Projekte";
    projectsToggle.setAttribute("aria-pressed", "false");
  };

  projectsPrev.addEventListener("click", () => {
    if (listMode) return;
    currentPage = Math.max(0, currentPage - 1);
    updateProjectsSlider();
  });

  projectsNext.addEventListener("click", () => {
    if (listMode) return;
    currentPage += 1;
    updateProjectsSlider();
  });

  projectsToggle.addEventListener("click", () => {
    listMode = !listMode;
    updateProjectsSlider();
  });

  window.addEventListener("resize", updateProjectsSlider);
  updateProjectsSlider();
}
