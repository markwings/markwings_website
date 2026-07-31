export function initContactParticles() {
  const section = document.querySelector(".mw-contact-section");
  if (!section || section.dataset.cp) return;
  section.dataset.cp = "1";

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;";
  section.prepend(canvas);

  // Ensure text content sits above canvas
  const hero = section.querySelector(".mw-contact__hero");
  if (hero) hero.style.position = "relative", hero.style.zIndex = "2";

  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, mx = -9999, my = -9999;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Brand colours
  const PALETTE = [
    { r: 190, g: 253, b: 0   },  // #befd00 lime
    { r: 255, g: 255, b: 255 },  // white
    { r: 196, g: 181, b: 253 },  // soft violet
    { r: 255, g: 255, b: 255 },  // white (weighted up)
  ];

  const COUNT = 90;

  function rnd(min, max) { return min + Math.random() * (max - min); }

  function mkParticle(fromEdge = false) {
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    return {
      x: fromEdge
        ? (Math.random() > 0.5 ? rnd(-5, 0) : rnd(W, W + 5))
        : rnd(0, W),
      y: fromEdge
        ? rnd(0, H)
        : rnd(0, H),
      vx: rnd(-0.25, 0.25),
      vy: rnd(-0.35, -0.05),   // gentle upward drift
      r:  rnd(0.6, 2.2),
      alpha: rnd(0.25, 0.75),
      r_: c.r, g_: c.g, b_: c.b,
      life: rnd(0.3, 1),
      decay: rnd(0.0008, 0.0022),
    };
  }

  const particles = Array.from({ length: COUNT }, () => mkParticle(false));

  function update(p) {
    // Mouse repulsion
    const dx = p.x - mx, dy = p.y - my;
    const d2 = dx * dx + dy * dy;
    const R  = 140;
    if (d2 < R * R && d2 > 0) {
      const d     = Math.sqrt(d2);
      const force = ((R - d) / R) * 0.9;
      p.vx += (dx / d) * force;
      p.vy += (dy / d) * force;
    }
    p.vx *= 0.96;
    p.vy *= 0.96;
    p.x  += p.vx;
    p.y  += p.vy;
    p.life -= p.decay;
  }

  function draw(p) {
    const a = p.alpha * Math.max(0, p.life);
    if (a <= 0) return;
    const glow = p.r * 4;
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
    g.addColorStop(0,   `rgba(${p.r_},${p.g_},${p.b_},${a})`);
    g.addColorStop(0.4, `rgba(${p.r_},${p.g_},${p.b_},${a * 0.4})`);
    g.addColorStop(1,   `rgba(${p.r_},${p.g_},${p.b_},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop() {
    if (!active) return;
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      update(p);
      draw(p);
      // Respawn dead or out-of-bounds particles
      if (p.life <= 0 || p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) {
        particles[i] = mkParticle(Math.random() > 0.6);
      }
    }
    requestAnimationFrame(loop);
  }

  // Mouse tracking
  section.addEventListener("mousemove", (e) => {
    const r = section.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });
  section.addEventListener("mouseleave", () => { mx = -9999; my = -9999; });

  // Only run when visible
  let active = false;
  new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) loop();
  }, { threshold: 0.05 }).observe(section);
}
