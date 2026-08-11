import React from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Loader, Clock,
  User, Zap, Package, ArrowRight, ChevronRight 
} from 'lucide-react';
import './StatusComponents.css';

/* ============================================================
   OTFlow AI — Reusable Status Component Library

   Design rules:
   1. Every status is communicated through COLOR + ICON + TEXT
   2. Only 4 status colors: green, amber, red, blue
   3. No color-only indicators
   ============================================================ */

/* ── Status Map ──────────────────────────────────────── */
const STATUS_CONFIG = {
  ready:     { color: 'green',  icon: CheckCircle2,  label: 'Ready' },
  ontrack:   { color: 'green',  icon: CheckCircle2,  label: 'On Track' },
  flowing:   { color: 'green',  icon: CheckCircle2,  label: 'Flowing' },
  complete:  { color: 'green',  icon: CheckCircle2,  label: 'Complete' },
  attention: { color: 'amber',  icon: AlertTriangle,  label: 'Attention' },
  waiting:   { color: 'amber',  icon: Clock,          label: 'Waiting' },
  pending:   { color: 'amber',  icon: Clock,          label: 'Pending' },
  blocked:   { color: 'red',    icon: XCircle,         label: 'Blocked' },
  critical:  { color: 'red',    icon: AlertTriangle,   label: 'Critical' },
  expired:   { color: 'red',    icon: XCircle,         label: 'Expired' },
  inprogress:{ color: 'blue',   icon: Loader,          label: 'In Progress' },
  active:    { color: 'blue',   icon: Loader,          label: 'Active' },
  assigned:  { color: 'blue',   icon: Loader,          label: 'Assigned' },
};

/* ── 1. WorkflowStatus ───────────────────────────────── 
   General-purpose status indicator. Color + icon + text.
   Usage: <WorkflowStatus status="ready" />
          <WorkflowStatus status="blocked" label="CSSD Blocked" />
*/
export const WorkflowStatus = ({ status, label, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span className={`wf-status wf-status-${config.color} wf-status-${size}`}>
      <Icon className="wf-status-icon" />
      <span className="wf-status-label">{displayLabel}</span>
    </span>
  );
};

/* ── 2. StatusDot ────────────────────────────────────── 
   Minimal dot + text for tight spaces.
   Usage: <StatusDot status="ready" />
*/
export const StatusDot = ({ status, label }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span className={`status-dot-badge dot-${config.color}`}>
      <span className="status-dot-circle" />
      <Icon size={10} className="status-dot-icon" />
      <span className="status-dot-text">{displayLabel}</span>
    </span>
  );
};

/* ── 3. PatientStatus ────────────────────────────────── 
   Shows patient name, MRN, procedure, and readiness.
   Usage: <PatientStatus name="R. Vance" mrn="MRN-8419" 
            procedure="THA" status="ready" />
*/
export const PatientStatus = ({ name, mrn, procedure, status, time }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const Icon = config.icon;

  return (
    <div className={`patient-status ps-${config.color}`}>
      <div className="ps-left">
        <User size={14} className="ps-icon" />
      </div>
      <div className="ps-content">
        <div className="ps-header">
          <span className="ps-name">{name}</span>
          {mrn && <span className="ps-mrn font-mono">{mrn}</span>}
        </div>
        {procedure && <span className="ps-procedure">{procedure}</span>}
        {time && <span className="ps-time font-mono">{time}</span>}
      </div>
      <div className="ps-status-indicator">
        <Icon size={14} />
        <span className="ps-status-text">{config.label}</span>
      </div>
    </div>
  );
};

/* ── 4. OTStatus ─────────────────────────────────────── 
   Theatre status card. Shows OT ID, specialty, state.
   Usage: <OTStatus id="OT-01" specialty="Ortho" status="inprogress" />
*/
export const OTStatus = ({ id, specialty, status, patient, procedure }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const Icon = config.icon;

  return (
    <div className={`ot-status ots-${config.color}`}>
      <div className="ots-header">
        <span className="ots-id font-mono">{id}</span>
        <span className={`ots-badge ots-badge-${config.color}`}>
          <Icon size={11} />
          <span>{config.label}</span>
        </span>
      </div>
      {specialty && <span className="ots-specialty">{specialty}</span>}
      {patient && (
        <div className="ots-case">
          <span className="ots-patient">{patient}</span>
          {procedure && <span className="ots-procedure">{procedure}</span>}
        </div>
      )}
    </div>
  );
};

