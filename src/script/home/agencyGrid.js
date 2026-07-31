import * as THREE from "three";

export function initAgencyGrid() {
  const section = document.querySelector(".mw-agency");
  if (!section || window.innerWidth < 768) return;

  // ── Canvas ───────────────────────────────────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;";
  section.prepend(canvas);

  const inner = section.querySelector(".mw-agency__inner");
  if (inner) { inner.style.position = "relative"; inner.style.zIndex = "1"; }

  // ── Renderer ─────────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setClearColor(0x09090f);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  const scene  = new THREE.Scene();
  scene.fog = new THREE.Fog(0x09090f, 36, 48);

  // Orthographic camera — parallel projection = perfectly flat grid.
  // Z=1.6 gives ~3° tilt from overhead so lift effect is subtle but clean.
  const S = 30;
  const initAspect = (section.offsetWidth || 1280) / (section.offsetHeight || 947);
  const camera = new THREE.OrthographicCamera(-S, S, S / initAspect, -S / initAspect, 0.1, 200);
  camera.position.set(0, 30, 1.6);
  camera.lookAt(0, 0, 0);

  // ── Grid ──────────────────────────────────────────────────────────────────────
  const COLS     = 54;
  const ROWS     = 44;
  const SPACING  = 1.00;
  const CW       = 1.00;
  const CH       = 0.28;
  const COUNT    = COLS * ROWS;
  const MAX_LIFT = 7.5;
  const LIFT_R   = 5.0;

  // ── Lime floor — exposed through gaps when cubes lift ─────────────────────────
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(COLS * SPACING, ROWS * SPACING),
    new THREE.MeshBasicMaterial({ color: 0xbefd00 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y  = -CH * 0.5 - 0.01;
  scene.add(floor);

  // ── Content texture — section text rendered to a canvas, applied to cube tops ─
  const emptyC = document.createElement("canvas");
  emptyC.width = emptyC.height = 1;
  const contentTex = new THREE.CanvasTexture(emptyC);
  contentTex.flipY = false; // canvas Y=0 is top; we handle orientation in the shader UV

  // ── Material with custom shader for top-face screen-space texture ─────────────
  const geo = new THREE.BoxGeometry(CW, CH, CW);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1e1e36, roughness: 0.45, metalness: 0.55,
  });

  // Unique cache key forces Three.js to compile a fresh program for this material
  // instead of reusing a cached MeshStandardMaterial program.
  mat.customProgramCacheKey = () => "agencyGrid-content-v1";

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.contentMap = { value: contentTex };

    // Varyings: screen-space UV + top-face flag
    shader.vertexShader = shader.vertexShader
      .replace("void main() {", `
        varying vec2 vScreenUV;
        varying float vIsTop;
        void main() {
      `)
      .replace("#include <project_vertex>", `
        #include <project_vertex>
        // normal.y === 1.0 for BoxGeometry top face (before any instance rotation)
        vIsTop = step(0.9, normal.y);
        vScreenUV = vec2(
          gl_Position.x / gl_Position.w * 0.5 + 0.5,
          0.5 - gl_Position.y / gl_Position.w * 0.5
        );
      `);

    // Inject into emissivemap slot — text bypasses PBR lighting so it glows
    // at its true canvas color (white, lime) on top of the dark cube face.
    shader.fragmentShader = shader.fragmentShader
      .replace("void main() {", `
        uniform sampler2D contentMap;
        varying vec2 vScreenUV;
        varying float vIsTop;
        void main() {
      `)
      .replace("#include <emissivemap_fragment>", `
        #include <emissivemap_fragment>
        if (vIsTop > 0.5) {
          vec4 content = texture2D(contentMap, vScreenUV);
          totalEmissiveRadiance += content.rgb * content.a;
        }
      `);
  };

  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const bx      = new Float32Array(COUNT);
  const bz      = new Float32Array(COUNT);
  const liftCur = new Float32Array(COUNT);
  const dummy   = new THREE.Object3D();

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const i = row * COLS + col;
      bx[i]  = (col - (COLS - 1) * 0.5) * SPACING;
      bz[i]  = (row - (ROWS - 1) * 0.5) * SPACING;
      dummy.position.set(bx[i], 0, bz[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
  }
  mesh.instanceMatrix.needsUpdate = true;

  // ── Lights ────────────────────────────────────────────────────────────────────
  scene.add(new THREE.AmbientLight(0x222244, 3.0));

  const fillLight = new THREE.PointLight(0x3344bb, 2.5, 80);
  fillLight.position.set(0, 30, 0);
  scene.add(fillLight);

  const topLight = new THREE.DirectionalLight(0x4466cc, 0.5);
  topLight.position.set(4, 20, 6);
  scene.add(topLight);

  const floorLight = new THREE.PointLight(0xbefd00, 0, 32);
  floorLight.position.y = -0.5;
  scene.add(floorLight);

  const rimLight = new THREE.PointLight(0x7c3aed, 0, 26);
  rimLight.position.set(-7, 3, -6);
  scene.add(rimLight);

  // ── Mouse → world XZ ─────────────────────────────────────────────────────────
  const hitPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
  );
  hitPlane.rotation.x = -Math.PI / 2;
  scene.add(hitPlane);

  const raycaster = new THREE.Raycaster();
  const ndcMouse  = new THREE.Vector2();
  let mxW = 99999, mzW = 99999;

  section.addEventListener("mousemove", (e) => {
    const r = section.getBoundingClientRect();
    ndcMouse.set(
       ((e.clientX - r.left) / r.width)  *  2 - 1,
      -((e.clientY - r.top)  / r.height) *  2 + 1
    );
    raycaster.setFromCamera(ndcMouse, camera);
    const hits = raycaster.intersectObject(hitPlane);
    if (hits.length) { mxW = hits[0].point.x; mzW = hits[0].point.z; }
  });

  section.addEventListener("mouseleave", () => { mxW = 99999; mzW = 99999; });

  // ── Resize ────────────────────────────────────────────────────────────────────
  function resize() {
    const w = section.offsetWidth, h = section.offsetHeight;
    const aspect = w / h;
    camera.left   = -S;
    camera.right  =  S;
    camera.top    =  S / aspect;
    camera.bottom = -S / aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    if (inner) rebuildContentTex();
  }
  resize();
  window.addEventListener("resize", resize);

  // ── Content texture builder ───────────────────────────────────────────────────
  function rebuildContentTex() {
    requestAnimationFrame(() => {
      const cvs = buildContentCanvas(section, inner);
      contentTex.image = cvs;
      contentTex.needsUpdate = true;
    });
  }

  // Wait for fonts then capture the DOM layout to a canvas texture
  if (inner) {
    document.fonts.ready.then(() => {
      // Two rAFs: past current paint + one more so GSAP initial states settle
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const cvs = buildContentCanvas(section, inner);
        contentTex.image = cvs;
        contentTex.needsUpdate = true;
        // Fade DOM text out — cubes carry the text from here
        inner.style.transition = "opacity 0.7s ease";
        inner.style.opacity    = "0";
        inner.style.pointerEvents = "none";
      }));
    });
  }

  // ── Loop ─────────────────────────────────────────────────────────────────────
  const LERP = 0.10;
  let active = false;

  new IntersectionObserver(
    (entries) => { entries.forEach((e) => { active = e.isIntersecting; if (active) loop(); }); },
    { threshold: 0.05 }
  ).observe(section);

  function loop() {
    if (!active) return;
    requestAnimationFrame(loop);

    let maxLift = 0;

    for (let i = 0; i < COUNT; i++) {
      const dx   = bx[i] - mxW;
      const dz   = bz[i] - mzW;
      const dist = Math.sqrt(dx * dx + dz * dz);

      const mouseLift = Math.max(0, 1 - dist / LIFT_R) * MAX_LIFT;
      liftCur[i] += (mouseLift - liftCur[i]) * LERP;
      if (liftCur[i] > maxLift) maxLift = liftCur[i];

      const tLift = Math.min(liftCur[i] / MAX_LIFT, 1);
      dummy.position.set(bx[i], liftCur[i], bz[i]);
      dummy.scale.set(1 - tLift * 0.18, 1, 1 - tLift * 0.18);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    const tn = Math.min(maxLift / MAX_LIFT, 1);
    floorLight.intensity = tn * 28;
    rimLight.intensity   = tn * 10;

    if (mxW < 99999) {
      floorLight.position.x = mxW;
      floorLight.position.z = mzW;
    }

    mesh.instanceMatrix.needsUpdate = true;
    renderer.render(scene, camera);
  }
}

