import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  User, 
  FileText, 
  Activity, 
  Stethoscope, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Send, 
  Printer, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  FileCheck2,
  TestTube2
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './PatientDetailPanel.css';

/**
 * Detailed Patient Readiness Panel
 * Slide-over drawer providing deep clinical readiness diagnostics, checklist, timeline, and actions.
 */
export const PatientDetailPanel = ({ patient, onClose, onUpdateStatus }) => {
  const [actionDone, setActionDone] = useState(false);

  if (!patient) return null;

  const handleAction = () => {
    setActionDone(true);
    if (onUpdateStatus) {
      onUpdateStatus(patient.id);
    }
  };

  const isFullyReady = patient.readinessScore === 100;

  return (
    <div className="ot-patient-panel-backdrop" onClick={onClose}>
      <div className="ot-patient-panel" onClick={(e) => e.stopPropagation()}>
        {/* Panel Header */}
        <div className="patient-panel-header">
          <div className="panel-header-left">
            <div className="patient-id-badge font-mono">{patient.id}</div>
            <span className="panel-sep">•</span>
            <span className="patient-mrn font-mono">{patient.mrn}</span>
          </div>
          <button className="panel-close-btn" onClick={onClose} aria-label="Close panel" type="button">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="patient-panel-body">
          {/* Patient Hero Block */}
          <div className="patient-hero-card">
            <div className="patient-hero-main">
              <div className="patient-avatar-box font-display">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="patient-hero-details">
                <div className="patient-name-line">
                  <h2 className="patient-hero-name font-display">{patient.name}</h2>
                  <span className={`readiness-status-badge badge-${patient.status.toLowerCase().replace(' ', '-')}`}>
                    {patient.status}
                  </span>
                </div>
                <span className="patient-hero-procedure">{patient.procedure}</span>
                <div className="patient-meta-pills font-mono">
                  <span>Age: {patient.age || '54y'}</span>
                  <span>•</span>
                  <span>{patient.gender || 'Male'}</span>
                  <span>•</span>
                  <span>Blood: {patient.bloodGroup || 'O+'}</span>
                  <span>•</span>
                  <span>Bay: {patient.preOpBay || 'Bay 03'}</span>
                </div>
              </div>
            </div>

            {/* Readiness Score Gauge */}
            <div className="readiness-gauge-box">
              <div className="score-number-row">
                <span className="score-num font-display">{patient.readinessScore}%</span>
                <span className="score-label font-mono">READINESS</span>
              </div>
              <div className="score-progress-track">
                <div 
                  className={`score-progress-fill ${patient.readinessScore >= 90 ? 'fill-teal' : patient.readinessScore >= 70 ? 'fill-amber' : 'fill-red'}`}
                  style={{ width: `${patient.readinessScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Missing Requirements Box (Visually obvious, calibrated alerting) */}
          {patient.missingRequirements && patient.missingRequirements.length > 0 && (
            <div className="missing-requirements-box">
              <div className="missing-req-header">
                <AlertCircle size={15} className="req-alert-icon" />
                <span className="missing-req-title">Outstanding Pre-Op Requirements ({patient.missingRequirements.length})</span>
              </div>
              <ul className="missing-req-list">
                {patient.missingRequirements.map((req, idx) => (
                  <li key={idx} className="missing-req-item">
                    <span className="req-bullet">•</span>
                    <div className="req-desc-group">
                      <strong className="req-name">{req.title}:</strong>
                      <span className="req-detail">{req.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Operational Details Grid */}
          <div className="patient-operational-grid">
            <div className="op-grid-cell">
              <span className="op-cell-label">SCHEDULED THEATRE</span>
              <div className="op-cell-val font-display">
                <Building2 size={13} className="text-blue" />
                <span>{patient.otSuite}</span>
              </div>
            </div>

            <div className="op-grid-cell">
              <span className="op-cell-label">SCHEDULED START</span>
              <div className="op-cell-val font-mono">
                <Clock size={13} className="text-teal" />
                <span>{patient.scheduledTime}</span>
              </div>
            </div>

            <div className="op-grid-cell">
              <span className="op-cell-label">ATTENDING SURGEON</span>
              <div className="op-cell-val">
                <Stethoscope size={13} className="text-indigo" />
                <span>{patient.surgeon || 'Dr. A. Miller, MD'}</span>
              </div>
            </div>

            <div className="op-grid-cell">
              <span className="op-cell-label">ANESTHESIOLOGIST</span>
              <div className="op-cell-val">
                <Activity size={13} className="text-purple" />
                <span>{patient.anesthesiologist || 'Dr. K. Patel, MD'}</span>
              </div>
            </div>
          </div>

          {/* 6-Point Clinical Readiness Checklist */}
          <div className="panel-section">
            <h3 className="panel-section-title">
              <FileCheck2 size={14} className="section-icon text-teal" />
              <span>Pre-Operative Readiness Checklist</span>
            </h3>

            <div className="readiness-checklist-list">
              {[
                { label: 'Inpatient Admission & Registration', status: patient.admissionStatus, key: 'admission' },
                { label: 'Informed Surgical & Anesthesia Consent Form', status: patient.consentStatus, key: 'consent' },
                { label: 'Pre-Op Lab Reports & Imaging Diagnostics', status: patient.reportsStatus, key: 'reports' },
                { label: 'Pre-Anesthetic Risk Assessment (ASA-II Cleared)', status: patient.preOpStatus, key: 'preop' },
                { label: 'Surgical Site Marking & Pre-Op IV Access', status: 'Complete', key: 'marking' },
                { label: 'Transport Porter Dispatch & Transfer to OT', status: patient.transferStatus, key: 'transfer' }
              ].map((chk, i) => {
                const isComplete = chk.status === 'Complete' || chk.status === 'In Room';
                const isPending = chk.status === 'Pending' || chk.status === 'In Progress';
                const isMissing = chk.status === 'Missing' || chk.status === 'Pending Labs';
                return (
                  <div key={i} className={`checklist-item ${isComplete ? 'item-complete' : isMissing ? 'item-missing' : 'item-pending'}`}>
                    <div className="chk-status-icon">
                      {isComplete && <CheckCircle2 size={16} className="text-teal" />}
                      {isPending && <Clock size={16} className="text-amber" />}
                      {isMissing && <AlertTriangle size={16} className="text-red" />}
                    </div>
                    <span className="chk-label">{chk.label}</span>
                    <span className={`chk-pill pill-${isComplete ? 'complete' : isMissing ? 'missing' : 'pending'} font-mono`}>
                      {chk.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pre-Op Workflow Timeline */}
          <div className="panel-section">
            <h3 className="panel-section-title">
              <Clock size={14} className="section-icon text-blue" />
              <span>Pre-Op Workflow Timeline</span>
            </h3>

            <div className="preop-timeline-list">
              {patient.timeline && patient.timeline.map((step, idx) => (
                <div key={idx} className="preop-timeline-step">
                  <div className="step-time-col font-mono">{step.time}</div>
                  <div className="step-marker-col">
                    <div className={`step-dot ${step.isCurrent ? 'dot-current' : 'dot-done'}`} />
                    {idx < patient.timeline.length - 1 && <div className="step-line" />}
                  </div>
                  <div className="step-content-col">
                    <span className="step-title">{step.title}</span>
                    <span className="step-desc">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Action Footer */}
        <div className="patient-panel-footer">
          <div className="footer-left-actions">
            <Button
              size="sm"
              variant="secondary"
              icon={Printer}
              onClick={() => alert(`Pre-op surgical readiness packet printed for ${patient.name} (${patient.id}).`)}
            >
              Print Packet
            </Button>
          </div>

          <div className="footer-right-actions">
            {patient.transferStatus === 'Pending' ? (
              <Button
                size="sm"
                variant="primary"
                icon={Truck}
                onClick={handleAction}
                disabled={actionDone}
              >
                {actionDone ? 'Porter Dispatched' : 'Dispatch Transport Porter'}
              </Button>
            ) : patient.consentStatus === 'Missing' ? (
              <Button
                size="sm"
                variant="danger"
                icon={FileText}
                onClick={handleAction}
                disabled={actionDone}
              >
                {actionDone ? 'e-Sign Dispatched' : 'Request Digital e-Sign'}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="teal"
                icon={ShieldCheck}
                onClick={handleAction}
                disabled={actionDone}
              >
                {actionDone ? 'Marked Ready' : 'Signal Theatre Ready'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
