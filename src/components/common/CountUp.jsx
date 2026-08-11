import React, { useState, useEffect } from 'react';

/**
 * SYNCHRO CountUp
 * Smooth animated number counting for clinical metrics
 */
export const CountUp = ({ end, decimals = 0, suffix = '', duration = 1200 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const target = typeof end === 'number' ? end : parseFloat(end);

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing out cubic curve for smooth decelerating counter
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(easeProgress * target);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span className="font-mono">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};
