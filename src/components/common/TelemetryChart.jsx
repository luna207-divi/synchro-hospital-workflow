import React from 'react';
import './TelemetryChart.css';

/**
 * OT Timeline Bar: High-density clinical timeline visualization
 */
export const TimelineBar = ({
  title,
  subtitle,
  segments = [], // [{ label: 'Case #1', width: '35%', color: 'blue', time: '08:00 - 10:30' }, ...]
  className = ''
}) => {
  return (
    <div className={`ot-timeline-widget ${className}`}>
      {(title || subtitle) && (
        <div className="timeline-header">
          {title && <span className="timeline-title">{title}</span>}
          {subtitle && <span className="timeline-sub font-mono">{subtitle}</span>}
        </div>
      )}
      <div className="timeline-bar-track">
        {segments.map((seg, idx) => (
          <div
            key={idx}
            className={`timeline-segment seg-${seg.color || 'blue'}`}
            style={{ width: seg.width }}
            title={`${seg.label}: ${seg.time || ''}`}
          >
            <span className="segment-label">{seg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Autoclave Cycle Progress Bar: CSSD Reprocessing stages
 */
export const CycleProgressBar = ({
  stages = [
    { name: 'Wash & Decon', status: 'completed' },
    { name: 'Steam Sterilize (134°C)', status: 'in-progress', progress: '65%' },
    { name: 'Aeration & Dry', status: 'pending' },
    { name: 'RFID Release', status: 'pending' }
  ],
  className = ''
}) => {
  return (
    <div className={`ot-cycle-progress ${className}`}>
      <div className="cycle-steps-row">
        {stages.map((st, i) => (
          <div key={i} className={`cycle-step-item status-${st.status}`}>
            <div className="cycle-step-top">
              <span className="cycle-step-num font-mono">{i + 1}</span>
              <span className="cycle-step-name">{st.name}</span>
            </div>
            <div className="cycle-step-bar">
              <div
                className="cycle-step-fill"
                style={{
                  width: st.status === 'completed' ? '100%' : st.status === 'in-progress' ? (st.progress || '50%') : '0%'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Mini Sparkline Risk Histogram
 */
export const RiskSparkline = ({
  bars = [12, 18, 9, 24, 45, 14, 8, 22, 16, 5],
  highlightIndex = 4,
  label = 'Delay Risk Distribution (Next 8 Hours)',
  className = ''
}) => {
  const max = Math.max(...bars, 1);

  return (
    <div className={`ot-sparkline-card ${className}`}>
      <span className="sparkline-title">{label}</span>
      <div className="sparkline-bars">
        {bars.map((val, idx) => {
          const heightPercent = `${Math.round((val / max) * 100)}%`;
          const isHigh = idx === highlightIndex;
          return (
            <div key={idx} className="sparkline-bar-col" title={`Slot +${idx}h: ${val}m risk`}>
              <div
                className={`sparkline-bar-fill ${isHigh ? 'is-warning' : 'is-normal'}`}
                style={{ height: heightPercent }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
