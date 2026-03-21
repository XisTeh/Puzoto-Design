

        (function () {
            'use strict';
            const $ = s => document.querySelector(s);
            const isMobile = window.matchMedia('(max-width:768px)').matches;

            /* ─── LOADER ────────────────────── */
            const loader = $('#loader'), fill = $('#loaderFill'), fill2 = $('#loaderFill2');
            let tick = null;
            if (!isMobile) {
                let prog = 0, prog2 = 0, tickCount = 0;
                tick = setInterval(() => {
                    tickCount++;
                    if (prog < 85) { prog += Math.random() * 14 + 2; fill.style.width = Math.min(prog, 100) + '%'; }
                    if (tickCount > 3 && prog2 < prog * 0.6) { prog2 += Math.random() * 6 + 1; fill2.style.width = Math.min(prog2, 100) + '%'; }
                }, 140);
            } else {
                // Mobile immediate fake progress
                fill.style.width = '60%';
                if (fill2) fill2.style.width = '40%';
            }
            function dismiss() {
                if (tick) clearInterval(tick);
                fill.style.width = '100%';
                if(fill2) setTimeout(() => { fill2.style.width = '100%'; }, isMobile ? 50 : 200);
                setTimeout(() => { loader.classList.add('is-loaded'); runEntrance() }, isMobile ? 150 : 500);
            }
            // Start dismiss sequence after slight delay
            setTimeout(dismiss, isMobile ? 50 : 300);

            /* ─── LENIS ─────────────────────── */
            let lenis = null;
            if (!isMobile) {
                lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
                function raf(t) { lenis.raf(t); requestAnimationFrame(raf) }
                requestAnimationFrame(raf);
                // Single ticker instead of dual-driving Lenis
                gsap.ticker.lagSmoothing(0);
            }

            /* ─── NAV ───────────────────────── */
            const nav = $('#nav');
            let scrollTick = false;
            window.addEventListener('scroll', () => {
                if (!scrollTick) {
                    scrollTick = true;
                    requestAnimationFrame(() => {
                        nav.classList.toggle('is-scrolled', window.scrollY > 60);
                        scrollTick = false;
                    });
                }
            }, { passive: true });

            /* ─── MOBILE MENU ───────────────── */
            const mobileMenu = $('#mobileMenu');
            function toggleMenu() { 
                mobileMenu.classList.toggle('is-open'); 
                const o = mobileMenu.classList.contains('is-open'); 
                document.body.style.overflow = o ? 'hidden' : ''; 
                if (lenis) { o ? lenis.stop() : lenis.start(); }
            }
            $('#navToggle').addEventListener('click', toggleMenu);
            $('#mobileClose').addEventListener('click', toggleMenu);
            document.querySelectorAll('[data-mobile-link]').forEach(l => l.addEventListener('click', toggleMenu));

            /* ─── AMBIENT MOUSE (Optimized out: CSS/GSAP handles this cleanly) ── */
            const halo = $('#heroHalo');
            const orbA = $('#orbA');
            const orbB = $('#orbB');
            const orbC = $('#orbC');

            let webglFlash = 0; // Global for hover reaction


            /* ─── FACE HOVER INTERACTION (Removed) ── */

            /* ─── WEBGL 3D ABSTRACT HERO + FX (GLOBAL) ────────── */
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
            threeScript.onload = () => {
                try {
                    const canvas = $('#webgl');
                    if (!canvas) return; // Fallback handled via CSS
                    const scene = new THREE.Scene();
                    scene.background = null;
                    scene.fog = new THREE.FogExp2(0x0E0F11, .003);
                    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, .1, 1000);
                    camera.position.z = 100;
                    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
                    renderer.setSize(window.innerWidth, window.innerHeight);
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));

                /* Deep particles — far background */
                const deepGeo = new THREE.BufferGeometry();
                const deepN = isMobile ? 30 : 100;
                const deepPos = new Float32Array(deepN * 3);
                for (let i = 0; i < deepN * 3; i++)deepPos[i] = (Math.random() - .5) * 400;
                deepGeo.setAttribute('position', new THREE.BufferAttribute(deepPos, 3));
                const deepMat = new THREE.PointsMaterial({ size: .35, color: '#6F767D', transparent: true, opacity: .2, sizeAttenuation: true });
                const deepPts = new THREE.Points(deepGeo, deepMat);
                scene.add(deepPts);

                /* Mid particles */
                const midGeo = new THREE.BufferGeometry();
                const midN = isMobile ? 20 : 60;
                const midPos = new Float32Array(midN * 3);
                for (let i = 0; i < midN * 3; i++)midPos[i] = (Math.random() - .5) * 250;
                midGeo.setAttribute('position', new THREE.BufferAttribute(midPos, 3));
                const midMat = new THREE.PointsMaterial({ size: .7, color: '#C9D2DA', transparent: true, opacity: .3, sizeAttenuation: true });
                const midPts = new THREE.Points(midGeo, midMat);
                scene.add(midPts);

                /* Close bright particles */
                const closeGeo = new THREE.BufferGeometry();
                const closeN = isMobile ? 10 : 25;
                const closePos = new Float32Array(closeN * 3);
                for (let i = 0; i < closeN * 3; i++)closePos[i] = (Math.random() - .5) * 150;
                closeGeo.setAttribute('position', new THREE.BufferAttribute(closePos, 3));
                const closeMat = new THREE.PointsMaterial({ size: 1.1, color: '#E3E7EB', transparent: true, opacity: .4, sizeAttenuation: true });
                const closePts = new THREE.Points(closeGeo, closeMat);
                scene.add(closePts);

                /* Rings — geometric depth elements */
                const ringGeo = new THREE.TorusGeometry(60, .12, 8, 60);
                const ringMat = new THREE.MeshBasicMaterial({ color: '#C9D2DA', transparent: true, opacity: .05, wireframe: true });
                const ring = new THREE.Mesh(ringGeo, ringMat);
                ring.rotation.x = Math.PI * .45;
                ring.position.z = -30;
                scene.add(ring);

                const ring2Geo = new THREE.TorusGeometry(42, .08, 6, 48);
                const ring2Mat = new THREE.MeshBasicMaterial({ color: '#6F767D', transparent: true, opacity: .035, wireframe: true });
                const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
                ring2.rotation.x = Math.PI * .55;
                ring2.rotation.z = Math.PI * .1;
                ring2.position.z = -15;
                scene.add(ring2);

                /* =======================================================
                 * PREMIUM CENTRAL 3D: KINETIC HOLOGRAPHIC CORE (CLEAN)
                 * ======================================================= */
                const centralGroup = new THREE.Group();
                window._puzotoCentral3D = centralGroup; 
                scene.add(centralGroup);

                // --- 1. PULSING DATA CORE ---
                const coreRadius = isMobile ? 12 : 18;
                const coreGeo = new THREE.IcosahedronGeometry(coreRadius, isMobile ? 2 : 4);
                const coreMat = new THREE.PointsMaterial({
                    size: 0.2, color: '#ffffff', transparent: true, opacity: 0.9,
                    blending: THREE.AdditiveBlending, depthWrite: false
                });
                const dataCore = new THREE.Points(coreGeo, coreMat);
                centralGroup.add(dataCore);

                // --- 2. SINGLE GEOMETRIC CAGE ---
                const shell1Geo = new THREE.IcosahedronGeometry(coreRadius + 3, 1);
                const shell1Mat = new THREE.MeshBasicMaterial({
                    color: '#C9D2DA', wireframe: true, transparent: true, opacity: 0.15, // Clean, pure
                    blending: THREE.AdditiveBlending, depthWrite: false
                });
                const shell1 = new THREE.Mesh(shell1Geo, shell1Mat);
                centralGroup.add(shell1);

                // --- 3. ELEGANT DATA RINGS ---
                const rings = [];
                for(let i=0; i<2; i++) { // Only 2 rings, highly elegant
                    const rGeo = new THREE.TorusGeometry(coreRadius + 14 + (i * 6), 0.1, 4, isMobile ? 60 : 100);
                    const rMat = new THREE.PointsMaterial({
                        size: 0.2, color: i === 0 ? '#C9D2DA' : '#E3E7EB', transparent: true, opacity: 0.5,
                        blending: THREE.AdditiveBlending, depthWrite: false
                    });
                    const rMesh = new THREE.Points(rGeo, rMat);
                    rMesh.rotation.x = Math.random() * Math.PI;
                    rMesh.rotation.y = Math.random() * Math.PI;
                    rings.push({
                        mesh: rMesh, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3, speedZ: (Math.random() - 0.5) * 0.3
                    });
                    centralGroup.add(rMesh);
                }

                // --- 4. SWARM PARTICLES (KINETIC FIELD) ---
                const swarmGeo = new THREE.BufferGeometry();
                const swarmCount = isMobile ? 80 : 180;
                const swarmPos = new Float32Array(swarmCount * 3);
                const swarmData = []; 
                for(let i=0; i<swarmCount; i++) {
                    const radius = coreRadius + 5 + Math.random() * 25;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos((Math.random() * 2) - 1);
                    
                    swarmPos[i*3] = radius * Math.sin(phi) * Math.cos(theta);
                    swarmPos[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
                    swarmPos[i*3+2] = radius * Math.cos(phi);
                    
                    swarmData.push({
                        baseRadius: radius, theta: theta, phi: phi, speed: 0.2 + Math.random() * 1.0, oscillationOffset: Math.random() * Math.PI * 2
                    });
                }
                swarmGeo.setAttribute('position', new THREE.BufferAttribute(swarmPos, 3));
                const swarmMat = new THREE.PointsMaterial({
                    size: 0.35, color: '#ffffff', transparent: true, opacity: 0.6,
                    blending: THREE.AdditiveBlending, depthWrite: false
                });
                const swarm = new THREE.Points(swarmGeo, swarmMat);
                centralGroup.add(swarm);

                // Initial setup for GSAP timeline
                centralGroup.scale.set(0.01, 0.01, 0.01);
                centralGroup.position.set(0, -2, 0); 

                let wmx = 0, wmy = 0;
                document.addEventListener('mousemove', e => {
                    wmx = e.clientX / window.innerWidth - .5;
                    wmy = e.clientY / window.innerHeight - .5;
                });
                const clock = new THREE.Clock();

                // WebGL Render Loop (throttled on mobile for perf)
                let frameCount = 0;
                (function anim() {
                    requestAnimationFrame(anim);
                    frameCount++;
                    // Mobile: render at ~30fps (skip every other frame)
                    if (isMobile && frameCount % 2 !== 0) return;
                    const t = clock.getElapsedTime();

                    // Background FX parallax
                    deepPts.rotation.y = t * -.006 + (wmx * .08);
                    deepPts.rotation.x = t * .004 + (wmy * .06);

                    midPts.rotation.y = t * -.012 + (wmx * .15);
                    midPts.rotation.x = t * .008 + (wmy * .12);

                    closePts.rotation.y = t * -.02 + (wmx * .28);
                    closePts.rotation.x = t * .012 + (wmy * .2);

                    // Background Rings
                    ring.rotation.y = t * .025 + (wmx * .12);
                    ring.rotation.z = t * .008;
                    ring2.rotation.y = t * -.018 + (wmx * -.08);
                    ring2.rotation.z = t * -.01 + (wmy * .04);

                    // --- Animate the Kinetic Core ---
                    // Inner core breathing and twisting
                    const pulse = Math.sin(t * 1.5) * 0.05 + 1;
                    dataCore.scale.set(pulse, pulse, pulse);
                    dataCore.rotation.y = t * 0.15;
                    dataCore.rotation.x = Math.sin(t * 0.5) * 0.1;

                    // Shell rotations & complex breathing
                    shell1.rotation.y = t * -0.15;
                    shell1.rotation.z = t * 0.1;
                    const s1Pulse = Math.sin(t * 2) * 0.04 + 1;
                    shell1.scale.set(s1Pulse, s1Pulse, s1Pulse);

                    // Rings dynamic continuous rotation
                    rings.forEach((r, idx) => {
                        r.mesh.rotation.x += r.speedX * 0.01;
                        r.mesh.rotation.y += r.speedY * 0.01;
                        r.mesh.rotation.z += r.speedZ * 0.01;
                        const rPulse = Math.sin(t * 1.5 + idx) * 0.05 + 1;
                        r.mesh.scale.set(rPulse, rPulse, rPulse);
                    });

                    // Swarm complex organic paths (throttled: every 3rd frame on desktop, every 6th on mobile)
                    if (frameCount % (isMobile ? 6 : 3) === 0) {
                        const swPosArr = swarmGeo.attributes.position.array;
                        for(let i=0; i<swarmCount; i++) {
                            const data = swarmData[i];
                            data.theta += data.speed * 0.005;
                            data.phi += (Math.sin(t * 0.5 + data.oscillationOffset) * 0.005);
                            
                            // Particles expand and contract over time
                            const dynamicRadius = data.baseRadius + Math.sin(t * 3 + data.oscillationOffset) * 6;

                            swPosArr[i*3] = dynamicRadius * Math.sin(data.phi) * Math.cos(data.theta);
                            swPosArr[i*3+1] = dynamicRadius * Math.sin(data.phi) * Math.sin(data.theta);
                            swPosArr[i*3+2] = dynamicRadius * Math.cos(data.phi);
                        }
                        swarmGeo.attributes.position.needsUpdate = true;
                    }

                    // Smooth buttery mouse parallax tracking
                    centralGroup.rotation.y += ((wmx * 0.8) - centralGroup.rotation.y) * 0.05;
                    centralGroup.rotation.x += ((wmy * 0.6) - centralGroup.rotation.x) * 0.05;
                    
                    // Floating effect
                    centralGroup.position.x = wmx * 12;
                    centralGroup.position.y = -2 + (wmy * -10) + Math.sin(t * 1.5) * 2.5;

                    renderer.render(scene, camera);
                })();

                let resizeTimer;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(() => {
                        camera.aspect = window.innerWidth / window.innerHeight;
                        camera.updateProjectionMatrix();
                        renderer.setSize(window.innerWidth, window.innerHeight);
                    }, 150);
                });
            } catch (e) { console.log('WebGL error:', e) }
            }; // END threeScript.onload
            document.head.appendChild(threeScript);

            /* ─── ENTRANCE ──────────────────── */
            function runEntrance() {
                const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
                tl.fromTo(nav, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: .9 }, .2);

                if (window._puzotoCentral3D) {
                    if (isMobile) {
                        gsap.fromTo(window._puzotoCentral3D.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: 1.2, ease: 'power3.out' }, 0);
                    } else {
                        gsap.fromTo(window._puzotoCentral3D.scale, { x: 0.01, y: 0.01, z: 0.01 }, { x: 1, y: 1, z: 1, duration: 2.2, ease: 'expo.out' }, 0);
                        gsap.fromTo(window._puzotoCentral3D.rotation, { y: -Math.PI }, { y: 0, duration: 3, ease: 'power3.out' }, 0);
                    }
                }

                if (isMobile) {
                    // Mobile: Lightweight entrance (shorter durations)
                    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
                        tl.to(el, { y: 0, duration: .8, ease: 'power3.out' }, .15 + i * .08);
                    });

                    gsap.set('#heroLabel', { y: 10 });
                    tl.to('#heroLabel', { opacity: 1, y: 0, duration: .6 }, .2);

                    gsap.set('#heroSub', { y: 15 });
                    tl.to('#heroSub', { opacity: 1, y: 0, duration: .6 }, .35);

                    gsap.set('#heroCtas', { y: 10 });
                    tl.to('#heroCtas', { opacity: 1, y: 0, duration: .5 }, .5);

                    gsap.set('#heroScroll', { y: 10 });
                    tl.to('#heroScroll', { opacity: .5, y: 0, duration: .5 }, .7);
                } else {
                    // Desktop: Full premium entrance with blur
                    if (halo) tl.fromTo(halo, { opacity: 0, scale: .8 }, { opacity: .6, scale: 1, duration: 1.4, ease: 'power2.out' }, .2);

                    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
                        tl.to(el, { y: 0, duration: 1.3, ease: 'power4.out' }, .25 + i * .12);
                    });

                    gsap.set('#heroLabel', { y: 15 });
                    tl.to('#heroLabel', { opacity: 1, y: 0, duration: .8 }, .35);

                    gsap.set('#heroSub', { y: 25 });
                    tl.to('#heroSub', { opacity: 1, y: 0, duration: .9 }, .6);

                    gsap.set('#heroCtas', { y: 20 });
                    tl.to('#heroCtas', { opacity: 1, y: 0, duration: .8 }, .8);

                    gsap.set('#heroScroll', { y: 15 });
                    tl.to('#heroScroll', { opacity: .5, y: 0, duration: .7 }, 1.1);

                    tl.to('#tagL', { opacity: .35, duration: .8 }, 1.2);
                    tl.to('#tagR', { opacity: .35, duration: .8 }, 1.3);
                    tl.to('.hero__corner', { opacity: 1, duration: .6, stagger: .08 }, 1);
                }
            }

            /* ─── HALO BREATHING ────────────── */
            // Replaced expensive boxShadow animation with opacity/scale composition
            if(!isMobile && halo) {
                gsap.to(halo, {
                    opacity: 0.7,
                    scale: 1.05,
                    duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true
                });
            }

            /* ─── SCROLLTRIGGER LOGIC ───────── */
            gsap.registerPlugin(ScrollTrigger);

            // Stagger fade up for elements with data-st (Cinematic Motion)
            const stElems = gsap.utils.toArray('[data-st]');
            stElems.forEach((el) => {
                // Mobile: only opacity + transform (no filter = much less TBT)
                // Desktop: full premium blur effect
                // Removed willChange override — letting browser manage layer promotion
                // Previously: el.style.willChange = "opacity, transform"; which caused excessive layer creation

                // Disabled premium blur effect on desktop for high framerate reliability
                const fromProps = isMobile
                    ? { opacity: 0, y: 30 }
                    : { opacity: 0, y: 50, scale: 0.96 };

                const toProps = isMobile
                    ? {
                        opacity: 1, y: 0,
                        duration: 1,
                        ease: 'power3.out',
                        scrollTrigger: { trigger: el, start: 'top 95%', toggleActions: 'play none none reverse' }
                    }
                    : {
                        opacity: 1, y: 0, scale: 1,
                        duration: 1.6,
                        ease: 'expo.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
                    };

                gsap.fromTo(el, fromProps, toProps);
            });

            /* ─── FLASHLIGHT CARDS & 3D TILT ────── */
            if(!isMobile) {
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
            }

            // Background Grid Parallax removed for render efficiency (Layout Thrashing Optimization)


        })();
    
