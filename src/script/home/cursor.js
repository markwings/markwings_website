import gsap from "gsap";

export function initCursor() {
  // Skip on touch-primary devices
  if (window.matchMedia("(hover: none)").matches) return;

  const cursor = document.querySelector(".mw-cursor");
  if (!cursor) return;
  cursor.style.display = "block";

  const dot = cursor.querySelector(".mw-cursor__dot");
  const ring = cursor.querySelector(".mw-cursor__ring");

  let mouseX = -100;
  let mouseY = -100;
  let ringX = mouseX;
  let ringY = mouseY;

  // Dot: snaps instantly; ring: lerps behind
  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    gsap.set(dot, { x: mouseX, y: mouseY });
    gsap.set(ring, { x: ringX, y: ringY });
  });

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  // Hover state: enlarge ring
  const hoverEls = document.querySelectorAll(
    "a, button, [data-cursor-hover], label, input, select, textarea"
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursor.classList.add("mw-cursor--hover")
    );
    el.addEventListener("mouseleave", () =>
      cursor.classList.remove("mw-cursor--hover")
    );
  });
}
