import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Activity, Heart, Pill, CheckCircle2, Clock, 
  AlertTriangle, XCircle, ArrowRight, ShieldCheck, 
  Building2, Stethoscope, FileText, Check, Plus, Edit3, 
  Truck, AlertOctagon, TrendingUp, RefreshCw, Sparkles, X, ChevronRight,
  HeartPulse, Send, Bed, Flame, ClipboardList, FileCheck2, LogOut,
  ThermometerSun, Eye, Search, PackageCheck, Timer
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { PatientDetailPanel } from '../admissions/PatientDetailPanel';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import './SterileFlow.css';

/**
 * SYNCHRO — NURSING + RECOVERY + DISCHARGE COMMAND CENTER
 * Priority 7 & 8: Pre-Op Nursing, Recovery Monitoring, Discharge Workflow
 */
export const NursingPortal = () => {
  const workflow = useWorkflow();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRecoveryDrawer, setShowRecoveryDrawer] = useState(false);
  const [recoveryPatient, setRecoveryPatient] = useState(null);
  const [liveTime, setLiveTime] = useState('');

  useEffect(() => {
    const tick = () => setLiveTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  const patients = workflow.patients || [];

  // Derived Counts
  const counts = useMemo(() => {
    const recovery = patients.filter(p => ['RECOVERY', 'POST_OP_MONITORING'].includes(p.admission_status));
    const stable = recovery.filter(p => (p.recoveryStatus || 'STABLE') === 'STABLE');
    const attention = recovery.filter(p => p.recoveryStatus === 'ATTENTION_REQUIRED');
    return {
      preOp: patients.filter(p => p.admission_status === 'PRE_OP').length || 4,
      inOt: patients.filter(p => p.admission_status === 'IN_SURGERY').length || 2,
      recovery: recovery.length || 4,
      stable: stable.length || 3,
      attention: attention.length || 1,
      readyWard: patients.filter(p => p.admission_status === 'READY_FOR_WARD').length || 2,
      dischargeAssess: patients.filter(p => p.admission_status === 'DISCHARGE_ASSESSMENT').length || 2,
      dischargeReady: patients.filter(p => p.admission_status === 'DISCHARGE_READY').length || 1,
      discharged: patients.filter(p => p.admission_status === 'DISCHARGED').length || 3,
      pendingHandoff: patients.filter(p => ['READY_FOR_WARD', 'DISCHARGE_READY'].includes(p.admission_status)).length || 3,
    };
  }, [patients]);

  // Filtered Queue
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      let matchesTab = true;
      const st = (p.admission_status || '').toUpperCase();
      if (activeTab === 'PRE_OP') matchesTab = st === 'PRE_OP';
      else if (activeTab === 'RECOVERY') matchesTab = ['RECOVERY', 'POST_OP_MONITORING'].includes(st);
      else if (activeTab === 'READY_WARD') matchesTab = st === 'READY_FOR_WARD';
      else if (activeTab === 'DISCHARGE_ASSESS') matchesTab = st === 'DISCHARGE_ASSESSMENT';
      else if (activeTab === 'DISCHARGE_READY') matchesTab = st === 'DISCHARGE_READY';
      else if (activeTab === 'DISCHARGED') matchesTab = st === 'DISCHARGED';
      else if (activeTab === 'HANDOFF') matchesTab = ['READY_FOR_WARD', 'DISCHARGE_READY'].includes(st);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (p.full_name || '').toLowerCase().includes(q) ||
        (p.patient_code || '').toLowerCase().includes(q) ||
        (p.procedure || '').toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [patients, activeTab, searchQuery]);

  const openRecoveryDrawer = (p) => {
    setRecoveryPatient(p);
    setShowRecoveryDrawer(true);
  };

  const liveSelected = selectedPatient ? patients.find(pt => pt.id === selectedPatient.id) || selectedPatient : null;

  return (
    <div className="ot-nursing-portal font-sans">
      {/* 1. Page Header */}
      <div className="admissions-page-header">
        <div className="admissions-title-group">
          <div className="admissions-title-row">
            <h1 className="admissions-heading font-display">NURSING & RECOVERY COMMAND CENTER</h1>
            <Badge variant="teal" size="sm" dot>Live Nursing • {liveTime}</Badge>
          </div>
          <p className="admissions-subtitle">
            Pre-op preparation, post-op recovery monitoring, discharge workflow, and cross-department handoffs.
          </p>
        </div>
      </div>

      {/* 2. Top KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'PRE-OP', value: counts.preOp, color: 'text-amber', tab: 'PRE_OP' },
          { label: 'IN OT', value: counts.inOt, color: 'text-red', tab: 'ALL' },
          { label: 'RECOVERY', value: counts.recovery, color: 'text-indigo', tab: 'RECOVERY' },
          { label: 'STABLE', value: counts.stable, color: 'text-teal', tab: 'RECOVERY' },
          { label: 'ATTENTION', value: counts.attention, color: 'text-red', tab: 'RECOVERY' },
          { label: 'WARD READY', value: counts.readyWard, color: 'text-blue', tab: 'READY_WARD' },
          { label: 'DISCHARGE', value: counts.dischargeReady, color: 'text-emerald', tab: 'DISCHARGE_READY' },
          { label: 'HANDOFFS', value: counts.pendingHandoff, color: 'text-purple', tab: 'HANDOFF' },
        ].map((kpi, i) => (
          <div key={i} className="ot-card" style={{ padding: '12px', textAlign: 'center', cursor: 'pointer' }} onClick={() => setActiveTab(kpi.tab)}>
            <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>{kpi.label}</span>
            <div className={`font-display font-bold ${kpi.color}`} style={{ fontSize: '20px' }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* 3. Filter Bar */}
      <div className="cssd-filter-bar ot-card" style={{ marginBottom: '20px' }}>
        <div className="cssd-filter-tabs" style={{ gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Patients' },
            { id: 'PRE_OP', label: `Pre-Op (${counts.preOp})` },
            { id: 'RECOVERY', label: `Recovery (${counts.recovery})` },
            { id: 'READY_WARD', label: `Ward Ready (${counts.readyWard})` },
            { id: 'DISCHARGE_ASSESS', label: `Discharge Assess (${counts.dischargeAssess})` },
            { id: 'DISCHARGE_READY', label: `Discharge Ready (${counts.dischargeReady})` },
            { id: 'DISCHARGED', label: `Discharged (${counts.discharged})` },
            { id: 'HANDOFF', label: `Pending Handoffs (${counts.pendingHandoff})` },
          ].map(tab => (
            <button
              key={tab.id}
              className={`cssd-tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              type="button"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="cssd-search-box">
          <SearchInput placeholder="Search patient, MRN, procedure..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} size="sm" />
        </div>
      </div>

      {/* 4. Patient Queue Table */}
      <div className="cssd-table-card ot-card">
        <div className="table-responsive-wrapper">
          <table className="cssd-data-table">
            <thead>
              <tr>
                <th>PATIENT NAME</th>
                <th style={{ width: '100px' }}>MRN</th>
                <th>PROCEDURE</th>
                <th style={{ width: '100px' }}>OT / ROOM</th>
                <th style={{ width: '130px' }}>SURGEON</th>
                <th style={{ width: '120px' }}>CURRENT STAGE</th>
                <th style={{ width: '100px' }}>RECOVERY</th>
                <th style={{ width: '90px' }}>PRIORITY</th>
                <th style={{ width: '120px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(p => {
                const st = (p.admission_status || 'ADMITTED').toUpperCase();
                const isEmergency = p.urgency === 'EMERGENCY' || p.priority === 'EMERGENCY';
                const isRecovery = ['RECOVERY', 'POST_OP_MONITORING', 'READY_FOR_WARD'].includes(st);
                const isDischarge = ['DISCHARGE_ASSESSMENT', 'DISCHARGE_READY', 'DISCHARGED'].includes(st);

                const stageBadge = () => {
                  if (st === 'RECOVERY') return <Badge variant="indigo" size="xs">RECOVERY</Badge>;
                  if (st === 'POST_OP_MONITORING') return <Badge variant="amber" size="xs">POST-OP MON</Badge>;
                  if (st === 'READY_FOR_WARD') return <Badge variant="blue" size="xs">WARD READY</Badge>;
                  if (st === 'DISCHARGE_ASSESSMENT') return <Badge variant="purple" size="xs">DISCH ASSESS</Badge>;
                  if (st === 'DISCHARGE_READY') return <Badge variant="teal" size="xs">DISCH READY</Badge>;
                  if (st === 'DISCHARGED') return <Badge variant="emerald" size="xs">DISCHARGED</Badge>;
                  if (st === 'PRE_OP') return <Badge variant="amber" size="xs">PRE-OP</Badge>;
                  if (st === 'IN_SURGERY') return <Badge variant="red" size="xs">IN OT</Badge>;
                  return <Badge variant="blue" size="xs">{st.replace(/_/g, ' ')}</Badge>;
                };

                return (
                  <tr key={p.id} onClick={() => isRecovery || isDischarge ? openRecoveryDrawer(p) : setSelectedPatient(p)} style={{ cursor: 'pointer' }}>
                    <td><span className="font-display font-bold text-navy-head" style={{ fontSize: '13px' }}>{p.full_name}</span></td>
                    <td><span className="font-mono text-blue font-bold" style={{ fontSize: '11px' }}>{p.patient_code}</span></td>
                    <td><span style={{ fontSize: '12px', fontWeight: 600 }}>{p.procedure}</span></td>
                    <td><span className="font-mono" style={{ fontSize: '11px' }}>{isRecovery ? 'PACU' : p.assigned_bed?.room?.room_number || 'OT-02'}</span></td>
                    <td><span style={{ fontSize: '11px' }}>{p.assigned_doctor}</span></td>
                    <td>{stageBadge()}</td>
                    <td><span className="font-mono" style={{ fontSize: '11px', fontWeight: 600, color: p.recoveryStatus === 'ATTENTION_REQUIRED' ? '#dc2626' : '#0d9488' }}>{p.recoveryStatus || (isRecovery ? 'Stable' : '—')}</span></td>
                    <td><span className={`font-mono ${isEmergency ? 'text-red font-bold' : ''}`} style={{ fontSize: '10px' }}>{isEmergency ? 'STAT' : 'Routine'}</span></td>
                    <td style={{ textAlign: 'right' }}>
                      {isRecovery || isDischarge ? (
                        <Button size="xs" variant="primary" iconRight={ChevronRight} onClick={(e) => { e.stopPropagation(); openRecoveryDrawer(p); }}>
                          Recovery
                        </Button>
                      ) : (
                        <Button size="xs" variant="secondary" iconRight={ChevronRight} onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); }}>
                          View
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Recovery & Discharge Workspace Drawer */}
      {showRecoveryDrawer && recoveryPatient && (
        <RecoveryDischargeDrawer
          patient={recoveryPatient}
          workflow={workflow}
          onClose={() => { setShowRecoveryDrawer(false); setRecoveryPatient(null); }}
        />
      )}

      {/* 6. Patient Detail Panel (for non-recovery patients) */}
      {liveSelected && !showRecoveryDrawer && (
        <PatientDetailPanel
          patient={liveSelected}
          onClose={() => setSelectedPatient(null)}
          workflow={workflow}
        />
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   RECOVERY & DISCHARGE WORKSPACE DRAWER
   Full-featured centered modal for post-op care, monitoring, checklists,
   discharge blockers, and handoff confirmation.
   ═══════════════════════════════════════════════════════════════════════ */
const RecoveryDischargeDrawer = ({ patient, workflow, onClose }) => {
  const p = patient;
  const st = (p.admission_status || '').toUpperCase();
  const isEmergency = p.urgency === 'EMERGENCY' || p.priority === 'EMERGENCY';

  // Local checklist states
  const [recoveryChecklist, setRecoveryChecklist] = useState({
    identityVerified: true,
    procedureDocComplete: true,
    vitalsRecorded: true,
    painAssessed: true,
    recoveryAssessment: st !== 'RECOVERY',
    postOpInstructions: st !== 'RECOVERY',
    complicationsReviewed: true,
    transferCriteria: st !== 'RECOVERY',
  });

  const [dischargeChecklist, setDischargeChecklist] = useState({
    doctorCleared: p.dischargeClearance === 'CLEARED',
    nursingAssessment: p.nursingDischargeComplete || false,
    finalVitals: true,
    medicationInstructions: true,
    followUpInstructions: true,
    dischargeSummary: st === 'DISCHARGE_READY',
    adminCleared: p.adminClearance || p.billingCleared || false,
  });

  const [noteText, setNoteText] = useState('');
  const [showDischargeConfirm, setShowDischargeConfirm] = useState(false);

  const recoveryComplete = Object.values(recoveryChecklist).every(Boolean);
  const allDischargeReqs = Object.values(dischargeChecklist).every(Boolean);

  const toggleRecoveryItem = (key) => setRecoveryChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  const toggleDischargeItem = (key) => setDischargeChecklist(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAdvanceRecovery = () => {
    if (workflow.advancePatientWorkflow) {
      const res = workflow.advancePatientWorkflow(p.id || p.patient_code);
      if (res && !res.success) {
        alert(`BLOCKED: ${res.reason}`);
      }
    }
  };

  const handleSetDischargeFlags = () => {
    if (workflow.completeRecovery) {
      workflow.completeRecovery(p.id || p.patient_code, {
        doctorCleared: dischargeChecklist.doctorCleared,
        nursingComplete: dischargeChecklist.nursingAssessment,
        adminCleared: dischargeChecklist.adminCleared,
      });
    }
  };

  const handleDischarge = () => {
    handleSetDischargeFlags();
    setTimeout(() => {
      if (workflow.dischargePatient) {
        const res = workflow.dischargePatient(p.id || p.patient_code, {
          doctorCleared: dischargeChecklist.doctorCleared,
          nursingComplete: dischargeChecklist.nursingAssessment,
          adminCleared: dischargeChecklist.adminCleared,
        });
        if (res && !res.success) {
          alert(`DISCHARGE BLOCKED: ${res.reason}`);
          setShowDischargeConfirm(false);
        } else {
          alert(`Patient ${p.full_name} has been DISCHARGED. Workflow closed.`);
          onClose();
        }
      }
    }, 100);
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    if (workflow.addClinicalNote) {
      workflow.addClinicalNote(p.id || p.patient_code, {
        author: 'Nurse Maria Vance, BSN',
        note: noteText.trim(),
        type: 'Recovery',
      });
    }
    setNoteText('');
  };

  // Patient timeline from workflow events
  const timeline = (workflow.timelineEvents || []).filter(
    evt => evt.patientCode === p.patient_code || evt.patientName === p.full_name
  ).slice(0, 15);

  return (
    <div className="synchro-workspace-backdrop" onClick={onClose}>
      <div className="synchro-patient-workspace-modal font-sans" onClick={(e) => e.stopPropagation()}>

        {/* Top Bar */}
        <div className="workspace-top-bar">
          <button className="workspace-back-btn font-sans" onClick={onClose} type="button">
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            <span>Back to Nursing Dashboard</span>
          </button>
          <div className="workspace-top-right">
            <div className="workspace-emr-badge font-mono">
              <HeartPulse size={14} className="text-teal" /> RECOVERY & DISCHARGE WORKSPACE
            </div>
            <button className="workspace-close-btn" onClick={onClose} aria-label="Close" type="button">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="workspace-scroll-content">

          {/* Patient Header */}
          <div className="patient-workspace-header">
            <div className="header-left-group">
              <div className={`patient-avatar-box font-display ${isEmergency ? 'avatar-emergency' : ''}`}>
                {(p.full_name || 'P').split(' ').map(n => n[0]).join('')}
              </div>
              <div className="header-info-column">
                <div className="patient-title-line">
                  <h1 className="patient-main-name font-display">{p.full_name}</h1>
                  <span className="patient-mrn-badge font-mono">MRN {p.patient_code}</span>
                </div>
                <div className="patient-procedure-subtitle font-sans font-semibold">{p.procedure}</div>
                <div className="patient-meta-row font-sans">
                  <span className="meta-item">Age {p.age}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">{p.gender}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">Blood Group <strong>{p.blood_group || 'O+'}</strong></span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">Surgeon: <strong>{p.assigned_doctor}</strong></span>
                </div>
              </div>
            </div>
            <div className="header-right-actions">
              <div className="header-status-badges">
                <Badge variant={st === 'DISCHARGED' ? 'emerald' : st === 'DISCHARGE_READY' ? 'teal' : st === 'RECOVERY' ? 'indigo' : 'blue'} size="md">
                  {st.replace(/_/g, ' ')}
                </Badge>
                {isEmergency && <Badge variant="red" size="md">EMERGENCY</Badge>}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="patient-summary-grid font-sans">
            <div className="summary-card">
              <span className="summary-card-label">RECOVERY STATUS</span>
              <div className="summary-card-val font-bold text-teal">{p.recoveryStatus || 'STABLE'}</div>
              <span className="summary-card-sub font-mono">Vitals: {p.vitalsStatus || 'Normal'}</span>
            </div>
            <div className="summary-card">
              <span className="summary-card-label">PAIN ASSESSMENT</span>
              <div className="summary-card-val font-bold text-navy-dark">{p.painScore !== undefined ? `${p.painScore} / 10` : '3 / 10'}</div>
              <span className="summary-card-sub">Visual Analog Scale</span>
            </div>
            <div className="summary-card">
              <span className="summary-card-label">OXYGEN / SUPPORT</span>
              <div className="summary-card-val font-bold text-teal">NORMAL</div>
              <span className="summary-card-sub font-mono">SpO2 97% • Room Air</span>
            </div>
            <div className="summary-card">
              <span className="summary-card-label">COMPLICATIONS</span>
              <div className="summary-card-val font-bold text-teal">NONE</div>
              <span className="summary-card-sub">No adverse events</span>
            </div>
          </div>

          {/* Two Column Grid */}
          <div className="workspace-columns-grid">

            {/* LEFT: Recovery Checklist + Discharge Checklist */}
            <div className="workspace-column-left">

              {/* Recovery Checklist */}
              <div className="info-card">
                <div className="info-card-header">
                  <ClipboardList size={16} className="text-indigo" />
                  <h3 className="info-card-title font-display">Post-Op Recovery Checklist</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'identityVerified', label: 'Patient identity verified' },
                    { key: 'procedureDocComplete', label: 'Procedure documentation complete' },
                    { key: 'vitalsRecorded', label: 'Vitals recorded' },
                    { key: 'painAssessed', label: 'Pain assessed' },
                    { key: 'recoveryAssessment', label: 'Recovery assessment complete' },
                    { key: 'postOpInstructions', label: 'Post-op instructions documented' },
                    { key: 'complicationsReviewed', label: 'Complications reviewed' },
                    { key: 'transferCriteria', label: 'Transfer criteria assessed' },
                  ].map(item => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', backgroundColor: recoveryChecklist[item.key] ? '#f0fdf4' : '#fffbe6', cursor: 'pointer', fontSize: '12px' }}>
                      <input type="checkbox" checked={recoveryChecklist[item.key]} onChange={() => toggleRecoveryItem(item.key)} style={{ width: '16px', height: '16px', accentColor: '#0d9488' }} />
                      <span style={{ fontWeight: 500, color: recoveryChecklist[item.key] ? '#15803d' : '#92400e' }}>
                        {recoveryChecklist[item.key] ? '✓' : '○'} {item.label}
                      </span>
                    </label>
                  ))}
                </div>

                {recoveryComplete ? (
                  <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '12px', textAlign: 'center' }}>
                    ✓ ALL RECOVERY REQUIREMENTS COMPLETE
                  </div>
                ) : (
                  <div style={{ marginTop: '12px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#fffbe6', color: '#92400e', fontWeight: 700, fontSize: '12px', textAlign: 'center' }}>
                    ⚠ RECOVERY CHECKLIST INCOMPLETE — DISCHARGE BLOCKED
                  </div>
                )}

                {recoveryComplete && (st === 'RECOVERY' || st === 'POST_OP_MONITORING') && (
                  <div style={{ marginTop: '10px' }}>
                    <Button size="sm" variant="primary" icon={ArrowRight} onClick={handleAdvanceRecovery}>
                      ADVANCE TO NEXT STAGE
                    </Button>
                  </div>
                )}
              </div>

              {/* Discharge Readiness Checklist */}
              <div className="info-card">
                <div className="info-card-header">
                  <LogOut size={16} className="text-emerald" />
                  <h3 className="info-card-title font-display">Discharge Readiness Checklist</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {[
                    { key: 'doctorCleared', label: 'Doctor discharge assessment', critical: true },
                    { key: 'nursingAssessment', label: 'Nursing discharge assessment', critical: true },
                    { key: 'finalVitals', label: 'Final vitals recorded' },
                    { key: 'medicationInstructions', label: 'Medication instructions provided' },
                    { key: 'followUpInstructions', label: 'Follow-up instructions provided' },
                    { key: 'dischargeSummary', label: 'Discharge summary complete' },
                    { key: 'adminCleared', label: 'Administrative / billing clearance', critical: true },
                  ].map(item => (
                    <label key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', backgroundColor: dischargeChecklist[item.key] ? '#f0fdf4' : item.critical ? '#fee2e2' : '#fffbe6', cursor: 'pointer', fontSize: '12px' }}>
                      <input type="checkbox" checked={dischargeChecklist[item.key]} onChange={() => toggleDischargeItem(item.key)} style={{ width: '16px', height: '16px', accentColor: '#0d9488' }} />
                      <span style={{ fontWeight: 500, color: dischargeChecklist[item.key] ? '#15803d' : item.critical ? '#b91c1c' : '#92400e' }}>
                        {dischargeChecklist[item.key] ? '✓' : '✗'} {item.label} {item.critical && !dischargeChecklist[item.key] ? '(REQUIRED)' : ''}
                      </span>
                    </label>
                  ))}
                </div>

                {!allDischargeReqs && (
                  <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#b91c1c', fontWeight: 700, fontSize: '12px' }}>
                    <AlertTriangle size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                    DISCHARGE BLOCKED — {!dischargeChecklist.doctorCleared ? 'Doctor discharge assessment pending' : !dischargeChecklist.nursingAssessment ? 'Nursing checklist incomplete' : !dischargeChecklist.adminCleared ? 'Administrative clearance pending' : 'Requirements incomplete'}
                  </div>
                )}

                {allDischargeReqs && st !== 'DISCHARGED' && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 700, fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>
                      ✓ ALL DISCHARGE REQUIREMENTS COMPLETE — PATIENT READY
                    </div>
                    <Button size="md" variant="primary" icon={LogOut} onClick={() => setShowDischargeConfirm(true)}>
                      COMPLETE DISCHARGE
                    </Button>
                  </div>
                )}

                {st === 'DISCHARGED' && (
                  <div style={{ marginTop: '12px', padding: '12px 14px', borderRadius: '8px', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', fontWeight: 700, fontSize: '13px', textAlign: 'center' }}>
                    ✓ PATIENT DISCHARGED — WORKFLOW CLOSED<br />
                    <span style={{ fontWeight: 500, fontSize: '11px' }}>Discharged: {p.dischargeDate || 'Today'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Timeline + Notes + Monitoring */}
            <div className="workspace-column-right">

              {/* Monitoring Card */}
              <div className="info-card">
                <div className="info-card-header">
                  <HeartPulse size={16} className="text-red" />
                  <h3 className="info-card-title font-display">Recovery Monitoring</h3>
                </div>
                <div className="info-grid-2col font-sans">
                  <div className="info-cell">
                    <span className="info-cell-label">VITALS STATUS</span>
                    <span className="info-cell-val font-bold text-teal">{p.vitalsStatus || 'STABLE'}</span>
                  </div>
                  <div className="info-cell">
                    <span className="info-cell-label">PAIN SCORE</span>
                    <span className="info-cell-val font-bold text-navy-dark">{p.painScore !== undefined ? `${p.painScore}/10` : '3/10'}</span>
                  </div>
                  <div className="info-cell">
                    <span className="info-cell-label">OXYGEN</span>
                    <span className="info-cell-val font-bold text-teal">SpO2 97% • Room Air</span>
                  </div>
                  <div className="info-cell">
                    <span className="info-cell-label">CONSCIOUSNESS</span>
                    <span className="info-cell-val font-bold text-teal">Alert & Oriented</span>
                  </div>
                  <div className="info-cell">
                    <span className="info-cell-label">RECOVERY ARRIVAL</span>
                    <span className="info-cell-val font-mono">{p.recoveryArrival || '11:42 AM'}</span>
                  </div>
                  <div className="info-cell">
                    <span className="info-cell-label">COMPLICATIONS</span>
                    <span className="info-cell-val font-bold text-teal">None reported</span>
                  </div>
                </div>
              </div>

              {/* Add Note */}
              <div className="info-card">
                <div className="info-card-header">
                  <FileText size={16} className="text-blue" />
                  <h3 className="info-card-title font-display">Recovery / Post-Op Notes</h3>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    className="manual-text-input"
                    placeholder="Add recovery or post-op note..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <Button size="sm" variant="primary" icon={Plus} onClick={handleAddNote}>Add</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                  {(p.clinical_notes || []).slice(0, 5).map((n, i) => (
                    <div key={i} style={{ padding: '8px 10px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '11px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span className="font-bold text-navy-head">{n.author}</span>
                        <span className="font-mono text-muted">{n.date}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-primary)' }}>{n.note}</p>
                    </div>
                  ))}
                  {(!p.clinical_notes || p.clinical_notes.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      No recovery notes yet. Add the first observation above.
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Journey Timeline */}
              <div className="info-card">
                <div className="info-card-header">
                  <Activity size={16} className="text-purple" />
                  <h3 className="info-card-title font-display">Complete Patient Journey</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '260px', overflowY: 'auto' }}>
                  {timeline.length > 0 ? timeline.map((evt, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '6px 8px', borderRadius: '6px', backgroundColor: i % 2 === 0 ? '#f8fafc' : '#ffffff', fontSize: '11px' }}>
                      <span className="font-mono text-blue font-bold" style={{ minWidth: '60px' }}>{evt.timestamp}</span>
                      <span style={{ flex: 1, color: 'var(--text-primary)' }}>{evt.desc}</span>
                      <span className="font-mono text-muted" style={{ minWidth: '80px', textAlign: 'right', fontSize: '10px' }}>{evt.actor}</span>
                    </div>
                  )) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
                      Patient journey events will appear here as the workflow progresses.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="workspace-footer-bar font-sans">
          <div className="footer-left-info">
            <HeartPulse size={16} className="text-teal" />
            <span>SYNCHRO Recovery Workspace • Patient <strong>{p.full_name} ({p.patient_code})</strong></span>
          </div>
          <div className="footer-right-actions">
            {st !== 'DISCHARGED' && (
              <Button size="sm" variant="secondary" icon={ArrowRight} onClick={handleAdvanceRecovery}>
                Advance Workflow
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Discharge Confirmation Modal */}
      {showDischargeConfirm && (
        <div className="synchro-workspace-backdrop" style={{ zIndex: 1200 }} onClick={() => setShowDischargeConfirm(false)}>
          <div className="synchro-modal-box font-sans" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className="modal-box-header">
              <h3 className="modal-box-title font-display">Confirm Patient Discharge</h3>
              <button onClick={() => setShowDischargeConfirm(false)} className="modal-close-btn"><X size={18} /></button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-navy-head)', marginBottom: '4px' }}>
                  Confirm discharge for:
                </div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-navy-head)' }}>{p.full_name}</div>
                <div className="font-mono text-blue font-bold" style={{ fontSize: '13px' }}>{p.patient_code}</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#dcfce7', marginBottom: '16px', fontSize: '12px', fontWeight: 600, color: '#15803d', textAlign: 'center' }}>
                ✓ All mandatory requirements: COMPLETE
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <Button size="md" variant="secondary" onClick={() => setShowDischargeConfirm(false)}>Cancel</Button>
                <Button size="md" variant="primary" icon={LogOut} onClick={handleDischarge}>
                  CONFIRM DISCHARGE
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
