import React, { useMemo, useState } from 'react';
import HomeLink from './HomeLink';
import { useLanguage } from '../context/useLanguage';

const PRICES = { intero: 18, ridotto: 15, audioguide: 5 };

function Stepper({ label, sub, value, onChange, min = 0, max = 10 }) {
  const { t } = useLanguage();
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-4 last:border-b-0">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-white">{label}</p>
        {sub && <p className="mt-0.5 text-xs text-white/40">{sub}</p>}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg text-white transition-colors hover:border-oro hover:bg-oro hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`${t('pages.booking.dec')} ${label}`}
          data-cursor-hover="true"
        >
          −
        </button>
        <span className="min-w-[2rem] text-center font-gambetta text-2xl tabular-nums text-white">{value}</span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg text-white transition-colors hover:border-oro hover:bg-oro hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`${t('pages.booking.inc')} ${label}`}
          data-cursor-hover="true"
        >
          +
        </button>
      </div>
    </div>
  );
}

const AcquistaBigliettiSection = ({ onBack, variant = 'overlay' }) => {
  const { t } = useLanguage();
  const isPage = variant === 'page';

  const timeSlots = useMemo(
    () => [
      { id: 'm1', label: t('pages.booking.slotM1') },
      { id: 'm2', label: t('pages.booking.slotM2') },
      { id: 'p1', label: t('pages.booking.slotP1') },
      { id: 'p2', label: t('pages.booking.slotP2') },
    ],
    [t]
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  }, []);

  const [visitDate, setVisitDate] = useState('');
  const [slotId, setSlotId] = useState('m1');
  const [qtyIntero, setQtyIntero] = useState(1);
  const [qtyRidotto, setQtyRidotto] = useState(0);
  const [audioguide, setAudioguide] = useState(false);
  const [phase, setPhase] = useState('form');

  const ticketsTotal = qtyIntero + qtyRidotto;
  const subtotal =
    qtyIntero * PRICES.intero +
    qtyRidotto * PRICES.ridotto +
    (audioguide ? ticketsTotal * PRICES.audioguide : 0);

  const canSubmit = visitDate && ticketsTotal > 0;

  const handleConfirm = () => {
    if (!canSubmit) return;
    setPhase('success');
  };

  const interoLabel = t('pages.booking.intero');
  const ridottoLabel = t('pages.booking.ridotto');
  const interoSub = `${PRICES.intero}€ · ${t('pages.booking.interoSub')}`;
  const ridottoSub = `${PRICES.ridotto}€ · ${t('pages.booking.ridottoSub')}`;
  const audioSub = `+${PRICES.audioguide}€ ${t('pages.booking.audioSub')}`;

  if (phase === 'success') {
    const slotLabel = timeSlots.find((s) => s.id === slotId)?.label ?? '';
    const parts = [];
    if (qtyIntero > 0) parts.push(`${qtyIntero} ${t('pages.booking.interoN')}`);
    if (qtyRidotto > 0) parts.push(`${qtyRidotto} ${t('pages.booking.ridottoN')}`);
    const ticketSummary = parts.join(' · ');

    return (
      <div className="flex min-h-[50vh] flex-col justify-center pb-8">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.35em] text-oro">{t('pages.booking.demo')}</p>
        <h3 className="mb-4 font-gambetta text-3xl italic leading-tight text-white md:text-4xl">
          {t('pages.booking.successTitle')}
        </h3>
        <p className="mb-8 text-sm leading-relaxed text-white/50">{t('pages.booking.successBody')}</p>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm">
          <p className="flex justify-between gap-4">
            <span className="text-white/40">{t('pages.booking.date')}</span>
            <span className="font-medium text-white">{visitDate}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-white/40">{t('pages.booking.slot')}</span>
            <span className="text-right font-medium text-white">{slotLabel}</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-white/40">{t('pages.booking.tickets')}</span>
            <span className="font-medium text-white">{ticketSummary}</span>
          </p>
          <p className="flex justify-between gap-4 border-t border-white/10 pt-3 font-gambetta text-xl text-oro">
            <span>{t('pages.booking.total')}</span>
            <span>{subtotal}€</span>
          </p>
        </div>
        {isPage ? (
          <HomeLink
            className="mt-10 flex w-full items-center justify-center rounded-full border border-oro bg-oro py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-oro/80"
            data-cursor-hover="true"
          >
            {t('pages.booking.backSite')}
          </HomeLink>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="mt-10 w-full rounded-full border border-oro bg-oro py-4 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-oro/80"
            data-cursor-hover="true"
          >
            {t('pages.booking.backTickets')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {!isPage && (
        <>
          <button
            type="button"
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/40 transition-colors hover:text-white"
            data-cursor-hover="true"
          >
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
            {t('pages.booking.back')}
          </button>
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-oro">{t('pages.booking.eyebrow')}</p>
          <h3 className="mb-2 font-gambetta text-3xl italic leading-none text-white md:text-4xl">{t('pages.booking.title')}</h3>
          <p className="mb-8 text-sm leading-relaxed text-white/50">{t('pages.booking.intro')}</p>
        </>
      )}

      <div className="mb-6">
        <label htmlFor="visit-date" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          {t('pages.booking.labelDate')}
        </label>
        <input
          id="visit-date"
          type="date"
          min={today}
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-medium text-white outline-none transition-[box-shadow,border-color] placeholder:text-white/30 focus:border-oro focus:ring-2 focus:ring-oro/25 [color-scheme:dark]"
        />
      </div>

      <div className="mb-6">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
          {t('pages.booking.labelSlot')}
        </span>
        <div className="grid gap-2">
          {timeSlots.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSlotId(s.id)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                slotId === s.id
                  ? 'border-oro bg-oro/10 text-ore text-white'
                  : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/25 hover:text-white'
              }`}
              data-cursor-hover="true"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] px-1">
        <Stepper label={interoLabel} sub={interoSub} value={qtyIntero} onChange={setQtyIntero} min={0} max={10} />
        <Stepper label={ridottoLabel} sub={ridottoSub} value={qtyRidotto} onChange={setQtyRidotto} min={0} max={10} />
      </div>

      <label className="mb-8 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-oro/40">
        <input
          type="checkbox"
          checked={audioguide}
          onChange={(e) => setAudioguide(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-white/30 bg-transparent text-oro accent-[#C9A84C] focus:ring-oro/40"
        />
        <span>
          <span className="block text-sm font-bold uppercase tracking-widest text-white">{t('pages.booking.audio')}</span>
          <span className="mt-1 block text-xs text-white/40">{audioSub}</span>
        </span>
      </label>

      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{t('pages.booking.totalLabel')}</span>
          <span className="font-gambetta text-3xl text-oro tabular-nums">{subtotal}€</span>
        </div>
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleConfirm}
          className="w-full rounded-full border border-oro bg-oro py-4 text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:bg-oro/80 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-white/30"
          data-cursor-hover="true"
        >
          {t('pages.booking.cta')}
        </button>
        {!canSubmit && (
          <p className="mt-3 text-center text-[10px] text-white/30">{t('pages.booking.hint')}</p>
        )}
      </div>
    </div>
  );
};

export default AcquistaBigliettiSection;
