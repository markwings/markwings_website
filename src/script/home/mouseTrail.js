// Create custom cursor elements
const cursorInner = document.createElement("div");
const cursorOuter = document.createElement("div");

// Style inner circle (opaque)
cursorInner.style.width = "8px";
cursorInner.style.height = "8px";
cursorInner.style.backgroundColor = "blue";
cursorInner.style.borderRadius = "50%";
cursorInner.style.position = "fixed";
cursorInner.style.top = "0";
cursorInner.style.left = "0";
cursorInner.style.pointerEvents = "none";
cursorInner.style.zIndex = "10000";
cursorInner.style.transform = "translate(-50%, -50%)";
cursorInner.style.transition = "transform 0.05s linear"; // slight smoothing

// Style outer circle (transparent with border)
cursorOuter.style.width = "40px";
cursorOuter.style.height = "40px";
cursorOuter.style.backgroundColor = "rgba(0, 0, 255, 0.1)"; // transparent fill
cursorOuter.style.border = "1px solid rgba(0, 0, 255, 0.5)"; // visible border
cursorOuter.style.borderRadius = "50%";
cursorOuter.style.position = "fixed";
cursorOuter.style.top = "0";
cursorOuter.style.left = "0";
cursorOuter.style.pointerEvents = "none";
cursorOuter.style.zIndex = "9999";
cursorOuter.style.transform = "translate(-50%, -50%)";
cursorOuter.style.transition = "transform 0.15s ease-out"; // lags slightly behind for a smooth effect

document.body.appendChild(cursorInner);
document.body.appendChild(cursorOuter);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Track mouse position
let isCursorTicking = false;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!isCursorTicking) {
    window.requestAnimationFrame(() => {
      // Direct update for inner
      cursorInner.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

      // Update for outer (has transition for lag effect)
      cursorOuter.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

      isCursorTicking = false;
    });
    isCursorTicking = true;
  }
});
