import React, { useEffect } from 'react';
import { 
  User, Zap, Package, Clock, AlertTriangle, CheckCircle2, 
  XCircle, Stethoscope, Timer, Loader, Activity, ShieldCheck,
  Building2, ArrowUpRight, Sparkles, RefreshCw, Heart, FileText, Bed
} from 'lucide-react';
import { CountUp } from '../common/CountUp';
import { useWorkflow } from '../../context/WorkflowContext';
import './FlowBoard.css';

/* ============================================================
   SYNCHRO — FLOW BOARD
   8-Stage Connected Hospital Workflow Command Board:
   ADMISSION → NURSING → DOCTOR → OT READINESS → CSSD → OPERATING THEATRE → RECOVERY → BILLING / DISCHARGE
   ============================================================ */

const WORKFLOW_STAGES = [
  { id: 'ADMISSION', label: 'Admission', icon: User, desc: 'Intake & Registration' },
  { id: 'NURSING', label: 'Nursing', icon: Activity, desc: 'Triage & Vitals' },
  { id: 'DOCTOR', label: 'Doctor Review', icon: Heart, desc: 'Consultation & Pre-Op' },
  { id: 'OT_READINESS', label: 'OT Readiness', icon: ClipboardCheckIcon, desc: 'Gate Check Clearance' },
  { id: 'CSSD', label: 'CSSD', icon: Package, desc: 'Sterile Pack Verified' },
  { id: 'OT', label: 'Operating Theatre', icon: Stethoscope, desc: 'Active Procedure' },
  { id: 'RECOVERY', label: 'Recovery', icon: Timer, desc: 'PACU Monitoring' },
  { id: 'DISCHARGE', label: 'Billing / Discharge', icon: ShieldCheck, desc: 'Financial Clearance' }
];

function ClipboardCheckIcon(props) {
  return <CheckCircle2 {...props} />;
}

