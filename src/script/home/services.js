import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initServices() {
  const track       = document.querySelector(".mw-services-track");
  const pin         = document.querySelector(".mw-services-pin");
  const strip       = document.querySelector(".mw-services-strip");
  const panels      = document.querySelectorAll(".mw-svc");
  const counter     = document.querySelector(".mw-services-hdr__count");
  const progressBar = document.querySelector(".mw-svc-progress__bar");

  if (!track || !pin || !strip || !panels.length) return;

  // ── Mobile: simple stacked reveals ──
  if (window.innerWidth < 768) {
    panels.forEach((panel) => {
      const content = panel.querySelector(".mw-svc__content");
      if (content) {
        gsap.from(content, {
          opacity: 0, y: 44, duration: 0.85, ease: "power3.out",
          scrollTrigger: { trigger: panel, start: "top 78%", once: true },
        });
      }
    });
    return;
  }

  // ── Desktop ──
  // CSS sticky fails here because <main> has overflow-x:hidden (Tailwind),
  // which implicitly makes overflow-y:auto, turning <main> into a scroll container.
  // position:sticky then sticks to <main> (which never scrolls) — does nothing.
  // Fix: manually toggle position:fixed via scroll listener.
  // position:fixed is only broken by ancestor CSS transforms, not by overflow.

  const lenis = window.__lenis;
  if (!lenis) return;

  function setup() {
    const panelW      = panels[0].getBoundingClientRect().width;
    const totalScroll = panelW * (panels.length - 1);

    // Track must be tall enough for the full pin + scroll travel
    track.style.height = `calc(100vh + ${totalScroll}px)`;

    // Reset to relative at top of track
    pin.style.position = "relative";
    pin.style.top      = "0";
    gsap.set(strip, { x: 0 });

    const revealed = new Set();
    let lastIdx    = -1;
    let pinState   = "before"; // "before" | "active" | "after"

    function setPinBefore() {
      if (pinState === "before") return;
      pinState           = "before";
      pin.style.position = "relative";
      pin.style.top      = "0";
      pin.style.left     = "";
      pin.style.width    = "";
    }

    // Seamless entry: when scroll === trackTop, the relative pin is at viewport
    // top=0, so switching to fixed top=0 produces no visual jump.
    function setPinActive() {
      if (pinState === "active") return;
      pinState           = "active";
      pin.style.position = "fixed";
      pin.style.top      = "0";
      pin.style.left     = "0";
      pin.style.width    = "100%";
    }

    // Seamless exit: at scroll === trackTop+totalScroll the fixed pin is at
    // viewport top=0; switching to absolute top:totalScroll inside the track
    // puts the pin at the same document Y — no visual jump.
    function setPinAfter() {
      if (pinState === "after") return;
      pinState           = "after";
      pin.style.position = "absolute";
      pin.style.top      = `${totalScroll}px`;
      pin.style.left     = "";
      pin.style.width    = "";
    }

    function revealPanel(panel) {
      if (!panel) return;
      const bar = panel.querySelector(".mw-svc__bar");
      const els = [".mw-svc__num", ".mw-svc__cat", ".mw-svc__title",
                   ".mw-svc__desc", ".mw-svc__metrics", ".mw-svc__pills"]
        .map((s) => panel.querySelector(s)).filter(Boolean);
      if (bar) gsap.fromTo(bar,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.6, ease: "power3.out" }
      );
      if (els.length) gsap.fromTo(els,
        { opacity: 0, y: 30, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", clearProps: "filter",
          duration: 0.7, stagger: 0.07, ease: "power3.out" }
      );
    }

    function onScroll({ scroll }) {
      // Re-measure trackTop on every tick while NOT pinned — handles font-swap
      // layout shifts (Syne loads after window.load and shifts track position).
      const trackTop = pinState !== "active"
        ? track.getBoundingClientRect().top + window.scrollY
        : (track.getBoundingClientRect().top + window.scrollY); // still read when active for accuracy

      // ── Before section ──
      if (scroll < trackTop) {
        setPinBefore();
        gsap.set(strip, { x: 0 });
        if (counter)     counter.textContent = `01 / 0${panels.length}`;
        if (progressBar) gsap.set(progressBar, { scaleX: 0 });
        return;
      }

      // ── After section ──
      if (scroll >= trackTop + totalScroll) {
        setPinAfter();
        gsap.set(strip, { x: -totalScroll });
        const last = panels.length - 1;
        if (!revealed.has(last)) { revealed.add(last); revealPanel(panels[last]); }
        if (counter)     counter.textContent = `0${panels.length} / 0${panels.length}`;
        if (progressBar) gsap.set(progressBar, { scaleX: 1 });
        return;
      }

      // ── Inside section: pin active, scrub strip ──
      setPinActive();
      const p = (scroll - trackTop) / totalScroll;
      gsap.set(strip, { x: -totalScroll * p });

      // Parallax bg words
      panels.forEach((panel, i) => {
        const bgWord = panel.querySelector(".mw-svc__bg-word");
        if (!bgWord) return;
        const cl = Math.max(0, Math.min(1, p * panels.length - i));
        gsap.set(bgWord, { opacity: cl * 0.045, x: -cl * 30 });
      });

      // Panel reveal + counter
      const idx = Math.min(Math.floor(p * panels.length), panels.length - 1);
      if (idx !== lastIdx) {
        lastIdx = idx;
        if (!revealed.has(idx)) { revealed.add(idx); revealPanel(panels[idx]); }
      }
      if (counter)     counter.textContent = `0${idx + 1} / 0${panels.length}`;
      if (progressBar) gsap.set(progressBar, { scaleX: p });
    }

    lenis.on("scroll", onScroll);
    onScroll({ scroll: lenis.scroll });
  }

  if (document.readyState === "complete") {
    setup();
  } else {
    window.addEventListener("load", setup, { once: true });
  }
}

initServices();
