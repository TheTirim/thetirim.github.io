document.getElementById("year").textContent = new Date().getFullYear();

// Year
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Projects Carousel
const viewport = document.getElementById("projectsViewport");
if (viewport) {
  const track = viewport.querySelector(".car-track");
  const items = track.querySelectorAll(".car-item");
  const btns = document.querySelectorAll(".car-btn");

  let index = 0;

  function update() {
    const itemWidth = items[0].getBoundingClientRect().width;
    const gap = 16; // muss zu CSS gap passen
    const step = itemWidth + gap;
    track.style.transform = `translateX(${-index * step}px)`;
  }

  function clampIndex() {
    // wie viele Karten passen sichtbar rein?
    const itemWidth = items[0].getBoundingClientRect().width + 16;
    const visible = Math.max(1, Math.floor(viewport.clientWidth / itemWidth));
    const maxIndex = Math.max(0, items.length - visible);
    index = Math.min(Math.max(index, 0), maxIndex);
  }

  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      index += Number(btn.dataset.dir);
      clampIndex();
      update();
    });
  });

  // Tastatur (links/rechts)
  viewport.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { index--; clampIndex(); update(); }
    if (e.key === "ArrowRight") { index++; clampIndex(); update(); }
  });

  window.addEventListener("resize", () => { clampIndex(); update(); });

  clampIndex();
  update();
}

