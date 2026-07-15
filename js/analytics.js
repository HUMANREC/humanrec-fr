// ── HUMAN REC — Analytics + consentement (pages hors accueil) ──────────────
// Chargé sur toutes les pages sauf la home (qui a déjà sa propre bannière
// dans index.html + main.min.js). Partage la même clé localStorage "cookies"
// pour que le choix fait sur une page vaille pour tout le site.
(function () {
    'use strict';
    var GA_ID = 'G-95GKRZKW61';

    // ---- Chargement GA (idempotent) ----
    function loadGA() {
        if (window._gaLoaded) return;
        window._gaLoaded = true;
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        window.gtag = function () { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA_ID);
    }

    // ---- Suivi des conversions ----
    function track(name, params) {
        if (typeof window.gtag === 'function') { window.gtag('event', name, params || {}); }
    }
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a');
        if (!a) return;
        var href = a.getAttribute('href') || '';
        var cta = a.getAttribute('data-cta') || '';
        if (href.indexOf('tel:') === 0) {
            track('contact_click', { method: 'phone', source: cta || 'lien' });
        } else if (href.indexOf('mailto:') === 0) {
            track('contact_click', { method: 'email', source: cta || 'lien' });
        } else if (a.classList.contains('whatsapp-btn') || href.indexOf('wa.me') !== -1) {
            track('contact_click', { method: 'whatsapp', source: 'flottant' });
        } else if (cta === 'quote-sticky' || cta === 'quote') {
            track('cta_click', { cta: 'devis', source: cta });
        } else if (cta === 'google-reviews') {
            track('outbound_click', { destination: 'google_reviews' });
        }
    }, true);
    document.addEventListener('submit', function (e) {
        var f = e.target;
        if (f && f.id === 'contactForm') {
            var t = f.querySelector('[name="project_type"]');
            track('generate_lead', { form: 'contact', project_type: t ? t.value : '' });
        }
    }, true);

    // ---- Bannière de consentement (RGPD) ----
    var choice = null;
    try { choice = localStorage.getItem('cookies'); } catch (err) { }

    if (choice === 'accepted') { loadGA(); return; }
    if (choice === 'declined') { return; }

    function persist(val) { try { localStorage.setItem('cookies', val); } catch (err) { } }

    function showBanner() {
        if (document.getElementById('hr-cookie-banner')) return;
        var bar = document.createElement('div');
        bar.id = 'hr-cookie-banner';
        bar.setAttribute('role', 'dialog');
        bar.setAttribute('aria-label', 'Consentement cookies');
        bar.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:1002;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:14px 22px;padding:16px 20px;background:rgba(17,17,17,.96);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.1);font-family:Inter,sans-serif;';
        var txt = document.createElement('p');
        txt.style.cssText = 'color:#a8a8a8;font-size:.85rem;margin:0;max-width:640px;line-height:1.5;';
        txt.innerHTML = 'Nous utilisons des cookies de mesure d’audience pour améliorer votre expérience. <a href="/politique-confidentialite" style="color:#e63946;">En savoir plus</a>';
        var btns = document.createElement('div');
        btns.style.cssText = 'display:flex;gap:12px;';
        var decline = document.createElement('button');
        decline.type = 'button';
        decline.textContent = 'Refuser';
        decline.style.cssText = 'padding:10px 22px;font-size:.8rem;letter-spacing:.05em;text-transform:uppercase;font-weight:600;cursor:pointer;background:transparent;color:#f5f5f5;border:1px solid rgba(255,255,255,.3);font-family:Inter,sans-serif;';
        var accept = document.createElement('button');
        accept.type = 'button';
        accept.textContent = 'Accepter';
        accept.style.cssText = 'padding:10px 22px;font-size:.8rem;letter-spacing:.05em;text-transform:uppercase;font-weight:600;cursor:pointer;background:#e63946;color:#fff;border:1px solid #e63946;font-family:Inter,sans-serif;';
        accept.addEventListener('click', function () { persist('accepted'); bar.remove(); loadGA(); });
        decline.addEventListener('click', function () { persist('declined'); bar.remove(); });
        btns.appendChild(decline);
        btns.appendChild(accept);
        bar.appendChild(txt);
        bar.appendChild(btns);
        document.body.appendChild(bar);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(showBanner, 1500); });
    } else {
        setTimeout(showBanner, 1500);
    }
})();
