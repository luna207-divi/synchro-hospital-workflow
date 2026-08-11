import React from 'react';
import './Card.css';

/**
 * Enterprise Card Component
 */
export const Card = ({
  children,
  title,
  subtitle,
  badge = null,
  actions = null,
  footer = null,
  density = 'normal', // 'compact' | 'normal' | 'spacious'
  className = '',
  ...props
}) => {
  return (
    <div className={`ot-card-component density-${density} ${className}`} {...props}>
      {(title || badge || actions) && (
        <div className="card-header">
          <div className="card-title-group">
            <div className="card-title-row">
              {title && <h3 className="card-title">{title}</h3>}
              {badge}
            </div>
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}

      <div className="card-body">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};
