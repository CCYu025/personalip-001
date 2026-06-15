function initCounter() {
  const counters = document.querySelectorAll("[data-target]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((element) => {
      const target = Number.parseInt(element.dataset.target || "0", 10);
      element.textContent = target.toLocaleString("zh-TW") + (element.dataset.suffix || "");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((element) => observer.observe(element));
}

function animateCounter(element) {
  const target = Number.parseInt(element.dataset.target || "0", 10);
  const suffix = element.dataset.suffix || "";
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(eased * target).toLocaleString("zh-TW") + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}
