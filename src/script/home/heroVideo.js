import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// ─── Stop points ─────────────────────────────────────────────────────────────
// at:   where in the video to pause (0–1 fraction of total duration)
// hold: how much of the phase-1 scroll distance to spend frozen on that frame
//       (0.10 = 10% of the video-scrub scroll range)
const STOPS = [
  // { at: 0.25, hold: 0.12 },
  // { at: 0.55, hold: 0.12 },
  // { at: 0.80, hold: 0.10 },
];

// Build a piecewise scroll→videoProgress mapping with flat plateaus at each stop.
function buildWaypoints(stops) {
  const sorted = [...stops].sort((a, b) => a.at - b.at);
  const totalHold = sorted.reduce((s, p) => s + p.hold, 0);
  const movingScroll = 1 - totalHold;

  // Video segment lengths between stops (and before first / after last)
  const breakpoints = [0, ...sorted.map(p => p.at), 1];
  const segments = breakpoints.slice(1).map((v, i) => v - breakpoints[i]);

  const waypoints = [{ scroll: 0, video: 0 }];
  let scrollCursor = 0;

  for (let i = 0; i < sorted.length; i++) {
    scrollCursor += segments[i] * movingScroll;
    waypoints.push({ scroll: scrollCursor, video: sorted[i].at }); // arrive at frame
    scrollCursor += sorted[i].hold;
    waypoints.push({ scroll: scrollCursor, video: sorted[i].at }); // hold ends
  }
  waypoints.push({ scroll: 1, video: 1 });
  return waypoints;
}

// Map a phase-1 progress value (0–1) through the waypoints → video progress (0–1)
function mapProgress(p, waypoints) {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  for (let i = 1; i < waypoints.length; i++) {
    const a = waypoints[i - 1], b = waypoints[i];
    if (p <= b.scroll) {
      const span = b.scroll - a.scroll;
      if (span === 0) return b.video;
      return a.video + ((p - a.scroll) / span) * (b.video - a.video);
    }
  }
  return 1;
}

export function initHeroVideo() {
  const videoWrap = document.getElementById("heroVideoWrap");
  const video = document.getElementById("heroVideo");
  const placeholder = videoWrap?.querySelector(".mw-hero__video-ph");
  const videoSection = document.getElementById("videoSection");
  const header = document.querySelector("header");
  const dateTime = document.getElementById("dateTime");

  if (!videoWrap || !videoSection || !video) return;

  const uiEls = [header, dateTime].filter(Boolean);

  function hideUI() { gsap.to(uiEls, { opacity: 0, duration: 0.4, pointerEvents: "none" }); }
  function showUI() { gsap.to(uiEls, { opacity: 1, duration: 0.5, pointerEvents: "auto" }); }

  const waypoints = buildWaypoints(STOPS);
  let tx = -1, ty = -1, measured = false;
  const ease = gsap.parseEase("power2.inOut");

  function measureTarget() {
    const wSpan = document.querySelector(".mw-hero__line--solid .mw-hero__word");
    if (!wSpan) return false;
    const tNode = wSpan.firstChild;
    if (!tNode || tNode.nodeType !== Node.TEXT_NODE) return false;
    const iIdx = tNode.textContent.indexOf("i");
    if (iIdx === -1) return false;
    const range = document.createRange();
    range.setStart(tNode, iIdx);
    range.setEnd(tNode, iIdx + 1);
    const r = range.getBoundingClientRect();
    if (!r.width) return false;
    tx = r.left + r.width * 0.5;
    ty = r.top + r.height * 0.11;
    measured = true;
    return true;
  }

  window.addEventListener("load", () => setTimeout(measureTarget, 500), { once: true });
  window.addEventListener("resize", () => { measured = false; ScrollTrigger.refresh(); });

  function hidePlaceholder() {
    if (!placeholder) return;
    gsap.to(placeholder, {
      opacity: 0, duration: 0.4,
      onComplete: () => { placeholder.style.display = "none"; },
    });
  }

  function createScrollTrigger() {
    const dur = video.duration || 10;
    const videoScrollPx = Math.round(dur * 200);
    const totalScrollPx = Math.min(
      Math.round(videoScrollPx / 0.82),
      Math.round(window.innerHeight * 30)
    );

    // Set the wrapper height: 100vh (banner) + extra scroll for video
    // The sticky banner fills 100vh and sticks while the wrapper provides the scroll range
    videoSection.style.height = `calc(100vh + ${totalScrollPx}px)`;

    // Refresh after resizing videoSection so all other ScrollTriggers recompute
    ScrollTrigger.refresh();

    // No pin needed — CSS sticky on #banner handles it natively (Lenis-compatible)
    ScrollTrigger.create({
      trigger: videoSection,
      start: "top top",
      end: "bottom bottom",

      // Show UI when entering from above (page first load / scroll back to top)
      onEnter()     { hideUI(); },
      // User scrolled past the end of the video section — restore UI
      onLeave()     { showUI(); },
      // Scrolled back into the section from below
      onEnterBack() { hideUI(); },
      // Scrolled above the trigger start (overscroll / bounce back to top)
      onLeaveBack() {
        showUI();
        gsap.set(videoWrap, { clearProps: "clipPath,opacity" });
        if (!isNaN(video.duration)) video.currentTime = 0;
      },

      onUpdate(self) {
        const p = self.progress;
        if (!measured) measureTarget();

        // Phase 1 (0 → 0.82): scrub video through waypoints (lerped for smoothness)
        if (video.duration && !isNaN(video.duration)) {
          const phase1 = gsap.utils.clamp(0, 1, p / 0.82);
          const targetTime = mapProgress(phase1, waypoints) * video.duration;
          gsap.to(video, { currentTime: targetTime, duration: 0.4, ease: "none", overwrite: "auto" });
        }

        // Phase 2 (0.82 → 1.0): clip-path shrinks to the i-dot
        const raw = gsap.utils.clamp(0, 1, (p - 0.82) / 0.18);
        const e = ease(raw);

        if (raw <= 0) {
          gsap.set(videoWrap, { clearProps: "clipPath,opacity" });
          return;
        }
        if (raw >= 1) {
          gsap.set(videoWrap, { clipPath: `circle(0px at ${tx}px ${ty}px)`, opacity: 0 });
          return;
        }

        const bigR = Math.hypot(window.innerWidth, window.innerHeight);
        const r = gsap.utils.interpolate(bigR, 0, e);
        const cx = gsap.utils.interpolate(window.innerWidth * 0.5, tx, e);
        const cy = gsap.utils.interpolate(window.innerHeight * 0.5, ty, e);
        gsap.set(videoWrap, { clipPath: `circle(${r}px at ${cx}px ${cy}px)`, opacity: 1 });
      },
    });
  }

  if (video.readyState >= 1) {
    hidePlaceholder();
    createScrollTrigger();
  } else {
    video.addEventListener("loadedmetadata", () => {
      hidePlaceholder();
      createScrollTrigger();
    }, { once: true });
  }
}
