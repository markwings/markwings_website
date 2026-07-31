import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

function setup3D() {
  const scene = new THREE.Scene();
  const canvas = document.getElementById("3dCanvas");
  if (!canvas) return;

  const isMobile = () => window.innerWidth < 1024;

  function getRenderSize() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    const w = (rect && rect.width > 0) ? rect.width : window.innerWidth * 0.44;
    const h = (rect && rect.height > 0) ? rect.height : window.innerHeight;
    return { w, h };
  }

  const { w, h } = getRenderSize();

  const camera = new THREE.PerspectiveCamera(75, w / h, 5, 100);
  scene.add(camera);
  camera.position.z = 15;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);

  // ── Brand constellation: colored particles (violet/coral/blue/lime)
  const PARTICLE_COUNT = 220;
  const pPositions = new Float32Array(PARTICLE_COUNT * 3);
  const pColors = new Float32Array(PARTICLE_COUNT * 3);
  const brandColors = [
    [0.486, 0.227, 0.929], // violet
    [0.969, 0.161, 0.353], // coral
    [0.310, 0.482, 1.000], // blue
    [0.745, 1.000, 0.000], // lime
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pPositions[i * 3] = (Math.random() - 0.5) * 42;
    pPositions[i * 3 + 1] = (Math.random() - 0.5) * 26;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    const c = brandColors[Math.floor(Math.random() * brandColors.length)];
    pColors[i * 3] = c[0]; pColors[i * 3 + 1] = c[1]; pColors[i * 3 + 2] = c[2];
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pColors, 3));
  const pMat = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.07,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ── Subtle analytics grid (data/growth aesthetic)
  const gridLines = [];
  for (let y = -6; y <= 6; y += 3) gridLines.push(-17, y, -12, 17, y, -12);
  for (let x = -17; x <= 17; x += 5.5) gridLines.push(x, -6, -12, x, 6, -12);
  const gridGeo = new THREE.BufferGeometry();
  gridGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(gridLines), 3));
  scene.add(new THREE.LineSegments(
    gridGeo,
    new THREE.LineBasicMaterial({ color: 0x4f7bff, transparent: true, opacity: 0.035 })
  ));

  // ── Logo
  let logo;
  const logoBaseY = 0;
  const loader = new GLTFLoader();

  function getScalingFactor() { return Math.min(Math.max(window.innerWidth / 1000, 0.5), 1); }
  function getLogoX() { return 0; }

  loader.load("/logo.glb", (model) => {
    logo = model.scene;
    logo.scale.setScalar(2 * getScalingFactor());
    logo.position.set(getLogoX(), logoBaseY, -1);
    logo.rotation.set(1.55, -0.01, -0.65);
    scene.add(logo);
  });

  // ── Resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const { w: rw, h: rh } = getRenderSize();
      camera.aspect = rw / rh;
      camera.updateProjectionMatrix();
      renderer.setSize(rw, rh);
      if (logo) {
        const s = 2 * getScalingFactor();
        gsap.to(logo.position, { x: getLogoX(), duration: 0.5, ease: "power2.out" });
        gsap.to(logo.scale, { x: s, y: s, z: s, duration: 0.5, ease: "power2.out" });
      }
    }, 150);
  });

  // ── Pedestal
  const pedestalMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(5, 5, 1, 50),
    new THREE.MeshStandardMaterial({ color: 0x151520, opacity: 0.85, transparent: true, metalness: 0.6, roughness: 0.4 })
  );
  pedestalMesh.position.set(getLogoX(), -8, 0);
  scene.add(pedestalMesh);

  // ── Lights
  scene.add(new THREE.AmbientLight(0xffffff, 1.2));
  const d1 = new THREE.DirectionalLight(0xffffff, 1.4); d1.position.set(10, 10, 10); scene.add(d1);
  const d2 = new THREE.DirectionalLight(0xffffff, 1.0); d2.position.set(-10, -10, -10); scene.add(d2);

  const pointViolet = new THREE.PointLight(0x7c3aed, 3.5, 28); pointViolet.position.set(-8, 6, 6); scene.add(pointViolet);
  const pointCoral = new THREE.PointLight(0xf7295a, 2.5, 22); pointCoral.position.set(8, -5, 5); scene.add(pointCoral);
  const pointBlue = new THREE.PointLight(0x4f7bff, 1.8, 20); pointBlue.position.set(0, 0, -8); scene.add(pointBlue);

  // ── Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 4;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableRotate = false;
  controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 2;

  // ── Reactive lights (mouse)
  canvas.addEventListener("mw:mouse", (e) => {
    const { mx, my } = e.detail;
    pointViolet.position.x = -8 + mx * 4; pointViolet.position.y = 6 + my * -3;
    pointCoral.position.x = 8 + mx * 3; pointCoral.position.y = -5 + my * 3;
  });

  // ── Scroll-driven rotation + camera drift
  canvas.addEventListener("mw:scroll", (e) => {
    const { progress } = e.detail;
    controls.autoRotateSpeed = 4 + progress * 8;
    camera.position.y = progress * -1.5;
  });

  // ── Animate loop
  let isIntersecting = true;
  let animationId;

  function animate() {
    if (!isIntersecting) return;
    animationId = requestAnimationFrame(animate);

    const t = Date.now() * 0.001;

    // Rotate the brand constellation
    particles.rotation.y = t * 0.07;
    particles.rotation.x = Math.sin(t * 0.25) * 0.06;
    pMat.opacity = 0.32 + Math.sin(t * 0.38) * 0.13;

    // Logo gentle float
    if (logo) logo.position.y = logoBaseY + Math.sin(t * 0.6) * 0.18;

    controls.update();
    renderer.render(scene, camera);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      isIntersecting = e.isIntersecting;
      if (isIntersecting) animate(); else cancelAnimationFrame(animationId);
    });
  });
  observer.observe(canvas);
}

setup3D();
