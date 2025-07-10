// // import {gsap} from "gsap";
// // import {ScrollTrigger} from "gsap/ScrollTrigger";
// // // Register the ScrollTrigger plugin
// // gsap.registerPlugin(ScrollTrigger);

// // const divArr = document.querySelectorAll(".fade-in");

// // // divArr.forEach((div) => {
// // //   gsap.from(div, {
// // //     opacity: 0,
// // //     y: -30,
// // //     duration: 0.7,
// // //     scrollTrigger: {
// // //       trigger: div,
// // //       start: "top 80%",
// // //       end: "top 60%",
// // //       toggleActions: "play none none reverse",
// // //       markers: true,
// // //     },
// // //   });
// // // });
// // /*
// //   The animation above already animates elements from above (y: -30) and fades them in as they enter from the top (start: "top 80%").
// //   If you want the fade-in to happen as elements enter from the bottom (since your scroll is reversed), you should adjust the y value and the ScrollTrigger start/end points.
// //   For bottom-to-top scrolling, elements should animate from below (positive y), and trigger when their bottom enters the viewport.
// // */

// // divArr.forEach((divItem) => {
// //   gsap.from(divItem, {
// //     opacity: 0,
// //     y: -100, // Move up as user scrolls up (from below)
// //     scrollTrigger: {
// //       trigger: divItem,
// //       start: "bottom 70%", // When the bottom of the element hits 80% of viewport height
// //       end: "bottom 60%",
// //       // toggleActions: "play none none reverse",
// //       markers: true,
// //       scrub: true,
// //       yoyo: true, // Optional: makes the animation play in reverse when scrolling up
// //     },
// //   });
// // });

// // // gsap.from(".fade-in", {
// // //   opacity: 0,
// // //   y: 10, // Move up as user scrolls up
// // //   duration: 0.7,
// // //   scrollTrigger: {
// // //     trigger: ".fade-in",
// // //     start: "bottom 20%",
// // //     end: "bottom 20%",
// // //     toggleActions: "play none none reverse",
// // //     markers: true,
// // //   },
// // // });

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// // Tell ScrollTrigger to treat the window scroll as if it's on `.panelCon`
// ScrollTrigger.scrollerProxy(".panelCon", {
//   scrollTop(value) {
//     if (arguments.length) {
//       window.scrollTo(0, value);
//     }
//     return window.scrollY;
//   },
//   getBoundingClientRect() {
//     return {
//       top: 0,
//       left: 0,
//       width: window.innerWidth,
//       height: window.innerHeight,
//     };
//   },
//   pinType: document.querySelector(".panelCon").style.transform
//     ? "transform"
//     : "fixed",
// });

// ScrollTrigger.defaults({
//   scroller: ".panelCon", // use your fake scrolling container
// });

// const divArr = document.querySelectorAll(".fade-in");

// divArr.forEach((div) => {
//   gsap.from(div, {
//     opacity: 0,
//     y: -30,
//     duration: 1,
//     ease: "power2.out",
//     scrollTrigger: {
//       trigger: div,
//       start: "top 80%",
//       toggleActions: "play none none reverse",
//       markers: true,
//     },
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
  const fadeIns = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view"); // Remove class when it leaves viewport
        }
      });
    },
    {
      threshold: 0.4, // Trigger when 10% is visible
    }
  );

  fadeIns.forEach((el) => {
    observer.observe(el);
  });
});
