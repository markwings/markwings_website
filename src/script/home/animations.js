import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Animated counters for #stats section ───
function initCounters() {
  const numberEls = document.querySelectorAll(".mw-stat__number");
  if (!numberEls.length) return;

  // Stagger the cards into view
  gsap.to(".mw-stat", {
    opacity: 1,
    y: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#stats",
      start: "top 78%",
      once: true,
    },
  });

  // Count up each number
  numberEls.forEach((el) => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2.4,
      ease: "power2.out",
      delay: 0.3,
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        once: true,
      },
      onUpdate() {
        el.textContent = Math.round(obj.val);
      },
    });
  });
}

// ─── Scroll-reactive marquee ───
// Wheel/touch driven: scroll up → left-to-right; scroll down → right-to-left; idle → left-to-right.
function initMarqueeScroll() {
  const track = document.querySelector(".mw-marquee-track");
  if (!track) return;

  track.style.animation = "none";

  const halfWidth = track.scrollWidth / 2;
  let x = 0;
  let vel = -0.5;        // negative = right-to-left (default, matches CSS)
  let targetVel = -0.5;

  // Use raw wheel events — reliable regardless of scroll library internals
  window.addEventListener("wheel", (e) => {
    const mag = Math.min(8, Math.abs(e.deltaY) * 0.04);
    // deltaY > 0 = scroll down → right-to-left (negative, same as default)
    // deltaY < 0 = scroll up  → left-to-right (positive, reverse)
    targetVel = e.deltaY > 0 ? -mag : mag;
  }, { passive: true });

  // Touch support
  let _lastTouchY = 0;
  window.addEventListener("touchstart", (e) => {
    _lastTouchY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    const dy = _lastTouchY - e.touches[0].clientY; // positive = scrolling down
    const mag = Math.min(8, Math.abs(dy) * 0.08);
    targetVel = dy > 0 ? -mag : mag;
    _lastTouchY = e.touches[0].clientY;
  }, { passive: true });

  function tick() {
    targetVel += (-0.5 - targetVel) * 0.04;  // decay toward right-to-left default
    vel += (targetVel - vel) * 0.1;
    x += vel;
    if (x < -halfWidth) x += halfWidth;
    if (x > 0) x -= halfWidth;
    track.style.transform = `translateX(${x}px)`;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// ─── Parallax on ambient orbs ───
function initOrbParallax() {
  const orbs = [
    { el: ".mw-orb--violet", y: -60 },
    { el: ".mw-orb--coral", y: 40 },
    { el: ".mw-orb--lime", y: -30 },
  ];

  orbs.forEach(({ el, y }) => {
    const node = document.querySelector(el);
    if (!node) return;
    gsap.to(node, {
      y,
      ease: "none",
      scrollTrigger: {
        trigger: ".mw-hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      },
    });
  });
}

// ─── Mouse-reactive lighting on 3D canvas ───
function initCanvasMouseLight() {
  const canvas = document.getElementById("3dCanvas");
  if (!canvas || window.innerWidth < 1024) return;

  let rafId;
  let mx = 0, my = 0;

  window.addEventListener("mousemove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;   // -1 to 1
    my = (e.clientY / window.innerHeight - 0.5) * 2;  // -1 to 1
  });

  // Dispatch custom event that banner.js can listen to
  function emitLightUpdate() {
    rafId = requestAnimationFrame(emitLightUpdate);
    canvas.dispatchEvent(new CustomEvent("mw:mouse", { detail: { mx, my } }));
  }

  ScrollTrigger.create({
    trigger: ".mw-hero",
    start: "top top",
    end: "bottom top",
    onEnter: () => { emitLightUpdate(); },
    onLeave: () => { cancelAnimationFrame(rafId); },
    onEnterBack: () => { emitLightUpdate(); },
    onLeaveBack: () => { cancelAnimationFrame(rafId); },
  });
}

// ─── Scroll-driven canvas rotation ───
function initCanvasScrollSpin() {
  ScrollTrigger.create({
    trigger: ".mw-hero",
    start: "top top",
    end: "bottom top",
    scrub: 2,
    onUpdate(self) {
      const canvas = document.getElementById("3dCanvas");
      if (canvas) {
        canvas.dispatchEvent(new CustomEvent("mw:scroll", { detail: { progress: self.progress } }));
      }
    },
  });
}

// ─── Agency intro: lines slide up, body fades in ───
function initAgencyIntro() {
  const lines = document.querySelectorAll(".js-agency-line");
  const desc  = document.querySelector(".mw-agency__desc");
  const tags  = document.querySelector(".mw-agency__tags");
  if (!lines.length) return;

  gsap.to(lines, {
    y: 0,
    duration: 1.1,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: "#agency-intro",
      start: "top 72%",
      once: true,
    },
  });

  if (desc) {
    gsap.to(desc, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "power2.out",
      scrollTrigger: { trigger: desc, start: "top 82%", once: true },
    });
  }

  if (tags) {
    gsap.to(tags, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      delay: 0.1,
      ease: "power2.out",
      scrollTrigger: { trigger: tags, start: "top 85%", once: true },
    });
  }
}

// ─── Works cards: stagger reveal via batch ───
function initWorkCards() {
  const cards = document.querySelectorAll(".js-work-card");
  if (!cards.length) return;

  ScrollTrigger.batch(cards, {
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.13,
        ease: "power3.out",
      });
    },
    start: "top 86%",
    once: true,
  });
}

// ─── Contact headline: slide in from bottom ───
function initContactReveal() {
  const headline = document.querySelector(".mw-contact__headline");
  const label    = document.querySelector(".mw-contact__label");
  const sub      = document.querySelector(".mw-contact__sub");
  if (!headline) return;

  gsap.set([label, headline, sub].filter(Boolean), { opacity: 0, y: 28 });

  gsap.to([label, headline, sub].filter(Boolean), {
    opacity: 1,
    y: 0,
    duration: 0.85,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: "#contact", start: "top 78%", once: true },
  });
}

// ─── Magnetic buttons (GSAP mousemove → translate, elastic reset) ───
function initMagneticButtons() {
  const magnets = document.querySelectorAll(".mw-magnetic");
  if (!magnets.length) return;

  magnets.forEach((wrap) => {
    const child = wrap.firstElementChild || wrap;

    wrap.addEventListener("mousemove", (e) => {
      const rect = wrap.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width  / 2);
      const dy = e.clientY - (rect.top  + rect.height / 2);
      gsap.to(child, {
        x: dx * 0.32,
        y: dy * 0.32,
        duration: 0.35,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    wrap.addEventListener("mouseleave", () => {
      gsap.to(child, {
        x: 0,
        y: 0,
        duration: 0.85,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });
    });
  });
}

// ─── Number strip: pause animation when off-screen ───
function initNumberStrip() {
  const track = document.querySelector(".mw-number-strip__track");
  if (!track) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
    },
    { threshold: 0 }
  );
  io.observe(track.parentElement);
}

// ─── Works cards: 3D tilt + visual accent on hover ───
function initWorksVisual() {
  const cards = document.querySelectorAll(".js-work-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width  - 0.5) * 12;
      const dy = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      gsap.to(card, {
        rotateX: -dy,
        rotateY: dx,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.75,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    });
  });
}

// Force ScrollTrigger to recalculate after full layout is settled
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
}, { once: true });

initCounters();
initMarqueeScroll();
initOrbParallax();
initCanvasMouseLight();
initCanvasScrollSpin();
initAgencyIntro();
initWorkCards();
initContactReveal();
initMagneticButtons();
initNumberStrip();
initWorksVisual();
