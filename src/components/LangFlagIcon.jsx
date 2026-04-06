import React from 'react';
import { IT, GB, FR, ES, JP, CN, DE } from 'country-flag-icons/react/3x2';

/** Mappa codice lingua UI → bandiera (SVG, ok anche su Windows dove le emoji diventano IT/GB…). */
const FLAG_BY_LANG = {
  it: IT,
  en: GB,
  fr: FR,
  es: ES,
  ja: JP,
  zh: CN,
  de: DE,
};

const flagClass =
  'block h-[1.125rem] w-[1.6875rem] shrink-0 overflow-hidden rounded-[2px] shadow-sm md:h-[1.375rem] md:w-[2.0625rem]';

/**
 * @param {{ langCode: string; className?: string }} props
 */
export default function LangFlagIcon({ langCode, className = '' }) {
  const Flag = FLAG_BY_LANG[langCode] ?? IT;
  return <Flag className={`${flagClass} ${className}`.trim()} aria-hidden />;
}
