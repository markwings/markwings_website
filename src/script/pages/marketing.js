import { gsap } from "gsap";

// GSAP Animations
gsap.registerPlugin();

// Initialize animations when page loads
window.addEventListener("load", () => {
  // Animate header
  gsap.to("#main-title", {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: "power2.out",
  });
  gsap.to("#subtitle", {
    opacity: 1,
    y: 0,
    duration: 1,
    delay: 0.3,
    ease: "power2.out",
  });

  // Animate service cards with stagger
  gsap.fromTo(
    ".service-card",
    { opacity: 0, y: 60, scale: 0.9 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      delay: 0.6,
    }
  );

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll("[data-width]").forEach((bar) => {
      const width = bar.getAttribute("data-width");
      bar.style.width = width + "%";
    });
  }, 2000);

  // Counter animations
  setTimeout(() => {
    document.querySelectorAll(".metric-counter").forEach((counter) => {
      const target = parseFloat(counter.getAttribute("data-target"));
      const isPercentage = counter.textContent.includes("%");
      const isNumber = counter.textContent.includes("#");
      const isPlus = counter.textContent.includes("+");
      const isDecimal = target < 10 && target % 1 !== 0;
      gsap.to(counter, {
        innerHTML: target,
        duration: 2.5,
        ease: "power2.out",
        snap: { innerHTML: isDecimal ? 0.1 : 1 },
        onUpdate: function () {
          const val = parseFloat(this.targets()[0].innerHTML);
          let displayVal = isDecimal ? val.toFixed(1) : Math.round(val);
          if (isPercentage) displayVal += "%";
          if (isNumber) displayVal = "#" + displayVal;
          if (isPlus) displayVal += "+";
          counter.innerHTML = displayVal;
        },
      });
    });
  }, 2500);
}); // Enhanced hover effects for service cards
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      scale: 1.03,
      rotationY: 5,
      duration: 0.4,
      ease: "power2.out",
      transformOrigin: "center center",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      scale: 1,
      rotationY: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  });
});

// Parallax effect on scroll
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll(".floating-icon");

  parallaxElements.forEach((element) => {
    const speed = 0.3;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px) translateY(-8px)`;
  });
});

// Interactive elements
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", () => {
    gsap.to(button, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  });
});

// Add subtle animation to gradient borders
setInterval(() => {
  const gradientBorders = document.querySelectorAll(".gradient-border");
  gradientBorders.forEach((border) => {
    gsap.to(border, {
      rotation: 360,
      duration: 20,
      ease: "none",
      repeat: -1,
    });
  });
}, 100);
