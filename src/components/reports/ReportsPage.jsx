import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Building2, 
  Filter, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Activity, 
  UserCheck, 
  PackageCheck, 
  Sparkles,
  ChevronRight,
  Printer,
  Users,
  Bed,
  Stethoscope,
  AlertTriangle,
  FileBarChart,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './ReportsPage.css';

export const ReportsPage = () => {
  // Active report category selection
  const [selectedCategory, setSelectedCategory] = useState('OT_UTIL_SPEC');

  // Generator filter parameters
  const [dateRange, setDateRange] = useState('Today (Live Data)');
  const [department, setDepartment] = useState('All Departments');
  const [theatre, setTheatre] = useState('All Suites');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedTime, setLastGeneratedTime] = useState('Just Now (Live)');

  // 6 Core Report Definition & Meta
  const reportCards = [
    {
      id: 'OT_UTIL_SPEC',
      name: 'Operating Theatre Report',
      dept: 'Operating Theatres',
      pillar: 'indigo',
      icon: Stethoscope,
      desc: 'Suite utilization rates, elective block efficiency, turnover times, and procedure duration metrics.',
      badgeText: '82.0% Util Rate'
    },
    {
      id: 'ADMISSIONS',
      name: 'Admissions Report',
      dept: 'Admissions & Intake',
      pillar: 'blue',
      icon: UserCheck,
      desc: 'Pre-op clearance punctuality, admission wait times, bed allocation speed, and discharge speed.',
      badgeText: '16 Inpatients Today'
    },
    {
      id: 'PATIENT_READY',
      name: 'Patient Status Report',
      dept: 'Clinical Census',
      pillar: 'teal',
      icon: Users,
      desc: 'Active patient census, digital consent tracking, lab test clearance, and consultant assignments.',
      badgeText: '87.5% Cleared'
    },
    {
      id: 'CSSD_STERIL',
      name: 'CSSD Sterilization Report',
      dept: 'CSSD Sterilization',
      pillar: 'purple',
      icon: PackageCheck,
      desc: 'Autoclave cycle compliance, biological spore clearance, pack expiry log, and tray utilization.',
      badgeText: '100% Pass Rate'
    },
    {
      id: 'WORKFLOW_DELAY',
      name: 'Incident & Alerts Report',
      dept: 'Intelligence & Quality',
      pillar: 'red',
      icon: AlertTriangle,
      desc: 'Root-cause delay categorization, cross-department handoff lags, and exception monitoring.',
      badgeText: '38 Total Events'
    },
    {
      id: 'DEPT_PERF',
      name: 'Hospital Operations Report',
      dept: 'Executive Scorecard',
      pillar: 'cyan',
      icon: Building2,
      desc: 'Cross-functional performance comparing Admissions, OT, CSSD, Nursing, and Billing benchmarks.',
      badgeText: '92.4 Score'
    }
  ];

  // Comprehensive dataset dictionary for all 6 reports
  const getReportData = () => {
    switch (selectedCategory) {
      case 'OT_UTIL_SPEC':
        return {
          id: 'OT_UTIL_SPEC',
          docId: 'REP-OTU-2026-08',
          title: 'Operating Theatre Utilization & Daily Hospital Operations Report',
          subtitle: 'Utilization and throughput across active surgical suites',
          abstract: 'Comprehensive utilization analysis across 12 operational surgical suites covering 14 scheduled cases today.',
          kpis: [
            { label: 'HOSPITAL OT UTILIZATION', value: '82.0%', target: 'Target: 80.0%', status: 'optimal' },
            { label: 'SURGICAL CASES TODAY', value: '14 cases', target: '14 Scheduled cases', status: 'normal' },
            { label: 'AVERAGE TURNOVER', value: '21.4 min', target: 'Across active OTs', status: 'optimal' },
            { label: 'DELAYED PROCEDURES', value: '2 cases', target: '14.2% of today\'s cases', status: 'warning' }
          ],
          tableTitle: 'Operating Theatre Performance',
          tableSubtitle: 'Utilization and throughput across active surgical suites',
          columns: [
            { key: 'theatre', label: 'THEATRE', width: '12%', align: 'left', isMono: true },
            { key: 'specialty', label: 'SPECIALTY', width: '25%', align: 'left' },
            { key: 'cases', label: 'CASES TODAY', width: '14%', align: 'right' },
            { key: 'utilization', label: 'UTILIZATION', width: '14%', align: 'right' },
            { key: 'duration', label: 'AVG DURATION', width: '17%', align: 'right', isMono: true },
            { key: 'status', label: 'STATUS', width: '18%', align: 'center', isBadge: true }
          ],
          rows: [
            { theatre: 'OT-01', specialty: 'Orthopedics & Joint', cases: '3 cases', utilization: '89.2%', duration: '1h 48m', status: 'Optimal', statusType: 'optimal' },
            { theatre: 'OT-02', specialty: 'General & Laparoscopic', cases: '4 cases', utilization: '81.4%', duration: '1h 15m', status: 'Optimal', statusType: 'optimal' },
            { theatre: 'OT-03', specialty: 'Sports Med & Trauma', cases: '2 cases', utilization: '74.6%', duration: '1h 52m', status: 'Under Benchmark', statusType: 'warning' },
            { theatre: 'OT-04', specialty: 'Cardiovascular & Thoracic', cases: '3 cases', utilization: '92.0%', duration: '3h 10m', status: 'High Volume', statusType: 'info' },
            { theatre: 'OT-05', specialty: 'Neurosurgery Suite', cases: '2 cases', utilization: '68.0%', duration: '2h 45m', status: 'Critical Lag', statusType: 'danger' }
          ],
          insights: 'Operating Theatre utilization exceeds executive benchmark target by 2.0%. OT-04 experienced high volume cardiac procedures requiring extended turnover, while OT-03 fell under benchmark due to morning patient clearance delay.'
        };

      case 'ADMISSIONS':
        return {
          id: 'ADMISSIONS',
          docId: 'REP-ADM-2026-08',
          title: 'Hospital Admissions & Pre-Op Intake Audit Report',
          subtitle: 'Intake volume, pre-op clearance efficiency, bed assignments, and discharge speed',
          abstract: 'Pre-op patient intake volume, admission clearance times, consultant assignments, and bed allocation telemetry.',
          kpis: [
            { label: 'TODAY\'S ADMISSIONS', value: '16 patients', target: '16 Inpatient registrations', status: 'normal' },
            { label: 'AVG ADMISSION WAIT', value: '18.2 min', target: 'Target: < 25.0 min', status: 'optimal' },
            { label: 'BED ALLOCATION SPEED', value: '12.4 min', target: 'Pre-op bay assignment', status: 'optimal' },
            { label: 'DISCHARGES CLEARED', value: '11 cleared', target: '100% processed on time', status: 'optimal' }
          ],
          tableTitle: 'Today\'s Admissions & Intake Registry',
          tableSubtitle: 'Real-time status of admitted inpatients, clearance progress, and consultant assignments',
          columns: [
            { key: 'patient', label: 'PATIENT', width: '18%', align: 'left', isStrong: true },
            { key: 'mrn', label: 'MRN', width: '11%', align: 'left', isMono: true },
            { key: 'department', label: 'DEPARTMENT', width: '16%', align: 'left' },
            { key: 'consultant', label: 'CONSULTANT', width: '15%', align: 'left' },
            { key: 'type', label: 'ADMISSION TYPE', width: '13%', align: 'center', isTypePill: true },
            { key: 'status', label: 'STATUS', width: '13%', align: 'center', isBadge: true },
            { key: 'registered', label: 'REGISTERED', width: '14%', align: 'right', isMono: true }
          ],
          rows: [
            { patient: 'Elena Rostova', mrn: 'MRN-1048', department: 'General Surgery', consultant: 'Dr. K. Patel', type: 'Elective', status: 'Admitted', statusType: 'optimal', registered: '08:15 AM' },
            { patient: 'Viktor Vance', mrn: 'MRN-1052', department: 'Orthopedics', consultant: 'Dr. A. Miller', type: 'Emergency', status: 'Admitted', statusType: 'optimal', registered: '08:40 AM' },
            { patient: 'Sarah Jenkins', mrn: 'MRN-1059', department: 'Cardiology', consultant: 'Dr. S. Chen', type: 'Elective', status: 'Waiting', statusType: 'info', registered: '09:10 AM' },
            { patient: 'Marcus Aurel', mrn: 'MRN-1064', department: 'Neurology', consultant: 'Dr. R. Taylor', type: 'Transfer', status: 'Pending', statusType: 'warning', registered: '09:55 AM' },
            { patient: 'Diane Wu', mrn: 'MRN-1070', department: 'Oncology', consultant: 'Dr. M. Vance', type: 'Elective', status: 'Discharged', statusType: 'optimal', registered: '10:20 AM' }
          ],
          insights: 'Admissions turnaround remains within target bounds with an average intake wait of 18.2 minutes. Pre-op bed availability in Pavilion A is currently at 92% capacity with zero unassigned emergency admissions.'
        };

      case 'PATIENT_READY':
        return {
          id: 'PATIENT_READY',
          docId: 'REP-PAT-2026-08',
          title: 'Active Clinical Census & Patient Surgical Readiness Report',
          subtitle: 'Clinical gate verification, consent tracking, and lab clearances',
          abstract: 'Comprehensive clinical clearance verification, EMR consent tracking, lab results delivery, and surgical readiness scores.',
          kpis: [
            { label: 'ACTIVE CLINICAL CENSUS', value: '48 patients', target: 'Current active inpatients', status: 'normal' },
            { label: 'SURGICAL READINESS RATE', value: '87.5%', target: '42 Cleared patients', status: 'optimal' },
            { label: 'PENDING LAB CLEARANCE', value: '4 cases', target: 'Under active lab review', status: 'warning' },
            { label: 'CONSENT FORM PENDING', value: '2 cases', target: 'Action required in EMR', status: 'danger' }
          ],
          tableTitle: 'Patient Clinical Status & Clearance Audit Table',
          tableSubtitle: 'Gate verification metrics covering consent forms, anesthesiology sign-off, and lab clearances',
          columns: [
            { key: 'patient', label: 'PATIENT', width: '18%', align: 'left', isStrong: true },
            { key: 'mrn', label: 'MRN', width: '11%', align: 'left', isMono: true },
            { key: 'demographics', label: 'AGE / GENDER', width: '11%', align: 'left' },
            { key: 'department', label: 'DEPARTMENT', width: '16%', align: 'left' },
            { key: 'consultant', label: 'CONSULTANT', width: '15%', align: 'left' },
            { key: 'status', label: 'STATUS', width: '13%', align: 'center', isBadge: true },
            { key: 'registered', label: 'REGISTERED', width: '16%', align: 'right', isMono: true }
          ],
          rows: [
            { patient: 'Elena Rostova', mrn: 'MRN-1048', demographics: '58y / Female', department: 'General Surgery', consultant: 'Dr. K. Patel', status: 'Cleared', statusType: 'optimal', registered: 'Today, 08:15 AM' },
            { patient: 'Viktor Vance', mrn: 'MRN-1052', demographics: '44y / Male', department: 'Orthopedics', consultant: 'Dr. A. Miller', status: 'Cleared', statusType: 'optimal', registered: 'Today, 08:40 AM' },
            { patient: 'Sarah Jenkins', mrn: 'MRN-1059', demographics: '62y / Female', department: 'Cardiology', consultant: 'Dr. S. Chen', status: 'In Prep', statusType: 'warning', registered: 'Today, 09:10 AM' },
            { patient: 'Marcus Aurel', mrn: 'MRN-1064', demographics: '39y / Male', department: 'Neurology', consultant: 'Dr. R. Taylor', status: 'Consent Lag', statusType: 'danger', registered: 'Today, 09:55 AM' },
            { patient: 'Diane Wu', mrn: 'MRN-1070', demographics: '51y / Female', department: 'Oncology', consultant: 'Dr. M. Vance', status: 'Cleared', statusType: 'optimal', registered: 'Today, 10:20 AM' }
          ],
          insights: '87.5% of scheduled surgical patients have received 100% pre-flight clearance. Marcus Aurel (MRN-1064) requires urgent digital consent sign-off prior to OT-03 transfer.'
        };

      case 'CSSD_STERIL':
        return {
          id: 'CSSD_STERIL',
          docId: 'REP-CSD-2026-08',
          title: 'CSSD Sterilization Quality, Tray Traceability & Expiry Log',
          subtitle: 'Autoclave cycle validation, pack location audit, and shelf-life tracking',
          abstract: 'Steam autoclave biological spore clearance, pack RFID location audit, and shelf-life tracking for 156 active trays.',
          kpis: [
            { label: 'TOTAL ACTIVE PACKS', value: '156 trays', target: 'Trays in active rotation', status: 'normal' },
            { label: 'STERILITY PASS RATE', value: '100%', target: '0 CFU Spore test pass', status: 'optimal' },
            { label: 'EXPIRED / QUARANTINED', value: '2 trays', target: '1.2% requiring re-cycle', status: 'danger' },
            { label: 'OT DISPATCH SPEED', value: '8.4 min', target: 'Average transport time', status: 'optimal' }
          ],
          tableTitle: 'Sterile Instrument Pack Inventory & Expiry Log',
          tableSubtitle: 'Complete traceability and sterility status for surgical instrument sets across autoclave bays and OTs',
          columns: [
            { key: 'packId', label: 'PACK ID', width: '13%', align: 'left', isMono: true },
            { key: 'type', label: 'INSTRUMENT TYPE', width: '24%', align: 'left', isStrong: true },
            { key: 'sterilized', label: 'STERILIZED', width: '14%', align: 'left', isMono: true },
            { key: 'expiry', label: 'EXPIRY', width: '12%', align: 'left' },
            { key: 'location', label: 'LOCATION', width: '15%', align: 'left' },
            { key: 'assignedOt', label: 'ASSIGNED OT', width: '10%', align: 'center', isMono: true },
            { key: 'status', label: 'STATUS', width: '12%', align: 'center', isBadge: true }
          ],
          rows: [
            { packId: 'CSSD-40001', type: 'Laparoscopic Cholecystectomy Kit', sterilized: 'Today, 06:00 AM', expiry: 'In 72h', location: 'CSSD Vault B', assignedOt: 'OT-01', status: 'Ready', statusType: 'optimal' },
            { packId: 'CSSD-40002', type: 'Total Hip Arthroplasty Set', sterilized: 'Today, 07:30 AM', expiry: 'In 70h', location: 'OT-01 Holding Core', assignedOt: 'OT-01', status: 'Ready', statusType: 'optimal' },
            { packId: 'CSSD-40010', type: 'Arthroscopy Power Tool Pack', sterilized: 'Today, 09:15 AM', expiry: 'In 68h', location: 'Autoclave #01', assignedOt: 'OT-03', status: 'Sterilizing', statusType: 'info' },
            { packId: 'CSSD-EXP-09', type: 'General Laparotomy Pack #02', sterilized: '01 Aug, 04:00 PM', expiry: 'Expired', location: 'Vault B Quarantine', assignedOt: 'Unassigned', status: 'Quarantined', statusType: 'danger' }
          ],
          insights: '100% biological spore indicator compliance verified across Autoclaves #01 and #02. Pack CSSD-EXP-09 was automatically quarantined following shelf-life expiration.'
        };

      case 'WORKFLOW_DELAY':
        return {
          id: 'WORKFLOW_DELAY',
          docId: 'REP-DEL-2026-08',
          title: 'Cross-Department Workflow Incident & Delay Root-Cause Audit',
          subtitle: 'Correlation analysis of friction events, bottlenecks, and hours lost',
          abstract: 'Correlation analysis of cumulative hours lost across Admissions, OT suites, and CSSD autoclaves.',
          kpis: [
            { label: 'TOTAL DELAY EVENTS', value: '38 events', target: 'Reported exception logs', status: 'warning' },
            { label: 'CUMULATIVE LOST TIME', value: '111.7 hrs', target: 'Hospital-wide cumulative', status: 'danger' },
            { label: 'PRIMARY BOTTLENECK', value: 'CSSD Cooldown', target: '38% of total lag time', status: 'danger' },
            { label: 'TIME RECOVERED VIA AI', value: '24.5 hrs', target: 'Smart rerouting savings', status: 'optimal' }
          ],
          tableTitle: 'Operational Incidents & Alert Audit Log',
          tableSubtitle: 'Categorized root-cause breakdown of delay incidents and assigned response teams',
          columns: [
            { key: 'severity', label: 'SEVERITY', width: '12%', align: 'center', isSeverityPill: true },
            { key: 'alert', label: 'ALERT / INCIDENT', width: '26%', align: 'left', isStrong: true },
            { key: 'department', label: 'DEPARTMENT', width: '14%', align: 'left' },
            { key: 'entity', label: 'RELATED ENTITY', width: '14%', align: 'left', isMono: true },
            { key: 'detected', label: 'DETECTED', width: '11%', align: 'left', isMono: true },
            { key: 'status', label: 'STATUS', width: '11%', align: 'center', isBadge: true },
            { key: 'team', label: 'ASSIGNED TEAM', width: '12%', align: 'left' }
          ],
          rows: [
            { severity: 'Critical', alert: 'CSSD Autoclave Cooldown Lag', department: 'CSSD', entity: 'CSSD-40010', detected: '10:15 AM', status: 'Active', statusType: 'danger', team: 'CSSD Ops' },
            { severity: 'Warning', alert: 'Ward Porter Transfer Queuing', department: 'Admissions', entity: 'MRN-1059', detected: '09:40 AM', status: 'Resolved', statusType: 'optimal', team: 'Transport' },
            { severity: 'Warning', alert: 'Digital Consent Pending in EMR', department: 'Admissions', entity: 'MRN-1064', detected: '09:15 AM', status: 'Active', statusType: 'warning', team: 'Nursing' },
            { severity: 'Information', alert: 'OT Sanitation Canister Protocol', department: 'OT', entity: 'OT-04', detected: '08:50 AM', status: 'Resolved', statusType: 'optimal', team: 'Sanitation' }
          ],
          insights: 'Autoclave tray cooldown lag accounts for 38% of total surgical suite idle time. Implementing forced ventilation protocol in CSSD Vault B is estimated to recover 14.2 hours weekly.'
        };

      case 'DEPT_PERF':
      default:
        return {
          id: 'DEPT_PERF',
          docId: 'REP-DPT-2026-08',
          title: 'Hospital Department Scorecard & Executive Performance Audit',
          subtitle: 'Cross-functional benchmark scorecard across hospital departments',
          abstract: 'Cross-functional scorecard comparing Admissions, Surgical Suites, CSSD, Nursing, and Billing benchmark KPIs.',
          kpis: [
            { label: 'OVERALL HOSPITAL SCORE', value: '92.4 / 100', target: 'Target: > 90.0 Score', status: 'optimal' },
            { label: 'ON-TIME SURGICAL STARTS', value: '88.5%', target: '+4.2% vs last week', status: 'optimal' },
            { label: 'HANDOFF FRICTION INDEX', value: '3.8 min', target: 'Target: < 5.0 min', status: 'optimal' },
            { label: 'STAFFING EFFICIENCY', value: '96.1%', target: 'Optimal workforce ratio', status: 'optimal' }
          ],
          tableTitle: 'Department Operational Scorecard',
          tableSubtitle: 'Operational throughput, efficiency ratings, and SLA compliance metrics per department',
          columns: [
            { key: 'dept', label: 'DEPARTMENT', width: '22%', align: 'left', isStrong: true },
            { key: 'lead', label: 'DEPARTMENT LEAD', width: '18%', align: 'left' },
            { key: 'volume', label: 'CASES / VOLUME', width: '16%', align: 'right', isMono: true },
            { key: 'efficiency', label: 'EFFICIENCY SCORE', width: '16%', align: 'right' },
            { key: 'sla', label: 'SLA COMPLIANCE', width: '14%', align: 'right' },
            { key: 'status', label: 'STATUS', width: '14%', align: 'center', isBadge: true }
          ],
          rows: [
            { dept: 'Operating Theatres', lead: 'Dr. K. Patel', volume: '14 cases', efficiency: '91.2%', sla: '94.0%', status: 'Optimal', statusType: 'optimal' },
            { dept: 'Admissions & Intake', lead: 'M. Vance', volume: '16 intake', efficiency: '94.5%', sla: '98.2%', status: 'Optimal', statusType: 'optimal' },
            { dept: 'CSSD Sterilization', lead: 'S. Rao', volume: '156 packs', efficiency: '96.8%', sla: '99.1%', status: 'Optimal', statusType: 'optimal' },
            { dept: 'Nursing & Recovery', lead: 'J. Doe', volume: '48 beds', efficiency: '88.0%', sla: '91.5%', status: 'Under Benchmark', statusType: 'warning' },
            { dept: 'Billing & Accounts', lead: 'R. Sharma', volume: '₹12.4L', efficiency: '92.0%', sla: '95.0%', status: 'Optimal', statusType: 'optimal' }
          ],
          insights: 'Overall hospital performance index is 92.4, demonstrating strong cross-departmental coordination. CSSD leads SLA compliance at 99.1%, while Nursing Recovery is targeted for process enhancement.'
        };
    }
  };

  const currentReport = getReportData();

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setLastGeneratedTime('Just now');
    }, 400);
  };

  const handleExportCSV = () => {
    const csvHeader = "Report ID,Title,Category,Generated At\n" + `${currentReport.docId},"${currentReport.title}",${selectedCategory},${new Date().toISOString()}\n\n`;
    const cols = currentReport.columns.map(c => `"${c.label}"`).join(",");
    const rows = currentReport.rows.map(r => 
      currentReport.columns.map(c => `"${r[c.key] || ''}"`).join(",")
    ).join("\n");
    
    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(csvHeader + cols + "\n" + rows);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", `${currentReport.docId}_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="synchro-reports-container font-sans">
      {/* ── Page Top Header & Info ───────────────────────────── */}
      <div className="reports-top-bar">
        <div className="reports-top-titles">
          <div className="reports-title-badge-row">
            <h1 className="reports-page-main-title font-display">Hospital Operations Reports & Intelligence</h1>
            <Badge variant="teal" size="md">EMR & AUDIT VERIFIED</Badge>
          </div>
          <p className="reports-page-main-sub font-sans">
            Standardized operational intelligence reports across Operating Theatres, Admissions, CSSD Sterilization, Patient Flow, and Executive Management.
          </p>
        </div>

        <div className="reports-top-actions">
          <Button size="sm" variant="secondary" icon={Printer} onClick={handleExportPDF}>
            Print Executive Summary
          </Button>
          <Button size="sm" variant="primary" icon={Download} onClick={handleExportPDF}>
            Export Package (PDF)
          </Button>
        </div>
      </div>

      {/* ── 6 Core Report Selection Cards ───────────────────── */}
      <div className="report-selector-grid">
        {reportCards.map((rc) => {
          const Icon = rc.icon;
          const isSelected = selectedCategory === rc.id;
          return (
            <div 
              key={rc.id}
              className={`report-selector-card ${isSelected ? 'is-selected' : ''}`}
              onClick={() => setSelectedCategory(rc.id)}
            >
              <div className="selector-card-top">
                <div className={`selector-icon-box pillar-${rc.pillar}`}>
                  <Icon size={18} />
                </div>
                <Badge variant={rc.pillar} size="xs">{rc.badgeText}</Badge>
              </div>

              <div className="selector-card-body">
                <h3 className="selector-card-title font-display">{rc.name}</h3>
                <span className="selector-card-dept font-sans">{rc.dept}</span>
                <p className="selector-card-desc font-sans">{rc.desc}</p>
              </div>

              <div className="selector-card-footer">
                <span className="selector-view-btn font-sans">
                  {isSelected ? 'Currently Viewing' : 'Select Report'}
                </span>
                <ChevronRight size={14} className={isSelected ? 'text-teal' : 'text-muted'} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filter Controls Bar ─────────────────────────────── */}
      <div className="reports-filter-bar font-sans">
        <div className="filter-group">
          <label className="filter-label"><Calendar size={13} /> DATE SCOPE</label>
          <select className="filter-select font-sans" value={dateRange} onChange={e => setDateRange(e.target.value)}>
            <option>Today (Live Data)</option>
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Current Quarter</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label"><Building2 size={13} /> DEPARTMENT</label>
          <select className="filter-select font-sans" value={department} onChange={e => setDepartment(e.target.value)}>
            <option>All Departments</option>
            <option>Operating Theatres</option>
            <option>Admissions & Intake</option>
            <option>CSSD Sterilization</option>
            <option>Nursing & Recovery</option>
            <option>Billing & Finance</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label"><Stethoscope size={13} /> SURGICAL SUITE</label>
          <select className="filter-select font-sans" value={theatre} onChange={e => setTheatre(e.target.value)}>
            <option>All Suites (OT-01 to OT-12)</option>
            <option>OT-01 (Orthopedics)</option>
            <option>OT-02 (General Surgery)</option>
            <option>OT-03 (Trauma & Sports)</option>
            <option>OT-04 (Cardiovascular)</option>
          </select>
        </div>

        <div className="filter-action-btn">
          <Button 
            variant="primary" 
            size="md" 
            icon={RefreshCw} 
            loading={isGenerating}
            onClick={handleGenerateReport}
          >
            Update Report Data
          </Button>
        </div>
      </div>

      {/* ── MAIN REPORT DOCUMENT CONTAINER ───────────────────── */}
      <div className="report-main-document-card">
        {/* 1. REPORT HEADER LAYOUT (LEFT: Badge, Title, Desc | RIGHT: Export Buttons) */}
        <div className="report-doc-header">
          <div className="doc-header-left">
            <div className="doc-id-pill-row">
              <span className="doc-id-badge font-mono">{currentReport.docId}</span>
              <span className="doc-generated-tag font-sans">Verified Audit Log • {lastGeneratedTime}</span>
            </div>
            <h2 className="doc-report-title font-display">{currentReport.title}</h2>
            <p className="doc-report-desc font-sans">{currentReport.abstract}</p>
          </div>

          <div className="doc-header-right-actions">
            <Button size="md" variant="secondary" icon={FileSpreadsheet} onClick={handleExportCSV}>
              Export CSV
            </Button>
            <Button size="md" variant="primary" icon={Download} onClick={handleExportPDF}>
              Export PDF
            </Button>
          </div>
        </div>

        {/* 2. KEY METRICS — 4 EQUAL-WIDTH KPI CARDS GRID */}
        <div className="report-kpi-grid">
          {currentReport.kpis.map((kpi, idx) => (
            <div key={idx} className={`report-kpi-card status-${kpi.status}`}>
              <span className="report-kpi-label font-sans">{kpi.label}</span>
              <div className="report-kpi-val-row">
                <span className="report-kpi-value font-display">{kpi.value}</span>
              </div>
              <span className="report-kpi-target font-sans">{kpi.target}</span>
            </div>
          ))}
        </div>

        {/* 3. REPORT TABLE CARD CONTAINER */}
        <div className="report-table-card">
          <div className="report-table-card-header">
            <div>
              <h3 className="table-card-title font-display">{currentReport.tableTitle}</h3>
              <p className="table-card-subtitle font-sans">{currentReport.tableSubtitle}</p>
            </div>
            <div className="table-record-count font-mono">
              {currentReport.rows.length} RECORDS DISPLAYED
            </div>
          </div>

          {/* Structured Table Container */}
          <div className="report-table-wrapper">
            <table className="report-structured-table">
              <thead>
                <tr>
                  {currentReport.columns.map((col) => (
                    <th 
                      key={col.key} 
                      style={{ width: col.width, textAlign: col.align || 'left' }}
                      className="font-sans"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentReport.rows.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {currentReport.columns.map((col) => {
                      const val = row[col.key];

                      // Status Badge Cell
                      if (col.isBadge) {
                        return (
                          <td key={col.key} style={{ textAlign: col.align || 'center' }}>
                            <span className={`report-status-pill status-${row.statusType || 'optimal'}`}>
                              <span className="pill-dot" />
                              <span className="font-sans font-semibold">{val}</span>
                            </span>
                          </td>
                        );
                      }

                      // Type Pill (Admission Type)
                      if (col.isTypePill) {
                        return (
                          <td key={col.key} style={{ textAlign: col.align || 'center' }}>
                            <span className={`report-type-pill type-${val?.toLowerCase()}`}>
                              {val}
                            </span>
                          </td>
                        );
                      }

                      // Severity Pill
                      if (col.isSeverityPill) {
                        const sevType = val === 'Critical' ? 'danger' : val === 'Warning' ? 'warning' : 'info';
                        return (
                          <td key={col.key} style={{ textAlign: col.align || 'center' }}>
                            <span className={`report-status-pill status-${sevType}`}>
                              <span className="pill-dot" />
                              <span className="font-sans font-semibold">{val}</span>
                            </span>
                          </td>
                        );
                      }

                      // Font styling: Monospace ONLY for technical IDs (MRNs, Pack IDs, Timestamps)
                      const cellClass = [
                        'font-sans',
                        col.isMono ? 'font-mono text-technical' : '',
                        col.isStrong ? 'font-bold text-navy-dark' : '',
                      ].filter(Boolean).join(' ');

                      return (
                        <td key={col.key} style={{ textAlign: col.align || 'left' }} className={cellClass}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. REPORT INSIGHTS & EXECUTIVE SUMMARY */}
        <div className="report-insights-box font-sans">
          <div className="insights-header-row">
            <Sparkles size={18} className="text-cyan" />
            <h4 className="insights-heading font-display">Executive Operational Insights</h4>
          </div>
          <p className="insights-text font-sans">
            {currentReport.insights}
          </p>
        </div>

        {/* 5. FOOTER COMPLIANCE BAR */}
        <div className="report-footer-bar font-sans">
          <div className="footer-left-info">
            <ShieldCheck size={16} className="text-teal" />
            <span>SYNCHRO Healthcare SaaS • EMR Compliance ID: <strong>SYN-AUDIT-2026-88X</strong></span>
          </div>
          <div className="footer-right-actions">
            <Button size="sm" variant="secondary" icon={Printer} onClick={handleExportPDF}>
              Print Report
            </Button>
            <Button size="sm" variant="primary" icon={Download} onClick={handleExportPDF}>
              Export Official PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
