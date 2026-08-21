import React, { useState, useMemo } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Filter, 
  Search, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  Check,
  Building2,
  PackageCheck,
  Stethoscope,
  Clock,
  UserCheck,
  ShieldAlert,
  Flame,
  FileCheck
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { AlertDrawer } from './AlertDrawer';
import './AlertsPage.css';

export const AlertsPage = () => {
  const workflow = useWorkflow();
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alerts = workflow.alerts || [];

  const handleResolveAlert = (id) => {
    if (workflow.resolveAlert) workflow.resolveAlert(id);
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      // Severity Filter
      let matchesSev = true;
      if (severityFilter === 'CRITICAL') matchesSev = a.severity === 'Critical' && a.status !== 'Resolved';
      else if (severityFilter === 'WARNING') matchesSev = a.severity === 'Warning' && a.status !== 'Resolved';
      else if (severityFilter === 'INFORMATION') matchesSev = a.severity === 'Information' && a.status !== 'Resolved';
      else if (severityFilter === 'RESOLVED') matchesSev = a.status === 'Resolved';

      // Dept Filter
      let matchesDept = true;
      if (deptFilter !== 'ALL') {
        const d = (a.department || '').toUpperCase();
        matchesDept = d.includes(deptFilter.toUpperCase());
      }

      // Search Query
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (a.title || '').toLowerCase().includes(q) ||
        (a.id || '').toLowerCase().includes(q) ||
        (a.relatedEntity || '').toLowerCase().includes(q) ||
        (a.patientName || a.patient || '').toLowerCase().includes(q) ||
        (a.department || '').toLowerCase().includes(q) ||
        (a.assignedTeam || '').toLowerCase().includes(q);

      return matchesSev && matchesDept && matchesSearch;
    });
  }, [alerts, severityFilter, deptFilter, searchQuery]);

  // Counts
  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const warningCount = alerts.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length;
  const infoCount = alerts.filter(a => a.severity === 'Information' && a.status !== 'Resolved').length;
  const resolvedCount = alerts.filter(a => a.status === 'Resolved').length + 14;

  const liveSelectedAlert = selectedAlert ? alerts.find(a => a.id === selectedAlert.id) || selectedAlert : null;

  return (
    <div className="ot-alerts-page font-sans">
      {/* 1. Page Header */}
      <div className="alerts-page-header">
        <div className="alerts-header-text">
          <div className="alerts-header-topline">
            <h1 className="alerts-title font-display">Alerts & Exceptions Command Center</h1>
            <Badge variant="red" size="sm" dot>{criticalCount} Critical Active</Badge>
          </div>
          <p className="alerts-subtitle">
            Real-time automated incident detection across Admissions, Doctors, Nursing, CSSD, Operating Theatres, and Administration.
          </p>
        </div>

        <div className="alerts-header-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Refresh Stream
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export Incident Log
          </Button>
        </div>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="alerts-kpi-summary-grid">
        <div className="alert-kpi-card ot-card accent-red" onClick={() => setSeverityFilter('CRITICAL')}>
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">CRITICAL EXCEPTIONS</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-red font-display">{criticalCount}</span>
              <span className="kpi-sub font-mono">Immediate risk to OT</span>
            </div>
          </div>
          <AlertOctagon size={24} className="kpi-bg-icon text-red" />
        </div>

        <div className="alert-kpi-card ot-card accent-amber" onClick={() => setSeverityFilter('WARNING')}>
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">OPERATIONAL WARNINGS</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-amber font-display">{warningCount}</span>
              <span className="kpi-sub font-mono">Turnover & transfer lag</span>
            </div>
          </div>
          <AlertTriangle size={24} className="kpi-bg-icon text-amber" />
        </div>

        <div className="alert-kpi-card ot-card accent-blue" onClick={() => setSeverityFilter('INFORMATION')}>
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">WORKFLOW UPDATES</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-blue font-display">{infoCount}</span>
              <span className="kpi-sub font-mono">Ready clearances</span>
            </div>
          </div>
          <Info size={24} className="kpi-bg-icon text-blue" />
        </div>

        <div className="alert-kpi-card ot-card accent-teal" onClick={() => setSeverityFilter('RESOLVED')}>
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">RESOLVED TODAY</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-teal font-display">{resolvedCount}</span>
              <span className="kpi-sub font-mono">Avg resolution 7.2m</span>
            </div>
          </div>
          <CheckCircle2 size={24} className="kpi-bg-icon text-teal" />
        </div>
      </div>

      {/* 3. Workflow Bottlenecks Summary Panel */}
      <div className="ot-card" style={{ padding: '16px 20px', marginBottom: '20px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} className="text-red" />
            <span className="font-display font-bold" style={{ fontSize: '13px', color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              CURRENT WORKFLOW BOTTLENECKS
            </span>
          </div>
          <span className="font-mono text-muted" style={{ fontSize: '11px' }}>Automated Cross-Department Correlation Engine</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#fff5f5', border: '1px solid #fca5a5' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="font-mono font-bold text-red" style={{ fontSize: '11px' }}>CSSD STERILIZATION</span>
              <Badge variant="red" size="xs">1 Expired</Badge>
            </div>
            <p className="font-sans" style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              CSSD-GEN-017 expired in Vault B. Backup pack CSSD-LAP-021 verified.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="font-mono font-bold text-amber" style={{ fontSize: '11px' }}>OT TURNOVER</span>
              <Badge variant="amber" size="xs">OT-08 Lag</Badge>
            </div>
            <p className="font-sans" style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              OT-08 turnover elapsed 28m (benchmark 25m). Sanitation tech dispatched.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="font-mono font-bold text-blue" style={{ fontSize: '11px' }}>PRE-OP CONSENT</span>
              <Badge variant="blue" size="xs">1 Pending</Badge>
            </div>
            <p className="font-sans" style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Priya Sharma (P-1048) requires digital consent sign-off before OT.
            </p>
          </div>

          <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span className="font-mono font-bold text-teal" style={{ fontSize: '11px' }}>EMERGENCY TRAUMA</span>
              <Badge variant="teal" size="xs">STAT Ready</Badge>
            </div>
            <p className="font-sans" style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Arjun Das (P-1099) fast-tracked. Emergency Kit CSSD-TRM-009 verified.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Filter Bar */}
      <div className="alerts-filter-control-bar ot-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
          {/* Severity Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className="font-mono text-muted" style={{ fontSize: '10px', fontWeight: 700, marginRight: '4px' }}>SEVERITY:</span>
            {[
              { id: 'ALL', label: 'All Severity' },
              { id: 'CRITICAL', label: `Critical (${criticalCount})` },
              { id: 'WARNING', label: `Warning (${warningCount})` },
              { id: 'INFORMATION', label: `Information (${infoCount})` },
              { id: 'RESOLVED', label: `Resolved (${resolvedCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                className={`filter-btn-pill ${severityFilter === tab.id ? 'is-active' : ''}`}
                onClick={() => setSeverityFilter(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Department Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span className="font-mono text-muted" style={{ fontSize: '10px', fontWeight: 700, marginRight: '4px' }}>DEPARTMENT:</span>
            {['ALL', 'ADMISSIONS', 'DOCTORS', 'OT', 'CSSD', 'NURSING', 'ADMIN'].map(d => (
              <button
                key={d}
                className={`filter-btn-pill ${deptFilter === d ? 'is-active' : ''}`}
                onClick={() => setDeptFilter(d)}
                type="button"
                style={{ fontSize: '10px', padding: '4px 10px' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div className="filter-search-box">
          <SearchInput
            placeholder="Search alerts, MRN, pack, OT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* 5. Alerts Data Table */}
      <div className="alerts-table-container ot-card">
        <table className="alerts-data-table">
          <thead>
            <tr>
              <th style={{ width: '110px' }}>SEVERITY</th>
              <th>ALERT TITLE</th>
              <th style={{ width: '130px' }}>DEPARTMENT</th>
              <th>RELATED ENTITY</th>
              <th style={{ width: '130px' }}>PATIENT</th>
              <th style={{ width: '110px' }}>DETECTED</th>
              <th style={{ width: '100px' }}>STATUS</th>
              <th style={{ width: '150px' }}>ASSIGNED TEAM</th>
              <th style={{ width: '100px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alt) => {
              const isSelected = selectedAlert?.id === alt.id;
              const isResolved = alt.status === 'Resolved';

              return (
                <tr 
                  key={alt.id}
                  className={`alert-table-row ${isSelected ? 'row-selected' : ''} ${isResolved ? 'row-resolved' : `row-severity-${alt.severity.toLowerCase()}`}`}
                  onClick={() => setSelectedAlert(alt)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <span className={`table-severity-pill pill-${alt.severity.toLowerCase()} font-mono`}>
                      {alt.severity === 'Critical' && <AlertOctagon size={11} />}
                      {alt.severity === 'Warning' && <AlertTriangle size={11} />}
                      {alt.severity === 'Information' && <Info size={11} />}
                      {alt.severity}
                    </span>
                  </td>

                  <td>
                    <div className="table-title-cell">
                      <span className="alert-table-title">{alt.title}</span>
                      <span className="alert-table-id font-mono">{alt.id}</span>
                    </div>
                  </td>

                  <td>
                    <Badge variant={alt.deptPillar || 'blue'} size="xs">{alt.department}</Badge>
                  </td>

                  <td>
                    <span className="table-related-entity font-mono">{alt.relatedEntity}</span>
                  </td>

                  <td>
                    {alt.patientName ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-navy-head)' }}>{alt.patientName}</span>
                        <span className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{alt.patientId}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>

                  <td>
                    <span className="table-detected-time font-mono">{alt.timeDetected}</span>
                  </td>

                  <td>
                    <span className={`table-status-pill ${isResolved ? 'status-resolved' : 'status-active'} font-mono`}>
                      {isResolved ? 'RESOLVED' : alt.status}
                    </span>
                  </td>

                  <td>
                    <span className="table-assigned-team">{alt.assignedTeam}</span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <Button
                      size="xs"
                      variant={isResolved ? 'secondary' : 'primary'}
                      iconRight={ChevronRight}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alt);
                      }}
                    >
                      Investigate
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredAlerts.length === 0 && (
          <div className="alerts-empty-state">
            <CheckCircle2 size={32} className="text-teal" />
            <span className="empty-state-title">No Active Exceptions</span>
            <span className="empty-state-desc">All clinical workflows for the selected filter are operating within normal bounds.</span>
          </div>
        )}
      </div>

      {/* 6. Alert Detail Drawer */}
      {liveSelectedAlert && (
        <AlertDrawer
          alert={liveSelectedAlert}
          onClose={() => setSelectedAlert(null)}
          workflow={workflow}
        />
      )}
    </div>
  );
};
