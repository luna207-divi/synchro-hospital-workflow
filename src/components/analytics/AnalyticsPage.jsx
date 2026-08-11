import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Calendar, 
  Building2, 
  Filter, 
  Download, 
  RefreshCw, 
  RotateCcw, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  UserCheck, 
  PackageCheck, 
  Percent, 
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useDemo } from '../../context/DemoContext';
import { ActionableInsights } from './ActionableInsights';
import './AnalyticsPage.css';

export const AnalyticsPage = () => {
  const { demoState } = useDemo();
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [theatreFilter, setTheatreFilter] = useState('All Theatres');
  const [procedureFilter, setProcedureFilter] = useState('All Procedures');
  const [deptFilter, setDeptFilter] = useState('All Departments');

  // 1. OT Utilization Data
  const otUtilizationData = [
    { suite: 'OT-01', specialty: 'Orthopedics', utilization: 89.2, target: 80.0, cases: 28, status: 'Optimal' },
    { suite: 'OT-02', specialty: 'General & Lap', utilization: 81.4, target: 80.0, cases: 24, status: 'Optimal' },
    { suite: 'OT-03', specialty: 'Sports Medicine', utilization: 74.6, target: 80.0, cases: 19, status: 'Under Benchmark' },
    { suite: 'OT-04', specialty: 'Cardiovascular', utilization: 92.0, target: 80.0, cases: 22, status: 'High Utilization' }
  ];

  // 2. Delay Analysis Breakdown
  const delayCauses = [
    { name: 'CSSD Instrument Availability', percentage: 38, hoursLost: '42.5 hrs', pillar: 'teal', color: '#0d9488', count: 18 },
    { name: 'Patient Transfer & Transport', percentage: 24, hoursLost: '26.8 hrs', pillar: 'blue', color: '#2563eb', count: 12 },
    { name: 'Documentation & Consent', percentage: 18, hoursLost: '20.1 hrs', pillar: 'purple', color: '#7c3aed', count: 9 },
    { name: 'OT Sanitation & Turnover', percentage: 14, hoursLost: '15.6 hrs', pillar: 'amber', color: '#d97706', count: 7 },
    { name: 'Other Operational Variances', percentage: 6, hoursLost: '6.7 hrs', pillar: 'slate', color: '#64748b', count: 3 }
  ];

  // 3. Turnaround Time Over Time (7-Day Trend)
  const turnaroundTrend = [
    { day: 'Mon', minutes: 22, benchmark: 25 },
    { day: 'Tue', minutes: 24, benchmark: 25 },
    { day: 'Wed', minutes: 28, benchmark: 25, isHigh: true },
    { day: 'Thu', minutes: 21, benchmark: 25 },
    { day: 'Fri', minutes: 20, benchmark: 25 },
    { day: 'Sat', minutes: 19, benchmark: 25 },
    { day: 'Sun', minutes: 21, benchmark: 25 }
  ];

  // 4. Procedure Duration: Scheduled vs Actual
  const procedureDurations = [
    { procedure: 'Total Hip Arthroplasty', scheduled: 120, actual: 105, variance: -15, varianceType: 'faster' },
    { procedure: 'Total Knee Replacement (TKR)', scheduled: 110, actual: 125, variance: +15, varianceType: 'slower' },
    { procedure: 'ACL Reconstruction', scheduled: 90, actual: 112, variance: +22, varianceType: 'slower' },
    { procedure: 'Laparoscopic Cholecystectomy', scheduled: 75, actual: 78, variance: +3, varianceType: 'slower' },
    { procedure: 'Coronary Artery Bypass (CABG)', scheduled: 240, actual: 232, variance: -8, varianceType: 'faster' }
  ];

  // 5. Workflow Bottlenecks (Ranked Delay Causes)
  const rankedBottlenecks = [
    { rank: 1, name: 'CSSD Instrument Tray Cooldown Delay', dept: 'CSSD', pillar: 'teal', occurrences: 14, avgDelay: '18 mins', hoursLost: '4.2h/wk', impact: 'Critical' },
    { rank: 2, name: 'Afternoon Ward Porter Transfer Queuing', dept: 'Admissions', pillar: 'blue', occurrences: 11, avgDelay: '14 mins', hoursLost: '2.6h/wk', impact: 'High' },
    { rank: 3, name: 'Informed Consent Form Missing in EMR', dept: 'Admissions', pillar: 'blue', occurrences: 8, avgDelay: '12 mins', hoursLost: '1.6h/wk', impact: 'Medium' },
    { rank: 4, name: 'Sanitation Suction Canister Disposal', dept: 'Operating Theatres', pillar: 'indigo', occurrences: 6, avgDelay: '9 mins', hoursLost: '0.9h/wk', impact: 'Low' }
  ];

  // 6. Department Performance
  const departmentMetrics = [
    {
      name: 'Admissions & Pre-Op',
      pillar: 'blue',
      metrics: [
        { label: 'Pre-Op Clearance Rate', value: '96.2%', trend: '+1.4%', good: true },
        { label: 'Avg Check-in to Ready', value: '42 mins', trend: '-4m', good: true },
        { label: 'Transport Punctuality', value: '86.4%', trend: '-2.1%', good: false }
      ]
    },
    {
      name: 'Operating Theatres',
      pillar: 'indigo',
      metrics: [
        { label: 'OT Utilization Rate', value: '84.3%', trend: '+3.8%', good: true },
        { label: 'On-Time Surgery Start', value: '88.9%', trend: '+4.2%', good: true },
        { label: 'Average Turnover Time', value: '21.4 mins', trend: '-3.6m', good: true }
      ]
    },
    {
      name: 'CSSD Sterilization',
      pillar: 'teal',
      metrics: [
        { label: 'Sterile Pack Availability', value: '94.1%', trend: '+0.8%', good: true },
        { label: 'Spore Test Pass Rate', value: '100%', trend: '0.0%', good: true },
        { label: 'Sterile Expired Incident Rate', value: '0.4%', trend: '-0.2%', good: true }
      ]
    }
  ];

  return (
    <div className="ot-analytics-page">
      {/* 1. Page Header */}
      <div className="analytics-page-header">
        <div className="analytics-title-group">
          <div className="analytics-title-row">
            <h1 className="analytics-heading font-display">Operational Analytics</h1>
            <Badge variant="blue" size="sm" dot>Live Telemetry Aggregation</Badge>
          </div>
          <p className="analytics-subtitle">
            Understand where hospital workflow time is being lost.
          </p>
        </div>

        <div className="analytics-header-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Refresh Data
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Demo Scenario Resolved Metric Banner */}
      {demoState.delaysAvoidedCount > 0 && (
        <div className="live-signal-toast toast-cyan toast-inline">
          <Sparkles size={20} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-navy-head)' }}>
              ✓ SCENARIO DELAY RESOLVED — OT-02 Lap Cholecystectomy
            </span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-cyan-text)', fontWeight: 600 }}>
              Pack Re-assignment CSSD-00428 saved 28 minutes of potential surgical delay
            </span>
          </div>
        </div>
      )}

      {/* 2. Filter Controls Bar */}
      <div className="analytics-filter-bar ot-card">
        <div className="filter-item-col">
          <span className="filter-item-label font-mono">DATE RANGE</span>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="filter-select-input font-mono"
          >
            <option value="Today">Today (Live)</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Month to Date">Month to Date (Q3)</option>
          </select>
        </div>

        <div className="filter-item-col">
          <span className="filter-item-label font-mono">OPERATING THEATRE</span>
          <select 
            value={theatreFilter} 
            onChange={(e) => setTheatreFilter(e.target.value)}
            className="filter-select-input font-mono"
          >
            <option value="All Theatres">All Operating Theatres (4)</option>
            <option value="OT-01">OT-01 (Orthopedics)</option>
            <option value="OT-02">OT-02 (General & Lap)</option>
            <option value="OT-03">OT-03 (Sports Med)</option>
            <option value="OT-04">OT-04 (Cardiovascular)</option>
          </select>
        </div>

        <div className="filter-item-col">
          <span className="filter-item-label font-mono">PROCEDURE TYPE</span>
          <select 
            value={procedureFilter} 
            onChange={(e) => setProcedureFilter(e.target.value)}
            className="filter-select-input font-mono"
          >
            <option value="All Procedures">All Surgical Procedures</option>
            <option value="Orthopedics">Orthopedics & Joint</option>
            <option value="General">General & Laparoscopic</option>
            <option value="Sports Med">Sports Medicine & Arthroscopy</option>
            <option value="Cardiovascular">Cardiovascular & Thoracic</option>
          </select>
        </div>

        <div className="filter-item-col">
          <span className="filter-item-label font-mono">DEPARTMENT</span>
          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="filter-select-input font-mono"
          >
            <option value="All Departments">All Departments (Triad)</option>
            <option value="Admissions">Admissions & Pre-Op</option>
            <option value="Operating Theatres">Operating Theatres</option>
            <option value="CSSD">CSSD Sterilization</option>
          </select>
        </div>
      </div>

      {/* 3. Visually Prominent ACTIONABLE INSIGHTS Section */}
      <ActionableInsights />

      {/* 4. Analytics Grid: 6 Core Sections */}
      <div className="analytics-modules-grid">
        {/* Section 1: OT Utilization */}
        <div className="analytics-card ot-card">
          <div className="analytics-card-header">
            <div className="card-header-left">
              <Percent size={16} className="text-blue" />
              <h3 className="card-heading font-display">1. OT Utilization</h3>
            </div>
            <span className="card-benchmark-tag font-mono">Benchmark: 80.0% Target</span>
          </div>

          <p className="card-intro-text">Utilization percentage by operating theatre across elective and add-on blocks.</p>

          <div className="utilization-bars-list">
            {otUtilizationData.map((ot) => (
              <div key={ot.suite} className="utilization-item">
                <div className="util-meta-row font-mono">
                  <span className="util-suite font-bold text-primary">{ot.suite} ({ot.specialty})</span>
                  <div className="util-val-group">
                    <span className="util-val font-bold">{ot.utilization}%</span>
                    <span className="util-cases text-muted">• {ot.cases} cases</span>
                  </div>
                </div>

                <div className="util-track">
                  <div 
                    className={`util-fill ${ot.utilization >= 85 ? 'fill-teal' : ot.utilization >= 78 ? 'fill-blue' : 'fill-amber'}`}
                    style={{ width: `${ot.utilization}%` }}
                  />
                  {/* Benchmark Target Line */}
                  <div className="util-benchmark-line" style={{ left: '80%' }} title="Target 80%" />
                </div>
              </div>
            ))}
          </div>

          <div className="util-summary-footer font-mono">
            <span>Hospital Average OT Utilization: <strong>84.3%</strong> (+4.3% above target)</span>
          </div>
        </div>

        {/* Section 2: Delay Analysis */}
        <div className="analytics-card ot-card">
          <div className="analytics-card-header">
            <div className="card-header-left">
              <Clock size={16} className="text-red" />
              <h3 className="card-heading font-display">2. Delay Analysis</h3>
            </div>
            <span className="card-benchmark-tag font-mono">Total Lost: 111.7 hrs</span>
          </div>

          <p className="card-intro-text">Root-cause distribution of surgical start delays and room turnover latency.</p>

          {/* Composite Distribution Bar */}
          <div className="composite-delay-bar">
            {delayCauses.map((dc) => (
              <div
                key={dc.name}
                className="composite-segment"
                style={{ width: `${dc.percentage}%`, backgroundColor: dc.color }}
                title={`${dc.name}: ${dc.percentage}% (${dc.hoursLost})`}
              />
            ))}
          </div>

          {/* Causes List */}
          <div className="delay-causes-legend-list font-mono">
            {delayCauses.map((dc) => (
              <div key={dc.name} className="delay-cause-row">
                <div className="dc-left">
                  <span className="dc-color-dot" style={{ backgroundColor: dc.color }} />
                  <span className="dc-name">{dc.name}</span>
                </div>
                <div className="dc-right">
                  <span className="dc-hours text-muted">{dc.hoursLost}</span>
                  <span className="dc-pct font-bold text-primary">{dc.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Turnaround Time */}
        <div className="analytics-card ot-card">
          <div className="analytics-card-header">
            <div className="card-header-left">
              <RotateCcw size={16} className="text-teal" />
              <h3 className="card-heading font-display">3. Turnaround Time</h3>
            </div>
            <span className="card-benchmark-tag font-mono">Target: 25.0 mins</span>
          </div>

          <p className="card-intro-text">Average OT turnover duration over time (patient out to next patient in room).</p>

          {/* 7-Day Trend Visualizer */}
          <div className="turnaround-trend-container">
            <div className="turnaround-chart-svg-wrapper">
              <svg viewBox="0 0 360 120" className="turnaround-svg" preserveAspectRatio="none">
                {/* Benchmark line at 25m (y = 50) */}
                <line x1="0" y1="50" x2="360" y2="50" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth="1" />
                {/* SVG Polyline trend */}
                <polyline
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="2.5"
                  points="20,65 73,55 126,30 180,70 233,75 286,80 340,70"
                />
                {/* Dots */}
                {[
                  { cx: 20, cy: 65, val: '22m' },
                  { cx: 73, cy: 55, val: '24m' },
                  { cx: 126, cy: 30, val: '28m', isHigh: true },
                  { cx: 180, cy: 70, val: '21m' },
                  { cx: 233, cy: 75, val: '20m' },
                  { cx: 286, cy: 80, val: '19m' },
                  { cx: 340, cy: 70, val: '21m' }
                ].map((pt, i) => (
                  <g key={i}>
                    <circle cx={pt.cx} cy={pt.cy} r={pt.isHigh ? 4.5 : 3.5} fill={pt.isHigh ? '#dc2626' : '#0d9488'} />
                    <text x={pt.cx} y={pt.cy - 7} fontSize="9" fontWeight="700" textAnchor="middle" fill={pt.isHigh ? '#dc2626' : '#0f172a'} fontFamily="monospace">{pt.val}</text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="turnaround-days-row font-mono">
              {turnaroundTrend.map((t) => (
                <span key={t.day} className={`day-label ${t.isHigh ? 'text-red font-bold' : ''}`}>{t.day}</span>
              ))}
            </div>
          </div>

          <div className="turnaround-summary font-mono">
            <span>7-Day Average Turnover: <strong>21.4 mins</strong> (3.6m faster than 25m target)</span>
          </div>
        </div>

        {/* Section 4: Procedure Duration (Scheduled vs Actual) */}
        <div className="analytics-card ot-card">
          <div className="analytics-card-header">
            <div className="card-header-left">
              <Activity size={16} className="text-indigo" />
              <h3 className="card-heading font-display">4. Procedure Duration</h3>
            </div>
            <span className="card-benchmark-tag font-mono">Variance Analysis</span>
          </div>

          <p className="card-intro-text">Comparison of scheduled case block vs actual surgical incision-to-closure time.</p>

          <div className="procedure-duration-table-wrapper font-mono">
            <table className="duration-table">
              <thead>
                <tr>
                  <th>PROCEDURE</th>
                  <th style={{ width: '70px' }}>SCHED</th>
                  <th style={{ width: '70px' }}>ACTUAL</th>
                  <th style={{ width: '80px', textAlign: 'right' }}>VARIANCE</th>
                </tr>
              </thead>
              <tbody>
                {procedureDurations.map((proc) => (
                  <tr key={proc.procedure}>
                    <td><span className="proc-name">{proc.procedure}</span></td>
                    <td><span className="text-muted">{proc.scheduled}m</span></td>
                    <td><span className="text-primary font-bold">{proc.actual}m</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={`variance-pill pill-${proc.varianceType}`}>
                        {proc.variance > 0 ? `+${proc.variance}m` : `${proc.variance}m`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Workflow Bottlenecks (Ranked Causes) */}
        <div className="analytics-card ot-card">
          <div className="analytics-card-header">
            <div className="card-header-left">
              <AlertTriangle size={16} className="text-amber" />
              <h3 className="card-heading font-display">5. Workflow Bottlenecks</h3>
            </div>
            <span className="card-benchmark-tag font-mono">Ranked Delay Drivers</span>
          </div>

          <p className="card-intro-text">Highest impact friction points across the multi-department hospital workflow.</p>

          <div className="bottlenecks-ranked-list">
            {rankedBottlenecks.map((rb) => (
              <div key={rb.rank} className="ranked-item-row font-mono">
                <div className="rank-num-box font-display">{rb.rank}</div>
                <div className="ranked-details">
                  <div className="ranked-top">
                    <span className="ranked-name text-primary font-bold">{rb.name}</span>
                    <Badge variant={rb.pillar} size="xs">{rb.dept}</Badge>
                  </div>
                  <div className="ranked-stats text-muted">
                    <span>{rb.occurrences} instances</span>
                    <span>•</span>
                    <span className="text-red font-bold">Avg {rb.avgDelay}</span>
                    <span>•</span>
                    <span>Lost: {rb.hoursLost}</span>
                  </div>
                </div>
                <Badge variant={rb.impact === 'Critical' ? 'red' : rb.impact === 'High' ? 'amber' : 'slate'} size="xs">
                  {rb.impact}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Department Performance (Triad Metrics) */}
        <div className="analytics-card ot-card">
          <div className="analytics-card-header">
            <div className="card-header-left">
              <Building2 size={16} className="text-teal" />
              <h3 className="card-heading font-display">6. Department Performance</h3>
            </div>
            <span className="card-benchmark-tag font-mono">Triad Punctuality</span>
          </div>

          <p className="card-intro-text">Operational KPI metrics across Admissions, Operating Theatres, and CSSD.</p>

          <div className="dept-perf-cards-list">
            {departmentMetrics.map((dm) => (
              <div key={dm.name} className={`dept-scorecard border-pillar-${dm.pillar}`}>
                <div className="dept-scorecard-header">
                  <span className="dept-name font-display">{dm.name}</span>
                  <Badge variant={dm.pillar} size="xs">ACTIVE</Badge>
                </div>

                <div className="dept-kpis-row font-mono">
                  {dm.metrics.map((m, idx) => (
                    <div key={idx} className="dept-kpi-cell">
                      <span className="kpi-cell-label">{m.label}</span>
                      <div className="kpi-cell-val-group">
                        <span className="kpi-cell-val font-bold text-primary">{m.value}</span>
                        <span className={`kpi-cell-trend ${m.good ? 'text-teal' : 'text-red'}`}>{m.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
