const scrollIndicator = document.getElementById("scrollIndicator");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progress = (scrollTop / docHeight) * 100;

  scrollIndicator.style.background = `linear-gradient(to bottom, darkblue ${progress}%, white ${progress}%)`;
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
