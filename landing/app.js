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

  /* ==========================================================================
     1. DÉMO LOOTBOX — jauge, montée en rareté, ouverture, ×N
        (mécanique et chances officielles du jeu)
     ========================================================================== */
  const UPGRADE = [0.12, 0.09, 0.06, 0.035, 0]; // chances officielles de montée en rareté
  const NEED = 5; // simplifié pour la démo (le vrai jeu : 3/6/10/16/24 clics)
  const lb = { rarity: 0, progress: 0, chests: 3, busy: false, owned: {} };

  const chestBtn = $("#lootbox-btn");
  const chestStage = $("#chest-stage");
  const gaugeFill = $("#gauge-fill");
  const gaugeLabel = $("#gauge-label");
  const gaugeTrack = $("#gauge-track");
  const hint = $("#demo-hint");
  const chestsLeft = $("#chests-left");
  const flash = $("#rarity-flash");
  const burst = $("#burst");
  const revealPlush = $("#reveal-plush");
  const resultBox = $("#demo-result");

  function paintChest() {
    chestStage.innerHTML = "";
    if (HAS3D) {
      const c = document.createElement("canvas");
      c.id = "chest-canvas";
      c.width = 210;  /* = taille CSS : évite tout écrasement du rendu */
      c.height = 190;
      c.style.width = "210px";
      c.style.height = "190px";
      chestStage.appendChild(c);
      M3.renderChest(c, 0, {});
    } else {
      chestStage.innerHTML = MM.chestSVG();
    }
  }
  paintChest();

  function paintGauge() {
    const pct = Math.min(100, (lb.progress / NEED) * 100);
    gaugeFill.style.width = pct + "%";
    gaugeTrack.setAttribute("aria-valuenow", String(lb.progress));
    const r = D.RARITIES[lb.rarity];
    gaugeLabel.textContent = "Rareté " + r.name + (lb.progress > 0 ? " · " + lb.progress + "/" + NEED : "");
    chestsLeft.textContent = String(lb.chests);
  }

  function doFlash(color) {
    flash.style.background = "radial-gradient(circle, " + color + "55 0%, transparent 65%)";
    flash.classList.remove("go");
    void flash.offsetWidth;
    flash.classList.add("go");
  }

  function doBurst(color) {
    burst.innerHTML = "";
    for (let i = 0; i < 14; i++) {
      const p = document.createElement("i");
      const angle = (Math.PI * 2 * i) / 14 + rand(-0.2, 0.2);
      const dist = rand(70, 120);
      p.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      p.style.setProperty("--dy", Math.sin(angle) * dist - 20 + "px");
      p.style.background = i % 3 === 0 ? "#fff" : i % 3 === 1 ? color : MM.shade(color, .35);
      burst.appendChild(p);
    }
    burst.classList.remove("go");
    void burst.offsetWidth;
    burst.classList.add("go");
  }

  function clickBox() {
    if (lb.busy || lb.chests <= 0 || revealPlush.classList.contains("show")) return;
    chestBtn.classList.remove("charging");
    void chestBtn.offsetWidth;
    chestBtn.classList.add("charging");

    lb.progress += 1;
    const r = D.RARITIES[lb.rarity];

    // Montée en rareté — mêmes chances que le moteur serveur du jeu
    if (lb.rarity < 4 && Math.random() < UPGRADE[lb.rarity]) {
      lb.rarity += 1;
      lb.progress = 0;
      const nr = D.RARITIES[lb.rarity];
      doFlash(nr.color);
      hint.textContent = "✨ Montée en rareté : " + nr.name + " ! Continuez !";
      toast("La jauge passe en <b>" + nr.name + "</b> — prochaine peluche garantie à ce niveau !");
    } else {
      hint.textContent =
        lb.progress >= NEED ? "Le coffre tremble…" : rand(0, 1) < .5 ? "Encore un clic !" : "La jauge se charge…";
    }
    paintGauge();

    if (lb.progress >= NEED) openChest();
  }

  function openChest() {
    lb.busy = true;
    lb.chests -= 1;
    chestBtn.classList.remove("opening");
    void chestBtn.offsetWidth;
    chestBtn.classList.add("opening");

    setTimeout(() => {
      const r = D.RARITIES[lb.rarity];
      // Tirage fidèle : peluche de la pool officielle au niveau courant + vraie mutation
      const candidates = D.POOL.filter((p) => p.rarity === lb.rarity);
      const entry = pick(candidates.length ? candidates : D.POOL);
      const mut = D.rollMutation();

      const key = D.mutationKey(mut);
      lb.owned[entry.id + "::" + key] = (lb.owned[entry.id + "::" + key] || 0) + 1;
      const count = lb.owned[entry.id + "::" + key];

      doBurst(r.color);
      doFlash(r.color);

      // La VRAIE peluche 3D (ou SVG de secours) révélée sur scène
      revealPlush.innerHTML = "";
      revealPlush.appendChild(plushNode(entry, mut, { w: 200, h: 190, className: "plush-reveal-3d" }));
      revealPlush.classList.add("show");
      chestStage.style.opacity = "0";

      // Carte résultat
      $("#result-rarity").textContent = r.name;
      $("#result-rarity").style.setProperty("--rc", r.color);
      $("#result-name").textContent = entry.name;
      $("#result-species").textContent = D.SHAPE_LABELS[entry.shape] + (mut.hetero ? " · Hétérochromie" : "");
      const mutList = $("#result-mutations");
      mutList.innerHTML = "";
      const tags = [
        "Yeux " + mut.eye.label,
        mut.fur.id !== "nature" ? mut.fur.label : "Fourrure Nature",
        mut.tint.kind !== "nature" ? mut.tint.label : null,
        mut.hetero ? "Hétérochromie ✨" : null,
      ].filter(Boolean);
      tags.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        mutList.appendChild(li);
      });
      const dupe = $("#result-dupe");
      if (count > 1) { dupe.hidden = false; dupe.textContent = "×" + count + " doublon → pile"; }
      else dupe.hidden = true;

      // Mini peluche sur la carte résultat
      const miniSlot = $("#result-plush");
      miniSlot.innerHTML = "";
      miniSlot.appendChild(plushNode(entry, mut, { w: 110, h: 104, className: "plush-mini-3d" }));

      resultBox.hidden = false;
      if (lb.rarity >= 3) toast(lb.rarity === 4 ? "🔥 <b>MYTHIQUE</b> ! " + entry.name + " est à vous !" : "🌟 <b>Légendaire</b> — félicitations !");
      hint.textContent = "Une " + r.name.toLowerCase() + " rejoint votre collection !";

      paintGauge();
      lb.busy = false;
    }, 620);
  }

  function resetReveal() {
    revealPlush.classList.remove("show");
    revealPlush.innerHTML = "";
    chestStage.style.opacity = "1";
    resultBox.hidden = true;
    lb.rarity = 0;
    lb.progress = 0;
    paintGauge();
    hint.textContent = lb.chests > 0 ? "Cliquez sur le coffre pour charger la jauge !" : "Coffres épuisés — rechargez la démo !";
  }

  chestBtn.addEventListener("click", clickBox);
  $("#demo-again").addEventListener("click", function () {
    if (lb.chests <= 0) {
      lb.chests = 3;
      paintChest();
      toast("🎁 Démo rechargée — 3 nouveaux coffres !");
    }
    resetReveal();
  });
  paintGauge();

  // Bouton hero : scrolle vers la démo et déclenche un clic
  $("#hero-demo-btn").addEventListener("click", function () {
    $("#demo").scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => { if (!lb.busy) clickBox(); }, 650);
  });

  /* ==========================================================================
     2. COLLECTION — une peluche par espèce + quelques variations de mutations
        (37 000+ combinaisons possibles : on n'affiche pas tout !)
     ========================================================================== */
  const grid = $("#cards-grid");

  /* Une peluche représentative pour chacune des 10 espèces du jeu,
   * choisie pour couvrir les 5 niveaux de rareté. */
  const SPECIES_REPS = [
    "cafe-creme", "renard-cannelle", "mure-sucree", "ours-myrtille",
    "aurore-boreale", "grenouille-emeraude", "soleil-couchant",
    "licorne-celeste", "hibou-galaxie", "pingouin-prisme",
  ];

  function mutOf(eyeId, furId, tintId) {
    return {
      eye: D.EYES.find((e) => e.id === eyeId),
      fur: D.FUR.find((f) => f.id === furId),
      tint: D.TINTS.find((t) => t.id === tintId),
      hetero: null,
    };
  }

  /* Deux variations officielles, nées avec des mutations rares. */
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

  function addCard(entry, mut, name, speciesLine, tagline, rarityIdx) {
    const r = D.RARITIES[rarityIdx];
    const el = document.createElement("article");
    el.className = "plush-card entering";
    el.style.setProperty("--rc", r.color);
    if (HAS3D) el.style.setProperty("--glow", entry.preset.glow);
    el.dataset.rarity = String(rarityIdx);
    el.innerHTML =
      '<span class="card-rarity">' + r.name + "</span>" +
      '<div class="card-plush"></div>' +
      "<h3>" + name + "</h3>" +
      '<p class="card-species">' + speciesLine + "</p>" +
      '<p class="card-tagline">' + tagline + "</p>";
    el.querySelector(".card-plush").appendChild(
      plushNode(entry, mut, { w: 156, h: 146, className: "plush-card-3d" })
    );
    grid.appendChild(el);
  }

  SPECIES_REPS.forEach((id, i) => {
    const entry = D.POOL.find((p) => p.id === id);
    if (!entry) return;
    addCard(entry, null, entry.name, D.SHAPE_LABELS[entry.shape], entry.tagline, entry.rarity);
  });
  VARIANTS.forEach((v) => {
    const rIdx = D.RARITIES.findIndex((r) => r.id === D.mutationRarity(v.mut));
    addCard(v.entry, v.mut, v.name, v.speciesLine, v.tagline, rIdx);
  });

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const f = chip.dataset.filter;
      let visible = 0;
      $$(".plush-card").forEach((card) => {
        const show = f === "all" || card.dataset.rarity === f;
        card.classList.toggle("hidden", !show);
        card.classList.remove("entering");
        if (show) {
          void card.offsetWidth;
          card.style.animationDelay = Math.min(visible, 14) * 0.05 + "s";
          card.classList.add("entering");
          visible++;
        }
      });
      let note = grid.querySelector(".empty-note");
      if (visible === 0 && !note) {
        note = document.createElement("p");
        note.className = "empty-note";
        note.textContent = "Aucune peluche à ce niveau — ouvrez donc une lootbox !";
        grid.appendChild(note);
      } else if (note) note.remove();
    });
  });

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
     4. ENCHÈRE LIVE SIMULÉE — Prisme Sacré, le mythique historique
     ========================================================================== */
  const BOTS = ["MochiKing", "NuageDoux", "PixelPanda", "LunaFan_07", "DragonRoule", "PeluchePro", "MochiMochi", "Tendresse99"];
  const auction = { price: 12, seconds: 2 * 3600, over: false };
  const auctionEntry = findPlush("prisme-sacre");
  $("#auction-plush").appendChild(
    plushNode(auctionEntry, null, { w: 150, h: 150, className: "plush-auction-3d" })
  );
  const priceEl = $("#auction-price");
  const bidNext = $("#bid-next");
  const timerEl = $("#auction-timer");
  const history = $("#bid-history");

  function fmt(t) {
    const h = String(Math.floor(t / 3600)).padStart(2, "0");
    const m = String(Math.floor((t % 3600) / 60)).padStart(2, "0");
    const s = String(t % 60).padStart(2, "0");
    return h + ":" + m + ":" + s;
  }

  function addBid(name, amount, you) {
    const li = document.createElement("li");
    if (you) li.className = "you";
    li.innerHTML = "<b>" + name + "</b><span>enchérit " + amount + " 🪙</span><time>" + (you ? "à l'instant" : "il y a " + Math.max(1, Math.round(rand(1, 9))) + " min") + "</time>";
    history.prepend(li);
    while (history.children.length > 8) history.lastChild.remove();
    auction.price = amount;
    priceEl.textContent = String(amount);
    bidNext.textContent = String(amount + 1);
    priceEl.parentElement.classList.remove("bump");
    void priceEl.offsetWidth;
    priceEl.parentElement.classList.add("bump");
  }

  $("#bid-btn").addEventListener("click", () => {
    if (auction.over) return;
    addBid("Vous", auction.price + 1, true);
    toast("✅ Enchère enregistrée : <b>" + auction.price + " 🪙</b> — vous menez l'enchère !");
  });

  setInterval(() => {
    if (auction.seconds > 0) {
      auction.seconds -= 1;
      timerEl.textContent = fmt(auction.seconds);
    } else if (!auction.over) {
      auction.over = true;
      timerEl.textContent = "Terminé";
      toast("🔨 Enchère terminée — <b>" + auction.price + " 🪙</b> ! La peluche change de main.");
    }
  }, 1000);

  (function botLoop() {
    setTimeout(() => {
      if (!auction.over && document.visibilityState === "visible") {
        if (Math.random() < 0.8) {
          const amount = auction.price + (Math.random() < 0.22 ? 2 : 1);
          const botName = pick(BOTS);
          addBid(botName, amount, false);
          toast("⚡ <b>" + botName + "</b> vient d'enchérir " + amount + " 🪙");
        }
      }
      botLoop();
    }, rand(6000, 12000));
  })();

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
