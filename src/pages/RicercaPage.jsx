import React from 'react';
import MuseumPageLayout from '../components/MuseumPageLayout';
import HieroglyphMarquee from '../components/HieroglyphMarquee';
import { useLanguage } from '../context/useLanguage';

export default function RicercaPage() {
  const { t } = useLanguage();
  const blocks = [
    { titleKey: 'pages.research.b1t', textKey: 'pages.research.b1x' },
    { titleKey: 'pages.research.b2t', textKey: 'pages.research.b2x' },
    { titleKey: 'pages.research.b3t', textKey: 'pages.research.b3x' },
  ];

  return (
    <MuseumPageLayout watermark={t('pages.research.watermark')}>
      <section className="relative min-h-screen overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src="/membership_statue.png"
            alt=""
            className="h-full w-full object-cover opacity-25 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1700px] flex-col justify-center px-6 pb-20 pt-12 md:px-10 md:pb-28">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.55em] text-oro" data-reveal>
            {t('pages.research.eyebrow')}
          </p>
          <h1 className="max-w-4xl font-gambetta leading-[0.9]" data-reveal>
            <span className="block text-[clamp(2.2rem,8vw,7rem)] text-white/90">{t('pages.research.h1a')}</span>
            <span className="block text-[clamp(2.2rem,8vw,7rem)] italic text-oro">{t('pages.research.h1b')}</span>
          </h1>
          <p className="mt-12 max-w-2xl text-sm leading-relaxed text-white/50" data-reveal>
            {t('pages.research.intro')}
          </p>
        </div>
      </section>

      <HieroglyphMarquee />

      <section className="mx-auto max-w-[1700px] px-6 py-24 md:px-10 md:py-32">
        <div className="mb-20 md:mb-28" data-reveal>
          <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-oro">{t('pages.research.missionEyebrow')}</p>
          <h2 className="mt-4 font-gambetta text-[clamp(1.8rem,4vw,3.5rem)] leading-tight text-white">
            {t('pages.research.missionH2')}
          </h2>
          <p className="mt-8 max-w-3xl text-sm leading-relaxed text-white/45">{t('pages.research.missionBody')}</p>
        </div>

        <div className="grid gap-px bg-white/10 md:grid-cols-3">
          {blocks.map((b, i) => (
            <article key={b.titleKey} className="bg-[#0a0a0a] p-10 md:p-12" data-reveal>
              <span className="font-gambetta text-4xl text-white/[0.07]">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-6 font-gambetta text-2xl text-oro">{t(b.titleKey)}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/45">{t(b.textKey)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1700px] px-6 md:px-10">
          <div
            className="relative overflow-hidden rounded-tr-[120px] border border-white/10 bg-[#0d0d0d] p-10 md:p-16"
            data-reveal
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-oro">{t('pages.research.scholarsEyebrow')}</p>
            <p className="mt-6 max-w-2xl font-gambetta text-[clamp(1.4rem,2.5vw,2rem)] leading-snug text-white/80">
              {t('pages.research.scholarsBody')}
            </p>
          </div>
        </div>
      </section>
    </MuseumPageLayout>
  );
}
