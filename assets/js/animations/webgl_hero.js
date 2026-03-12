

        (function () {
            'use strict';
            const $ = s => document.querySelector(s);
            const isMobile = window.matchMedia('(max-width:768px)').matches;

            /* ─── LOADER ────────────────────── */
            const loader = $('#loader'), fill = $('#loaderFill'), fill2 = $('#loaderFill2');
            let prog = 0, prog2 = 0, tickCount = 0;
            const tick = setInterval(() => {
                tickCount++;
                // Barra 1: avança rápido desde o início
                if (prog < 85) { prog += Math.random() * 14 + 2; fill.style.width = Math.min(prog, 100) + '%'; }
                // Barra 2: começa atrasada (~400ms delay) e avança mais devagar
                if (tickCount > 3 && prog2 < prog * 0.6) { prog2 += Math.random() * 6 + 1; fill2.style.width = Math.min(prog2, 100) + '%'; }
            }, 140);
            const heroImg = $('#heroImg');
            function dismiss() {
                clearInterval(tick);
                fill.style.width = '100%';
                setTimeout(() => { fill2.style.width = '100%'; }, 200);
                setTimeout(() => { loader.classList.add('is-loaded'); runEntrance() }, 650);
            }
            if (heroImg.complete) setTimeout(dismiss, 500);
            else { heroImg.addEventListener('load', () => setTimeout(dismiss, 200), { once: true }); setTimeout(dismiss, 4000) }

            /* ─── LENIS ─────────────────────── */
            const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
            function raf(t) { lenis.raf(t); requestAnimationFrame(raf) }
            requestAnimationFrame(raf);
            gsap.ticker.add(t => lenis.raf(t * 1000));
            gsap.ticker.lagSmoothing(0);

            /* ─── NAV ───────────────────────── */
            const nav = $('#nav');
            window.addEventListener('scroll', () => { nav.classList.toggle('is-scrolled', window.scrollY > 60) }, { passive: true });

            /* ─── MOBILE MENU ───────────────── */
            const mobileMenu = $('#mobileMenu');
            function toggleMenu() { mobileMenu.classList.toggle('is-open'); const o = mobileMenu.classList.contains('is-open'); document.body.style.overflow = o ? 'hidden' : ''; o ? lenis.stop() : lenis.start() }
            $('#navToggle').addEventListener('click', toggleMenu);
            $('#mobileClose').addEventListener('click', toggleMenu);
            document.querySelectorAll('[data-mobile-link]').forEach(l => l.addEventListener('click', toggleMenu));

            /* ─── AMBIENT MOUSE — elegant, no spotlight ── */
            const halo = $('#heroHalo');
            const orbA = $('#orbA');
            const orbB = $('#orbB');
            const orbC = $('#orbC');

            let webglFlash = 0; // Global for hover reaction

            if (!isMobile) {
                let mx = 0, my = 0, smx = 0, smy = 0;

                document.addEventListener('mousemove', e => {
                    mx = (e.clientX / window.innerWidth - .5) * 2;
                    my = (e.clientY / window.innerHeight - .5) * 2;
                });

                (function ambientLoop() {
                    // Very smooth interpolation — cinematic feel
                    smx += (mx - smx) * .03;
                    smy += (my - smy) * .03;

                    // Halo: subtle brightness/blur variation based on mouse position
                    const hBright = 1 + Math.abs(smx) * .1 + Math.abs(smy) * .06 + (webglFlash * 0.3);
                    const hBlur = 28 - Math.abs(smx) * 3 - (webglFlash * 5);
                    const hScale = 1 + (webglFlash * 0.04);
                    if (halo) {
                        halo.style.filter = `blur(${Math.max(20, hBlur)}px) brightness(${hBright})`;
                        halo.style.transform = `translateX(-50%) scale(${hScale})`;
                    }

                    // Orbs: gentle positional drift responding to mouse
                    if (orbA) orbA.style.transform = `translate(${smx * -15}px,${smy * -10}px)`;
                    if (orbB) orbB.style.transform = `translate(${smx * 12}px,${smy * 14}px)`;
                    if (orbC) orbC.style.transform = `translate(${smx * -7}px,${smy * 8}px)`;

                    requestAnimationFrame(ambientLoop);
                })();
            }

            /* ─── FACE HOVER INTERACTION (Premium, Clean) ── */
            const faceHitbox = $('#faceHitbox');
            const shimmer = $('#heroShimmer');
            let hoverTl = null;

            if (faceHitbox && !isMobile) {
                const flashObj = { val: 0 };
                faceHitbox.addEventListener('mouseenter', () => {
                    if (hoverTl && hoverTl.isActive()) return;

                    hoverTl = gsap.timeline();

                    // 1. Shimmer overlay (micro interference)
                    hoverTl.fromTo(shimmer,
                        { opacity: 0, scaleY: 0.9, y: -20 },
                        { opacity: 1, scaleY: 1, y: 15, duration: 0.2, ease: 'power2.out' }
                    ).to(shimmer, { opacity: 0, y: 45, duration: 0.45, ease: 'power2.in' });

                    // 2. Optical distortion (filter pulse on image)
                    hoverTl.to(heroImg, { filter: 'contrast(1.09) brightness(1.06)', duration: 0.15, ease: 'none' }, 0)
                        .to(heroImg, { filter: 'contrast(1.05) brightness(1.02)', duration: 0.6, ease: 'power2.out' }, 0.15);

                    // 3. WebGL and Halo light pulse
                    hoverTl.to(flashObj, {
                        val: 1, duration: 0.15, ease: 'power2.out',
                        onUpdate: () => { webglFlash = flashObj.val; }
                    }, 0).to(flashObj, {
                        val: 0, duration: 0.8, ease: 'power3.out',
                        onUpdate: () => { webglFlash = flashObj.val; }
                    }, 0.15);
                });
            }

            /* ─── WEBGL 3D BACKGROUND ────────── */
            try {
                const canvas = $('#webgl');
                const scene = new THREE.Scene();
                scene.background = null;
                scene.fog = new THREE.FogExp2(0x0E0F11, .003);
                const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .1, 1000);
                camera.position.z = 100;
                const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

                /* Deep particles — far background */
                const deepGeo = new THREE.BufferGeometry();
                const deepN = isMobile ? 200 : 550;
                const deepPos = new Float32Array(deepN * 3);
                for (let i = 0; i < deepN * 3; i++)deepPos[i] = (Math.random() - .5) * 400;
                deepGeo.setAttribute('position', new THREE.BufferAttribute(deepPos, 3));
                const deepMat = new THREE.PointsMaterial({ size: .35, color: '#6F767D', transparent: true, opacity: .2, sizeAttenuation: true });
                const deepPts = new THREE.Points(deepGeo, deepMat);
                scene.add(deepPts);

                /* Mid particles */
                const midGeo = new THREE.BufferGeometry();
                const midN = isMobile ? 130 : 400;
                const midPos = new Float32Array(midN * 3);
                for (let i = 0; i < midN * 3; i++)midPos[i] = (Math.random() - .5) * 250;
                midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
                const midMat = new THREE.PointsMaterial({ size: .7, color: '#C9D2DA', transparent: true, opacity: .3, sizeAttenuation: true });
                const midPts = new THREE.Points(midGeo, midMat);
                scene.add(midPts);

                /* Close bright particles */
                const closeGeo = new THREE.BufferGeometry();
                const closeN = isMobile ? 50 : 150;
                const closePos = new Float32Array(closeN * 3);
                for (let i = 0; i < closeN * 3; i++)closePos[i] = (Math.random() - .5) * 150;
                closeGeo.setAttribute('position', new THREE.BufferAttribute(closePos, 3));
                const closeMat = new THREE.PointsMaterial({ size: 1.1, color: '#E3E7EB', transparent: true, opacity: .4, sizeAttenuation: true });
                const closePts = new THREE.Points(closeGeo, closeMat);
                scene.add(closePts);

                /* Rings — geometric depth elements */
                const ringGeo = new THREE.TorusGeometry(60, .12, 16, 120);
                const ringMat = new THREE.MeshBasicMaterial({ color: '#C9D2DA', transparent: true, opacity: .05, wireframe: true });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI * .45;
                ring.position.z = -30;
                scene.add(ring);

                const ring2Geo = new THREE.TorusGeometry(42, .08, 12, 80);
                const ring2Mat = new THREE.MeshBasicMaterial({ color: '#6F767D', transparent: true, opacity: .035, wireframe: true });
                const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
                ring2.rotation.x = Math.PI * .55;
                ring2.rotation.z = Math.PI * .1;
                ring2.position.z = -15;
                scene.add(ring2);

                let wmx = 0, wmy = 0;
                document.addEventListener('mousemove', e => {
                    wmx = e.clientX / window.innerWidth - .5;
                    wmy = e.clientY / window.innerHeight - .5;
                });
                const clock = new THREE.Clock();

                // Optimization: Pause WebGL when not visible
                let isHeroVisible = true;
                const heroSection = document.getElementById('hero');
                if (heroSection) {
                    new IntersectionObserver(entries => {
                        isHeroVisible = entries[0].isIntersecting;
                    }, { threshold: 0 }).observe(heroSection);
                }

                (function anim() {
                    requestAnimationFrame(anim);
                    if (!isHeroVisible) return; // Saves CPU/GPU load

                    const t = clock.getElapsedTime();

                    // Each layer at different speed = depth parallax
                    deepPts.rotation.y = t * -.006 + (wmx * .08);
                    deepPts.rotation.x = t * .004 + (wmy * .06);

                    midPts.rotation.y = t * -.012 + (wmx * .15);
                    midPts.rotation.x = t * .008 + (wmy * .12);

                    closePts.rotation.y = t * -.02 + (wmx * .28);
                    closePts.rotation.x = t * .012 + (wmy * .2);

                    // Rings rotate slowly + mouse
                    ring.rotation.y = t * .025 + (wmx * .12);
                    ring.rotation.z = t * .008;

                    ring2.rotation.y = t * -.018 + (wmx * -.08);
                    ring2.rotation.z = t * -.01 + (wmy * .04);

                    // Reaction to face hover
                    if (webglFlash > 0) {
                        closePts.material.opacity = 0.4 + (webglFlash * 0.4);
                        midPts.material.opacity = 0.3 + (webglFlash * 0.2);
                        ring.material.opacity = 0.05 + (webglFlash * 0.07);
                    } else {
                        // Default opacities
                        closePts.material.opacity = 0.4;
                        midPts.material.opacity = 0.3;
                        ring.material.opacity = 0.05;
                    }

                    renderer.render(scene, camera);
                })();

                window.addEventListener('resize', () => {
                    camera.aspect = window.innerWidth / window.innerHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(window.innerWidth, window.innerHeight);
                });
            } catch (e) { console.log('WebGL error:', e) }

            /* ─── ENTRANCE ──────────────────── */
            function runEntrance() {
                const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
                tl.fromTo(nav, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: .9 }, .2);

                const fig = $('#heroFigure');
                tl.fromTo(fig, { scale: 1.06, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' }, 0);
                tl.fromTo(halo, { opacity: 0, scale: .8 }, { opacity: .6, scale: 1, duration: 1.4, ease: 'power2.out' }, .2);

                document.querySelectorAll('[data-reveal]').forEach((el, i) => {
                    tl.to(el, { y: 0, duration: 1.3, ease: 'power4.out' }, .25 + i * .12);
                });

                gsap.set('#heroLabel', { y: 15, filter: 'blur(6px)' });
                tl.to('#heroLabel', { opacity: 1, y: 0, filter: 'blur(0px)', duration: .8 }, .35);

                gsap.set('#heroSub', { y: 25, filter: 'blur(6px)' });
                tl.to('#heroSub', { opacity: 1, y: 0, filter: 'blur(0px)', duration: .9 }, .6);

                gsap.set('#heroCtas', { y: 20 });
                tl.to('#heroCtas', { opacity: 1, y: 0, duration: .8 }, .8);

                gsap.set('#heroScroll', { y: 15 });
                tl.to('#heroScroll', { opacity: .5, y: 0, duration: .7 }, 1.1);

                tl.to('#tagL', { opacity: .35, duration: .8 }, 1.2);
                tl.to('#tagR', { opacity: .35, duration: .8 }, 1.3);
                tl.to('.hero__corner', { opacity: 1, duration: .6, stagger: .08 }, 1);
            }

            /* ─── CINEMATIC ZOOM ────────────── */
            gsap.to(heroImg, { scale: 1.02, duration: 20, ease: 'none', repeat: -1, yoyo: true });

            /* ─── HALO BREATHING ────────────── */
            gsap.to(halo, {
                boxShadow: '0 0 80px 30px rgba(201,210,218,.06)',
                duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true
            });

            /* ─── SCROLLTRIGGER LOGIC ───────── */
            gsap.registerPlugin(ScrollTrigger);

            // Stagger fade up for elements with data-st (Cinematic Motion)
            const stElems = gsap.utils.toArray('[data-st]');
            stElems.forEach((el) => {
                // Pre-calcula propriedades para GPU
                el.style.willChange = "opacity, transform, filter";

                gsap.fromTo(el,
                    { 
                        opacity: 0, 
                        y: 50, 
                        scale: 0.96,
                        filter: 'blur(12px)'
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 1.6,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 85%',
                            toggleActions: 'play none none reverse'
                        },
                        onComplete: () => {
                            el.style.willChange = "auto";
                            el.style.filter = "none"; // Limpa artefatos no final
                        }
                    }
                );
            });

            /* ─── FLASHLIGHT CARDS & 3D TILT ────── */
            const flashCards = document.querySelectorAll('.flashlight-card');
            flashCards.forEach(card => {
                const rotateXTo = gsap.quickTo(card, "rotateX", { duration: 0.4, ease: "power2.out" });
                const rotateYTo = gsap.quickTo(card, "rotateY", { duration: 0.4, ease: "power2.out" });

                card.addEventListener('mousemove', e => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Flashlight follow
                    card.style.setProperty('--fx', `${x}px`);
                    card.style.setProperty('--fy', `${y}px`);

                    // 3D Tilt Effect
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    rotateXTo(((y - centerY) / centerY) * -5);
                    rotateYTo(((x - centerX) / centerX) * 5);
                });

                card.addEventListener('mouseleave', () => {
                    rotateXTo(0);
                    rotateYTo(0);
                });
            });

            // Background Grid Parallax removed for render efficiency (Layout Thrashing Optimization)


        })();
    
