import React, { useEffect, useMemo, useState } from 'react';
import { fetchPlaceOpeningSnapshot } from '../lib/googlePlacesOpening';
import { getEstimatedCrowdLevel } from '../lib/museumCrowdEstimate';
import { getMuseumLocalStatus } from '../lib/museumHours';
import { MUSEO_MAP } from '../data/museoCopy';
import { useLanguage } from '../context/useLanguage';

function formatIsoInLocale(iso, lang) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(lang === 'it' ? 'it-IT' : lang === 'zh' ? 'zh-CN' : 'en-GB', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome',
    }).format(d);
  } catch {
    return iso;
  }
}

/**
 * @param {{ variant?: 'dark' | 'light' | 'plan', className?: string }} props
 * — `light`: box chiaro (Visita alternativa); `plan`: fusione griglia Pianifica home (parent con `group hover:bg-inchiostro`);
 * — `dark` default (Visita).
 */
export default function MuseumLiveStatusCard({ variant = 'dark', className = '' }) {
  const { t, lang } = useLanguage();
  const light = variant === 'light';
  const plan = variant === 'plan';
  const [tick, setTick] = useState(0);
  const [googleSnap, setGoogleSnap] = useState(null);
  const [googleErr, setGoogleErr] = useState(false);

  const local = useMemo(() => getMuseumLocalStatus(new Date()), [tick]);
  const crowd = useMemo(() => getEstimatedCrowdLevel(new Date()), [tick]);

  const placeId = import.meta.env.VITE_GOOGLE_PLACE_ID || '';
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || '';

  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!placeId || !apiKey) {
      setGoogleSnap(null);
      setGoogleErr(false);
      return undefined;
    }
    let cancelled = false;
    setGoogleErr(false);
    fetchPlaceOpeningSnapshot(placeId, apiKey)
      .then((snap) => {
        if (!cancelled) setGoogleSnap(snap);
      })
      .catch(() => {
        if (!cancelled) setGoogleErr(true);
      });
    return () => {
      cancelled = true;
    };
  }, [placeId, apiKey, tick]);

  const crowdLabelKey =
    crowd.level === 'low'
      ? 'pages.visit.crowdLow'
      : crowd.level === 'moderate'
        ? 'pages.visit.crowdModerate'
        : 'pages.visit.crowdBusy';

  const shell = plan
    ? `rounded-none border-0 bg-transparent p-0 shadow-none ${className}`
    : light
      ? `rounded-2xl border border-inchiostro/15 bg-inchiostro/[0.04] p-6 md:p-8 ${className}`
      : `mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm md:p-8 ${className}`;

  const labelMuted = plan
    ? 'text-inchiostro/50 group-hover:text-papiro/55'
    : light
      ? 'text-inchiostro/45'
      : 'text-white/40';
  const headline = plan
    ? 'text-inchiostro group-hover:text-papiro'
    : light
      ? 'text-inchiostro'
      : 'text-white';
  const sub = plan
    ? 'text-inchiostro/65 group-hover:text-papiro/75'
    : light
      ? 'text-inchiostro/60'
      : 'text-white/55';
  const googleBody = plan
    ? 'text-inchiostro/75 group-hover:text-papiro/80'
    : light
      ? 'text-inchiostro/70'
      : 'text-white/70';
  const googleHead = plan
    ? 'text-inchiostro group-hover:text-papiro'
    : light
      ? 'text-inchiostro'
      : 'text-white/90';
  const err = plan
    ? 'text-amber-800 group-hover:text-amber-200'
    : light
      ? 'text-amber-800'
      : 'text-amber-200/80';
  const loadingMuted = plan
    ? 'text-inchiostro/50 group-hover:text-papiro/60'
    : light
      ? 'text-inchiostro/45'
      : 'text-white/45';
  const foot = plan
    ? 'text-inchiostro/55 group-hover:text-papiro/65'
    : light
      ? 'text-inchiostro/55'
      : 'text-white/50';
  const note = plan
    ? 'text-inchiostro/45 group-hover:text-papiro/50'
    : light
      ? 'text-inchiostro/40'
      : 'text-white/40';

  const eyebrowClass = plan
    ? 'text-oro text-xs uppercase tracking-[0.4em] font-bold mb-6 md:mb-8'
    : 'text-[10px] font-bold uppercase tracking-[0.45em] text-oro';

  const gridClass = plan
    ? 'mt-0 grid gap-8 border-t border-inchiostro pt-8 md:grid-cols-3 md:gap-10 md:pt-10 group-hover:border-papiro/25'
    : 'mt-6 grid gap-8 md:grid-cols-3 md:gap-6';

  const colTitleClass = plan
    ? 'text-xs font-bold uppercase tracking-[0.35em] text-inchiostro/50 group-hover:text-papiro/55'
    : `text-[10px] font-bold uppercase tracking-[0.35em] ${labelMuted}`;

  const headlineSize = plan ? 'mt-4 font-gambetta text-[clamp(1.75rem,4vw,2.75rem)] leading-tight md:mt-5' : 'mt-3 font-gambetta text-3xl md:text-4xl';

  return (
    <div className={shell.trim()} data-reveal>
      <p className={eyebrowClass}>{t('pages.visit.liveEyebrow')}</p>

      <div className={gridClass}>
        <div>
          <p className={colTitleClass}>{t('pages.visit.liveLocalTitle')}</p>
          <p className={`${headlineSize} ${headline}`}>
            {local.isOpen ? t('pages.visit.openNow') : t('pages.visit.closedNow')}
          </p>
          <p className={`mt-2 text-sm ${sub}`}>
            {local.isOpen && local.closesAtHM
              ? t('pages.visit.closesAt').replace('{time}', local.closesAtHM)
              : null}
            {!local.isOpen && local.opensSameDayHM
              ? t('pages.visit.opensAt').replace('{time}', local.opensSameDayHM)
              : null}
            {!local.isOpen && local.closedAfterTodaysHours ? t('pages.visit.closedRestDay') : null}
          </p>
        </div>

        <div>
          <p className={colTitleClass}>{t('pages.visit.googleTitle')}</p>
          {!placeId || !apiKey ? (
            <p className={`mt-3 text-sm leading-relaxed ${loadingMuted}`}>{t('pages.visit.googleUnavailable')}</p>
          ) : googleErr ? (
            <p className={`mt-3 text-sm ${err}`}>{t('pages.visit.googleError')}</p>
          ) : googleSnap ? (
            <div className={`mt-3 space-y-2 text-sm ${googleBody}`}>
              <p className={`font-gambetta text-2xl ${plan ? 'md:text-3xl' : ''} ${googleHead}`}>
                {googleSnap.openNow === true
                  ? t('pages.visit.googleOpen')
                  : googleSnap.openNow === false
                    ? t('pages.visit.googleClosed')
                    : '—'}
              </p>
              {googleSnap.nextCloseTime ? (
                <p>{t('pages.visit.googleNextClose').replace('{time}', formatIsoInLocale(googleSnap.nextCloseTime, lang))}</p>
              ) : null}
              {googleSnap.nextOpenTime ? (
                <p>{t('pages.visit.googleNextOpen').replace('{time}', formatIsoInLocale(googleSnap.nextOpenTime, lang))}</p>
              ) : null}
            </div>
          ) : (
            <p className={`mt-3 text-sm ${loadingMuted}`}>…</p>
          )}
        </div>

        <div>
          <p className={colTitleClass}>{t('pages.visit.crowdTitle')}</p>
          <p
            className={
              plan
                ? 'mt-4 font-gambetta text-[clamp(1.75rem,4vw,2.75rem)] text-oro group-hover:text-oro md:mt-5'
                : 'mt-3 font-gambetta text-3xl text-oro md:text-4xl'
            }
          >
            {t(crowdLabelKey)}
          </p>
          <p className={`mt-2 text-sm ${foot}`}>{t('pages.visit.crowdFoot')}</p>
          <p className={`mt-4 text-xs leading-relaxed ${note}`}>{t('pages.visit.mapsLiveNote')}</p>
          <a
            href={MUSEO_MAP.openInMaps}
            target="_blank"
            rel="noopener noreferrer"
            className={
              plan
                ? 'mt-4 inline-flex text-[10px] font-bold uppercase tracking-[0.35em] text-oro underline-offset-4 transition-opacity hover:opacity-80 group-hover:text-oro'
                : 'mt-3 inline-flex text-[10px] font-bold uppercase tracking-[0.35em] text-oro hover:opacity-80'
            }
            data-cursor-hover="true"
          >
            {t('pages.visit.mapsBusyLink')} ↗
          </a>
        </div>
      </div>
    </div>
  );
}
