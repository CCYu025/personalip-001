const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initReveal() {
  const elements = document.querySelectorAll(".reveal, .reveal-stagger");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  elements.forEach((element) => observer.observe(element));
}
