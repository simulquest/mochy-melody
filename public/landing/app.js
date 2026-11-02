/* ==========================================================================
   Mochy Melody — Interactions de la landing page
   Les VRAIES peluches 3D du jeu (plush3d.js / window.MM3D) :
   collection (une peluche par espèce + variations), lootbox fidèle,
   enchère live, mutations officielles.
   Secours SVG automatique si WebGL est indisponible.
   ========================================================================== */
(function () {
  "use strict";
  const M3 = window.MM3D || null;
  const MM = window.MM;
  const HAS3D = !!(M3 && M3.webglOK !== false);

  /* Source de données unique : le moteur 3D (données officielles du jeu),
   * sinon le module de secours (mêmes données). */
  const D = HAS3D ? M3 : MM;

  /* ==========================================================================
     AUDIO — boutons, coffre, musique de fond (persiste sur tout le site)
     ========================================================================== */
  const SOUND = {
    button: new Audio('/api/sound/button-click.mp3'),
    music: new Audio('/api/sound/background-music.mp3'),
  };
  SOUND.button.preload = 'auto';
  SOUND.button.volume = 0.4;
  SOUND.music.loop = true;
  SOUND.music.preload = 'auto';
  SOUND.music.volume = 0.18;
  let musicStarted = false;

  function playButtonSound() {
    SOUND.button.currentTime = 0;
    void SOUND.button.play().catch(() => {});
    if (!musicStarted) {
      SOUND.music.currentTime = 0;
      void SOUND.music.play().catch(() => {});
      musicStarted = true;
    }
  }

  // Musique de fond au premier clic n'importe où sur la landing.
  document.addEventListener('click', function () {
    if (!musicStarted) {
      playButtonSound();
    }
  }, { once: true, passive: true });

  // Son de clic sur chaque bouton de la landing.
  document.addEventListener('click', function (e) {
    if (e.target instanceof Element && e.target.closest('button:not(:disabled)')) {
      playButtonSound();
    }
  }, true);

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const findPlush = (id) => (D.POOL.find((p) => p.id === id) || D.HUB_PLUSHES.find((p) => p.id === id));

  /* ---------- Vue peluche : canvas 3D (vrais modèles) ou SVG de secours ---------- */
  function plushNode(entry, mutation, opts) {
    const o = Object.assign({ w: 150, h: 140, className: "" }, opts || {});
    if (HAS3D) {
      const c = document.createElement("canvas");
      c.className = o.className;
      c.style.width = o.w + "px";
      c.style.height = o.h + "px";
      c.setAttribute("aria-hidden", "true");
      M3.watchCanvas(c, entry, mutation || null, { w: o.w, h: o.h });
      return c;
    }
    const wrap = document.createElement("div");
    wrap.className = o.className;
    wrap.setAttribute("aria-hidden", "true");
    wrap.style.width = o.w + "px";
    wrap.style.height = o.h + "px";
    wrap.style.display = "flex";
    wrap.style.alignItems = "center";
    wrap.style.justifyContent = "center";
    wrap.innerHTML = MM.svgFor(entry, mutation);
    return wrap;
  }

  /* ---------- Peluche de marque : le chat mochi rose (nav + footer) ---------- */
  if (HAS3D) {
    const mochi = D.HUB_PLUSHES.find((p) => p.id === "mochi");
    $$(".brand-mark").forEach((el) => {
      el.replaceWith(plushNode(mochi, null, { w: 38, h: 38, className: "brand-mark" }));
    });
  }

  /* ---------- Année du copyright (dynamique) ---------- */
  const yearEl = $("#footer-year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Toast ---------- */
  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  document.body.appendChild(toastEl);
  let toastTimer = null;
  function toast(html) {
    toastEl.innerHTML = html;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }

  /* Deux variations officielles, nées avec des mutations rares (utilisées par le carrousel). */
  function mutOf(eyeId, furId, tintId) {
    return {
      eye: D.EYES.find((e) => e.id === eyeId),
      fur: D.FUR.find((f) => f.id === furId),
      tint: D.TINTS.find((t) => t.id === tintId),
      hetero: null,
    };
  }

  const VARIANTS = [
    {
      entry: D.POOL.find((p) => p.id === "brume-douce"),
      mut: mutOf("noisette", "nature", "albinos"),
      name: "Lapin Albinos",
      speciesLine: "Lapin · mutation Teinte Albinos",
      tagline: "Née sous la teinte neige : un pelage d'exception que les collectionneurs guettent.",
    },
    {
      entry: D.POOL.find((p) => p.id === "brique-tendresse"),
      mut: mutOf("amethyste", "galaxie", "naturelle"),
      name: "Dragon Galaxie",
      speciesLine: "Dragon · mutation Fourrure Galaxie",
      tagline: "La mutation la plus convoitée : une fourrure arc-en-ciel qui change au moindre souffle.",
    },
  ];

  /* ==========================================================================
     2 bis. CARROUSEL DU HERO — présentation des peluches (vrais modèles 3D)
     ========================================================================== */
  const CAROUSEL_IDS = [
    "cafe-creme",
    "mure-sucree",
    "aurore-boreale",
    "soleil-couchant",
    "licorne-celeste",
    "pingouin-prisme",
  ];
  const CAROUSEL_ITEMS = CAROUSEL_IDS
    .map((id) => D.POOL.find((p) => p.id === id))
    .filter(Boolean)
    .map((entry) => ({
      entry,
      mut: null,
      name: entry.name,
      speciesLine: D.SHAPE_LABELS[entry.shape],
      rarityIdx: entry.rarity,
    }))
    .concat(VARIANTS.map((v) => ({
      entry: v.entry,
      mut: v.mut,
      name: v.name,
      speciesLine: v.speciesLine,
      rarityIdx: D.RARITIES.findIndex((r) => r.id === D.mutationRarity(v.mut)),
    })));

  const carouselStage = $("#carousel-stage");
  const carouselDots = $("#carousel-dots");
  const carouselRarity = $("#carousel-rarity");
  const carouselName = $("#carousel-name");
  const carouselSpecies = $("#carousel-species");
  const carouselIndex = $("#carousel-index");
  const carouselTotal = $("#carousel-total");

  if (carouselStage && carouselDots && CAROUSEL_ITEMS.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let carouselAt = 0;
    let carouselTimer = null;

    carouselTotal.textContent = String(CAROUSEL_ITEMS.length);

    const slides = CAROUSEL_ITEMS.map((item) => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      slide.setAttribute("aria-hidden", "true");
      slide.appendChild(
        plushNode(item.entry, item.mut, { w: 220, h: 210, className: "carousel-plush-3d" })
      );
      carouselStage.appendChild(slide);
      return slide;
    });

    const dots = CAROUSEL_ITEMS.map((item, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", item.name);
      dot.addEventListener("click", () => {
        showPlush(index);
        restartCarousel();
      });
      carouselDots.appendChild(dot);
      return dot;
    });

    function showPlush(index) {
      carouselAt = (index + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length;
      const item = CAROUSEL_ITEMS[carouselAt];
      const rarity = D.RARITIES[item.rarityIdx];

      slides.forEach((slide, i) => {
        slide.classList.toggle("is-active", i === carouselAt);
        slide.setAttribute("aria-hidden", String(i !== carouselAt));
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-active", i === carouselAt);
        dot.setAttribute("aria-selected", String(i === carouselAt));
      });

      carouselRarity.textContent = rarity.name;
      carouselRarity.style.setProperty("--rc", rarity.color);
      carouselName.textContent = item.name;
      carouselSpecies.textContent = item.speciesLine;
      carouselIndex.textContent = String(carouselAt + 1);
    }

    function stopCarousel() {
      if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
      }
    }

    function startCarousel() {
      if (reduceMotion || CAROUSEL_ITEMS.length < 2) return;
      stopCarousel();
      carouselTimer = setInterval(() => showPlush(carouselAt + 1), 4800);
    }

    function restartCarousel() {
      stopCarousel();
      startCarousel();
    }

    $("#carousel-prev").addEventListener("click", () => {
      showPlush(carouselAt - 1);
      restartCarousel();
    });
    $("#carousel-next").addEventListener("click", () => {
      showPlush(carouselAt + 1);
      restartCarousel();
    });

    const showcase = $("#hero-showcase");
    showcase.addEventListener("pointerenter", stopCarousel);
    showcase.addEventListener("pointerleave", startCarousel);
    showcase.addEventListener("focusin", stopCarousel);
    showcase.addEventListener("focusout", startCarousel);

    showPlush(0);
    startCarousel();
  }

  /* ==========================================================================
     3. MUTATIONS — pools officiels du jeu
     ========================================================================== */
  const RIDX = { commune: 0, rare: 1, epique: 2, legendaire: 3, mythique: 4 };
  function mutItem(m) {
    const li = document.createElement("li");
    const dotCls = "mut-dot" + (m.rainbow ? " rainbow" : "") + (m.glow ? " glow" : "");
    const dotStyle = m.rainbow ? "" : ' style="background:' + (m.color || (m.tip ? m.tip : "#e8e0f2")) + ";" + (m.glow ? "color:" + m.color + '"' : '"');
    li.innerHTML =
      '<span class="' + dotCls + '"' + dotStyle + "></span>" +
      '<span class="mut-name">' + m.label + "</span>" +
      '<span class="mut-tier">' + D.RARITIES[RIDX[m.rarity]].name + "</span>";
    return li;
  }
  $("#mut-eyes").append(...D.EYES.map(mutItem));
  $("#mut-fur").append(...D.FUR.map(mutItem));
  $("#mut-tints").append(...D.TINTS.map(mutItem));

  /* ==========================================================================
     5. COURS DES CARTES — mini graphique canvas
     ========================================================================== */
  const canvas = $("#price-chart");
  const ctx = canvas.getContext("2d");
  const sales = [8, 9, 11, 10, 12, 14, 13];
  let chartT = 0, chartStarted = false;

  function drawChart(t) {
    const W = canvas.width, H = canvas.height;
    const pad = { l: 26, r: 16, t: 16, b: 22 };
    const min = Math.min(...sales) - 1, max = Math.max(...sales) + 1;
    const X = (i) => pad.l + (i * (W - pad.l - pad.r)) / (sales.length - 1);
    const Y = (v) => pad.t + (1 - (v - min) / (max - min)) * (H - pad.t - pad.b);
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = "#f3e6ef";
    ctx.lineWidth = 1;
    for (let g = 0; g <= 2; g++) {
      const gy = pad.t + (g * (H - pad.t - pad.b)) / 2;
      ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(W - pad.r, gy); ctx.stroke();
    }

    const n = Math.max(2, Math.ceil(sales.length * t));
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(255,122,194,.35)");
    grad.addColorStop(1, "rgba(255,122,194,0)");
    ctx.beginPath();
    ctx.moveTo(X(0), Y(sales[0]));
    for (let i = 1; i < n; i++) ctx.lineTo(X(i), Y(sales[i]));
    ctx.lineTo(X(n - 1), H - pad.b);
    ctx.lineTo(X(0), H - pad.b);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(X(0), Y(sales[0]));
    for (let i = 1; i < n; i++) ctx.lineTo(X(i), Y(sales[i]));
    ctx.strokeStyle = "#ff5f9e";
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();

    for (let i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.arc(X(i), Y(sales[i]), i === n - 1 ? 5.5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = i === n - 1 ? "#ff5f9e" : "#fff";
      ctx.strokeStyle = "#ff7ac2";
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = "#3a2b4a";
    ctx.font = "700 13px Nunito, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(sales[n - 1] + " 🪙", W - pad.r, Y(sales[n - 1]) - 12);
  }

  function animateChart() {
    if (chartStarted) return;
    chartStarted = true;
    const t0 = performance.now();
    (function frame(now) {
      chartT = Math.min(1, (now - t0) / 1400);
      const eased = 1 - Math.pow(1 - chartT, 3);
      drawChart(eased);
      if (chartT < 1) requestAnimationFrame(frame);
    })(t0);
  }

  if ("IntersectionObserver" in window) {
    const chartObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateChart(); chartObs.disconnect(); } });
    }, { threshold: 0.4 });
    chartObs.observe(canvas);
  } else drawChart(1);

  /* ==========================================================================
     6. PETITS MÉCANISMES UI — reveals, compteurs, nav, CTA
     ========================================================================== */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => obs.observe(el));
  } else reveals.forEach((el) => el.classList.add("in"));

  const counters = $$("[data-count]");
  const fmtInt = (n, suffix) => n.toLocaleString("fr-FR") + suffix;
  if ("IntersectionObserver" in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const t0 = performance.now();
        (function step(now) {
          const p = Math.min(1, (now - t0) / 900);
          el.textContent = fmtInt(Math.round(target * (1 - Math.pow(1 - p, 3))), suffix);
          if (p < 1) requestAnimationFrame(step);
        })(t0);
        cObs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => cObs.observe(el));
  } else counters.forEach((el) => (el.textContent = fmtInt(parseInt(el.dataset.count, 10), el.dataset.suffix || "")));

  // Burger
  const burger = $("#burger"), links = $("#nav-links");
  burger.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      links.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  // Vraies peluches 3D flottantes du CTA final
  const ctaIds = ["lapin", "dragon", "fantome", "galaxie-arc-en-ciel"];
  const ctaSlot = $("#cta-plushes");
  ctaIds.forEach((id, i) => {
    const entry = findPlush(id);
    const node = plushNode(entry, null, { w: 84, h: 84, className: "plush-cta-3d" });
    node.style.position = "absolute";
    node.style.opacity = ".55";
    node.style.filter = "saturate(.95)";
    node.classList.add("cta-float-" + (i + 1));
    ctaSlot.appendChild(node);
  });

  // Marquee infini : contenu dupliqué pour une boucle sans coupure
  const mt = $("#marquee-track");
  if (mt) {
    mt.innerHTML += mt.innerHTML;
    mt.style.animationDuration = "56s";
  }

  // Parallax doux sur le décor
  if (window.matchMedia("(pointer:fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      $$(".blob").forEach((b, i) => {
        b.style.translate = (x * (i + 1) * 0.6) + "px " + (y * (i + 1) * 0.6) + "px";
      });
    });
  }
})();
