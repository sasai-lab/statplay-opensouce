/*!
 * StatPlay - entry point
 * Copyright (c) 2026 Sasai Lab * Licensed under CC BY-NC 4.0.
 *
 * Architecture (P1 — per-page lazy JS):
 *   1. EAGER CORE — small, page-chrome, or order-sensitive modules. Statically
 *      imported and synchronously initialised on every page that loads main.js
 *      (the hub, the 16 per-topic pages, and tables/index.html).
 *   2. LAZY WIDGETS — the 16 interactive Canvas widget modules. Each is fetched
 *      via dynamic import() only when its sentinel element is in the DOM:
 *        - hub / tables: an IntersectionObserver with a generous rootMargin
 *          loads each widget as the user scrolls near its section (so a topic
 *          page downloads only its own widget, not all 16).
 *        - topic pages (body.topic-page): the present widget(s) are loaded
 *          immediately — there is at most ~2 per page and the widget IS the
 *          main content, so eager-loading it is correct and avoids any race.
 *
 *   The jsdom test harness's bundle() (scripts/test_helpers.mjs) resolves the
 *   local module graph from this file's static AND dynamic imports, so it still
 *   assembles the full "what runs on the hub" set without marker imports.
 */
import { initPrefs } from './modules/prefs.js';
import { initHero } from './modules/hero.js';
import { initReveal } from './modules/reveal.js';
import { initNav } from './modules/nav.js';
import { initAutorun } from './modules/autorun.js';
import { initShare } from './modules/share.js';
import { initUrlParams } from './modules/urlParams.js';
import { initLang } from './modules/lang.js';
import { initTheme } from './modules/theme.js';
import { initGraphDrag } from './modules/graphDrag.js';
import { initAnchor } from './modules/anchor.js';
import { initA11y } from './modules/a11y.js';
import { initToc } from './modules/toc.js';
import { initScrolltop } from './modules/scrolltop.js';
import { initVersion } from './modules/version.js';
import { initPwa } from './modules/pwa.js';
import { initTables } from './modules/tables.js';

// --- Eager core: runs on every page ----------------------------------------
initPrefs();
initHero();
initReveal();
initNav();
initShare();
initLang();
initTheme();
initGraphDrag();
initAnchor();
initA11y();
initToc();
initScrolltop();
initVersion();
initPwa();
initTables();
initAutorun();
initUrlParams();

// --- Lazy widgets ----------------------------------------------------------
// sentinel: DOM element id whose presence means "this widget is on the page".
//   For per-topic widgets the sentinel is the <section id="…"> id (== topic
//   slug). htest's section id is `test`; dist's section id is `dists`.
//   errs lives inside the `test` section (and on topics/test.html) — its
//   sentinel is the element `errCanvas`.
// load: () => dynamic import of the module (string literals so bundlers /
//   the test-harness graph resolver can see the path).
// inits: names of the exported init functions to call after the module loads.
const WIDGETS = [
  { sentinel: 'stdnorm',   load: () => import('./modules/stdnorm.js'),  inits: ['initStdnorm'] },
  { sentinel: 'normal',    load: () => import('./modules/normal.js'),   inits: ['initNormal'] },
  { sentinel: 'prob',      load: () => import('./modules/prob.js'),     inits: ['initProb'] },
  { sentinel: 'bayes',     load: () => import('./modules/bayes.js'),    inits: ['initBayes'] },
  { sentinel: 'morep',     load: () => import('./modules/morep.js'),    inits: ['initMorep'] },
  { sentinel: 'clt',       load: () => import('./modules/clt.js'),      inits: ['initClt'] },
  { sentinel: 'lln',       load: () => import('./modules/lln.js'),      inits: ['initLln'] },
  { sentinel: 'ci',        load: () => import('./modules/ci.js'),       inits: ['initCi'] },
  { sentinel: 'test',      load: () => import('./modules/htest.js'),    inits: ['initHtest'] },
  { sentinel: 'proptest',  load: () => import('./modules/proptest.js'), inits: ['initProptest'] },
  { sentinel: 'dists',     load: () => import('./modules/dist.js'),     inits: ['initDist'] },
  { sentinel: 'chitest',   load: () => import('./modules/chitest.js'),  inits: ['initChitest'] },
  { sentinel: 'anova',     load: () => import('./modules/anova.js'),    inits: ['initAnova'] },
  { sentinel: 'corr',      load: () => import('./modules/corr.js'),     inits: ['initCorr', 'initCorrAnscombe'] },
  { sentinel: 'reg',       load: () => import('./modules/reg.js'),      inits: ['initReg'] },
  { sentinel: 'mreg',      load: () => import('./modules/mreg.js'),     inits: ['initMreg', 'initMregVs'] },
  { sentinel: 'errCanvas', load: () => import('./modules/errs.js'),     inits: ['initErrs'] },
];

function activateWidget(w){
  if(w.__loading) return;
  w.__loading = true;
  w.load().then(mod => {
    for(const name of w.inits){
      try{ if(typeof mod[name] === 'function') mod[name](); }
      catch(err){ console.error('[statplay] widget init failed:', name, err); }
    }
    // Belt-and-suspenders: let autorun.js / urlParams.js re-process any panels
    // or deep-link params that fired before this widget was initialised.
    try{ document.dispatchEvent(new CustomEvent('statplay:widget-ready', { detail: { sentinel: w.sentinel } })); }
    catch(_){ /* CustomEvent unsupported — older engine; rootMargin covers the common case */ }
  }).catch(err => {
    w.__loading = false;
    console.error('[statplay] widget load failed:', w.sentinel, err);
  });
}

function initWidgetLoader(){
  const present = WIDGETS.filter(w => document.getElementById(w.sentinel));
  if(present.length === 0) return;

  const isTopicPage = document.body.classList.contains('topic-page');

  if(isTopicPage || typeof IntersectionObserver === 'undefined'){
    // Topic pages: the widget IS the main content — load it immediately.
    // No IO available: degrade gracefully by loading everything present.
    present.forEach(activateWidget);
    return;
  }

  // Hub / tables: load each widget as the user scrolls near its section.
  // Generous rootMargin so a widget's JS is initialised well before the
  // panel becomes 35% visible (which is when autorun.js clicks its button).
  const byEl = new Map();
  const io = new IntersectionObserver(entries => {
    for(const e of entries){
      if(!e.isIntersecting) continue;
      const w = byEl.get(e.target);
      io.unobserve(e.target);
      if(w) activateWidget(w);
    }
  }, { rootMargin: '1500px 0px' });
  for(const w of present){
    const el = document.getElementById(w.sentinel);
    byEl.set(el, w);
    io.observe(el);
  }
}

initWidgetLoader();
