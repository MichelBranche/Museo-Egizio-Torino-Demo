import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/** Desktop / mouse: cursore custom. Touch / mobile: niente (inutile e nessun mousemove). */
function useFinePointerHover() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setActive(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return active;
}

const Cursor = () => {
  const active = useFinePointerHover();
  const cursorRef = useRef(null);

  useEffect(() => {
    if (!active || !cursorRef.current) return undefined;

    // Risolve il problema "sgranato":
    // Impostiamo il cursore a 100px nativamente nel CSS (evita pixel del raster),
    // di default è scalato a 0.15. Quando si ingrandisce, torna a scale: 1 (alta definizione).
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, scale: 0.15 });

    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.2, ease: 'power3' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.2, ease: 'power3' });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    const handleInteractableEnter = () => {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };
    const handleInteractableLeave = () => {
      gsap.to(cursorRef.current, { scale: 0.15, duration: 0.3, ease: 'power2.out' });
    };

    let interactables = [];
    const t = setTimeout(() => {
      interactables = [...document.querySelectorAll('[data-cursor-hover="true"]')];
      interactables.forEach((el) => {
        el.addEventListener('mouseenter', handleInteractableEnter);
        el.addEventListener('mouseleave', handleInteractableLeave);
      });
    }, 1000);

    return () => {
      clearTimeout(t);
      window.removeEventListener('mousemove', moveCursor);
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', handleInteractableEnter);
        el.removeEventListener('mouseleave', handleInteractableLeave);
      });
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[100px] w-[100px] rounded-full bg-white mix-blend-difference will-change-transform"
    />
  );
};

export default Cursor;
