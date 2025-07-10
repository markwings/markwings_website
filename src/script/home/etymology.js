import gsap from "gsap";

const reveal = document.getElementById("reveal");
const div1Copy = document.getElementById("reveal-content");
const container = document.getElementById("etymology");

let lastMouse = { x: null, y: null };

function updateRevealPosition(x, y) {
  const rect = container.getBoundingClientRect();
  const relX = x - rect.left;
  const relY = y - rect.top;

  div1Copy.style.left = `-${relX - 150}px`;
  div1Copy.style.top = `-${relY - 150}px`;
  gsap.to(reveal.style, {
    left: `${relX - 150}px`,
    top: `${relY - 150}px`,
    duration: 0.2,
    delay: 0.1,
    ease: "power2.out",
  });

  gsap.to(div1Copy.style, {
    left: `-${relX - 150}px`,
    top: `-${relY - 150}px`,
    duration: 0.2,
    delay: 0.1,
    ease: "power2.out",
  });
}

container.addEventListener("mousemove", (e) => {
  reveal.style.display = "block";
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;
  updateRevealPosition(e.clientX, e.clientY);
});
container.addEventListener("mouseenter", (e) => {
  reveal.style.display = "block";
  lastMouse.x = e.clientX;
  lastMouse.y = e.clientY;
  updateRevealPosition(e.clientX, e.clientY);
});

window.addEventListener("scroll", () => {
  if (reveal.style.display === "block" && lastMouse.x !== null && lastMouse.y !== null) {
    updateRevealPosition(lastMouse.x, lastMouse.y);
  }
});

document.querySelector("#etymology").addEventListener("mouseleave", () => {
  reveal.style.display = "none";
});
