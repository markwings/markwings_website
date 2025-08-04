import { gsap } from "gsap";

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
let isMobileMenuOpen = false;
let scrollTimeout;

// Mobile menu toggle function
const toggleMobileMenu = () => {
  isMobileMenuOpen = !isMobileMenuOpen;

  if (isMobileMenuOpen) {
    mobileMenu.classList.remove("hidden");
    mobileMenuButton.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    `;
    // Force header to stay visible when menu is open
    gsap.to("header", {
      top: 0,
      duration: 0.3,
    });
  } else {
    mobileMenu.classList.add("hidden");
    mobileMenuButton.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    `;
  }
};

mobileMenuButton.addEventListener("click", toggleMobileMenu);

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    isMobileMenuOpen = false;
    mobileMenu.classList.add("hidden");
    mobileMenuButton.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    `;
  });
});

// Improved scroll behavior
window.addEventListener("scroll", function () {
  if (isMobileMenuOpen) return;

  clearTimeout(scrollTimeout);

  gsap.to("header", {
    top: 0,
    duration: 0.3,
  });

  if (window.innerWidth > 768) {
    // md breakpoint
    scrollTimeout = setTimeout(function () {
      gsap.to("header", {
        top: -64,
        duration: 0.3,
      });
    }, 1000);
  }
});

window.addEventListener("scroll", function () {
  if (window.scrollY === 0) {
    gsap.to("header", {
      top: 0,
      duration: 0.3,
    });
    clearTimeout(scrollTimeout);
  }
});
window.addEventListener("mousemove", function (e) {
  if (window.innerWidth <= 768) return; // Skip on mobile

  const top10Percent = window.innerHeight * 0.1;
  if (e.clientY <= top10Percent) {
    gsap.to("header", {
      top: 0,
      duration: 0.3,
    });
    clearTimeout(scrollTimeout);
  } else if (!isMobileMenuOpen) {
    gsap.to("header", {
      top: -64,
      duration: 0.3,
    });
  }
});

// Reset header position on resize
window.addEventListener("resize", function () {
  if (window.innerWidth <= 768) {
    gsap.to("header", {
      top: 0,
      duration: 0.1,
    });
  }
});

document.querySelectorAll(".con-btn").forEach((button) => {
  button.addEventListener("click", function () {
    const contactSection = document.querySelector("#contact");
    console.log("clicked");

    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 50,
        behavior: "smooth",
      });
    }
  });
});