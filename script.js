const heroCard = document.getElementById("hero");
const cursorLight = document.getElementById("cursorLight");
const heroVideo = document.getElementById("heroVideo");
const heroCopy = document.querySelector(".hero-copy");
const revealButton = document.getElementById("revealContact");
const contactInfo = document.getElementById("contactInfo");
const dots = [...document.querySelectorAll(".dot-progress .dot")];
const introPanel = document.querySelector(".intro-panel");
const loader = document.getElementById("siteLoader");
const sections = [...document.querySelectorAll(".snap-section")];
const isCoarsePointer = window.matchMedia("(hover: none), (pointer: coarse)").matches;

function finishLoading() {
  document.body.classList.remove("is-loading");
}

window.addEventListener("load", () => {
  window.setTimeout(finishLoading, 220);
});

window.setTimeout(finishLoading, 1800);

if (heroCard && cursorLight) {
  heroCard.addEventListener("pointermove", (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    if (heroVideo) {
      heroVideo.style.transform = `scale(1.06) translate(${(-px * 22).toFixed(1)}px, ${(-py * 18).toFixed(1)}px)`;
    }
    if (heroCopy) {
      heroCopy.style.transform = `translate(${(px * 12).toFixed(1)}px, ${(py * 10).toFixed(1)}px)`;
    }
    cursorLight.style.left = `${x}px`;
    cursorLight.style.top = `${y}px`;
  });

  heroCard.addEventListener("pointerleave", () => {
    if (heroVideo) heroVideo.style.transform = "scale(1.03)";
    if (heroCopy) heroCopy.style.transform = "translate(0, 0)";
    cursorLight.style.left = "50%";
    cursorLight.style.top = "50%";
  });
}

if (revealButton && contactInfo) {
  revealButton.addEventListener("click", () => {
    const isHidden = contactInfo.hasAttribute("hidden");
    if (isHidden) {
      contactInfo.removeAttribute("hidden");
      revealButton.textContent = "隐藏联系方式";
    } else {
      contactInfo.setAttribute("hidden", "");
      revealButton.textContent = "显示联系方式";
    }
  });
}

function setActiveDot(index) {
  dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === index));
}

if (sections.length && dots.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      setActiveDot(Number(visible.target.dataset.dot || 0));
    },
    { threshold: [0.45, 0.55, 0.7] }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", (event) => {
      event.preventDefault();
      sections[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveDot(index);
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target || !target.classList.contains("snap-section")) return;
      event.preventDefault();
      const index = sections.indexOf(target);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveDot(index);
    });
  });
}

const modal = document.getElementById("portfolioModal");
const modalStage = document.getElementById("modalStage");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");

function openPortfolioItem(item) {
  if (!modal || !modalStage || !modalTitle) return;
  modalStage.innerHTML = "";
  modalTitle.textContent = item.sourceName || item.title;
  modalTitle.classList.remove("is-visible");
  const frame = document.createElement("div");
  frame.className = "modal-frame";

  const media = item.type === "video" ? document.createElement("video") : document.createElement("img");
  if (item.type === "video") {
    media.controls = true;
    media.autoplay = true;
    media.playsInline = true;
    media.preload = "auto";
    media.src = item.src;
    media.load();
  } else {
    media.src = item.src;
  }
  media.alt = item.title;
  frame.appendChild(modalTitle);
  frame.appendChild(media);
  modalStage.appendChild(frame);
  modal.removeAttribute("hidden");
  requestAnimationFrame(() => modalTitle.classList.add("is-visible"));
}

if (introPanel) {
  introPanel.addEventListener("pointermove", (event) => {
    const rect = introPanel.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    introPanel.style.setProperty("--ip-x", `${(px * 86).toFixed(1)}px`);
    introPanel.style.setProperty("--ip-y", `${(-py * 108).toFixed(1)}px`);
  });

  introPanel.addEventListener("pointerleave", () => {
    introPanel.style.setProperty("--ip-x", "0px");
    introPanel.style.setProperty("--ip-y", "0px");
  });
}

function closePortfolioModal() {
  if (!modal || !modalStage || !modalTitle) return;
  const video = modalStage.querySelector("video");
  if (video) video.pause();
  modalStage.innerHTML = "";
  modalTitle.textContent = "";
  modalTitle.classList.remove("is-visible");
  modal.appendChild(modalTitle);
  modal.setAttribute("hidden", "");
}

closeModal?.addEventListener("click", closePortfolioModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closePortfolioModal();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePortfolioModal();
});

function makePortfolioCard(item, index) {
  const button = document.createElement("button");
  button.className = "flow-card";
  button.type = "button";
  button.dataset.title = item.title;
  button.style.setProperty("--tilt", `${(index % 5) - 2}deg`);
  button.setAttribute("aria-label", `查看 ${item.title}`);

  const media = item.type === "video" ? document.createElement("video") : document.createElement("img");
  media.alt = item.title;
  if (item.type === "video") {
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = isCoarsePointer ? "none" : "metadata";
    media.src = item.thumb;
  } else {
    media.loading = "lazy";
    media.decoding = "async";
    media.fetchPriority = "low";
    media.src = item.thumb;
  }

  const label = document.createElement("span");
  label.textContent = item.title;
  button.append(media, label);

  if (item.type === "video") {
    button.addEventListener("mouseenter", () => media.play().catch(() => {}));
    button.addEventListener("mouseleave", () => {
      media.pause();
      media.currentTime = 0;
    });
  }
  button.addEventListener("click", () => openPortfolioItem(item));
  return button;
}

