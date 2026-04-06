import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Cursor from '../components/Cursor';
import MenuOverlay from '../components/MenuOverlay';
import TicketsShopOverlay from '../components/TicketsShopOverlay';
import MagneticBtn from '../components/MagneticBtn';
import MarqueeBtn from '../components/MarqueeBtn';
import MuseoLogo from '../components/MuseoLogo';
import { HIEROGLYPH_CHARS } from '../data/hieroglyphs';
import { MUSEO_MAP } from '../data/museoCopy';
import { useAmbientAudio } from '../context/AudioContext';
import { useLanguage } from '../context/useLanguage';
import LanguageSwitcher from '../components/LanguageSwitcher';
import MuseumLiveStatusCard from '../components/MuseumLiveStatusCard';
import DesignCredit from '../components/DesignCredit';
import StatCounter from '../components/StatCounter';
import {
  clearHomeQuickMount,
  clearPendingHomeQuick,
  lastNonHomePathRef,
  markHomeQuickMount,
  peekHomeQuickMount,
  peekPendingHomeQuick,
} from '../routeHistory';

gsap.registerPlugin(ScrollTrigger);

const HOME_INTRO_DONE_KEY = 'museo_home_intro_done';

const readIntroDone = () =>
  typeof window !== 'undefined' && sessionStorage.getItem(HOME_INTRO_DONE_KEY) === '1';

/**
 * `search` da useLocation(). Con StrictMode il 2° mount può avere search vuoto:
 * conta `peekHomeQuickMount` impostato al 1° passaggio con ?homeQuick=1.
 *
 * Non usare `performance.navigation` / Navigation Timing `type === 'reload'` qui: dopo un F5
 * resta `reload` per **tutta** la sessione SPA, quindi ogni ritorno alla home sembrava un "reload".
 */
function computeInitialIntroMode(search) {
  if (typeof window === 'undefined') return 'full';
  const q = search && search.startsWith('?') ? search.slice(1) : search || '';
  try {
    if (new URLSearchParams(q).get('homeQuick') === '1') {
      markHomeQuickMount();
      return 'quick';
    }
  } catch {
    /* ignore */
  }
  if (peekHomeQuickMount()) return 'quick';
  if (peekPendingHomeQuick()) return 'quick';
  if (readIntroDone()) return 'quick';
  const lastOther = lastNonHomePathRef.current;
  if (lastOther && lastOther !== '/') return 'quick';
  return 'full';
}

/**
 * Blur sul wrapper del video (non sul tag <video>): il decode HW crea un layer; filter sul video può arrivare
 * un frame dopo. filter sul contenitore sfoca l’output del gruppo dopo la composizione (meno flash nitido→blur).
 */
const HERO_STAGE_INTRO_STYLE = {
  opacity: 0,
  transform: 'translate3d(0, 100px, 0) scale(0.92)',
  transformOrigin: '50% 45%',
  willChange: 'transform, opacity',
  backfaceVisibility: 'hidden',
};

const HERO_VIDEO_SRC = '/hero_video.mp4';

