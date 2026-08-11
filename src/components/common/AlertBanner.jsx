import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import './AlertBanner.css';

/**
 * Enterprise Alert Banner Component
 * Severities: 'critical' (Red) | 'warning' (Amber) | 'info' (Blue) | 'success' (Teal)
 */
export const AlertBanner = ({
  title,
  message,
  severity = 'warning',
  pillar = 'ai',
  timestamp = 'Just now',
  actionLabel = null,
  onAction = null,
  onDismiss = null,
  className = ''
}) => {
  const getSeverityIcon = () => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={16} className="icon-critical" />;
      case 'warning':
        return <AlertTriangle size={16} className="icon-warning" />;
      case 'success':
        return <CheckCircle2 size={16} className="icon-success" />;
      case 'info':
      default:
        return <Info size={16} className="icon-info" />;
    }
  };

  return (
    <div className={`ot-alert-card severity-${severity} ${className}`}>
      <div className="alert-body-wrap">
        <div className="alert-icon-box">{getSeverityIcon()}</div>
        <div className="alert-text-area">
          <div className="alert-title-line">
            <span className="alert-heading">{title}</span>
            <span className="alert-tag font-mono">{pillar.toUpperCase()}</span>
            <span className="alert-time font-mono">{timestamp}</span>
          </div>
          <p className="alert-desc">{message}</p>
        </div>
      </div>

      <div className="alert-btn-group">
        {actionLabel && (
          <Button
            size="xs"
            variant={severity === 'critical' ? 'danger' : 'secondary'}
            onClick={onAction}
            iconRight={ChevronRight}
          >
            {actionLabel}
          </Button>
        )}
        {onDismiss && (
          <button className="alert-close-btn" onClick={onDismiss} aria-label="Dismiss alert">
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
