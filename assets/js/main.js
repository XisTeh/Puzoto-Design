/* ─── Lógica Principal do Site ─── */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── TEAM TABS LOGIC (EDITORIAL) ─── */
    const teamThumbs = document.querySelectorAll('.team__thumb');
    const teamInfos = document.querySelectorAll('.team__member-info');
    const teamImgs = document.querySelectorAll('.team__member-img');
    const teamWrap = document.querySelector('#teamImageWrap');
    const teamGlare = document.querySelector('#teamImageGlare');
    const teamCounter = document.querySelector('#teamCurrentNum');
    const teamMarker = document.querySelector('#teamMarkerText');
    const markerLabels = ['Fundador', 'Gestão'];
    window._markerLabelsRef = markerLabels;

    if (teamThumbs.length) {
        teamThumbs.forEach((thumb, idx) => {
            thumb.addEventListener('click', () => {
                teamThumbs.forEach(t => t.classList.remove('is-active'));
                teamInfos.forEach(i => i.classList.remove('is-active'));
                teamImgs.forEach(m => {
                    m.classList.remove('is-active');
                    if (typeof gsap !== 'undefined') {
                        gsap.set(m, { clearProps: 'transform' });
                    }
                });

                thumb.classList.add('is-active');
                if (teamInfos[idx]) teamInfos[idx].classList.add('is-active');
                if (teamImgs[idx]) teamImgs[idx].classList.add('is-active');
                
                // Update counter
                if (teamCounter) teamCounter.textContent = String(idx + 1).padStart(2, '0');
                
                // Update marker label
                if (teamMarker && markerLabels[idx]) teamMarker.textContent = markerLabels[idx];
            });
        });

        /* Hover 3D Tilt Effect on Photo (Optimized) */
        if (teamWrap && !window.matchMedia('(max-width:768px)').matches) {
            let ticking = false;
            teamWrap.addEventListener('mousemove', e => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const rect = teamWrap.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        if (typeof gsap !== 'undefined') {
                            // Heavy box-shadow animation removed for DOM performance
                            gsap.to(teamWrap, {
                                y: -4,
                                duration: 0.4,
                                ease: 'power2.out',
                                overwrite: 'auto'
                            });

                            if(teamGlare) {
                                gsap.to(teamGlare, {
                                    background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 50%)`,
                                    opacity: 1,
                                    duration: 0.15
                                });
                            }

                            const activeImg = teamWrap.querySelector('.team__member-img.is-active');
                            if (activeImg) {
                                gsap.to(activeImg, {
                                    x: ((x / rect.width) - 0.5) * 8,
                                    y: ((y / rect.height) - 0.5) * 8,
                                    duration: 0.5
                                });
                            }
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            teamWrap.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(teamWrap, {
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    });

                    if(teamGlare) {
                        gsap.to(teamGlare, { opacity: 0, duration: 0.4 });
                    }

                    const activeImg = teamWrap.querySelector('.team__member-img.is-active');
                    if (activeImg) {
                        gsap.to(activeImg, {
                            x: 0,
                            y: 0,
                            duration: 0.8,
                            ease: 'power3.out'
                        });
                    }
                }
            });
        }
    }

    /* ─── VIDEO CARDS HOVER PLAY/PAUSE ─── */
    const cards = document.querySelectorAll('.project-card--video');
    cards.forEach(card => {
        const video = card.querySelector('.project-card__video');
        if (!video) return;
        
        let playTimeout;
        
        card.addEventListener('mouseenter', () => {
            clearTimeout(playTimeout);
            video.currentTime = 0;
            // Pequeno delay para sincronizar com o fade CSS
            playTimeout = setTimeout(() => {
                video.play().catch(e => console.log('Video auto-play prevented:', e));
            }, 300);
        });
        
        card.addEventListener('mouseleave', () => {
            clearTimeout(playTimeout);
            video.pause();
            video.currentTime = 0;
        });
    });

    /* ─── MOBILE MENU LOGIC ─── */
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-menu__nav a[data-mobile-link]');

    if (navToggle && mobileMenu) {
        navToggle.addEventListener('click', () => {
            mobileMenu.classList.add('is-open');
        });
    }

    if (mobileClose && mobileMenu) {
        mobileClose.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
        });
    }

    if (mobileLinks.length && mobileMenu) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
            });
        });
    }

    /* ─── CUSTOM CTA SCROLL LOGIC ─── */
    const btnContacts = document.getElementById('btnScrollContato');
    const btnContacts2 = document.getElementById('btnScrollContato2');
    const target = document.getElementById('contato');

    if (target) {
        if (btnContacts) btnContacts.addEventListener('click', () => target.scrollIntoView({behavior: 'smooth'}));
        if (btnContacts2) btnContacts2.addEventListener('click', () => target.scrollIntoView({behavior: 'smooth'}));
    }
});
