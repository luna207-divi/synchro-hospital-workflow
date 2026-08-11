import React, { useState } from 'react';
import { 
  User, Zap, Package, Clock, CheckCircle2, AlertTriangle, 
  XCircle, Eye, ChevronRight
} from 'lucide-react';
import './ReadinessGates.css';

/* ============================================================
   READINESS GATES — "Are the inputs ready?"
   Pre-flight checklist for upcoming surgical cases.
   Three columns: Patient Gate • OT Gate • CSSD Gate
   ============================================================ */

const UPCOMING_CASES = [
  {
    id: 'UC-001',
    time: '10:00',
    patient: 'E. Rostova',
    mrn: 'MRN-9204',
    procedure: 'Laparoscopic Cholecystectomy',
    procedureShort: 'Lap Chole',
    ot: 'OT-02',
    surgeon: 'Dr. K. Patel',
    overallReadiness: 60,
    gates: {
      patient: {
        status: 'partial',
        items: [
          { label: 'Admitted', done: true },
          { label: 'Consent Signed', done: true },
          { label: 'Labs Complete', done: true },
          { label: 'Pre-op Assessment', done: true },
          { label: 'Patient Transfer', done: false, critical: false, note: 'Porter dispatched' },
        ]
      },
      ot: {
        status: 'ready',
        items: [
          { label: 'OT-02 Available', done: true },
          { label: 'Surgical Team Ready', done: true },
          { label: 'Anesthesia Confirmed', done: true },
        ]
      },
      cssd: {
        status: 'blocked',
        items: [
          { label: 'CSSD-00142 Assigned', done: true },
          { label: 'Sterilization Complete', done: true },
          { label: 'Pack Available in OT', done: false, critical: true, note: 'Autoclave cooldown' },
        ]
      }
    }
  },
  {
    id: 'UC-002',
    time: '11:30',
    patient: 'S. Jenkins',
    mrn: 'MRN-7741',
    procedure: 'Total Knee Arthroplasty',
    procedureShort: 'TKA',
    ot: 'OT-04',
    surgeon: 'Dr. R. Sharma',
    overallReadiness: 100,
    gates: {
      patient: {
        status: 'ready',
        items: [
          { label: 'Admitted', done: true },
          { label: 'Consent Signed', done: true },
          { label: 'Labs Complete', done: true },
          { label: 'Pre-op Assessment', done: true },
          { label: 'Patient Transferred', done: true },
        ]
      },
      ot: {
        status: 'ready',
        items: [
          { label: 'OT-04 Available', done: true },
          { label: 'Surgical Team Ready', done: true },
          { label: 'Anesthesia Confirmed', done: true },
        ]
      },
      cssd: {
        status: 'ready',
        items: [
          { label: 'CSSD-TKA-07 Assigned', done: true },
          { label: 'Sterilization Complete', done: true },
          { label: 'Pack in OT Holding', done: true },
        ]
      }
    }
  },
  {
    id: 'UC-003',
    time: '14:00',
    patient: 'A. Miller',
    mrn: 'MRN-5502',
    procedure: 'Laparoscopic Cholecystectomy',
    procedureShort: 'Lap Chole',
    ot: 'OT-02',
    surgeon: 'Dr. K. Patel',
    overallReadiness: 45,
    gates: {
      patient: {
        status: 'partial',
        items: [
          { label: 'Admitted', done: true },
          { label: 'Consent Signed', done: false, critical: true, note: 'Awaiting surgeon' },
          { label: 'Labs Complete', done: false, critical: false, note: 'Results pending' },
          { label: 'Pre-op Assessment', done: false, critical: false, note: 'Scheduled 11:00' },
          { label: 'Patient Transfer', done: false, critical: false },
        ]
      },
      ot: {
        status: 'partial',
        items: [
          { label: 'OT-02 Available', done: false, critical: false, note: 'In use until ~12:30' },
          { label: 'Surgical Team Ready', done: true },
          { label: 'Anesthesia Confirmed', done: true },
        ]
      },
      cssd: {
        status: 'ready',
        items: [
          { label: 'CSSD-LAP-12 Assigned', done: true },
          { label: 'Sterilization Complete', done: true },
          { label: 'Pack in Sterile Storage', done: true },
        ]
      }
    }
  },
  {
    id: 'UC-004',
    time: '15:30',
    patient: 'A. Malik',
    mrn: 'MRN-6120',
    procedure: 'Meniscus Repair',
    procedureShort: 'Meniscus',
    ot: 'OT-03',
    surgeon: 'Dr. J. Gomez',
    overallReadiness: 72,
    gates: {
      patient: {
        status: 'ready',
        items: [
          { label: 'Admitted', done: true },
          { label: 'Consent Signed', done: true },
          { label: 'Labs Complete', done: true },
          { label: 'Pre-op Assessment', done: true },
          { label: 'Patient Transfer', done: false, critical: false, note: 'Scheduled 14:45' },
        ]
      },
      ot: {
        status: 'partial',
        items: [
          { label: 'OT-03 Available', done: false, critical: false, note: 'Turnover in progress' },
          { label: 'Surgical Team Ready', done: true },
          { label: 'Anesthesia Confirmed', done: false, critical: false, note: 'Pending confirmation' },
        ]
      },
      cssd: {
        status: 'ready',
        items: [
          { label: 'CSSD-ARTH-03 Assigned', done: true },
          { label: 'Sterilization Complete', done: true },
          { label: 'Pack in Sterile Storage', done: true },
        ]
      }
    }
  }
];

