import React from 'react';
import { Sparkles, AlertCircle, Clock, Info } from 'lucide-react';
import './DelayAnalysisChart.css';

/**
 * Delay Analysis Component: Root cause breakdown of surgical delays
 * Categories:
 * 1. CSSD Instrument Availability (38%)
 * 2. Patient Transfer (24%)
 * 3. Documentation & Consents (18%)
 * 4. OT Turnover / Sanitation (14%)
 * 5. Other / Anesthesia (6%)
 */
export const DelayAnalysisChart = () => {
  const delayCauses = [
    {
      name: 'CSSD Instrument Availability',
      percentage: 38,
      minutesImpact: 68,
      casesAffected: 4,
      color: 'teal',
      bgClass: 'fill-teal',
      trend: '+4% vs benchmark',
      keyFactor: 'Autoclave cycle cooldown & ortho power pack reassembly'
    },
    {
      name: 'Patient Transfer',
      percentage: 24,
      minutesImpact: 42,
      casesAffected: 3,
      color: 'blue',
      bgClass: 'fill-blue',
      trend: '-2% vs baseline',
      keyFactor: 'Pre-op holding bay transport porter availability'
    },
    {
      name: 'Documentation',
      percentage: 18,
      minutesImpact: 32,
      casesAffected: 2,
      color: 'amber',
      bgClass: 'fill-amber',
      trend: '32m lost today',
      keyFactor: 'Incomplete digital pre-op anesthesia consent sign-offs'
    },
    {
      name: 'OT Turnover',
      percentage: 14,
      minutesImpact: 25,
      casesAffected: 2,
      color: 'indigo',
      bgClass: 'fill-indigo',
      trend: 'Turnover avg 21.4m',
      keyFactor: 'Suite environmental decontamination after septic cases'
    },
    {
      name: 'Other',
      percentage: 6,
      minutesImpact: 10,
      casesAffected: 1,
      color: 'slate',
      bgClass: 'fill-slate',
      trend: '10m lost',
      keyFactor: 'Secondary anesthesia consult & lab coagulation re-draws'
    }
  ];

  const totalMinutesLost = delayCauses.reduce((acc, c) => acc + c.minutesImpact, 0);

  return (
    <div className="ot-delay-analysis-card ot-card">
      <div className="delay-analysis-header">
        <div className="analysis-title-group">
          <div className="analysis-title-row">
            <h3 className="analysis-heading font-display">Delay Root-Cause Analysis</h3>
            <span className="total-delay-pill font-mono">{totalMinutesLost} mins total impact</span>
          </div>
          <span className="analysis-subhead">
            Attribution distribution across admissions, sterile supply, and surgical turnover.
          </span>
        </div>
      </div>

      <div className="delay-analysis-body">
        {/* Composite Segmented Distribution Bar */}
        <div className="segmented-distribution-bar">
          {delayCauses.map((cause, i) => (
            <div
              key={i}
              className={`bar-segment seg-${cause.color}`}
              style={{ width: `${cause.percentage}%` }}
              title={`${cause.name}: ${cause.percentage}% (${cause.minutesImpact}m)`}
            />
          ))}
        </div>

        {/* Detailed Breakdown Rows */}
        <div className="causes-detail-list">
          {delayCauses.map((cause, i) => (
            <div key={i} className="cause-item-row">
              <div className="cause-info-left">
                <div className="cause-title-line">
                  <span className={`cause-color-dot dot-${cause.color}`} />
                  <span className="cause-name">{cause.name}</span>
                  <span className="cause-factor-tag">{cause.keyFactor}</span>
                </div>
              </div>

              <div className="cause-metrics-right">
                <div className="cause-progress-track">
                  <div
                    className={`cause-progress-fill ${cause.bgClass}`}
                    style={{ width: `${cause.percentage}%` }}
                  />
                </div>
                <span className="cause-pct font-mono">{cause.percentage}%</span>
                <span className="cause-impact font-mono">{cause.minutesImpact}m</span>
              </div>
            </div>
          ))}
        </div>

        {/* AI Root Cause Recommendation Note */}
        <div className="ai-delay-recommendation">
          <Sparkles size={14} className="recommendation-sparkle" />
          <div className="recommendation-text">
            <strong>AI Operational Insight:</strong> Expediting CSSD tray cooldown staging into pre-warmed holding bays will reduce <strong>38% of total daily delays</strong> (approx. 45 mins saved per day).
          </div>
        </div>
      </div>
    </div>
  );
};
