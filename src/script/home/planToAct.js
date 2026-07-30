import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

if (window.innerWidth >= 768) {
  gsap.to("#halfBlueBg", {
    rotate: "180deg",
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: "#halfBlueBg",
      start: "top 40%",
      end: "top 0%",
      scrub: 1.5,
    },
  });
}

if (window.innerWidth < 1280) {
  gsap.to("#planToActMobileBg", {
    y: "100%",
    ease: "power3.inOut",
    scrollTrigger: {
      trigger: "#planToActMobileBg",
      start: "top 40%",
      end: "top 0%",
      scrub: 1,
    },
  });
}

window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
