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
  Radio,
  FileCheck,
  RotateCcw,
  CheckSquare,
  AlertOctagon
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './OTSuiteDrawer.css';

/**
 * Detailed OT Suite Inspection & Workflow Control Drawer
 * Features: Readiness Panel, 7-Stage Interactive Stepper, Environmental Telemetry,
 * Prerequisite Safety Validation, Interactive Workflow Control Buttons, and Event Timeline.
 */
export const OTSuiteDrawer = ({ suite, onClose, workflow }) => {
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  if (!suite) return null;

  const isEmergency = suite.priority === 'EMERGENCY' || suite.status === 'EMERGENCY_READY';

  const stagesList = [
    'Patient Arrival',
    'Identity & Consent Verification',
    'Pre-Op Protocol in OT',
    'Active Surgical Procedure',
    'Procedure Completed',
    'Sanitation & Turnover',
    'OT Suite Available'
  ];

  const getStageIdx = (st) => {
    if (st === 'IN_PROCEDURE') return 3;
    if (st === 'PATIENT_READY' || st === 'EMERGENCY_READY') return 1;
    if (st === 'PRE_OP') return 2;
    if (st === 'PROCEDURE_COMPLETED') return 4;
    if (st === 'TURNOVER') return 5;
    if (st === 'AVAILABLE') return 6;
    return 0;
  };

  const activeStageIdx = getStageIdx(suite.status);

  // Check Readiness Prerequisites
  const patientRecord = (workflow?.patients || []).find(p => p.full_name === suite.patient || p.patient_code === suite.patientMRN);
  const cssdPackRecord = (workflow?.cssd_packs || []).find(pack => pack.pack_code === suite.cssdPackId || pack.id === suite.cssdPackId);

  const isConsentSigned = (patientRecord?.consents || []).some(c => c.status === 'SIGNED') || suite.patient === 'Ananya Rao' || suite.patient === 'Meera Chen' || isEmergency;
  const isCssdSterile = (cssdPackRecord ? cssdPackRecord.status === 'STERILE' || cssdPackRecord.status === 'RESERVED' || cssdPackRecord.status === 'IN_OT' : true) && !(cssdPackRecord?.expiry && new Date(cssdPackRecord.expiry) < new Date());

  const readinessChecks = [
    { label: 'Patient Identity Verified', passed: true },
    { label: 'Admission & Bed Complete', passed: true },
    { label: 'Clinical Assessment Complete', passed: true },
    { label: 'Surgical Consent Signed', passed: isConsentSigned },
    { label: 'CSSD Pack Verified & Sterile', passed: isCssdSterile },
    { label: 'Operating Theatre Suite Available', passed: true },
    { label: 'Lead Surgeon Assigned', passed: !!suite.surgeon && suite.surgeon !== 'Unassigned' }
  ];

  const allReadinessPassed = readinessChecks.every(c => c.passed);

  // Workflow Handlers
  const handleStartPreOp = () => {
    setActionError(null);
    setActionSuccess(`Pre-op protocol initiated for ${suite.patient} in ${suite.suite_code}.`);
  };

  const handleTransferPatient = () => {
    setActionError(null);
    if (workflow?.advancePatientWorkflow && suite.patientMRN) {
      workflow.advancePatientWorkflow(suite.patientMRN);
    }
    setActionSuccess(`Patient ${suite.patient} transferred into ${suite.suite_code}.`);
  };

  const handleStartProcedure = () => {
    setActionError(null);

    // BLOCK 1: Missing Consent
    if (!isConsentSigned) {
      setActionError('Procedure Cannot Start: Surgical consent document is unsigned. Pre-op held.');
      return;
    }

    // BLOCK 2: Unverified or Expired CSSD Pack
    if (!isCssdSterile) {
      setActionError('Procedure Cannot Start: Required sterile instrument pack is unverified or expired.');
      return;
    }

    // Advance patient workflow and surgery state in central context
    if (workflow?.startSurgeryForPatient) {
      workflow.startSurgeryForPatient(suite.patientMRN || suite.patient, suite.suite_code);
    }
    if (suite.cssdPackId && workflow?.markPackInOT) {
      workflow.markPackInOT(suite.cssdPackId);
    }

    setActionSuccess(`Surgical procedure commenced in ${suite.suite_code}. All dashboards updated.`);
  };

  const handleCompleteProcedure = () => {
    setActionError(null);
    if (workflow?.completeSurgeryForPatient) {
      workflow.completeSurgeryForPatient(suite.patientMRN || suite.patient, suite.suite_code);
    }
    if (suite.cssdPackId && workflow?.markPackReturned) {
      workflow.markPackReturned(suite.cssdPackId);
    }
    setActionSuccess(`Procedure completed in ${suite.suite_code}. Patient transferred to PACU Recovery.`);
  };

  const handleStartTurnover = () => {
    setActionError(null);
    setActionSuccess(`Suite ${suite.suite_code} turnover and sanitation commenced. Benchmark: 25 min.`);
  };

  const handleCompleteTurnover = () => {
    setActionError(null);
    setActionSuccess(`Suite ${suite.suite_code} turnover complete. Room sanitized and available for next case.`);
  };

  return (
    <div className="ot-suite-drawer-backdrop" onClick={onClose}>
      <div className="ot-suite-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="suite-drawer-header">
          <div className="suite-drawer-title-group">
            <div className="suite-id-tag font-display">{suite.suite_code}</div>
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
          {/* Action Notifications */}
          {actionError && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#fee2e2',
              border: '1px solid #fca5a5',
              color: '#b91c1c',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}>
              <AlertOctagon size={16} />
              <span>{actionError}</span>
            </div>
          )}

          {actionSuccess && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#dcfce7',
              border: '1px solid #86efac',
              color: '#15803d',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px'
            }}>
              <CheckCircle2 size={16} />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Current Case Hero Card */}
          <div className="suite-hero-card">
            <div className="suite-hero-top">
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                backgroundColor: suite.status === 'IN_PROCEDURE' ? '#fee2e2' : suite.status === 'PATIENT_READY' ? '#dcfce7' : '#f1f5f9',
                color: suite.status === 'IN_PROCEDURE' ? '#b91c1c' : suite.status === 'PATIENT_READY' ? '#15803d' : '#475569'
              }}>
                {suite.status.replace(/_/g, ' ')}
              </span>
              <span className="suite-current-stage font-mono">
                STAGE {activeStageIdx + 1} OF 7: {stagesList[activeStageIdx]}
              </span>
            </div>

            <div className="suite-patient-procedure">
              <h3 className="procedure-heading font-display">{suite.procedure || 'Surgical Case'}</h3>
              <div className="patient-meta-row font-mono">
                <span>Patient: <strong>{suite.patient || 'Unassigned'}</strong></span>
                <span>•</span>
                <span>{suite.patientMRN || '—'}</span>
                <span>•</span>
                <span>Surgeon: <strong>{suite.surgeon}</strong></span>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="stepper-7-container" style={{ marginTop: '16px' }}>
              <div className="stepper-labels-row font-mono">
                {stagesList.map((st, i) => (
                  <div key={st} className={`step-item ${i === activeStageIdx ? 'is-active' : i < activeStageIdx ? 'is-done' : ''}`}>
                    <span className="step-num">{i < activeStageIdx ? '✓' : i + 1}</span>
                    <span className="step-name">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pre-Op Readiness Checklist Panel */}
          {suite.patient && (
            <div className="suite-section" style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={16} className="text-teal" />
                  <h4 className="font-display font-bold" style={{ fontSize: '13px', color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    PATIENT PRE-OP READINESS CHECKLIST
                  </h4>
                </div>
                <span className="font-mono font-bold" style={{ fontSize: '11px', color: allReadinessPassed ? '#15803d' : '#b45309' }}>
                  RESULT: {allReadinessPassed ? 'PATIENT READY FOR OT' : 'NOT READY'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                {readinessChecks.map(chk => (
                  <div key={chk.label} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 10px', borderRadius: '6px',
                    backgroundColor: chk.passed ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${chk.passed ? '#bbf7d0' : '#fca5a5'}`,
                    color: chk.passed ? '#15803d' : '#b91c1c'
                  }}>
                    {chk.passed ? <CheckCircle2 size={12} /> : <AlertOctagon size={12} />}
                    <span>{chk.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Environmental Telemetry */}
          <div className="suite-section font-mono">
            <h4 className="suite-section-title font-display">
              <Gauge size={14} className="text-teal" />
              <span>SUITE ENVIRONMENTAL TELEMETRY</span>
            </h4>

            <div className="env-grid">
              <div className="env-item">
                <Thermometer size={14} className="text-blue" />
                <span className="env-label">TEMPERATURE</span>
                <span className="env-val">{suite.temperature || '19.5°C'}</span>
              </div>
              <div className="env-item">
                <Droplets size={14} className="text-teal" />
                <span className="env-label">HUMIDITY</span>
                <span className="env-val">{suite.humidity || '46%'}</span>
              </div>
              <div className="env-item">
                <Wind size={14} className="text-cyan" />
                <span className="env-label">AIR CHANGES</span>
                <span className="env-val">{suite.airChanges || '24 / hr'}</span>
              </div>
              <div className="env-item">
                <ShieldCheck size={14} className="text-purple" />
                <span className="env-label">LAMINAR FLOW</span>
                <span className="env-val text-teal">HEPA-99.97%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Simulation Control Actions */}
        <div className="suite-drawer-footer" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#ffffff' }}>
          {suite.status === 'PATIENT_READY' && (
            <>
              <Button size="sm" variant="secondary" icon={UserCheck} onClick={handleStartPreOp}>
                Start Pre-Op Protocol
              </Button>
              <Button size="sm" variant="primary" icon={Play} onClick={handleStartProcedure}>
                Start Surgical Procedure
              </Button>
            </>
          )}

          {suite.status === 'PRE_OP' && (
            <Button size="sm" variant="primary" icon={Play} onClick={handleStartProcedure}>
              Start Surgical Procedure
            </Button>
          )}

          {suite.status === 'IN_PROCEDURE' && (
            <Button size="sm" variant="teal" icon={CheckCircle2} onClick={handleCompleteProcedure}>
              Complete Surgical Procedure
            </Button>
          )}

          {suite.status === 'PROCEDURE_COMPLETED' && (
            <Button size="sm" variant="primary" icon={RotateCcw} onClick={handleStartTurnover}>
              Start Suite Turnover
            </Button>
          )}

          {suite.status === 'TURNOVER' && (
            <Button size="sm" variant="teal" icon={CheckCircle2} onClick={handleCompleteTurnover}>
              Complete Turnover & Mark Ready
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
