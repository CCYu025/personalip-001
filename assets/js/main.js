const CONFIG = window.EXCLAMATION_CONFIG || {};

function initAnalytics() {
  if (CONFIG.ga4Id) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.ga4Id}`;
    document.head.append(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", CONFIG.ga4Id);
  }

  if (CONFIG.metaPixelId) {
    window.fbq = window.fbq || function fbq() {
      (window.fbq.queue = window.fbq.queue || []).push(arguments);
    };
    window.fbq("init", CONFIG.metaPixelId);
    window.fbq("track", "PageView");
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.append(script);
  }
}

function setHeaderState() {
  document.querySelector("[data-header]")?.classList.toggle("is-scrolled", window.scrollY > 8);
}

function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });
}

function initOutboundTracking() {
  document.querySelectorAll("[data-event]").forEach((element) => {
    element.addEventListener("click", () => {
      const event = element.dataset.event;
      const location = element.dataset.location || "unknown";
      if (typeof window.gtag !== "undefined") {
        window.gtag("event", event, { location });
      }
      if (typeof window.fbq !== "undefined") {
        if (event === "shopee_click") window.fbq("track", "ViewContent");
        if (event === "line_click") window.fbq("track", "Lead");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAnalytics();
  setHeaderState();
  initReveal();
  initCounter();
  initAnchorScroll();
  initLightbox();
  initGallery().then(initOutboundTracking);
});

window.addEventListener("scroll", setHeaderState, { passive: true });
