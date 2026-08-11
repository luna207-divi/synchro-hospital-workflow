import React from 'react';
import './Badge.css';

/**
 * SYNCHRO Badge
 * 
 * Glassmorphic badge with status-color variants.
 * @param {string} variant - cyan|green|amber|red|blue|indigo|purple|teal|slate
 * @param {string} size - xs|sm|md
 * @param {boolean} dot - Show leading dot indicator
 */
export const Badge = ({ 
  children, 
  variant = 'slate', 
  size = 'sm', 
  dot = false,
  className = ''
}) => {
  return (
    <span className={`synchro-badge badge-${variant} badge-${size} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};
