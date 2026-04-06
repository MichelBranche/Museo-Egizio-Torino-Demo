/** Orari demo allineati a `ORARI_VISITA` / `orariRows` (Europe/Rome). */

export const MUSEO_TIMEZONE = 'Europe/Rome';

/** Minuti dalla mezzanotte a Torino */
export function getMinuteOfDayInRome(date = new Date()) {
  const f = new Intl.DateTimeFormat('en-GB', {
    timeZone: MUSEO_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  const parts = f.formatToParts(date);
  const h = Number(parts.find((p) => p.type === 'hour').value);
  const m = Number(parts.find((p) => p.type === 'minute').value);
  return h * 60 + m;
}

/** 0 = domenica … 6 = sabato (fuso orario di Torino) */
export function getWeekdayInRome(date = new Date()) {
  const wd = new Intl.DateTimeFormat('en-US', {
    timeZone: MUSEO_TIMEZONE,
    weekday: 'short',
  }).format(date);
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[wd] ?? 0;
}

/** Fascia giornaliera in minuti [open, close) — close è primo minuto chiuso */
function dayIntervalMinutes(day) {
  if (day === 1) return { open: 9 * 60, close: 14 * 60 };
  if (day >= 2 && day <= 5) return { open: 9 * 60, close: 18 * 60 + 30 };
  if (day === 6) return { open: 9 * 60, close: 20 * 60 };
  if (day === 0) return { open: 9 * 60, close: 18 * 60 + 30 };
  return { open: 9 * 60, close: 14 * 60 };
}

function formatHM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}:${String(m).padStart(2, '0')}`;
}

/**
 * @returns {{
 *   isOpen: boolean,
 *   closesAtHM: string | null,
 *   opensSameDayHM: string | null,
 *   closedAfterTodaysHours: boolean,
 * }}
 */
export function getMuseumLocalStatus(now = new Date()) {
  const day = getWeekdayInRome(now);
  const mod = getMinuteOfDayInRome(now);
  const { open, close } = dayIntervalMinutes(day);
  const isOpen = mod >= open && mod < close;

  if (isOpen) {
    return {
      isOpen: true,
      closesAtHM: formatHM(close),
      opensSameDayHM: null,
      closedAfterTodaysHours: false,
    };
  }
  if (mod < open) {
    return {
      isOpen: false,
      closesAtHM: null,
      opensSameDayHM: formatHM(open),
      closedAfterTodaysHours: false,
    };
  }
  return {
    isOpen: false,
    closesAtHM: null,
    opensSameDayHM: null,
    closedAfterTodaysHours: true,
  };
}
