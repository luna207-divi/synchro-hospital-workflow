import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Building2, 
  Filter, 
  Play, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Activity, 
  UserCheck, 
  PackageCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Printer
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './ReportsPage.css';

export const ReportsPage = () => {
  // Active report category selection
  const [selectedCategory, setSelectedCategory] = useState('OT_UTIL');

  // Generator parameters
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [department, setDepartment] = useState('All Departments');
  const [theatre, setTheatre] = useState('All Operating Theatres');
  const [procedureType, setProcedureType] = useState('All Procedures');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedTime, setLastGeneratedTime] = useState('Today, 10:45 AM');

  // 5 Report Categories
  const categories = [
    {
      id: 'OT_UTIL',
      name: 'OT Utilization Report',
      dept: 'Operating Theatres',
      pillar: 'indigo',
      icon: Activity,
      desc: 'Suite utilization rates, elective block usage, overtime minutes, and turnover times.'
    },
    {
      id: 'WORKFLOW_DELAY',
      name: 'Workflow Delay Report',
      dept: 'Intelligence',
      pillar: 'purple',
      icon: Clock,
      desc: 'Root-cause delay categorization, cross-department handoff lags, and lost surgical hours.'
    },
    {
      id: 'CSSD_STERIL',
      name: 'CSSD Sterilization Report',
      dept: 'CSSD',
      pillar: 'teal',
      icon: PackageCheck,
      desc: 'Autoclave cycle compliance, biological spore clearance, pack shelf-life, and tray utilization.'
    },
    {
      id: 'PATIENT_READY',
      name: 'Patient Readiness Report',
      dept: 'Admissions',
      pillar: 'blue',
      icon: UserCheck,
      desc: 'Pre-op clearance punctuality, consent form compliance, lab report delivery, and transfer times.'
    },
    {
      id: 'DEPT_PERF',
      name: 'Department Performance Report',
      dept: 'Executive / Triad',
      pillar: 'teal',
      icon: Building2,
      desc: 'Cross-functional scorecard comparing Admissions, OT, and CSSD benchmark KPIs.'
    }
  ];

  // Preview content based on selected category
  const getPreviewData = () => {
    if (selectedCategory === 'OT_UTIL') {
      return {
        title: 'Operating Theatre Utilization & Block Punctuality Report',
        docId: 'REP-OTU-2026-08',
        abstract: 'Comprehensive utilization analysis across 4 operational surgical suites covering 93 scheduled cases.',
        kpis: [
          { label: 'Hospital OT Utilization', value: '84.3%', status: 'optimal' },
          { label: 'Total Surgical Cases', value: '93 cases', status: 'normal' },
          { label: 'Average Turnover', value: '21.4 mins', status: 'optimal' },
          { label: 'Delayed Procedures', value: '4 cases (4.3%)', status: 'warning' }
        ],
        tableHeaders: ['THEATRE', 'SPECIALTY', 'CASES', 'UTILIZATION', 'AVG DURATION', 'STATUS'],
        tableRows: [
          ['OT-01', 'Orthopedics & Joint', '28', '89.2%', '1h 48m', 'Optimal'],
          ['OT-02', 'General & Laparoscopic', '24', '81.4%', '1h 15m', 'Optimal'],
          ['OT-03', 'Sports Med & Trauma', '19', '74.6%', '1h 52m', 'Under Benchmark'],
          ['OT-04', 'Cardiovascular & Thoracic', '22', '92.0%', '3h 10m', 'High Volume']
        ]
      };
    }

    if (selectedCategory === 'WORKFLOW_DELAY') {
      return {
        title: 'Cross-Department Workflow Delay & Friction Root-Cause Audit',
        docId: 'REP-DEL-2026-08',
        abstract: 'Correlation analysis of 111.7 cumulative hours lost across Admissions, OT suites, and CSSD autoclaves.',
        kpis: [
          { label: 'Total Delay Instances', value: '38 events', status: 'warning' },
          { label: 'Cumulative Lost Time', value: '111.7 hrs', status: 'danger' },
          { label: 'Primary Driver', value: 'CSSD Tray Availability (38%)', status: 'danger' },
          { label: 'Time Recovered via AI', value: '24.5 hrs', status: 'optimal' }
        ],
        tableHeaders: ['FRICTION SOURCE', 'DEPARTMENT', 'INSTANCES', 'TOTAL LOST', 'AVG DELAY', 'IMPACT'],
        tableRows: [
          ['CSSD Autoclave Cooldown Lag', 'CSSD', '14', '42.5 hrs', '18.2m', 'Critical'],
          ['Ward Porter Transfer Queuing', 'Admissions', '11', '26.8 hrs', '14.1m', 'High'],
          ['Digital Consent Pending in EMR', 'Admissions', '8', '20.1 hrs', '12.0m', 'Medium'],
          ['OT Sanitation Canister Protocol', 'OT', '5', '15.6 hrs', '9.4m', 'Low']
        ]
      };
    }

    if (selectedCategory === 'CSSD_STERIL') {
      return {
        title: 'CSSD Sterilization Quality, Tray Traceability & Expiry Log',
        docId: 'REP-CSD-2026-08',
        abstract: 'Steam autoclave biological spore clearance, pack RFID location audit, and shelf-life tracking for 142 active trays.',
        kpis: [
          { label: 'Total Active Packs', value: '142 trays', status: 'normal' },
          { label: 'Sterility Pass Rate', value: '100% (0 CFU)', status: 'optimal' },
          { label: 'Expired Quarantined', value: '1 tray (0.4%)', status: 'warning' },
          { label: 'OT Dispatch Speed', value: '8.4 mins avg', status: 'optimal' }
        ],
        tableHeaders: ['TRAY ID', 'SET TYPE', 'STERILIZED', 'EXPIRY', 'LOCATION', 'STATUS'],
        tableRows: [
          ['CSSD-00125', 'TKR Instrument Set #01', '10 Aug', '15 Aug', 'Storage A', 'Sterile / Assigned OT-02'],
          ['CSSD-00142', 'Orthopedic Power Tool #04', '10 Aug', '15 Aug', 'Autoclave #02', 'In Sterilization'],
          ['CSSD-00118', 'Total Hip Arthroplasty #01', '10 Aug', '14 Aug', 'OT-01 Holding Core', 'In Room / Sterile'],
          ['CSSD-EXP-09', 'General Laparotomy #02', '03 Aug', '08 Aug', 'Storage B', 'BLOCKED (Expired)']
        ]
      };
    }

    if (selectedCategory === 'PATIENT_READY') {
      return {
        title: 'Admissions Pre-Operative Readiness & Checklist Compliance',
        docId: 'REP-ADM-2026-08',
        abstract: 'Auditing 6-point pre-op readiness milestones, consent verification, and patient transfer punctuality.',
        kpis: [
          { label: 'Scheduled Patients', value: '42 cases', status: 'normal' },
          { label: 'Average Readiness Score', value: '94.2%', status: 'optimal' },
          { label: 'Pre-Op On-Time Rate', value: '91.8%', status: 'optimal' },
          { label: 'Consent Missing at Check-in', value: '2 cases', status: 'warning' }
        ],
        tableHeaders: ['PATIENT ID', 'PROCEDURE', 'OT', 'ADMISSION', 'CONSENT', 'READINESS'],
        tableRows: [
          ['P-1024 (E. Rostova)', 'Total Knee Replacement', 'OT-02', 'Complete', 'Complete', '85% (Transfer Pending)'],
          ['P-1025 (R. Vance)', 'Total Hip Arthroplasty', 'OT-01', 'Complete', 'Complete', '100% (OT Ready)'],
          ['P-1026 (M. Chen)', 'ACL Reconstruction', 'OT-03', 'Complete', 'Complete', '90% (In Pre-Op)'],
          ['P-1027 (A. Miller)', 'Laparoscopic Cholecystectomy', 'OT-04', 'Pending EMR', 'Missing', '40% (Awaiting Docs)']
        ]
      };
    }

    return {
      title: 'Triad Department Performance & Cross-Functional Health Report',
      docId: 'REP-TRI-2026-08',
      abstract: 'Holistic performance scorecard connecting Admissions intake, Operating Theatre throughput, and CSSD sterile supply.',
      kpis: [
        { label: 'Triad Synchronization Index', value: '92.4 / 100', status: 'optimal' },
        { label: 'Cross-Department Latency', value: '7.2 mins avg', status: 'optimal' },
        { label: 'Surgery Schedule Adherence', value: '88.9%', status: 'optimal' },
        { label: 'Critical Exception Frequency', value: '0.8 / day', status: 'optimal' }
      ],
      tableHeaders: ['DEPARTMENT', 'PRIMARY METRIC', 'TARGET', 'ACTUAL', 'TREND', 'HEALTH'],
      tableRows: [
        ['Admissions & Pre-Op', 'Check-in to Ready Time', '45.0m', '42.0m', '-3.0m', 'Optimal'],
        ['Operating Theatres', 'OT Utilization Rate', '80.0%', '84.3%', '+4.3%', 'Optimal'],
        ['Operating Theatres', 'Average Room Turnover', '25.0m', '21.4m', '-3.6m', 'Optimal'],
        ['CSSD Sterilization', 'Sterile Pack Availability', '92.0%', '94.1%', '+2.1%', 'Optimal']
      ]
    };
  };

  const preview = getPreviewData();

  // Recent Reports Table Data matching prompt
  const recentReports = [
    {
      id: 'REC-01',
      name: 'Weekly_OT_Utilization_Summary_W32.pdf',
      category: 'OT Utilization Report',
      generatedDate: '10 Aug 2026, 08:30 AM',
      generatedBy: 'Dr. R. Sharma (OT Flow Lead)',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 'REC-02',
      name: 'Q3_CSSD_Sterilization_Spore_Audit.csv',
      category: 'CSSD Sterilization Report',
      generatedDate: '09 Aug 2026, 04:15 PM',
      generatedBy: 'M. Vance (CSSD Quality Officer)',
      format: 'CSV',
      size: '840 KB'
    },
    {
      id: 'REC-03',
      name: 'Surgical_Workflow_Delay_Root_Cause.pdf',
      category: 'Workflow Delay Report',
      generatedDate: '08 Aug 2026, 06:00 PM',
      generatedBy: 'Admin Console (Automated ML)',
      format: 'PDF',
      size: '3.1 MB'
    },
    {
      id: 'REC-04',
      name: 'Patient_PreOp_Readiness_Compliance.csv',
      category: 'Patient Readiness Report',
      generatedDate: '07 Aug 2026, 11:20 AM',
      generatedBy: 'Nurse Sup. H. Jenkins',
      format: 'CSV',
      size: '512 KB'
    },
    {
      id: 'REC-05',
      name: 'Monthly_Hospital_Triad_Executive_Scorecard.pdf',
      category: 'Department Performance Report',
      generatedDate: '01 Aug 2026, 09:00 AM',
      generatedBy: 'Dr. R. Sharma (OT Flow Lead)',
      format: 'PDF',
      size: '4.8 MB'
    }
  ];

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setLastGeneratedTime('Just now');
      alert(`Generated "${categories.find(c => c.id === selectedCategory)?.name}" with parameters: ${dateRange}, ${department}, ${theatre}.`);
    }, 600);
  };

  const handleExport = (format) => {
    alert(`Exporting "${preview.title}" as ${format.toUpperCase()} file.`);
  };

  return (
    <div className="ot-reports-page">
      {/* 1. Page Header */}
      <div className="reports-page-header">
        <div className="reports-title-group">
          <div className="reports-title-row">
            <h1 className="reports-heading font-display">Reports</h1>
            <Badge variant="teal" size="sm" dot>Standardized Clinical Reporting</Badge>
          </div>
          <p className="reports-subtitle">
            Generate, preview, and export validated operational and clinical workflow reports.
          </p>
        </div>

        <div className="reports-header-actions">
          <Button size="sm" variant="secondary" icon={Printer} onClick={() => window.print()}>
            Print Document
          </Button>
          <Button size="sm" variant="secondary" icon={FileSpreadsheet} onClick={() => handleExport('csv')}>
            Export CSV
          </Button>
          <Button size="sm" variant="primary" icon={Download} onClick={() => handleExport('pdf')}>
            Export PDF
          </Button>
        </div>
      </div>

      {/* 2. Report Categories Selector Grid (5 Categories) */}
      <div className="report-categories-grid">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              className={`report-cat-card ot-card border-pillar-${cat.pillar} ${isSelected ? 'cat-selected' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="cat-card-top">
                <div className={`cat-icon-pill pill-${cat.pillar}`}>
                  <Icon size={16} />
                </div>
                <Badge variant={cat.pillar} size="xs">{cat.dept}</Badge>
              </div>

              <h3 className="cat-name font-display">{cat.name}</h3>
              <p className="cat-desc">{cat.desc}</p>

              <div className="cat-card-footer font-mono">
                <span className={`cat-status ${isSelected ? 'text-primary font-bold' : 'text-muted'}`}>
                  {isSelected ? '● Active Selection' : 'Click to configure'}
                </span>
                <ChevronRight size={14} className={isSelected ? 'text-primary' : 'text-muted'} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Split View: Generator Parameters (Left) + Live Document Preview Card (Right) */}
      <div className="reports-generator-layout">
        {/* Left: Generator Form */}
        <div className="reports-generator-card ot-card">
          <div className="gen-card-header">
            <div className="gen-header-title-row">
              <Filter size={16} className="text-primary" />
              <h3 className="gen-title font-display">Report Parameters</h3>
            </div>
            <span className="gen-sub font-mono">CUSTOMIZE SCOPE</span>
          </div>

          <div className="gen-form-body">
            {/* Date Range */}
            <div className="form-group">
              <label className="form-label font-mono">DATE RANGE</label>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="form-select font-mono"
              >
                <option value="Today">Today (Live)</option>
                <option value="Last 7 Days">Last 7 Days (Standard)</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Month to Date">Month to Date (Q3 2026)</option>
                <option value="Year to Date">Year to Date (2026)</option>
              </select>
            </div>

            {/* Department */}
            <div className="form-group">
              <label className="form-label font-mono">DEPARTMENT</label>
              <select 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select font-mono"
              >
                <option value="All Departments">All Departments (Triad)</option>
                <option value="Admissions">Admissions & Patient Intake</option>
                <option value="Operating Theatres">Operating Theatres (OT)</option>
                <option value="CSSD">CSSD Sterilization Department</option>
              </select>
            </div>

            {/* Operating Theatre */}
            <div className="form-group">
              <label className="form-label font-mono">OPERATING THEATRE</label>
              <select 
                value={theatre} 
                onChange={(e) => setTheatre(e.target.value)}
                className="form-select font-mono"
              >
                <option value="All Operating Theatres">All Operating Theatres (4 Suites)</option>
                <option value="OT-01">OT-01 (Orthopedics)</option>
                <option value="OT-02">OT-02 (General & Lap)</option>
                <option value="OT-03">OT-03 (Sports Medicine)</option>
                <option value="OT-04">OT-04 (Cardiovascular)</option>
              </select>
            </div>

            {/* Procedure Type */}
            <div className="form-group">
              <label className="form-label font-mono">PROCEDURE TYPE</label>
              <select 
                value={procedureType} 
                onChange={(e) => setProcedureType(e.target.value)}
                className="form-select font-mono"
              >
                <option value="All Procedures">All Surgical Procedures</option>
                <option value="Orthopedic">Orthopedic Joint Replacements</option>
                <option value="General">General & Laparoscopic</option>
                <option value="Sports">Sports Medicine & Arthroscopy</option>
                <option value="Cardiovascular">Cardiovascular & Thoracic</option>
              </select>
            </div>

            {/* Generate Action Button */}
            <div className="gen-action-row">
              <Button
                variant="primary"
                size="md"
                icon={Play}
                onClick={handleGenerateReport}
                disabled={isGenerating}
                style={{ width: '100%' }}
              >
                {isGenerating ? 'Generating Telemetry...' : 'Generate Report'}
              </Button>
            </div>

            <div className="gen-export-button-group">
              <Button
                variant="secondary"
                size="sm"
                icon={Download}
                onClick={() => handleExport('pdf')}
                style={{ flex: 1 }}
              >
                Export PDF
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={FileSpreadsheet}
                onClick={() => handleExport('csv')}
                style={{ flex: 1 }}
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Live Report Preview Card */}
        <div className="report-preview-card ot-card">
          <div className="preview-card-header">
            <div className="preview-header-left">
              <div className="preview-badge-pill font-mono">LIVE PREVIEW</div>
              <span className="preview-doc-id font-mono">{preview.docId}</span>
            </div>
            <div className="preview-header-right font-mono">
              <span className="last-sync text-muted">Generated: {lastGeneratedTime}</span>
            </div>
          </div>

          <div className="preview-card-body">
            {/* Report Title & Metadata Banner */}
            <div className="preview-title-banner">
              <h2 className="preview-doc-title font-display">{preview.title}</h2>
              <p className="preview-abstract">{preview.abstract}</p>
              
              <div className="preview-tags-row font-mono">
                <span className="param-tag">Date: {dateRange}</span>
                <span className="param-tag">Dept: {department}</span>
                <span className="param-tag">OT: {theatre}</span>
                <span className="param-tag">Procedure: {procedureType}</span>
              </div>
            </div>

            {/* Summary KPIs Row */}
            <div className="preview-kpi-grid">
              {preview.kpis.map((kpi, i) => (
                <div key={i} className={`preview-kpi-box status-${kpi.status}`}>
                  <span className="preview-kpi-label font-mono">{kpi.label}</span>
                  <span className="preview-kpi-val font-display">{kpi.value}</span>
                </div>
              ))}
            </div>

            {/* Sample Table Snapshot */}
            <div className="preview-table-container font-mono">
              <table className="preview-data-table">
                <thead>
                  <tr>
                    {preview.tableHeaders.map((th, i) => (
                      <th key={i}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.tableRows.map((row, rIdx) => (
                    <tr key={rIdx}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx}>
                          {cell === 'Optimal' && <Badge variant="teal" size="xs">Optimal</Badge>}
                          {cell === 'Under Benchmark' && <Badge variant="amber" size="xs">Attention</Badge>}
                          {cell === 'High Volume' && <Badge variant="blue" size="xs">High</Badge>}
                          {cell === 'Critical' && <Badge variant="red" size="xs">Critical</Badge>}
                          {cell === 'High' && <Badge variant="amber" size="xs">High</Badge>}
                          {cell === 'Medium' && <Badge variant="blue" size="xs">Medium</Badge>}
                          {cell === 'Low' && <Badge variant="slate" size="xs">Low</Badge>}
                          {cell === 'BLOCKED (Expired)' && <Badge variant="red" size="xs">Blocked</Badge>}
                          {!['Optimal', 'Under Benchmark', 'High Volume', 'Critical', 'High', 'Medium', 'Low', 'BLOCKED (Expired)'].includes(cell) && cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Reports Section */}
      <div className="recent-reports-card ot-card">
        <div className="recent-reports-header">
          <div className="recent-header-left">
            <Clock size={16} className="text-muted" />
            <h3 className="recent-title font-display">Recent Reports</h3>
          </div>
          <span className="recent-meta font-mono">AUDIT ARCHIVE (5 GENERATED)</span>
        </div>

        <div className="table-responsive-wrapper font-mono">
          <table className="recent-reports-table">
            <thead>
              <tr>
                <th>REPORT NAME</th>
                <th>CATEGORY</th>
                <th style={{ width: '180px' }}>GENERATED DATE</th>
                <th style={{ width: '200px' }}>GENERATED BY</th>
                <th style={{ width: '100px' }}>FORMAT</th>
                <th style={{ width: '110px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((rep) => (
                <tr key={rep.id} className="recent-row">
                  <td>
                    <div className="report-name-cell">
                      <FileText size={14} className="text-primary flex-shrink-0" />
                      <span className="report-filename text-primary font-bold">{rep.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-secondary">{rep.category}</span>
                  </td>
                  <td>
                    <span className="text-muted">{rep.generatedDate}</span>
                  </td>
                  <td>
                    <span className="text-secondary">{rep.generatedBy}</span>
                  </td>
                  <td>
                    <Badge variant={rep.format === 'PDF' ? 'red' : 'teal'} size="xs">
                      {rep.format} ({rep.size})
                    </Badge>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      size="xs"
                      variant="secondary"
                      icon={Download}
                      onClick={() => alert(`Downloading archived file: ${rep.name}`)}
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
