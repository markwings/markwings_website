import { gsap } from "gsap";

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuList = mobileMenu.querySelector("ul");
const header = document.querySelector("header");
const servicesSection = document.getElementById("services");

let isMobileMenuOpen = false;
let scrollTimeout;

// ----------------------
// Header Entry Animation
// ----------------------
gsap.from(header, {
  y: -100,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
});

// ----------------------
// Mobile Menu Toggle
// ----------------------
const openMobileMenu = () => {
  isMobileMenuOpen = true;
  mobileMenu.classList.remove("hidden");
  gsap.fromTo(
    mobileMenu,
    { y: -50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
  );
  mobileMenuButton.innerHTML = `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  `;
};

const closeMobileMenu = () => {
  isMobileMenuOpen = false;
  gsap.to(mobileMenu, {
    y: -50,
    opacity: 0,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => mobileMenu.classList.add("hidden"),
  });
  mobileMenuButton.innerHTML = `
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  `;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen ? closeMobileMenu() : openMobileMenu();
};

mobileMenuButton.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleMobileMenu();
});

// Prevent closing when clicking inside the menu <ul>
mobileMenuList.addEventListener("click", (e) => e.stopPropagation());

// Close mobile menu when clicking outside the <ul>
mobileMenu.addEventListener("click", () => {
  if (isMobileMenuOpen) closeMobileMenu();
});

// Close menu when clicking a link
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// ----------------------
// Scroll Behavior
// ----------------------
window.addEventListener("scroll", () => {
  if (isMobileMenuOpen) return;

  // Service section visibility check
  if (servicesSection) {
    const rect = servicesSection.getBoundingClientRect();
    const inView =
      rect.top <= window.innerHeight * 0.2 &&
      rect.bottom >= window.innerHeight * 0.2;

    if (inView) {
      gsap.to(header, { y: -100, duration: 0.3 });
      clearTimeout(scrollTimeout);
      return;
    }
  }

  clearTimeout(scrollTimeout);
  gsap.to(header, { y: 0, duration: 0.3 });

  if (window.innerWidth > 768 && window.scrollY > 0) {
    scrollTimeout = setTimeout(() => {
      gsap.to(header, { y: -64, duration: 0.3 });
    }, 200);
  }

  if (window.scrollY === 0) {
    gsap.to(header, { y: 0, duration: 0.3 });
    clearTimeout(scrollTimeout);
  }
});

// ----------------------
// Smooth Scroll for Connect Buttons
// ----------------------
document.querySelectorAll(".con-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const contactSection = document.querySelector("#contact");
    if (contactSection) {
      window.scrollTo({
        top: contactSection.offsetTop - 50,
        behavior: "smooth",
      });
    }
  });
});

// ----------------------
// Hover to Reveal Header
// ----------------------
const headerRevealZone = document.createElement("div");
headerRevealZone.style.position = "fixed";
headerRevealZone.style.top = "0";
headerRevealZone.style.left = "0";
headerRevealZone.style.width = "100%";
headerRevealZone.style.height = "30px"; // Small hover zone
headerRevealZone.style.zIndex = "9999";
headerRevealZone.style.pointerEvents = "auto";
document.body.appendChild(headerRevealZone);

headerRevealZone.addEventListener("mouseenter", () => {
  if (!isMobileMenuOpen) {
    gsap.to(header, { y: 0, duration: 0.3, ease: "power2.out" });
  }
});