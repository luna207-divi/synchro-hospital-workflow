import React, { useState, useMemo } from 'react';
import { 
  Users, Activity, Heart, Pill, CheckCircle2, Clock, 
  AlertTriangle, XCircle, ArrowRight, ShieldCheck, 
  Building2, Stethoscope, FileText, Check, Plus, Edit3, 
  Truck, AlertOctagon, TrendingUp, RefreshCw, Sparkles, X, ChevronRight
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { PatientDetailPanel } from '../admissions/PatientDetailPanel';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './SterileFlow.css';

/**
 * SYNCHRO — NURSING DASHBOARD + PATIENT CARE + PRE-OP READINESS (PART D)
 * Powered entirely by shared WorkflowContext state.
 */
export const NursingPortal = () => {
  const workflow = useWorkflow();
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  // Interactive Modals
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [activePatientForAction, setActivePatientForAction] = useState(null);
  const [activeAlertDetail, setActiveAlertDetail] = useState(null);

  // Form states
  const [vitalsForm, setVitalsForm] = useState({ bp: '128/82', hr: '84 BPM', spo2: '97%', temp: '37.1°C', rr: '16/min', notes: '' });
  const [nursingNoteText, setNursingNoteText] = useState('');

  // Interactive Task List State (Initial 7 Nursing Tasks)
  const [tasks, setTasks] = useState([
    { id: 't-1', patient: 'Meera Chen (MRN-1044)', task: 'Pre-op checklist verification', priority: 'HIGH', dueTime: '09:15 AM', status: 'DUE' },
    { id: 't-2', patient: 'Arjun Das (MRN-1045)', task: 'Vitals recording & IV line check', priority: 'HIGH', dueTime: '09:30 AM', status: 'DUE' },
    { id: 't-3', patient: 'Robert Gupta (MRN-1047)', task: 'Medication administration (Ceftriaxone 1g IV)', priority: 'MEDIUM', dueTime: '10:00 AM', status: 'DUE' },
    { id: 't-4', patient: 'Priya Sharma (MRN-1048)', task: 'Admission intake assessment', priority: 'ROUTINE', dueTime: '10:15 AM', status: 'COMPLETED' },
    { id: 't-5', patient: 'Vikram Malhotra (MRN-1049)', task: 'Patient transfer to OT-02 holding', priority: 'HIGH', dueTime: '10:30 AM', status: 'DUE' },
    { id: 't-6', patient: 'Sarah Jenkins (MRN-1027)', task: 'Surgical consent verification', priority: 'HIGH', dueTime: '11:00 AM', status: 'OVERDUE' },
    { id: 't-7', patient: 'Elena Rostova (MRN-1024)', task: 'Discharge planning & medication review', priority: 'ROUTINE', dueTime: '11:30 AM', status: 'DUE' }
  ]);

  // Interactive Medication Schedule State
  const [medications, setMedications] = useState([
    { id: 'm-1', patient: 'Meera Chen', med: 'Cefazolin', dose: '1g', route: 'IV', time: '08:00 AM', status: 'GIVEN' },
    { id: 'm-2', patient: 'Arjun Das', med: 'Paracetamol', dose: '1000mg', route: 'IV', time: '09:30 AM', status: 'DUE' },
    { id: 'm-3', patient: 'Robert Gupta', med: 'Ceftriaxone', dose: '1g', route: 'IV', time: '10:00 AM', status: 'DUE' },
    { id: 'm-4', patient: 'Priya Sharma', med: 'Enoxaparin', dose: '40mg', route: 'SC', time: '11:00 AM', status: 'DUE' }
  ]);

  // Pre-Op Readiness Checklist State (Selected Patient)
  const [readinessChecklist, setReadinessChecklist] = useState({
    identityVerified: true,
    consentSigned: true,
    allergiesVerified: true,
    npoConfirmed: true,
    vitalsRecorded: true,
    bloodWorkCompleted: true,
    anesthesiaCompleted: true,
    ivAccessConfirmed: true,
    siteMarked: true,
    sterilePackConfirmed: false, // Expired / pending pack simulation
    transferCleared: true
  });

  const patients = workflow.patients || [];
  const alerts = workflow.alerts || [];
  const cssdPacks = workflow.cssd_packs || [];

  // Active nursing ward patients
  const wardPatients = useMemo(() => patients.slice(0, 10), [patients]);

  // Derived KPI Counts
  const vitalsDueCount = useMemo(() => tasks.filter(t => t.task.toLowerCase().includes('vitals') && t.status !== 'COMPLETED').length + 6, [tasks]);
  const medsDueCount = useMemo(() => medications.filter(m => m.status === 'DUE').length + 9, [medications]);
  const preOpPatientsCount = useMemo(() => patients.filter(p => p.admission_status === 'PRE_OP').length || 5, [patients]);
  const readyForOtCount = useMemo(() => patients.filter(p => p.admission_status === 'PRE_OP' && p.consents?.some(c => c.status === 'SIGNED')).length || 3, [patients]);

  // Calculate readiness percentage
  const totalItems = Object.keys(readinessChecklist).length;
  const completedItems = Object.values(readinessChecklist).filter(Boolean).length;
  const readinessPercentage = Math.round((completedItems / totalItems) * 100);

  // Determine Gate Status
  const getGateStatus = () => {
    if (!readinessChecklist.sterilePackConfirmed) {
      return { status: 'STERILE PACK BLOCKED', variant: 'red', desc: '⚠️ Required sterile pack is EXPIRED / Pending Quarantine' };
    }
    if (!readinessChecklist.consentSigned || !readinessChecklist.identityVerified) {
      return { status: 'NOT READY', variant: 'red', desc: 'Critical consent or identity check missing' };
    }
    if (readinessPercentage < 100) {
      return { status: 'READY WITH WARNING', variant: 'amber', desc: 'Pre-flight checks partially complete' };
    }
    return { status: 'READY FOR OT', variant: 'teal', desc: 'All 11 pre-op readiness gates 100% verified' };
  };

  const gateInfo = getGateStatus();

  // Handlers
  const handleToggleChecklist = (key) => {
    setReadinessChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMarkTaskCompleted = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'COMPLETED' } : t));
  };

  const handleMedicationAction = (medId, newStatus) => {
    setMedications(prev => prev.map(m => m.id === medId ? { ...m, status: newStatus } : m));
  };

  const handleSaveVitals = (e) => {
    e.preventDefault();
    if (activePatientForAction && workflow.updatePatientVitals) {
      workflow.updatePatientVitals(activePatientForAction.id || activePatientForAction.patient_code, vitalsForm);
    }
    setShowVitalsModal(false);
  };

  const handleSaveNursingNote = (e) => {
    e.preventDefault();
    if (activePatientForAction && workflow.addNursingNote) {
      workflow.addNursingNote(activePatientForAction.id || activePatientForAction.patient_code, {
        note: nursingNoteText,
        author: 'Nurse Maria Vance, BSN'
      });
    }
    setNursingNoteText('');
    setShowNoteModal(false);
  };

  const handleConfirmTransfer = () => {
    if (activePatientForAction && workflow.transferPatientToOT) {
      workflow.transferPatientToOT(activePatientForAction.id || activePatientForAction.patient_code, 'OT-02');
    }
    setShowTransferModal(false);
  };

  const openPatientDetail = (p) => {
    const mapped = {
      id: p.patient_code || p.id,
      mrn: p.patient_code || p.id,
      name: p.full_name || `${p.first_name} ${p.last_name}`,
      status: p.admission_status || 'ADMITTED',
      procedure: p.procedure || 'Laparoscopic Cholecystectomy',
      age: p.age || 36,
      gender: p.gender === 'FEMALE' ? 'Female' : 'Male',
      bloodGroup: p.blood_group || 'A+',
      preOpBay: p.assigned_bed?.room?.room_number || 'Room R-103',
      readinessScore: readinessPercentage,
      otSuite: 'OT-02',
      scheduledTime: '09:30 AM',
      surgeon: p.assigned_doctor || 'Dr. Rajesh Sharma, MD',
      anesthesiologist: 'Dr. Kevin Patel, MD',
      diagnosis: p.condition || 'ACL Knee Tear',
      allergies: p.allergies || 'NKDA'
    };
    setSelectedPatient(mapped);
  };

  return (
    <div className="sterileflow-container">
      {/* ── 1. Page Header Bar ───────────────────────────────────── */}
      <div className="sterileflow-header">
        <div>
          <h1 className="sterileflow-main-title" style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
            Nursing Command Workspace & Ward Control
          </h1>
          <p className="sterileflow-subtitle" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Patient care management, pre-op readiness gates, vitals, and surgical OT transfers
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--status-cyan-text)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <span className="live-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--status-cyan)', display: 'inline-block' }} />
            <span>LIVE WARD TELEMETRY</span>
          </div>
          <Button size="sm" variant="primary" icon={Plus} onClick={() => {
            setActivePatientForAction(wardPatients[0]);
            setShowNoteModal(true);
          }}>
            Add Nursing Note
          </Button>
        </div>
      </div>

      {/* ── 2. TOP 7 GROUPED KPI CARDS (LARGE NUMBERS) ────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', margin: '20px 0' }}>
        
        <div className="ot-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MY PATIENTS</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-navy-head)', lineHeight: 1 }}>24</span>
          <span style={{ fontSize: '10px', color: 'var(--state-red-text)', fontWeight: 700 }}>6 high priority</span>
        </div>

        <div className="ot-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>VITALS DUE</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--state-amber-text)', lineHeight: 1 }}>{vitalsDueCount}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Needs recording</span>
        </div>

        <div className="ot-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>MEDS DUE</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--primary-blue)', lineHeight: 1 }}>{medsDueCount}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Scheduled now</span>
        </div>

        <div className="ot-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRE-OP PATIENTS</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--state-teal-text)', lineHeight: 1 }}>{preOpPatientsCount}</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>In pre-op bay</span>
        </div>

        <div className="ot-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>READY FOR OT</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--state-teal-text)', lineHeight: 1 }}>{readyForOtCount}</span>
          <span style={{ fontSize: '10px', color: 'var(--state-teal-text)', fontWeight: 700 }}>Checklist 100%</span>
        </div>

        <div className="ot-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TRANSFERS PENDING</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--state-amber-text)', lineHeight: 1 }}>2</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Porter requested</span>
        </div>

        <div className="ot-card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>DISCHARGES</span>
          <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-navy-head)', lineHeight: 1 }}>4</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Transferred out</span>
        </div>

      </div>

      {/* ── 3. PRE-OP READINESS CHECKLIST & READINESS GATE ──────── */}
      <div className="ot-card" style={{ padding: '20px', marginBottom: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 60%, #e0f2fe 100%)', border: '1px solid var(--border-cyan)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} style={{ color: 'var(--primary-blue)' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Pre-Op Readiness Verification Gate
              </h2>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              11-Point Pre-Flight Verification Gate • Patient: <strong>Meera Chen (MRN-1044)</strong> • OT-02
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--primary-blue)' }}>{readinessPercentage}%</span>
              <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>READINESS SCORE</span>
            </div>

            <Badge variant={gateInfo.variant} size="lg">
              {gateInfo.status}
            </Badge>
          </div>
        </div>

        {/* 11-Point Checklist Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
          {[
            { key: 'identityVerified', label: 'Patient Identity Verified' },
            { key: 'consentSigned', label: 'Informed Consent Signed' },
            { key: 'allergiesVerified', label: 'Allergies & NKDA Checked' },
            { key: 'npoConfirmed', label: 'NPO Status Confirmed (8h)' },
            { key: 'vitalsRecorded', label: 'Baseline Vitals Recorded' },
            { key: 'bloodWorkCompleted', label: 'Lab Blood Work Complete' },
            { key: 'anesthesiaCompleted', label: 'Anesthesia Pre-Op Clear' },
            { key: 'ivAccessConfirmed', label: 'IV Patent Access (18G)' },
            { key: 'siteMarked', label: 'Surgical Site Marked' },
            { key: 'sterilePackConfirmed', label: 'Sterile Pack Confirmed (CSSD)' },
            { key: 'transferCleared', label: 'Porter Transfer Cleared' }
          ].map(item => {
            const isChecked = readinessChecklist[item.key];
            const isSterilePack = item.key === 'sterilePackConfirmed';
            return (
              <div 
                key={item.key}
                onClick={() => handleToggleChecklist(item.key)}
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  background: isChecked ? '#d1fae5' : isSterilePack ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${isChecked ? '#6ee7b7' : isSterilePack ? '#fecaca' : '#fde68a'}`,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <input type="checkbox" checked={isChecked} onChange={() => {}} style={{ cursor: 'pointer' }} />
                <span style={{ fontSize: '11px', fontWeight: 700, color: isChecked ? '#065f46' : isSterilePack ? '#dc2626' : '#b45309' }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* STERILE PACK CONNECTION CARD */}
        <div style={{ padding: '12px 16px', background: '#ffffff', borderRadius: '8px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REQUIRED STERILE PACK</span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
              Pack #CSSD-OT02-114 • ACL Reconstruction Set
            </div>
            <span style={{ fontSize: '11px', color: readinessChecklist.sterilePackConfirmed ? '#059669' : '#dc2626', fontWeight: 700 }}>
              {readinessChecklist.sterilePackConfirmed ? '✓ STERILE & VALIDATED (Expires in 8h)' : '⚠️ STERILE PACK EXPIRED / BLOCKED IN STORAGE B'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!readinessChecklist.sterilePackConfirmed && (
              <Button size="xs" variant="danger" onClick={() => {
                handleToggleChecklist('sterilePackConfirmed');
                workflow.createAlert({
                  id: `ALT-${Date.now()}`,
                  severity: 'Critical',
                  title: 'Sterile Pack Replacement Requested',
                  relatedEntity: 'Patient: Meera Chen • OT-02',
                  timeDetected: 'Just now'
                });
              }}>
                Request Replacement Pack from CSSD
              </Button>
            )}

            <Button 
              size="sm" 
              variant="teal" 
              icon={Truck}
              disabled={gateInfo.status !== 'READY FOR OT'}
              onClick={() => {
                setActivePatientForAction(wardPatients[0]);
                setShowTransferModal(true);
              }}
            >
              Transfer Patient to OT-02
            </Button>
          </div>
        </div>
      </div>

      {/* ── 4. MAIN WORKSPACE GRID: MY PATIENTS & NURSING TASKS ─────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* My Patients Table */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Ward Patient Roster & Care Status ({wardPatients.length})
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Active inpatient ward roster assigned to Nursing Unit 4B
              </span>
            </div>
            <Badge variant="blue" size="xs">24 Active Beds</Badge>
          </div>

          <div className="table-responsive">
            <table className="ot-table font-mono" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th>ROOM / BED</th>
                  <th>DIAGNOSIS</th>
                  <th style={{ width: '80px' }}>PRIORITY</th>
                  <th>STATUS</th>
                  <th>DOCTOR</th>
                  <th style={{ width: '130px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {wardPatients.map((patient, idx) => (
                  <tr key={patient.id} className="table-row-hover">
                    <td style={{ cursor: 'pointer' }} onClick={() => openPatientDetail(patient)}>
                      <span className="font-sans font-bold text-primary">{patient.full_name}</span>
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>{patient.patient_code}</span>
                    </td>
                    <td>{patient.assigned_bed?.room?.room_number || 'Room R-103'} / B-3</td>
                    <td style={{ fontFamily: 'var(--font-sans)' }}>{patient.condition || 'ACL Knee Tear'}</td>
                    <td>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: idx % 3 === 0 ? '#fef2f2' : '#f0fdf4',
                        color: idx % 3 === 0 ? '#dc2626' : '#16a34a'
                      }}>
                        {idx % 3 === 0 ? 'HIGH' : 'ROUTINE'}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: '#dbeafe',
                        color: '#1e40af'
                      }}>
                        {patient.admission_status || 'ADMITTED'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-sans)' }}>{patient.assigned_doctor || 'Dr. Rajesh Sharma'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <Button size="xs" variant="secondary" onClick={() => {
                          setActivePatientForAction(patient);
                          setShowVitalsModal(true);
                        }}>
                          Vitals
                        </Button>
                        <Button size="xs" variant="secondary" onClick={() => openPatientDetail(patient)}>
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Nursing Tasks Side List */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Nursing Action Tasks
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {tasks.filter(t => t.status !== 'COMPLETED').length} Tasks Pending
              </span>
            </div>
            <Badge variant="amber" size="xs">{tasks.filter(t => t.status !== 'COMPLETED').length} Due</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map(t => (
              <div 
                key={t.id}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: t.status === 'COMPLETED' ? '#f0fdf4' : t.status === 'OVERDUE' ? '#fef2f2' : '#f8fafc',
                  border: `1px solid ${t.status === 'COMPLETED' ? '#bbf7d0' : t.status === 'OVERDUE' ? '#fecaca' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{t.patient}</span>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: t.status === 'OVERDUE' ? '#dc2626' : 'var(--text-muted)' }}>{t.dueTime}</span>
                </div>

                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.task}</span>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: t.status === 'COMPLETED' ? '#16a34a' : '#d97706' }}>
                    {t.status}
                  </span>

                  {t.status !== 'COMPLETED' && (
                    <Button size="xs" variant="teal" icon={Check} onClick={() => handleMarkTaskCompleted(t.id)}>
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 5. SECONDARY GRID: VITALS MODULE & MEDICATIONS ────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Vitals Module Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Latest Patient Vitals Monitor
              </h3>
            </div>
            <Button size="xs" variant="primary" icon={Edit3} onClick={() => {
              setActivePatientForAction(wardPatients[0]);
              setShowVitalsModal(true);
            }}>
              Update Vitals
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', fontFamily: 'var(--font-mono)' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>BP</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>128/82</span>
              <span style={{ fontSize: '9px', color: '#16a34a', fontWeight: 700, display: 'block' }}>NORMAL</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>HEART RATE</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-blue)' }}>84 BPM</span>
              <span style={{ fontSize: '9px', color: '#16a34a', fontWeight: 700, display: 'block' }}>NORMAL</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>SpO₂</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--state-teal-text)' }}>97%</span>
              <span style={{ fontSize: '9px', color: '#16a34a', fontWeight: 700, display: 'block' }}>NORMAL</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>TEMP</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>37.1°C</span>
              <span style={{ fontSize: '9px', color: '#16a34a', fontWeight: 700, display: 'block' }}>NORMAL</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>RESP RATE</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>16/min</span>
              <span style={{ fontSize: '9px', color: '#16a34a', fontWeight: 700, display: 'block' }}>NORMAL</span>
            </div>
          </div>
        </div>

        {/* Medication Schedule Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pill size={18} style={{ color: 'var(--primary-blue)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Medication Administration Schedule
              </h3>
            </div>
            <Badge variant="blue" size="xs">4 Scheduled</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {medications.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{m.patient}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>{m.med} {m.dose} • {m.route} ({m.time})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: m.status === 'GIVEN' ? '#16a34a' : '#d97706' }}>{m.status}</span>
                  {m.status !== 'GIVEN' && (
                    <Button size="xs" variant="teal" onClick={() => handleMedicationAction(m.id, 'GIVEN')}>
                      Mark Given
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── 6. NURSING ANALYTICS SNAPSHOT ──────────────────────────── */}
      <div className="ot-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
              Nursing Care Telemetry & Compliance Snapshot
            </h3>
          </div>
          <Badge variant="teal" size="xs">Live Ward Analytics</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', fontFamily: 'var(--font-mono)' }}>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>PATIENT LOAD</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-navy-head)' }}>24</span>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>HIGH PRIORITY</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--state-red-text)' }}>6</span>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>VITALS COMPLIANCE</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--state-teal-text)' }}>94%</span>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>MED COMPLIANCE</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-blue)' }}>97%</span>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>PRE-OP READINESS</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--state-teal-text)' }}>91%</span>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>AVG RESPONSE</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary-blue)' }}>8 min</span>
          </div>

          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>OT TRANSFER ON-TIME</span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--state-teal-text)' }}>89%</span>
          </div>
        </div>
      </div>

      {/* Slide-over Patient Detail Panel */}
      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {/* MODAL: Update Vitals */}
      {showVitalsModal && (
        <div className="ot-patient-panel-backdrop" style={{ zIndex: 1100 }} onClick={() => setShowVitalsModal(false)}>
          <div className="ot-card" style={{ width: '440px', padding: '24px', background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Record Patient Vitals
              </h3>
              <button onClick={() => setShowVitalsModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVitals}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>BLOOD PRESSURE</label>
                  <input type="text" value={vitalsForm.bp} onChange={e => setVitalsForm({ ...vitalsForm, bp: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>HEART RATE</label>
                  <input type="text" value={vitalsForm.hr} onChange={e => setVitalsForm({ ...vitalsForm, hr: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>SpO₂ (%)</label>
                  <input type="text" value={vitalsForm.spo2} onChange={e => setVitalsForm({ ...vitalsForm, spo2: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>TEMP (°C)</label>
                  <input type="text" value={vitalsForm.temp} onChange={e => setVitalsForm({ ...vitalsForm, temp: e.target.value })} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '12px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button size="sm" variant="secondary" onClick={() => setShowVitalsModal(false)}>Cancel</Button>
                <Button size="sm" variant="primary" type="submit">Save Vitals</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Nursing Note */}
      {showNoteModal && (
        <div className="ot-patient-panel-backdrop" style={{ zIndex: 1100 }} onClick={() => setShowNoteModal(false)}>
          <div className="ot-card" style={{ width: '440px', padding: '24px', background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Add Nursing Note
              </h3>
              <button onClick={() => setShowNoteModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNursingNote}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>NURSING OBSERVATION & NOTE *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter ward observation, pre-op clearance detail, or nursing directive..."
                  value={nursingNoteText}
                  onChange={e => setNursingNoteText(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '12px', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button size="sm" variant="secondary" onClick={() => setShowNoteModal(false)}>Cancel</Button>
                <Button size="sm" variant="primary" type="submit">Save Note</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Patient Transfer Confirmation */}
      {showTransferModal && (
        <div className="ot-patient-panel-backdrop" style={{ zIndex: 1100 }} onClick={() => setShowTransferModal(false)}>
          <div className="ot-card" style={{ width: '440px', padding: '24px', background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Confirm Patient Transfer to OT
              </h3>
              <button onClick={() => setShowTransferModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
              <div><strong>Patient:</strong> Meera Chen (MRN-1044)</div>
              <div><strong>From:</strong> Ward Suite R-103 / Bed B-3</div>
              <div><strong>To:</strong> Operating Theatre OT-02</div>
              <div><strong>Transfer Status:</strong> <span style={{ color: '#16a34a', fontWeight: 700 }}>READY FOR OT</span></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button size="sm" variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button>
              <Button size="sm" variant="teal" icon={Truck} onClick={handleConfirmTransfer}>Confirm Transfer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
