import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


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
const scalingFactor = Math.min(Math.max(window.innerWidth / 1300, 0.5), 1);
loader.load("/logo.glb", function (model) {
  logo = model.scene;
  logo.scale.setScalar(3*scalingFactor);
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
pedastalMesh.position.set(0, -6, 0);
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

/*
// function isMobileOrVerticalTablet() {
//   // Check if mobile device
//   const isMobile =
//     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
//       navigator.userAgent
//     );

//   // Check if tablet in portrait mode
//   const isPortraitTablet = window.matchMedia(
//     "(max-width: 1024px) and (orientation: portrait)"
//   ).matches;

//   return isMobile || isPortraitTablet;
// }

// window.addEventListener("scroll", function () {
//   document.querySelector(".panelCon").style.bottom = window.scrollY * -1 + "px";
// });

// if (isMobileOrVerticalTablet()) {
//   document.getElementById("container3D").style.display = "none";
// }
// const pathPoints = [
//   {
//     scroll: 0.0,
//     pos: { x: -1.25, y: 0, z: 4 },
//     scale: 0.4,
//     rot: { x: 1.5, y: 0, z: -0.16 },
//   }, // Start
//   {
//     scroll: 0.24,
//     pos: { x: 1.5, y: 0.08, z: 4 },
//     scale: 0.33,
//     rot: { x: 1.5, y: 0, z: -12.5 },
//   },
//   {
//     scroll: 0.26,
//     pos: { x: 1.5, y: 0.08, z: 4 },
//     scale: 0.33,
//     rot: { x: 1.5, y: 0, z: -12.5 },
//   },
//   {
//     scroll: 0.49,
//     pos: { x: -0.038, y: -1, z: 0 },
//     scale: 0.15,
//     rot: { x: -11, y: 0, z: 12.5 },
//   },
//   {
//     scroll: 0.51,
//     pos: { x: -0.038, y: -1, z: 0 },
//     scale: 0.15,
//     rot: { x: -11, y: 0, z: 12.5 },
//   },
//   {
//     scroll: 0.74,
//     pos: { x: -2, y: 0, z: -2 },
//     scale: 0.35,
//     rot: { x: -11, y: 6.28, z: 12.5 },
//   },
//   {
//     scroll: 0.76,
//     pos: { x: -2, y: 0, z: -2 },
//     scale: 0.35,
//     rot: { x: -11, y: 6.28, z: 12.5 },
//   },
//   {
//     scroll: 1.0,
//     pos: { x: -2, y: -0.45, z: 0 },
//     scale: 0.7,
//     rot: { x: -11, y: 6.28, z: -12.75 },
//   }, // Final
// ];
// const camera = new THREE.PerspectiveCamera(
//   15,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   200
// );

// camera.position.z = 15;

// const scene = new THREE.Scene();
// scene.add(camera);
// let logo;
// const loader = new GLTFLoader();
// loader.load(
//   "/logo.glb",
//   function (gltf) {
//     logo = gltf.scene;

//     // Initial small size at bottom center
//     logo.position.set(-1.25, 0, 4); // Start
//     logo.scale.set(0.4, 0.4, 0.4); // Start
//     logo.rotation.set(1.5, 0, -0.16); //Start
//     logo.matrixWorldNeedsUpdate = true;
//     scene.add(logo);

//     // 3d model positioning helper function
//     // initializeGUI();

//     // modelMove();
//     setupScrollAnimation();
//   },
//   function xhr(xhr) {},
//   function (error) {}
// );

// const canvas = document.getElementById("3dCanvas");
// const renderer = new THREE.WebGLRenderer({
//   canvas,
//   antialias: true,
//   alpha: true,
// });
// renderer.setSize(window.innerWidth, window.innerHeight);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.autoRotate = true;

// controls.autoRotate = true;
// const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
// scene.add(ambientLight);
// const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
// topLight.position.set(500, 500, 500);
// scene.add(topLight);

// const reRender3D = () => {
//   requestAnimationFrame(reRender3D);
//   controls.update();
//   renderer.render(scene, camera);
// };

// reRender3D();

// // Scroll animation setup
// function setupScrollAnimation() {
//   window.addEventListener("scroll", () => {
//     if (!logo) return;

//     const scrollHeight = document.body.scrollHeight - window.innerHeight;
//     const scrollProgress = Math.min(window.scrollY / scrollHeight, 1);

//     let currentSegment = pathPoints[0];
//     let nextSegment = pathPoints[1];

//     for (let i = 0; i < pathPoints.length - 1; i++) {
//       if (
//         scrollProgress >= pathPoints[i].scroll &&
//         scrollProgress <= pathPoints[i + 1].scroll
//       ) {
//         currentSegment = pathPoints[i];
//         nextSegment = pathPoints[i + 1];
//         break;
//       }
//     }
//     // Calculate interpolation factor between segments
//     const segmentProgress =
//       (scrollProgress - currentSegment.scroll) /
//       (nextSegment.scroll - currentSegment.scroll);

//     const scalingFactor = Math.min(Math.max(window.innerWidth / 1300, 0.5), 1);

//     // Interpolate position, scale and rotation
//     const pos = {
//       x:
//         currentSegment.pos.x +
//         (nextSegment.pos.x - currentSegment.pos.x) * segmentProgress,
//       y:
//         currentSegment.pos.y +
//         (nextSegment.pos.y - currentSegment.pos.y) * segmentProgress,
//       z:
//         currentSegment.pos.z +
//         (nextSegment.pos.z - currentSegment.pos.z) * segmentProgress,
//     };

//     const scale = Math.abs(
//         currentSegment.scale +
//           (nextSegment.scale - currentSegment.scale) * segmentProgress
//     )*scalingFactor;

//     const rot = {
//       x:
//         currentSegment.rot.x +
//         (nextSegment.rot.x - currentSegment.rot.x) * segmentProgress,
//       y:
//         currentSegment.rot.y +
//         (nextSegment.rot.y - currentSegment.rot.y) * segmentProgress,
//       z:
//         currentSegment.rot.z +
//         (nextSegment.rot.z - currentSegment.rot.z) * segmentProgress,
//     };

//     // Apply with GSAP for smoothness
//     gsap.to(logo.position, {
//       x: pos.x,
//       y: pos.y - 0.1,
//       z: pos.z,
//       duration: 0.1,
//     });

//     gsap.to(logo.scale, {
//       x: scale,
//       y: scale,
//       z: scale,
//       duration: 0.1,
//     });

//     gsap.to(logo.rotation, {
//       x: rot.x,
//       y: rot.y,
//       z: rot.z,
//       duration: 0.1,
//     });
//   });
// }

// // Handle resize
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   // setupScrollAnimation();
// });
// // function handleOrientationChange() {
// //   if (isMobileOrVerticalTablet()) {
// //     if (renderer) {
// //       document.getElementById("container3D").style.display = "none";
// //       renderer.dispose();
// //     }
// //   } else {
// //     document.getElementById("container3D").style.display = "block";
// //     if (!renderer) {
// //       // Initialize Three.js if not already initialized
// //       initThreeJS();
// //     }
// //   }
// // }

// // // Listen for orientation changes
// // window.addEventListener('resize', handleOrientationChange);
// // window.addEventListener('orientationchange', handleOrientationChange);

// // // Initial check
// // handleOrientationChange();

// // let arrPositionModel = [
// //   {
// //     id: "banner",
// //     position: { x: 0, y: -1, z: 0 },
// //     rotation: { x: 0, y: 1.5, z: 0 },
// //   },
// //   {
// //     id: "intro",
// //     position: { x: 1, y: -1, z: -5 },
// //     rotation: { x: 0.5, y: -0.5, z: 0 },
// //   },
// //   {
// //     id: "description",
// //     position: { x: -1, y: -1, z: -5 },
// //     rotation: { x: 0, y: 0.5, z: 0 },
// //   },
// //   {
// //     id: "contact",
// //     position: { x: 0.8, y: -1, z: 0 },
// //     rotation: { x: 0.3, y: -0.5, z: 0 },
// //   },
// //   {
// //     id: "about",
// //     position: { x: 0.5, y: -1, z: 0 },
// //     rotation: { x: 0.3, y: -0.5, z: 0 },
// //   },
// // ];

// // const modelMove = () => {
// //   const sections = document.querySelectorAll("section");
// //   let currentSection;
// //   sections.forEach((section) => {
// //     const rect = section.getBoundingClientRect();
// //     if (rect.top <= window.innerHeight / 3) {
// //       currentSection = section.id;
// //     }
// //   });
// //   let position_active = arrPositionModel.findIndex(
// //     (val) => val.id == currentSection
// //   );
// //   if (position_active >= 0) {
// //     let new_coordinates = arrPositionModel[position_active];
// //     gsap.to(logo.position, {
// //       x: new_coordinates.position.x,
// //       y: new_coordinates.position.y,
// //       z: new_coordinates.position.z,
// //       duration: 3,
// //       ease: "power1.out",
// //     });
// //     gsap.to(logo.rotation, {
// //       x: new_coordinates.rotation.x,
// //       y: new_coordinates.rotation.y,
// //       z: new_coordinates.rotation.z,
// //       duration: 3,
// //       ease: "power1.out",
// //     });
// //   }
// // };
// // window.addEventListener("scroll", () => {
// //   if (logo) {
// //     modelMove();
// //   }
// // });
// // window.addEventListener("resize", () => {
// //   renderer.setSize(window.innerWidth, window.innerHeight);
// //   camera.aspect = window.innerWidth / window.innerHeight;
// //   camera.updateProjectionMatrix();
// // });

// // lil-gui helper function
// // function initializeGUI() {
// //   // Initialize GUI
// //   const gui = new GUI();
// //   const logoFolder = gui.addFolder("Logo Controls");
// //   // Add example controls to GUI
// //   logoFolder
// //     .add({ reset: () => logo.position.set(0, 0, -5) }, "reset")
// //     .name("Reset Position");

// //   // Add sliders for controlling ambient light intensity
// //   const lightFolder = gui.addFolder("Lighting");
// //   lightFolder
// //     .add(ambientLight, "intensity", 0, 3)
// //     .name("Ambient Intensity")
// //     .listen();
// //   lightFolder
// //     .add(topLight, "intensity", 0, 3)
// //     .name("Directional Intensity")
// //     .listen();

// //   // Add sliders for controlling camera position
// //   const cameraFolder = gui.addFolder("Camera Controls");
// //   cameraFolder.add(camera.position, "x", -50, 50).name("Camera X").listen();
// //   cameraFolder.add(camera.position, "y", -50, 50).name("Camera Y").listen();
// //   cameraFolder.add(camera.position, "z", -50, 50).name("Camera Z").listen();

// //   // Add sliders for controlling logo position
// //   const positionFolder = gui.addFolder("Logo Position");
// //   positionFolder.add(logo.position, "x", -10, 10).name("Logo X").listen();
// //   positionFolder.add(logo.position, "y", -10, 10).name("Logo Y").listen();
// //   positionFolder.add(logo.position, "z", -10, 10).name("Logo Z").listen();

// //   // Add sliders for controlling logo rotation
// //   const rotationFolder = gui.addFolder("Logo Rotation");
// //   rotationFolder
// //     .add(logo.rotation, "x", -360, 360)
// //     .name("Logo Rotation X")
// //     .listen();
// //   rotationFolder
// //     .add(logo.rotation, "y", -Math.PI, Math.PI)
// //     .name("Logo Rotation Y")
// //     .listen();
// //   rotationFolder
// //     .add(logo.rotation, "z", -360, 360)
// //     .name("Logo Rotation Z")
// //     .listen();

// //   // Add sliders for controlling logo scale
// //   const scaleFolder = gui.addFolder("Logo Scale");
// //   scaleFolder.add(logo.scale, "x", 0.1, 5).name("Logo Scale X").listen();
// //   scaleFolder.add(logo.scale, "y", 0.1, 5).name("Logo Scale Y").listen();
// //   scaleFolder.add(logo.scale, "z", 0.1, 5).name("Logo Scale Z").listen();

// //   logoFolder.open();
// //   positionFolder.open();
// //   rotationFolder.open();
// //   scaleFolder.open();
// // }
*/