export const FlowBoard = () => {
  const workflow = useWorkflow();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  const patients = workflow.patients || [];
  const surgeries = workflow.surgeries || [];

  // Group patients dynamically from shared WorkflowContext
  const columnsData = [
    {
      stage: 'ADMISSION',
      title: 'REGISTERED',
      subtitle: 'Front Desk Intake',
      color: 'blue',
      items: patients.filter(p => p.admission_status === 'REGISTERED').slice(0, 5).map(p => ({
        code: p.patient_code,
        name: p.full_name,
        procedure: p.procedure || 'General Evaluation',
        dept: p.admissions?.[0]?.department || 'Front Desk',
        status: 'Registered',
        delay: null
      }))
    },
    {
      stage: 'ADMITTED',
      title: 'ADMITTED',
      subtitle: 'Ward Suite Inpatient',
      color: 'teal',
      items: patients.filter(p => p.admission_status === 'ADMITTED').slice(0, 5).map(p => ({
        code: p.patient_code,
        name: p.full_name,
        procedure: p.procedure || 'Inpatient Admission',
        dept: p.assigned_bed?.room?.room_number ? `${p.assigned_bed.room.room_number} / ${p.assigned_bed.bed_number}` : 'Ward R-103',
        status: 'Admitted',
        delay: null
      }))
    },
    {
      stage: 'NURSING',
      title: 'NURSING',
      subtitle: 'Triage & Pre-Op Prep',
      color: 'teal',
      items: patients.filter(p => p.admission_status === 'PRE_OP' || p.vitals).slice(0, 5).map(p => ({
        code: p.patient_code,
        name: p.full_name,
        procedure: p.procedure || 'Pre-Op Vitals & IV Prep',
        dept: 'Nursing Ward Bay',
        status: p.admission_status === 'PRE_OP' ? 'Pre-Op Bay' : 'Vitals Recorded',
        delay: null
      }))
    },
    {
      stage: 'DOCTOR',
      title: 'CONSULTATION',
      subtitle: 'Pre-Op Doctor Clearance',
      color: 'indigo',
      items: patients.filter(p => p.assigned_doctor && p.admission_status !== 'DISCHARGED' && p.admission_status !== 'IN_SURGERY').slice(0, 4).map(p => ({
        code: p.patient_code,
        name: p.full_name,
        procedure: p.procedure || 'Doctor Assessment',
        dept: p.assigned_doctor,
        status: 'Doctor Review',
        delay: null
      }))
    },
    {
      stage: 'OT_READINESS',
      title: 'READY FOR OT',
      subtitle: 'Pre-Flight Gate Check',
      color: 'amber',
      items: patients.filter(p => p.consents?.some(c => c.status === 'PENDING') || p.admission_status === 'READY_FOR_OT').slice(0, 4).map(p => ({
        code: p.patient_code,
        name: p.full_name,
        procedure: p.procedure || 'Surgical Case',
        dept: 'OT Holding Core',
        status: p.admission_status === 'READY_FOR_OT' ? 'Cleared 100%' : 'Consent Check',
        delay: p.consents?.some(c => c.status === 'PENDING') ? 'Surgical consent pending' : null
      }))
    },
    {
      stage: 'CSSD',
      title: 'CSSD STAGING',
      subtitle: 'Sterile Pack Staging',
      color: 'teal',
      items: (workflow.cssd_packs || []).filter(cp => cp.status === 'STERILE' && cp.assigned_ot !== 'Unassigned').slice(0, 4).map(cp => ({
        code: cp.pack_code,
        name: cp.pack_type,
        procedure: `For ${cp.assigned_ot}`,
        dept: cp.location,
        status: 'Pack Sterile',
        delay: null
      }))
    },
    {
      stage: 'OPERATING THEATRE',
      title: 'IN OT',
      subtitle: 'Active Procedure',
      color: 'cyan',
      items: patients.filter(p => p.admission_status === 'IN_SURGERY' || p.admission_status === 'TRANSFERRED_TO_OT').slice(0, 5).map(p => ({
        code: p.patient_code,
        name: p.full_name,
        procedure: p.procedure || 'Active Surgery',
        dept: 'OT-02 Suite',
        status: 'In Surgery',
        delay: null
      }))
    },
    {
      stage: 'DISCHARGE',
      title: 'RECOVERY / DISCHARGE',
      subtitle: 'PACU & Settlement',
      color: 'blue',
      items: patients.filter(p => p.admission_status === 'DISCHARGED' || p.admission_status === 'RECOVERY').slice(0, 5).map(p => ({
        code: p.patient_code,
        name: p.full_name,
        procedure: p.procedure || 'Post-Op Monitoring',
        dept: p.admission_status === 'DISCHARGED' ? 'Discharge Billing' : 'PACU Recovery',
        status: p.admission_status === 'DISCHARGED' ? 'Discharged' : 'Recovering',
        delay: null
      }))
    }
  ];

  // Scroll-triggered reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flow-board" style={{ maxWidth: '100%' }}>
      {/* ── Page Header Bar ────────────────────────────── */}
      <div className="flow-board-header">
        <div className="flow-board-title-block">
          <h1 className="flow-board-title font-display">Hospital Workflow Command Board</h1>
          <p className="flow-board-subtitle">
            Synchronized patient movement across all 8 hospital operational departments
          </p>
        </div>
        <div className="flow-board-meta">
          <span className="flow-board-date">{dateStr}</span>
          <div className="flow-board-live">
            <span className="live-dot" />
            <span className="live-label">Live Flow Telemetry</span>
          </div>
        </div>
      </div>

      {/* ── 8-Stage Workflow Progression Header Bar ──────────────────── */}
      <div className="ot-card" style={{ padding: '16px 20px', marginBottom: '20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {WORKFLOW_STAGES.map((stg, idx) => {
            const Icon = stg.icon;
            return (
              <React.Fragment key={stg.id}>
                {idx > 0 && <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>→</span>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: idx === 5 ? 'var(--status-cyan-bg)' : '#f1f5f9',
                    color: idx === 5 ? 'var(--status-cyan-text)' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-navy-head)' }}>{stg.label}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{stg.desc}</span>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Live Hospital-Wide Activity Audit Feed ─────────────────── */}
      <div className="ot-card" style={{ padding: '16px 20px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} style={{ color: 'var(--status-cyan-text)' }} />
            <h3 style={{ fontSize: '13px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)', margin: 0 }}>
              Live Hospital Movement & Audit Feed
            </h3>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary-blue)', background: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
            REAL-TIME PIPELINE TELEMETRY
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {(workflow.timelineEvents || []).slice(0, 6).map(evt => (
            <div key={evt.id} style={{
              minWidth: '240px',
              maxWidth: '280px',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--primary-blue)' }}>{evt.timestamp}</span>
                <span style={{ fontSize: '9.5px', fontWeight: 700, color: 'var(--text-muted)' }}>{evt.actor}</span>
              </div>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{evt.patientName} ({evt.patientCode})</span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{evt.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8 Column Horizontal Flow Grid ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '14px', alignItems: 'start' }}>
        {columnsData.map((col) => (
          <div key={col.stage} className="ot-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '480px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-navy-head)' }}>{col.title}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{col.subtitle} • ({col.items.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {col.items.map((item) => (
                <div 
                  key={item.code} 
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    backgroundColor: item.delay ? '#fff1f2' : '#f8fafc',
                    border: item.delay ? '1px solid var(--state-red-border)' : '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary-blue)' }}>{item.code}</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1' }}>{item.status}</span>
                  </div>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{item.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{item.procedure}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.dept}</span>
                  
                  {item.delay && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '10.5px', color: 'var(--state-red-text)', fontWeight: 600 }}>
                      <AlertTriangle size={12} />
                      <span>{item.delay}</span>
                    </div>
                  )}
                </div>
              ))}

              {col.items.length === 0 && (
                <div style={{ padding: '20px 8px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                  No active cases in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
