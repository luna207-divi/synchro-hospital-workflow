import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { AlertDrawer } from './AlertDrawer';
import './AlertsPage.css';

export const AlertsPage = () => {
  const workflow = useWorkflow();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const alerts = workflow.alerts || [];

  const handleResolveAlert = (id) => {
    workflow.resolveAlert(id);
  };

  const filterOptions = [
    'All',
    'Critical',
    'Warning',
    'Information',
    'Admissions',
    'OT',
    'CSSD'
  ];

  const filteredAlerts = alerts.filter(a => {
    let matchesFilter = true;
    if (activeFilter === 'Critical') matchesFilter = a.severity === 'Critical';
    else if (activeFilter === 'Warning') matchesFilter = a.severity === 'Warning';
    else if (activeFilter === 'Information') matchesFilter = a.severity === 'Information';
    else if (activeFilter === 'Admissions') matchesFilter = a.department === 'Admissions';
    else if (activeFilter === 'OT') matchesFilter = a.department === 'OT';
    else if (activeFilter === 'CSSD') matchesFilter = a.department === 'CSSD';

    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      a.title.toLowerCase().includes(q) ||
      (a.relatedEntity && a.relatedEntity.toLowerCase().includes(q)) ||
      a.id.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const warningCount = alerts.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length;
  const infoCount = alerts.filter(a => a.severity === 'Information' && a.status !== 'Resolved').length;
  const resolvedTodayCount = alerts.filter(a => a.status === 'Resolved').length + 14;

  return (
    <div className="ot-alerts-page">
      {/* 1. Page Header */}
      <div className="alerts-page-header">
        <div className="alerts-header-text">
          <div className="alerts-header-topline">
            <h1 className="alerts-title font-display">Alerts & Exceptions Command</h1>
            <Badge variant="red" size="sm" dot>{criticalCount} Critical Active</Badge>
          </div>
          <p className="alerts-subtitle">
            Real-time automated incident detection across Admissions, OTs, and CSSD.
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
        <div className="alert-kpi-card ot-card accent-red" onClick={() => setActiveFilter('Critical')}>
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">CRITICAL EXCEPTIONS</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-red font-display">{criticalCount}</span>
              <span className="kpi-sub font-mono">Immediate risk to OT</span>
            </div>
          </div>
          <AlertOctagon size={24} className="kpi-bg-icon text-red" />
        </div>

        <div className="alert-kpi-card ot-card accent-amber" onClick={() => setActiveFilter('Warning')}>
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">OPERATIONAL WARNINGS</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-amber font-display">{warningCount}</span>
              <span className="kpi-sub font-mono">Turnover & transfer lag</span>
            </div>
          </div>
          <AlertTriangle size={24} className="kpi-bg-icon text-amber" />
        </div>

        <div className="alert-kpi-card ot-card accent-blue" onClick={() => setActiveFilter('Information')}>
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">WORKFLOW INFORMATION</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-blue font-display">{infoCount}</span>
              <span className="kpi-sub font-mono">Ready clearances</span>
            </div>
          </div>
          <Info size={24} className="kpi-bg-icon text-blue" />
        </div>

        <div className="alert-kpi-card ot-card accent-teal">
          <div className="kpi-card-content">
            <span className="kpi-label font-mono">RESOLVED TODAY</span>
            <div className="kpi-val-row">
              <span className="kpi-num text-teal font-display">{resolvedTodayCount}</span>
              <span className="kpi-sub font-mono">Avg resolution 7.2m</span>
            </div>
          </div>
          <CheckCircle2 size={24} className="kpi-bg-icon text-teal" />
        </div>
      </div>

      {/* 3. Top Filter Controls Bar */}
      <div className="alerts-filter-control-bar ot-card">
        <div className="filter-pills-container">
          <div className="filter-pill-row">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                className={`filter-btn-pill ${activeFilter === opt ? 'is-active' : ''}`}
                onClick={() => setActiveFilter(opt)}
                type="button"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Search Filter */}
        <div className="filter-search-box">
          <SearchInput
            placeholder="Search exceptions, packs, patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* 4. High-Density Alert Table / List */}
      <div className="alerts-table-container ot-card">
        <table className="alerts-data-table">
          <thead>
            <tr>
              <th style={{ width: '110px' }}>SEVERITY</th>
              <th>ALERT TITLE</th>
              <th style={{ width: '130px' }}>DEPARTMENT</th>
              <th>RELATED ENTITY</th>
              <th style={{ width: '120px' }}>DETECTED</th>
              <th style={{ width: '100px' }}>STATUS</th>
              <th style={{ width: '160px' }}>ASSIGNED TEAM</th>
              <th style={{ width: '110px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.map((alt) => {
              const isSelected = selectedAlert?.id === alt.id;
              return (
                <tr 
                  key={alt.id}
                  className={`alert-table-row ${isSelected ? 'row-selected' : ''} row-severity-${alt.severity.toLowerCase()}`}
                  onClick={() => setSelectedAlert(alt)}
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
                    <Badge variant={alt.deptPillar || 'teal'} size="xs">{alt.department}</Badge>
                  </td>

                  <td>
                    <span className="table-related-entity font-mono">{alt.relatedEntity}</span>
                  </td>

                  <td>
                    <span className="table-detected-time font-mono">{alt.timeDetected}</span>
                  </td>

                  <td>
                    <span className={`table-status-pill ${alt.status === 'Resolved' ? 'status-resolved' : 'status-active'} font-mono`}>
                      {alt.status}
                    </span>
                  </td>

                  <td>
                    <span className="table-assigned-team">{alt.assignedTeam}</span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <Button
                      size="xs"
                      variant="secondary"
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
            <span className="empty-state-title">No Matching Exceptions</span>
            <span className="empty-state-desc">All clinical workflows for "{activeFilter}" are operating within normal parameters.</span>
          </div>
        )}
      </div>

      {/* 5. Right-Side Detail Drawer */}
      {selectedAlert && (
        <AlertDrawer
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onResolve={handleResolveAlert}
        />
      )}
    </div>
  );
};
