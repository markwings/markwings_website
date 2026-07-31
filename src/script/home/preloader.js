import gsap from "gsap";

export function initPreloader() {
  const preloader = document.querySelector(".mw-preloader");
  if (!preloader) return;

  const letters = preloader.querySelectorAll(".mw-preloader__letter");
  const bar = preloader.querySelector(".mw-preloader__bar");

  // Stagger letters up into view
  gsap.to(letters, {
    translateY: "0%",
    duration: 0.85,
    stagger: 0.055,
    ease: "power3.out",
    delay: 0.15,
  });

  // Fill bar to 72% while page loads
  const barTween = gsap.to(bar, {
    width: "72%",
    duration: 2.2,
    ease: "power2.out",
  });

  const exitPreloader = () => {
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.95,
      ease: "power3.inOut",
      delay: 0.15,
      onComplete: () => {
        preloader.style.display = "none";
        animateHeroIn();
      },
    });
  };

  const finish = () => {
    // Kill the 72% tween so it doesn't conflict
    barTween.kill();
    gsap.to(bar, {
      width: "100%",
      duration: 0.35,
      ease: "power2.in",
      overwrite: true,
      onComplete: exitPreloader,
    });
  };

  if (document.readyState === "complete") {
    finish();
  } else {
    window.addEventListener("load", finish, { once: true });
  }

  // Hard fallback: exit after 5s no matter what
  setTimeout(() => {
    if (preloader.style.display !== "none") {
      exitPreloader();
    }
  }, 5000);
}

function splitIntoWordSpans(el) {
  const text = el.textContent.trim();
  el.textContent = "";
  text.split(/\s+/).forEach((word, i, arr) => {
    const span = document.createElement("span");
    span.className = "mw-hero__word";
    span.style.cssText = "display:inline-block;will-change:transform,opacity,filter;";
    span.textContent = word;
    el.appendChild(span);
    if (i < arr.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return el.querySelectorAll(".mw-hero__word");
}

function animateHeroIn() {
  const eyebrow   = document.querySelector(".mw-hero__eyebrow");
  const lineInners = document.querySelectorAll(".mw-hero__line-inner");
  const bottom    = document.querySelector(".mw-hero__bottom");

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (eyebrow) {
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.5 });
  }

  if (lineInners.length) {
    // First: reveal the overflow clip so words are visible at translateY 0
    tl.to(lineInners, { translateY: "0%", duration: 0.01 }, "-=0.1");

    // Split each line into word spans and animate with blur + stagger
    const allWords = [];
    lineInners.forEach((line) => {
      const isGradient = line.parentElement?.classList.contains("mw-hero__line--gradient");
      const words = splitIntoWordSpans(line);
      if (isGradient) {
        // background-clip:text only clips direct text nodes, not child elements.
        // After splitting, move the gradient onto each word span so it renders.
        words.forEach((w) => {
          w.style.background = "linear-gradient(135deg,#4F7BFF 0%,#7C3AED 50%,#F7295A 100%)";
          w.style.webkitBackgroundClip = "text";
          w.style.backgroundClip = "text";
          w.style.webkitTextFillColor = "transparent";
        });
      }
      allWords.push(...words);
    });

    gsap.set(allWords, { opacity: 0, y: 22, filter: "blur(12px)" });

    tl.to(
      allWords,
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        clearProps: "filter",
        duration: 0.75,
        stagger: 0.065,
      },
      "-=0.05"
    );
  }

  if (bottom) {
    tl.to(bottom, { opacity: 1, duration: 0.65 }, "-=0.4");
  }
}
