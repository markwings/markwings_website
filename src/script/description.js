import { gsap } from "gsap";
const services = [
  "Graphic Designing",
  "Video Creation",
  "Development",
  "SEO",
  "Digital Marketing",
  "SMM",
  "Graphic Designing",
  "Video Creation",
  "Development",
  "SEO",
  "Digital Marketing",
  "SMM",
];
const serviceInfo = [
  "Stunning visuals that communicate your brand identity.",
  "Professional editing for engaging video content.",
  "Custom software solutions tailored to your business needs.",
  "Data-driven strategies to grow your online presence.",
  "Grow your brand with targeted digital campaigns.",
  "Boost engagement across all social platforms.",
  "Stunning visuals that communicate your brand identity.",
  "Professional editing for engaging video content.",
  "Custom software solutions tailored to your business needs.",
  "Data-driven strategies to grow your online presence.",
  "Grow your brand with targeted digital campaigns.",
  "Boost engagement across all social platforms.",
];
const colors = [
  "#2563eb",
  "#1e40af",
  "#0ea5e9",
  "#6366f1",
  "#3b82f6",
  "#1d4ed8",
  "#2563eb",
  "#1e40af",
  "#0ea5e9",
  "#6366f1",
  "#3b82f6",
  "#1d4ed8",
];
const canvas = document.getElementById("fortuneWheel");
let descAnim = document.getElementById("descAnim");
const ctx = canvas.getContext("2d");
const size = canvas.width;
const center = size / 2;
const radius = center - 10;
let angle = 0;
let rotFlag = false;
let spinning = false;
let autoRotateInterval;
let carousalInterval;
let hovered = false;
let selectedIdx = 0;
function drawWheel(currentAngle = 0) {
  ctx.clearRect(0, 0, size, size);
  const segAngle = (2 * Math.PI) / services.length;
  for (let i = 0; i < services.length; i++) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(
      center,
      center,
      radius,
      currentAngle + i * segAngle,
      currentAngle + (i + 1) * segAngle
    );
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.restore();

    // Draw text
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(currentAngle + (i + 0.5) * segAngle);
    ctx.textAlign = "right";
    ctx.translate(-20, 0);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 16px Inter, Arial";
    ctx.fillText(services[i], radius - 20, 6);
    ctx.restore();
  }
  // Draw center circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, 30, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = "#1e40af";
  ctx.shadowBlur = 10;
  ctx.fill();
  ctx.restore();

  // Draw pointer
  ctx.save();
  ctx.translate(center, center);
  ctx.rotate((15 * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(0, -radius - 10);
  ctx.lineTo(-15, -radius + 20);
  ctx.lineTo(15, -radius + 20);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();
}

function startAutoRotate() {
  if (autoRotateInterval || carousalInterval)
    clearInterval(autoRotateInterval, carousalInterval);
  autoRotateInterval = setInterval(autoRotateStep, 5000);
}

function stopAutoRotate() {
  if (autoRotateInterval) clearInterval(autoRotateInterval);
}

drawWheel(angle, getSelectedIdx());
updateSelectedInfo();

setTimeout(() => {
  startAutoRotate();
}, 3000);

canvas.addEventListener("click", () => {
  if (spinning) return;
  spinning = true;
  const segAngle = (2 * Math.PI) / services.length;
  const targetAngle = angle + segAngle;
  const animObj = { a: angle };
  gsap.to(animObj, {
    a: targetAngle,
    duration: 2,
    ease: "power2.out",
    onUpdate: function () {
      angle = animObj.a;
      drawWheel(angle, getSelectedIdx());
      updateSelectedInfo();
    },
    onComplete: function () {
      angle = targetAngle % (2 * Math.PI);
      updateSelectedInfo();
      spinning = false;
    },
  });
});

function autoRotateStep() {
  if (hovered || spinning) return;
  spinning = true;
  const segAngle = (2 * Math.PI) / services.length;
  const targetAngle = angle + segAngle;
  const animObj = { a: angle };
  gsap.to(animObj, {
    a: targetAngle,
    duration: 1,
    ease: "power2.out",
    onUpdate: function () {
      angle = animObj.a;
      drawWheel(angle, getSelectedIdx());
    },
    onComplete: function () {
      angle = targetAngle % (2 * Math.PI);
      updateSelectedInfo();
      spinning = false;
    },
  });
}

function getSelectedIdx() {
  const segAngle = (2 * Math.PI) / services.length;
  // Add half a segment angle to align the pointer with the center of the segment
  let normalized = (-angle - Math.PI / 2 + segAngle / 2) % (2 * Math.PI);
  if (normalized < 0) normalized += 2 * Math.PI;
  return Math.floor(normalized / segAngle) % services.length;
}
canvas.addEventListener("mouseenter", () => {
  hovered = true;
  stopAutoRotate();
  descAnim.pause();
});
canvas.addEventListener("mouseleave", () => {
  hovered = false;
  startAutoRotate();
  descAnim.play();
});

function updateSelectedInfo() {
  selectedIdx = getSelectedIdx();
  let carousalContainer = document.createElement("div");
    carousalContainer.innerHTML = `<h3 class="font-bold text-lg mb-1 w-full">${services[selectedIdx]}</h3>
      <p class="text-sm w-full">${serviceInfo[selectedIdx]}</p>`;
    carousalContainer.className =
      `p-4 bg-blue-50 min-w-2/3 h-9/12 border border-blue-200 rounded-lg shadow text-blue-900 text-center absolute`;
      document.getElementById("fortuneResult").append(carousalContainer);
      gsap.fromTo(
        carousalContainer,
        {
          x: "-100%",
          rotate: rotFlag ? -selectedIdx / 2 : selectedIdx / 2,
        },
        {
          rotate: rotFlag ? selectedIdx / 2 : -selectedIdx / 2,
          x: "0%",
          duration: 1,
          ease: "power3.out",
        }
      );
      rotFlag = !rotFlag;
}