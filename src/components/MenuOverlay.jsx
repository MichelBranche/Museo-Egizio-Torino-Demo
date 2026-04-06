import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage } from '../context/useLanguage';

const MenuOverlay = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const overlayRef = useRef(null);
  const linksRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current, 
        { clipPath: "inset(100% 0 0 0)" }, 
        { clipPath: "inset(0% 0 0 0)", duration: 1.2, ease: "expo.inOut" }
      );
      gsap.fromTo(linksRef.current,
        { y: 200, opacity: 0, rotate: 5 },
        { y: 0, opacity: 1, rotate: 0, stagger: 0.08, duration: 1.2, ease: "power4.out", delay: 0.6 }
      );
    } else {
      gsap.to(overlayRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" });
    }
  }, [isOpen]);

  const navItems = [
    { labelKey: 'menu.visita', to: '/visita' },
    { labelKey: 'menu.ricerca', to: '/ricerca' },
    { labelKey: 'menu.notizie', to: '/notizie' },
    { labelKey: 'menu.ilMuseo', to: '/il-museo' },
  ];
  const ctaItems = [
    { labelKey: 'menu.biglietteria', to: '/biglietti' },
    { labelKey: 'menu.shop', to: '/shop' },
  ];

  return (
    <div 
      ref={overlayRef} 
      className="fixed inset-0 bg-inchiostro text-papiro z-[100] flex flex-col justify-center items-center"
      style={{ clipPath: 'inset(100% 0 0 0)' }}
    >
      {/* Close button */}
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 md:top-10 md:right-10 text-sm font-bold uppercase tracking-widest hover:text-oro transition-colors"
        data-cursor-hover="true"
      >
        {t('menu.close')}
      </button>

      {/* Content layout */}
      <div className="flex flex-col md:flex-row w-full max-w-[1400px] px-8 md:px-16 gap-12 md:gap-0 items-start md:items-end justify-between">
        
        {/* Left — Main nav links */}
        <div className="flex flex-col text-left space-y-1">
          {navItems.map((item, i) => (
            <div key={item.to} className="overflow-hidden">
              <Link
                to={item.to}
                ref={(el) => {
                  linksRef.current[i] = el;
                }}
                className="block font-gambetta text-[clamp(3.5rem,8vw,9rem)] uppercase leading-[0.85] transition-all hover:cursor-pointer hover:italic hover:text-oro"
                data-cursor-hover="true"
                onClick={onClose}
              >
                {t(item.labelKey)}
              </Link>
            </div>
          ))}
        </div>

        {/* Right — Tickets & Shop */}
        <div className="flex flex-col gap-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-oro mb-2">{t('menu.quickAccess')}</p>
          {ctaItems.map((item, i) => (
            <div key={item.to} className="overflow-hidden">
              <Link
                to={item.to}
                ref={(el) => {
                  linksRef.current[navItems.length + i] = el;
                }}
                className="group flex items-center gap-3 font-gambetta text-[clamp(2rem,4vw,4.5rem)] italic leading-none text-white/40 transition-all duration-300 hover:text-oro"
                data-cursor-hover="true"
                onClick={onClose}
              >
                <span className="-translate-x-2 text-base text-oro opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:text-xl">
                  →
                </span>
                {t(item.labelKey)}
              </Link>
            </div>
          ))}
          <div className="mt-6 h-px w-full bg-white/10" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-2">{t('menu.footerTagline')}</p>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8 md:bottom-10 md:left-10 text-[10px] tracking-[0.2em] opacity-30 uppercase">
        © {new Date().getFullYear()} {t('menu.copyright')}
      </div>
    </div>
  );
};

export default MenuOverlay;
