import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

var divArr = document.querySelectorAll(".fade-in");

// divArr.forEach((div) => {  
//   gsap.from(div, {
//     opacity: 0,
//     y: -30,
//     duration: 0.7,
//     scrollTrigger: {
//       trigger: div,
//       start: "top 80%",
//       end: "top 60%",
//       toggleActions: "play none none reverse",
//       markers: true,
//     },
//   });
// });
/*
  The animation above already animates elements from above (y: -30) and fades them in as they enter from the top (start: "top 80%").
  If you want the fade-in to happen as elements enter from the bottom (since your scroll is reversed), you should adjust the y value and the ScrollTrigger start/end points.
  For bottom-to-top scrolling, elements should animate from below (positive y), and trigger when their bottom enters the viewport.
*/

divArr.forEach((div) => {  
  gsap.from(div, {
    opacity: 0,
    y: -30, // Move up as user scrolls up (from below)
    scrollTrigger: {
      trigger: div,
      start: "bottom 70%", // When the bottom of the element hits 80% of viewport height
      end: "bottom 60%",
      // toggleActions: "play none none reverse",
      markers: true,
      scrub: true,
      yoyo: true, // Optional: makes the animation play in reverse when scrolling up
    },
  });
});

// gsap.from(".fade-in", {
//   opacity: 0,
//   y: 10, // Move up as user scrolls up
//   duration: 0.7,
//   scrollTrigger: {
//     trigger: ".fade-in",
//     start: "bottom 20%", 
//     end: "bottom 20%",
//     toggleActions: "play none none reverse",
//     markers: true,
//   },
// });