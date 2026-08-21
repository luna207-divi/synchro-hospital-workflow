import React, { useState, useEffect } from 'react';
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
  Sliders, 
  UserCheck, 
  Flame, 
  Lock,
  ArrowRight,
  Filter,
  Check,
  Heart,
  Timer,
  Package
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { usePatients } from '../../hooks/usePatients';
import { useTheatres } from '../../hooks/useTheatres';
import { useSurgeries } from '../../hooks/useSurgeries';
import { useCssdPacks } from '../../hooks/useCssdPacks';
import { useBillingDashboard } from '../../hooks/useBilling';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { auditService } from '../../services/auditService';
import { WorkflowTimeline } from '../dashboard/WorkflowTimeline';
import { ActionableInsights } from '../analytics/ActionableInsights';
import { ReportsPage } from '../reports/ReportsPage';
import './AdminPortal.css';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditFilter, setAuditFilter] = useState('ALL');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('OT_UTIL');

  // Live Database Hooks
  const { data: dbPatients = [] } = usePatients();
  const { data: dbTheatres = [] } = useTheatres();
  const { data: dbSurgeries = [] } = useSurgeries();
  const { data: dbPacks = [] } = useCssdPacks();
  const { data: billingData } = useBillingDashboard();
  const { events: workflowEvents } = useWorkflowEngine();

  // Load audit logs
  useEffect(() => {
    auditService.getAuditLogs({ action: auditFilter }).then(res => {
      setAuditLogs(res.data || []);
    });
  }, [auditFilter]);

  // Derived KPI Metrics for Top 8 Cards
  const totalPatientsCount = dbPatients.length > 0 ? dbPatients.length : 1248;
  const todayAdmissionsCount = dbPatients.filter(p => p.admission_status === 'ADMITTED').length || 86;
  const todaySurgeriesCount = dbSurgeries.length > 0 ? dbSurgeries.length : 34;
  
  const activeTheatres = dbTheatres.length > 0 ? dbTheatres : [
    { id: '1', suite_code: 'OT-01', name: 'Suite 01', status: 'IN_SURGERY', specialty: 'Orthopedics' },
    { id: '2', suite_code: 'OT-02', name: 'Suite 02', status: 'READY', specialty: 'General & Lap' },
    { id: '3', suite_code: 'OT-03', name: 'Suite 03', status: 'TURNOVER', specialty: 'Sports Medicine' },
    { id: '4', suite_code: 'OT-04', name: 'Suite 04', status: 'IN_SURGERY', specialty: 'Cardiovascular' },
  ];
  const otUtilizationRate = Math.round((activeTheatres.filter(t => t.status === 'IN_SURGERY').length / activeTheatres.length) * 100) || 82;

  const activeAlertsCount = activeTheatres.filter(t => t.status === 'BLOCKED').length + dbPacks.filter(p => p.status === 'EXPIRED').length || 7;
  const availableBedsCount = 23;
  const totalBedsCount = 120;
  const cssdSterilePacks = dbPacks.filter(p => p.status === 'STERILE' || p.status === 'DISPATCHED').length;
  const cssdAvailabilityPct = dbPacks.length > 0 ? Math.round((cssdSterilePacks / dbPacks.length) * 100) : 94;
  const delayedWorkflowsCount = workflowEvents.filter(e => e.event_type === 'STATUS_CHANGE' && e.new_status === 'BLOCKED').length || 4;

  // Navigation Tabs (trimmed to 9 primary)
  const navTabs = [
    { id: 'Overview', label: 'Overview', icon: Building2 },
    { id: 'Patients', label: 'Patients', icon: Users },
    { id: 'Doctors', label: 'Doctors & Staff', icon: Stethoscope },
    { id: 'Departments', label: 'Departments', icon: Building2 },
    { id: 'Admissions', label: 'Admissions', icon: UserCheck },
    { id: 'RoomsBeds', label: 'Rooms & Beds', icon: Bed },
    { id: 'OT', label: 'Operating Theatres', icon: Activity },
    { id: 'CSSD', label: 'CSSD', icon: PackageCheck },
    { id: 'Billing', label: 'Billing', icon: CreditCard },
  ];

  // More tabs (overflow)
  const moreNavTabs = [
    { id: 'Workflow', label: 'Workflow', icon: Workflow },
    { id: 'Alerts', label: 'Alerts', icon: AlertTriangle },
    { id: 'Analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'Reports', label: 'Reports', icon: FileText },
    { id: 'AuditLogs', label: 'Audit Logs', icon: ShieldCheck },
    { id: 'Settings', label: 'Settings', icon: SettingsIcon },
  ];

  const [showMoreTabs, setShowMoreTabs] = useState(false);

  const allTabs = [...navTabs, ...moreNavTabs];
  const activeTabInMore = moreNavTabs.some(t => t.id === activeTab);

  // Doctors & Staff Directory Mock/DB List
  const staffMembers = [
    { id: 'doc-1', name: 'Dr. K. Patel', role: 'Surgeon', dept: 'General Surgery', spec: 'Laparoscopic', avail: 'IN_SURGERY', patients: 4 },
    { id: 'doc-2', name: 'Dr. A. Miller', role: 'Surgeon', dept: 'Orthopedics', spec: 'Joint Arthroplasty', avail: 'ON_DUTY', patients: 6 },
    { id: 'doc-3', name: 'Nurse J. Doe', role: 'Nurse Lead', dept: 'Operating Theatres', spec: 'Surgical Prep', avail: 'ON_DUTY', patients: 8 },
    { id: 'doc-4', name: 'Tech S. Rao', role: 'CSSD Tech', dept: 'Sterilization', spec: 'Autoclave Operation', avail: 'ON_DUTY', patients: 0 },
    { id: 'doc-5', name: 'Dr. S. Chen', role: 'Anesthesiologist', dept: 'Anesthesia', spec: 'Cardiovascular', avail: 'ON_CALL', patients: 3 },
  ];

  // CSV Export Generator Handler
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Report Type,Generated At,Hospital,Scope\n"
      + `${selectedReportType},${new Date().toISOString()},Apex Medical Center,Hospital-Wide Operational Audit\n\n`
      + "Metric,Value,Benchmark,Status\n"
      + `OT Utilization,${otUtilizationRate}%,80.0%,Optimal\n`
      + `Available Beds,${availableBedsCount},40,Optimal\n`
      + `CSSD Pack Availability,${cssdAvailabilityPct}%,90.0%,Optimal\n`
      + `Delayed Workflows,${delayedWorkflowsCount},0,Action Required\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SYNCHRO_Admin_Report_${selectedReportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PDF Print Handler
  const handleExportPDF = () => {
    window.print();
  };

  // Recent workflow events for overview
  const recentEvents = [
    { time: '11:42 AM', event: 'Sterile pack verified', dept: 'CSSD', entity: 'Pack #CSSD-CV-01', status: 'Passed', statusType: 'normal' },
    { time: '11:36 AM', event: 'Patient admitted', dept: 'Admissions', entity: 'MRN-1048', status: 'Completed', statusType: 'normal' },
    { time: '11:28 AM', event: 'OT preparation started', dept: 'OT', entity: 'OT-04', status: 'In Progress', statusType: 'active' },
    { time: '11:15 AM', event: 'Consent form signed', dept: 'Admissions', entity: 'P-1024', status: 'Completed', statusType: 'normal' },
    { time: '11:02 AM', event: 'Autoclave cycle complete', dept: 'CSSD', entity: 'AC-02', status: 'Cooling', statusType: 'attention' },
    { time: '10:48 AM', event: 'Surgery completed', dept: 'OT', entity: 'OT-01', status: 'Completed', statusType: 'normal' },
  ];

  return (
    <div className="admin-portal-container">
      {/* ── 1. Hero Header Card ──────────────────────────────── */}
      <div className="admin-hero-header">
        <div className="admin-title-side">
          <div className="admin-badge-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="admin-main-heading font-display">Hospital Administration Command Center</h1>
            <span className="admin-subhead">
              Enterprise-wide operational visibility across the hospital workflow.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Badge variant="teal" size="md">ADMIN AUTHORIZED</Badge>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => window.location.reload()}>
            Refresh Sync
          </Button>
        </div>
      </div>

      {/* ── 2. KPI Metric Cards (4 × 2 Grid) ────────────────── */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card kpi-pillar-blue">
          <div className="kpi-header-row">
            <span className="kpi-label">TOTAL PATIENTS</span>
            <Users size={16} className="text-blue" />
          </div>
          <div className="kpi-value">{totalPatientsCount.toLocaleString()}</div>
          <span className="kpi-subtext">Active clinical census</span>
        </div>

        <div className="admin-kpi-card kpi-pillar-indigo">
          <div className="kpi-header-row">
            <span className="kpi-label">TODAY'S ADMISSIONS</span>
            <UserCheck size={16} className="text-indigo" />
          </div>
          <div className="kpi-value">{todayAdmissionsCount}</div>
          <span className="kpi-subtext">+12% vs yesterday</span>
        </div>

        <div className="admin-kpi-card kpi-pillar-teal">
          <div className="kpi-header-row">
            <span className="kpi-label">TODAY'S SURGERIES</span>
            <Activity size={16} className="text-teal" />
          </div>
          <div className="kpi-value">{todaySurgeriesCount}</div>
          <span className="kpi-subtext">28 completed · 6 scheduled</span>
        </div>

        <div className="admin-kpi-card kpi-pillar-emerald">
          <div className="kpi-header-row">
            <span className="kpi-label">OT UTILIZATION</span>
            <BarChart3 size={16} className="text-emerald" />
          </div>
          <div className="kpi-value">{otUtilizationRate}%</div>
          <span className="kpi-subtext">Target: 80%</span>
        </div>

        <div className="admin-kpi-card kpi-pillar-amber">
          <div className="kpi-header-row">
            <span className="kpi-label">ACTIVE ALERTS</span>
            <AlertTriangle size={16} className="text-amber" />
          </div>
          <div className="kpi-value">{activeAlertsCount}</div>
          <span className="kpi-subtext">2 critical · 5 warnings</span>
        </div>

        <div className="admin-kpi-card kpi-pillar-cyan">
          <div className="kpi-header-row">
            <span className="kpi-label">AVAILABLE BEDS</span>
            <Bed size={16} className="text-cyan" />
          </div>
          <div className="kpi-value">{availableBedsCount}</div>
          <span className="kpi-subtext">{availableBedsCount} of {totalBedsCount} available</span>
        </div>

        <div className="admin-kpi-card kpi-pillar-purple">
          <div className="kpi-header-row">
            <span className="kpi-label">CSSD AVAILABILITY</span>
            <PackageCheck size={16} className="text-purple" />
          </div>
          <div className="kpi-value">{cssdAvailabilityPct}%</div>
          <span className="kpi-subtext">Sterile packs ready</span>
        </div>

        <div className="admin-kpi-card kpi-pillar-red">
          <div className="kpi-header-row">
            <span className="kpi-label">DELAYED WORKFLOWS</span>
            <Clock size={16} className="text-red" />
          </div>
          <div className="kpi-value">{delayedWorkflowsCount}</div>
          <span className="kpi-subtext">2 requiring attention</span>
        </div>
      </div>

      {/* ── 3. Tab Navigation Bar ────────────────────────────── */}
      <div className="admin-tabs-nav">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`admin-nav-btn ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => { setActiveTab(tab.id); setShowMoreTabs(false); }}
              type="button"
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* More dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className={`admin-nav-btn ${activeTabInMore ? 'is-active' : ''}`}
            onClick={() => setShowMoreTabs(!showMoreTabs)}
            type="button"
          >
            <Sliders size={14} />
            <span>{activeTabInMore ? allTabs.find(t => t.id === activeTab)?.label : 'More'}</span>
          </button>
          {showMoreTabs && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              background: 'var(--surface-card, #ffffff)',
              border: '1px solid var(--border-default, #e2e8f0)',
              borderRadius: 'var(--radius-md, 12px)',
              boxShadow: 'var(--shadow-lg, 0 10px 28px rgba(10,25,47,0.09))',
              zIndex: 100,
              minWidth: '180px',
              padding: '6px',
            }}>
              {moreNavTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`admin-nav-btn ${activeTab === tab.id ? 'is-active' : ''}`}
                    style={{ width: '100%', justifyContent: 'flex-start' }}
                    onClick={() => { setActiveTab(tab.id); setShowMoreTabs(false); }}
                    type="button"
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Tab Content Panel ─────────────────────────────── */}
      <div className="admin-tab-content">
        {/* TAB: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Executive Operations Dashboard</h2>
                <span className="tab-subheading">Real-time operational visibility across hospital departments.</span>
              </div>
            </div>

            {/* Recent Events + Department Telemetry side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
              {/* Recent Workflow Events */}
              <div className="admin-events-card">
                <h3>
                  <Activity size={16} style={{ color: 'var(--status-cyan-text)' }} />
                  Recent Workflow Events
                </h3>
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>TIME</th>
                      <th>EVENT</th>
                      <th>DEPARTMENT</th>
                      <th>RELATED ENTITY</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((evt, idx) => (
                      <tr key={idx}>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{evt.time}</td>
                        <td style={{ fontWeight: 500, color: 'var(--text-navy-head)' }}>{evt.event}</td>
                        <td><Badge variant="blue" size="xs">{evt.dept}</Badge></td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--status-cyan-text)' }}>{evt.entity}</td>
                        <td>
                          <span className={`status-pill is-${evt.statusType}`}>
                            <span className={`status-dot ${evt.statusType === 'normal' ? 'green' : evt.statusType === 'active' ? 'cyan' : 'amber'}`} />
                            {evt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quick Department Telemetry */}
              <div className="dept-telemetry-card">
                <h3 className="font-display" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-navy-head)', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} style={{ color: 'var(--status-cyan-text)' }} />
                  Department Telemetry
                </h3>

                <div className="dept-telemetry-row">
                  <span className="dept-telemetry-name">Admissions</span>
                  <span className="status-pill is-normal"><span className="status-dot green" />Normal</span>
                </div>
                <div className="dept-telemetry-row">
                  <span className="dept-telemetry-name">Operating Theatres</span>
                  <span className="status-pill is-active"><span className="status-dot cyan" />3 Active</span>
                </div>
                <div className="dept-telemetry-row">
                  <span className="dept-telemetry-name">CSSD</span>
                  <span className="status-pill is-normal"><span className="status-dot green" />94% Ready</span>
                </div>
                <div className="dept-telemetry-row">
                  <span className="dept-telemetry-name">Nursing</span>
                  <span className="status-pill is-active"><span className="status-dot cyan" />12 Active</span>
                </div>
                <div className="dept-telemetry-row">
                  <span className="dept-telemetry-name">Billing</span>
                  <span className="status-pill is-normal"><span className="status-dot green" />Normal</span>
                </div>
              </div>
            </div>

            {/* Analytics Summary Cards */}
            <div className="admin-analytics-grid">
              {/* Patient Census */}
              <div className="admin-analytics-card">
                <h3><Users size={16} /> Patient Census</h3>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Total Patients</span>
                  <span className="analytics-stat-value">{totalPatientsCount.toLocaleString()}</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Admitted</span>
                  <span className="analytics-stat-value">{todayAdmissionsCount}</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Outpatient</span>
                  <span className="analytics-stat-value">312</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Discharged (Today)</span>
                  <span className="analytics-stat-value">24</span>
                </div>
              </div>

              {/* Bed Utilization */}
              <div className="admin-analytics-card">
                <h3><Bed size={16} /> Hospital Bed Utilization</h3>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Occupied</span>
                  <span className="analytics-stat-value">{totalBedsCount - availableBedsCount}</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Available</span>
                  <span className="analytics-stat-value">{availableBedsCount}</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Reserved</span>
                  <span className="analytics-stat-value">8</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Utilization</span>
                  <span className="analytics-stat-value">{Math.round(((totalBedsCount - availableBedsCount) / totalBedsCount) * 100)}%</span>
                </div>
              </div>

              {/* OT Utilization */}
              <div className="admin-analytics-card">
                <h3><Activity size={16} /> OT Utilization</h3>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Scheduled</span>
                  <span className="analytics-stat-value">{todaySurgeriesCount}</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Completed</span>
                  <span className="analytics-stat-value">28</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Delayed</span>
                  <span className="analytics-stat-value">{delayedWorkflowsCount}</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Utilization</span>
                  <span className="analytics-stat-value">{otUtilizationRate}%</span>
                </div>
              </div>

              {/* CSSD */}
              <div className="admin-analytics-card">
                <h3><PackageCheck size={16} /> CSSD Sterilization</h3>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Packs Processed</span>
                  <span className="analytics-stat-value">148</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Ready</span>
                  <span className="analytics-stat-value">{cssdAvailabilityPct}%</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">In Sterilization</span>
                  <span className="analytics-stat-value">6</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Expired</span>
                  <span className="analytics-stat-value">2</span>
                </div>
              </div>

              {/* Workflow Performance */}
              <div className="admin-analytics-card">
                <h3><Timer size={16} /> Workflow Performance</h3>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Avg. Admission Time</span>
                  <span className="analytics-stat-value">18 min</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Avg. OT Turnover</span>
                  <span className="analytics-stat-value">22 min</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Delayed Workflows</span>
                  <span className="analytics-stat-value">{delayedWorkflowsCount}</span>
                </div>
                <div className="analytics-stat-row">
                  <span className="analytics-stat-label">Alert Resolution</span>
                  <span className="analytics-stat-value">8 min</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: PATIENTS */}
        {activeTab === 'Patients' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Authorized Patient Management</h2>
                <span className="tab-subheading">Central patient records, readiness clearance, and assigned suites</span>
              </div>
              <SearchInput
                placeholder="Search patient code or name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '260px' }}
              />
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>PATIENT CODE</th>
                  <th>FULL NAME</th>
                  <th>AGE / GENDER</th>
                  <th>STATUS</th>
                  <th>ASSIGNED DOCTOR</th>
                  <th>BED / ROOM</th>
                  <th>READINESS</th>
                </tr>
              </thead>
              <tbody>
                {dbPatients.map(p => (
                  <tr key={p.id}>
                    <td className="font-mono text-cyan">{p.patient_code || p.id?.slice(0, 8)}</td>
                    <td className="font-semibold">{p.first_name} {p.last_name}</td>
                    <td>{p.gender}</td>
                    <td><Badge variant="blue" size="xs">{p.admission_status || 'ADMITTED'}</Badge></td>
                    <td>Dr. K. Patel</td>
                    <td>{p.assigned_bed_id ? 'Pre-Op Bay 03' : 'R101-C'}</td>
                    <td><span className="text-teal font-mono">100% Cleared</span></td>
                  </tr>
                ))}
                {dbPatients.length === 0 && (
                  <tr>
                    <td className="font-mono text-cyan">P-1024</td>
                    <td className="font-semibold">Elena Rostova</td>
                    <td>58y / Female</td>
                    <td><Badge variant="blue" size="xs">ADMITTED</Badge></td>
                    <td>Dr. K. Patel</td>
                    <td>Pre-Op Bay 03 (R101-C)</td>
                    <td><span className="text-teal font-mono">100% Cleared</span></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: DOCTORS & STAFF */}
        {activeTab === 'Doctors' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Doctor & Staff Directory</h2>
                <span className="tab-subheading">Staff allocation, specialization, and availability status</span>
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>ROLE</th>
                  <th>DEPARTMENT</th>
                  <th>SPECIALIZATION</th>
                  <th>AVAILABILITY</th>
                  <th>ACTIVE CASES</th>
                </tr>
              </thead>
              <tbody>
                {staffMembers.map(s => (
                  <tr key={s.id}>
                    <td className="font-semibold">{s.name}</td>
                    <td><Badge variant="purple" size="xs">{s.role}</Badge></td>
                    <td>{s.dept}</td>
                    <td>{s.spec}</td>
                    <td>
                      <Badge variant={s.avail === 'IN_SURGERY' ? 'amber' : s.avail === 'ON_DUTY' ? 'teal' : 'blue'} size="xs">
                        {s.avail}
                      </Badge>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{s.patients} cases</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: DEPARTMENTS */}
        {activeTab === 'Departments' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Hospital Departments</h2>
                <span className="tab-subheading">Operational pillars and headcount breakdown</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { name: 'Admissions & Intake', code: 'ADM', pillar: 'blue', staff: 14, head: 'M. Vance' },
                { name: 'Operating Theatres', code: 'OT', pillar: 'indigo', staff: 32, head: 'Dr. K. Patel' },
                { name: 'CSSD Sterilization', code: 'CSSD', pillar: 'teal', staff: 18, head: 'S. Rao' },
                { name: 'Billing & Accounts', code: 'BILL', pillar: 'purple', staff: 12, head: 'R. Sharma' }
              ].map(d => (
                <div key={d.code} style={{
                  padding: '24px',
                  background: 'var(--surface-card, #ffffff)',
                  border: '1px solid var(--border-default, #e2e8f0)',
                  borderRadius: 'var(--radius-lg, 16px)',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <Badge variant={d.pillar} size="sm">{d.code}</Badge>
                  <h3 className="font-display" style={{ fontSize: '1rem', color: 'var(--text-navy-head)', margin: '12px 0 6px 0' }}>{d.name}</h3>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    <span>Head: <strong style={{ color: 'var(--text-secondary)' }}>{d.head}</strong></span> · <span>Staff: <strong style={{ color: 'var(--text-secondary)' }}>{d.staff} members</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ADMISSIONS */}
        {activeTab === 'Admissions' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Admissions & Intake Log</h2>
                <span className="tab-subheading">Pre-op patient intake, room assignments, and clearance status</span>
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ADMISSION ID</th>
                  <th>PATIENT</th>
                  <th>ADMISSION TYPE</th>
                  <th>REASON</th>
                  <th>ROOM / BED</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono text-cyan">ADM-2026-9921</td>
                  <td>Elena Rostova</td>
                  <td><Badge variant="blue" size="xs">ELECTIVE</Badge></td>
                  <td>Laparoscopic Cholecystectomy</td>
                  <td>Pre-Op Bay 03 (R101-C)</td>
                  <td><Badge variant="teal" size="xs">ADMITTED</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: ROOMS & BEDS */}
        {activeTab === 'RoomsBeds' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Visual Rooms & Beds Occupancy</h2>
                <span className="tab-subheading">Live bed utilization across Pavilion wings</span>
              </div>
            </div>

            <div className="occupancy-grid">
              {[
                { room: 'Pre-Op Bay 01', wing: 'Pavilion A', beds: [{ num: 'R101-A', status: 'OCCUPIED', patient: 'Elena Rostova' }, { num: 'R101-B', status: 'AVAILABLE', patient: null }] },
                { room: 'Pre-Op Bay 02', wing: 'Pavilion A', beds: [{ num: 'R102-A', status: 'AVAILABLE', patient: null }, { num: 'R102-B', status: 'OCCUPIED', patient: 'Viktor Vance' }] },
                { room: 'Post-Op Recovery', wing: 'Pavilion B', beds: [{ num: 'PACU-01', status: 'OCCUPIED', patient: 'Sarah Jenkins' }, { num: 'PACU-02', status: 'AVAILABLE', patient: null }] }
              ].map((r, idx) => (
                <div key={idx} className="occupancy-room-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-navy-head)' }}>{r.room}</span>
                    <span className="font-mono" style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{r.wing}</span>
                  </div>

                  <div className="beds-row">
                    {r.beds.map(b => (
                      <div key={b.num} className={`bed-chip ${b.status === 'OCCUPIED' ? 'is-occupied' : 'is-available'}`}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span className="font-mono font-semibold">{b.num}</span>
                          <span className="font-mono" style={{ fontSize: '0.65rem', color: b.status === 'OCCUPIED' ? 'var(--status-cyan-text)' : 'var(--status-green-text)' }}>{b.status}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.patient || 'Vacant'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: OPERATING THEATRES */}
        {activeTab === 'OT' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Real-Time Operating Theatre Status</h2>
                <span className="tab-subheading">Surgical suite status telemetry and active procedures</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {activeTheatres.map(ot => (
                <div key={ot.id || ot.suite_code} style={{
                  padding: '24px',
                  background: 'var(--surface-card, #ffffff)',
                  border: '1px solid var(--border-default, #e2e8f0)',
                  borderRadius: 'var(--radius-lg, 16px)',
                  boxShadow: 'var(--shadow-xs)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--status-cyan-text)' }}>{ot.suite_code}</span>
                    <Badge variant={ot.status === 'IN_SURGERY' ? 'indigo' : ot.status === 'READY' ? 'teal' : 'amber'} size="xs">
                      {ot.status}
                    </Badge>
                  </div>
                  <div style={{ marginTop: '14px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                    <div>Specialty: <strong style={{ color: 'var(--text-navy-head)' }}>{ot.specialty || 'General Surgery'}</strong></div>
                    <div style={{ marginTop: '4px' }}>Surgeon: <strong style={{ color: 'var(--text-navy-head)' }}>Dr. K. Patel</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CSSD */}
        {activeTab === 'CSSD' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">CSSD Sterile Pack Inventory</h2>
                <span className="tab-subheading">Autoclave sterilization cycles and pack lifecycle tracking</span>
              </div>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>PACK CODE</th>
                  <th>PACK NAME</th>
                  <th>STERILIZATION STATUS</th>
                  <th>LOCATION</th>
                  <th>ASSIGNED OT</th>
                </tr>
              </thead>
              <tbody>
                {dbPacks.map(p => (
                  <tr key={p.id}>
                    <td className="font-mono text-cyan">{p.pack_code}</td>
                    <td className="font-semibold">{p.pack_name}</td>
                    <td><Badge variant={p.status === 'STERILE' ? 'teal' : 'amber'} size="xs">{p.status}</Badge></td>
                    <td>{p.current_location}</td>
                    <td>{p.assigned_theatre_id ? 'OT-02' : 'Unassigned'}</td>
                  </tr>
                ))}
                {dbPacks.length === 0 && (
                  <tr>
                    <td className="font-mono text-cyan">CSSD-00428</td>
                    <td className="font-semibold">Laparoscopic Cholecystectomy Pack B</td>
                    <td><Badge variant="teal" size="xs">STERILE</Badge></td>
                    <td>CSSD Sterile Bay 2</td>
                    <td>OT-02</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: BILLING OVERVIEW */}
        {activeTab === 'Billing' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Billing Overview & Revenue Pipeline</h2>
                <span className="tab-subheading">Procedure charges, issued invoices, and revenue metrics</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{
                padding: '20px',
                background: 'var(--surface-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL REVENUE (MONTH)</span>
                <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-green-text)', marginTop: '8px' }}>
                  ₹{(billingData?.stats?.totalRevenue || 1245000).toLocaleString()}
                </div>
              </div>
              <div style={{
                padding: '20px',
                background: 'var(--surface-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>PENDING CHARGES</span>
                <div className="font-display" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--status-amber-text)', marginTop: '8px' }}>
                  ₹{(billingData?.stats?.pendingRevenue || 340000).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: WORKFLOW */}
        {activeTab === 'Workflow' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Cross-Department Workflow Bottlenecks</h2>
                <span className="tab-subheading">Telemetry stream and handoff delay analysis</span>
              </div>
            </div>
            <WorkflowTimeline />
          </div>
        )}

        {/* TAB: ALERTS */}
        {activeTab === 'Alerts' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Active Hospital Alerts</h2>
                <span className="tab-subheading">Operational bottleneck warnings and resolution triggers</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{
                padding: '20px',
                background: 'var(--status-red-bg)',
                border: '1px solid var(--status-red-border)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div>
                  <Badge variant="red" size="xs">CRITICAL</Badge>
                  <h4 className="font-display" style={{ margin: '8px 0 4px 0', color: 'var(--text-navy-head)' }}>Pack #CSSD-00421 Autoclave Cooldown Delay</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0 }}>OT-02 blocked due to sterilization cooldown. Re-assign Pack #CSSD-00428.</p>
                </div>
                <Button variant="primary" size="sm">Resolve Alert</Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ANALYTICS */}
        {activeTab === 'Analytics' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Actionable Delay Analytics — "WHERE ARE WE LOSING TIME?"</h2>
                <span className="tab-subheading">Root-cause surgical handoff delay analysis and benchmark efficiency</span>
              </div>
            </div>
            <ActionableInsights />
          </div>
        )}

        {/* TAB: REPORTS */}
        {activeTab === 'Reports' && (
          <ReportsPage />
        )}

        {/* TAB: AUDIT LOGS */}
        {activeTab === 'AuditLogs' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">Operational Audit Trail</h2>
                <span className="tab-subheading">Immutable log of Who, What, When, Related Record, and Action</span>
              </div>

              <select 
                className="form-input" 
                style={{ width: 'auto' }}
                value={auditFilter}
                onChange={e => setAuditFilter(e.target.value)}
              >
                <option value="ALL">All Actions</option>
                <option value="CSSD_ASSIGNED_PACK">CSSD Assigned Pack</option>
                <option value="DOCTOR_ACKNOWLEDGED_ALERT">Doctor Acknowledged Alert</option>
                <option value="NURSE_MARKED_PATIENT_READY">Nurse Marked Patient Ready</option>
                <option value="FRONT_DESK_ADMITTED_PATIENT">Front Desk Admitted Patient</option>
                <option value="ADMIN_CHANGED_ROLE">Admin Changed Role</option>
              </select>
            </div>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>TIMESTAMP (WHEN)</th>
                  <th>USER (WHO)</th>
                  <th>ROLE</th>
                  <th>ACTION</th>
                  <th>RELATED RECORD</th>
                  <th>DETAILS (WHAT)</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id}>
                    <td className="font-mono text-muted">{log.when}</td>
                    <td className="font-semibold">{log.who}</td>
                    <td><Badge variant="purple" size="xs">{log.role}</Badge></td>
                    <td><Badge variant="teal" size="xs">{log.action}</Badge></td>
                    <td className="font-mono text-cyan">{log.relatedRecord}</td>
                    <td>{log.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'Settings' && (
          <div>
            <div className="tab-section-header">
              <div>
                <h2 className="tab-heading font-display">System Configuration & Security Controls</h2>
                <span className="tab-subheading">RBAC role permission matrix, notification adapters, and HIPAA safeguards</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{
                padding: '24px',
                background: 'var(--surface-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--shadow-xs)',
              }}>
                <h3 className="font-display" style={{ fontSize: 'var(--text-md)', color: 'var(--text-navy-head)', margin: '0 0 12px 0' }}>
                  RBAC Operational Visibility Scope
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  Hospital Administrator role possesses the broadest operational authority across all 15 operational channels.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
