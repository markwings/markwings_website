import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
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
if (window.innerWidth < 768) {
  // Set initial state
  gsap.set("#centerCard", { scale: 0.8, opacity: 0 });
  gsap.set("#curtainLeft", { scaleY: 1, transformOrigin: "top center" });
  gsap.set("#curtainRight", { scaleY: 1, transformOrigin: "top center" });

  // Create timeline for curtain effect
  const curtainTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#planToActMobile",
      start: "top 80%",
      end: "top 20%",
      scrub: 1,
    },
  });

  // Animate curtains pulling up
  curtainTl
    .to(
      "#curtainLeft",
      {
        scaleY: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      0
    )
    .to(
      "#curtainRight",
      {
        scaleY: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      0
    )
    .to(
      "#centerCard",
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      },
      0.5
    );

  // Additional entrance animations
  gsap.fromTo(
    "#planToActMobile h1, #planToActMobile h2, #planToActMobile p",
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#planToActMobile",
        start: "top 60%",
        end: "top 30%",
        scrub: 1,
      },
    }
  );
}

// Handle window resize
window.addEventListener("resize", () => {
  ScrollTrigger.refresh();
});