const HomePage = () => {
  const { t, lang } = useLanguage();
  const heroL1 = t('pages.home.heroL1');
  const heroL2 = t('pages.home.heroL2');
  const { playAmbient } = useAmbientAudio();
  const location = useLocation();
  const navigate = useNavigate();
  const [introMode] = useState(() => computeInitialIntroMode(location.search));

  /** Rimuove la query con navigate (replaceState lasciava RR disallineato + rompeva StrictMode). */
  useEffect(() => {
    if (introMode !== 'quick') return undefined;
    const sp = new URLSearchParams(location.search || '');
    if (sp.get('homeQuick') !== '1') return undefined;
    navigate({ pathname: '/', search: '' }, { replace: true });
    return undefined;
  }, [introMode, location.search, navigate]);

  /**
   * Stesso flag dell'intro completata: in dev Strict Mode il remount può ripartire da useState(false)
   * e rimettere il preloader bianco senza errori. Se l'intro è già stata fatta in sessione, partiamo pronti.
   */
  const [isReady, setIsReady] = useState(() => readIntroDone());
  /** Evita closure stantie su loadeddata/playing dopo che isReady cambia. */
  const isReadyRef = useRef(isReady);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  /**
   * Fino al reveal: opacity 0 così non si vede mai un frame nitido prima del blur (limite decode HW).
   * Dopo intro completata / sessione con intro già fatta: visibile subito.
   */
  const [heroVideoPixelsVisible, setHeroVideoPixelsVisible] = useState(() => readIntroDone());

  useEffect(() => {
    if (isReady) setHeroVideoPixelsVisible(true);
  }, [isReady]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  /** Durante il load lungo: a tratti mostra un geroglifo al posto della percentuale */
  const [glyphFlash, setGlyphFlash] = useState(null);
  const glyphFlashTimeoutRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTicketsShopOpen, setIsTicketsShopOpen] = useState(false);
  const containerRef = useRef(null);
  const preloaderRef = useRef(null);
  const enterBtnRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroImageRef = useRef(null);
  /** Stage: scale/opacity in intro. */
  const heroVideoStageRef = useRef(null);
  /** Contenitore con filter blur — non sul <video> (layer decode HW). */
  const heroVideoFilterWrapRef = useRef(null);
  /** Overlay scuro sul titolo hero — si schiarisce leggermente all’ingresso. */
  const heroVignetteRef = useRef(null);
  const marqueeRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryContainerRef = useRef(null);
  /** Evita doppie schedule di reveal (loadeddata + playing). */
  const heroVideoRevealScheduledRef = useRef(false);
  const heroVideoPixelsVisibleRef = useRef(heroVideoPixelsVisible);
  heroVideoPixelsVisibleRef.current = heroVideoPixelsVisible;

  const forceRevealHeroVideoPixels = () => {
    if (isReadyRef.current) return;
    heroVideoRevealScheduledRef.current = true;
    const wrap = heroVideoFilterWrapRef.current;
    if (wrap) gsap.set(wrap, { filter: 'blur(18px)', force3D: true });
    flushSync(() => setHeroVideoPixelsVisible(true));
  };

  /** requestVideoFrameCallback: blur sul frame che il compositor sta per usare; fallback = più rAF. */
  const revealHeroVideoPixelsAfterBlur = () => {
    if (isReadyRef.current || heroVideoRevealScheduledRef.current) return;
    heroVideoRevealScheduledRef.current = true;
    const vid = heroImageRef.current;
    const wrap = heroVideoFilterWrapRef.current;
    if (!vid) {
      flushSync(() => setHeroVideoPixelsVisible(true));
      return;
    }
    if (wrap) gsap.set(wrap, { filter: 'blur(18px)', force3D: true });
    const finish = () => {
      if (isReadyRef.current) return;
      flushSync(() => setHeroVideoPixelsVisible(true));
    };
    if (typeof vid.requestVideoFrameCallback === 'function') {
      vid.requestVideoFrameCallback(() => {
        if (wrap) gsap.set(wrap, { filter: 'blur(18px)' });
        vid.requestVideoFrameCallback(() => {
          if (wrap) gsap.set(wrap, { filter: 'blur(18px)' });
          finish();
        });
      });
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(finish);
        });
      });
    }
  };

  useEffect(() => {
    if (isReady) return undefined;
    heroVideoRevealScheduledRef.current = false;
    const vid = heroImageRef.current;
    if (!vid) return undefined;

    const onMediaEvent = () => revealHeroVideoPixelsAfterBlur();
    vid.addEventListener('loadeddata', onMediaEvent, { passive: true });
    vid.addEventListener('playing', onMediaEvent, { passive: true });
    if (vid.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onMediaEvent();

    const fallback = window.setTimeout(() => {
      if (!isReadyRef.current && !heroVideoPixelsVisibleRef.current) forceRevealHeroVideoPixels();
    }, 600);

    return () => {
      vid.removeEventListener('loadeddata', onMediaEvent);
      vid.removeEventListener('playing', onMediaEvent);
      window.clearTimeout(fallback);
    };
  }, [isReady]);

  useLayoutEffect(() => {
    if (isReady) return undefined;
    const wrap = heroVideoFilterWrapRef.current;
    if (wrap) gsap.set(wrap, { filter: 'blur(18px)', force3D: true });
    return undefined;
  }, [isReady]);

  const handleEnterClick = () => {
    forceRevealHeroVideoPixels();
    sessionStorage.setItem(HOME_INTRO_DONE_KEY, '1');
    playAmbient();

    const pre = preloaderRef.current;
    const shutterTop = pre?.querySelector('.shutter-top');
    const shutterBottom = pre?.querySelector('.shutter-bottom');
    const vid = heroImageRef.current;
    const wrap = heroVideoFilterWrapRef.current;
    const stage = heroVideoStageRef.current;
    const vignette = heroVignetteRef.current;
    const chars = heroTitleRef.current?.querySelectorAll('.char-stagger');

    if (vid) gsap.killTweensOf(vid);
    if (wrap) gsap.killTweensOf(wrap);
    if (stage) gsap.killTweensOf(stage);

    if (wrap) {
      gsap.set(wrap, {
        filter: 'blur(22px)',
        transformOrigin: '50% 45%',
        force3D: true,
      });
    }
    if (stage) {
      gsap.set(stage, {
        scale: 1.14,
        opacity: 0.35,
        transformOrigin: '50% 45%',
        force3D: true,
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        if (wrap) gsap.set(wrap, { clearProps: 'filter' });
        if (stage) gsap.set(stage, { clearProps: 'opacity,transform' });
        if (vignette) gsap.set(vignette, { clearProps: 'opacity' });
        setIsReady(true);
        ScrollTrigger.refresh();
      },
    });

    // Shutter animation: appear suddenly at center and slide apart
    if (shutterTop && shutterBottom) {
      // 1. Instantly meet at center to cover ALL white preloader background
      gsap.set([shutterTop, shutterBottom], { opacity: 1, scaleY: 1, y: 0, height: '50.5%' });
      // 2. Clear the white background instantly (now masked by the black shutters)
      gsap.set(pre, { background: 'transparent' });

      tl.to(shutterTop, { y: '-100%', duration: 1.45, ease: 'expo.inOut' }, 0);
      tl.to(shutterBottom, { y: '100%', duration: 1.45, ease: 'expo.inOut' }, 0);

      // Fade out the loading content quickly as shutters reveal
      const loadingContent = pre?.querySelectorAll('.loading-content');
      if (loadingContent?.length) {
        tl.to(loadingContent, { opacity: 0, duration: 0.45, ease: 'power2.out' }, 0);
      }
    } else {
      tl.to(pre, { y: '-100%', duration: 1.48, ease: 'power4.inOut' }, 0);
    }

    if (wrap) {
      gsap.set(wrap, { filter: 'blur(20px)' });
    }
    if (stage) {
      gsap.set(stage, { y: 150, scale: 0.9, opacity: 0 });
      tl.to(
        stage,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1.65,
          ease: 'expo.out',
        },
        0.15
      );
    }
    if (wrap) {
      tl.to(
        wrap,
        {
          filter: 'blur(0px)',
          duration: 1.65,
          ease: 'expo.out',
        },
        0.15
      );
    }

    if (vignette) {
      tl.fromTo(
        vignette,
        { opacity: 1 },
        { opacity: 0.72, duration: 1.35, ease: 'power2.inOut' },
        0.2
      );
    }

    if (chars?.length) {
      // Chars now slide up from further down and use a smoother ease
      tl.to(
        chars,
        {
          y: '0%',
          rotate: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.035,
          ease: 'expo.out',
        },
        0.25
      );
    }
  };

  /** ?skipIntro=1 — utile se il preloader resta bloccato (bianco) senza errori in console. */
  useEffect(() => {
    try {
      const q = location.search?.startsWith('?') ? location.search.slice(1) : location.search || '';
      if (new URLSearchParams(q).get('skipIntro') === '1') {
        sessionStorage.setItem(HOME_INTRO_DONE_KEY, '1');
        setIsReady(true);
      }
    } catch {
      /* ignore */
    }
  }, [location.search]);

  /** Fallback: dopo 8s il preloader viene sempre tolto (anche intro full senza click). */
  useEffect(() => {
    if (isReady) return undefined;
    const t = window.setTimeout(() => {
      sessionStorage.setItem(HOME_INTRO_DONE_KEY, '1');
      setIsReady(true);
    }, 8000);
    return () => window.clearTimeout(t);
  }, [isReady]);

  /** Intro quick: breve, senza click (navigazione interna) — useLayoutEffect così preloaderRef è già nel DOM. */
  useLayoutEffect(() => {
    if (introMode !== 'quick' || isReady) return undefined;

    const chars = heroTitleRef.current?.querySelectorAll('.char-stagger');
    const pre = preloaderRef.current;
    const shutterTop = pre?.querySelector('.shutter-top');
    const shutterBottom = pre?.querySelector('.shutter-bottom');
    const vid = heroImageRef.current;
    const wrap = heroVideoFilterWrapRef.current;
    const stage = heroVideoStageRef.current;
    const vignette = heroVignetteRef.current;
    /** Senza pre il sito resterebbe per sempre sotto il bianco (z-50); mai bloccare. */
    if (!pre) {
      setIsReady(true);
      return undefined;
    }
    if (chars?.length) gsap.set(chars, { y: '100%', rotate: 6, opacity: 0 });
    if (wrap) {
      gsap.set(wrap, {
        filter: 'blur(18px)',
        transformOrigin: '50% 45%',
        force3D: true,
      });
    }
    if (vid) {
      gsap.set(vid, {
        clipPath: 'inset(100% 0 0 0 round 200px 200px 0 0)',
        transformOrigin: '50% 45%',
        force3D: true,
      });
    }
    if (stage) {
      gsap.set(stage, {
        scale: 1.1,
        opacity: 0.4,
        transformOrigin: '50% 45%',
        force3D: true,
      });
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem(HOME_INTRO_DONE_KEY, '1');
        clearHomeQuickMount();
        clearPendingHomeQuick();
        if (wrap) gsap.set(wrap, { clearProps: 'filter' });
        if (vid) gsap.set(vid, { clearProps: 'clipPath' });
        if (stage) gsap.set(stage, { clearProps: 'opacity,transform' });
        if (vignette) gsap.set(vignette, { clearProps: 'opacity' });
        setIsReady(true);
        playAmbient();
        ScrollTrigger.refresh();
      },
    });

    if (shutterTop && shutterBottom) {
      gsap.set([shutterTop, shutterBottom], { opacity: 1, scaleY: 1, y: 0, height: '50.5%' });
      gsap.set(pre, { background: 'transparent' });
      tl.to(shutterTop, { y: '-100%', duration: 0.95, ease: 'expo.inOut' }, 0);
      tl.to(shutterBottom, { y: '100%', duration: 0.95, ease: 'expo.inOut' }, 0);
    } else {
      tl.to(pre, { y: '-100%', duration: 0.95, ease: 'power4.inOut' }, 0);
    }

    if (stage) {
      gsap.set(stage, { y: 100, scale: 0.92, opacity: 0 });
      tl.to(
        stage,
        { y: 0, scale: 1, opacity: 1, duration: 0.95, ease: 'expo.out' },
        0.05
      );
    }
    if (vignette) {
      tl.fromTo(vignette, { opacity: 1 }, { opacity: 0.75, duration: 0.85, ease: 'power2.out' }, 0.08);
    }
    if (vid) {
      tl.to(
        vid,
        {
          clipPath: 'inset(0% 0 0 0 round 200px 200px 0 0)',
          duration: 0.75,
          ease: 'power2.out',
        },
        0.1
      );
    }
    if (wrap) {
      tl.to(
        wrap,
        {
          filter: 'blur(0px)',
          duration: 0.75,
          ease: 'power2.out',
        },
        0.1
      );
    }
    if (chars?.length) {
      tl.to(
        chars,
        {
          y: '0%',
          rotate: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.03,
          ease: 'expo.out',
        },
        0.12
      );
    }

    return () => {
      tl.kill();
    };
  }, [introMode, playAmbient, isReady]);

  /** Intro full: percentuale + INIZIA (reload o primo ingresso) */
  useEffect(() => {
    if (introMode !== 'full') return undefined;

    clearHomeQuickMount();

    if (heroTitleRef.current) {
      const chars = heroTitleRef.current.querySelectorAll('.char-stagger');
      gsap.set(chars, { y: '120%', rotate: 10, opacity: 0 });
    }

    const progressObj = { value: 0 };
    const lastIntRef = { current: -1 };
    const progressTween = gsap.to(progressObj, {
      value: 100,
      duration: 2.8,
      ease: "power3.inOut",
      onUpdate: () => {
        const v = Math.floor(progressObj.value);
        setLoadingProgress(v);
        if (v === lastIntRef.current) return;
        lastIntRef.current = v;
        if (v <= 0 || v >= 100) return;
        const milestone = v % 11 === 0;
        const sporadic = Math.random() < 0.14;
        if (milestone || sporadic) {
          const g = HIEROGLYPH_CHARS[Math.floor(Math.random() * HIEROGLYPH_CHARS.length)];
          setGlyphFlash(g);
          if (glyphFlashTimeoutRef.current) clearTimeout(glyphFlashTimeoutRef.current);
          glyphFlashTimeoutRef.current = setTimeout(() => {
            setGlyphFlash(null);
            glyphFlashTimeoutRef.current = null;
          }, 260);
        }
      },
      onComplete: () => {
        setGlyphFlash(null);
        if (glyphFlashTimeoutRef.current) {
          clearTimeout(glyphFlashTimeoutRef.current);
          glyphFlashTimeoutRef.current = null;
        }
        const btn = enterBtnRef.current;
        if (btn) {
          gsap.to(btn, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            pointerEvents: "auto"
          });
        }
      }
    });

    if (heroVideoFilterWrapRef.current) {
      gsap.set(heroVideoFilterWrapRef.current, { filter: 'blur(18px)', force3D: true });
    }
    if (heroImageRef.current) {
      gsap.fromTo(
        heroImageRef.current,
        { clipPath: "inset(100% 0 0 0 round 200px 200px 0 0)" },
        { clipPath: "inset(0% 0 0 0 round 200px 200px 0 0)", duration: 1.8, ease: "expo.out", delay: 0.2 }
      );
    }

    return () => {
      progressTween.kill();
      if (glyphFlashTimeoutRef.current) {
        clearTimeout(glyphFlashTimeoutRef.current);
        glyphFlashTimeoutRef.current = null;
      }
    };
  }, [introMode]);

  /** Lenis + ScrollTrigger solo dopo aver tolto il preloader: altrimenti pin/scroll possono lasciare viewport “bianca”. */
  useEffect(() => {
    if (!isReady) return undefined;

    // 1. LENIS (SMOOTH SCROLL)
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    /** Stessa funzione in add/remove: altrimenti il cleanup non toglie nulla e raf gira su Lenis già destroy() (Strict Mode → schermata bianca). */
    const rafFn = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafFn);
    gsap.ticker.lagSmoothing(0);

    // 2. HERO PARALLAX
    const heroVid = heroImageRef.current;
    const rootEl = containerRef.current;
    if (heroVid && rootEl) {
      gsap.to(heroVid, {
        y: '30%',
        ease: "none",
        scrollTrigger: { trigger: rootEl, start: "top top", end: "bottom top", scrub: true }
      });
    }

    // 3. BIG MARQUEE INFINITE
    const marqueeEl = marqueeRef.current;
    if (marqueeEl) {
      gsap.to(marqueeEl, {
        x: '-50%',
        ease: "none",
        scrollTrigger: { trigger: marqueeEl, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    }

    // 4. MASKED TEXT STAGGER
    document.querySelectorAll('[data-stagger-heading]').forEach((el) => {
      const chars = el.querySelectorAll('.char-stagger');
      gsap.fromTo(chars,
        { y: '120%', rotate: 10, opacity: 0 },
        {
          y: '0%', rotate: 0, opacity: 1,
          duration: 1.2,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
        }
      );
    });

    // 5. PARALLAX CARDS
    const cards = document.querySelectorAll('.hover-parallax');
    cards.forEach(card => {
      const img = card.querySelector('img');
      if (!img) return;
      gsap.fromTo(img,
        { scale: 1.2, y: -20 },
        { scale: 1, y: 20, ease: "none", scrollTrigger: { trigger: card, scrub: 0.5 } }
      );
    });

    // 6. HD GALLERY HORIZONTAL SCROLL
    // end deve matchare lo spostamento x: altrimenti resta scroll "a vuoto" col pin attivo (striscia bianca).
    let galleryTween = null;
    const inner = galleryContainerRef.current;
    const galleryEl = galleryRef.current;
    if (galleryEl && inner) {
      const galleryScrollPx = () =>
        Math.max(0, inner.scrollWidth - window.innerWidth);

      galleryTween = gsap.to(inner, {
        x: () => -galleryScrollPx(),
        ease: "none",
        scrollTrigger: {
          trigger: galleryEl,
          start: "center center",
          end: () => `+=${galleryScrollPx()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      const imgs = galleryEl.querySelectorAll("img");
      Promise.all(
        [...imgs].map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) resolve();
              else {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }
            })
        )
      ).then(() => ScrollTrigger.refresh());
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      galleryTween?.kill();
      gsap.ticker.remove(rafFn);
      lenis.destroy();
    };
  }, [isReady]);

  return (
    <div className="bg-papiro text-inchiostro min-h-screen font-satoshi overflow-hidden selection:bg-oro selection:text-white" ref={containerRef}>

      {/* 0. PRELOADER: full (reload / primo ingresso) vs quick (navigazione SPA, senza click) */}
      {!isReady && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-white p-6 md:p-10"
        >
          {/* Shutdown bars (initially hidden, appear at center on click) */}
          <div className="shutter-top pointer-events-none absolute left-0 top-0 z-10 h-1/2 w-full origin-bottom scale-y-0 bg-inchiostro opacity-0" />
          <div className="shutter-bottom pointer-events-none absolute bottom-0 left-0 z-10 h-1/2 w-full origin-top scale-y-0 bg-inchiostro opacity-0" />

          {introMode === 'full' ? (
            <div className="loading-content relative z-20 flex h-full w-full flex-col items-center justify-center">
              {/* Stile loader tipo portfolio: indice in alto a sinistra (cf. lokasasmita.com) */}
              <div className="absolute left-0 top-0 md:-left-4 md:-top-4">
                <p className="font-satoshi text-[10px] font-medium uppercase tracking-[0.55em] text-inchiostro/30">
                  {t('pages.home.preloadLoading')}
                </p>
                <p className="mt-3 font-satoshi tabular-nums text-sm text-inchiostro/45">
                  {String(loadingProgress).padStart(3, '0')}
                </p>
              </div>

              <div className="flex w-[min(92vw,28rem)] flex-col items-center text-center">
                <div className="mb-8 h-px w-12 bg-inchiostro/20" aria-hidden />
                <span className="mb-10 max-w-[20ch] font-satoshi text-[11px] font-medium uppercase leading-relaxed tracking-[0.35em] text-inchiostro/40">
                  {t('pages.home.preloadConnecting')}
                </span>
                <div ref={enterBtnRef} className="pointer-events-none translate-y-10 opacity-0">
                  <MagneticBtn>
                    <button
                      type="button"
                      onClick={handleEnterClick}
                      className="marquee-btn pointer-events-auto rounded-full border border-inchiostro/25 bg-inchiostro/[0.03] px-14 py-5 text-[10px] font-bold uppercase tracking-[0.35em] backdrop-blur-sm transition-colors hover:border-inchiostro hover:bg-inchiostro hover:text-white md:px-16 md:py-6 md:text-xs md:tracking-[0.3em]"
                      data-cursor-hover="true"
                    >
                      <div className="marquee-btn-text top text-inchiostro">{t('pages.home.preloadStart')}</div>
                      <div className="marquee-btn-text bottom absolute left-0 top-full w-full text-oro">{t('pages.home.preloadStart')}</div>
                    </button>
                  </MagneticBtn>
                </div>
              </div>

              {/* Contatore principale: numero o geroglifo (oro), angolo come reference minimal */}
              <div
                className="absolute bottom-0 right-0 flex items-end gap-1 md:-right-4 md:-bottom-4"
                aria-live="polite"
                aria-label={t('pages.home.preloadAria').replace('{n}', String(loadingProgress))}
              >
                <div className="relative flex h-[clamp(88px,20vw,380px)] min-w-[clamp(3rem,18vw,22rem)] items-end justify-end">
                  <span
                    className={`font-gambetta text-[clamp(88px,20vw,380px)] font-bold leading-none tracking-tighter tabular-nums text-inchiostro transition-opacity duration-200 ease-out ${glyphFlash ? 'opacity-0' : 'opacity-100'
                      }`}
                  >
                    {loadingProgress}
                  </span>
                  <span
                    className={`absolute bottom-0 right-0 flex items-end justify-end font-hieroglyph text-[clamp(72px,17vw,320px)] leading-none text-oro transition-opacity duration-200 ease-out ${glyphFlash ? 'opacity-100' : 'opacity-0'
                      }`}
                  >
                    {glyphFlash ?? '\u200b'}
                  </span>
                </div>
                <span
                  className={`mb-[3.5vw] ml-0.5 font-satoshi text-xl font-medium text-inchiostro/70 transition-opacity duration-200 md:text-2xl ${glyphFlash ? 'opacity-0' : 'opacity-100'
                    }`}
                >
                  %
                </span>
              </div>
            </div>
          ) : (
            <div className="loading-content relative z-10 flex flex-col items-center gap-4">
              <span className="font-gambetta text-sm italic tracking-[0.35em] text-inchiostro/35">{t('pages.home.preloadBrand')}</span>
              <div className="h-px w-20 bg-oro/50" />
            </div>
          )}
        </div>
      )}

      <Cursor />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TicketsShopOverlay isOpen={isTicketsShopOpen} onClose={() => setIsTicketsShopOpen(false)} />

      {/* HEADER NAV */}
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-4 py-4 md:px-6 md:py-5 text-white text-sm uppercase tracking-widest border-b border-white/10 bg-black/50 backdrop-blur-md">
        {/* Left */}
        <div className="flex items-center w-auto md:w-1/3">
          <span className="hidden md:inline text-[10px] tracking-widest">{t('nav.torino')}</span>
          <span className="hidden lg:inline border-l border-white/30 pl-6 ml-6 text-gray-300 text-[10px]">{t('nav.accademia')}</span>
        </div>
        {/* Center */}
        <div className="flex-1 text-center md:w-1/3 md:flex-none">
          <MagneticBtn>
            <Link
              to="/"
              className="inline-block leading-none text-white transition-opacity hover:opacity-90"
              data-cursor-hover="true"
            >
              <MuseoLogo className="h-6 w-auto max-w-[min(200px,42vw)] md:h-8" />
              <span className="sr-only">{t('a11y.logoHome')}</span>
            </Link>
          </MagneticBtn>
        </div>
        {/* Right */}
        <div className="flex gap-3 md:gap-6 justify-end items-center w-auto md:w-1/3">
          <LanguageSwitcher variant="dark" />
          <MagneticBtn>
            <button
              onClick={() => setIsMenuOpen(true)}
              className="hover:text-oro transition-colors bg-white/10 px-4 py-1.5 md:px-6 md:py-2 rounded-full inline-block text-[10px] md:text-sm"
              data-cursor-hover="true"
            >
              {t('nav.menu')}
            </button>
          </MagneticBtn>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">

        {/* Stage: qui animiamo blur/scale (affidabile); il video resta il target del parallax */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <div
            ref={heroVideoStageRef}
            className="absolute inset-0 overflow-hidden"
            style={isReady ? undefined : HERO_STAGE_INTRO_STYLE}
          >
            <div
              ref={heroVideoFilterWrapRef}
              className="absolute inset-0 overflow-hidden"
              style={
                isReady
                  ? undefined
                  : {
                      opacity: heroVideoPixelsVisible ? 1 : 0,
                      transform: 'translateZ(0)',
                      isolation: 'isolate',
                    }
              }
            >
              <video
                ref={heroImageRef}
                src={HERO_VIDEO_SRC}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute top-[-15%] left-0 w-full h-[130%] object-cover bg-black"
                style={
                  isReady
                    ? { opacity: 0.8 }
                    : { opacity: 1, transform: 'translateZ(0)' }
                }
              />
            </div>
          </div>
        </div>

        {/* Maschera Testo (Nero = Opaco rispetto al video, Bianco = Buco Trasparente) */}
        <div
          ref={heroVignetteRef}
          className="absolute inset-0 z-10 bg-[#0a0a0a]/90 mix-blend-multiply flex flex-col items-center justify-center pointer-events-none"
        >
          <div
            className="text-white uppercase [animation:hero-title-fade-in_1s_ease-out_forwards]"
          >
            <h1 className="font-gambetta text-[clamp(100px,13vw,300px)] leading-[1.1] text-center flex flex-col -space-y-[0.2em]" ref={heroTitleRef}>
              <div className="overflow-hidden whitespace-nowrap">
                {Array.from(heroL1).map((ch, i) => (
                  <span key={`h1-${i}-${ch}`} className="char-stagger inline-block">
                    {ch}
                  </span>
                ))}
              </div>
              <div className="overflow-hidden whitespace-nowrap pointer-events-auto" data-cursor-hover="true">
                {Array.from(heroL2).map((ch, i) => (
                  <span key={`h2-${i}-${ch}`} className="char-stagger hollow-fill inline-block">
                    {ch}
                  </span>
                ))}
              </div>
            </h1>
          </div>
        </div>

      </section>

      {/* 1b. STATISTICHE — in numeri */}
      <section className="border-b border-white/10 bg-[#0a0a0a] text-papiro" aria-labelledby="home-stats-heading">
        <div className="mx-auto max-w-[1700px] px-4 py-14 md:px-10 md:py-20">
          <p
            id="home-stats-heading"
            className="mb-10 text-center text-[10px] font-bold uppercase tracking-[0.5em] text-oro md:mb-14"
          >
            {t('pages.home.statsEyebrow')}
          </p>
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            <article className="text-center lg:border-r lg:border-white/10 lg:px-6 lg:text-left">
              <p className="font-gambetta text-3xl tabular-nums text-oro sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-none">
                <StatCounter key={`${lang}-stats-1`} valueText={t('pages.home.stats1Value')} />
              </p>
              <h2 className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white md:text-sm">
                {t('pages.home.stats1Title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{t('pages.home.stats1Body')}</p>
            </article>
            <article className="text-center lg:border-r lg:border-white/10 lg:px-6 lg:text-left">
              <p className="font-gambetta text-3xl tabular-nums text-oro sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-none">
                <StatCounter key={`${lang}-stats-2`} valueText={t('pages.home.stats2Value')} />
              </p>
              <h2 className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white md:text-sm">
                {t('pages.home.stats2Title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{t('pages.home.stats2Body')}</p>
            </article>
            <article className="text-center lg:border-r lg:border-white/10 lg:px-6 lg:text-left">
              <p className="font-gambetta text-3xl tabular-nums text-oro sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-none">
                <StatCounter key={`${lang}-stats-3`} valueText={t('pages.home.stats3Value')} />
              </p>
              <h2 className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white md:text-sm">
                {t('pages.home.stats3Title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{t('pages.home.stats3Body')}</p>
            </article>
            <article className="text-center lg:px-6 lg:text-left">
              <p className="font-gambetta text-3xl tabular-nums text-oro sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-none">
                <StatCounter key={`${lang}-stats-4`} valueText={t('pages.home.stats4Value')} />
              </p>
              <h2 className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-white md:text-sm">
                {t('pages.home.stats4Title')}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{t('pages.home.stats4Body')}</p>
            </article>
          </div>
        </div>
      </section>

      {/* 2. NUOVA ALA - MATERIA E FORMA DEL TEMPO */}
      <section className="py-24 md:py-52 px-4 md:px-10 max-w-[1600px] mx-auto grid grid-cols-12 gap-10 items-center">
        <div className="col-span-12 md:col-span-5 hover-parallax overflow-hidden rounded-tr-[150px] aspect-[4/5]" data-cursor-hover="true">
          <img src="/nuova-ala.webp" alt={t('pages.home.newWingImgAlt')} className="w-full h-full object-cover grayscale" />
        </div>
        <div className="col-span-12 md:col-span-2"></div>
        <div className="col-span-12 md:col-span-5">
          <p className="text-oro font-bold uppercase tracking-[0.4em] text-xs mb-8">{t('pages.home.newWingEyebrow')}</p>
          <h2 data-stagger-heading className="font-gambetta text-[clamp(60px,6vw,140px)] uppercase leading-[1.1] mb-12 flex flex-col -space-y-[0.2em]">
            {/* aggiunto whitespace-nowrap per fixare 'ia' che andava a capo */}
            <div className="overflow-hidden whitespace-nowrap">
              {Array.from(t('pages.home.displayLine1')).map((ch, i) => (
                <span key={`d1-${i}-${ch}`} className="char-stagger inline-block">
                  {ch}
                </span>
              ))}
            </div>
            <div className="overflow-hidden whitespace-nowrap italic text-oro">
              {Array.from(t('pages.home.displayLine2')).map((ch, i) => (
                <span key={`d2-${i}-${ch}`} className="char-stagger inline-block">
                  {ch}
                </span>
              ))}
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              {Array.from(t('pages.home.displayLine3')).map((ch, i) => (
                <span key={`d3-${i}-${ch}`} className="char-stagger inline-block">
                  {ch}
                </span>
              ))}
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              {Array.from(t('pages.home.displayLine4')).map((ch, i) => (
                <span key={`d4-${i}-${ch}`} className="char-stagger inline-block">
                  {ch}
                </span>
              ))}
            </div>
          </h2>
          <MagneticBtn>
            <MarqueeBtn className="px-8 py-4 border border-inchiostro text-inchiostro uppercase tracking-[0.2em] text-xs font-bold rounded-full hover:bg-inchiostro hover:text-white">
              {t('pages.home.newWingBtn')}
            </MarqueeBtn>
          </MagneticBtn>
        </div>
      </section>

      {/* 3. BIG MARQUEE TESTO INFINITO */}
      <section className="py-32 overflow-hidden bg-inchiostro text-papiro flex items-center">
        <h2 ref={marqueeRef} className="font-gambetta text-[clamp(100px,14vw,350px)] whitespace-nowrap uppercase italic tracking-tighter pr-10 hover:text-oro transition-colors data-cursor-hover" data-cursor-hover="true">
          {t('pages.home.marquee')}
        </h2>
      </section>

      {/* 4. ESPLORA (NEWS E APPUNTAMENTI) */}
      <section className="py-24 md:py-52 px-4 md:px-10 max-w-[1700px] mx-auto text-inchiostro">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-20 border-b border-inchiostro/10 pb-8 pl-2 md:pl-4">
          <h2 data-stagger-heading className="font-gambetta text-[clamp(70px,7vw,160px)] uppercase leading-[1.1]">
            <div className="overflow-hidden whitespace-nowrap">
              {Array.from(t('pages.home.exploreTitle')).map((ch, i) => (
                <span key={`ex-${i}-${ch}`} className="char-stagger inline-block">
                  {ch}
                </span>
              ))}
            </div>
          </h2>
          <MagneticBtn>
            <MarqueeBtn className="uppercase tracking-[0.2em] text-xs font-bold border border-inchiostro px-8 py-4 rounded-full">
              {t('pages.home.exploreBtn')}
            </MarqueeBtn>
          </MagneticBtn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
          <article className="group cursor-pointer hover-parallax" data-cursor-hover="true">
            <div className="overflow-hidden aspect-[3/4] mb-6 md:mb-8 clip-path-polygon">
              <img src="/news_exhibit.png" alt={t('pages.home.art1ImgAlt')} className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" />
            </div>
            <p className="text-oro text-xs uppercase tracking-[0.3em] font-bold mb-4">{t('pages.home.art1Cat')}</p>
            <h3 className="font-gambetta text-3xl md:text-4xl mb-4 leading-tight group-hover:italic transition-all">{t('pages.home.art1Title')}</h3>
          </article>

          <article className="group cursor-pointer hover-parallax md:mt-20" data-cursor-hover="true">
            <div className="overflow-hidden aspect-[3/4] mb-6 md:mb-8 clip-path-polygon relative">
              <img src="/news_papyrus.png" alt={t('pages.home.art2ImgAlt')} className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" />
            </div>
            <p className="text-oro text-xs uppercase tracking-[0.3em] font-bold mb-4">{t('pages.home.art2Cat')}</p>
            <h3 className="font-gambetta text-3xl md:text-4xl mb-4 leading-tight group-hover:italic transition-all">{t('pages.home.art2Title')}</h3>
          </article>

          <article className="group cursor-pointer flex flex-col p-8 md:p-16 bg-inchiostro text-papiro rounded-bl-[80px] md:rounded-bl-[150px]" data-cursor-hover="true">
            <div>
              <p className="text-oro text-xs uppercase tracking-[0.3em] font-bold mb-12 border-b border-white/20 pb-4">{t('pages.home.art3Cat')}</p>
              <h3 className="font-gambetta text-5xl mb-10 leading-[1.1]">{t('pages.home.art3Title')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-auto">{t('pages.home.art3Body')}</p>
            </div>
            <div className="mt-20">
              <MagneticBtn>
                <MarqueeBtn className="w-full py-5 border border-white text-white uppercase font-bold text-xs tracking-widest hover:bg-oro hover:border-oro">
                  {t('pages.home.art3Btn')}
                </MarqueeBtn>
              </MagneticBtn>
            </div>
          </article>
        </div>
      </section>

      {/* 5. MEMBERSHIP AWWWARDS STYLE */}
      <section className="min-h-[80vh] md:h-screen bg-inchiostro text-white relative overflow-hidden flex items-center justify-center py-20 md:py-0">
        <div className="absolute inset-0 z-0 opacity-50 mix-blend-color-dodge">
          <img src="/membership_statue.png" alt={t('pages.home.memberImgAlt')} className="w-full h-full object-cover grayscale" />
        </div>
        <div className="relative z-10 w-full px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0 max-w-[1600px] mx-auto">
          <div className="w-full md:w-1/2">
            <h2 data-stagger-heading className="font-gambetta text-[clamp(60px,10vw,240px)] leading-[1.1] uppercase mb-8 mix-blend-difference flex flex-col -space-y-[0.2em]">
              <div className="overflow-hidden whitespace-nowrap"><span className="char-stagger inline-block">Y</span><span className="char-stagger inline-block">o</span><span className="char-stagger inline-block">u</span><span className="char-stagger inline-block">&</span></div>
              <div className="overflow-hidden text-oro italic whitespace-nowrap"><span className="char-stagger inline-block">M</span><span className="char-stagger inline-block">e</span><span className="char-stagger inline-block">.</span></div>
            </h2>
          </div>
          <div className="w-full md:w-1/3 md:text-right">
            <p className="text-lg md:text-2xl text-gray-300 leading-relaxed mb-8 md:mb-10">
              {t('pages.home.memberBody')}
            </p>
            <MagneticBtn>
              <MarqueeBtn className="px-8 md:px-12 py-4 md:py-5 border border-white rounded-full bg-white text-inchiostro uppercase tracking-[0.2em] text-xs transition-all font-bold mix-blend-difference hover:scale-105">
                {t('pages.home.memberBtn')}
              </MarqueeBtn>
            </MagneticBtn>
          </div>
        </div>
      </section>

      {/* 6. GALLERIA ORIZZONTALE GSAP — pin + scrub su tutti i viewport (prima era hidden sotto md per layout/QA) */}
      <section ref={galleryRef} className="flex h-screen min-h-[100dvh] bg-[#0a0a0a] text-papiro items-center overflow-hidden">
        <div
          ref={galleryContainerRef}
          className="flex h-[min(70vh,32rem)] items-center gap-10 px-5 sm:px-8 md:h-[70vh] md:gap-20 md:px-[10vw]"
          data-cursor-hover="true"
        >

          <div className="relative flex h-full w-[min(92vw,1400px)] max-w-[1400px] flex-shrink-0 items-center gap-6 md:w-[80vw] md:gap-10">
            <h2 className="absolute -left-[5vw] font-gambetta text-[clamp(100px,15vw,400px)] text-white/5 uppercase select-none pointer-events-none z-0">{t('pages.home.galWatermark')}</h2>
            <img src="/statua_basalto.png" alt={t('pages.home.gal1ImgAlt')} className="w-[50%] h-full object-cover grayscale brightness-75 z-10 clip-path-polygon hover:grayscale-0 transition-all duration-1000" />
            <div className="z-10 flex w-[50%] min-w-0 flex-col justify-center max-md:w-[45%]">
              <p className="text-oro text-xs uppercase tracking-[0.4em] mb-4">{t('pages.home.gal1Eyebrow')}</p>
              <h3 className="font-gambetta text-2xl leading-[1.1] mb-4 sm:text-3xl md:mb-6 md:text-4xl lg:text-6xl">{t('pages.home.gal1Title')}</h3>
              <p className="text-gray-400 text-xs leading-relaxed sm:text-sm md:mb-10 md:w-3/4">{t('pages.home.gal1Body')}</p>
            </div>
          </div>

          <div className="relative flex h-[80%] w-[min(92vw,1400px)] max-w-[1400px] flex-shrink-0 items-center gap-6 md:w-[80vw] md:gap-10">
            <div className="flex w-1/2 min-w-0 flex-col justify-center text-right max-md:w-[45%]">
              <p className="text-oro text-xs uppercase tracking-[0.4em] mb-4">{t('pages.home.gal2Eyebrow')}</p>
              <h3 className="font-gambetta text-2xl leading-[1.1] mb-4 sm:text-3xl md:mb-6 md:text-4xl lg:text-6xl">{t('pages.home.gal2Title')}</h3>
              <p className="ml-auto text-gray-400 text-xs leading-relaxed sm:text-sm md:mb-10 md:w-3/4">{t('pages.home.gal2Body')}</p>
            </div>
            <img src="/sarcofago_oro.png" alt={t('pages.home.gal2ImgAlt')} className="z-10 h-full w-1/2 object-cover grayscale brightness-75 clip-path-polygon transition-all duration-1000 hover:grayscale-0" />
          </div>

          <div className="relative flex h-full w-[min(88vw,1200px)] max-w-[1200px] flex-shrink-0 items-center gap-6 pr-5 sm:pr-8 md:w-[70vw] md:gap-10 md:pr-[10vw]">
            <img src="/scultura_granito.png" alt={t('pages.home.gal3ImgAlt')} className="z-10 h-full w-[40%] object-cover grayscale brightness-75 clip-path-polygon transition-all duration-1000 hover:grayscale-0" />
            <div className="z-10 flex w-[60%] min-w-0 flex-col justify-center max-md:w-[55%]">
              <p className="text-oro text-xs uppercase tracking-[0.4em] mb-4">{t('pages.home.gal3Eyebrow')}</p>
              <h3 className="font-gambetta text-2xl leading-[1.1] mb-4 sm:text-3xl md:mb-6 md:text-4xl lg:text-6xl">{t('pages.home.gal3Title')}</h3>
              <p className="text-gray-400 text-xs leading-relaxed sm:text-sm md:mb-10 md:w-3/4">{t('pages.home.gal3Body')}</p>
              <div>
                <MagneticBtn>
                  <MarqueeBtn className="px-8 py-4 border border-white text-white uppercase tracking-[0.2em] text-xs font-bold rounded-full hover:bg-white hover:text-black mt-4 inline-block">
                    {t('pages.home.gal3Btn')}
                  </MarqueeBtn>
                </MagneticBtn>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. PIANIFICA LA VISITA - GRIGLIA BRUTALISTA */}
      <section className="bg-papiro text-inchiostro pt-16 md:pt-32 pb-24 md:pb-40 px-4 md:px-10 border-t border-inchiostro/10">
        <div className="max-w-[1700px] mx-auto">
          <h2 data-stagger-heading className="font-gambetta text-[clamp(48px,8vw,160px)] uppercase leading-[1.1] mb-10 md:mb-20">
            <div className="overflow-hidden whitespace-nowrap">
              {Array.from(t('pages.home.planTitle')).map((ch, i) => (
                <span key={`pl-${i}-${ch}`} className="char-stagger inline-block">
                  {ch}
                </span>
              ))}
            </div>
          </h2>

          <div className="border-t border-inchiostro">
            {/* Riga 1: orari + tariffe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              <div
                className="sm:col-span-2 border-b border-inchiostro p-6 md:p-10 md:border-r md:border-b-0 flex flex-col justify-between group hover:bg-inchiostro hover:text-papiro transition-colors duration-500 cursor-pointer"
                data-cursor-hover="true"
              >
                <div>
                  <p className="text-oro text-xs uppercase tracking-[0.4em] font-bold mb-6 md:mb-10">{t('pages.home.planOrari')}</p>
                  <div className="flex justify-between border-b border-current/20 pb-4 mb-4">
                    <span className="font-bold uppercase text-base md:text-xl">{t('pages.home.planLun')}</span>
                    <span className="text-base md:text-xl font-bold">09:00 — 14:00</span>
                  </div>
                  <div className="flex justify-between border-b border-current/20 pb-4 mb-4">
                    <span className="font-bold uppercase text-base md:text-xl">{t('pages.home.planMarDom')}</span>
                    <span className="text-base md:text-xl font-bold">09:00 — 18:30</span>
                  </div>
                </div>
              </div>

              <div
                className="p-6 md:p-10 border-b border-inchiostro md:border-b-0 flex flex-col justify-between group hover:bg-inchiostro hover:text-papiro transition-colors duration-500 cursor-pointer"
                data-cursor-hover="true"
              >
                <div>
                  <p className="text-oro text-xs uppercase tracking-[0.4em] font-bold mb-6 md:mb-10">{t('pages.home.planTariffe')}</p>
                  <p className="text-5xl md:text-6xl font-gambetta mb-2 group-hover:text-oro transition-colors">18€</p>
                  <p className="uppercase text-sm font-bold opacity-50 mb-6 md:mb-10">{t('pages.home.planIntero')}</p>
                  <p className="text-3xl md:text-4xl font-gambetta mb-2 group-hover:text-oro transition-colors">15€</p>
                  <p className="uppercase text-sm font-bold opacity-50">{t('pages.home.planRidotto')}</p>
                </div>
              </div>
            </div>

            <div
              className="border-t border-inchiostro p-6 md:p-10 transition-colors duration-500 group hover:bg-inchiostro hover:text-papiro"
              data-cursor-hover="true"
            >
              <MuseumLiveStatusCard variant="plan" />
            </div>

            {/* Riga 2: location + mappa (stesso dato di /visita) */}
            <div className="grid grid-cols-1 border-t border-inchiostro lg:grid-cols-2 lg:items-stretch">
              <div
                className="flex flex-col justify-between gap-8 border-b border-inchiostro p-6 md:p-10 lg:border-b-0 lg:border-r group hover:bg-inchiostro hover:text-papiro transition-colors duration-500"
                data-cursor-hover="true"
              >
                <div>
                  <p className="text-oro text-xs uppercase tracking-[0.4em] font-bold">{t('pages.home.planLocation')}</p>
                  <h3 className="mt-6 font-gambetta text-2xl italic md:text-3xl">
                    {t('pages.home.planAddr1')}
                    <br />
                    {t('pages.home.planAddr2')}
                  </h3>
                  <p className="mt-4 uppercase text-xs font-bold tracking-widest opacity-60">{t('pages.home.planCity')}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <a
                    href={MUSEO_MAP.openInMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-current py-3 text-center text-xs font-bold uppercase tracking-widest transition-all hover:border-oro hover:bg-oro hover:text-white sm:w-auto sm:px-8"
                    data-cursor-hover="true"
                  >
                    {t('pages.home.planDirections')}
                  </a>
                  <Link
                    to="/visita"
                    className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-inchiostro/50 underline-offset-4 transition-colors hover:text-oro group-hover:text-papiro/70"
                  >
                    {t('pages.home.planDetails')}
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[260px] w-full bg-inchiostro/[0.04] lg:min-h-[300px]">
                <iframe
                  title={t('pages.home.mapIframe')}
                  src={MUSEO_MAP.embedSrc}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. MEGA FOOTER ARCHITETTONICO */}
      <footer className="bg-inchiostro text-white pt-16 md:pt-32 pb-10 px-4 md:px-10 relative overflow-hidden">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 border-b border-white/20 pb-12 md:pb-20 mb-10 relative z-10">

          <div className="md:col-span-4">
            <h3 className="font-gambetta text-5xl italic text-oro mb-6">Restimenta.</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-10 w-3/4">{t('pages.home.footerNewsletter')}</p>
            <div className="flex border-b border-white/30 pb-2">
              <input type="email" placeholder={t('pages.home.footerPlaceholder')} className="bg-transparent outline-none uppercase text-xs tracking-widest w-full font-bold text-white placeholder:text-white/30" />
              <button className="text-oro hover:text-white transition-colors" data-cursor-hover="true">→</button>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <p className="text-oro text-xs uppercase tracking-[0.4em] font-bold mb-8">{t('pages.home.footerExplore')}</p>
            <ul className="space-y-4 uppercase text-xs font-bold tracking-widest text-gray-300">
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">{t('pages.home.footerLink1')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">{t('pages.home.footerLink2')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">{t('pages.home.footerLink3')}</li>
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">{t('pages.home.footerLink4')}</li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="text-oro text-xs uppercase tracking-[0.4em] font-bold mb-8">{t('pages.home.footerSocial')}</p>
            <ul className="space-y-4 uppercase text-xs font-bold tracking-widest text-gray-300">
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">Instagram</li>
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">Youtube</li>
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">Facebook</li>
              <li className="hover:text-white cursor-pointer transition-colors" data-cursor-hover="true">X</li>
            </ul>
          </div>
        </div>

        {/* MASSIVE FOOTER TEXT */}
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-start md:items-end justify-between relative z-10 w-full overflow-hidden">
          <span className="font-gambetta text-[clamp(52px,14vw,360px)] leading-[0.8] uppercase tracking-tighter opacity-90 select-none">MUSEO<br />EGIZIO</span>
          <span className="text-gray-500 uppercase text-[10px] tracking-widest md:mb-4 mt-4 md:mt-0">
            © {new Date().getFullYear()} {t('pages.home.footerCopy')}
          </span>
        </div>

        <div className="max-w-[1700px] mx-auto mt-10 pt-8 border-t border-white/10 text-center relative z-10">
          <DesignCredit className="text-gray-500 hover:text-oro" />
        </div>
      </footer>

    </div>
  );
};

export default HomePage;