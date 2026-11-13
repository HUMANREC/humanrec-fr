/* HUMAN REC : menu mobile pour les pages qui n'en ont pas.
   Construit le bouton et le panneau à partir des liens de .nav-menu.
   Les styles .menu-toggle et .mobile-menu viennent de global.min.css et css/mobile.css. */
(function () {
  var d = document;
  // Fil d'Ariane défilant sur mobile : afficher la fin (page en cours)
  Array.prototype.forEach.call(d.querySelectorAll('.breadcrumb-list'), function (l) { l.scrollLeft = l.scrollWidth; });
  if (d.querySelector('.menu-toggle')) return; // la page a déjà son propre menu
  var nav = d.querySelector('nav');
  var list = nav && nav.querySelector('.nav-menu');
  if (!list) return;

  var btn = d.createElement('button');
  btn.type = 'button';
  btn.className = 'menu-toggle';
  btn.setAttribute('aria-label', 'Ouvrir le menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'hrMobileMenu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  nav.appendChild(btn);

  var menu = d.createElement('div');
  menu.className = 'mobile-menu';
  menu.id = 'hrMobileMenu';

  var home = d.createElement('a');
  home.href = '/';
  home.textContent = 'Accueil';
  menu.appendChild(home);

  Array.prototype.forEach.call(list.querySelectorAll('a'), function (a) {
    var c = d.createElement('a');
    c.href = a.getAttribute('href');
    c.textContent = a.textContent.trim();
    if (a.classList.contains('nav-phone') || /^tel:/.test(c.href)) c.className = 'hr-mm-phone';
    if (a.getAttribute('aria-current')) c.setAttribute('aria-current', a.getAttribute('aria-current'));
    menu.appendChild(c);
  });
  nav.parentNode.insertBefore(menu, nav.nextSibling);

  function set(open) {
    btn.classList.toggle('active', open);
    menu.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    d.body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { set(!menu.classList.contains('active')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();
