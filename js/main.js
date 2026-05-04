// ===== SERVICE → PORTFOLIO HIGHLIGHT =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function () {
        const category = this.dataset.category;

        // Scroll vers la section portfolio
        const portfolioSection = document.getElementById('portfolio');
        portfolioSection.scrollIntoView({ behavior: 'smooth' });

        // Attendre la fin du scroll
        setTimeout(() => {
            // Si c'est la catégorie "short", on switch vers la vue Shorts
            if (category === 'short') {
                switchToShortsAndHighlight();
            } else {
                // Sinon, on reste sur Projets et on highlight
                switchToProjectsAndHighlight(category);
            }
        }, 800);
    });
});

// Fonction pour switcher vers Shorts et les faire clignoter
function switchToShortsAndHighlight() {
    const projectsView = document.getElementById('projectsView');
    const shortsView = document.getElementById('shortsView');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    // Activer le bouton Shorts
    toggleBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === 'shorts') {
            btn.classList.add('active');
        }
    });

    // Switcher la vue
    projectsView.classList.add('exit-left');
    projectsView.classList.remove('active');

    setTimeout(() => {
        shortsView.classList.add('active');

        // Faire clignoter tous les shorts
        setTimeout(() => {
            highlightShorts();
        }, 400);
    }, 100);
}

// Fonction pour switcher vers Projets et les faire clignoter
function switchToProjectsAndHighlight(category) {
    const projectsView = document.getElementById('projectsView');
    const shortsView = document.getElementById('shortsView');
    const toggleBtns = document.querySelectorAll('.toggle-btn');

    // S'assurer qu'on est sur la vue Projets
    if (!projectsView.classList.contains('active')) {
        // Activer le bouton Projets
        toggleBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === 'projects') {
                btn.classList.add('active');
            }
        });

        // Switcher la vue
        shortsView.classList.remove('active');

        setTimeout(() => {
            projectsView.classList.remove('exit-left');
            projectsView.classList.add('active');

            // Puis highlight
            setTimeout(() => {
                highlightProjects(category);
            }, 400);
        }, 100);
    } else {
        // Déjà sur Projets, juste highlight
        highlightProjects(category);
    }
}

// Fonction pour highlight les projets
function highlightProjects(category) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    const allProjects = document.querySelectorAll('.portfolio-item');

    // ~= cherche le mot dans une liste séparée par des espaces
    const matchingProjects = document.querySelectorAll(`.portfolio-item[data-category~="${category}"]`);

    // Si aucun projet ne correspond, ne rien faire
    if (matchingProjects.length === 0) {
        return;
    }

    // Activer le mode filtrage (assombrit les autres)
    portfolioGrid.classList.add('filtering');

    // Ajouter la classe highlight aux projets correspondants
    matchingProjects.forEach(project => {
        project.classList.add('highlight');
    });

    // Retirer l'animation après 3 secondes
    setTimeout(() => {
        portfolioGrid.classList.remove('filtering');
        allProjects.forEach(project => {
            project.classList.remove('highlight');
        });
    }, 3000);
}

// Fonction pour highlight les shorts
function highlightShorts() {
    const shortsGrid = document.querySelector('.shorts-grid');
    const allShorts = document.querySelectorAll('.short-item');

    if (allShorts.length === 0) return;

    // Activer le mode filtrage
    shortsGrid.classList.add('filtering');

    // Faire clignoter tous les shorts
    allShorts.forEach(short => {
        short.classList.add('highlight');
    });

    // Retirer l'animation après 3 secondes
    setTimeout(() => {
        shortsGrid.classList.remove('filtering');
        allShorts.forEach(short => {
            short.classList.remove('highlight');
        });
    }, 3000);
}
// NAV SCROLL
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// MENU MOBILE
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// REVEAL AU SCROLL
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

reveals.forEach(el => revealObserver.observe(el));

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// VIDEO MODAL — accessible (focus trap, ARIA, retour focus)
let lastFocusedBeforeModal = null;

function getFocusableInModal(modal) {
    return modal.querySelectorAll(
        'button, [href], video[controls], input, [tabindex]:not([tabindex="-1"])'
    );
}

function openModal(videoSrc) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    lastFocusedBeforeModal = document.activeElement;
    video.src = videoSrc;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        requestAnimationFrame(() => closeBtn.focus());
    }
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    if (!modal.classList.contains('active')) return;
    video.pause();
    video.src = '';
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
        lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
}

document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('videoModal');
    if (!modal || !modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
        closeModal();
        return;
    }
    if (e.key === 'Tab') {
        const focusables = Array.from(getFocusableInModal(modal));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
});

