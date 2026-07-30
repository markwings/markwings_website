const scrollIndicator = document.getElementById("scrollIndicator");
const scrollOverlay    = document.getElementById("scrollIndicator__overlay");

function updateScrollProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress   = (scrollTop / docHeight) * 100;

  scrollIndicator.style.background = `linear-gradient(to bottom, #BEFF00 ${progress}%, rgba(240,237,230,0.08) ${progress}%)`;
  scrollOverlay.style.clipPath      = `inset(0 0 ${100 - progress}% 0)`;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

let isScrolling = false;
window.addEventListener("scroll", () => {
  if (!isScrolling) {
    window.requestAnimationFrame(() => {
      updateScrollProgress();
      isScrolling = false;
    });
    isScrolling = true;
  }
});
scrollIndicator.addEventListener("click", scrollToTop);

// Initialize on load
updateScrollProgress();
