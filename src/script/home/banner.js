import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

function setup3D(){
  // 3D Scene Setup
  // Creating a scene
  const scene = new THREE.Scene();
  const canvas = document.getElementById("3dCanvas");
  
  // Initialize the camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    5,
    100
  );
  scene.add(camera);
  camera.position.z = 15;
  
  //initialize renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth/1.75, window.innerHeight/1.75);
  
  // Load the model
  let logo;
  const loader = new GLTFLoader();
  const scalingFactor = Math.min(Math.max(window.innerWidth / 1000, 0.5), 1);
  loader.load("/logo.glb", function (model) {
    logo = model.scene;
    logo.scale.setScalar(3*scalingFactor);
    logo.position.set(0,-1,-1);
    logo.rotation.set(1.55, -0.01, -0.65);
    logo.matrixWorldNeedsUpdate = true;
    scene.add(logo);
  });
  
  // Handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    logo.scale.setScalar(3 * scalingFactor);
    renderer.setSize(window.innerWidth/1.75, window.innerHeight/1.75);
  });
  // Create and load Pedastal
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
  
  
  // Adding Lights
  const ambientLight = new THREE.AmbientLight(0xffffff,1.5);
  scene.add(ambientLight);
  const directionalLight1 = new THREE.DirectionalLight(0xffffff,1.5);
  directionalLight1.position.set(10,10,10);
  scene.add(directionalLight1);
  const directionalLight2 = new THREE.DirectionalLight(0xffffff,1.5);
  directionalLight2.position.set(-10,-10,-10);
  scene.add(directionalLight2);
  const directionalLight3 = new THREE.DirectionalLight(0xffffff,1.5);
  directionalLight3.position.set(-10,-10,10);
  scene.add(directionalLight3);
  
  // Adding Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 5;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 2;
  
  // Rendering the scene
  function animate() {
    
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

setup3D();