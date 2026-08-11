import React from 'react';
import './Button.css';

/**
 * SYNCHRO Button
 * 
 * @param {string} variant - primary|secondary|ghost|destructive
 * @param {string} size - xs|sm|md|lg
 * @param {React.ComponentType} icon - Lucide icon component
 */
export const Button = ({ 
  children, 
  variant = 'secondary', 
  size = 'md', 
  icon: Icon,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`synchro-btn btn-${variant} btn-${size} ${className}`} 
      type="button"
      {...props}
    >
      {Icon && <Icon size={size === 'xs' ? 12 : size === 'sm' ? 13 : 15} className="btn-icon" />}
      {children}
    </button>
  );
};
