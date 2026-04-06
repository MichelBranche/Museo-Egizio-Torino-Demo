import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HomeLink from '../components/HomeLink';
import Cursor from '../components/Cursor';
import MenuOverlay from '../components/MenuOverlay';
import TicketsShopOverlay from '../components/TicketsShopOverlay';
import MagneticBtn from '../components/MagneticBtn';
import MarqueeBtn from '../components/MarqueeBtn';
import AcquistaBigliettiSection from '../components/AcquistaBigliettiSection';
import HieroglyphMarquee from '../components/HieroglyphMarquee';
import MuseoLogo from '../components/MuseoLogo';
import LanguageSwitcher from '../components/LanguageSwitcher';
import DesignCredit from '../components/DesignCredit';
import { useLanguage } from '../context/useLanguage';

gsap.registerPlugin(ScrollTrigger);

const AcquistaBigliettiPage = () => {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTicketsShopOpen, setIsTicketsShopOpen] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0a0a] font-satoshi text-white selection:bg-oro selection:text-white" ref={pageRef}>

      {/* Ghost watermark */}
      <div className="pointer-events-none fixed bottom-0 left-0 select-none font-gambetta text-[clamp(6rem,22vw,20rem)] leading-none text-white/[0.02] whitespace-nowrap" aria-hidden>
        VISITE
      </div>

      <Cursor />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TicketsShopOverlay isOpen={isTicketsShopOpen} onClose={() => setIsTicketsShopOpen(false)} />

      {/* HEADER */}
      <header className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-white/10 px-4 py-4 md:px-6 md:py-5 text-sm uppercase tracking-widest text-white bg-black/50 backdrop-blur-md">
        <div className="flex w-auto md:w-1/3 items-center gap-4 md:gap-6">
          <HomeLink className="text-[10px] md:text-sm transition-colors hover:text-oro" data-cursor-hover="true">{t('nav.backHome')}</HomeLink>
          <span className="hidden lg:inline-block border-l border-white/30 pl-6 text-white/50 text-[10px]">{t('nav.torino')}</span>
        </div>
        <div className="flex-1 text-center md:w-1/3 md:flex-none">
          <MagneticBtn>
            <HomeLink
              className="inline-block leading-none text-white transition-opacity hover:opacity-90"
              data-cursor-hover="true"
            >
              <MuseoLogo className="h-6 w-auto max-w-[min(200px,42vw)] md:h-8" />
              <span className="sr-only">{t('a11y.logoHome')}</span>
            </HomeLink>
          </MagneticBtn>
        </div>
        <div className="flex w-auto md:w-1/3 items-center justify-end gap-3 md:gap-6">
          <LanguageSwitcher variant="dark" />
          <MagneticBtn>
            <button type="button" onClick={() => setIsMenuOpen(true)}
              className="rounded-full bg-white/10 px-3 py-1.5 md:px-6 md:py-2 text-[10px] md:text-sm transition-colors hover:text-oro" data-cursor-hover="true">
              {t('nav.menu')}
            </button>
          </MagneticBtn>
        </div>
      </header>

      {/* ── CINEMATIC HERO ───────────────────────────────────── */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/nuova-ala.webp" alt="" className="h-full w-full scale-110 object-cover opacity-40 grayscale" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/50 to-[#0a0a0a]" />
        </div>

        {/* Hero content — huge editorial typographic layout */}
        <div className="relative z-10 flex flex-col items-start justify-end min-h-screen px-6 pb-20 md:px-10 md:pb-28 max-w-[1700px] mx-auto">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.55em] text-oro" data-reveal>
            {t('pages.tickets.heroEyebrow')}
          </p>

          <h1 className="font-gambetta leading-[0.88] tracking-tighter overflow-hidden" data-reveal>
            <span className="block text-[clamp(3rem,12vw,14rem)] text-white/90">{t('pages.tickets.h1a')}</span>
            <span className="block text-[clamp(3rem,12vw,14rem)] italic text-oro">{t('pages.tickets.h1b')}</span>
            <span className="block text-[clamp(3rem,12vw,14rem)] text-white/20 uppercase">{t('pages.tickets.h1c')}</span>
          </h1>

          {/* Inline price strip */}
          <div className="mt-16 flex flex-wrap gap-px w-full md:max-w-2xl border border-white/10" data-reveal>
            <div className="flex-1 min-w-[120px] p-5 border-r border-white/10 bg-white/[0.03]">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-oro mb-1">{t('pages.tickets.stripIntero')}</p>
              <p className="font-gambetta text-3xl text-white">18€</p>
            </div>
            <div className="flex-1 min-w-[120px] p-5 border-r border-white/10 bg-white/[0.03]">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-oro mb-1">{t('pages.tickets.stripRidotto')}</p>
              <p className="font-gambetta text-3xl text-white">15€</p>
            </div>
            <div className="flex-1 min-w-[120px] p-5 bg-white/[0.03]">
              <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-oro mb-1">{t('pages.tickets.stripOrari')}</p>
              <p className="whitespace-pre-line text-xs text-white/60 font-medium uppercase tracking-widest leading-snug">
                {t('pages.tickets.stripHours')}
              </p>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="mt-12 flex items-center gap-4 text-white/30" data-reveal>
            <div className="h-px w-12 bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.4em]">{t('pages.tickets.scrollCue')}</span>
          </div>
        </div>
      </section>

      <HieroglyphMarquee className="relative z-20" />

      {/* ── SPLIT BOOKING SECTION ────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col md:flex-row">

        {/* LEFT — Atmospheric editorial panel */}
        <div className="relative w-full md:w-[45%] bg-[#0d0d0d] flex flex-col justify-between p-8 md:p-16 md:sticky md:top-0 md:h-screen overflow-hidden">
          {/* Background ghost */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img src="/nuova-ala.webp" alt="" className="h-full w-full object-cover opacity-25 grayscale scale-110" />
            <div className="absolute inset-0 bg-[#0d0d0d]/70" />
          </div>

          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.55em] text-oro mb-8">{t('pages.tickets.panelEyebrow')}</p>

            {/* Massive price display */}
            <div className="mb-12">
              <span className="font-gambetta text-[clamp(5rem,14vw,9rem)] leading-none text-white">18</span>
              <span className="font-gambetta text-[clamp(2rem,6vw,4rem)] text-oro">€</span>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">{t('pages.tickets.fullTicket')}</p>
            </div>

            {/* Info bullets */}
            <div className="space-y-5 border-t border-white/15 pt-8">
              {[
                [t('pages.tickets.rowLun'), '9:00 — 14:00'],
                [t('pages.tickets.rowMar'), '9:00 — 18:30'],
                [t('pages.tickets.rowClosed'), t('pages.tickets.rowClosedVal')],
              ].map(([label, val]) => (
                <div key={label} className="flex items-baseline justify-between border-b border-white/10 pb-5">
                  <span className="text-xs font-bold uppercase tracking-[0.35em] text-white/60">{label}</span>
                  <span className="font-gambetta text-xl text-white/90">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom caption */}
          <div className="relative z-10 mt-12">
            <p className="font-gambetta text-[clamp(2.5rem,5vw,4rem)] italic text-white/20 leading-tight select-none">
              {t('pages.home.planAddr1')}
              <br />
              {t('pages.home.planAddr2')}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">{t('pages.home.planCity')}</p>
          </div>
        </div>

        {/* RIGHT — Booking form */}
        <div className="md:w-[55%] flex flex-col justify-center p-8 md:p-16 lg:p-24 bg-[#0a0a0a]">
          <div className="max-w-xl w-full mx-auto">
            {/* Form header */}
            <div className="mb-12 flex items-end gap-5">
              <div className="h-px flex-1 bg-white/10" />
              <h2 className="font-gambetta text-2xl italic text-white/70">{t('pages.tickets.formTitle')}</h2>
            </div>

            {/* Form container — ultra minimal glass */}
            <div className="rounded-tr-[2.5rem] border border-white/10 bg-white/[0.03] p-8 md:p-10 backdrop-blur-sm relative">
              <div className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 rounded-full border border-oro/15" />
              <AcquistaBigliettiSection variant="page" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] px-6 py-10 text-center text-[10px] uppercase tracking-[0.25em] text-white/20">
        <p>© {new Date().getFullYear()} {t('pages.tickets.footerDemo')}</p>
        <p className="mt-4">
          <DesignCredit className="text-white/35 hover:text-oro/90" />
        </p>
      </footer>
    </div>
  );
};

export default AcquistaBigliettiPage;
