import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
var mm = gsap.matchMedia();
// Desktop animation (original)
if (window.innerWidth >= 768) {
  gsap.to("#halfBlueBg", {
    rotate: "180deg",
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: "#halfBlueBg",
      scroller: "body",
      start: "top 40%",
      end: "top 0%",
      scrub: 1.5,
    },
  });
}

// Mobile curtain animation
if (window.innerWidth < 1280) {
  gsap.to("#planToActMobileBg", {
    y: "100%",
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: "#planToActMobileBg",
      scroller: "body",
      start: "top 40%",
      end: "top 0%",
      markers: true,
      scrub: 1,
    },
  });
}

// Handle window resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