const GateStatusIcon = ({ status }) => {
  if (status === 'ready') return <CheckCircle2 size={14} className="gate-icon gate-icon-ready" />;
  if (status === 'blocked') return <XCircle size={14} className="gate-icon gate-icon-blocked" />;
  return <AlertTriangle size={14} className="gate-icon gate-icon-partial" />;
};

const GateColumn = ({ gateData, gateLabel, gateIcon: Icon }) => {
  const statusClass = `gate-col-${gateData.status}`;
  return (
    <div className={`readiness-gate-col ${statusClass}`}>
      <div className="gate-col-header">
        <Icon size={13} />
        <span className="gate-col-label">{gateLabel}</span>
        <GateStatusIcon status={gateData.status} />
      </div>
      <div className="gate-checklist">
        {gateData.items.map((item, idx) => (
          <div key={idx} className={`gate-check-item ${item.done ? 'item-done' : item.critical ? 'item-critical' : 'item-pending'}`}>
            <span className="check-indicator">
              {item.done ? <CheckCircle2 size={12} /> : item.critical ? <XCircle size={12} /> : <Clock size={12} />}
            </span>
            <span className="check-label">{item.label}</span>
            {item.note && !item.done && (
              <span className="check-note font-mono">{item.note}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ReadinessRow = ({ caseData }) => {
  const allReady = caseData.overallReadiness === 100;
  const hasBlocked = Object.values(caseData.gates).some(g => g.status === 'blocked');

  return (
    <div className={`readiness-row ${allReady ? 'row-all-ready' : hasBlocked ? 'row-has-blocked' : 'row-partial'}`}>
      {/* Case info column */}
      <div className="readiness-case-info">
        <div className="case-time-badge font-mono">{caseData.time}</div>
        <div className="case-info-stack">
          <span className="case-patient-name">{caseData.patient}</span>
          <span className="case-procedure-label">{caseData.procedureShort}</span>
          <span className="case-ot-label font-mono">{caseData.ot} • {caseData.surgeon}</span>
        </div>
        <div className={`readiness-score ${allReady ? 'score-ready' : hasBlocked ? 'score-blocked' : 'score-partial'}`}>
          <span className="score-number font-mono">{caseData.overallReadiness}%</span>
        </div>
      </div>

      {/* Three Gate Columns */}
      <div className="readiness-gates-row">
        <GateColumn gateData={caseData.gates.patient} gateLabel="Patient" gateIcon={User} />
        <GateColumn gateData={caseData.gates.ot} gateLabel="OT" gateIcon={Zap} />
        <GateColumn gateData={caseData.gates.cssd} gateLabel="CSSD" gateIcon={Package} />
      </div>
    </div>
  );
};

export const ReadinessGates = () => {
  const readyCount = UPCOMING_CASES.filter(c => c.overallReadiness === 100).length;
  const atRiskCount = UPCOMING_CASES.filter(c => Object.values(c.gates).some(g => g.status === 'blocked')).length;

  return (
    <div className="readiness-gates-page">
      <div className="rg-page-header">
        <div className="rg-header-left">
          <h2 className="rg-page-title">Readiness Gates</h2>
          <p className="rg-page-subtitle">Pre-flight checks for upcoming procedures. Three gates must be green before a case can flow.</p>
        </div>
        <div className="rg-header-stats">
          <div className="rg-stat rg-stat-ready">
            <span className="rg-stat-number">{readyCount}</span>
            <span className="rg-stat-label">Ready to Go</span>
          </div>
          <div className="rg-stat rg-stat-risk">
            <span className="rg-stat-number">{atRiskCount}</span>
            <span className="rg-stat-label">At Risk</span>
          </div>
          <div className="rg-stat rg-stat-total">
            <span className="rg-stat-number">{UPCOMING_CASES.length}</span>
            <span className="rg-stat-label">Upcoming</span>
          </div>
        </div>
      </div>

      {/* Gate column headers */}
      <div className="rg-column-legend">
        <div className="rg-legend-case">Scheduled Cases (Next 6 Hours)</div>
        <div className="rg-legend-gates">
          <span className="rg-legend-gate"><User size={12} /> Patient Gate</span>
          <span className="rg-legend-gate"><Zap size={12} /> OT Gate</span>
          <span className="rg-legend-gate"><Package size={12} /> CSSD Gate</span>
        </div>
      </div>

      <div className="readiness-list">
        {UPCOMING_CASES.map(c => (
          <ReadinessRow key={c.id} caseData={c} />
        ))}
      </div>
    </div>
  );
};
