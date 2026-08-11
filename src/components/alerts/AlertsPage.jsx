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
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { AlertDrawer } from './AlertDrawer';
import './AlertsPage.css';

export const AlertsPage = () => {
  // Single unified filter state supporting: 'All', 'Critical', 'Warning', 'Information', 'Admissions', 'OT', 'CSSD'
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);

  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-2094',
      severity: 'Critical',
      title: 'Expired sterile pack detected',
      department: 'CSSD',
      deptPillar: 'teal',
      relatedEntity: 'Tray #CSSD-EXP-09 • OT-01 • Patient: Robert Vance (MRN-8419)',
      timeDetected: '3 mins ago',
      status: 'Active',
      assignedTeam: 'CSSD Sterilization Lead',
      reason: 'Sterility shelf-life expired 2 hours prior to case dispatch. Autoclave biological spore strip validation was stamped on Aug 03.',
      recommendedAction: 'Immediately quarantine Tray #CSSD-EXP-09 from sterile storage. Dispatch replacement backup Tray #CSSD-TH-04 currently staged in Central Sterile Vault.',
      primaryActionLabel: 'Dispatch Replacement Tray',
      estResolutionTime: '4 mins',
      timeline: [
        { time: '11:42 AM', title: 'RFID Reader Pinged at OT-01 holding core', desc: 'Tray scanned at sterile perimeter sensor.' },
        { time: '11:43 AM', title: 'AI Sterility Validation Engine Flagged Expiry', desc: 'Shelf-life expiration algorithm detected 72-hour threshold exceedance.', isFlagged: true },
        { time: '11:44 AM', title: 'Alert Escalated to CSSD & OT Charge Nurse', desc: 'Surgical pack hold placed on EMR case schedule.' }
      ]
    },
    {
      id: 'ALT-2093',
      severity: 'Critical',
      title: 'Required instrument pack unavailable',
      department: 'CSSD',
      deptPillar: 'teal',
      relatedEntity: 'Pack #CSSD-00125 • OT-03 • Patient: Marcus Chen (MRN-3318)',
      timeDetected: '14 mins ago',
      status: 'Active',
      assignedTeam: 'Surgical Supply Logistics',
      reason: 'Orthopedic Power Tool Set #04 is undergoing 4-stage autoclave cooling cycle (Chamber #02). Tray not released for next ACL surgery.',
      recommendedAction: 'Expedite reserve fast-track Tray #99-B from Reserve Vault or reroute sterile pack from completed morning case in OT-01.',
      primaryActionLabel: 'Expedite Reserve Tray #99-B',
      estResolutionTime: '6 mins',
      timeline: [
        { time: '11:15 AM', title: 'Case #1050 Triad Verification Checked', desc: 'CSSD readiness returned HOLD state.' },
        { time: '11:22 AM', title: 'Autoclave Cooldown Lag Identified', desc: 'Estimated completion 11:58 AM (+22m start delay).', isFlagged: true }
      ]
    },
    {
      id: 'ALT-2092',
      severity: 'Warning',
      title: 'OT-03 turnover exceeded expected duration',
      department: 'OT',
      deptPillar: 'indigo',
      relatedEntity: 'OT Suite 03 • Turnover: 34m (Benchmark: 25m)',
      timeDetected: '19 mins ago',
      status: 'Active',
      assignedTeam: 'OT Charge Nurse',
      reason: 'Environmental sanitation team delayed due to extensive aerosolized suction canister cleanup after complex trauma case.',
      recommendedAction: 'Assign secondary environmental sanitation technician to assist OT-03 turnover lead.',
      primaryActionLabel: 'Dispatch Assist Tech',
      estResolutionTime: '8 mins',
      timeline: [
        { time: '11:00 AM', title: 'Patient Out of Room', desc: 'Surgical dressing completed and patient transferred to PACU.' },
        { time: '11:25 AM', title: '25m Standard Turnover Window Elapsed', desc: 'Sanitation incomplete notification triggered.', isFlagged: true }
      ]
    },
    {
      id: 'ALT-2091',
      severity: 'Warning',
      title: 'Patient transfer pending',
      department: 'Admissions',
      deptPillar: 'blue',
      relatedEntity: 'Patient: Elena Rostova (MRN-9204) • Pre-Op Bay 3 to OT-02',
      timeDetected: '24 mins ago',
      status: 'Active',
      assignedTeam: 'Patient Transport Lead',
      reason: 'Porter transport request logged at 11:00 AM. Assigned porter currently delayed in Radiology transport.',
      recommendedAction: 'Reassign transport porter from Ward 4C reserve to transfer patient Elena Rostova to OT-02 holding zone.',
      primaryActionLabel: 'Reassign Reserve Porter',
      estResolutionTime: '5 mins',
      timeline: [
        { time: '11:00 AM', title: 'Transfer Order Generated', desc: 'Anesthesiology sign-off verified.' },
        { time: '11:20 AM', title: '20m Transport Threshold Exceeded', desc: 'Automatic delay warning generated for OT-02.', isFlagged: true }
      ]
    },
    {
      id: 'ALT-2090',
      severity: 'Information',
      title: 'Patient P-1024 ready for OT',
      department: 'Admissions',
      deptPillar: 'blue',
      relatedEntity: 'Patient: Robert Vance (MRN-8419) • Pre-Op Clearance Complete',
      timeDetected: '28 mins ago',
      status: 'Active',
      assignedTeam: 'Admissions Triage',
      reason: 'All pre-operative surgical checklists, consent forms, IV access, and surgical site markings confirmed 100%.',
      recommendedAction: 'Patient cleared for transfer when OT-01 signals incision room prep readiness.',
      primaryActionLabel: 'Signal Theatre Ready',
      estResolutionTime: 'Immediate',
      timeline: [
        { time: '10:45 AM', title: 'Anesthesia Clearance Approved', desc: 'ASA Physical Status classification confirmed.' },
        { time: '11:05 AM', title: 'Checklist 100% Validated', desc: 'Patient marked Ready in EMR Triad.' }
      ]
    },
    {
      id: 'ALT-2089',
      severity: 'Warning',
      title: 'Consent missing for scheduled procedure',
      department: 'Admissions',
      deptPillar: 'blue',
      relatedEntity: 'Patient: Sarah Jenkins (MRN-7741) • OT-04 (11:30 AM)',
      timeDetected: '35 mins ago',
      status: 'Active',
      assignedTeam: 'Pre-Op Coordinator',
      reason: 'Informed surgical consent signature missing in electronic health record for 11:30 AM Total Knee Arthroplasty.',
      recommendedAction: 'Send urgent mobile e-Sign tablet to Pre-Op Bay 2 for attending surgeon and patient signature confirmation.',
      primaryActionLabel: 'Dispatch e-Sign Tablet',
      estResolutionTime: '7 mins',
      timeline: [
        { time: '10:30 AM', title: 'Chart Ingestion Validated', desc: 'Missing consent document flagged in automated pre-op audit.', isFlagged: true }
      ]
    }
  ]);

  const handleResolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'Resolved' } : a));
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

    const matchesSearch = searchQuery === '' || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.relatedEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const criticalCount = alerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
  const warningCount = alerts.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length;
  const infoCount = alerts.filter(a => a.severity === 'Information' && a.status !== 'Resolved').length;

  return (
    <div className="ot-alerts-page">
      {/* 1. Page Header */}
      <div className="alerts-page-header">
        <div className="alerts-header-text">
          <div className="alerts-header-topline">
            <h1 className="alerts-title font-display">Alerts & Exceptions</h1>
            <Badge variant="red" size="sm" dot>{criticalCount} Critical Active</Badge>
          </div>
          <p className="alerts-subtitle">
            Real-time issues requiring attention across hospital operations.
          </p>
        </div>

        <div className="alerts-header-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Refresh Stream
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export Log
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
              <span className="kpi-num text-teal font-display">14</span>
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
                  {/* Severity */}
                  <td>
                    <span className={`table-severity-pill pill-${alt.severity.toLowerCase()} font-mono`}>
                      {alt.severity === 'Critical' && <AlertOctagon size={11} />}
                      {alt.severity === 'Warning' && <AlertTriangle size={11} />}
                      {alt.severity === 'Information' && <Info size={11} />}
                      {alt.severity}
                    </span>
                  </td>

                  {/* Title */}
                  <td>
                    <div className="table-title-cell">
                      <span className="alert-table-title">{alt.title}</span>
                      <span className="alert-table-id font-mono">{alt.id}</span>
                    </div>
                  </td>

                  {/* Department */}
                  <td>
                    <Badge variant={alt.deptPillar} size="xs">{alt.department}</Badge>
                  </td>

                  {/* Related Entity */}
                  <td>
                    <span className="table-related-entity font-mono">{alt.relatedEntity}</span>
                  </td>

                  {/* Detected */}
                  <td>
                    <span className="table-detected-time font-mono">{alt.timeDetected}</span>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`table-status-pill ${alt.status === 'Resolved' ? 'status-resolved' : 'status-active'} font-mono`}>
                      {alt.status}
                    </span>
                  </td>

                  {/* Assigned Team */}
                  <td>
                    <span className="table-assigned-team">{alt.assignedTeam}</span>
                  </td>

                  {/* Action */}
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
            <span className="empty-state-desc">All clinical workflows for "{activeFilter}" are operating within normal operational parameters.</span>
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
