import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.to("#halfBlueBg",{
  rotate: "180deg",
  ease: "power3.inOut",
  scrollTrigger : {
    trigger: "#halfBlueBg",
    scroller: "body",
    start: "top 30%",
    end: "top 0%",
    scrub: true,
    // markers: true
  }
})