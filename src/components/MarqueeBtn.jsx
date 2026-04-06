import React from 'react';

const MarqueeBtn = ({ children, className, ...props }) => (
  <button type="button" className={`marquee-btn ${className ?? ''}`} data-cursor-hover="true" {...props}>
    <div className="marquee-btn-text top">{children}</div>
    <div className="marquee-btn-text bottom absolute top-full left-0 w-full text-oro">{children}</div>
  </button>
);

export default MarqueeBtn;