function bindPreviewVideo(card) {
  const media = card.querySelector("video");
  if (!media) return;
  card.addEventListener("mouseenter", () => media.play().catch(() => {}));
  card.addEventListener("mouseleave", () => {
    media.pause();
    media.currentTime = 0;
  });
}

function clonePortfolioCard(card, items) {
  const title = card.dataset.title || card.querySelector("span")?.textContent;
  const original = items.find((item) => item.title === title);
  const clone = card.cloneNode(true);
  if (original) clone.addEventListener("click", () => openPortfolioItem(original));
  bindPreviewVideo(clone);
  return clone;
}

function scheduleIdle(callback) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 1200 });
  } else {
    window.setTimeout(callback, 120);
  }
}

function buildFlowGallery(gallery) {
  if (gallery.dataset.ready === "true") return;
  gallery.dataset.ready = "true";

  const kind = gallery.dataset.portfolio;
  const items = kind === "motions" ? window.SHONEYL_MOTIONS : window.SHONEYL_PHOTOS;
  if (!Array.isArray(items)) return;

  gallery.addEventListener("pointerover", (event) => {
    if (event.target.closest(".flow-card")) gallery.classList.add("is-paused");
  });
  gallery.addEventListener("pointerout", (event) => {
    const next = event.relatedTarget;
    if (!next || !gallery.contains(next)) gallery.classList.remove("is-paused");
  });
  gallery.addEventListener("click", (event) => {
    const card = event.target.closest(".flow-card");
    if (!card || !gallery.contains(card)) return;
    const item = items.find((candidate) => candidate.title === card.dataset.title);
    if (item) openPortfolioItem(item);
  });

  const rows = [document.createElement("div"), document.createElement("div"), document.createElement("div")];
  rows.forEach((row, rowIndex) => {
    row.className = "flow-row";
    row.style.setProperty("--duration", `${kind === "motions" ? 42 : 68 + rowIndex * 8}s`);
    row.style.setProperty("--offset", `${rowIndex * (isCoarsePointer ? -72 : -120)}px`);
    gallery.appendChild(row);
  });

  const initialItems = isCoarsePointer && kind === "photos" ? items.slice(0, 30) : items;
  const remainingItems = isCoarsePointer && kind === "photos" ? items.slice(30) : [];

  initialItems.forEach((item, index) => {
    rows[index % rows.length].appendChild(makePortfolioCard(item, index));
  });

  function setupRows() {
    rows.forEach((row) => {
      fillFlowRow(row, items);
    });
  }

  function appendRemaining() {
    if (!remainingItems.length) return;
    rows.forEach((row) => {
      row.querySelectorAll(".is-loop-clone").forEach((clone) => clone.remove());
    });
    remainingItems.forEach((item, index) => {
      rows[(initialItems.length + index) % rows.length].appendChild(makePortfolioCard(item, initialItems.length + index));
    });
    setupRows();
  }

  setupRows();
  if (remainingItems.length) scheduleIdle(appendRemaining);
}

function fillFlowRow(row, items) {
    const originals = [...row.children];

    function fillLoop() {
      row.querySelectorAll(".is-loop-clone").forEach((clone) => clone.remove());
      if (!originals.length) return;

      const firstOriginal = originals[0];
      const firstLoop = originals.map((card) => {
        const clone = clonePortfolioCard(card, items);
        clone.classList.add("is-loop-clone");
        row.appendChild(clone);
        return clone;
      });
      const firstClone = firstLoop[0];

      const loopDistance = firstClone.offsetLeft - firstOriginal.offsetLeft;
      row.style.setProperty("--loop-distance", `${loopDistance}px`);

      const targetWidth = window.innerWidth * 2.5 + loopDistance;
      let guard = 0;
      while (row.scrollWidth < targetWidth && guard < 12) {
        originals.forEach((card) => {
          const clone = clonePortfolioCard(card, items);
          clone.classList.add("is-loop-clone");
          row.appendChild(clone);
        });
        guard += 1;
      }
    }

    fillLoop();
    window.addEventListener("resize", fillLoop, { passive: true });
}

const galleries = [...document.querySelectorAll(".flow-gallery")];

if ("IntersectionObserver" in window) {
  const galleryObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        buildFlowGallery(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "420px 0px" }
  );
  galleries.forEach((gallery) => galleryObserver.observe(gallery));
} else {
  galleries.forEach(buildFlowGallery);
}

if (location.hash) {
  const hashTarget = document.querySelector(location.hash);
  hashTarget?.querySelectorAll(".flow-gallery").forEach(buildFlowGallery);
}

