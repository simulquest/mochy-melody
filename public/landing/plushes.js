/* ==========================================================================
   Mochy Melody — Données officielles + secours SVG
   Les VRAIES peluches sont rendues en 3D par plush3d.js (window.MM3D).
   Ce module fournit : les pools de mutations officiels et un rendu SVG
   de secours (si WebGL est indisponible), fidèle aux couleurs du jeu.
   ========================================================================== */
window.MM = (function () {
  "use strict";

  /* ---------- Raretés officielles (lootbox.ts) ---------- */
  const RARITIES = [
    { id: "commune", name: "Commune", color: "#b8bfcc", clicks: 3, upgrade: 0.12 },
    { id: "rare", name: "Rare", color: "#ff7ac2", clicks: 6, upgrade: 0.09 },
    { id: "epique", name: "Épique", color: "#a06bff", clicks: 10, upgrade: 0.06 },
    { id: "legendaire", name: "Légendaire", color: "#ffc14d", clicks: 16, upgrade: 0.035 },
    { id: "mythique", name: "Mythique", color: "#ff5f9e", clicks: 24, upgrade: 0 },
  ];
  const RIDX = { commune: 0, rare: 1, epique: 2, legendaire: 3, mythique: 4 };

  /* ---------- Silhouettes 3D (species.ts) ---------- */
  const SHAPE_LABELS = {
    mochi: "Chat", dragon: "Dragon", lapin: "Lapin", fantome: "Fantôme",
    renard: "Renard", ours: "Ours", grenouille: "Grenouille",
    licorne: "Licorne", hibou: "Hibou", pingouin: "Pingouin",
  };

  /* ---------- Pools de mutations officiels (mutations.ts) ---------- */
  const EYES = [
    { id: "noisette", label: "Noisette", color: "#231a2b", rarity: "commune", w: 52 },
    { id: "ciel", label: "Bleu ciel", color: "#4ea3ff", rarity: "rare", w: 18 },
    { id: "emeraude", label: "Émeraude", color: "#2fd6a4", rarity: "rare", w: 14 },
    { id: "amethyste", label: "Améthyste", color: "#b26bff", glow: true, rarity: "epique", w: 8 },
    { id: "solaire", label: "Or solaire", color: "#ffb020", glow: true, rarity: "epique", w: 5 },
    { id: "braise", label: "Braise", color: "#ff7a3d", glow: true, rarity: "legendaire", w: 2.2 },
    { id: "prisme", label: "Prisme", color: "#ff5fd8", color2: "#35e6ff", glow: true, rarity: "mythique", w: 0.8 },
  ];
  const FUR = [
    { id: "nature", label: "Nature", rarity: "commune", w: 55 },
    { id: "doree", label: "Pointe dorée", tip: "#ffd166", rarity: "rare", w: 24 },
    { id: "panache", label: "Panaché", twoTone: true, rarity: "epique", w: 15 },
    { id: "nacree", label: "Nacrée", tip: "#ffeef8", rarity: "legendaire", w: 4.5 },
    { id: "galaxie", label: "Galaxie", tip: "#ffffff", rainbow: true, rarity: "mythique", w: 1.5 },
  ];
  const TINTS = [
    { id: "naturelle", label: "Naturelle", kind: "nature", rarity: "commune", w: 87 },
    { id: "albinos", label: "Albinos", kind: "albinos", rarity: "rare", w: 9 },
    { id: "charbon", label: "Charbon", kind: "charbon", rarity: "epique", w: 4 },
  ];

  function wpick(arr) {
    let total = 0;
    for (const a of arr) total += a.w;
    let r = Math.random() * total;
    for (const a of arr) { r -= a.w; if (r <= 0) return a; }
    return arr[arr.length - 1];
  }
  function rollMutation() {
    const eye = wpick(EYES), fur = wpick(FUR), tint = wpick(TINTS);
    let hetero = null;
    if (Math.random() < 0.10) {
      const others = EYES.filter((e) => e.id !== eye.id);
      hetero = others[Math.floor(Math.random() * others.length)];
    }
    return { eye, fur, tint, hetero };
  }
  function mutationRarity(mut) {
    let best = "commune";
    const parts = [mut.eye.rarity, mut.fur.rarity, mut.tint.rarity];
    if (mut.hetero) parts.push("rare");
    for (const p of parts) if (RIDX[p] > RIDX[best]) best = p;
    return best;
  }
  function mutationKey(mut) {
    if (!mut || (mut.eye.id === "noisette" && mut.fur.id === "nature" && mut.tint.kind === "nature" && !mut.hetero)) return "none";
    let k = "eye:" + mut.eye.id + "|fur:" + mut.fur.id + "|tint:" + mut.tint.id;
    if (mut.hetero) k += "|hetero:" + mut.hetero.id;
    return k;
  }

  /* ---------- Pool officiel des 44 peluches (roster du jeu) ---------- */
  const P = (id, name, root, tip, body, glow, hueShift) =>
    ({ id, name, root, tip, body, glow, ...(hueShift ? { hueShift: 1 } : {}) });
  const POOL = [
    { id: "brique-tendresse", name: "Brique Tendresse", shape: "dragon", rarity: 0, tagline: "Câline et robuste, elle réchauffe les cœurs.", preset: P("brique-tendresse", "Brique Tendresse", "#5c2418", "#ffab8f", "#c46445", "#ff8a5c") },
    { id: "brume-douce", name: "Brume Douce", shape: "lapin", rarity: 0, tagline: "Une brume toute douce qui sent le coton.", preset: P("brume-douce", "Brume Douce", "#4a4552", "#d9d4e0", "#8f8899", "#c9c2d4") },
    { id: "fraise-tagada", name: "Fraise Tagada", shape: "fantome", rarity: 1, tagline: "Sucrée, rose et un peu farceuse.", preset: P("fraise-tagada", "Fraise Tagada", "#8f1039", "#ffa8c9", "#e83a70", "#ff4f8f") },
    { id: "mure-sucree", name: "Mûre Sucrée", shape: "dragon", rarity: 1, tagline: "Petite boule violine aux ailes de confiture.", preset: P("mure-sucree", "Mûre Sucrée", "#3a1050", "#cf9fff", "#7d3ab8", "#a86bff") },
    { id: "aurore-boreale", name: "Aurore Boréale", shape: "lapin", rarity: 2, tagline: "Ses oreilles captent les lumières du Nord.", preset: P("aurore-boreale", "Aurore Boréale", "#0d3a33", "#7affe0", "#17a08a", "#3dffc4") },
    { id: "orchidee-neon", name: "Orchidée Néon", shape: "fantome", rarity: 2, tagline: "Elle brille dans la pénombre des serres.", preset: P("orchidee-neon", "Orchidée Néon", "#4a0d4a", "#ff9ff3", "#c93ac9", "#ff5ce1") },
    { id: "or-rose-royal", name: "Or Rose Royal", shape: "dragon", rarity: 3, tagline: "Sa couronne de braise scintille d'or rose.", preset: P("or-rose-royal", "Or Rose Royal", "#8f5c1a", "#ffe9b8", "#e8b84d", "#ffd76b") },
    { id: "emeraude-imperiale", name: "Émeraude Impériale", shape: "lapin", rarity: 3, tagline: "Un joyau tout rond venu des jungles d'antan.", preset: P("emeraude-imperiale", "Émeraude Impériale", "#0d3d24", "#7dffc9", "#17a860", "#3dff9c") },
    { id: "soleil-couchant", name: "Soleil Couchant", shape: "fantome", rarity: 3, tagline: "Il flotte à l'heure où le ciel devient orange.", preset: P("soleil-couchant", "Soleil Couchant", "#7a1f0d", "#ffc98f", "#f07a3a", "#ff9c4d") },
    { id: "prisme-sacre", name: "Prisme Sacré", shape: "dragon", rarity: 4, tagline: "Sa fourrure arc-en-ciel change au moindre souffle.", preset: P("prisme-sacre", "Prisme Sacré", "#33201a", "#fff4e0", "#a85c2a", "#ffb84d", 1) },
    { id: "cafe-creme", name: "Café Crème", shape: "mochi", rarity: 0, tagline: "Un chat tout doux aux couleurs du café et de la crème.", preset: P("cafe-creme", "Café Crème", "#4a3520", "#e8cfa8", "#9c7a4e", "#d9b06c") },
    { id: "pistache-reveil", name: "Pistache Réveil", shape: "mochi", rarity: 1, tagline: "Un chat vert tendre, frais comme un matin de printemps.", preset: P("pistache-reveil", "Pistache Réveil", "#2a5c30", "#b8f0a8", "#5fae5a", "#8fe07a") },
    { id: "sorbet-mangue", name: "Sorbet Mangue", shape: "mochi", rarity: 2, tagline: "Un chat aux couleurs lumineuses d'un sorbet à la mangue.", preset: P("sorbet-mangue", "Sorbet Mangue", "#7a3a0d", "#ffe08f", "#f0a83a", "#ffc94d") },
    { id: "galaxie-arc-en-ciel", name: "Galaxie Arc-en-ciel", shape: "mochi", rarity: 4, tagline: "Un chat mythique dont la fourrure révèle toutes les couleurs.", preset: P("galaxie-arc-en-ciel", "Galaxie Arc-en-ciel", "#1a0d33", "#ffffff", "#4d2a8f", "#b26bff", 1) },
    { id: "renard-cannelle", name: "Renard Cannelle", shape: "renard", rarity: 0, tagline: "Sa queue touffue sent bon la cannelle et les matins d'automne.", preset: P("renard-cannelle", "Renard Cannelle", "#8a3b12", "#ffd9a8", "#e07a3a", "#ffb066") },
    { id: "renard-neige", name: "Renard Neige", shape: "renard", rarity: 0, tagline: "Il se fond dans les congères et ne laisse que deux yeux malicieux.", preset: P("renard-neige", "Renard Neige", "#7a8794", "#ffffff", "#e8eef5", "#cfe6ff") },
    { id: "renard-miel", name: "Renard Miel", shape: "renard", rarity: 1, tagline: "Ses oreilles dorées bourdonnent doucement quand il est content.", preset: P("renard-miel", "Renard Miel", "#8a5a12", "#ffe6a8", "#e0a83a", "#ffd166") },
    { id: "renard-braise", name: "Renard Braise", shape: "renard", rarity: 2, tagline: "Il danse autour du feu et fait crépiter sa fourrure écarlate.", preset: P("renard-braise", "Renard Braise", "#6a160d", "#ffb08f", "#e0432a", "#ff7a3d") },
    { id: "renard-aurore", name: "Renard Aurore", shape: "renard", rarity: 3, tagline: "Ses poils captent les premières lueurs roses du ciel polaire.", preset: P("renard-aurore", "Renard Aurore", "#5a1a3a", "#ffd1e8", "#d94a8a", "#ff8fc4") },
    { id: "ours-chocolat", name: "Ours Chocolat", shape: "ours", rarity: 0, tagline: "Un gros câlin fondant qui laisse des miettes de bonheur.", preset: P("ours-chocolat", "Ours Chocolat", "#4a2a18", "#d9b08f", "#8a5a3a", "#c98a5c") },
    { id: "ours-caramel", name: "Ours Caramel", shape: "ours", rarity: 0, tagline: "Ses pattes collent un peu, mais son cœur est tout mou.", preset: P("ours-caramel", "Ours Caramel", "#6a4a1a", "#ffd9a8", "#c98a4b", "#ffb56b") },
    { id: "ours-myrtille", name: "Ours Myrtille", shape: "ours", rarity: 1, tagline: "Il revient toujours de la forêt avec le museau tout bleu.", preset: P("ours-myrtille", "Ours Myrtille", "#2a1a4a", "#b8a8ff", "#6a4ac9", "#9c7aff") },
    { id: "ours-foret", name: "Ours Forêt", shape: "ours", rarity: 2, tagline: "De la mousse plein les oreilles et des champignons dans la fourrure.", preset: P("ours-foret", "Ours Forêt", "#1a3a24", "#a8e0b8", "#3a8a5a", "#5cc98a") },
    { id: "ours-polaire", name: "Ours Polaire", shape: "ours", rarity: 3, tagline: "Il dort dix mois par an et rêve de glaces à la vanille.", preset: P("ours-polaire", "Ours Polaire", "#4a6a7a", "#ffffff", "#cfe6f0", "#a8e0ff") },
    { id: "grenouille-menthe", name: "Grenouille Menthe", shape: "grenouille", rarity: 0, tagline: "Un petit saut frais qui réveille toute la mare.", preset: P("grenouille-menthe", "Grenouille Menthe", "#1a4a2a", "#b8ffd1", "#4ac97a", "#7affa8") },
    { id: "grenouille-citron", name: "Grenouille Citron", shape: "grenouille", rarity: 0, tagline: "Sa peau pétille comme une limonade un jour de fête.", preset: P("grenouille-citron", "Grenouille Citron", "#4a5a1a", "#f0ffa8", "#a8c93a", "#d1ff5c") },
    { id: "grenouille-lagon", name: "Grenouille Lagon", shape: "grenouille", rarity: 1, tagline: "Elle connaît toutes les flaques secrètes du récif.", preset: P("grenouille-lagon", "Grenouille Lagon", "#0d3a4a", "#a8f0ff", "#2aa8c9", "#5cd1ff") },
    { id: "grenouille-rose", name: "Grenouille Rose", shape: "grenouille", rarity: 1, tagline: "Elle rougit quand on la regarde, puis saute dans les nénuphars.", preset: P("grenouille-rose", "Grenouille Rose", "#4a1a3a", "#ffb8e0", "#e05aa8", "#ff8fd1") },
    { id: "grenouille-emeraude", name: "Grenouille Émeraude", shape: "grenouille", rarity: 2, tagline: "Ses yeux brillent comme deux pierres précieuses au fond de l'eau.", preset: P("grenouille-emeraude", "Grenouille Émeraude", "#0d3d24", "#7dffc9", "#17a860", "#3dff9c") },
    { id: "licorne-nuage", name: "Licorne Nuage", shape: "licorne", rarity: 0, tagline: "Elle trotte sur les nuages et laisse une traînée de ouate.", preset: P("licorne-nuage", "Licorne Nuage", "#7a6a8a", "#ffffff", "#e8e0f0", "#ffd9ef") },
    { id: "licorne-lavande", name: "Licorne Lavande", shape: "licorne", rarity: 0, tagline: "Son parfum endort les chagrins et réveille les rêves.", preset: P("licorne-lavande", "Licorne Lavande", "#4a3a6a", "#e0d1ff", "#9c7ad9", "#c9a8ff") },
    { id: "licorne-pastel", name: "Licorne Pastel", shape: "licorne", rarity: 1, tagline: "Sa crinière change de couleur au rythme de ses humeurs.", preset: P("licorne-pastel", "Licorne Pastel", "#6a4a5a", "#ffe0f0", "#e0a8c9", "#ffc9e0") },
    { id: "licorne-doree", name: "Licorne Dorée", shape: "licorne", rarity: 2, tagline: "Chaque pas qu'elle fait laisse une petite poussière d'or.", preset: P("licorne-doree", "Licorne Dorée", "#7a5a1a", "#fff0b8", "#e0b84d", "#ffd76b") },
    { id: "licorne-celeste", name: "Licorne Céleste", shape: "licorne", rarity: 3, tagline: "Sa corne indique le chemin des étoiles filantes.", preset: P("licorne-celeste", "Licorne Céleste", "#1a2a5a", "#b8d1ff", "#4a7ae0", "#8fa8ff") },
    { id: "hibou-noisette", name: "Hibou Noisette", shape: "hibou", rarity: 0, tagline: "Il hulule des berceuses en grignotant une noisette.", preset: P("hibou-noisette", "Hibou Noisette", "#4a3a24", "#d9c0a8", "#8a6a4a", "#c9a87a") },
    { id: "hibou-perle", name: "Hibou Perle", shape: "hibou", rarity: 1, tagline: "Ses plumes nacrées luisent doucement les nuits sans lune.", preset: P("hibou-perle", "Hibou Perle", "#5a5a6a", "#ffffff", "#b8b8c9", "#e0e0f0") },
    { id: "hibou-crepuscule", name: "Hibou Crépuscule", shape: "hibou", rarity: 1, tagline: "Il veille entre chien et loup, les yeux grands ouverts.", preset: P("hibou-crepuscule", "Hibou Crépuscule", "#2a1a4a", "#ffb88f", "#6a3a8a", "#ff8f5c") },
    { id: "hibou-lunaire", name: "Hibou Lunaire", shape: "hibou", rarity: 2, tagline: "Ses yeux reflètent la lune même en plein jour.", preset: P("hibou-lunaire", "Hibou Lunaire", "#1a2a3a", "#d1e0ff", "#4a6a8a", "#a8c9ff") },
    { id: "hibou-galaxie", name: "Hibou Galaxie", shape: "hibou", rarity: 4, tagline: "Une nuit entière est nichée dans le duvet de son ventre.", preset: P("hibou-galaxie", "Hibou Galaxie", "#0d0a2a", "#ffffff", "#3a2a8a", "#b26bff", 1) },
    { id: "pingouin-glacier", name: "Pingouin Glacier", shape: "pingouin", rarity: 0, tagline: "Il glisse sur le ventre plus vite que son ombre.", preset: P("pingouin-glacier", "Pingouin Glacier", "#1a3a4a", "#d1f0ff", "#4a8aa8", "#8fd1ff") },
    { id: "pingouin-mandarine", name: "Pingouin Mandarine", shape: "pingouin", rarity: 1, tagline: "Son bec orange sent bon les agrumes et le froid piquant.", preset: P("pingouin-mandarine", "Pingouin Mandarine", "#1a1a1a", "#ffd1a8", "#e07a3a", "#ffb066") },
    { id: "pingouin-eclipse", name: "Pingouin Éclipse", shape: "pingouin", rarity: 2, tagline: "Il nage dans l'ombre et ne réapparaît qu'au lever du soleil.", preset: P("pingouin-eclipse", "Pingouin Éclipse", "#0d0d1a", "#b8a8ff", "#3a2a5a", "#8f7aff") },
    { id: "pingouin-boreal", name: "Pingouin Boréal", shape: "pingouin", rarity: 3, tagline: "Ses plumes s'illuminent comme une aurore au-dessus des glaces.", preset: P("pingouin-boreal", "Pingouin Boréal", "#0d3a33", "#7affe0", "#17a08a", "#3dffc4") },
    { id: "pingouin-prisme", name: "Pingouin Prisme", shape: "pingouin", rarity: 4, tagline: "La lumière se brise sur son ventre en mille couleurs dansantes.", preset: P("pingouin-prisme", "Pingouin Prisme", "#1a1a2a", "#ffffff", "#5a5a8a", "#b26bff", 1) },
  ];

  const HUB_PLUSHES = [
    { id: "mochi", name: "Mochi Chat", shape: "mochi", tagline: "Le classique tout rond, doux comme un mochi frais.", preset: P("sakura", "Sakura Mochi", "#6d0e63", "#ff8fe4", "#d02bbd", "#ff3fd8") },
    { id: "dragon", name: "Dragonnet", shape: "dragon", tagline: "Rondouillard cracheur de braises, cornes fières et museau arrondi.", preset: P("dragonnet", "Dragonnet", "#7c2413", "#ffa94d", "#c4472e", "#ff8a5c") },
    { id: "lapin", name: "Pompon Lapin", shape: "lapin", tagline: "Tout en hauteur avec de grandes oreilles et un cœur tout doux.", preset: P("pompon", "Pompon Lapin", "#b59ada", "#ffe9f4", "#e9def4", "#d9b3ff") },
    { id: "fantome", name: "Piou Fantôme", shape: "fantome", tagline: "Il flotte, il brille, et sa jupe ondule toute seule la nuit.", preset: P("piou", "Piou Fantôme", "#6f93c8", "#e6f4ff", "#aecdf2", "#9cc2ff") },
  ];

  /* =====================================================================
     Rendu SVG de secours (si WebGL indisponible)
     ===================================================================== */
  function shade(hex, pct) {
    const n = hex.replace("#", "");
    const num = parseInt(n, 16);
    let r = (num >> 16) & 255, g = (num >> 8) & 255, b = num & 255;
    const t = pct < 0 ? 0 : 255, p = Math.abs(pct);
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  /* Espèce SVG la plus proche pour chaque silhouette 3D (secours uniquement) */
  const SVG_SHAPE = { mochi: "lapin", dragon: "dragon", lapin: "lapin", fantome: "fantome", renard: "dragon", ours: "dragon", grenouille: "fantome", licorne: "lapin", hibou: "fantome", pingouin: "fantome" };

  function eye(cx, cy, color, o, u) {
    const dark = "#3a2b4a";
    const irisFill = o.prism ? "url(#" + u + "prism)" : color;
    const halo = o.glow
      ? '<circle cx="' + cx + '" cy="' + cy + '" r="15.5" fill="' + color + '" opacity=".32"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="19" fill="' + color + '" opacity=".14"/>'
      : "";
    return halo +
      '<circle cx="' + cx + '" cy="' + cy + '" r="11" fill="' + dark + '"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="7.6" fill="' + irisFill + '"/>' +
      '<circle cx="' + cx + '" cy="' + (cy + 1.4) + '" r="3.9" fill="' + dark + '"/>' +
      '<circle cx="' + (cx - 3.1) + '" cy="' + (cy - 3.6) + '" r="3.1" fill="#fff"/>' +
      '<circle cx="' + (cx + 3) + '" cy="' + (cy + 4.2) + '" r="1.5" fill="#fff" opacity=".9"/>';
  }
  function mouthW(x, y) {
    return '<path d="M' + x + ' ' + y + ' q4.5 5 9 0 q4.5 5 9 0" stroke="#3a2b4a" stroke-width="3" fill="none" stroke-linecap="round"/>';
  }
  function cheeks(x1, x2, cy) {
    return '<circle cx="' + x1 + '" cy="' + cy + '" r="9" fill="#ff8fb8" opacity=".5"/>' +
           '<circle cx="' + x2 + '" cy="' + cy + '" r="9" fill="#ff8fb8" opacity=".5"/>';
  }
  function stars(list) {
    return list.map(function (s) {
      return '<path d="M' + s[0] + ' ' + (s[1] - 5) + ' L' + (s[0] + 1.6) + ' ' + (s[1] - 1.6) + ' L' + (s[0] + 5) + ' ' + s[1] +
        ' L' + (s[0] + 1.6) + ' ' + (s[1] + 1.6) + ' L' + s[0] + ' ' + (s[1] + 5) +
        ' L' + (s[0] - 1.6) + ' ' + (s[1] + 1.6) + ' L' + (s[0] - 5) + ' ' + s[1] +
        ' L' + (s[0] - 1.6) + ' ' + (s[1] - 1.6) + ' Z" fill="#fff" opacity=".9"/>';
    }).join("");
  }

  let __uid = 0;
  function svgFor(entry, mut) {
    const u = "svgfb" + (++__uid);
    const m = mut || { eye: EYES[0], fur: FUR[0], tint: TINTS[0], hetero: null };
    const p = entry.preset;
    const o = {
      body: p.body, belly: shade(p.tip, 0.55),
      eyeL: m.eye.color, eyeR: (m.hetero && m.hetero.color) || m.eye.color2 || m.eye.color,
      glow: m.eye.glow, prism: m.eye.prism || m.eye.id === "prisme",
      tips: m.fur.tip || null, twoTone: m.fur.twoTone || false,
      rainbow: !!(p.hueShift || m.fur.rainbow),
    };
    if (m.tint.kind === "albinos") { o.body = "#fdf3ea"; o.belly = "#fffaf4"; }
    if (m.tint.kind === "charbon") { o.body = "#6f6879"; o.belly = "#948d9f"; }

    let defs = "";
    if (o.rainbow) {
      defs += '<linearGradient id="' + u + 'rb" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#ff9bb8"/><stop offset=".28" stop-color="#ffc9a1"/>' +
        '<stop offset=".52" stop-color="#fff3a6"/><stop offset=".74" stop-color="#9fe8c8"/>' +
        '<stop offset="1" stop-color="#b9a6ff"/></linearGradient>';
    }
    if (o.tips) {
      defs += '<linearGradient id="' + u + 'tip" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="' + o.tips + '"/><stop offset=".55" stop-color="' + o.tips + '" stop-opacity=".35"/>' +
        '<stop offset="1" stop-color="' + o.body + '" stop-opacity="0"/></linearGradient>';
    }
    if (o.prism) {
      defs += '<linearGradient id="' + u + 'prism" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#ff5fd8"/><stop offset="1" stop-color="#35e6ff"/></linearGradient>';
    }

    const species = SVG_SHAPE[entry.shape] || "lapin";
    const bodyFill = o.rainbow ? "url(#" + u + "rb)" : o.body;
    const tipFill = o.rainbow ? "url(#" + u + "rb)" : (o.tips ? "url(#" + u + "tip)" : null);
    const twoTone = o.twoTone ? '<path d="M110 72 a62 62 0 0 0 0 124 Z" fill="#fff" opacity=".28"/>' : "";
    const shadow = '<ellipse cx="110" cy="205" rx="40" ry="8" fill="#3a2b4a" opacity=".07"/>';
    let art = "";

    if (species === "lapin") {
      const earFill = tipFill || o.body;
      art += '<g>' +
        '<ellipse cx="86" cy="56" rx="17" ry="46" fill="' + earFill + '" transform="rotate(-9 86 56)"/>' +
        '<ellipse cx="86" cy="60" rx="8.5" ry="30" fill="' + o.belly + '" transform="rotate(-9 86 56)"/>' +
        '<ellipse cx="134" cy="56" rx="17" ry="46" fill="' + earFill + '" transform="rotate(9 134 56)"/>' +
        '<ellipse cx="134" cy="60" rx="8.5" ry="30" fill="' + o.belly + '" transform="rotate(9 134 56)"/>' +
        '<ellipse cx="52" cy="142" rx="12" ry="17" fill="' + o.body + '" transform="rotate(16 52 142)"/>' +
        '<ellipse cx="168" cy="142" rx="12" ry="17" fill="' + o.body + '" transform="rotate(-16 168 142)"/>' +
        '<ellipse cx="84" cy="190" rx="17" ry="11" fill="' + shade(o.body, -.08) + '"/>' +
        '<ellipse cx="136" cy="190" rx="17" ry="11" fill="' + shade(o.body, -.08) + '"/>' +
        '<circle cx="110" cy="134" r="62" fill="' + bodyFill + '"/>' + twoTone +
        '<ellipse cx="110" cy="154" rx="37" ry="30" fill="' + o.belly + '"/>' +
        (o.rainbow ? stars([[78, 112], [142, 108], [110, 92]]) : "") +
        eye(88, 122, o.eyeL, o, u) + eye(132, 122, o.eyeR, o, u) +
        mouthW(101, 142) + cheeks(64, 156, 138) + '</g>';
    } else if (species === "dragon") {
      const spikeFill = tipFill || "#ffe9c9";
      const wingFill = o.rainbow ? "url(#" + u + "rb)" : shade(o.body, -.14);
      art += '<g>' +
        '<path d="M158 168 Q200 172 195 136 Q191 112 166 118" stroke="' + bodyFill + '" stroke-width="15" fill="none" stroke-linecap="round"/>' +
        '<circle cx="166" cy="119" r="9.5" fill="' + (o.rainbow ? "#ff9bb8" : shade(o.body, .3)) + '"/>' +
        '<path d="M62 94 Q24 64 27 104 Q30 134 66 126 Z" fill="' + wingFill + '"/>' +
        '<path d="M158 94 Q196 64 193 104 Q190 134 154 126 Z" fill="' + wingFill + '"/>' +
        '<path d="M86 46 Q79 18 96 13 Q103 32 98 47 Z" fill="' + spikeFill + '"/>' +
        '<path d="M134 46 Q141 18 124 13 Q117 32 122 47 Z" fill="' + spikeFill + '"/>' +
        '<path d="M106 38 Q104 22 114 20 Q117 33 112 41 Z" fill="' + spikeFill + '"/>' +
        '<ellipse cx="52" cy="144" rx="12" ry="17" fill="' + bodyFill + '" transform="rotate(16 52 144)"/>' +
        '<ellipse cx="168" cy="144" rx="12" ry="17" fill="' + bodyFill + '" transform="rotate(-16 168 144)"/>' +
        '<ellipse cx="84" cy="192" rx="17" ry="11" fill="' + shade(o.body, -.08) + '"/>' +
        '<ellipse cx="136" cy="192" rx="17" ry="11" fill="' + shade(o.body, -.08) + '"/>' +
        '<circle cx="110" cy="134" r="62" fill="' + bodyFill + '"/>' + twoTone +
        '<ellipse cx="110" cy="156" rx="38" ry="30" fill="' + o.belly + '"/>' +
        '<ellipse cx="110" cy="140" rx="17" ry="12" fill="' + o.belly + '"/>' +
        (o.rainbow ? stars([[74, 116], [146, 112], [110, 90]]) : "") +
        eye(86, 120, o.eyeL, o, u) + eye(134, 120, o.eyeR, o, u) +
        mouthW(101, 146) + cheeks(60, 160, 138) + '</g>';
    } else {
      art += '<g>' +
        '<ellipse cx="54" cy="142" rx="11" ry="15" fill="' + bodyFill + '" transform="rotate(18 54 142)"/>' +
        '<ellipse cx="166" cy="142" rx="11" ry="15" fill="' + bodyFill + '" transform="rotate(-18 166 142)"/>' +
        '<path d="M48 138 A62 62 0 0 1 172 138 L172 180 A14.5 13 0 0 1 143 180 A14.5 13 0 0 1 114 180 A14.5 13 0 0 1 85 180 A14.5 13 0 0 1 56 180 L48 180 Z" fill="' + bodyFill + '"/>' +
        twoTone +
        (o.rainbow ? stars([[76, 118], [144, 112], [110, 92]]) : "") +
        eye(88, 124, o.eyeL, o, u) + eye(132, 124, o.eyeR, o, u) +
        '<ellipse cx="110" cy="150" rx="5.5" ry="7" fill="#3a2b4a" opacity=".85"/>' +
        cheeks(64, 156, 140) + '</g>';
    }
    return '<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      (defs ? "<defs>" + defs + "</defs>" : "") + shadow + art + "</svg>";
  }

  /* Coffre SVG de secours */
  function chestSVG() {
    return '<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="110" cy="196" rx="66" ry="11" fill="#3a2b4a" opacity=".1"/>' +
      '<path d="M168 64 l4 -10 M178 78 l9 -6 M172 52 l7 -7" stroke="#ffc14d" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M52 66 l-4 -10 M42 80 l-9 -6" stroke="#ffc14d" stroke-width="3.5" stroke-linecap="round"/>' +
      '<rect x="48" y="62" width="124" height="44" rx="18" fill="#7a4bd0"/>' +
      '<rect x="48" y="92" width="124" height="14" fill="#6539b8"/>' +
      '<rect x="66" y="58" width="15" height="42" rx="7" fill="#ffc14d"/>' +
      '<rect x="139" y="58" width="15" height="42" rx="7" fill="#ffc14d"/>' +
      '<rect x="52" y="104" width="116" height="72" rx="15" fill="#6539b8"/>' +
      '<rect x="66" y="104" width="15" height="72" fill="#ffc14d"/>' +
      '<rect x="139" y="104" width="15" height="72" fill="#ffc14d"/>' +
      '<circle cx="110" cy="108" r="14" fill="#ffc14d" stroke="#e8a725" stroke-width="3"/>' +
      '<circle cx="110" cy="108" r="4.5" fill="#e8a725"/>' +
      '<path d="M110 20 l2.6 6.6 L119 29 l-6.4 2.6 L110 38 l-2.6 -6.4 L101 29 l6.4 -2.4 Z" fill="#ffe08a"/>' +
      '</svg>';
  }

  return {
    RARITIES, SHAPE_LABELS, EYES, FUR, TINTS, POOL, HUB_PLUSHES,
    rollMutation, mutationRarity, mutationKey, shade,
    svgFor, chestSVG,
  };
})();
