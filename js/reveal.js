/* HUMAN REC — Reveal au scroll + polish survols pour les sous-pages.
   Progressive enhancement : si ce script ne s'exécute pas (vieux navigateur,
   JS désactivé, échec de chargement), AUCUN contenu n'est masqué.
   Tout est gaté derrière la classe .js-reveal ajoutée ci-dessous. */
(function () {
  if (!('IntersectionObserver' in window)) return; // navigateur ancien -> contenu normal
  var d = document, root = d.documentElement;

  // 1. CSS auto-injecté (reveal + survols) — self-contained, marche sur toute page
  var css =
    '.js-reveal .hr-reveal{opacity:0;transform:translateY(26px);filter:blur(3px);' +
    'transition:opacity .85s cubic-bezier(.2,.6,.2,1),transform .85s cubic-bezier(.2,.6,.2,1),filter .85s cubic-bezier(.2,.6,.2,1);will-change:opacity,transform}' +
    '.js-reveal .hr-reveal.hr-in{opacity:1;transform:none;filter:none}' +
    '@media (prefers-reduced-motion:reduce){.js-reveal .hr-reveal{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}}' +
    /* survols cohérents avec la home */
    '.pricing-card,.service-card,.related-item{transition:transform .35s ease,border-color .35s ease}' +
    '.pricing-card:hover,.service-card:hover,.related-item:hover{transform:translateY(-6px);border-color:var(--red,#e63946)}' +
    '.gallery-item{overflow:hidden}.gallery-item img{transition:transform .6s cubic-bezier(.2,.6,.2,1)}' +
    '.gallery-item:hover img{transform:scale(1.05)}';
  var st = d.createElement('style');
  st.textContent = css;
  d.head.appendChild(st);

  // 2. Active le gate (si on échoue avant, rien n'est masqué)
  root.classList.add('js-reveal');

  // 3. Sélectionne les blocs de contenu à révéler (hors nav/footer)
  var sel = '.section-label,.section-title,.section-header,.pricing-card,.service-card,' +
    '.faq-item,.process-step,.gallery-item,.case-step-content,.related-item,.meta-item,' +
    '.credit-item,.project-content,.origin-grid,.founders-grid,.collectif-grid,.values-grid';
  var els = Array.prototype.slice.call(d.querySelectorAll(sel)).filter(function (el) {
    return !el.closest('nav') && !el.closest('footer');
  });
  if (!els.length) { root.classList.remove('js-reveal'); return; }
  els.forEach(function (el) { el.classList.add('hr-reveal'); });

  // 4. Révèle à l'entrée dans le viewport (stagger naturel au scroll)
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('hr-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
