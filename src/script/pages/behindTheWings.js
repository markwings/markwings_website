import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initPreloader } from "../home/preloader.js";
import { initCursor } from "../home/cursor.js";
import { initHeroVideo } from "../home/heroVideo.js";

gsap.registerPlugin(ScrollTrigger);

initPreloader();
initCursor();

const lenis = new Lenis({ lerp: 0.15 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
window.__lenis = lenis;

initHeroVideo();

// Header scroll state
const header = document.querySelector("header");
if (header) {
  lenis.on("scroll", ({ scroll }) => {
    header.classList.toggle("scrolled", scroll > 40);
  });
}

// Hide sidebar when footer is visible
const sidebar = document.querySelector(".mw-sidebar");
const footer  = document.querySelector(".mw-footer");
if (sidebar && footer) {
  new IntersectionObserver(([entry]) => {
    sidebar.classList.toggle("mw-sidebar--hidden", entry.isIntersecting);
  }, { threshold: 0.05 }).observe(footer);
}

// DateTime
function dateTime() {
  const el  = document.getElementById("dateTime");
  const el2 = document.getElementById("dateTime2");
  const update = (c) => { if (c) c.innerHTML = new Date().toLocaleString().replace(/,/g, "<br>"); };
  update(el); update(el2);
  if (el)  setInterval(() => update(el),  1000);
  if (el2) setInterval(() => update(el2), 1000);
}
dateTime();

// Fade-in elements
document.querySelectorAll(".fadeIn").forEach((item) => {
  gsap.from(item, {
    y: 40, opacity: 0, duration: 1,
    scrollTrigger: { trigger: item, start: "top 90%", end: "top 70%", scrub: true },
  });
});
