import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lottie from "lottie-web";

gsap.registerPlugin(ScrollTrigger);

const animationData = [
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/designer2.json",
    renderConfig: { autoResize: true },
  },
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/designer1.json",
    renderConfig: { autoResize: true },
  },
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/video1.json",
    renderConfig: { autoResize: true },
  },
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/video2.json",
    renderConfig: { autoResize: true },
  },
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/developer2.json",
    renderConfig: { autoResize: true },
  },
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/developer1.json",
    renderConfig: { autoResize: true },
  },
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/smm2.json",
    renderConfig: { autoResize: true },
  },
  {
    renderer: "svg",
    autoplay: true,
    loop: true,
    path: "/animations/smm1.json",
    renderConfig: { autoResize: true },
  },
];

window.addEventListener("DOMContentLoaded", () => {
  const animationContainers = Array.from(
    document.querySelectorAll("#services .svg-container"),
  ).reverse();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const anim = entry.target.lottieAnim;
      if (anim) {
        if (entry.isIntersecting) {
          anim.play();
        } else {
          anim.pause();
        }
      }
    });
  });

  animationContainers.forEach((container, index) => {
    if (!animationData[index]) {
      console.warn("No animation data for index:", index);
      return;
    }

    // Clone data and disable autoplay
    const animationConfig = { ...animationData[index], autoplay: false };

    const anim = Lottie.loadAnimation({
      container: container,
      ...animationConfig,
      onError: (error) => {
        console.error(`Error loading animation at index ${index}:`, error);
      },
    });

    container.lottieAnim = anim;
    observer.observe(container);
  });
});

// GSAP Scroll Timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#services",
    scroller: "body",
    start: "top 0%",
    end: "top -150%",
    pin: true,
    scrub: 1.5,
  },
});

tl.to("#graphic-service", { y: "100%" }, "play1");

tl.from("#video-service", { y: "-100%" }, "play1");

tl.to("#video-service", { scale: 5, opacity: 0 }, "play2");

tl.from("#dev-service", { scale: 0, opacity: 0 }, "play2");

tl.to("#dev-service", { scale: 0, opacity: 0 }, "play3");

tl.from("#smm-service", { scale: 5, opacity: 0 }, "play3");
