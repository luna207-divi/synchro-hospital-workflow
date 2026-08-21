import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Stethoscope, 
  Bed, 
  Activity, 
  PackageCheck, 
  CreditCard, 
  Workflow, 
  AlertTriangle, 
  BarChart3, 
  FileText, 
  ShieldCheck, 
  Settings as SettingsIcon, 
  Search, 
  Download, 
  Printer, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Eye, 
  TrendingUp, 
  RefreshCw,
  RotateCcw, 
  Sliders, 
  UserCheck, 
  Flame, 
  Lock,
  ArrowRight,
  Filter,
  Check,
  Heart,
  Timer,
  Package,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  AlertOctagon,
  Info,
  CheckSquare,
  TrendingDown
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { useWorkflow } from '../../context/WorkflowContext';
import { WorkflowTimeline } from '../dashboard/WorkflowTimeline';
import { ReportsPage } from '../reports/ReportsPage';
import './AdminPortal.css';

export const AdminPortal = () => {
  const workflow = useWorkflow();
  const [activeTab, setActiveTab] = useState('Overview');
  const [timeframe, setTimeframe] = useState('TODAY');
  const [syncTime, setSyncTime] = useState(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  // Live state from WorkflowContext
  const patients = workflow.patients || [];
  const cssdPacks = workflow.cssd_packs || [];
  const theatres = workflow.operatingTheatres || [];
  const surgeries = workflow.surgeries || [];
  const alerts = workflow.alerts || [];
  const timelineEvents = workflow.timelineEvents || [];

  // Live Refresh Sync Handler
  const handleRefreshSync = () => {
    setSyncTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  // Compute Live Metrics
  const totalPatientsCount = patients.length > 0 ? patients.length : 1248;
  const todayAdmissionsCount = patients.filter(p => p.admission_status === 'ADMITTED' || p.workflowStage === 'ADMITTED').length || 86;
  const activeSurgeriesCount = surgeries.filter(s => s.status === 'IN_SURGERY').length || theatres.filter(t => t.status === 'ACTIVE' || t.status === 'IN_PROCEDURE').length || 6;
  const activeTheatresCount = theatres.filter(t => t.status === 'ACTIVE' || t.status === 'IN_PROCEDURE').length || 6;
  const otUtilizationRate = Math.round((activeTheatresCount / 12) * 100) || 82;
  const sterilePacksCount = cssdPacks.filter(p => p.status === 'STERILE').length;
  const cssdReadinessPct = cssdPacks.length > 0 ? Math.round((sterilePacksCount / cssdPacks.length) * 100) : 94;
  const activeAlertsCount = alerts.filter(a => a.status !== 'Resolved').length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const warningAlertsCount = alerts.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length;
  const availableBedsCount = 23;
  const totalBedsCount = 120;
  const delayedWorkflowsCount = alerts.filter(a => a.severity === 'Warning' || a.severity === 'Critical').length || 4;

  // Patient Funnel Counts
  const funnel = useMemo(() => {
    return {
      registered: patients.filter(p => p.admission_status === 'REGISTERED').length || 86,
      admitted: patients.filter(p => p.admission_status === 'ADMITTED').length || 72,
      assessed: patients.filter(p => p.admission_status === 'ASSESSMENT').length || 64,
      preOp: patients.filter(p => p.admission_status === 'PRE_OP').length || 42,
      otReady: patients.filter(p => p.admission_status === 'OT_READY' || p.admission_status === 'CSSD').length || 18,
      inOt: patients.filter(p => p.admission_status === 'IN_SURGERY').length || 6,
      recovery: patients.filter(p => p.admission_status === 'RECOVERY').length || 8,
      discharge: patients.filter(p => p.admission_status === 'DISCHARGED').length || 12,
    };
  }, [patients]);

  // CSSD Breakdown
  const cssdBreakdown = useMemo(() => {
    return {
      total: cssdPacks.length,
      sterile: cssdPacks.filter(p => p.status === 'STERILE').length,
      reserved: cssdPacks.filter(p => p.status === 'RESERVED').length,
      inOt: cssdPacks.filter(p => p.status === 'IN_OT' || p.status === 'ISSUED').length,
      reprocessing: cssdPacks.filter(p => ['DECONTAMINATION', 'REPROCESSING', 'STERILIZING', 'RETURN_PENDING'].includes(p.status)).length,
      expiring: cssdPacks.filter(p => p.expiryState === 'EXPIRING_SOON' || p.expiryState === 'URGENT').length,
      expired: cssdPacks.filter(p => p.status === 'EXPIRED' || (p.expiry && new Date(p.expiry) < new Date())).length,
    };
  }, [cssdPacks]);

  // Dynamic Executive Insight Text
  const dynamicInsight = useMemo(() => {
    const expiredCount = cssdBreakdown.expired;
    const delayedCount = delayedWorkflowsCount;
    return `Hospital OT utilization is currently ${otUtilizationRate}%, with CSSD sterility readiness at ${cssdReadinessPct}%. ${expiredCount > 0 ? `${expiredCount} expired sterile pack has been quarantined in Vault B.` : 'All sterile packs are validated.'} ${delayedCount > 0 ? `${delayedCount} active workflow delays detected requiring administrative attention.` : 'All workflows running on track.'} Fast-track Emergency Suite OT-04 is prepped.`;
  }, [otUtilizationRate, cssdReadinessPct, cssdBreakdown.expired, delayedWorkflowsCount]);

  // Navigation Tabs
  const navTabs = [
    { id: 'Overview', label: 'Executive Intelligence', icon: Building2 },
    { id: 'Patients', label: 'Patient Operations', icon: Users },
    { id: 'OT', label: 'Operating Theatres', icon: Activity },
    { id: 'CSSD', label: 'CSSD Performance', icon: PackageCheck },
    { id: 'Alerts', label: 'Alerts & Bottlenecks', icon: AlertTriangle },
    { id: 'Audit', label: 'Audit Trail', icon: Lock },
    { id: 'Users', label: 'User Management', icon: UserCheck },
    { id: 'Reports', label: 'Operational Reports', icon: FileText },
  ];

  return (
    <div className="admin-portal-container font-sans">
      {/* ── 1. Hero Header Card ──────────────────────────────── */}
      <div className="admin-hero-header">
        <div className="admin-title-side">
          <div className="admin-badge-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="admin-main-heading font-display">EXECUTIVE COMMAND CENTER</h1>
            <span className="admin-subhead">
              Real-Time Hospital Operational Intelligence & Cross-Department Synchronization
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '8px' }}>
            <span className="live-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
            <span className="font-mono text-teal font-bold" style={{ fontSize: '11px' }}>
              LIVE • Last synchronized: {syncTime}
            </span>
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleRefreshSync}>
            Refresh Sync
          </Button>
          <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => {
            if (workflow.resetDemoData) {
              workflow.resetDemoData();
              alert('SYNCHRO Demo Data has been reset to clean initial baseline for presentation.');
            }
          }}>
            Reset Demo Data
          </Button>
        </div>
      </div>

      {/* ── 2. Primary Navigation Tabs Bar ──────────────────── */}
      <div className="ot-card" style={{ padding: '8px 12px', marginBottom: '20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {navTabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`cssd-tab-btn ${isActive ? 'is-active' : ''}`}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}
                type="button"
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'Reports' ? (
        <ReportsPage />
      ) : activeTab === 'Audit' ? (
        <div className="ot-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 className="font-display font-bold text-navy-head" style={{ fontSize: '18px', margin: 0 }}>CENTRAL SYSTEM AUDIT TRAIL</h2>
              <span className="font-mono text-muted" style={{ fontSize: '11px' }}>Immutable Event Logs & Security Access Audit</span>
            </div>
            <Badge variant="purple" size="sm">SECURITY LEVEL 1 AUDIT</Badge>
          </div>

          <div className="table-responsive-wrapper">
            <table className="cssd-data-table">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>TIME</th>
                  <th style={{ width: '160px' }}>USER / ACTOR</th>
                  <th style={{ width: '130px' }}>EVENT TYPE</th>
                  <th style={{ width: '140px' }}>PATIENT / ENTITY</th>
                  <th>DESCRIPTION & DETAILS</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>RESULT</th>
                </tr>
              </thead>
              <tbody>
                {timelineEvents.map((evt, idx) => {
                  const isDenied = evt.type?.includes('DENIED') || evt.desc?.toLowerCase().includes('denied') || evt.desc?.toLowerCase().includes('held');
                  return (
                    <tr key={evt.id || idx}>
                      <td className="font-mono text-blue font-bold" style={{ fontSize: '11px' }}>{evt.timestamp}</td>
                      <td><span className="font-bold text-navy-head" style={{ fontSize: '12px' }}>{evt.actor}</span></td>
                      <td><Badge variant={isDenied ? 'red' : 'teal'} size="xs">{evt.type}</Badge></td>
                      <td><span className="font-mono" style={{ fontSize: '11px' }}>{evt.patientName} ({evt.patientCode})</span></td>
                      <td style={{ fontSize: '12px' }}>{evt.desc}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Badge variant={isDenied ? 'red' : 'emerald'} size="xs">{isDenied ? 'DENIED' : 'SUCCESS'}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'Users' ? (
        <div className="ot-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 className="font-display font-bold text-navy-head" style={{ fontSize: '18px', margin: 0 }}>PROTOTYPE USER MANAGEMENT</h2>
              <span className="font-mono text-muted" style={{ fontSize: '11px' }}>Active Hospital Personnel & Role Assignments</span>
            </div>
            <Button size="sm" variant="primary" icon={Plus} onClick={() => alert('New user invitation form.')}>Add User</Button>
          </div>

          <div className="table-responsive-wrapper">
            <table className="cssd-data-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th style={{ width: '130px' }}>ROLE</th>
                  <th>DEPARTMENT</th>
                  <th style={{ width: '100px' }}>STATUS</th>
                  <th style={{ width: '120px' }}>LAST ACTIVE</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Dr. Evelyn Vance, DHA', email: 'admin@synchro.health', role: 'ADMIN', dept: 'Executive Command', status: 'ACTIVE', last: 'Just now' },
                  { name: 'Sarah Jenkins, RN', email: 'frontdesk@synchro.health', role: 'FRONT_DESK', dept: 'Admissions Intake', status: 'ACTIVE', last: '2m ago' },
                  { name: 'Dr. Rajesh Sharma, MD', email: 'doctor@synchro.health', role: 'DOCTOR', dept: 'General Surgery', status: 'ACTIVE', last: '1m ago' },
                  { name: 'Maria Vance, BSN', email: 'nurse@synchro.health', role: 'NURSE', dept: 'Central Nursing', status: 'ACTIVE', last: '3m ago' },
                  { name: 'Priya Nair, CSSD Lead', email: 'cssd@synchro.health', role: 'CSSD', dept: 'Sterile Processing', status: 'ACTIVE', last: '5m ago' },
                  { name: 'Dr. James Gomez, MD', email: 'ot@synchro.health', role: 'OT_MANAGER', dept: 'OT Management', status: 'ACTIVE', last: '4m ago' },
                ].map((u, i) => (
                  <tr key={i}>
                    <td><span className="font-bold text-navy-head" style={{ fontSize: '13px' }}>{u.name}</span></td>
                    <td className="font-mono" style={{ fontSize: '11px' }}>{u.email}</td>
                    <td><Badge variant="purple" size="xs">{u.role}</Badge></td>
                    <td style={{ fontSize: '12px' }}>{u.dept}</td>
                    <td><Badge variant="teal" size="xs">{u.status}</Badge></td>
                    <td className="font-mono text-muted" style={{ fontSize: '11px' }}>{u.last}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Button size="xs" variant="secondary" onClick={() => alert(`Status toggled for ${u.name}.`)}>Deactivate</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <>
          {/* ── 3. Top 8 Executive KPI Cards Grid ────────────────── */}
          <div className="admin-kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
            <div className="admin-kpi-card kpi-pillar-blue">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">TOTAL PATIENTS</span>
                <Users size={16} className="text-blue" />
              </div>
              <div className="kpi-value font-display">{totalPatientsCount.toLocaleString()}</div>
              <span className="kpi-subtext font-mono">Active clinical census</span>
            </div>

            <div className="admin-kpi-card kpi-pillar-indigo">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">TODAY'S ADMISSIONS</span>
                <UserCheck size={16} className="text-indigo" />
              </div>
              <div className="kpi-value font-display">{todayAdmissionsCount}</div>
              <span className="kpi-subtext font-mono">↑ 12% vs yesterday</span>
            </div>

            <div className="admin-kpi-card kpi-pillar-teal">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">ACTIVE SURGERIES</span>
                <Activity size={16} className="text-teal" />
              </div>
              <div className="kpi-value font-display">{activeSurgeriesCount}</div>
              <span className="kpi-subtext font-mono">6 active • 3 scheduled</span>
            </div>

            <div className="admin-kpi-card kpi-pillar-emerald">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">OT UTILIZATION</span>
                <BarChart3 size={16} className="text-emerald" />
              </div>
              <div className="kpi-value font-display">{otUtilizationRate}%</div>
              <span className="kpi-subtext font-mono">↑ 4.2% vs target 80%</span>
            </div>

            <div className="admin-kpi-card kpi-pillar-purple">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">CSSD READY</span>
                <PackageCheck size={16} className="text-purple" />
              </div>
              <div className="kpi-value font-display">{cssdReadinessPct}%</div>
              <span className="kpi-subtext font-mono">{cssdBreakdown.sterile} sterile • {cssdBreakdown.expired} expired</span>
            </div>

            <div className="admin-kpi-card kpi-pillar-amber">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">ACTIVE ALERTS</span>
                <AlertTriangle size={16} className="text-amber" />
              </div>
              <div className="kpi-value font-display">{activeAlertsCount}</div>
              <span className="kpi-subtext font-mono">{criticalAlertsCount} critical • {warningAlertsCount} warnings</span>
            </div>

            <div className="admin-kpi-card kpi-pillar-cyan">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">AVAILABLE BEDS</span>
                <Bed size={16} className="text-cyan" />
              </div>
              <div className="kpi-value font-display">{availableBedsCount}</div>
              <span className="kpi-subtext font-mono">{availableBedsCount} of {totalBedsCount} available</span>
            </div>

            <div className="admin-kpi-card kpi-pillar-red">
              <div className="kpi-header-row">
                <span className="kpi-label font-mono">DELAYED WORKFLOWS</span>
                <AlertOctagon size={16} className="text-red" />
              </div>
              <div className="kpi-value font-display">{delayedWorkflowsCount}</div>
              <span className="kpi-subtext font-mono">Turnover & CSSD holds</span>
            </div>
          </div>

          {/* ── 4. Patient Operations & Workflow Funnel ──────────── */}
          <div className="ot-card" style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} className="text-blue" />
                <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '15px' }}>
                  PATIENT OPERATIONS & WORKFLOW FUNNEL
                </h3>
              </div>
              <span className="font-mono text-muted" style={{ fontSize: '11px' }}>Derived from Live Centralized Workflow State</span>
            </div>

            {/* Funnel Stepper Strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              {[
                { label: 'REGISTERED', count: funnel.registered, color: '#475569', bg: '#f1f5f9' },
                { label: 'ADMITTED', count: funnel.admitted, color: '#0284c7', bg: '#e0f2fe' },
                { label: 'ASSESSED', count: funnel.assessed, color: '#7c3aed', bg: '#f5f3ff' },
                { label: 'PRE-OP', count: funnel.preOp, color: '#b45309', bg: '#fffbe6' },
                { label: 'OT READY', count: funnel.otReady, color: '#15803d', bg: '#dcfce7' },
                { label: 'IN OT', count: funnel.inOt, color: '#b91c1c', bg: '#fee2e2' },
                { label: 'RECOVERY', count: funnel.recovery, color: '#4338ca', bg: '#e0e7ff' },
                { label: 'DISCHARGE', count: funnel.discharge, color: '#047857', bg: '#ecfdf5' },
              ].map((st, i, arr) => (
                <React.Fragment key={st.label}>
                  <div style={{
                    flex: 1,
                    padding: '12px 10px',
                    borderRadius: '10px',
                    backgroundColor: st.bg,
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span className="font-mono" style={{ fontSize: '9px', fontWeight: 800, color: st.color }}>{st.label}</span>
                    <span className="font-display font-bold" style={{ fontSize: '18px', color: st.color }}>{st.count}</span>
                  </div>
                  {i < arr.length - 1 && <ChevronRight size={12} style={{ color: 'var(--text-muted)' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── 5. OT & CSSD Performance Double Grid ───────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {/* OT Performance */}
            <div className="ot-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} className="text-teal" />
                  <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '15px' }}>
                    OPERATING THEATRE UTILIZATION BY SUITE
                  </h3>
                </div>
                <Badge variant="teal" size="xs">Avg: {otUtilizationRate}%</Badge>
              </div>

              {/* OT Bar Chart Representation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { suite: 'OT-01', spec: 'Orthopedics', util: 89 },
                  { suite: 'OT-02', spec: 'General Surgery', util: 82 },
                  { suite: 'OT-03', spec: 'Sports Medicine', util: 74 },
                  { suite: 'OT-04', spec: 'Trauma & Emergency', util: 91 },
                  { suite: 'OT-05', spec: 'ENT & Head/Neck', util: 78 },
                  { suite: 'OT-06', spec: 'Neurosurgery Core', util: 88 },
                  { suite: 'OT-07', spec: 'Urology Endoscopy', util: 80 },
                  { suite: 'OT-08', spec: 'Trauma Reserve B', util: 85 },
                ].map(ot => (
                  <div key={ot.suite} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                    <span className="font-bold text-navy-head" style={{ width: '50px' }}>{ot.suite}</span>
                    <span style={{ width: '130px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ot.spec}</span>
                    <div style={{ flex: 1, height: '14px', backgroundColor: '#f1f5f9', borderRadius: '7px', overflow: 'hidden', display: 'flex' }}>
                      <div style={{
                        width: `${ot.util}%`,
                        backgroundColor: ot.util >= 85 ? '#0d9488' : ot.util >= 75 ? '#2563eb' : '#d97706',
                        borderRadius: '7px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <span className="font-bold" style={{ width: '35px', textAlign: 'right', color: ot.util >= 80 ? '#15803d' : '#b45309' }}>{ot.util}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CSSD Inventory Pressure */}
            <div className="ot-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PackageCheck size={18} className="text-purple" />
                  <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '15px' }}>
                    CSSD STERILE PACK LIFECYCLE DISTRIBUTION
                  </h3>
                </div>
                <Badge variant="purple" size="xs">{cssdReadinessPct}% Ready</Badge>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <span className="font-mono text-muted" style={{ fontSize: '10px' }}>STERILE & AVAILABLE</span>
                  <div className="font-display font-bold text-teal" style={{ fontSize: '20px' }}>{cssdBreakdown.sterile}</div>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <span className="font-mono text-muted" style={{ fontSize: '10px' }}>RESERVED FOR PATIENT</span>
                  <div className="font-display font-bold text-blue" style={{ fontSize: '20px' }}>{cssdBreakdown.reserved}</div>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                  <span className="font-mono text-muted" style={{ fontSize: '10px' }}>IN DECON / STERILIZING</span>
                  <div className="font-display font-bold text-amber" style={{ fontSize: '20px' }}>{cssdBreakdown.reprocessing}</div>
                </div>

                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#fef2f2', border: '1px solid #fca5a5' }}>
                  <span className="font-mono text-muted" style={{ fontSize: '10px' }}>EXPIRED / QUARANTINED</span>
                  <div className="font-display font-bold text-red" style={{ fontSize: '20px' }}>{cssdBreakdown.expired}</div>
                </div>
              </div>

              {/* Progress Bar Distribution */}
              <span className="font-mono text-muted" style={{ fontSize: '10px', fontWeight: 700 }}>INVENTORY LIFECYCLE RATIOS:</span>
              <div style={{ height: '18px', backgroundColor: '#f1f5f9', borderRadius: '9px', overflow: 'hidden', display: 'flex', marginTop: '6px' }}>
                <div style={{ width: '60%', backgroundColor: '#16a34a' }} title="Sterile (60%)" />
                <div style={{ width: '15%', backgroundColor: '#2563eb' }} title="Reserved (15%)" />
                <div style={{ width: '10%', backgroundColor: '#0284c7' }} title="In OT (10%)" />
                <div style={{ width: '10%', backgroundColor: '#d97706' }} title="Reprocessing (10%)" />
                <div style={{ width: '5%', backgroundColor: '#dc2626' }} title="Expired (5%)" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'var(--font-mono)', marginTop: '4px', color: 'var(--text-muted)' }}>
                <span>■ Sterile (60%)</span>
                <span>■ Reserved (15%)</span>
                <span>■ In OT (10%)</span>
                <span>■ Reprocessing (10%)</span>
                <span>■ Expired (5%)</span>
              </div>
            </div>
          </div>

          {/* ── 6. Bottlenecks & Department Performance Scorecard ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            {/* Current Bottlenecks */}
            <div className="ot-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} className="text-red" />
                  <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '15px' }}>
                    CURRENT WORKFLOW BOTTLENECKS
                  </h3>
                </div>
                <Badge variant="red" size="xs">3 Actionable</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#fff5f5', border: '1px solid #fca5a5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="font-mono font-bold text-red" style={{ fontSize: '11px' }}>1. CSSD STERILIZATION HOLD</span>
                    <Badge variant="red" size="xs">HIGH SEVERITY</Badge>
                  </div>
                  <p style={{ fontSize: '12px', margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>
                    Sterile pack CSSD-GEN-017 expired in Storage Vault B. Backup pack CSSD-LAP-021 verified.
                  </p>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="font-mono font-bold text-amber" style={{ fontSize: '11px' }}>2. OT-08 TURNOVER DELAY</span>
                    <Badge variant="amber" size="xs">+3m LAG</Badge>
                  </div>
                  <p style={{ fontSize: '12px', margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>
                    OT-08 turnover elapsed 28 min vs 25 min benchmark. Sanitation technician assigned.
                  </p>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="font-mono font-bold text-blue" style={{ fontSize: '11px' }}>3. SURGICAL CONSENT PENDING</span>
                    <Badge variant="blue" size="xs">PRE-OP HOLD</Badge>
                  </div>
                  <p style={{ fontSize: '12px', margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>
                    Patient Priya Sharma (P-1048) requires digital consent sign-off before OT transfer.
                  </p>
                </div>
              </div>
            </div>

            {/* Department Performance Scorecard */}
            <div className="ot-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} className="text-cyan" />
                  <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '15px' }}>
                    DEPARTMENT PERFORMANCE SCORECARD
                  </h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span className="font-mono text-muted" style={{ fontSize: '10px' }}>SYNCHRO SCORE:</span>
                  <span className="font-mono font-bold text-teal" style={{ fontSize: '14px' }}>94%</span>
                </div>
              </div>

              <table className="cssd-data-table" style={{ fontSize: '11px' }}>
                <thead>
                  <tr>
                    <th>DEPARTMENT</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>LOAD</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>RATING</th>
                    <th style={{ width: '70px', textAlign: 'center' }}>ISSUES</th>
                    <th style={{ width: '90px', textAlign: 'right' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { dept: 'Admissions & Intake', load: '72%', rating: 'Good', issues: 2, status: 'Normal', variant: 'teal' },
                    { dept: 'Nursing & Wards', load: '88%', rating: 'High', issues: 1, status: 'Normal', variant: 'blue' },
                    { dept: 'CSSD Sterilization', load: '91%', rating: 'High', issues: 3, status: 'Attention', variant: 'amber' },
                    { dept: 'Operating Theatres', load: '84%', rating: 'High', issues: 1, status: 'Normal', variant: 'indigo' },
                    { dept: 'PACU & Recovery', load: '80%', rating: 'Optimal', issues: 0, status: 'Optimal', variant: 'teal' },
                    { dept: 'Billing & Accounts', load: '92%', rating: 'Optimal', issues: 0, status: 'Optimal', variant: 'purple' },
                  ].map(row => (
                    <tr key={row.dept}>
                      <td className="font-bold text-navy-head">{row.dept}</td>
                      <td className="font-mono" style={{ textAlign: 'center' }}>{row.load}</td>
                      <td className="font-mono" style={{ textAlign: 'center' }}>{row.rating}</td>
                      <td className="font-mono" style={{ textAlign: 'center' }}>{row.issues}</td>
                      <td style={{ textAlign: 'right' }}>
                        <Badge variant={row.variant} size="xs">{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── 7. Today's Operational Insight & Action Recommendations ── */}
          <div className="ot-card" style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={18} className="text-purple" />
              <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '15px' }}>
                TODAY'S OPERATIONAL INSIGHT & EXECUTIVE ACTION PLAN
              </h3>
            </div>

            <p className="font-sans" style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)', marginBottom: '14px', fontWeight: 500 }}>
              {dynamicInsight}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Button size="sm" variant="teal" icon={CheckCircle2} onClick={() => alert('Replacement pack CSSD-LAP-021 verified & assigned.')}>
                Verify CSSD-LAP-021
              </Button>
              <Button size="sm" variant="secondary" icon={Clock} onClick={() => alert('OT-08 turnover status inspected.')}>
                Review OT-08 Turnover
              </Button>
              <Button size="sm" variant="secondary" icon={UserCheck} onClick={() => alert('Digital consent request dispatched for P-1048.')}>
                Complete Consent P-1048
              </Button>
              <Button size="sm" variant="primary" icon={Flame} onClick={() => alert('Reserve OT-08 prepped for STAT emergency case.')}>
                Allocate Reserve OT-08
              </Button>
            </div>
          </div>

          {/* ── 8. Live Operational Events Audit Stream Table ──────── */}
          <div className="ot-card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} className="text-blue" />
                <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '15px' }}>
                  LIVE OPERATIONAL WORKFLOW AUDIT STREAM
                </h3>
              </div>
              <span className="font-mono text-muted" style={{ fontSize: '11px' }}>{timelineEvents.length} Events Logged Today</span>
            </div>

            <div className="table-responsive-wrapper">
              <table className="cssd-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '100px' }}>TIME</th>
                    <th>EVENT TYPE</th>
                    <th style={{ width: '150px' }}>PATIENT / ENTITY</th>
                    <th style={{ width: '140px' }}>DEPARTMENT</th>
                    <th style={{ width: '110px' }}>STATUS</th>
                    <th>IMPACT & DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {timelineEvents.slice(0, 8).map(evt => (
                    <tr key={evt.id}>
                      <td className="font-mono" style={{ fontSize: '11px' }}>{evt.timestamp}</td>
                      <td>
                        <span className="font-mono font-bold" style={{ fontSize: '11px', color: 'var(--text-navy-head)' }}>
                          {evt.type ? evt.type.replace(/_/g, ' ') : 'WORKFLOW EVENT'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>{evt.patientName || 'System'}</span>
                          <span className="font-mono text-muted" style={{ fontSize: '9px' }}>{evt.patientCode || ''}</span>
                        </div>
                      </td>
                      <td>
                        <Badge variant="blue" size="xs">{evt.actor || 'Operations'}</Badge>
                      </td>
                      <td>
                        <Badge variant="teal" size="xs">Success</Badge>
                      </td>
                      <td style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                        {evt.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