document.getElementById('videoModal').addEventListener('click', (e) => {
    if (e.target.id === 'videoModal') closeModal();
});

document.querySelectorAll('[onclick*="openModal"]').forEach(el => {
    if (el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'a') return;
    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Lire la vidéo');
    el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
    });
});

// FORMULAIRE avec Formspree
document.getElementById('contactForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('.submit-btn');
    const originalText = btn.innerHTML;

    // Animation d'envoi
    btn.innerHTML = 'Envoi en cours...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    try {
        // Envoi réel à Formspree
        const response = await fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Succès
            btn.innerHTML = 'Message envoyé ✓';
            btn.style.background = '#27ae60';
            btn.style.opacity = '1';
            this.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        } else {
            // Erreur
            throw new Error('Erreur serveur');
        }
    } catch (error) {
        // Erreur
        btn.innerHTML = 'Erreur, réessayez';
        btn.style.background = '#e74c3c';
        btn.style.opacity = '1';

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }
});

// ========== BEFORE / AFTER SLIDER ==========
// ========== BEFORE / AFTER LENS EFFECT ==========
const baContainer = document.getElementById('baContainer');

if (baContainer) {
    const afterImage = baContainer.querySelector('.ba-after');
    const lens = baContainer.querySelector('.ba-lens');
    const toggleBtn = document.getElementById('baToggleBtn');

    // État cible (coordonnées de la souris)
    let targetX = baContainer.offsetWidth / 2;
    let targetY = baContainer.offsetHeight / 2;
    let targetRadius = 0; // 0 quand sort, MAX_RADIUS quand entre

    // État actuel (pour l'interpolation fluide)
    let currentX = targetX;
    let currentY = targetY;
    let currentRadius = targetRadius;

    let isHovering = false;
    let isExpanded = false;
    let animationFrameId = null;

    // Constantes du cercle
    const MAX_RADIUS = window.innerWidth > 768 ? 150 : 100;
    const FULL_RADIUS = 2000; // Assez grand pour couvrir toute l'image

    // Mettre à jour la taille de la lentille visuelle
    lens.style.width = MAX_RADIUS * 2 + 'px';
    lens.style.height = MAX_RADIUS * 2 + 'px';

    function updateLens() {
        // Fonction d'interpolation (lerp)
        currentX += (targetX - currentX) * 0.15;
        currentY += (targetY - currentY) * 0.15;
        currentRadius += (targetRadius - currentRadius) * 0.15;

        // Application au clip-path (pour l'image)
        afterImage.style.clipPath = `circle(${currentRadius}px at ${currentX}px ${currentY}px)`;

        // Application à la lentille (la bordure)
        lens.style.left = `${currentX}px`;
        lens.style.top = `${currentY}px`;

        // Continuer la boucle si la position n'est pas atteinte
        if (
            Math.abs(targetX - currentX) > 0.5 ||
            Math.abs(targetY - currentY) > 0.5 ||
            Math.abs(targetRadius - currentRadius) > 0.5
        ) {
            animationFrameId = requestAnimationFrame(updateLens);
        } else {
            animationFrameId = null;
        }
    }

    function triggerAnimation() {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateLens);
        }
    }

    // Gestion du bouton Toggle
    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Éviter les conflits avec le container
            isExpanded = !isExpanded;

            if (isExpanded) {
                baContainer.classList.add('is-expanded');
                targetRadius = FULL_RADIUS;
                targetX = baContainer.offsetWidth / 2;
                targetY = baContainer.offsetHeight / 2;
                toggleBtn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 14h6v6M20 10h-6V4M10 10L3 21M21 3l-7 7" />
                            </svg>
                            Masquer
                        `;
            } else {
                baContainer.classList.remove('is-expanded');
                if (isHovering) {
                    targetRadius = MAX_RADIUS;
                    // targetX et targetY se mettront à jour au prochain mousemove
                } else {
                    targetRadius = 0;
                    targetX = baContainer.offsetWidth / 2;
                    targetY = baContainer.offsetHeight / 2;
                }
                toggleBtn.innerHTML = `
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                            </svg>
                            Tout révéler
                        `;
            }
            triggerAnimation();
        });
    }

    baContainer.addEventListener('mouseenter', () => {
        isHovering = true;
        if (!isExpanded) {
            targetRadius = MAX_RADIUS;
            triggerAnimation();
        }
    });

    baContainer.addEventListener('mousemove', (e) => {
        const rect = baContainer.getBoundingClientRect();
        if (!isExpanded) {
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;

            if (isHovering) {
                triggerAnimation();
            }
        }
    });

    baContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        if (!isExpanded) {
            targetRadius = 0;
            targetX = baContainer.offsetWidth / 2;
            targetY = baContainer.offsetHeight / 2;
            triggerAnimation();
        }
    });

    baContainer.addEventListener('touchstart', (e) => {
        isHovering = true;
        if (!isExpanded) {
            targetRadius = MAX_RADIUS;
            const rect = baContainer.getBoundingClientRect();
            targetX = e.touches[0].clientX - rect.left;
            targetY = e.touches[0].clientY - rect.top;

            lens.style.opacity = '1';
            lens.style.transform = 'translate(-50%, -50%) scale(1)';
            triggerAnimation();
        }
    }, { passive: true });

    baContainer.addEventListener('touchmove', (e) => {
        if (!isExpanded) {
            const rect = baContainer.getBoundingClientRect();
            targetX = e.touches[0].clientX - rect.left;
            targetY = e.touches[0].clientY - rect.top;

            if (isHovering) {
                triggerAnimation();
            }
        }
    }, { passive: true });

    baContainer.addEventListener('touchend', () => {
        isHovering = false;
        if (!isExpanded) {
            targetRadius = 0;
            targetX = baContainer.offsetWidth / 2;
            targetY = baContainer.offsetHeight / 2;

            lens.style.opacity = '0';
            lens.style.transform = 'translate(-50%, -50%) scale(0)';
            triggerAnimation();
        }
    });

    // Initialisation
    afterImage.style.clipPath = `circle(0px at 50% 50%)`;
}
// ========== TOGGLE PROJETS / SHORTS ==========
const toggleBtns = document.querySelectorAll('.toggle-btn');
const projectsView = document.getElementById('projectsView');
const shortsView = document.getElementById('shortsView');

toggleBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const view = this.dataset.view;

        // Mettre à jour les boutons
        toggleBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // Animer le changement de vue
        if (view === 'shorts') {
            projectsView.classList.add('exit-left');
            projectsView.classList.remove('active');

            setTimeout(() => {
                shortsView.classList.add('active');
            }, 100);
        } else {
            shortsView.classList.remove('active');

            setTimeout(() => {
                projectsView.classList.remove('exit-left');
                projectsView.classList.add('active');
            }, 100);
        }
    });
});

// ========== SHORTS EXPAND / PLAY ==========
const shortItems = document.querySelectorAll('.short-item');

shortItems.forEach(item => {
    const preview = item.querySelector('.short-preview');
    const closeBtn = item.querySelector('.short-close');
    const video = item.querySelector('.short-expanded video');
    const playPauseBtn = item.querySelector('.short-play-pause');
    const muteBtn = item.querySelector('.short-mute');
    const progressBar = item.querySelector('.short-progress-bar');
    const progress = item.querySelector('.short-progress');

    // Clic sur la preview = expand + play
    preview.addEventListener('click', function () {
        // Fermer les autres shorts ouverts
        shortItems.forEach(other => {
            if (other !== item && other.classList.contains('expanded')) {
                closeShort(other);
            }
        });

        // Ouvrir celui-ci
        item.classList.add('expanded');

        // Jouer la vidéo
        if (video) {
            video.currentTime = 0;
            video.muted = false;
            video.play().then(() => {
                playPauseBtn.classList.add('playing');
            }).catch(e => {
                // Autoplay bloqué, on mute et on réessaye
                video.muted = true;
                muteBtn.classList.add('muted');
                video.play();
                playPauseBtn.classList.add('playing');
            });
        }
    });

    // Bouton fermer
    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeShort(item);
    });

    // Bouton play/pause
    playPauseBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (video.paused) {
            video.play();
            playPauseBtn.classList.add('playing');
        } else {
            video.pause();
            playPauseBtn.classList.remove('playing');
        }
    });

    // Bouton mute
    muteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        video.muted = !video.muted;
        muteBtn.classList.toggle('muted', video.muted);
    });

    // Mise à jour barre de progression
    video.addEventListener('timeupdate', function () {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percent + '%';
    });

    // Clic sur la barre de progression
    progress.addEventListener('click', function (e) {
        e.stopPropagation();
        const rect = progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    });

    // Clic sur la vidéo = pause/play
    video.addEventListener('click', function (e) {
        e.stopPropagation();
        if (video.paused) {
            video.play();
            playPauseBtn.classList.add('playing');
        } else {
            video.pause();
            playPauseBtn.classList.remove('playing');
        }
    });
});

// Fonction pour fermer un short
function closeShort(item) {
    const video = item.querySelector('.short-expanded video');
    const playPauseBtn = item.querySelector('.short-play-pause');

    item.classList.remove('expanded');

    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    if (playPauseBtn) {
        playPauseBtn.classList.remove('playing');
    }
}

// Fermer avec Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        shortItems.forEach(item => {
            closeShort(item);
        });
    }
});
// GOOGLE ANALYTICS — chargement conditionnel (RGPD)
function loadGA() {
    if (window._gaLoaded) return;
    window._gaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-95GKRZKW61';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-95GKRZKW61');
}

// COOKIES
function acceptCookies() {
    localStorage.setItem('cookies', 'accepted');
    document.getElementById('cookieBanner').classList.remove('show');
    loadGA();
}

function declineCookies() {
    localStorage.setItem('cookies', 'declined');
    document.getElementById('cookieBanner').classList.remove('show');
}

// Si l'utilisateur avait déjà accepté lors d'une visite précédente, charger GA
if (localStorage.getItem('cookies') === 'accepted') {
    loadGA();
}

if (!localStorage.getItem('cookies')) {
    setTimeout(() => {
        document.getElementById('cookieBanner').classList.add('show');
    }, 3000);
}
// BACK TO TOP
const backToTopBtn = document.getElementById('backToTop');
if (backToTopBtn) {
    window.addEventListener('scroll', function () {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
// HERO VIDEO — chargement conditionnel + différé post-LCP (mobile, save-data, reduced-motion, slow connection)
(function () {
    const heroVideo = document.querySelector('.hero-video video');
    if (!heroVideo) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = !!(conn && conn.saveData);
    const slowConn = !!(conn && /^(slow-2g|2g|3g)$/.test(conn.effectiveType || ''));
    const isMobile = window.innerWidth < 768;

    if (isMobile || reduceMotion || saveData || slowConn) {
        // Pas de vidéo : on garde le poster, on retire les sources pour éviter tout download
        heroVideo.removeAttribute('autoplay');
        heroVideo.querySelectorAll('source').forEach(s => s.remove());
        heroVideo.removeAttribute('src');
        heroVideo.load();
        heroVideo.setAttribute('aria-hidden', 'true');
        return;
    }

    // Desktop normal : on déclenche le chargement APRÈS LCP via requestIdleCallback
    // (évite la concurrence réseau avec les ressources critiques de l'above-the-fold)
    const triggerLoad = () => {
        heroVideo.setAttribute('preload', 'auto');
        heroVideo.load();
        const playPromise = heroVideo.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(() => { /* autoplay refusé : ok, le poster reste */ });
        }
    };

    if ('requestIdleCallback' in window) {
        requestIdleCallback(triggerLoad, { timeout: 2500 });
    } else {
        // Fallback Safari : on attend que la page soit interactive
        if (document.readyState === 'complete') {
            setTimeout(triggerLoad, 1500);
        } else {
            window.addEventListener('load', () => setTimeout(triggerLoad, 1500), { once: true });
        }
    }
})();

// COLOR GRADING — accessibilité clavier sur la "lentille avant/après"
(function () {
    const baContainer = document.getElementById('baContainer');
    const toggleBtn = document.getElementById('baToggleBtn');
    if (!baContainer || !toggleBtn) return;

    if (!baContainer.hasAttribute('role')) {
        baContainer.setAttribute('role', 'region');
        baContainer.setAttribute('aria-label', 'Démonstration étalonnage avant/après — appuyez sur la touche T pour révéler');
    }
    toggleBtn.setAttribute('aria-pressed', 'false');

    const observer = new MutationObserver(() => {
        const expanded = baContainer.classList.contains('is-expanded');
        toggleBtn.setAttribute('aria-pressed', expanded ? 'true' : 'false');
    });
    observer.observe(baContainer, { attributes: true, attributeFilter: ['class'] });

    document.addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea, select')) return;
        if (e.key === 't' || e.key === 'T') {
            const rect = baContainer.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            toggleBtn.click();
        }
    });
})();

// SHOWREEL — fallback poster si la vidéo modal échoue
(function () {
    const modalVideo = document.getElementById('modalVideo');
    if (!modalVideo) return;
    modalVideo.addEventListener('error', () => {
        const modal = document.getElementById('videoModal');
        if (!modal) return;
        modal.querySelector('.modal-video').insertAdjacentHTML(
            'beforeend',
            '<p style="color:#fff;text-align:center;padding:1rem;">La vidéo est temporairement indisponible.</p>'
        );
    });
})();