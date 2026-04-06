import React from 'react';
import { Link } from 'react-router-dom';
import MuseumPageLayout from '../components/MuseumPageLayout';
import HieroglyphMarquee from '../components/HieroglyphMarquee';
import MagneticBtn from '../components/MagneticBtn';
import MarqueeBtn from '../components/MarqueeBtn';
import MuseumLiveStatusCard from '../components/MuseumLiveStatusCard';
import { MUSEO_CONTATTI, MUSEO_MAP, ORARI_VISITA } from '../data/museoCopy';
import { useLanguage } from '../context/useLanguage';

export default function VisitaPage() {
  const { t } = useLanguage();
  const orariRows = t('pages.orariRows');
  const rows = Array.isArray(orariRows) ? orariRows : ORARI_VISITA;

  return (
    <MuseumPageLayout watermark={t('pages.visit.watermark')}>
      <section className="relative min-h-screen overflow-hidden pt-24">
        <div className="absolute inset-0">
          <img
            src="/nuova-ala.webp"
            alt=""
            className="h-full w-full scale-105 object-cover opacity-35 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-[1700px] flex-col justify-end px-6 pb-20 md:px-10 md:pb-28">
          <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.55em] text-oro" data-reveal>
            {t('pages.visit.eyebrow')}
          </p>
          <h1 className="font-gambetta leading-[0.9]" data-reveal>
            <span className="block text-[clamp(2.5rem,10vw,10rem)] text-white/90">{t('pages.visit.h1a')}</span>
            <span className="block text-[clamp(2.5rem,10vw,10rem)] italic text-oro">{t('pages.visit.h1b')}</span>
          </h1>
          <p className="mt-10 max-w-xl text-sm leading-relaxed text-white/50" data-reveal>
            {t('pages.visit.intro')}
          </p>
        </div>
      </section>

      <HieroglyphMarquee />

      <section className="mx-auto max-w-[1700px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-16 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-5" data-reveal>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.45em] text-oro">{t('pages.visit.orariTitle')}</p>
            <h2 className="font-gambetta text-[clamp(2rem,4vw,3.5rem)] leading-tight text-white">
              {t('pages.visit.h2Open')}
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-white/45">{t('pages.visit.orariNote')}</p>
          </div>
          <ul className="md:col-span-7 space-y-0 divide-y divide-white/10 border-y border-white/10" data-reveal>
            {rows.map((r) => (
              <li key={r.giorno} className="flex flex-col justify-between gap-2 py-6 sm:flex-row sm:items-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/40">{r.giorno}</span>
                <span className="font-gambetta text-2xl text-white/90 md:text-3xl">{r.fascia}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-16">
          <MuseumLiveStatusCard />
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0d0d0d] py-24 md:py-32">
        <div className="mx-auto max-w-[1700px] px-6 md:px-10">
          <div className="mb-12 md:mb-16" data-reveal>
            <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.45em] text-oro">{t('pages.visit.arriveEyebrow')}</p>
            <h2 className="font-gambetta text-[clamp(1.8rem,3.5vw,3rem)] text-white">{t('pages.visit.arriveH2')}</h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/45">{t('pages.visit.arriveBody')}</p>
          </div>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 lg:items-stretch">
            <div className="flex flex-col justify-between gap-10 lg:col-span-5" data-reveal>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/35">{t('pages.visit.addrLabel')}</p>
                <p className="mt-3 font-gambetta text-xl leading-snug text-white/90 md:text-2xl">
                  {MUSEO_CONTATTI.indirizzo}
                </p>
                <a
                  href={MUSEO_MAP.openInMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-oro transition-opacity hover:opacity-80"
                  data-cursor-hover="true"
                >
                  {t('pages.visit.mapsBtn')}
                  <span aria-hidden className="text-base leading-none">
                    ↗
                  </span>
                </a>
              </div>
              <div className="border-t border-white/10 pt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/35">{t('pages.visit.contacts')}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Tel. {MUSEO_CONTATTI.telefono}
                  <br />
                  {MUSEO_CONTATTI.email}
                </p>
              </div>
            </div>

            <div
              className="relative aspect-[16/10] min-h-[240px] w-full overflow-hidden rounded-tl-[48px] border border-white/10 bg-[#1a1a1a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] lg:col-span-7"
              data-reveal
            >
              <iframe
                title={t('pages.visit.mapTitle')}
                src={MUSEO_MAP.embedSrc}
                className="absolute inset-0 h-full w-full border-0 opacity-[0.97]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1700px] px-6 py-24 md:px-10 md:py-32">
        <div
          className="flex flex-col items-start justify-between gap-10 border border-white/10 bg-white/[0.02] p-10 md:flex-row md:items-center md:p-16"
          data-reveal
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.45em] text-oro">{t('pages.visit.ctaEyebrow')}</p>
            <p className="mt-4 max-w-md font-gambetta text-[clamp(1.5rem,3vw,2.25rem)] leading-tight text-white">
              {t('pages.visit.ctaText')}
            </p>
          </div>
          <MagneticBtn>
            <Link to="/biglietti" data-cursor-hover="true">
              <MarqueeBtn className="rounded-full border border-oro px-10 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-oro transition-colors hover:bg-oro hover:text-white">
                {t('pages.visit.ctaBtn')}
              </MarqueeBtn>
            </Link>
          </MagneticBtn>
        </div>
      </section>
    </MuseumPageLayout>
  );
}
