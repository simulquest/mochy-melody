/* ============================================================
 * Adaptation "thème" de la landing statique (public/landing).
 *
 * La landing est servie telle quelle par Next (rewrite `/`), sans le
 * layout de l'application : elle ne connaît pas son propre thème. Ce
 * script interroge `/api/theme` (lecture live de `config.json`, sans
 * cache) puis, pour Noël :
 *   1. pose `data-theme` sur <html> ;
 *   2. recolore la palette rose → rouge cérise / or / vert sapin en
 *      clonant les règles de styles.css qui contiennent des couleurs
 *      mappées (self-maintaining : toute règle connue est re-écrite) ;
 *   3. ajoute de la neige qui tombe ;
 *   4. fait passer des petits personnages faire "coucou" de temps en
 *      temps.
 *
 * Charge en `defer` après app.js : tout le DOM est déjà là.
 * ============================================================ */
(function () {
  'use strict';

  var REDUCED =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Connaissance du thème ---------- */

  fetch('/api/theme', { cache: 'no-store' })
    .then(function (res) {
      return res.ok ? res.json() : null;
    })
    .then(function (data) {
      var theme = data && typeof data.theme === 'string' ? data.theme : null;
      if (!theme || theme === 'default') return;
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'noel') startNoel();
      // (les autres thèmes s'ajouteront ici)
    })
    .catch(function () {
      /* pas de thème : la landing reste dans sa peau d'origine */
    });

  function startNoel() {
    injectNoelColors();
    injectNoelDecoCss();
    if (!REDUCED) {
      buildSnow();
      schedulePeeks();
    }
  }

  /* ---------- 2. Couleurs : rosé → rouge cérise / sapin / neige ---------- */

  var HEX_MAP = [
    ['#ff7ac2', '#e2484e'],
    ['#ff5f9e', '#c43b40'],
    ['#a06bff', '#3e7d55'],
    ['#3a2b4a', '#33364a'],
    ['#6b5a80', '#5f6679'],
    ['#fff7fb', '#fafcff'],
    ['#f5efff', '#eef4fb'],
    ['#f0dcea', '#dde8f3'],
    ['#ffd1e8', '#ffdfdd'],
    ['#e3d4ff', '#d9efe2'],
    ['#ffe4f2', '#ffe9e9'],
    ['#efe6ff', '#e6f4ec'],
    ['#ffe3f0', '#e2ebf3'],
    ['#ffe9f5', '#fdeeec'],
    ['#f3ecff', '#e9f4ec'],
    ['#f6eefb', '#eff2f5'],
    ['#f1eaff', '#e7f1e9'],
    ['#ffeef7', '#fdeaea'],
    ['#fff3d9', '#ffefcf'],
    ['#fdf5fa', '#f7f9fb'],
    ['#fbeaf4', '#fdecec'],
    ['#f6d7e8', '#f2d8d8'],
    ['#f6e2ee', '#e8ecef'],
  ];

  var RGB_MAP = [
    [/rgba\(255,\s*95,\s*158,\s*0?\.28\)/gi, 'rgba(196, 59, 64, 0.26)'],
    [/rgba\(160,\s*107,\s*255,\s*0?\.25\)/gi, 'rgba(62, 125, 91, 0.22)'],
  ];

  var MAPPED_HEXES = HEX_MAP.map(function (pair) {
    // NB : pas de \b devant le '#' (bordure de mot invalide avant un
    // caractère non-mot) ; le '\b' final évite de capturer un hex 8 chiffres.
    return [new RegExp(pair[0] + '\\b', 'gi'), pair[1]];
  });

  function mapColors(cssText) {
    var css = cssText;
    MAPPED_HEXES.forEach(function (pair) {
      css = css.replace(pair[0], pair[1]);
    });
    RGB_MAP.forEach(function (pair) {
      css = css.replace(pair[0], pair[1]);
    });
    return css;
  }

  function injectNoelColors() {
    var out = [];
    var sheets = document.styleSheets;
    for (var s = 0; s < sheets.length; s++) {
      var rules;
      try {
        rules = sheets[s].cssRules; // les sheets externes (fonts) jettent ici
      } catch (e) {
        continue;
      }
      collectRules(rules, out);
    }
    if (!out.length) return;
    var style = document.createElement('style');
    style.id = 'mm-noel-colors';
    style.textContent = out.join('\n');
    document.head.appendChild(style);
  }

  function collectRules(rules, out) {
    for (var i = 0; i < rules.length; i++) {
      var r = rules[i];
      // 4 = @media : on transforme les règles internes, même condition.
      if (r.type === 4 && r.cssRules && r.cssRules.length) {
        var inner = [];
        for (var j = 0; j < r.cssRules.length; j++) {
          cloneStyledRule(r.cssRules[j], inner);
        }
        if (inner.length) {
          out.push('@media ' + (r.conditionText || '') + '{' + inner.join('\n') + '}');
        }
      } else {
        cloneStyledRule(r, out);
      }
    }
  }

  function cloneStyledRule(rule, out) {
    if (!rule || rule.type !== 1 || !rule.selectorText || !rule.cssText) return;
    var src = rule.cssText;
    var mapped = mapColors(src);
    if (mapped === src) return; // aucune couleur mappée : on ne la re-écrit pas
    var sel = rule.selectorText;
    var selectors;
    if (/^\s*:root\b/.test(sel)) {
      selectors = 'html[data-theme="noel"]';
    } else {
      var prefix = 'html[data-theme="noel"]';
      selectors = sel
        .split(',')
        .map(function (s) {
          return prefix + ' ' + s.replace(/^\s+/, '');
        })
        .join(', ');
    }
    var bodyStart = mapped.indexOf('{');
    if (bodyStart < 0) return;
    var body = mapped.slice(bodyStart + 1).replace(/\}\s*$/, '');
    out.push(selectors + ' {' + body + ' }');
  }

  function injectNoelDecoCss() {
    var style = document.createElement('style');
    style.id = 'mm-noel-deco';
    style.textContent = [
      // Souvent la marque : corps rose → rouge, museau et rougeurs ajustés.
      'html[data-theme="noel"] .brand-mark [fill="#ff7ac2"] { fill: #e2484e; }',
      'html[data-theme="noel"] .brand-mark [fill="#ff5f9e"] { fill: #d0513f; }',
      'html[data-theme="noel"] .brand-mark [fill="#ffd9ea"] { fill: #ffdada; }',
      // Neige au-dessus du contenu.
      '.mm-theme-snowfall { position: fixed; inset: 0; overflow: hidden;',
      '  pointer-events: none; z-index: 60; }',
      '.mm-theme-snowfall span { position: absolute; top: -8vh; left: var(--x);',
      '  font-size: var(--size); color: #9cb9dd; opacity: var(--op);',
      '  text-shadow: 0 1px 2px rgba(255,255,255,.7);',
      '  animation: mm-theme-fall var(--dur) linear var(--delay) infinite;',
      '  will-change: transform; }',
      '@keyframes mm-theme-fall {',
      '  from { transform: translate3d(0, -6vh, 0) rotate(0deg); }',
      '  to { transform: translate3d(var(--drift), 114vh, 0) rotate(var(--spin)); }',
      '}',
      // Coucou : personnage qui surgit d'un bord, gambade, repart.
      '.mm-theme-peek { position: fixed; z-index: 64; pointer-events: none;',
      '  line-height: 1; font-size: clamp(30px, 5vw, 52px);',
      '  filter: drop-shadow(0 6px 14px rgba(40, 50, 80, .3));',
      '  animation: mm-theme-peek-in .55s cubic-bezier(.2,1.55,.45,1) both,',
      '             mm-theme-peek-wiggle 2.8s .55s ease-in-out infinite; }',
      '.mm-theme-peek.away {',
      '  animation: mm-theme-peek-out .5s ease both; }',
      '@keyframes mm-theme-peek-in {',
      '  from { opacity: 0; transform: translate3d(var(--pin-x,0), var(--pin-y,0),0) scale(.55) rotate(-10deg); }',
      '  to { opacity: 1; transform: translate3d(0,0,0) scale(1) rotate(0); }',
      '}',
      '@keyframes mm-theme-peek-wiggle {',
      '  0%, 100% { transform: translate3d(0,0,0) rotate(-4deg); }',
      '  25% { transform: translate3d(0,-6px,0) rotate(6deg); }',
      '  50% { transform: translate3d(0,0,0) rotate(-6deg); }',
      '  75% { transform: translate3d(0,-4px,0) rotate(4deg); }',
      '}',
      '@keyframes mm-theme-peek-out {',
      '  from { opacity: 1; transform: translate3d(0,0,0) scale(1); }',
      '  to { opacity: 0; transform: translate3d(var(--pout-x,0), var(--pout-y,12px),0) scale(.6); }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ---------- 3. Neige qui tombe ---------- */

  var FLAKES = ['❆', '❅', '❄'];

  function buildSnow() {
    var layer = document.createElement('div');
    layer.className = 'mm-theme-snowfall';
    layer.setAttribute('aria-hidden', 'true');
    var html = '';
    for (var i = 0; i < 30; i++) {
      var size = 9 + Math.random() * 10;
      var dur = 8 + Math.random() * 8;
      var delay = -Math.random() * dur;
      html +=
        '<span style="--x:' +
        (Math.random() * 100).toFixed(2) +
        '%;--size:' +
        size.toFixed(1) +
        'px;--dur:' +
        dur.toFixed(1) +
        's;--delay:' +
        delay.toFixed(2) +
        's;--drift:' +
        ((Math.random() * 140 - 70)).toFixed(0) +
        'px;--spin:' +
        ((Math.random() * 80 - 40)).toFixed(0) +
        'deg;--op:' +
        (0.35 + Math.random() * 0.5).toFixed(2) +
        '">' +
        FLAKES[i % FLAKES.length] +
        '</span>';
    }
    layer.innerHTML = html;
    document.body.appendChild(layer);
  }

  /* ---------- 4. « Coucou » de temps en temps ---------- */

  var PEEK_GLYPHS = ['⛄', '🎄', '🧝', '⭐', '❄️', '🎅'];

  function schedulePeeks() {
    function spawn() {
      var glyph = PEEK_GLYPHS[Math.floor(Math.random() * PEEK_GLYPHS.length)];
      var side = Math.floor(Math.random() * 3); // 0 left · 1 right · 2 bottom
      var pos = 12 + Math.random() * 55;
      var holdMs = (3.5 + Math.random() * 1.5) * 1000;

      var el = document.createElement('span');
      el.className = 'mm-theme-peek';
      el.setAttribute('aria-hidden', 'true');
      el.textContent = glyph;
      if (side === 0) {
        el.style.left = '-0.4rem';
        el.style.top = pos + '%';
        el.style.setProperty('--pin-x', '-2.6rem');
        el.style.setProperty('--pout-x', '-2.6rem');
        el.style.setProperty('--pin-y', '0.6rem');
      } else if (side === 1) {
        el.style.right = '-0.4rem';
        el.style.top = pos + '%';
        el.style.setProperty('--pin-x', '2.6rem');
        el.style.setProperty('--pout-x', '2.6rem');
        el.style.setProperty('--pin-y', '0.6rem');
      } else {
        el.style.bottom = '-0.5rem';
        el.style.left = pos + '%';
        el.style.setProperty('--pin-y', '2.8rem');
        el.style.setProperty('--pout-y', '2.8rem');
      }
      document.body.appendChild(el);
      // Il repart se cacher après quelques secondes.
      setTimeout(function () {
        el.classList.add('away');
      }, holdMs);
      setTimeout(function () {
        el.remove();
      }, holdMs + 600);

      // Prochain coucou dans 14 à 26 s.
      setTimeout(spawn, 14000 + Math.random() * 12000);
    }
    // Premier coucou bientôt (6–11 s) pour que le thème se voit.
    setTimeout(spawn, 6000 + Math.random() * 5000);
  }
})();
