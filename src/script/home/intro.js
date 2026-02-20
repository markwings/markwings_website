import lottie from "lottie-web";

let currentAnim;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (currentAnim) {
      if (entry.isIntersecting) {
        currentAnim.play();
      } else {
        currentAnim.pause();
      }
    }
  });
});

function loadLottie(path) {
  if (currentAnim) currentAnim.destroy(); // remove old animation
  const container = document.getElementById("intro-bg-svg-container");
  currentAnim = lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: true,
    autoplay: false, // We'll rely on the observer
    path,
  });

  // Re-observe if recreated
  if (container) {
    observer.observe(container);
  }
}

function chooseAnimation() {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  const isTab = window.matchMedia("(max-width: 1024px)").matches;

  if (isMobile) loadLottie("/animations/marioMobile.json");
  else if (isTab) loadLottie("/animations/marioTab.json");
  else loadLottie("/animations/marioDesktop.json");
}

window.addEventListener("resize", chooseAnimation);
document.addEventListener("DOMContentLoaded", () => {
  chooseAnimation();
});
