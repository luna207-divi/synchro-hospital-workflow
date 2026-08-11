import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Clock, 
  Activity, 
  UserCheck, 
  PackageCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  ChevronRight, 
  ShieldCheck, 
  Play, 
  Sparkles,
  Users,
  Stethoscope,
  Radio
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './OTSuiteDrawer.css';

/**
 * Detailed OT Suite Inspection Drawer
 * Provides deep operational telemetry, environmental sensors, schedule roster, and workflow controls.
 */
export const OTSuiteDrawer = ({ suite, onClose, onAdvanceStage }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(suite?.currentStageIdx || 3);
  const [actionDispatched, setActionDispatched] = useState(false);

  if (!suite) return null;

  const stagesList = [
    'Patient Ready',
    'Preparation',
    'Procedure Started',
    'Procedure In Progress',
    'Procedure Completed',
    'Cleaning / Turnover',
    'Ready'
  ];

  const handleAdvance = () => {
    if (currentStageIdx < stagesList.length - 1) {
      const nextIdx = currentStageIdx + 1;
      setCurrentStageIdx(nextIdx);
      if (onAdvanceStage) {
        onAdvanceStage(suite.id, stagesList[nextIdx]);
      }
    }
  };

  return (
    <div className="ot-suite-drawer-backdrop" onClick={onClose}>
      <div className="ot-suite-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="suite-drawer-header">
          <div className="suite-drawer-title-group">
            <div className="suite-id-tag font-display">{suite.id}</div>
            <div className="suite-title-copy">
              <h2 className="suite-main-name font-display">{suite.name}</h2>
              <span className="suite-specialty-sub font-mono">{suite.specialty}</span>
            </div>
          </div>
          <button className="suite-drawer-close" onClick={onClose} aria-label="Close drawer" type="button">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="suite-drawer-body">
          {/* Current Live Procedure Hero */}
          <div className="suite-hero-card">
            <div className="suite-hero-top">
              <span className={`suite-status-pill badge-${suite.status.toLowerCase().replace(' ', '-')}`}>
                {suite.statusLabel}
              </span>
              <span className="suite-current-stage font-mono">
                STAGE {currentStageIdx + 1} OF 7: {stagesList[currentStageIdx]}
              </span>
            </div>

            <div className="suite-patient-procedure">
              <h3 className="procedure-heading font-display">{suite.procedure}</h3>
              <div className="patient-meta-row font-mono">
                <span>Patient: <strong>{suite.patient}</strong></span>
                <span>•</span>
                <span>{suite.patientMRN}</span>
              </div>
            </div>

            {/* Workflow 7-Stage Interactive Stepper */}
            <div className="stepper-7-container">
              <div className="stepper-progress-line">
                <div 
                  className="stepper-progress-active" 
                  style={{ width: `${(currentStageIdx / (stagesList.length - 1)) * 100}%` }}
                />
              </div>
              <div className="stepper-nodes-row">
                {stagesList.map((stg, i) => {
                  const isDone = i < currentStageIdx;
                  const isCurrent = i === currentStageIdx;
                  return (
                    <div key={stg} className={`stepper-node ${isDone ? 'is-done' : isCurrent ? 'is-current' : 'is-upcoming'}`}>
                      <div className="stepper-dot">
                        {isDone ? <CheckCircle2 size={10} /> : <span>{i + 1}</span>}
                      </div>
                      <span className="stepper-label">{stg}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timing Telemetry Strip */}
            <div className="suite-timing-strip font-mono">
              <div className="timing-col">
                <span className="t-label">SCHEDULED</span>
                <span className="t-val">{suite.scheduledStart}</span>
              </div>
              <div className="timing-col">
                <span className="t-label">ACTUAL START</span>
                <span className="t-val">{suite.actualStart}</span>
              </div>
              <div className="timing-col">
                <span className="t-label">ELAPSED</span>
                <span className="t-val font-bold text-teal">{suite.elapsedTime}</span>
              </div>
              <div className="timing-col">
                <span className="t-label">EXPECTED FINISH</span>
                <span className="t-val">{suite.expectedCompletion}</span>
              </div>
            </div>
          </div>

          {/* Environmental Sensor Telemetry */}
          <div className="suite-section">
            <h4 className="section-title">
              <Radio size={14} className="text-teal" />
              <span>Environmental & Airflow Sensors</span>
            </h4>

            <div className="env-sensors-grid font-mono">
              <div className="sensor-card">
                <div className="sensor-top">
                  <Thermometer size={14} className="text-blue" />
                  <span className="sensor-name">TEMPERATURE</span>
                </div>
                <span className="sensor-val">19.4°C</span>
                <span className="sensor-sub text-teal">Optimal (18-20°C)</span>
              </div>

              <div className="sensor-card">
                <div className="sensor-top">
                  <Droplets size={14} className="text-indigo" />
                  <span className="sensor-name">HUMIDITY</span>
                </div>
                <span className="sensor-val">48.2%</span>
                <span className="sensor-sub text-teal">Optimal (45-55%)</span>
              </div>

              <div className="sensor-card">
                <div className="sensor-top">
                  <Wind size={14} className="text-teal" />
                  <span className="sensor-name">AIR CHANGES</span>
                </div>
                <span className="sensor-val">24.6 /h</span>
                <span className="sensor-sub text-teal">HEPA Validated</span>
              </div>

              <div className="sensor-card">
                <div className="sensor-top">
                  <Gauge size={14} className="text-purple" />
                  <span className="sensor-name">ROOM PRESSURE</span>
                </div>
                <span className="sensor-val">+32.5 Pa</span>
                <span className="sensor-sub text-teal">Positive Pressure OK</span>
              </div>
            </div>
          </div>

          {/* Surgical Team In Room */}
          <div className="suite-section">
            <h4 className="section-title">
              <Users size={14} className="text-blue" />
              <span>Surgical Team Roster In Suite</span>
            </h4>

            <div className="team-roster-list">
              <div className="team-member-row">
                <Stethoscope size={13} className="text-indigo" />
                <span className="team-role font-mono">LEAD SURGEON:</span>
                <span className="team-name font-display">{suite.surgeon}</span>
              </div>
              <div className="team-member-row">
                <Activity size={13} className="text-purple" />
                <span className="team-role font-mono">ANESTHESIOLOGIST:</span>
                <span className="team-name font-display">{suite.anesthesiologist || 'Dr. K. Patel, MD'}</span>
              </div>
              <div className="team-member-row">
                <ShieldCheck size={13} className="text-teal" />
                <span className="team-role font-mono">SCRUB NURSE:</span>
                <span className="team-name">Nurse J. Doe, RN (Lead Scrub)</span>
              </div>
              <div className="team-member-row">
                <UserCheck size={13} className="text-blue" />
                <span className="team-role font-mono">CIRCULATING NURSE:</span>
                <span className="team-name">Nurse R. Taylor, RN</span>
              </div>
            </div>
          </div>

          {/* Verified Sterile Instrument Trays */}
          <div className="suite-section">
            <h4 className="section-title">
              <PackageCheck size={14} className="text-teal" />
              <span>Verified Sterile Packs in Room</span>
            </h4>

            <div className="sterile-packs-box font-mono">
              <div className="pack-row">
                <CheckCircle2 size={13} className="text-teal" />
                <span className="pack-id">{suite.trayId}</span>
                <span className="pack-status text-teal">134°C Steam Validated • Dual Biological Strip PASSED</span>
              </div>
            </div>
          </div>

          {/* Day Case Schedule for this Suite */}
          <div className="suite-section">
            <h4 className="section-title">
              <Clock size={14} className="text-indigo" />
              <span>Today's Suite Schedule Roster</span>
            </h4>

            <div className="suite-schedule-list font-mono">
              <div className="sched-item item-current">
                <span className="sched-time">08:30 - 11:00 AM</span>
                <div className="sched-details">
                  <strong className="text-primary">{suite.procedure}</strong>
                  <span className="text-muted">{suite.patient} ({suite.patientMRN}) • {suite.surgeon}</span>
                </div>
                <Badge variant="teal" size="xs">CURRENT ACTIVE</Badge>
              </div>

              <div className="sched-item">
                <span className="sched-time">11:30 - 01:45 PM</span>
                <div className="sched-details">
                  <strong>Total Knee Arthroplasty (TKA)</strong>
                  <span className="text-muted">Sarah Jenkins (MRN-7741) • Dr. R. Sharma</span>
                </div>
                <Badge variant="blue" size="xs">UPCOMING</Badge>
              </div>

              <div className="sched-item">
                <span className="sched-time">02:15 - 04:30 PM</span>
                <div className="sched-details">
                  <strong>Rotator Cuff Repair (Arthroscopic)</strong>
                  <span className="text-muted">David Wilson (MRN-5519) • Dr. A. Miller</span>
                </div>
                <Badge variant="slate" size="xs">SCHEDULED</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="suite-drawer-footer">
          <div className="footer-left">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => alert(`Environmental sanitation team alerted for ${suite.name} turnover prep.`)}
            >
              Request Turnover Crew
            </Button>
          </div>

          <div className="footer-right">
            <Button
              size="sm"
              variant="primary"
              icon={Play}
              onClick={handleAdvance}
              disabled={currentStageIdx >= stagesList.length - 1}
            >
              {currentStageIdx >= stagesList.length - 1 ? 'Procedure Completed' : `Advance to: ${stagesList[currentStageIdx + 1]}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
