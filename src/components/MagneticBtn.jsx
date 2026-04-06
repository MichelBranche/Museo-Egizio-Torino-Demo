import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MagneticBtn = ({ children, className, ...props }) => {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    
    // Ottimizzazione estrema con quickTo per l'effetto magnete
    const xTo = gsap.quickTo(btn, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(btn, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // La "forza magnetica" pull elements based on mouse distance
      xTo(x * 0.4); 
      yTo(y * 0.4);
    };

    const handleMouseLeave = () => {
      // Revert al centro con un balzo elastico
      xTo(0);
      yTo(0);
    };

    btn.addEventListener("mousemove", handleMouseMove);
    btn.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      btn.removeEventListener("mousemove", handleMouseMove);
      btn.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={btnRef} className="inline-block" style={{ willChange: "transform" }}>
      <div {...props} className={className}>
        {children}
      </div>
    </div>
  );
};

export default MagneticBtn;
