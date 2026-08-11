import React from 'react';
import { UserCheck, Activity, PackageCheck, Check, Clock, AlertTriangle } from 'lucide-react';
import './ReadinessPill.css';

/**
 * Enterprise Triad Readiness Component for OTFlow AI
 * Represents: [Patient Readiness] + [OT Readiness] + [CSSD Sterile Pack] -> Delay Risk
 */
export const ReadinessPill = ({
  patientStatus = 'ready', // 'ready' | 'pending' | 'delayed'
  otStatus = 'ready',
  cssdStatus = 'ready',
  overallRisk = 'low',     // 'low' | 'medium' | 'high'
  showLabels = true,
  size = 'md',             // 'sm' | 'md'
  className = ''
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <Check size={11} className="icon-ready" />;
      case 'delayed':
        return <AlertTriangle size={11} className="icon-delayed" />;
      case 'pending':
      default:
        return <Clock size={11} className="icon-pending" />;
    }
  };

  return (
    <div className={`ot-readiness-triad triad-risk-${overallRisk} triad-size-${size} ${className}`}>
      {/* 1. Admissions / Patient */}
      <div className={`triad-step step-patient status-${patientStatus}`}>
        <UserCheck size={13} className="step-type-icon" />
        {showLabels && <span className="step-label">Patient</span>}
        <span className="step-indicator">{getStatusIcon(patientStatus)}</span>
      </div>

      <div className="triad-separator" />

      {/* 2. Operating Theatre */}
      <div className={`triad-step step-ot status-${otStatus}`}>
        <Activity size={13} className="step-type-icon" />
        {showLabels && <span className="step-label">OT</span>}
        <span className="step-indicator">{getStatusIcon(otStatus)}</span>
      </div>

      <div className="triad-separator" />

      {/* 3. CSSD Sterile Pack */}
      <div className={`triad-step step-cssd status-${cssdStatus}`}>
        <PackageCheck size={13} className="step-type-icon" />
        {showLabels && <span className="step-label">CSSD</span>}
        <span className="step-indicator">{getStatusIcon(cssdStatus)}</span>
      </div>

      {/* Delay Risk Score */}
      <div className={`triad-score-pill score-${overallRisk} font-mono`}>
        {overallRisk === 'low' ? 'READY' : overallRisk === 'medium' ? 'WATCH' : 'DELAY RISK'}
      </div>
    </div>
  );
};
