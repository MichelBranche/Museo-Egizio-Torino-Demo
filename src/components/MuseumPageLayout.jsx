import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HomeLink from './HomeLink';
import Cursor from './Cursor';
import MenuOverlay from './MenuOverlay';
import TicketsShopOverlay from './TicketsShopOverlay';
import MagneticBtn from './MagneticBtn';
import MuseoLogo from './MuseoLogo';
import LanguageSwitcher from './LanguageSwitcher';
import DesignCredit from './DesignCredit';
import { useLanguage } from '../context/useLanguage';

gsap.registerPlugin(ScrollTrigger);

/**
 * Shell comune alle pagine interne (stesso header, cursor, menu, reveal scroll).
 */
export default function MuseumPageLayout({
  children,
  watermark = '',
  className = '',
  headerVariant = 'dark',
}) {
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isTicketsShopOpen, setIsTicketsShopOpen] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!pageRef.current) return undefined;
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 56, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.15,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const headerBg =
    headerVariant === 'dark'
      ? 'bg-black/50 backdrop-blur-md border-white/10'
      : 'bg-papiro/90 backdrop-blur-md border-inchiostro/10';

  const headerText = headerVariant === 'dark' ? 'text-white' : 'text-inchiostro';
  const langVariant = headerVariant === 'dark' ? 'dark' : 'light';

  return (
    <div
      ref={pageRef}
      className={`relative min-h-screen overflow-x-hidden bg-[#0a0a0a] font-satoshi selection:bg-oro selection:text-white ${className}`}
    >
      {watermark ? (
        <div
          className="pointer-events-none fixed bottom-0 left-0 select-none font-gambetta text-[clamp(5rem,18vw,16rem)] leading-none text-white/[0.03] whitespace-nowrap"
          aria-hidden
        >
          {watermark}
        </div>
      ) : null}

      <Cursor />
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <TicketsShopOverlay isOpen={isTicketsShopOpen} onClose={() => setIsTicketsShopOpen(false)} />

      <header
        className={`fixed top-0 z-40 flex w-full items-center justify-between border-b px-4 py-4 md:px-6 md:py-5 text-sm uppercase tracking-widest ${headerBg} ${headerText}`}
      >
        <div className="flex w-auto md:w-1/3 items-center gap-4 md:gap-6">
          <HomeLink className="text-[10px] md:text-sm transition-colors hover:text-oro" data-cursor-hover="true">
            {t('nav.backHome')}
          </HomeLink>
          <span className="hidden lg:inline-block border-l border-current/20 pl-6 text-[10px] opacity-50">
            {t('nav.torino')}
          </span>
        </div>
        <div className="flex-1 text-center md:w-1/3 md:flex-none">
          <MagneticBtn>
            <HomeLink
              className="inline-block leading-none text-current transition-opacity hover:opacity-90"
              data-cursor-hover="true"
            >
              <MuseoLogo className="h-6 w-auto max-w-[min(200px,42vw)] md:h-8" />
              <span className="sr-only">{t('a11y.logoHome')}</span>
            </HomeLink>
          </MagneticBtn>
        </div>
        <div className="flex w-auto md:w-1/3 items-center justify-end gap-3 md:gap-6">
          <LanguageSwitcher variant={langVariant} />
          <MagneticBtn>
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsTicketsShopOpen(true);
              }}
              className="hidden rounded-full border border-current/20 px-3 py-1.5 text-[10px] transition-colors hover:text-oro md:inline-block md:px-5 md:text-xs"
              data-cursor-hover="true"
            >
              {t('nav.ticketsShop')}
            </button>
          </MagneticBtn>
          <MagneticBtn>
            <button
              type="button"
              onClick={() => {
                setIsTicketsShopOpen(false);
                setIsMenuOpen(true);
              }}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[10px] transition-colors hover:text-oro md:px-6 md:py-2 md:text-sm"
              data-cursor-hover="true"
            >
              {t('nav.menu')}
            </button>
          </MagneticBtn>
        </div>
      </header>

      {children}

      <footer className="relative z-10 border-t border-white/10 bg-[#0a0a0a] px-6 py-8 text-center">
        <DesignCredit className="text-white/35 hover:text-oro/90" />
      </footer>
    </div>
  );
}
