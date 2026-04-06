import React from 'react';
import { HIEROGLYPH_STRING } from '../data/hieroglyphs';

const HieroglyphMarquee = ({ className = '' }) => (
  <div
    className={`overflow-hidden border-y border-oro/25 bg-[#0c0c0c] py-3 ${className}`}
    role="presentation"
    aria-hidden="true"
  >
    <div className="hieroglyph-marquee flex w-max whitespace-nowrap font-hieroglyph text-[clamp(1.35rem,4.5vw,2.25rem)] leading-none tracking-[0.12em] text-oro/85">
      <span className="inline-block px-6">{HIEROGLYPH_STRING}</span>
      <span className="inline-block px-6">{HIEROGLYPH_STRING}</span>
    </div>
  </div>
);

export default HieroglyphMarquee;
