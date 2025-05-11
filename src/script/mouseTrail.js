// Add a rope-like trail to the cursor
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const trailPoints = [];
const trailLength = 20; // Number of trail points

document.addEventListener("mousemove", (event) => {
  // Add the current mouse position to the trail
  trailPoints.push({ x: event.pageX, y: event.pageY });

  // Remove excess points
  if (trailPoints.length > trailLength) {
    trailPoints.shift();
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the trail
  if (trailPoints.length > 1) {
    ctx.beginPath();
    ctx.moveTo(trailPoints[0].x, trailPoints[0].y);

    for (let i = 1; i < trailPoints.length; i++) {
      const point = trailPoints[i];
      ctx.lineTo(point.x, point.y);
    }

    ctx.strokeStyle = "rgba(0, 0, 255, 0.5)"; // Blue color with transparency
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.stroke();
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}); // Close the resize event listener

document.addEventListener("mousemove", (event) => {
  // Add the current mouse position to the trail
  trailPoints.push({ x: event.pageX, y: event.pageY });

  // Remove excess points
  if (trailPoints.length > trailLength) {
    trailPoints.shift();
  }

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the trail
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
    ctx.lineWidth = 5;
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
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    } else {
      clearInterval(trailFadeInterval); // Stop the interval when trail is gone
    }
  }, 20); // Adjust interval duration for smoother fading
});

// Interval to handle trail disappearance when mouse stops moving
let trailFadeInterval;
