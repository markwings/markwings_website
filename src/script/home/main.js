import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function dateTime() {
  // Date and Time Display
  let dateTimeContainer = document.getElementById("dateTime");
  let dateTimeContainer2 = document.getElementById("dateTime2");

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

document.querySelectorAll(".fadeIn").forEach((item) => {
  gsap.from(item, {
    y: 30,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: item,
      scroller: "body",
      start: "top 90%",
      end: "top 75%",
      scrub: true,
    },
  });
});

document.querySelectorAll(".threeD-element").forEach((item) => {
  function threeDAnimation(x, y) {
    let positionPx = x - item.getBoundingClientRect().left;
    let positionX = (50 - (positionPx / item.offsetWidth) * 100) / 3;
    let positionPy = y - item.getBoundingClientRect().top;
    let positionY = (50 - (positionPy / item.offsetHeight) * 100) / 3;

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

document.querySelectorAll(".threeD-video-element").forEach((item) => {
  item.addEventListener("touchstart", (e) => {
    document.getElementById("intro-bg-video").style.opacity = "1";
  });
  item.addEventListener("touchend", () => {
    document.getElementById("intro-bg-video").style.opacity = "0";
  });
});

function strings() {
  let initialPath = "M 10 200 Q 700 200 1390 200";
  let finalPath = "M 10 200 Q 700 200 1390 200";
  let el = document.getElementById("string");
  let isStringTicking = false;
  el.addEventListener("mousemove", (e) => {
    if (!isStringTicking) {
      window.requestAnimationFrame(() => {
        initialPath = `M 10 200 Q ${e.x} ${e.y - 200} 1390 200`;
        gsap.set("#string path", { attr: { d: initialPath } });
        isStringTicking = false;
      });
      isStringTicking = true;
    }
  });
  el.addEventListener("mouseleave", () => {
    gsap.to("#string path", {
      attr: {
        d: finalPath,
      },
      duration: 1,
      ease: "elastic.out(1,0.2)",
    });
  });
}
strings();
