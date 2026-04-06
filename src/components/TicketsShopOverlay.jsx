import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage } from '../context/useLanguage';

const TicketsShopOverlay = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);

  useLayoutEffect(() => {
    if (!backdropRef.current || !panelRef.current) return;
    gsap.set(backdropRef.current, { opacity: 0 });
    gsap.set(panelRef.current, { xPercent: 100 });
  }, []);

  useEffect(() => {
    if (!backdropRef.current || !panelRef.current) return;
    if (isOpen) {
      gsap.to(backdropRef.current, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.to(panelRef.current, { xPercent: 0, duration: 0.85, ease: 'expo.out' });
    } else {
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.35, ease: 'power2.in' });
      gsap.to(panelRef.current, { xPercent: 100, duration: 0.65, ease: 'expo.in' });
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [isOpen]);

  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) html.style.overflow = 'hidden';
    else html.style.overflow = '';
    return () => {
      html.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-[102] flex justify-end ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      <button
        ref={backdropRef}
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label={t('ticketsShop.closeBackdrop')}
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px] opacity-0"
        onClick={handleClose}
      />

      <aside
        ref={panelRef}
        className="relative flex h-full w-full max-w-[min(100%,480px)] flex-col bg-papiro text-inchiostro shadow-[-12px_0_48px_rgba(0,0,0,0.18)]"
        style={{ willChange: 'transform' }}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-inchiostro/10 p-6 md:p-8">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-oro">{t('ticketsShop.eyebrow')}</p>
            <h2 className="font-gambetta text-4xl leading-none md:text-5xl">{t('ticketsShop.title')}</h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-full border border-inchiostro/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors hover:border-inchiostro hover:bg-inchiostro hover:text-papiro"
            data-cursor-hover="true"
          >
            {t('ticketsShop.close')}
          </button>
        </div>

        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-8 md:px-8">
          <section className="mb-12">
            <h3 className="mb-4 font-gambetta text-2xl italic text-inchiostro md:text-3xl">{t('ticketsShop.ticketsTitle')}</h3>
            <p className="mb-6 text-sm leading-relaxed text-inchiostro/70">
              {t('ticketsShop.ticketsIntro')}
            </p>
            <ul className="space-y-3 border-y border-inchiostro/10 py-4 text-sm">
              <li className="flex justify-between gap-4">
                <span className="font-medium">{t('ticketsShop.fullPrice')}</span>
                <span className="font-gambetta text-lg text-oro">18€</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="font-medium">{t('ticketsShop.reduced')}</span>
                <span className="font-gambetta text-lg text-oro">15€</span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="font-medium text-inchiostro/60">{t('ticketsShop.groupsSchools')}</span>
                <span className="text-xs uppercase tracking-widest text-inchiostro/50">{t('ticketsShop.onReservation')}</span>
              </li>
            </ul>
            <Link
              to="/biglietti"
              onClick={handleClose}
              className="mt-6 flex w-full items-center justify-center rounded-full border border-inchiostro bg-inchiostro py-4 text-xs font-bold uppercase tracking-[0.25em] text-papiro transition-colors hover:border-oro hover:bg-oro hover:text-white"
              data-cursor-hover="true"
            >
              {t('ticketsShop.buyTickets')}
            </Link>
          </section>

          <section className="mb-10">
            <h3 className="mb-4 font-gambetta text-2xl italic text-inchiostro md:text-3xl">{t('ticketsShop.shopTitle')}</h3>
            <p className="mb-6 text-sm leading-relaxed text-inchiostro/70">
              {t('ticketsShop.shopIntro')}
            </p>
            <div className="grid gap-3">
              {[
                { titleKey: 'ticketsShop.catLibriTitle', descKey: 'ticketsShop.catLibriDesc', cat: 'libri' },
                { titleKey: 'ticketsShop.catSouvenirTitle', descKey: 'ticketsShop.catSouvenirDesc', cat: 'souvenir' },
                { titleKey: 'ticketsShop.catGiftTitle', descKey: 'ticketsShop.catGiftDesc', cat: 'gift' },
              ].map(({ titleKey, descKey, cat }) => (
                <Link
                  key={cat}
                  to={`/shop?cat=${cat}`}
                  onClick={handleClose}
                  className="group flex w-full flex-col items-start border border-inchiostro/15 bg-white/40 px-4 py-4 text-left transition-colors hover:border-oro/60 hover:bg-white"
                  data-cursor-hover="true"
                >
                  <span className="text-sm font-bold uppercase tracking-widest">{t(titleKey)}</span>
                  <span className="mt-1 text-xs text-inchiostro/55">{t(descKey)}</span>
                </Link>
              ))}
            </div>
            <Link
              to="/shop"
              onClick={handleClose}
              className="mt-6 flex w-full items-center justify-center rounded-full border border-inchiostro/30 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-inchiostro hover:bg-inchiostro hover:text-papiro"
              data-cursor-hover="true"
            >
              {t('ticketsShop.goShop')}
            </Link>
          </section>

          <p className="border-t border-inchiostro/10 pt-6 text-[11px] leading-relaxed text-inchiostro/45">
            {t('ticketsShop.disclaimer')}
          </p>
        </div>
      </aside>
    </div>
  );
};

export default TicketsShopOverlay;
