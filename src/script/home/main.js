import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { initPreloader } from "./preloader.js";
import { initCursor } from "./cursor.js";

gsap.registerPlugin(ScrollTrigger);

// ─── Init visual layer ───
initPreloader();
initCursor();

// ─── Lenis smooth scroll ───
const lenis = new Lenis({ lerp: 0.15 });
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// Make lenis available globally for con-btn smooth scroll
window.__lenis = lenis;

// ─── Header scroll state ───
const header = document.querySelector("header");
if (header) {
  lenis.on("scroll", ({ scroll }) => {
    if (scroll > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// ─── Hide sidebar when footer is visible ───
const sidebar = document.querySelector(".mw-sidebar");
const footer  = document.querySelector(".mw-footer");
if (sidebar && footer) {
  new IntersectionObserver(([entry]) => {
    sidebar.classList.toggle("mw-sidebar--hidden", entry.isIntersecting);
  }, { threshold: 0.05 }).observe(footer);
}

// ─── Fit footer big word to full width ───
function fitFooterWord() {
  const el = document.querySelector(".mw-footer__bigword");
  if (!el) return;
  el.style.fontSize = "100px";
  const ratio = el.parentElement.offsetWidth / el.scrollWidth;
  el.style.fontSize = ratio * 100 + "px";
}
window.addEventListener("load", fitFooterWord);
window.addEventListener("resize", fitFooterWord);

// ─── Date / Time ───
function dateTime() {
  const dateTimeContainer = document.getElementById("dateTime");
  const dateTimeContainer2 = document.getElementById("dateTime2");

  const updateTime = (container) => {
    container.innerHTML = new Date().toLocaleString().replace(/,/g, "<br>");
  };

  updateTime(dateTimeContainer);
  updateTime(dateTimeContainer2);

  let intervalId1, intervalId2;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === dateTimeContainer) {
        if (entry.isIntersecting) {
          intervalId1 = setInterval(() => updateTime(dateTimeContainer), 1000);
        } else {
          clearInterval(intervalId1);
        }
      } else if (entry.target === dateTimeContainer2) {
        if (entry.isIntersecting) {
          intervalId2 = setInterval(() => updateTime(dateTimeContainer2), 1000);
        } else {
          clearInterval(intervalId2);
        }
      }
    });
  });

  if (dateTimeContainer) observer.observe(dateTimeContainer);
  if (dateTimeContainer2) observer.observe(dateTimeContainer2);
}
dateTime();

// ─── Fade-in elements ───
document.querySelectorAll(".fadeIn").forEach((item) => {
  gsap.from(item, {
    y: 30,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: item,
      start: "top 90%",
      end: "top 75%",
      scrub: true,
    },
  });
});

// ─── 3D tilt elements ───
document.querySelectorAll(".threeD-element").forEach((item) => {
  function threeDAnimation(x, y) {
    const positionPx = x - item.getBoundingClientRect().left;
    const positionX = (50 - (positionPx / item.offsetWidth) * 100) / 3;
    const positionPy = y - item.getBoundingClientRect().top;
    const positionY = (50 - (positionPy / item.offsetHeight) * 100) / 3;
    item.style.setProperty("--rX", positionX + "deg");
    item.style.setProperty("--rY", positionY + "deg");
  }

  let isTicking = false;
  item.addEventListener("mousemove", (e) => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        threeDAnimation(e.x, e.y);
        isTicking = false;
      });
      isTicking = true;
    }
  });
  item.addEventListener("mouseout", () => {
    item.style.setProperty("--rX", "0deg");
    item.style.setProperty("--rY", "0deg");
  });
  item.addEventListener("touchend", () => {
    item.style.setProperty("--rX", "0deg");
    item.style.setProperty("--rY", "0deg");
  });
});

// ─── Touch video reveal ───
document.querySelectorAll(".threeD-video-element").forEach((item) => {
  item.addEventListener("touchstart", () => {
    document.getElementById("intro-bg-video").style.opacity = "1";
  });
  item.addEventListener("touchend", () => {
    document.getElementById("intro-bg-video").style.opacity = "0";
  });
});

// ─── Interactive string ───
function strings() {
  const initialPath = "M 10 200 Q 700 200 1390 200";
  const finalPath = "M 10 200 Q 700 200 1390 200";
  const el = document.getElementById("string");
  if (!el) return;

  let isStringTicking = false;
  el.addEventListener("mousemove", (e) => {
    if (!isStringTicking) {
      window.requestAnimationFrame(() => {
        const path = `M 10 200 Q ${e.x} ${e.y - 200} 1390 200`;
        gsap.set("#string path", { attr: { d: path } });
        isStringTicking = false;
      });
      isStringTicking = true;
    }
  });
  el.addEventListener("mouseleave", () => {
    gsap.to("#string path", {
      attr: { d: finalPath },
      duration: 1,
      ease: "elastic.out(1,0.2)",
    });
  });
}
strings();
