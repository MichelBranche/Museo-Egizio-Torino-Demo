import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../context/useLanguage';
import LangFlagIcon from './LangFlagIcon';

/**
 * @param {'dark' | 'light'} variant — dark: header su sfondo nero; light: testo inchiostro (header chiaro)
 */
export default function LanguageSwitcher({ variant = 'dark' }) {
  const { lang, setLang, langOptions } = useLanguage();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const current = langOptions.find((o) => o.code === lang) ?? langOptions[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const baseBtn =
    variant === 'dark'
      ? 'border-white/25 text-white hover:bg-white/10 hover:border-white/40'
      : 'border-inchiostro/25 text-inchiostro hover:bg-inchiostro/5 hover:border-inchiostro/40';

  const panel =
    variant === 'dark'
      ? 'border-white/15 bg-black/90 text-white shadow-xl backdrop-blur-md'
      : 'border-inchiostro/15 bg-papiro text-inchiostro shadow-xl backdrop-blur-md';

  const itemActive = variant === 'dark' ? 'bg-white/15' : 'bg-inchiostro/10';
  const itemHover = variant === 'dark' ? 'hover:bg-white/10' : 'hover:bg-inchiostro/5';

  return (
    <div ref={rootRef} className="relative z-50">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${current.label} — change language`}
        title={current.label}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-1.5 transition-colors md:px-2.5 md:py-2 ${baseBtn}`}
        data-cursor-hover="true"
      >
        <LangFlagIcon langCode={current.code} />
        <span className="sr-only">{current.label}</span>
        <span className="px-0.5 text-[9px] leading-none opacity-60" aria-hidden>
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Choose language"
          className={`absolute right-0 top-[calc(100%+6px)] min-w-[3.25rem] overflow-hidden rounded-xl border py-1.5 ${panel}`}
        >
          {langOptions.map((opt) => (
            <li key={opt.code} role="option" aria-selected={opt.code === lang}>
              <button
                type="button"
                title={opt.label}
                aria-label={opt.label}
                className={`flex w-full items-center justify-center px-2 py-2 transition-colors ${itemHover} ${
                  opt.code === lang ? itemActive : ''
                }`}
                onClick={() => {
                  setLang(opt.code);
                  setOpen(false);
                }}
              >
                <LangFlagIcon langCode={opt.code} className="!h-7 !w-[2.625rem] md:!h-8 md:!w-12" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
