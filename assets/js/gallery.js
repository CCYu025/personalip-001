const GALLERY_JSON = "gallery.json";
let galleryPhotos = [];
let lightboxIndex = 0;
let lightboxTrigger = null;

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function skeletonThumbs(count = 8) {
  return Array.from({ length: count }, () => (
    '<div class="photo-thumb skeleton" role="listitem" aria-hidden="true"></div>'
  )).join("");
}

function renderGalleryFallback(target) {
  target.classList.add("is-fallback", "paused");
  target.innerHTML = `
    <div class="gallery-fallback">
      <p>目前相簿載入中，先到蝦皮看最新款式。</p>
      <a href="${escapeHtml(window.EXCLAMATION_CONFIG?.shopeeStoreUrl || "https://shopee.tw/shop/71815500")}" target="_blank" rel="noopener" class="btn-primary" data-event="shopee_click" data-location="gallery_fallback">前往蝦皮賣場</a>
    </div>
  `;
}

function validateImage(photo) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(photo);
    image.onerror = () => reject(new Error(photo.thumb));
    image.src = photo.thumb;
  });
}

async function initGallery() {
  const strip = document.getElementById("photo-strip");
  if (!strip) return;

  strip.innerHTML = skeletonThumbs();

  try {
    const response = await fetch(GALLERY_JSON, { cache: "no-store" });
    if (!response.ok) throw new Error(`gallery.json ${response.status}`);
    const data = await response.json();
    const photos = Array.isArray(data.photos) ? data.photos : [];
    if (!photos.length) throw new Error("empty gallery");
    await renderStrip(strip, photos);
  } catch (error) {
    console.error("Gallery error:", error);
    renderGalleryFallback(strip);
  }
}

async function renderStrip(strip, photos) {
  strip.classList.remove("is-fallback", "paused");
  const settled = await Promise.allSettled(photos.map(validateImage));
  const valid = settled
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);

  if (!valid.length) {
    renderGalleryFallback(strip);
    return;
  }

  galleryPhotos = valid;
  strip.innerHTML = "";
  const originals = valid.map((photo, index) => makeThumb(photo, index));
  originals.forEach((element) => strip.appendChild(element));

  if (!prefersReducedMotion) {
    originals.forEach((element) => {
      const clone = element.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("tabindex", "-1");
      clone.querySelectorAll("button, a, img, [tabindex]").forEach((child) => child.setAttribute("tabindex", "-1"));
      strip.appendChild(clone);
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      strip.classList.toggle("paused", !entry.isIntersecting);
    }, { threshold: 0.1 });
    observer.observe(strip);
  }

  document.addEventListener("visibilitychange", () => {
    strip.classList.toggle("paused", document.hidden);
  });
}

function makeThumb(photo, index) {
  const button = document.createElement("button");
  const alt = photo.alt || `驚嘆號韓系女裝 - 款式 ${index + 1}`;
  button.className = "photo-thumb";
  button.type = "button";
  button.setAttribute("role", "listitem");
  button.setAttribute("aria-label", `${alt}，開啟照片預覽`);
  button.dataset.index = String(index);

  const image = document.createElement("img");
  image.src = photo.thumb;
  image.alt = alt;
  image.width = 400;
  image.height = 533;
  image.loading = "lazy";
  button.appendChild(image);
  button.addEventListener("click", () => openLightbox(index, button));
  return button;
}

function openLightbox(index, triggerElement) {
  const lightbox = document.getElementById("lightbox");
  const image = document.getElementById("lightbox-img");
  if (!lightbox || !image || !galleryPhotos[index]) return;

  lightboxTrigger = triggerElement || null;
  lightboxIndex = index;
  document.getElementById("photo-strip")?.classList.add("paused");
  updateLightboxImage();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("main")?.setAttribute("inert", "");
  document.getElementById("lightbox-close")?.focus();
  preloadNeighborImages();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.hidden = true;
  document.body.style.overflow = "";
  document.querySelector("main")?.removeAttribute("inert");
  document.getElementById("photo-strip")?.classList.remove("paused");
  lightboxTrigger?.focus();
}

function navigateLightbox(direction) {
  if (!galleryPhotos.length) return;
  lightboxIndex = (lightboxIndex + direction + galleryPhotos.length) % galleryPhotos.length;
  updateLightboxImage();
  preloadNeighborImages();
}

function updateLightboxImage() {
  const photo = galleryPhotos[lightboxIndex];
  const image = document.getElementById("lightbox-img");
  const cta = document.getElementById("lightbox-cta");
  const counter = document.getElementById("lightbox-counter");
  if (!photo || !image) return;

  image.src = photo.thumb;
  image.alt = photo.alt || `驚嘆號韓系女裝 - 款式 ${lightboxIndex + 1}`;

  const fullImage = new Image();
  fullImage.onload = () => {
    image.src = photo.full;
  };
  fullImage.src = photo.full;

  if (cta) cta.href = photo.url || window.EXCLAMATION_CONFIG?.shopeeStoreUrl || "https://shopee.tw/shop/71815500";
  if (counter) counter.textContent = `${lightboxIndex + 1} / ${galleryPhotos.length}`;
}

function preloadNeighborImages() {
  [lightboxIndex - 1, lightboxIndex + 1].forEach((index) => {
    if (index < 0 || index >= galleryPhotos.length) return;
    const image = new Image();
    image.src = galleryPhotos[index].full;
  });
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const close = document.getElementById("lightbox-close");
  const prev = document.getElementById("lightbox-prev");
  const next = document.getElementById("lightbox-next");
  const body = document.getElementById("lightbox-body");
  let touchStartX = 0;

  close?.addEventListener("click", closeLightbox);
  prev?.addEventListener("click", (event) => {
    event.stopPropagation();
    navigateLightbox(-1);
  });
  next?.addEventListener("click", (event) => {
    event.stopPropagation();
    navigateLightbox(1);
  });
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  body?.addEventListener("click", (event) => event.stopPropagation());

  document.addEventListener("keydown", (event) => {
    if (!lightbox || lightbox.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateLightbox(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateLightbox(1);
    }
    if (event.key === "Tab") trapLightboxFocus(event);
  });

  lightbox?.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });
  lightbox?.addEventListener("touchend", (event) => {
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(deltaX) > 50) navigateLightbox(deltaX < 0 ? 1 : -1);
  });
}

function trapLightboxFocus(event) {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const focusables = Array.from(lightbox.querySelectorAll("button, a[href]"))
    .filter((element) => !element.disabled && element.getClientRects().length > 0);
  if (!focusables.length) return;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
