export function initLiquidDistortion() {
  const section = document.querySelector(".mw-works");
  if (!section || section.dataset.liquid) return;
  section.dataset.liquid = "1";
  section.style.position = "relative";

  const ns = "http://www.w3.org/2000/svg";
  const svgEl = document.createElementNS(ns, "svg");
  svgEl.setAttribute("aria-hidden", "true");
  svgEl.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
  document.body.appendChild(svgEl);

  const defs = document.createElementNS(ns, "defs");
  const filt = document.createElementNS(ns, "filter");
  filt.id = "mw-liquid-dist";
  filt.setAttribute("x", "0%"); filt.setAttribute("y", "0%");
  filt.setAttribute("width", "100%"); filt.setAttribute("height", "100%");
  filt.setAttribute("color-interpolation-filters", "sRGB");

  // ── 1. Animated fractal noise ──────────────────────────────────────────────
  const feTurb = document.createElementNS(ns, "feTurbulence");
  feTurb.setAttribute("type", "fractalNoise");
  feTurb.setAttribute("baseFrequency", "0.012 0.009");
  feTurb.setAttribute("numOctaves", "3");
  feTurb.setAttribute("seed", "5");
  feTurb.setAttribute("result", "noise");
  const smil = document.createElementNS(ns, "animate");
  smil.setAttribute("attributeName", "baseFrequency");
  smil.setAttribute("values", "0.010 0.008;0.015 0.011;0.010 0.008");
  smil.setAttribute("dur", "10s");
  smil.setAttribute("repeatCount", "indefinite");
  feTurb.appendChild(smil);

  // ── 2. Force noise alpha=1 ─────────────────────────────────────────────────
  //    feTurbulence fractalNoise has a varying alpha channel, which corrupts
  //    the feComposite arithmetic via premultiplied-alpha division.
  //    Forcing A=1 (slope=0 intercept=1 is always 1, no negative clamping)
  //    makes arithmetic results independent of the alpha channel.
  const noiseFixCT = document.createElementNS(ns, "feComponentTransfer");
  noiseFixCT.setAttribute("in", "noise");
  noiseFixCT.setAttribute("result", "noiseFixed");
  const noiseFixA = document.createElementNS(ns, "feFuncA");
  noiseFixA.setAttribute("type", "linear");
  noiseFixA.setAttribute("slope", "0");
  noiseFixA.setAttribute("intercept", "1");
  noiseFixCT.appendChild(noiseFixA);

  // ── 3. Flat white surface + point light → soft radial brightness at cursor ─
  //    feDiffuseLighting: output = z/sqrt(r²+z²) — naturally fades to ~0 far
  //    from cursor. z=65 gives a soft glow that peaks at cursor and tapers out
  //    over ~150px, creating organic liquid feel (no hard edge).
  const feFlood = document.createElementNS(ns, "feFlood");
  feFlood.setAttribute("flood-color", "white");
  feFlood.setAttribute("flood-opacity", "1");
  feFlood.setAttribute("result", "flat");

  const feDiff = document.createElementNS(ns, "feDiffuseLighting");
  feDiff.setAttribute("in", "flat");
  feDiff.setAttribute("surfaceScale", "1");
  feDiff.setAttribute("diffuseConstant", "1");
  feDiff.setAttribute("lighting-color", "white");
  feDiff.setAttribute("result", "mask");

  const feLight = document.createElementNS(ns, "fePointLight");
  feLight.setAttribute("x", "-9999");
  feLight.setAttribute("y", "-9999");
  feLight.setAttribute("z", "65");
  feDiff.appendChild(feLight);

  // ── 4. Localize noise to cursor zone ──────────────────────────────────────
  //    arithmetic: noise·mask − 0.5·mask + 0.5
  //    mask≈0 far away → result≈0.5 → displacement≈0   (noise_A=1 ensures this)
  //    mask=1 at cursor → result=noise → full liquid displacement
  const feComp = document.createElementNS(ns, "feComposite");
  feComp.setAttribute("in", "noiseFixed");
  feComp.setAttribute("in2", "mask");
  feComp.setAttribute("operator", "arithmetic");
  feComp.setAttribute("k1", "1");
  feComp.setAttribute("k2", "0");
  feComp.setAttribute("k3", "-0.5");
  feComp.setAttribute("k4", "0.5");
  feComp.setAttribute("result", "localized");

  // ── 6. Displace ───────────────────────────────────────────────────────────
  const feDisp = document.createElementNS(ns, "feDisplacementMap");
  feDisp.setAttribute("in", "SourceGraphic");
  feDisp.setAttribute("in2", "localized");
  feDisp.setAttribute("scale", "0");
  feDisp.setAttribute("xChannelSelector", "R");
  feDisp.setAttribute("yChannelSelector", "G");

  filt.appendChild(feTurb);
  filt.appendChild(noiseFixCT);
  filt.appendChild(feFlood);
  filt.appendChild(feDiff);
  filt.appendChild(feComp);
  filt.appendChild(feDisp);
  defs.appendChild(filt);
  svgEl.appendChild(defs);

  section.style.filter = "url(#mw-liquid-dist)";

  // ── 7. Smooth scale fade in / out ─────────────────────────────────────────
  const MAX_SCALE = 55;
  let targetScale = 0, curScale = 0, rafId = null;

  function tick() {
    curScale += (targetScale - curScale) * 0.10;
    const s = Math.abs(curScale) < 0.1 ? 0 : curScale;
    feDisp.setAttribute("scale", s.toFixed(2));
    if (Math.abs(curScale - targetScale) > 0.1) {
      rafId = requestAnimationFrame(tick);
    } else {
      feDisp.setAttribute("scale", targetScale.toFixed(2));
      rafId = null;
    }
  }

  function setScale(v) {
    targetScale = v;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  section.addEventListener("mousemove", (e) => {
    const r = section.getBoundingClientRect();
    feLight.setAttribute("x", (e.clientX - r.left).toFixed(0));
    feLight.setAttribute("y", (e.clientY - r.top).toFixed(0));
    if (targetScale < MAX_SCALE) setScale(MAX_SCALE);
  });

  section.addEventListener("mouseleave", () => {
    feLight.setAttribute("x", "-9999");
    feLight.setAttribute("y", "-9999");
    setScale(0);
  });
}
