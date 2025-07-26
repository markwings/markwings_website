import gsap from "gsap";
const reveal = document.getElementById("reveal");
const div1Copy = document.getElementById("reveal-content");
const container = document.getElementById("etymology");

let lastMouse = { x: null, y: null };
let isTouch = false;

function updateRevealPosition(clientX, clientY) {
  // Get container position
  const rect = container.getBoundingClientRect();

  // Calculate position relative to container
  const relX = clientX - rect.left;
  const relY = clientY - rect.top;

  // Get current reveal dimensions
  const revealRect = reveal.getBoundingClientRect();
  const halfWidth = revealRect.width / 2;
  const halfHeight = revealRect.height / 2;

  // Position the reveal circle centered on cursor/touch
  gsap.set(reveal, {
    left: relX - halfWidth,
    top: relY - halfHeight,
  });

  // Counter-move the content to create the "window" effect
  gsap.set(div1Copy, {
    x: -(relX - halfWidth),
    y: -(relY - halfHeight),
  });

  // Store global coordinates for scroll handler
  lastMouse.x = clientX;
  lastMouse.y = clientY;
}

function showReveal() {
  reveal.classList.remove("hidden");
}

function hideReveal() {
  reveal.classList.add("hidden");
  gsap.set(reveal, { left: -1000, top: -1000 });
  gsap.set(div1Copy, { x: 0, y: 0 });
  lastMouse.x = null;
  lastMouse.y = null;
}

// Initialize positions
gsap.set(reveal, { left: -1000, top: -1000 });
gsap.set(div1Copy, { x: 0, y: 0 });

// Desktop Events
container.addEventListener("mouseenter", (e) => {
  if (!isTouch) {
    showReveal();
    updateRevealPosition(e.clientX, e.clientY);
  }
});

container.addEventListener("mousemove", (e) => {
  if (!isTouch) {
    showReveal();
    updateRevealPosition(e.clientX, e.clientY);
  }
});

container.addEventListener("mouseleave", () => {
  if (!isTouch) {
    hideReveal();
  }
});

// Mobile Touch Events
container.addEventListener(
  "touchstart",
  (e) => {
    isTouch = true;
    e.preventDefault();
    showReveal();
    const touch = e.touches[0];
    updateRevealPosition(touch.clientX, touch.clientY);
  },
  { passive: false }
);

container.addEventListener(
  "touchmove",
  (e) => {
    if (isTouch) {
      e.preventDefault();
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateRevealPosition(touch.clientX, touch.clientY);
      }
    }
  },
  { passive: false }
);

container.addEventListener(
  "touchend",
  (e) => {
    if (isTouch) {
      e.preventDefault();
      hideReveal();
      // Reset touch flag after a delay to prevent mouse events
      setTimeout(() => {
        isTouch = false;
      }, 500);
    }
  },
  { passive: false }
);

container.addEventListener(
  "touchcancel",
  (e) => {
    if (isTouch) {
      e.preventDefault();
      hideReveal();
      setTimeout(() => {
        isTouch = false;
      }, 500);
    }
  },
  { passive: false }
);

// Scroll handler
let scrollTimeout;
window.addEventListener("scroll", () => {
  if (
    !reveal.classList.contains("hidden") &&
    lastMouse.x !== null &&
    lastMouse.y !== null
  ) {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      updateRevealPosition(lastMouse.x, lastMouse.y);
    }, 10);
  }
});

// Prevent context menu on long press (mobile)
container.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
