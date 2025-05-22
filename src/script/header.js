import { gsap } from "gsap";

let scrollTimeout;
window.addEventListener("scroll", function() {
  clearTimeout(scrollTimeout);
  gsap.to("header", {
    top: 0,
    duration: 0.5,
  });
  scrollTimeout = setTimeout(function() {
    gsap.to("header", {
      top: -64,
      duration: 0.5,
    });
  }, 3000);
});

window.addEventListener("mousemove", function(e) {
  const top10Percent = window.innerHeight * 0.1;
  if (e.clientY <= top10Percent) {
    gsap.to("header", {
      top: 0,
      duration: 0.5,
    });
    clearTimeout(scrollTimeout);
  }
});