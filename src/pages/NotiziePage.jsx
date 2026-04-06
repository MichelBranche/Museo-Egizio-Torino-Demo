import React from 'react';
import MuseumPageLayout from '../components/MuseumPageLayout';
import HieroglyphMarquee from '../components/HieroglyphMarquee';
import MagneticBtn from '../components/MagneticBtn';
import MarqueeBtn from '../components/MarqueeBtn';
import { useLanguage } from '../context/useLanguage';

export default function NotiziePage() {
  const { t } = useLanguage();
  const items = [
    {
      id: '1',
      categoria: 'pages.news.n1cat',
      titolo: 'pages.news.n1title',
      estratto: 'pages.news.n1ex',
      data: 'pages.news.n1date',
      immagine: '/news_exhibit.png',
    },
    {
      id: '2',
      categoria: 'pages.news.n2cat',
      titolo: 'pages.news.n2title',
      estratto: 'pages.news.n2ex',
      data: 'pages.news.n2date',
      immagine: '/news_papyrus.png',
    },
    {
      id: '3',
      categoria: 'pages.news.n3cat',
      titolo: 'pages.news.n3title',
      estratto: 'pages.news.n3ex',
      data: 'pages.news.n3date',
      immagine: '/nuova-ala.webp',
    },
  ];

  return (
    <MuseumPageLayout watermark={t('pages.news.watermark')}>
      <section className="relative min-h-[70vh] overflow-hidden pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1510_0%,_#0a0a0a_55%)]" />
        <div className="relative z-10 mx-auto flex max-w-[1700px] flex-col justify-end px-6 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.55em] text-oro" data-reveal>
            {t('pages.news.eyebrow')}
          </p>
          <h1 className="font-gambetta leading-[0.9]" data-reveal>
            <span className="block text-[clamp(2.5rem,9vw,8rem)] text-white/90">{t('pages.news.h1a')}</span>
            <span className="block text-[clamp(2.5rem,9vw,8rem)] italic text-oro">{t('pages.news.h1b')}</span>
          </h1>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-white/50" data-reveal>
            {t('pages.news.intro')}
          </p>
        </div>
      </section>

      <HieroglyphMarquee />

      <section className="mx-auto max-w-[1700px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {items.map((n, i) => (
            <article
              key={n.id}
              className={`group md:col-span-4 ${i === 1 ? 'md:mt-16' : ''}`}
              data-reveal
            >
              <a
                href="https://www.museoegizio.it/"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-cursor-hover="true"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[80px] border border-white/10">
                  <img
                    src={n.immagine}
                    alt=""
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.35em] text-oro">{t(n.categoria)}</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.25em] text-white/35">{t(n.data)}</p>
                <h2 className="mt-4 font-gambetta text-2xl leading-tight text-white transition-colors group-hover:text-oro md:text-3xl">
                  {t(n.titolo)}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-white/45">{t(n.estratto)}</p>
                <span className="mt-6 inline-block text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 group-hover:text-oro">
                  {t('pages.news.readMore')}
                </span>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-20 flex justify-center md:mt-28" data-reveal>
          <MagneticBtn>
            <a
              href="https://www.museoegizio.it/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover="true"
            >
              <MarqueeBtn className="rounded-full border border-white/20 px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/70 transition-colors hover:border-oro hover:text-oro">
                {t('pages.news.ctaBtn')}
              </MarqueeBtn>
            </a>
          </MagneticBtn>
        </div>
      </section>
    </MuseumPageLayout>
  );
}
