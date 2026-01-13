// Year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Projects Carousel
const viewport = document.getElementById("projectsViewport");

if (viewport) {
  const track = viewport.querySelector(".car-track");
  const items = track ? track.querySelectorAll(".car-item") : [];
  const btns = document.querySelectorAll(".car-btn");

  if (!track || items.length === 0) {
    // Wenn HTML-Struktur nicht passt, abbrechen ohne Fehler
    console.warn("Carousel: track oder items fehlen.");
  } else {
    let index = 0;

    function getStep() {
      const itemWidth = items[0].getBoundingClientRect().width;
      const gap = 16; // muss zu CSS gap passen
      return itemWidth + gap;
    }

    function clampIndex() {
      const step = getStep();
      const visible = Math.max(1, Math.floor(viewport.clientWidth / step));
      const maxIndex = Math.max(0, items.length - visible);
      index = Math.min(Math.max(index, 0), maxIndex);
    }

    function update() {
      const step = getStep();
      track.style.transform = `translateX(${-index * step}px)`;
    }

    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        index += Number(btn.dataset.dir);
        clampIndex();
        update();
      });
    });

    // Tastatur (links/rechts) – viewport muss fokussierbar sein (tabindex="0" im HTML)
    viewport.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { index--; clampIndex(); update(); }
      if (e.key === "ArrowRight") { index++; clampIndex(); update(); }
    });

    window.addEventListener("resize", () => { clampIndex(); update(); });

    clampIndex();
    update();
  }
}
