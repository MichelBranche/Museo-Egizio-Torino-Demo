import React from 'react';
import { Link } from 'react-router-dom';
import MuseumPageLayout from '../components/MuseumPageLayout';
import HieroglyphMarquee from '../components/HieroglyphMarquee';
import MagneticBtn from '../components/MagneticBtn';
import MarqueeBtn from '../components/MarqueeBtn';
import { useLanguage } from '../context/useLanguage';

export default function IlMuseoPage() {
  const { t } = useLanguage();
  const numeri = [
    { valKey: 'pages.museum.n1v', labelKey: 'pages.museum.n1l' },
    { valKey: 'pages.museum.n2v', labelKey: 'pages.museum.n2l' },
    { valKey: 'pages.museum.n3v', labelKey: 'pages.museum.n3l' },
  ];

  return (
    <MuseumPageLayout watermark={t('pages.museum.watermark')}>
      <section className="relative min-h-screen overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src="/news_exhibit.png"
            alt=""
            className="h-full w-full object-cover opacity-30 grayscale"
          />
          <div className="absolute inset-0 bg-[#0a0a0a]/85" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1700px] flex-col justify-end px-6 pb-20 md:px-10 md:pb-28">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.55em] text-oro" data-reveal>
            {t('pages.museum.eyebrow')}
          </p>
          <h1 className="font-gambetta leading-[0.88]" data-reveal>
            <span className="block text-[clamp(2.2rem,9vw,9rem)] text-white/90">{t('pages.museum.h1a')}</span>
            <span className="block text-[clamp(2.2rem,9vw,9rem)] italic text-oro">{t('pages.museum.h1b')}</span>
          </h1>
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/50" data-reveal>
            {t('pages.museum.intro')}
          </p>
        </div>
      </section>

      <HieroglyphMarquee />

      <section className="mx-auto max-w-[1700px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <div data-reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-oro">{t('pages.museum.idEyebrow')}</p>
            <h2 className="mt-4 font-gambetta text-[clamp(1.8rem,3.5vw,3rem)] leading-tight text-white">
              {t('pages.museum.idH2')}
            </h2>
            <p className="mt-8 text-sm leading-relaxed text-white/45">{t('pages.museum.idBody')}</p>
          </div>
          <div className="space-y-6 border-l border-white/10 pl-8 md:pl-12" data-reveal>
            {numeri.map((n) => (
              <div key={n.labelKey} className="border-b border-white/5 pb-8 last:border-0">
                <p className="font-gambetta text-[clamp(2.5rem,6vw,4rem)] leading-none text-oro">{t(n.valKey)}</p>
                <p className="mt-3 text-sm text-white/40">{t(n.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0d0d0d] py-24 md:py-32">
        <div className="mx-auto grid max-w-[1700px] gap-12 px-6 md:grid-cols-12 md:gap-10 md:px-10">
          <div className="overflow-hidden rounded-br-[100px] md:col-span-5" data-reveal>
            <img
              src="/nuova-ala.webp"
              alt="Nuova Ala"
              className="h-full min-h-[320px] w-full object-cover grayscale transition-all duration-1000 hover:grayscale-0"
            />
          </div>
          <div className="flex flex-col justify-center md:col-span-6 md:col-start-7" data-reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-oro">{t('pages.museum.archEyebrow')}</p>
            <h3 className="mt-4 font-gambetta text-[clamp(1.6rem,3vw,2.5rem)] leading-tight text-white">
              {t('pages.museum.archH3')}
            </h3>
            <p className="mt-6 text-sm leading-relaxed text-white/45">{t('pages.museum.archBody')}</p>
            <div className="mt-10">
              <MagneticBtn>
                <Link to="/visita" data-cursor-hover="true">
                  <MarqueeBtn className="rounded-full border border-white/20 px-8 py-3 text-[10px] font-bold uppercase tracking-[0.25em] text-white/80 transition-colors hover:border-oro hover:text-oro">
                    {t('pages.museum.archBtn')}
                  </MarqueeBtn>
                </Link>
              </MagneticBtn>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1700px] px-6 py-24 md:px-10 md:py-32">
        <div
          className="border border-oro/25 bg-oro/[0.04] p-10 text-center md:p-16"
          data-reveal
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-oro">{t('pages.museum.supportEyebrow')}</p>
          <p className="mx-auto mt-6 max-w-2xl font-gambetta text-[clamp(1.4rem,2.8vw,2rem)] leading-snug text-white/85">
            {t('pages.museum.supportBody')}
          </p>
          <MagneticBtn>
            <a
              href="https://www.museoegizio.it/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-block"
              data-cursor-hover="true"
            >
              <MarqueeBtn className="rounded-full bg-oro px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#0a0a0a] transition-colors hover:bg-white">
                museoegizio.it
              </MarqueeBtn>
            </a>
          </MagneticBtn>
        </div>
      </section>
    </MuseumPageLayout>
  );
}
