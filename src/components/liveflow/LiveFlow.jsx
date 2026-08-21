import React from 'react';
import { 
  User, CheckCircle2, Zap, Package, Stethoscope, Timer, 
  Sparkles, AlertTriangle, RefreshCw, Activity, ArrowRight,
  ShieldCheck, Heart, BedDouble, FileText
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { useWorkflow } from '../../context/WorkflowContext';
import './LiveFlow.css';

/* ============================================================
   SYNCHRO — LIVE FLOW TELEMETRY
   Full Connected Hospital Pipeline Demonstration
   ============================================================ */

export const LiveFlow = () => {
  const { demoState } = useDemo();
  const workflow = useWorkflow();

  const pipelineStages = [
    { key: 'ADMITTED', name: 'ADMISSIONS', icon: User, desc: 'Patient Intake' },
    { key: 'TRIAGE', name: 'TRIAGE', icon: Activity, desc: 'Vitals & Risk' },
    { key: 'CONSULTATION', name: 'CONSULTATION', icon: Heart, desc: 'Doctor Review' },
    { key: 'LAB', name: 'LAB / DIAGNOSTICS', icon: FileText, desc: 'Blood & Imaging' },
    { key: 'PRE_OP', name: 'PRE-OP GATE', icon: CheckCircle2, desc: 'Consent & Check' },
    { key: 'CSSD', name: 'CSSD PACK READY', icon: Package, desc: 'Sterile Tray Verified' },
    { key: 'OT', name: 'OT READY', icon: Zap, desc: 'Theatre Prepped' },
    { key: 'SURGERY', name: 'SURGERY', icon: Stethoscope, desc: 'In Progress' },
    { key: 'RECOVERY', name: 'PACU RECOVERY', icon: Timer, desc: 'Post-Op Monitoring' },
    { key: 'DISCHARGE', name: 'DISCHARGE', icon: ShieldCheck, desc: 'Billing & Release' }
  ];

  // Active flow patients across stages
  const activeFlowPatients = [
    { code: 'P-1042', name: 'Ananya Rao', stage: 'SURGERY', ot: 'OT-02', procedure: 'Laparoscopic Cholecystectomy', doctor: 'Dr. Rajesh Sharma', status: 'IN_PROGRESS' },
    { code: 'P-1043', name: 'Rahul Mehta', stage: 'CSSD', ot: 'OT-01', procedure: 'Total Hip Arthroplasty', doctor: 'Dr. James Gomez', status: 'PACK_READY' },
    { code: 'P-1044', name: 'Meera Nair', stage: 'PRE_OP', ot: 'OT-03', procedure: 'ACL Reconstruction', doctor: 'Dr. Kevin Patel', status: 'CLEARANCE_DONE' },
    { code: 'P-1045', name: 'Arjun Shah', stage: 'LAB', ot: 'OT-04', procedure: 'Coronary Artery Bypass', doctor: 'Dr. Alan Vance', status: 'LABS_RUNNING' },
    { code: 'P-1046', name: 'Elena Rostova', stage: 'TRIAGE', ot: 'OT-02', procedure: 'Cholelithiasis Followup', doctor: 'Dr. Rajesh Sharma', status: 'TRIAGE_DONE' },
    { code: 'P-1047', name: 'Robert Vance', stage: 'RECOVERY', ot: 'OT-01', procedure: 'Hip Replacement', doctor: 'Dr. James Gomez', status: 'MONITORING' }
  ];

  return (
    <div className="live-flow-container">
      {/* Header */}
      <div className="live-flow-header">
        <div className="live-flow-title-block">
          <h1 className="live-flow-main-title">Hospital Live Flow Telemetry</h1>
          <p className="live-flow-subtitle">
            Real-time tracking of patients moving through Front Desk, Nursing, Doctor, Lab, CSSD, OT, Recovery, and Discharge.
          </p>
        </div>

        <div className="live-flow-controls">
          <div className="doctor-live-badge">
            <span className="live-dot" />
            <span className="live-label">Telemetry Live Stream</span>
          </div>
        </div>
      </div>

      {/* Signal Toast */}
      {demoState.dispatchToast && (
        <div className={`live-signal-toast toast-${demoState.ot2Status === 'BLOCKED' ? 'red' : 'cyan'}`}>
          <Activity size={16} />
          <span>{demoState.dispatchToast}</span>
        </div>
      )}

      {/* 10-Stage Pipeline Visual Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {pipelineStages.map((stg, i) => {
          const StageIcon = stg.icon;
          const patientInStage = activeFlowPatients.filter(p => p.stage === stg.key);
          const hasActive = patientInStage.length > 0;
          return (
            <div 
              key={stg.key} 
              className="ot-card"
              style={{
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderLeft: hasActive ? '3px solid var(--status-cyan-text)' : '1px solid var(--border-subtle)',
                backgroundColor: hasActive ? '#f0fdf4' : 'var(--bg-surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>STAGE {i+1}</span>
                <StageIcon size={16} style={{ color: hasActive ? 'var(--status-cyan-text)' : 'var(--text-muted)' }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)' }}>{stg.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{stg.desc}</span>
              <div style={{ marginTop: '4px' }}>
                {patientInStage.map(p => (
                  <span key={p.code} style={{ fontSize: '10.5px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary-blue)', background: '#dbeafe', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}>
                    ● {p.code} ({p.name})
                  </span>
                ))}
                {!hasActive && <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>0 Patients</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Workflow Patients Tracker Table */}
      <div className="ot-card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)', marginBottom: '12px' }}>
          Active Synchronized Patient Journeys
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>PATIENT ID</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>PATIENT NAME</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>CURRENT STAGE</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>ASSIGNED OT</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>PROCEDURE</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)' }}>ATTENDING DOCTOR</th>
              <th style={{ padding: '10px 12px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>TELEMETRY</th>
            </tr>
          </thead>
          <tbody>
            {activeFlowPatients.map((p) => (
              <tr key={p.code} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-blue)' }}>{p.code}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{p.name}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 700, fontFamily: 'var(--font-mono)', background: 'var(--status-cyan-bg)', color: 'var(--status-cyan-text)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--status-cyan-border)' }}>
                    {p.stage}
                  </span>
                </td>
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)' }}>{p.ot}</td>
                <td style={{ padding: '12px' }}>{p.procedure}</td>
                <td style={{ padding: '12px' }}>{p.doctor}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--state-teal-text)', fontWeight: 600 }}>Syncing ✓</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Triad Visual Banner */}
      <div className="today-triad-showcase">
        <div className="hero-banner-content">
          <div className="hero-banner-badge">
            <Sparkles size={14} />
            <span>SYNCHRO Core Coordination Hub</span>
          </div>
          <h2 className="hero-banner-heading">
            Whole-Hospital Synchronization Active
          </h2>
          <p className="hero-banner-desc">
            Synchro continuously coordinates Admissions, Nursing, CSSD, Doctors, Operating Theatres, and Billing, eliminating friction and wait times.
          </p>
        </div>

        <div className="hero-graphic-wrapper">
          <img 
            src="/assets/images/hospital_triad.png" 
            alt="Hospital Coordination Triad" 
            className="hero-3d-graphic"
          />
        </div>
      </div>
    </div>
  );
};
