import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Clock, 
  Activity, 
  UserCheck, 
  PackageCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  Plus, 
  Filter, 
  Layers,
  Sparkles,
  Stethoscope,
  Maximize2,
  Flame,
  AlertOctagon,
  Timer,
  Users,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { OTSuiteDrawer } from './OTSuiteDrawer';
import { useWorkflow } from '../../context/WorkflowContext';
import './TheatresPage.css';

// ── Helpers ─────────────────────────────────────────────────────
const STATUS_COLORS = {
  IN_PROCEDURE:       { bg: '#fee2e2', text: '#b91c1c', label: 'IN PROCEDURE' },
  PATIENT_READY:      { bg: '#dcfce7', text: '#15803d', label: 'PATIENT READY' },
  PRE_OP:             { bg: '#fffbe6', text: '#b45309', label: 'PRE-OP IN OT' },
  PROCEDURE_COMPLETED:{ bg: '#e0e7ff', text: '#4338ca', label: 'COMPLETED' },
  TURNOVER:           { bg: '#fef3c7', text: '#b45309', label: 'TURNOVER' },
  EMERGENCY_READY:    { bg: '#fee2e2', text: '#b91c1c', label: 'EMERGENCY READY' },
  AVAILABLE:          { bg: '#ecfdf5', text: '#047857', label: 'AVAILABLE' },
  SCHEDULED:          { bg: '#e0f2fe', text: '#0369a1', label: 'SCHEDULED' },
  DELAYED:            { bg: '#fef2f2', text: '#dc2626', label: 'DELAYED' },
};

