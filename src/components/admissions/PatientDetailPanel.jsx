import React, { useState } from 'react';
import { 
  X, CheckCircle2, Clock, AlertTriangle, User, FileText, 
  Activity, Stethoscope, Building2, Sparkles, ArrowRight, 
  Check, Send, Printer, ShieldCheck, AlertCircle, Truck, 
  FileCheck2, TestTube2, Plus, Calendar, Edit3, HeartPulse, ClipboardList,
  Flame, PackageCheck, AlertOctagon, RefreshCw, ChevronRight, Bed
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useWorkflow } from '../../context/WorkflowContext';
import { useAuth } from '../../context/AuthContext';
import { enforcePermission } from '../../config/permissions';
import './PatientDetailPanel.css';

/**
 * SYNCHRO — Centered Patient Operations Workspace Modal
 * Large centered workspace modal for comprehensive patient workflow, clinical information,
 * dynamic 7-stage care progress, CSSD kit readiness, OT telemetry, and interactive state transitions.
 */
export const PatientDetailPanel = ({ patient: rawPatient, onClose, onUpdateStatus }) => {
  const workflow = useWorkflow();
  const { profile } = useAuth();
  const userRole = profile?.role || 'DOCTOR';

  // ── 1. Enrich Patient Demo Data Based on Scenario ───────────────────
  const getEnrichedPatient = (input) => {
    if (!input) return null;

    const mrn = input.patient_code || input.mrn || input.id || 'P-1042';
    const name = input.full_name || input.name || 'Ananya Rao';
    const age = input.age || 22;
    const gender = (input.gender || 'Female').toUpperCase() === 'FEMALE' ? 'Female' : 'Male';
    const bloodGroup = input.blood_group || input.bloodGroup || 'A+';
    const isEmergency = (input.priority || '').toUpperCase() === 'EMERGENCY' || mrn === 'P-1099' || name.toLowerCase().includes('arjun');
    const isHighPriority = (input.priority || '').toUpperCase() === 'HIGH' || mrn === 'P-1055' || name.toLowerCase().includes('rahul');

    // Scenario A: Ananya Rao (Routine Surgery)
    if (name.toLowerCase().includes('ananya') || mrn === 'P-1042') {
      return {
        ...input,
        id: mrn,
        mrn: 'P-1042',
        name: 'Ananya Rao',
        age: 22,
        gender: 'Female',
        bloodGroup: 'A+',
        allergies: 'NKDA (No Known Drug Allergies)',
        phone: '+1 (555) 019-2831',
        condition: 'Symptomatic Gallbladder Disease (Cholelithiasis)',
        procedure: 'Laparoscopic Cholecystectomy',
        priority: 'Routine',
        workflowStage: input.workflowStage || 'PRE_OP',
        admissionStatus: 'ADMITTED',
        admissionDate: 'Today, 07:30 AM',
        department: 'General & Laparoscopic Surgery',
        preOpBay: 'Room R-103 / Bed B-3',
        consultant: 'Dr. Rajesh Sharma, MD',
        surgeon: 'Dr. Rajesh Sharma, MD',
        anesthesiologist: 'Dr. Kevin Patel, MD',
        nurse: 'Maria Vance, BSN (CSSD Lead)',
        readinessScore: 92,
        otSuite: 'OT-02',
        scheduledTime: '11:30 AM',
        cssdKit: 'Laparoscopic General Surgery Kit',
        cssdPackId: 'CSSD-LAP-021',
        cssdSterilization: 'Sterile (100% Spore Clear)',
        cssdExpiry: '28 Aug 2026',
        cssdLocation: 'CSSD Vault B',
        cssdStatus: 'READY',
        recoveryBay: 'PACU-03',
        recoveryHandoff: 'Pending Post-Op Transfer'
      };
    }

    // Scenario B: Meera Chen (Orthopedic Surgery)
    if (name.toLowerCase().includes('meera') || mrn === 'P-1048' || (input.procedure || '').toLowerCase().includes('knee') || (input.procedure || '').toLowerCase().includes('hip')) {
      return {
        ...input,
        id: mrn,
        mrn: 'P-1048',
        name: 'Meera Chen',
        age: 58,
        gender: 'Female',
        bloodGroup: 'B+',
        allergies: 'Penicillin',
        phone: '+1 (555) 012-3849',
        condition: 'Degenerative Joint Disease (Knee Osteoarthritis)',
        procedure: 'Total Knee Replacement',
        priority: 'Scheduled',
        workflowStage: input.workflowStage || 'CSSD',
        admissionStatus: 'PRE_OP',
        admissionDate: 'Today, 06:45 AM',
        department: 'Orthopedics & Joint Surgery',
        preOpBay: 'Room R-101 / Bed A-1',
        consultant: 'Dr. James Gomez, MD',
        surgeon: 'Dr. James Gomez, MD',
        anesthesiologist: 'Dr. Kevin Patel, MD',
        nurse: 'Sarah Jenkins, RN',
        readinessScore: 88,
        otSuite: 'OT-01',
        scheduledTime: '10:15 AM',
        cssdKit: 'Orthopedic Joint Replacement Set',
        cssdPackId: 'CSSD-ORTH-088',
        cssdSterilization: 'Sterile (Verified)',
        cssdExpiry: '26 Aug 2026',
        cssdLocation: 'OT-01 Staging Core',
        cssdStatus: 'INSPECTION',
        recoveryBay: 'PACU-01',
        recoveryHandoff: 'Pre-Op Staged'
      };
    }

    // Scenario C: Rahul Shah (Cardiac High Priority)
    if (name.toLowerCase().includes('rahul') || mrn === 'P-1055' || isHighPriority || (input.procedure || '').toLowerCase().includes('cardiac') || (input.procedure || '').toLowerCase().includes('cabg')) {
      return {
        ...input,
        id: mrn,
        mrn: 'P-1055',
        name: 'Rahul Shah',
        age: 62,
        gender: 'Male',
        bloodGroup: 'O+',
        allergies: 'Latex',
        phone: '+1 (555) 018-9921',
        condition: 'Triple Vessel Coronary Artery Disease',
        procedure: 'Coronary Artery Bypass Graft (CABG)',
        priority: 'HIGH PRIORITY',
        workflowStage: input.workflowStage || 'CSSD',
        admissionStatus: 'PRE_OP',
        admissionDate: 'Today, 06:00 AM',
        department: 'Cardiovascular & Thoracic Surgery',
        preOpBay: 'ICU Suite R-204 / Bed ICU-1',
        consultant: 'Dr. Alan Vance, MD',
        surgeon: 'Dr. Alan Vance, MD',
        anesthesiologist: 'Dr. Kevin Patel, MD',
        nurse: 'David Miller, BSN',
        readinessScore: 95,
        otSuite: 'OT-04',
        scheduledTime: '09:30 AM',
        cssdKit: 'Cardiac Surgical Micro-Vascular Set',
        cssdPackId: 'CSSD-CARD-012',
        cssdSterilization: 'Sterile (Fast-Track Cooldown)',
        cssdExpiry: '27 Aug 2026',
        cssdLocation: 'OT-04 Holding Core',
        cssdStatus: 'COOLING',
        recoveryBay: 'ICU PACU-01',
        recoveryHandoff: 'High Priority Prep'
      };
    }

    // Scenario D: Arjun Das (Emergency Surgery)
    if (isEmergency || name.toLowerCase().includes('arjun') || mrn === 'P-1099') {
      return {
        ...input,
        id: mrn,
        mrn: 'P-1099',
        name: 'Arjun Das',
        age: 34,
        gender: 'Male',
        bloodGroup: 'AB+',
        allergies: 'NKDA',
        phone: '+1 (555) 011-7782',
        condition: 'Acute Abdominal Trauma & Laceration',
        procedure: 'Emergency Exploratory Laparotomy',
        priority: 'EMERGENCY',
        workflowStage: input.workflowStage || 'PRE_OP',
        admissionStatus: 'EMERGENCY',
        admissionDate: 'Today, 08:10 AM (STAT)',
        department: 'Trauma & Emergency Surgery',
        preOpBay: 'Emergency Bay ER-02',
        consultant: 'Dr. Rajesh Sharma, MD',
        surgeon: 'Dr. Rajesh Sharma, MD',
        anesthesiologist: 'Dr. Kevin Patel, MD',
        nurse: 'Emergency Response Lead',
        readinessScore: 90,
        otSuite: 'OT-03 (Emergency OT)',
        scheduledTime: 'IMMEDIATE / STAT',
        cssdKit: 'Emergency Trauma Surgical Set',
        cssdPackId: 'CSSD-EMG-701',
        cssdSterilization: 'Sterile (STAT Release)',
        cssdExpiry: '29 Aug 2026',
        cssdLocation: 'CSSD Storage A (STAT Vault)',
        cssdStatus: 'STAT READY',
        recoveryBay: 'Trauma PACU-01',
        recoveryHandoff: 'STAT Emergency Pathway Active'
      };
    }

    // Scenario E: Default / Fallback Patient
    return {
      ...input,
      id: mrn,
      mrn: mrn,
      name: name,
      age: age,
      gender: gender,
      bloodGroup: bloodGroup,
      allergies: input.allergies || 'NKDA',
      phone: input.phone || '+1 (555) 019-2831',
      condition: input.condition || input.procedure || 'Symptomatic Surgical Evaluation',
      procedure: input.procedure || input.condition || 'Laparoscopic Surgical Procedure',
      priority: input.priority || 'Routine',
      workflowStage: input.workflowStage || 'PRE_OP',
      admissionStatus: input.admission_status || input.status || 'ADMITTED',
      admissionDate: 'Today, 08:00 AM',
      department: input.department || 'General Surgery',
      preOpBay: input.preOpBay || 'Room R-103 / Bed B-3',
      consultant: input.assigned_doctor || input.consultant || 'Dr. Rajesh Sharma, MD',
      surgeon: input.assigned_doctor || input.surgeon || 'Dr. Rajesh Sharma, MD',
      anesthesiologist: 'Dr. Kevin Patel, MD',
      nurse: 'Maria Vance, BSN',
      readinessScore: input.readinessScore || 88,
      otSuite: input.otSuite || 'OT-02',
      scheduledTime: '11:30 AM',
      cssdKit: input.cssdKit || 'Laparoscopic General Surgery Kit',
      cssdPackId: input.cssdPackId || 'CSSD-LAP-042',
      cssdSterilization: 'Sterile (Verified)',
      cssdExpiry: '28 Aug 2026',
      cssdLocation: 'CSSD Vault B',
      cssdStatus: 'READY',
      recoveryBay: 'PACU-02',
      recoveryHandoff: 'Inpatient Staged'
    };
  };

  const pData = getEnrichedPatient(rawPatient);

  // ── 2. Local State Management ──────────────────────────────────────
  const [currentStageKey, setCurrentStageKey] = useState(pData?.workflowStage || 'PRE_OP');
  const [selectedTab, setSelectedTab] = useState('WORKFLOW'); // 'WORKFLOW', 'PROFILE', 'CSSD', 'OT'
  
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [localNotes, setLocalNotes] = useState(rawPatient?.clinicalNotes || [
    {
      id: 'n-101',
      author: pData?.surgeon || 'Dr. Rajesh Sharma, MD',
      date: 'Today, 09:15 AM',
      note: `Pre-operative evaluation completed for ${pData?.name}. Patient cleared for ${pData?.procedure}. Vital signs stable, lab values verified.`
    },
    {
      id: 'n-102',
      author: 'Nurse Maria Vance, BSN',
      date: 'Today, 08:30 AM',
      note: 'NPO status confirmed since 12:00 AM. IV line established on right forearm. Pre-op consent signed.'
    }
  ]);

  if (!pData) return null;

  // ── 3. Dynamic 9-Stage Workflow Progress Definition ────────────────
  const STAGES = [
    { key: 'ADMISSION', label: '1. Admission', code: 'ADM', desc: 'Patient intake & bed assignment' },
    { key: 'ASSESSMENT', label: '2. Assessment', code: 'ASS', desc: 'Clinical eval & lab clearance' },
    { key: 'PRE_OP', label: '3. Pre-Op', code: 'PRE', desc: 'NPO, IV prep & consent signed' },
    { key: 'CSSD', label: '4. CSSD Ready', code: 'CSD', desc: 'Sterile pack verification' },
    { key: 'OT', label: '5. OT Suite', code: 'OT', desc: 'Active surgical procedure' },
    { key: 'RECOVERY', label: '6. Recovery', code: 'REC', desc: 'PACU monitoring & vitals' },
    { key: 'POST_OP', label: '7. Post-Op', code: 'POP', desc: 'Post-op monitoring & ward' },
    { key: 'DISCHARGE_ASSESS', label: '8. Disch. Assess', code: 'DAS', desc: 'Discharge readiness eval' },
    { key: 'DISCHARGE', label: '9. Discharge', code: 'DIS', desc: 'Final clearance & release' }
  ];

  const getStageIndex = (stageKey) => {
    const s = (stageKey || '').toUpperCase();
    if (s.includes('DISCHARG') && !s.includes('ASSESS')) return 8;
    if (s.includes('DISCHARGE_ASSESS') || s.includes('DISCHARGE_READY')) return 7;
    if (s.includes('POST_OP') || s.includes('READY_FOR_WARD')) return 6;
    if (s.includes('RECOV')) return 5;
    if (s.includes('SURGERY') || s === 'OT' || s.includes('IN_OT')) return 4;
    if (s.includes('CSSD') || s.includes('STERIL')) return 3;
    if (s.includes('PRE_OP') || s.includes('PREOP') || s.includes('READY')) return 2;
    if (s.includes('ASSESS') || s.includes('TRIAGE')) return 1;
    return 0;
  };

  const activeStageIdx = getStageIndex(currentStageKey);

  const [advancementError, setAdvancementError] = useState(null);

  // ── 4. Workflow Transition Handlers ───────────────────────────────
  const handleAdvanceWorkflow = () => {
    setAdvancementError(null);

    if (workflow.advancePatientWorkflow) {
      const res = workflow.advancePatientWorkflow(pData.id || pData.mrn);
      if (res && res.success) {
        setCurrentStageKey(res.newStage);
        if (onUpdateStatus) {
          onUpdateStatus(pData.id || pData.mrn, res.newStage);
        }
      } else if (res && !res.success) {
        setAdvancementError(res.reason || 'Workflow conditions not satisfied.');
      }
    } else {
      if (activeStageIdx < STAGES.length - 1) {
        const nextStage = STAGES[activeStageIdx + 1].key;
        setCurrentStageKey(nextStage);
        if (onUpdateStatus) {
          onUpdateStatus(pData.id || pData.mrn, nextStage);
        }
      }
    }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const newNote = {
      id: `n-${Date.now()}`,
      author: 'Dr. Rajesh Sharma, MD',
      date: `Today, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      note: noteText.trim()
    };

    setLocalNotes([newNote, ...localNotes]);
    if (workflow.addClinicalNote) {
      workflow.addClinicalNote(pData.id || pData.mrn, newNote);
    }
    setNoteText('');
    setShowNoteModal(false);
  };

  const isEmergency = pData.priority === 'EMERGENCY';

  return (
    /* Light translucent overlay per prompt: rgba(10, 25, 50, 0.20) */
    <div className="synchro-workspace-backdrop" onClick={onClose}>
      <div className="synchro-patient-workspace-modal font-sans" onClick={(e) => e.stopPropagation()}>
        
        {/* ── TOP BACK BAR & CLOSE ───────────────────────────────── */}
        <div className="workspace-top-bar">
          <button className="workspace-back-btn font-sans" onClick={onClose} type="button">
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
            <span>Back to Patient Admissions</span>
          </button>

          <div className="workspace-top-right">
            <div className="workspace-emr-badge font-mono">
              <ShieldCheck size={14} className="text-teal" /> EMR VERIFIED WORKSPACE
            </div>
            <button className="workspace-close-btn" onClick={onClose} aria-label="Close workspace" type="button">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ── MAIN WORKSPACE CONTENT CONTAINER ────────────────────── */}
        <div className="workspace-scroll-content">
          
          {/* ── 1. PATIENT HEADER ───────────────────────────────── */}
          <div className="patient-workspace-header">
            <div className="header-left-group">
              <div className={`patient-avatar-box font-display ${isEmergency ? 'avatar-emergency' : ''}`}>
                {pData.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div className="header-info-column">
                <div className="patient-title-line">
                  <h1 className="patient-main-name font-display">{pData.name}</h1>
                  <span className="patient-mrn-badge font-mono">MRN {pData.mrn}</span>
                </div>

                <div className="patient-procedure-subtitle font-sans font-semibold">
                  {pData.procedure}
                </div>

                <div className="patient-meta-row font-sans">
                  <span className="meta-item">Age {pData.age}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">{pData.gender}</span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">Blood Group <strong>{pData.bloodGroup}</strong></span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">Room: <strong>{pData.preOpBay}</strong></span>
                </div>
              </div>
            </div>

            <div className="header-right-actions">
              <div className="header-status-badges">
                <Badge variant={pData.admissionStatus === 'EMERGENCY' ? 'red' : 'blue'} size="md">
                  {pData.admissionStatus}
                </Badge>
                <Badge variant={isEmergency ? 'red' : pData.priority === 'HIGH PRIORITY' ? 'amber' : 'teal'} size="md">
                  {isEmergency ? '🚨 EMERGENCY' : pData.priority}
                </Badge>
              </div>

              <div className="header-action-buttons">
                <Button size="sm" variant="primary" icon={Plus} onClick={() => setShowNoteModal(true)}>
                  Add Clinical Note
                </Button>
                <Button size="sm" variant="secondary" icon={Calendar} onClick={() => setShowScheduleModal(true)}>
                  Schedule Procedure
                </Button>
                <Button size="sm" variant="secondary" icon={Building2} onClick={() => setSelectedTab('OT')}>
                  View OT
                </Button>
              </div>
            </div>
          </div>

          {/* ── 2. PATIENT STATUS SUMMARY CARDS (4-Card Row) ────── */}
          <div className="patient-summary-grid font-sans">
            <div className="summary-card">
              <span className="summary-card-label">ADMISSION STATUS</span>
              <div className="summary-card-val font-bold text-navy-dark">{pData.admissionStatus}</div>
              <span className="summary-card-sub font-mono">{pData.preOpBay}</span>
            </div>

            <div className="summary-card">
              <span className="summary-card-label">PROCEDURE</span>
              <div className="summary-card-val font-bold text-primary">{pData.procedure}</div>
              <span className="summary-card-sub">{pData.department}</span>
            </div>

            <div className="summary-card">
              <span className="summary-card-label">PRIORITY</span>
              <div className={`summary-card-val font-bold ${isEmergency ? 'text-red' : 'text-teal'}`}>
                {pData.priority}
              </div>
              <span className="summary-card-sub">{isEmergency ? 'STAT Emergency Priority' : 'Elective Block Schedule'}</span>
            </div>

            <div className="summary-card">
              <span className="summary-card-label">ASSIGNED OT SUITE</span>
              <div className="summary-card-val font-mono text-cyan font-bold">{pData.otSuite}</div>
              <span className="summary-card-sub font-mono">{pData.scheduledTime}</span>
            </div>
          </div>

          {/* ── 3. CARE WORKFLOW STAGE PROGRESS (Dynamic Tracker) ── */}
          <div className={`workflow-tracker-card ${isEmergency ? 'tracker-emergency' : ''}`}>
            {isEmergency && (
              <div className="emergency-pathway-banner font-sans font-bold">
                <Flame size={18} className="text-red" />
                <span>🚨 EMERGENCY PATHWAY ACTIVE — FAST-TRACK OT DISPATCH IN PROGRESS</span>
              </div>
            )}

            {advancementError && (
              <div style={{
                backgroundColor: '#fffbe6',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={16} className="text-amber" />
                <span><strong>Workflow Cannot Advance:</strong> {advancementError}</span>
              </div>
            )}

            <div className="tracker-header-row">
              <div className="tracker-title-group">
                <span className="tracker-main-title font-display">CARE WORKFLOW STAGE PROGRESS</span>
                <span className="tracker-sub font-sans">
                  Current Stage: <strong className="text-cyan">{STAGES[activeStageIdx].label}</strong> (Stage {activeStageIdx + 1} of 7)
                </span>
              </div>

              <div className="tracker-action-side">
                {activeStageIdx < STAGES.length - 1 && (
                  <Button size="sm" variant={isEmergency ? 'red' : 'primary'} iconRight={ChevronRight} onClick={handleAdvanceWorkflow}>
                    Advance Workflow Event
                  </Button>
                )}
              </div>
            </div>

            {/* 7-Stage Horizontal Pipeline */}
            <div className="workflow-pipeline font-sans">
              {STAGES.map((st, idx) => {
                const isPassed = idx < activeStageIdx;
                const isCurrent = idx === activeStageIdx;

                return (
                  <React.Fragment key={st.key}>
                    {idx > 0 && (
                      <div className={`pipeline-line ${idx <= activeStageIdx ? 'line-active' : ''}`} />
                    )}
                    
                    <div 
                      className={`pipeline-stage-node ${isCurrent ? 'node-current' : isPassed ? 'node-passed' : 'node-future'}`}
                      onClick={() => setCurrentStageKey(st.key)}
                      title={`Click to view ${st.label}`}
                    >
                      <div className="node-circle font-mono">
                        {isPassed ? '✓' : isCurrent ? '●' : idx + 1}
                      </div>
                      <span className="node-label font-sans">{st.label}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* ── 4. STRUCTURED INFORMATION SECTIONS (2-Column Desktop Grid) ── */}
          <div className="workspace-columns-grid">
            
            {/* ── LEFT COLUMN: Patient, Admission, Clinical ───────── */}
            <div className="workspace-column-left">
              
              {/* SECTION 1: PATIENT PROFILE */}
              <div className="info-card">
                <div className="info-card-header">
                  <User size={16} className="text-blue" />
                  <h3 className="info-card-title font-display">1. Patient Profile & Demographics</h3>
                </div>

                <div className="info-grid-3col font-sans">
                  <div className="info-cell">
                    <span className="info-cell-label">FULL NAME</span>
                    <span className="info-cell-val font-bold text-navy-dark">{pData.name}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">MEDICAL RECORD #</span>
                    <span className="info-cell-val font-mono text-cyan font-bold">{pData.mrn}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">AGE / GENDER</span>
                    <span className="info-cell-val">{pData.age}y • {pData.gender}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">BLOOD GROUP</span>
                    <span className="info-cell-val font-mono text-teal font-bold">{pData.bloodGroup}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">KNOWN ALLERGIES</span>
                    <span className="info-cell-val text-red font-bold">{pData.allergies}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">CONTACT PHONE</span>
                    <span className="info-cell-val font-mono">{pData.phone}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: ADMISSION DETAILS */}
              <div className="info-card">
                <div className="info-card-header">
                  <Building2 size={16} className="text-indigo" />
                  <h3 className="info-card-title font-display">2. Admission Details</h3>
                </div>

                <div className="info-grid-3col font-sans">
                  <div className="info-cell">
                    <span className="info-cell-label">ADMISSION DATE</span>
                    <span className="info-cell-val font-mono">{pData.admissionDate}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">DEPARTMENT</span>
                    <span className="info-cell-val font-bold">{pData.department}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">ROOM / BED</span>
                    <span className="info-cell-val font-mono text-primary font-bold">{pData.preOpBay}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">ADMISSION TYPE</span>
                    <span className="info-cell-val font-bold">{pData.admissionStatus}</span>
                  </div>

                  <div className="info-cell" style={{ gridColumn: 'span 2' }}>
                    <span className="info-cell-label">ATTENDING CONSULTANT</span>
                    <span className="info-cell-val font-bold text-navy-dark">{pData.consultant}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: CLINICAL INFORMATION & NOTES */}
              <div className="info-card">
                <div className="info-card-header-row">
                  <div className="info-card-header">
                    <Stethoscope size={16} className="text-teal" />
                    <h3 className="info-card-title font-display">3. Clinical Information</h3>
                  </div>
                  <Button size="xs" variant="secondary" icon={Plus} onClick={() => setShowNoteModal(true)}>
                    Add Note
                  </Button>
                </div>

                <div className="info-grid-2col font-sans" style={{ marginBottom: '16px' }}>
                  <div className="info-cell">
                    <span className="info-cell-label">PROVISIONAL DIAGNOSIS</span>
                    <span className="info-cell-val font-bold text-primary">{pData.condition}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">PLANNED PROCEDURE</span>
                    <span className="info-cell-val font-bold text-navy-dark">{pData.procedure}</span>
                  </div>
                </div>

                {/* Clinical Clearance & Decision Selector */}
                <div className="clinical-notes-container font-sans" style={{ marginBottom: '16px', padding: '14px', borderRadius: '10px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={16} className="text-teal" />
                      <span className="font-display font-bold text-navy-head" style={{ fontSize: '12px' }}>DOCTOR CLINICAL CLEARANCE DECISION</span>
                    </div>
                    <Badge variant={pData.clinicalClearance === 'CLEARED' ? 'teal' : pData.clinicalClearance === 'CONDITIONALLY_CLEARED' ? 'amber' : 'red'} size="xs">
                      {pData.clinicalClearance || 'CLEARED FOR SURGERY'}
                    </Badge>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <Button 
                      size="xs" 
                      variant={pData.clinicalClearance === 'CLEARED' || !pData.clinicalClearance ? 'teal' : 'secondary'}
                      onClick={() => {
                        if (!enforcePermission(userRole, 'clinical:clearance', 'clinical clearance')) return;
                        if (workflow.addClinicalNote) {
                          workflow.addClinicalNote(pData.id || pData.mrn, { author: pData.surgeon, note: 'Clinical Clearance Status: CLEARED FOR SURGERY.' });
                        }
                        if (workflow.resolveAlert) {
                          workflow.resolveAlert(`ALT-HOLD-${pData.mrn}`);
                        }
                        alert(`Patient ${pData.name} CLEARED for surgical workflow.`);
                      }}
                    >
                      ✓ CLEARED FOR SURGERY
                    </Button>

                    <Button 
                      size="xs" 
                      variant={pData.clinicalClearance === 'CONDITIONALLY_CLEARED' ? 'amber' : 'secondary'}
                      onClick={() => {
                        if (workflow.createAlert) {
                          workflow.createAlert({
                            id: `ALT-HOLD-${pData.mrn}`,
                            severity: 'Warning',
                            alert_type: 'CLINICAL_HOLD',
                            title: `Clinical hold placed on ${pData.name}`,
                            department: 'Doctors',
                            patientName: pData.name,
                            patientId: pData.mrn,
                            relatedEntity: `${pData.name} (${pData.mrn})`,
                            reason: 'Conditioned clearance: Additional lab / imaging investigation required before OT transfer.'
                          });
                        }
                        alert(`Patient ${pData.name} marked CONDITIONALLY CLEARED. Clinical Hold alert triggered.`);
                      }}
                    >
                      ⚠ CONDITIONALLY CLEARED
                    </Button>

                    <Button 
                      size="xs" 
                      variant={pData.clinicalClearance === 'NOT_CLEARED' ? 'danger' : 'secondary'}
                      onClick={() => {
                        if (workflow.createAlert) {
                          workflow.createAlert({
                            id: `ALT-HOLD-${pData.mrn}`,
                            severity: 'Critical',
                            alert_type: 'CLINICAL_HOLD',
                            title: `Surgical Hold: ${pData.name} NOT CLEARED`,
                            department: 'Doctors',
                            patientName: pData.name,
                            patientId: pData.mrn,
                            relatedEntity: `${pData.name} (${pData.mrn})`,
                            reason: 'Patient clinically held by consultant due to unstable vitals / secondary medical risk.'
                          });
                        }
                        alert(`Patient ${pData.name} marked NOT CLEARED. Surgical workflow PAUSED.`);
                      }}
                    >
                      ⛔ NOT CLEARED (CLINICAL HOLD)
                    </Button>
                  </div>
                </div>

                {/* Nursing Pre-Op Handoff Confirmation Box */}
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: '#f5f3ff', border: '1px solid #ddd6fe', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileCheck2 size={16} className="text-purple" />
                      <span className="font-display font-bold text-navy-head" style={{ fontSize: '12px' }}>NURSING PRE-OP HANDOFF TO OT</span>
                    </div>
                    <Badge variant="purple" size="xs">NURSING CHECKLIST COMPLETE</Badge>
                  </div>

                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Checks: Identity Verified ✓ • Consent Signed ✓ • Vitals Stable ✓ • IV Access ✓ • CSSD Pack Verified ✓
                  </div>

                  <Button 
                    size="sm" 
                    variant="primary" 
                    icon={Send} 
                    onClick={() => {
                      // Check CSSD pack sterility
                      if (pData.cssdStatus === 'EXPIRED') {
                        alert(`HANDOFF BLOCKED: Required sterile pack ${pData.cssdPackId} is expired. Send for reprocessing.`);
                        return;
                      }
                      if (pData.clinicalClearance === 'NOT_CLEARED') {
                        alert(`HANDOFF BLOCKED: Patient ${pData.name} is on Clinical Hold.`);
                        return;
                      }
                      if (workflow.advancePatientWorkflow) {
                        workflow.advancePatientWorkflow(pData.id || pData.mrn);
                      }
                      alert(`NURSING HANDOFF CONFIRMED: Patient ${pData.name} transferred into ${pData.otSuite}. OT and Front Desk updated.`);
                    }}
                  >
                    CONFIRM NURSING HANDOFF TO OT
                  </Button>
                </div>

                {/* Clinical Notes Stream */}
                <div className="clinical-notes-container font-sans">
                  <span className="notes-section-label font-mono font-bold">CLINICAL & NURSING NOTES LOG ({localNotes.length})</span>
                  
                  <div className="notes-list-box">
                    {localNotes.map((n) => (
                      <div key={n.id} className="clinical-note-item">
                        <div className="note-item-header">
                          <span className="note-author font-bold">{n.author}</span>
                          <span className="note-date font-mono">{n.date}</span>
                        </div>
                        <p className="note-text-body">{n.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: CSSD, OT, Recovery ─────────────────── */}
            <div className="workspace-column-right">

              {/* SECTION 4: CSSD / INSTRUMENT READINESS */}
              <div className={`info-card ${isEmergency ? 'card-emergency-cssd' : ''}`}>
                <div className="info-card-header">
                  <PackageCheck size={16} className={isEmergency ? 'text-red' : 'text-purple'} />
                  <h3 className="info-card-title font-display">
                    {isEmergency ? '4. Emergency CSSD Kit Telemetry' : '4. CSSD / Instrument Readiness'}
                  </h3>
                </div>

                {isEmergency ? (
                  <div className="emergency-cssd-box font-sans">
                    <div className="stat-emergency-badge font-mono">STAT EMERGENCY DISPATCH</div>
                    <div className="info-grid-2col" style={{ marginTop: '10px' }}>
                      <div className="info-cell">
                        <span className="info-cell-label">REQUIRED KIT</span>
                        <span className="info-cell-val font-bold text-red">{pData.cssdKit}</span>
                      </div>
                      <div className="info-cell">
                        <span className="info-cell-label">PACK ID</span>
                        <span className="info-cell-val font-mono text-cyan font-bold">{pData.cssdPackId}</span>
                      </div>
                      <div className="info-cell">
                        <span className="info-cell-label">STERILIZATION</span>
                        <span className="info-cell-val font-bold text-teal">{pData.cssdSterilization}</span>
                      </div>
                      <div className="info-cell">
                        <span className="info-cell-label">LOCATION / ETA</span>
                        <span className="info-cell-val font-mono">{pData.cssdLocation} • Ready Now</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid-2col font-sans">
                    <div className="info-cell" style={{ gridColumn: 'span 2' }}>
                      <span className="info-cell-label">PROCEDURE INSTRUMENT KIT</span>
                      <span className="info-cell-val font-bold text-navy-dark">{pData.cssdKit}</span>
                    </div>

                    <div className="info-cell">
                      <span className="info-cell-label">PACK ID</span>
                      <span className="info-cell-val font-mono text-cyan font-bold">{pData.cssdPackId}</span>
                    </div>

                    <div className="info-cell">
                      <span className="info-cell-label">STERILIZATION STATUS</span>
                      <span className="info-cell-val font-bold text-teal">{pData.cssdSterilization}</span>
                    </div>

                    <div className="info-cell">
                      <span className="info-cell-label">EXPIRY DATE</span>
                      <span className="info-cell-val font-mono">{pData.cssdExpiry}</span>
                    </div>

                    <div className="info-cell">
                      <span className="info-cell-label">STORAGE / LOCATION</span>
                      <span className="info-cell-val">{pData.cssdLocation}</span>
                    </div>

                    <div className="info-cell">
                      <span className="info-cell-label">ASSIGNED OT</span>
                      <span className="info-cell-val font-mono text-primary font-bold">{pData.otSuite}</span>
                    </div>

                    <div className="info-cell">
                      <span className="info-cell-label">READINESS STATUS</span>
                      <span className="info-cell-val">
                        <Badge variant={pData.cssdStatus === 'READY' ? 'teal' : pData.cssdStatus === 'COOLING' ? 'amber' : 'blue'} size="xs">
                          {pData.cssdStatus}
                        </Badge>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 5: OPERATING THEATRE TELEMETRY */}
              <div className="info-card">
                <div className="info-card-header">
                  <Activity size={16} className="text-cyan" />
                  <h3 className="info-card-title font-display">5. Operating Theatre Telemetry</h3>
                </div>

                <div className="info-grid-2col font-sans">
                  <div className="info-cell">
                    <span className="info-cell-label">THEATRE SUITE</span>
                    <span className="info-cell-val font-mono text-cyan font-bold">{pData.otSuite}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">SCHEDULED START</span>
                    <span className="info-cell-val font-mono font-bold">{pData.scheduledTime}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">LEAD SURGEON</span>
                    <span className="info-cell-val font-bold text-navy-dark">{pData.surgeon}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">ANESTHESIOLOGIST</span>
                    <span className="info-cell-val">{pData.anesthesiologist}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">ANESTHESIA STATUS</span>
                    <span className="info-cell-val font-bold text-teal">Pre-Op Evaluation Cleared</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">OT TURNOVER STATUS</span>
                    <span className="info-cell-val font-bold text-primary">Sanitized & Ready</span>
                  </div>
                </div>
              </div>

              {/* SECTION 6: POST-OP RECOVERY */}
              <div className="info-card">
                <div className="info-card-header">
                  <HeartPulse size={16} className="text-purple" />
                  <h3 className="info-card-title font-display">6. PACU Recovery Status</h3>
                </div>

                <div className="info-grid-2col font-sans">
                  <div className="info-cell">
                    <span className="info-cell-label">RECOVERY BAY</span>
                    <span className="info-cell-val font-mono font-bold text-navy-dark">{pData.recoveryBay}</span>
                  </div>

                  <div className="info-cell">
                    <span className="info-cell-label">EXPECTED DURATION</span>
                    <span className="info-cell-val font-mono">60 – 90 Minutes</span>
                  </div>

                  <div className="info-cell" style={{ gridColumn: 'span 2' }}>
                    <span className="info-cell-label">HANDOFF & DISCHARGE READINESS</span>
                    <span className="info-cell-val font-bold text-teal">{pData.recoveryHandoff}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ── WORKSPACE FOOTER ───────────────────────────────────── */}
        <div className="workspace-footer-bar font-sans">
          <div className="footer-left-info">
            <ShieldCheck size={16} className="text-teal" />
            <span>SYNCHRO Clinical Workspace • Patient <strong>{pData.name} ({pData.mrn})</strong></span>
          </div>

          <div className="footer-right-actions">
            <Button size="sm" variant="secondary" icon={Printer} onClick={() => alert(`Printed full clinical packet for ${pData.name}.`)}>
              Print Clinical Packet
            </Button>
            <Button size="sm" variant="primary" icon={Plus} onClick={() => setShowNoteModal(true)}>
              Add Clinical Note
            </Button>
          </div>
        </div>

      </div>

      {/* ── MODAL: Add Clinical Note ───────────────────────────── */}
      {showNoteModal && (
        <div className="synchro-workspace-backdrop" style={{ zIndex: 1200 }}>
          <div className="synchro-modal-box font-sans" onClick={e => e.stopPropagation()}>
            <div className="modal-box-header">
              <h3 className="modal-box-title font-display">Add Clinical Note</h3>
              <button onClick={() => setShowNoteModal(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNote}>
              <div className="modal-form-group">
                <label className="modal-form-label">AUTHOR</label>
                <input 
                  type="text" 
                  disabled 
                  value="Dr. Rajesh Sharma, MD" 
                  className="modal-form-input input-disabled" 
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-form-label">CLINICAL OBSERVATION & NOTE *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed clinical observation, surgical clearance note, or nursing directive..."
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  className="modal-form-textarea"
                />
              </div>

              <div className="modal-box-actions">
                <Button size="sm" variant="secondary" onClick={() => setShowNoteModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Save Note
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Schedule Procedure ──────────────────────────── */}
      {showScheduleModal && (
        <div className="synchro-workspace-backdrop" style={{ zIndex: 1200 }}>
          <div className="synchro-modal-box font-sans" onClick={e => e.stopPropagation()}>
            <div className="modal-box-header">
              <h3 className="modal-box-title font-display">Schedule / Update Surgical Procedure</h3>
              <button onClick={() => setShowScheduleModal(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Procedure scheduled for ${pData.name}.`);
              setShowScheduleModal(false);
            }}>
              <div className="modal-form-group">
                <label className="modal-form-label">PROCEDURE NAME</label>
                <input
                  type="text"
                  defaultValue={pData.procedure}
                  className="modal-form-input"
                />
              </div>

              <div className="info-grid-2col" style={{ gap: '10px' }}>
                <div className="modal-form-group">
                  <label className="modal-form-label">OPERATING THEATRE</label>
                  <select defaultValue={pData.otSuite} className="modal-form-select">
                    <option value="OT-01">OT-01 — Orthopedics</option>
                    <option value="OT-02">OT-02 — General & Laparoscopic</option>
                    <option value="OT-03">OT-03 — Emergency & Trauma</option>
                    <option value="OT-04">OT-04 — Cardiovascular</option>
                  </select>
                </div>

                <div className="modal-form-group">
                  <label className="modal-form-label">PRIORITY</label>
                  <select defaultValue={pData.priority} className="modal-form-select">
                    <option value="Routine">Routine</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="HIGH PRIORITY">HIGH PRIORITY</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                  </select>
                </div>
              </div>

              <div className="modal-box-actions">
                <Button size="sm" variant="secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" type="submit">
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
