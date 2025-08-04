// Add a rope-like trail to the cursor
const canvas = document.createElement("canvas");
canvas.style.zIndex = "1000";
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trailPoints = [];
const trailLength = 20;

document.addEventListener("mousemove", (event) => {
  trailPoints.push({ x: event.clientX, y: event.clientY });

  if (trailPoints.length > trailLength) {
    trailPoints.shift();
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the trail with even smoother curves using Catmull-Rom to Bezier conversion
  if (trailPoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(trailPoints[0].x, trailPoints[0].y);

    for (let i = 0; i < trailPoints.length - 1; i++) {
      const p0 = trailPoints[i - 1] || trailPoints[i];
      const p1 = trailPoints[i];
      const p2 = trailPoints[i + 1];
      const p3 = trailPoints[i + 2] || p2;

      // Catmull-Rom to Bezier conversion
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
  }
  if (trailPoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(trailPoints[0].x, trailPoints[0].y);

    for (let i = 1; i < trailPoints.length; i++) {
      const point = trailPoints[i];
      ctx.lineTo(point.x, point.y);
    }

    // Create gradient for fading effect in reverse direction
    const gradient = ctx.createLinearGradient(
      trailPoints[trailPoints.length - 1].x,
      trailPoints[trailPoints.length - 1].y,
      trailPoints[0].x,
      trailPoints[0].y
    );
    gradient.addColorStop(0, "rgba(0, 0, 255, 0.5)"); // Start with blue
    gradient.addColorStop(1, "rgba(0, 0, 255, 0)"); // Fade to transparent

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.stroke();
  }

  // Reset the trail fade timeout
  clearInterval(trailFadeInterval);
  trailFadeInterval = setInterval(() => {
    if (trailPoints.length > 0) {
      trailPoints.shift(); // Remove the oldest point
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

      // Redraw the trail with remaining points
      if (trailPoints.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trailPoints[0].x, trailPoints[0].y);

        for (let i = 1; i < trailPoints.length; i++) {
          const point = trailPoints[i];
          ctx.lineTo(point.x, point.y);
        }

        const gradient = ctx.createLinearGradient(
          trailPoints[trailPoints.length - 1].x,
          trailPoints[trailPoints.length - 1].y,
          trailPoints[0].x,
          trailPoints[0].y
        );
        gradient.addColorStop(0, "rgba(0, 0, 255, 0.5)");
        gradient.addColorStop(1, "rgba(0, 0, 255, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    } else {
      clearInterval(trailFadeInterval); // Stop the interval when trail is gone
    }
  }, 20); // Adjust interval duration for smoother fading
});

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}); // Close the resize event listener

// Interval to handle trail disappearance when mouse stops moving
let trailFadeInterval;