export const TheatresPage = () => {
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [timeTick, setTimeTick] = useState(0);

  const workflow = useWorkflow();

  // Timer tick for live elapsed simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeTick(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute live OT Suites state merged with WorkflowContext
  const suitesList = useMemo(() => {
    const defaultOtSuites = [
      {
        id: 'OT-01',
        suite_code: 'OT-01',
        name: 'Orthopedics & Joint Replacement',
        specialty: 'Orthopedics',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        anesthesiologist: null,
        scheduledStart: null,
        actualStart: null,
        expectedDurationMins: 0,
        elapsedMins: 0,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '19.4°C',
        humidity: '48%',
        airChanges: '22 / hr'
      },
      {
        id: 'OT-02',
        suite_code: 'OT-02',
        name: 'General & Laparoscopic Surgery',
        specialty: 'General Surgery',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        anesthesiologist: null,
        scheduledStart: null,
        actualStart: null,
        expectedDurationMins: 0,
        elapsedMins: 0,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '19.8°C',
        humidity: '46%',
        airChanges: '24 / hr'
      },
      {
        id: 'OT-03',
        suite_code: 'OT-03',
        name: 'Sports Medicine & Arthroscopy',
        specialty: 'Sports Medicine',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        anesthesiologist: null,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '20.1°C',
        humidity: '50%',
        airChanges: '20 / hr'
      },
      {
        id: 'OT-04',
        suite_code: 'OT-04',
        name: 'Trauma & Emergency Suite',
        specialty: 'Trauma Surgery',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        anesthesiologist: null,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '19.0°C',
        humidity: '45%',
        airChanges: '26 / hr'
      },
      {
        id: 'OT-05',
        suite_code: 'OT-05',
        name: 'ENT & Head/Neck Surgery',
        specialty: 'ENT',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        anesthesiologist: null,
        scheduledStart: null,
        actualStart: null,
        expectedDurationMins: 0,
        elapsedMins: 0,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '20.0°C',
        humidity: '47%',
        airChanges: '22 / hr'
      },
      {
        id: 'OT-06',
        suite_code: 'OT-06',
        name: 'Neurosurgery Core Suite',
        specialty: 'Neurosurgery',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        anesthesiologist: null,
        scheduledStart: null,
        actualStart: null,
        expectedDurationMins: 0,
        elapsedMins: 0,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '18.8°C',
        humidity: '44%',
        airChanges: '25 / hr'
      },
      {
        id: 'OT-07',
        suite_code: 'OT-07',
        name: 'Urology & Endoscopy Suite',
        specialty: 'Urology',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        anesthesiologist: null,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '19.5°C',
        humidity: '49%',
        airChanges: '21 / hr'
      },
      {
        id: 'OT-08',
        suite_code: 'OT-08',
        name: 'Trauma Reserve Suite B',
        specialty: 'Trauma & Emergency',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '19.2°C',
        humidity: '46%',
        airChanges: '23 / hr'
      },
      {
        id: 'OT-09',
        suite_code: 'OT-09',
        name: 'Pediatric Surgical Core',
        specialty: 'Pediatrics',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        scheduledStart: null,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '21.0°C',
        humidity: '52%',
        airChanges: '20 / hr'
      },
      {
        id: 'OT-10',
        suite_code: 'OT-10',
        name: 'Ophthalmology Suite',
        specialty: 'Ophthalmology',
        status: 'AVAILABLE',
        patient: null,
        patientMRN: null,
        procedure: null,
        surgeon: 'Unassigned',
        scheduledStart: null,
        actualStart: null,
        expectedDurationMins: 0,
        elapsedMins: 0,
        cssdPackId: null,
        cssdVerified: false,
        readinessScore: 0,
        utilization: 0,
        temperature: '20.2°C',
        humidity: '48%',
        airChanges: '22 / hr'
      },
      {
        id: 'OT-11',
        suite_code: 'OT-11',
        name: 'General Reserve Suite A',
        specialty: 'General Surgery',
        status: 'AVAILABLE',
        patient: null,
        procedure: null,
        surgeon: 'Unassigned',
        cssdPackId: null,
        readinessScore: 0,
        utilization: 0,
        temperature: '19.5°C',
        humidity: '45%',
        airChanges: '24 / hr'
      },
      {
        id: 'OT-12',
        suite_code: 'OT-12',
        name: 'General Reserve Suite B',
        specialty: 'General Surgery',
        status: 'AVAILABLE',
        patient: null,
        procedure: null,
        surgeon: 'Unassigned',
        cssdPackId: null,
        readinessScore: 0,
        utilization: 0,
        temperature: '19.5°C',
        humidity: '45%',
        airChanges: '24 / hr'
      }
    ];

    // Read live patient workflow updates
    const livePatients = workflow.patients || [];
    return defaultOtSuites.map(ot => {
      // Find patient assigned to this OT
      const matchedP = livePatients.find(p => (p.assigned_ot || p.otSuite || '') === ot.suite_code || p.full_name === ot.patient);
      if (matchedP) {
        const st = (matchedP.admission_status || matchedP.workflowStage || '').toUpperCase();
        if (st === 'IN_SURGERY') {
          return { ...ot, status: 'IN_PROCEDURE', patient: matchedP.full_name, patientMRN: matchedP.patient_code };
        } else if (st === 'OT_READY') {
          return { ...ot, status: 'PATIENT_READY', patient: matchedP.full_name, patientMRN: matchedP.patient_code };
        } else if (st === 'RECOVERY') {
          return { ...ot, status: 'TURNOVER', previousCase: matchedP.procedure };
        }
      }
      return ot;
    });
  }, [workflow.patients]);

  // Filtered suites
  const filteredSuites = suitesList.filter(s => {
    if (activeFilter === 'ACTIVE') return s.status === 'IN_PROCEDURE';
    if (activeFilter === 'READY') return s.status === 'PATIENT_READY' || s.status === 'EMERGENCY_READY';
    if (activeFilter === 'TURNOVER') return s.status === 'TURNOVER';
    if (activeFilter === 'AVAILABLE') return s.status === 'AVAILABLE';
    return true;
  });

  // Calculate top Command Center metrics
  const activeCount = suitesList.filter(s => s.status === 'IN_PROCEDURE').length;
  const availableCount = suitesList.filter(s => s.status === 'AVAILABLE').length;
  const readyCount = suitesList.filter(s => s.status === 'PATIENT_READY' || s.status === 'EMERGENCY_READY').length;
  const turnoverCount = suitesList.filter(s => s.status === 'TURNOVER').length;
  const delayedCount = suitesList.filter(s => s.status === 'DELAYED' || s.delayReason).length;

  const liveSelectedSuite = selectedSuite ? suitesList.find(s => s.id === selectedSuite.id) || selectedSuite : null;

  return (
    <div className="ot-theatres-page font-sans">
      {/* 1. Page Header */}
      <div className="theatres-page-header">
        <div className="theatres-title-group">
          <div className="theatres-title-row">
            <h1 className="theatres-heading font-display">Operating Theatre Command Center</h1>
            <Badge variant="teal" size="sm" dot>Telemetry & Live Board Active</Badge>
          </div>
          <p className="theatres-subtitle">
            Real-time surgical suite monitoring, turnover tracking, and cross-department workflow synchronization.
          </p>
        </div>

        <div className="theatres-header-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Refresh Telemetry
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export OT Utilization
          </Button>
        </div>
      </div>

      {/* 2. Top OT Command Center Metrics Cards */}
      <div className="cssd-kpi-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="cssd-kpi-card ot-card accent-indigo">
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">ACTIVE OTs</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display text-indigo">{activeCount}</span>
              <span className="cssd-kpi-unit font-mono">/ 12</span>
            </div>
            <span className="cssd-kpi-sub">In active surgery</span>
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-teal">
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">PATIENTS READY</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display text-teal">{readyCount}</span>
              <span className="cssd-kpi-unit font-mono">cases</span>
            </div>
            <span className="cssd-kpi-sub">Cleared for transfer</span>
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-amber">
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">TURNOVER</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display text-amber">{turnoverCount}</span>
              <span className="cssd-kpi-unit font-mono">suites</span>
            </div>
            <span className="cssd-kpi-sub">Cleaning &amp; prep</span>
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-blue">
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">AVAILABLE OTs</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display text-blue">{availableCount}</span>
              <span className="cssd-kpi-unit font-mono">reserve</span>
            </div>
            <span className="cssd-kpi-sub">Ready for allocation</span>
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-red">
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">DELAYED CASES</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display text-red">{delayedCount}</span>
              <span className="cssd-kpi-unit font-mono">flagged</span>
            </div>
            <span className="cssd-kpi-sub">Auto exception logged</span>
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-purple">
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">UTILIZATION RATE</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display text-purple">{suitesList.length > 0 ? ((activeCount / suitesList.length) * 100).toFixed(1) : '0.0'}%</span>
            </div>
            <span className="cssd-kpi-sub">Active / total suites</span>
          </div>
        </div>
      </div>

      {/* 3. Live Surgical Pipeline Strip */}
      <div className="ot-card" style={{ padding: '16px 20px', marginBottom: '20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} className="text-cyan" />
            <span className="font-display font-bold" style={{ fontSize: '13px', color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              LIVE SURGICAL PIPELINE FLOW
            </span>
          </div>
          <span className="font-mono text-muted" style={{ fontSize: '11px' }}>{(workflow.surgeries || []).length} Total Surgical Cases Scheduled Today</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          {(() => {
            const allPatients = workflow.patients || [];
            const pipelineCounts = [
              { label: 'WAITING', count: allPatients.filter(p => ['ADMITTED', 'REGISTERED', 'ASSESSMENT'].includes((p.admission_status || '').toUpperCase())).length, bg: '#f1f5f9', color: '#475569' },
              { label: 'PATIENT READY', count: allPatients.filter(p => ['OT_READY', 'PRE_OP'].includes((p.admission_status || '').toUpperCase())).length, bg: '#dcfce7', color: '#15803d' },
              { label: 'PRE-OP IN OT', count: allPatients.filter(p => (p.admission_status || '').toUpperCase() === 'CSSD').length, bg: '#fffbe6', color: '#b45309' },
              { label: 'IN SURGERY', count: allPatients.filter(p => (p.admission_status || '').toUpperCase() === 'IN_SURGERY').length, bg: '#fee2e2', color: '#b91c1c' },
              { label: 'RECOVERY', count: allPatients.filter(p => ['RECOVERY', 'POST_OP_MONITORING'].includes((p.admission_status || '').toUpperCase())).length, bg: '#e0e7ff', color: '#4338ca' },
              { label: 'TURNOVER', count: suitesList.filter(s => s.status === 'TURNOVER').length, bg: '#fef3c7', color: '#b45309' },
              { label: 'COMPLETE', count: allPatients.filter(p => ['DISCHARGED', 'DISCHARGE_READY'].includes((p.admission_status || '').toUpperCase())).length, bg: '#ecfdf5', color: '#047857' },
            ];
            return pipelineCounts.map((st, i, arr) => (
            <React.Fragment key={st.label}>
              <div style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '10px',
                backgroundColor: st.bg,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between'
              }}>
                <span className="font-mono" style={{ fontSize: '10px', fontWeight: 700, color: st.color }}>{st.label}</span>
                <span className="font-display font-bold" style={{ fontSize: '15px', color: st.color }}>{st.count}</span>
              </div>
              {i < arr.length - 1 && <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
            </React.Fragment>
          ));
          })()}
        </div>
      </div>

      {/* 4. Filter Bar */}
      <div className="cssd-filter-bar ot-card" style={{ marginBottom: '20px' }}>
        <div className="cssd-filter-tabs">
          {[
            { id: 'ALL', label: 'All 12 OT Suites' },
            { id: 'ACTIVE', label: `In Surgery (${activeCount})` },
            { id: 'READY', label: `Patient Ready (${readyCount})` },
            { id: 'TURNOVER', label: `Turnover (${turnoverCount})` },
            { id: 'AVAILABLE', label: `Available (${availableCount})` },
          ].map((t) => (
            <button
              key={t.id}
              className={`cssd-tab-btn ${activeFilter === t.id ? 'is-active' : ''}`}
              onClick={() => setActiveFilter(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Primary Live OT Board (Grid of 12 OT Suite Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
        {filteredSuites.map((ot) => {
          const ss = STATUS_COLORS[ot.status] || { bg: '#f1f5f9', text: '#475569', label: ot.status };
          const isEmergency = ot.priority === 'EMERGENCY' || ot.status === 'EMERGENCY_READY';

          return (
            <div 
              key={ot.id}
              className="ot-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                border: isEmergency ? '1.5px solid #fca5a5' : ot.status === 'IN_PROCEDURE' ? '1.5px solid #bfdbfe' : '1px solid var(--border-subtle)',
                backgroundColor: isEmergency ? '#fff5f5' : '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 2px 8px rgba(10, 25, 50, 0.04)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setSelectedSuite(ot)}
            >
              {/* Card Header */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-display font-bold text-navy-head" style={{ fontSize: '16px' }}>{ot.suite_code}</span>
                    <span className="font-mono text-muted" style={{ fontSize: '11px' }}>• {ot.specialty}</span>
                  </div>

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '4px 10px', borderRadius: '12px', fontSize: '10px', fontWeight: 800,
                    fontFamily: 'var(--font-mono)', backgroundColor: ss.bg, color: ss.text
                  }}>
                    {isEmergency && <Flame size={11} className="text-red" />}
                    {ot.status === 'IN_PROCEDURE' && <Activity size={11} className="text-red animate-pulse" />}
                    {ot.status === 'PATIENT_READY' && <CheckCircle2 size={11} className="text-teal" />}
                    {ss.label}
                  </span>
                </div>

                {/* Patient & Procedure Info */}
                {ot.patient ? (
                  <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="font-display font-bold text-navy-dark" style={{ fontSize: '14px' }}>{ot.patient}</span>
                      <span className="font-mono text-muted" style={{ fontSize: '10px' }}>{ot.patientMRN}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {ot.procedure}
                    </div>
                    <div className="font-mono text-muted" style={{ fontSize: '11px' }}>
                      Surgeon: <strong style={{ color: 'var(--text-navy-head)' }}>{ot.surgeon}</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#f0fdf4', borderRadius: '10px', padding: '16px', marginBottom: '12px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                    <span className="font-mono font-bold text-teal" style={{ fontSize: '12px' }}>Suite Available for Allocation</span>
                  </div>
                )}

                {/* Real-time Procedure Timer (for active cases) */}
                {ot.status === 'IN_PROCEDURE' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', marginBottom: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    <span>Started: <strong>{ot.actualStart || ot.scheduledStart}</strong></span>
                    <span>Elapsed: <strong className="text-blue">{ot.elapsedMins + Math.floor(timeTick / 60)}m</strong></span>
                    <span>Expected: <strong>{ot.expectedDurationMins}m</strong></span>
                  </div>
                )}

                {/* Turnover Timer (for turnover suites) */}
                {ot.status === 'TURNOVER' && (
                  <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', marginBottom: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>TURNOVER TIMER:</span>
                      <strong className={ot.turnoverElapsedMins > 25 ? 'text-red' : 'text-amber'}>
                        {ot.turnoverElapsedMins} / 25 min {ot.turnoverElapsedMins > 25 ? '(DELAYED)' : '(ON TRACK)'}
                      </strong>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      Previous: {ot.previousCase}
                    </div>
                  </div>
                )}

                {/* Delay Warning Banner */}
                {ot.delayReason && (
                  <div style={{ padding: '8px 10px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <AlertTriangle size={13} />
                    <span>{ot.delayReason}</span>
                  </div>
                )}

                {/* Telemetry Strip: CSSD & Readiness */}
                {ot.patient && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <PackageCheck size={13} className={ot.cssdVerified ? 'text-teal' : 'text-amber'} />
                      <span>CSSD: {ot.cssdPackId || 'Pack Verified'}</span>
                    </div>
                    <span className="font-bold text-teal">Readiness: {ot.readinessScore || 0}%</span>
                  </div>
                )}
              </div>

              {/* Card Footer Action */}
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
                <Button size="xs" variant="secondary" iconRight={ChevronRight} onClick={(e) => { e.stopPropagation(); setSelectedSuite(ot); }}>
                  Inspect Suite / Control
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. OT Suite Inspection & Workflow Control Drawer */}
      {liveSelectedSuite && (
        <OTSuiteDrawer
          suite={liveSelectedSuite}
          onClose={() => setSelectedSuite(null)}
          workflow={workflow}
        />
      )}
    </div>
  );
};
