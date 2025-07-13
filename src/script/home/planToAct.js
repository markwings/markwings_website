import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

gsap.to("#halfBlueBg",{
  rotate: "180deg",
  scrollTrigger : {
    trigger: "#planToAct",
    scroller: "body",
    start: "top 30%",
    end: "top 0%",
    // pin: true,
    scrub: true,
    markers: true
  }
})