// ── Canvas content renderer ───────────────────────────────────────────────────
function buildContentCanvas(section, inner) {
  const sw = section.offsetWidth;
  const sh = section.offsetHeight;
  const cvs = document.createElement("canvas");
  cvs.width  = sw;
  cvs.height = sh;
  const ctx  = cvs.getContext("2d");

  const secRect = section.getBoundingClientRect();

  function drawTextEl(el, opts = {}) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const cs = window.getComputedStyle(el);
    const x  = rect.left - secRect.left;
    const y  = rect.top  - secRect.top;
    const fs = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight) || fs * 1.3;

    ctx.save();
    ctx.font         = `${cs.fontWeight} ${Math.round(fs)}px ${cs.fontFamily}`;
    // Strip alpha from computed color — emissive canvas must be fully opaque
    // so text brightness isn't accidentally muted by CSS rgba transparency.
    ctx.fillStyle    = opts.color || solidColor(cs.color);
    ctx.textBaseline = "top";

    const text = el.textContent.trim();
    if (opts.wrap && rect.width > 0) {
      wrapText(ctx, text, x, y, rect.width, lh);
    } else {
      ctx.fillText(text, x, y);
    }
    ctx.restore();
  }

  // "The Studio" label
  drawTextEl(inner.querySelector(".mw-agency__label"));

  // Heading lines (white + lime accent)
  inner.querySelectorAll(".mw-agency__line").forEach(el => drawTextEl(el));

  // Description paragraph
  drawTextEl(inner.querySelector(".mw-agency__desc"), { wrap: true });

  // Service tags — pill border (clamped radius) + label text
  inner.querySelectorAll(".mw-agency__tags span").forEach(el => {
    const rect = el.getBoundingClientRect();
    const cs   = window.getComputedStyle(el);
    const x    = rect.left - secRect.left;
    const y    = rect.top  - secRect.top;
    const w    = rect.width;
    const h    = rect.height;
    // Clamp radius so it never exceeds half the smallest dimension (prevents arch artifacts)
    const r    = Math.min(parseFloat(cs.borderRadius) || 4, w / 2, h / 2);

    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth   = 1;
    roundRect(ctx, x, y, w, h, r);
    ctx.stroke();
    ctx.restore();

    drawTextEl(el);
  });

  return cvs;
}

// Extract RGB from a computed color string, forcing full opacity.
// CSS rgba(r,g,b,a) with low alpha would otherwise make emissive text near-invisible.
function solidColor(cssColor) {
  const m = cssColor.match(/[\d.]+/g);
  if (!m || m.length < 3) return cssColor;
  return `rgb(${m[0]},${m[1]},${m[2]})`;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/);
  let line = "", curY = y;
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line !== "") {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, curY);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