/* ── 5. CSSDStatus ───────────────────────────────────── 
   Pack status indicator.
   Usage: <CSSDStatus packId="CSSD-TH-04" type="TKR Set" status="ready" />
*/
export const CSSDStatus = ({ packId, type, status, location }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ready;
  const Icon = config.icon;

  return (
    <div className={`cssd-status css-${config.color}`}>
      <div className="css-icon-col">
        <Package size={14} />
      </div>
      <div className="css-content">
        <div className="css-header">
          <span className="css-pack-id font-mono">{packId}</span>
          <span className={`css-badge css-badge-${config.color}`}>
            <Icon size={10} />
            <span>{config.label}</span>
          </span>
        </div>
        {type && <span className="css-type">{type}</span>}
        {location && <span className="css-location font-mono">{location}</span>}
      </div>
    </div>
  );
};

/* ── 6. ReadinessGate ────────────────────────────────── 
   The three-gate indicator (Patient / OT / CSSD).
   Usage: <ReadinessGate patient="ready" ot="ready" cssd="blocked" />
*/
export const ReadinessGate = ({ patient = 'waiting', ot = 'waiting', cssd = 'waiting', size = 'md' }) => {
  const gates = [
    { key: 'patient', status: patient, icon: User, label: 'Patient' },
    { key: 'ot', status: ot, icon: Zap, label: 'OT' },
    { key: 'cssd', status: cssd, icon: Package, label: 'CSSD' },
  ];

  return (
    <div className={`readiness-gate rg-${size}`}>
      {gates.map(gate => {
        const config = STATUS_CONFIG[gate.status] || STATUS_CONFIG.waiting;
        return (
          <div 
            key={gate.key} 
            className={`rg-dot rg-${config.color}`}
            title={`${gate.label}: ${config.label}`}
          >
            <gate.icon size={size === 'sm' ? 10 : 12} />
          </div>
        );
      })}
    </div>
  );
};

/* ── 7. TimelineEvent ────────────────────────────────── 
   Single timeline entry.
   Usage: <TimelineEvent time="09:15" event="Patient admitted" 
            dept="Admissions" status="complete" />
*/
export const TimelineEvent = ({ time, event, dept, status = 'complete', isLast = false }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.complete;
  const Icon = config.icon;

  return (
    <div className={`timeline-event te-${config.color}`}>
      <div className="te-time font-mono">{time}</div>
      <div className="te-track">
        <div className={`te-dot te-dot-${config.color}`}>
          <Icon size={10} />
        </div>
        {!isLast && <div className={`te-line te-line-${config.color}`} />}
      </div>
      <div className="te-content">
        <span className="te-event">{event}</span>
        {dept && <span className="te-dept font-mono">{dept}</span>}
      </div>
    </div>
  );
};

/* ── 8. AlertItem ────────────────────────────────────── 
   Compact alert row.
   Usage: <AlertItem severity="critical" title="Pack expired" 
            message="CSSD-00142 exceeded validity" />
*/
export const AlertItem = ({ severity = 'critical', title, message, time, action }) => {
  const colorMap = { critical: 'red', warning: 'amber', info: 'blue' };
  const iconMap = { critical: XCircle, warning: AlertTriangle, info: Loader };
  const color = colorMap[severity] || 'red';
  const Icon = iconMap[severity] || XCircle;

  return (
    <div className={`alert-item ai-${color}`}>
      <div className={`ai-severity ai-sev-${color}`}>
        <Icon size={14} />
      </div>
      <div className="ai-content">
        <span className="ai-title">{title}</span>
        {message && <span className="ai-message">{message}</span>}
      </div>
      <div className="ai-meta">
        {time && <span className="ai-time font-mono">{time}</span>}
        {action && (
          <button className="ai-action-btn" type="button">{action}</button>
        )}
      </div>
    </div>
  );
};

/* ── 9. ProgressBar ──────────────────────────────────── 
   Status-aware progress indicator.
   Usage: <ProgressBar value={65} status="inprogress" />
*/
export const ProgressBar = ({ value = 0, status = 'inprogress', showLabel = true }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.inprogress;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div 
          className={`progress-bar-fill pb-${config.color}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className={`progress-bar-label font-mono pb-label-${config.color}`}>
          {value}%
        </span>
      )}
    </div>
  );
};

/* ── 10. ActionButton ────────────────────────────────── 
   Consistent action buttons.
   Usage: <ActionButton label="Resolve" variant="primary" />
*/
export const ActionButton = ({ label, variant = 'primary', icon: ButtonIcon, onClick, size = 'md', disabled = false }) => {
  return (
    <button 
      className={`action-btn ab-${variant} ab-${size} ${disabled ? 'ab-disabled' : ''}`}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {ButtonIcon && <ButtonIcon size={size === 'sm' ? 12 : 14} className="ab-icon" />}
      <span>{label}</span>
    </button>
  );
};
