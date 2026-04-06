import React, { useEffect, useMemo, useRef, useState } from 'react';
import { parseStatValueText } from '../utils/parseStatValue';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Mostra 0 e anima fino al valore in `valueText` quando il blocco entra nel viewport.
 * Usa `key` sul parent se il testo cambia (es. lingua) per resettare lo stato.
 */
export default function StatCounter({ valueText, className = '' }) {
  const { target, suffix } = useMemo(() => parseStatValueText(valueText), [valueText]);
  const [display, setDisplay] = useState(0);
  const [run, setRun] = useState(false);
  const rootRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (reduced) {
          setDisplay(target);
          return;
        }
        setRun(true);
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, valueText]);

  useEffect(() => {
    if (!run) return undefined;

    const duration = 2000;
    const t0 = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = easeOutCubic(p);
      const v = target * eased;
      setDisplay(Number.isInteger(target) ? Math.round(v) : Math.round(v * 10) / 10);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplay(target);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [run, target]);

  return (
    <span ref={rootRef} className={className} aria-label={`${target}${suffix}`}>
      {display}
      {suffix}
    </span>
  );
}
