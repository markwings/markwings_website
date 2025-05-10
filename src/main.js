import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";

window.addEventListener("scroll", function () {
  document.querySelector(".panelCon").style.bottom = window.scrollY * -1 + "px";
});

const camera = new THREE.PerspectiveCamera(
  15,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 15;

const scene = new THREE.Scene();
let logo;
const loader = new GLTFLoader();

loader.load(
  "/logo.glb",
  function (gltf) {
    logo = gltf.scene;

    // Initial small size at bottom center
    logo.position.set(0, 0, -5); // Start at bottom
    logo.scale.set(0.1, 0.1, 0.1); // Start very small
    logo.rotation.set(0, 0, 0);

    scene.add(logo);

    // modelMove();
    setupScrollAnimation();
  },
  function xhr(xhr) {},
  function (error) {}
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);
const topLight = new THREE.DirectionalLight(0xffffff, 1.5);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
};

reRender3D();

// let arrPositionModel = [
//   {
//     id: "banner",
//     position: { x: 0, y: -1, z: 0 },
//     rotation: { x: 0, y: 1.5, z: 0 },
//   },
//   {
//     id: "intro",
//     position: { x: 1, y: -1, z: -5 },
//     rotation: { x: 0.5, y: -0.5, z: 0 },
//   },
//   {
//     id: "description",
//     position: { x: -1, y: -1, z: -5 },
//     rotation: { x: 0, y: 0.5, z: 0 },
//   },
//   {
//     id: "contact",
//     position: { x: 0.8, y: -1, z: 0 },
//     rotation: { x: 0.3, y: -0.5, z: 0 },
//   },
//   {
//     id: "about",
//     position: { x: 0.5, y: -1, z: 0 },
//     rotation: { x: 0.3, y: -0.5, z: 0 },
//   },
// ];

// const modelMove = () => {
//   const sections = document.querySelectorAll("section");
//   let currentSection;
//   sections.forEach((section) => {
//     const rect = section.getBoundingClientRect();
//     if (rect.top <= window.innerHeight / 3) {
//       currentSection = section.id;
//     }
//   });
//   let position_active = arrPositionModel.findIndex(
//     (val) => val.id == currentSection
//   );
//   if (position_active >= 0) {
//     let new_coordinates = arrPositionModel[position_active];
//     gsap.to(logo.position, {
//       x: new_coordinates.position.x,
//       y: new_coordinates.position.y,
//       z: new_coordinates.position.z,
//       duration: 3,
//       ease: "power1.out",
//     });
//     gsap.to(logo.rotation, {
//       x: new_coordinates.rotation.x,
//       y: new_coordinates.rotation.y,
//       z: new_coordinates.rotation.z,
//       duration: 3,
//       ease: "power1.out",
//     });
//   }
// };
// window.addEventListener("scroll", () => {
//   if (logo) {
//     modelMove();
//   }
// });
// window.addEventListener("resize", () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// });


// Scroll animation setup
function setupScrollAnimation() {
  // Define key points for zig-zag path (normalized scroll positions 0-1)
  const pathPoints = [
    {
      scroll: 0.0,
      pos: { x: 0, y: -1.5, z: -2 },
      scale: 0.4,
      rot: { x: 1.5, y: -0.1, z: 0.1 },
    }, // Start
    {
      scroll: 0.2,
      pos: { x: -1, y: -2, z: -4 },
      scale: 0.33,
      rot: { x: 0.2, y: 0.5, z: 0 },
    },
    {
      scroll: 0.4,
      pos: { x: 1, y: -1.5, z: -3 },
      scale: 0.49,
      rot: { x: 0.4, y: -0.5, z: 0.1 },
    },
    {
      scroll: 0.6,
      pos: { x: -0.5, y: -1, z: -2 },
      scale: 0.66,
      rot: { x: 0.6, y: 0.8, z: -0.1 },
    },
    {
      scroll: 0.8,
      pos: { x: 0.5, y: 0, z: -1 },
      scale: 0.83,
      rot: { x: 0.8, y: -0.8, z: 0.2 },
    },
    {
      scroll: 1.0,
      pos: { x: -2, y: -0.45, z: 0 },
      scale: 1.0,
      rot: { x: 1.5, y: -0.1, z: 0.1 },
    }, // Final
  ];

  window.addEventListener("scroll", () => {
    if (!logo) return;
    
    // Calculate scroll progress (0-1)
    const scrollHeight = document.body.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(window.scrollY / scrollHeight, 1);
    
    // Find current segment in path
    let currentSegment = pathPoints[0];
    let nextSegment = pathPoints[1];
    
    for (let i = 0; i < pathPoints.length - 1; i++) {
      if (scrollProgress >= pathPoints[i].scroll && scrollProgress <= pathPoints[i+1].scroll) {
        currentSegment = pathPoints[i];
        nextSegment = pathPoints[i+1];
        break;
      }
    }
    
    // Calculate interpolation factor between segments
    const segmentProgress = (scrollProgress - currentSegment.scroll) / 
                          (nextSegment.scroll - currentSegment.scroll);
    
    // Interpolate position, scale and rotation
    const pos = {
      x: currentSegment.pos.x + (nextSegment.pos.x - currentSegment.pos.x) * segmentProgress,
      y: currentSegment.pos.y + (nextSegment.pos.y - currentSegment.pos.y) * segmentProgress,
      z: currentSegment.pos.z + (nextSegment.pos.z - currentSegment.pos.z) * segmentProgress
    };
    
    const scale = currentSegment.scale + (nextSegment.scale - currentSegment.scale) * segmentProgress;
    const rot = {
      x: currentSegment.rot.x + (nextSegment.rot.x - currentSegment.rot.x) * segmentProgress,
      y: currentSegment.rot.y + (nextSegment.rot.y - currentSegment.rot.y) * segmentProgress,
      z: currentSegment.rot.z + (nextSegment.rot.z - currentSegment.rot.z) * segmentProgress
    };
    
    // Apply with GSAP for smoothness
    gsap.to(logo.position, {
      x: pos.x,
      y: pos.y,
      z: pos.z,
      duration: 0.1
    });
    
    gsap.to(logo.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.1
    });
    
    gsap.to(logo.rotation, {
      x: rot.x,
      y: rot.y,
      z: rot.z,
      duration: 0.1
    });
  });
}

// Handle resize
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});