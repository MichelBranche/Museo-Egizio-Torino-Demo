import { getMinuteOfDayInRome, getWeekdayInRome } from './museumHours';

/**
 * Stima indicativa affluenza (Google non espone il numero di visitatori in tempo reale via API pubblica).
 * Heuristica: weekend e fasce centrali della giornata → più affollato.
 * @returns {{ level: 'low' | 'moderate' | 'busy', score: number }}
 */
export function getEstimatedCrowdLevel(now = new Date()) {
  const day = getWeekdayInRome(now);
  const mod = getMinuteOfDayInRome(now);
  let score = 25;

  if (day === 0 || day === 6) score += 28;
  if (day >= 2 && day <= 5) score += 8;

  if (mod >= 10 * 60 && mod <= 12 * 60) score += 22;
  if (mod > 12 * 60 && mod <= 16 * 60) score += 30;
  if (mod > 16 * 60 && mod <= 19 * 60) score += 18;

  if (mod < 9 * 60 || mod >= 19 * 60) score -= 15;

  score = Math.max(0, Math.min(100, score));

  let level = 'low';
  if (score >= 45) level = 'moderate';
  if (score >= 72) level = 'busy';

  return { level, score };
}
