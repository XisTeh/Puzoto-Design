

        
            /* ─── TEAM TABS LOGIC (EDITORIAL) ─── */
            const teamThumbs = document.querySelectorAll('.team__thumb');
            const teamInfos = document.querySelectorAll('.team__member-info');
            const teamImgs = document.querySelectorAll('.team__member-img');
            const teamWrap = document.querySelector('#teamImageWrap');
            const teamGlare = document.querySelector('#teamImageGlare');
            const teamCounter = document.querySelector('#teamCurrentNum');
            const teamMarker = document.querySelector('#teamMarkerText');
            const markerLabels = ['Fundador', 'Gestão', 'Engenharia', 'UI/UX', 'Motion'];

            if (teamThumbs.length) {
                teamThumbs.forEach((thumb, idx) => {
                    thumb.addEventListener('click', () => {
                        teamThumbs.forEach(t => t.classList.remove('is-active'));
                        teamInfos.forEach(i => i.classList.remove('is-active'));
                        teamImgs.forEach(m => m.classList.remove('is-active'));

                        thumb.classList.add('is-active');
                        if (teamInfos[idx]) teamInfos[idx].classList.add('is-active');
                        if (teamImgs[idx]) teamImgs[idx].classList.add('is-active');
                        
                        // Update counter
                        if (teamCounter) teamCounter.textContent = String(idx + 1).padStart(2, '0');
                        
                        // Update marker label
                        if (teamMarker && markerLabels[idx]) teamMarker.textContent = markerLabels[idx];
                    });
                });

                /* Hover 3D Tilt Effect on Photo */
                if (teamWrap && !window.matchMedia('(max-width:768px)').matches) {
                    teamWrap.addEventListener('mousemove', e => {
                        const rect = teamWrap.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        gsap.to(teamWrap, {
                            y: -4,
                            boxShadow: '0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(201, 210, 218, 0.06)',
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
                    });

                    teamWrap.addEventListener('mouseleave', () => {
                        gsap.to(teamWrap, {
                            y: 0,
                            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(201, 210, 218, 0.04)',
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
                    });
                }
            }

            /* Team Grid Parallax Removed for Performance */

            /* ─── VIDEO CARDS HOVER PLAY/PAUSE ── */
        document.addEventListener('DOMContentLoaded', function() {
            var cards = document.querySelectorAll('.project-card--video');
            cards.forEach(function(card) {
                var video = card.querySelector('.project-card__video');
                if (!video) return;
                
                card.addEventListener('mouseenter', function() {
                    video.currentTime = 0;
                    video.play().catch(function(e) { console.log('Video auto-play prevented:', e); });
                });
                
                card.addEventListener('mouseleave', function() {
                    video.pause();
                    video.currentTime = 0;
                });
            });
        });
    
// Custom CTA Scroll logic
document.addEventListener("DOMContentLoaded", () => {
    const btnContacts = document.getElementById("btnScrollContato");
    const btnContacts2 = document.getElementById("btnScrollContato2");
    const target = document.getElementById("contato");

    if(target) {
        if(btnContacts) btnContacts.addEventListener("click", () => target.scrollIntoView({behavior: "smooth"}));
        if(btnContacts2) btnContacts2.addEventListener("click", () => target.scrollIntoView({behavior: "smooth"}));
    }
});
