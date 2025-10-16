import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

function setup3D() {
  // 3D Scene Setup
  const scene = new THREE.Scene();
  const canvas = document.getElementById("3dCanvas");

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    5,
    100
  );
  scene.add(camera);
  camera.position.z = 15;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // limit pixel ratio for perf
  renderer.setSize(window.innerWidth / 1.75, window.innerHeight / 1.75);

  // Load Model
  let logo;
  const loader = new GLTFLoader();

  function getScalingFactor() {
    return Math.min(Math.max(window.innerWidth / 1000, 0.5), 1);
  }

  loader.load("/logo.glb", function (model) {
    logo = model.scene;
    logo.scale.setScalar(2 * getScalingFactor());
    logo.position.set(-0.5, 0.5, -1);
    logo.rotation.set(1.55, -0.01, -0.65);
    scene.add(logo);
  });

  // Debounced Resize Handler
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 1.75, window.innerHeight / 1.75);

      if (logo) {
        gsap.to(logo.scale, {
          x: 2 * getScalingFactor(),
          y: 2 * getScalingFactor(),
          z: 2 * getScalingFactor(),
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }, 150); // only trigger after resizing stops for 150ms
  });

  // Pedestal
  const pedastal = new THREE.CylinderGeometry(5, 5, 1, 50);
  const pedastalMaterial = new THREE.MeshStandardMaterial({
    color: 0x202020,
    opacity: 0.8,
    transparent: true,
    metalness: 0.5,
    roughness: 0.5,
  });
  const pedastalMesh = new THREE.Mesh(pedastal, pedastalMaterial);
  pedastalMesh.position.set(0, -7, 0);
  scene.add(pedastalMesh);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 1.5));
  const d1 = new THREE.DirectionalLight(0xffffff, 1.5);
  d1.position.set(10, 10, 10);
  scene.add(d1);
  const d2 = new THREE.DirectionalLight(0xffffff, 1.5);
  d2.position.set(-10, -10, -10);
  scene.add(d2);
  const d3 = new THREE.DirectionalLight(0xffffff, 1.5);
  d3.position.set(-10, -10, 10);
  scene.add(d3);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 2;

  // Animate Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

setup3D();
