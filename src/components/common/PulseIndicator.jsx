import React from 'react';
import './PulseIndicator.css';

/**
 * Subtle Pulse Indicator for Live Telemetry / IoT Streams / RFID Sensors
 * Statuses: 'teal' | 'amber' | 'red' | 'blue' | 'purple' | 'slate'
 */
export const PulseIndicator = ({
  status = 'teal',
  size = 'md',
  label = null,
  className = ''
}) => {
  return (
    <div className={`ot-pulse-indicator status-${status} size-${size} ${className}`}>
      <span className="ot-pulse-dot">
        <span className="ot-pulse-ping" />
      </span>
      {label && <span className="ot-pulse-label">{label}</span>}
    </div>
  );
};
