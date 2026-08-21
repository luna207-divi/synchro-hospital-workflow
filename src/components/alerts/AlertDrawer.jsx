import React, { useState } from 'react';
import { 
  X, 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  Activity, 
  PackageCheck, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Share2, 
  Send,
  ShieldAlert,
  History,
  Tag,
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './AlertDrawer.css';

/**
 * Detailed Alert Inspection & Workflow Action Drawer
 */
export const AlertDrawer = ({ alert, onClose, workflow }) => {
  const [isResolved, setIsResolved] = useState(alert?.status === 'Resolved');
  const [actionDone, setActionDone] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  if (!alert) return null;

  const handleResolveClick = () => {
    setIsResolved(true);
    if (workflow?.resolveAlert) {
      workflow.resolveAlert(alert.id);
    }
    setActionMessage({ type: 'success', text: `Alert ${alert.id} resolved. Workflow updated.` });
  };

  const handleActionClick = () => {
    setActionDone(true);

    // Context automatic resolution logic
    if (alert.alert_type === 'EXPIRED_STERILE_PACK' && workflow?.markPackReady) {
      workflow.markPackReady('CSSD-LAP-021');
      setActionMessage({ type: 'success', text: 'Replacement sterile pack CSSD-LAP-021 dispatched. Expired pack quarantined.' });
    } else if (alert.alert_type === 'CONSENT_PENDING' && workflow?.patients) {
      // Sign consent
      const p = workflow.patients.find(pt => pt.full_name === alert.patientName || pt.patient_code === alert.patientId);
      if (p && workflow.advancePatientWorkflow) {
        workflow.advancePatientWorkflow(p.id || p.patient_code);
      }
      setActionMessage({ type: 'success', text: 'Digital consent form signed in EMR. Patient clearance updated.' });
    } else if (alert.alert_type === 'TURNOVER_DELAY') {
      setActionMessage({ type: 'success', text: 'Secondary sanitation technician dispatched to OT-08.' });
    } else {
      setActionMessage({ type: 'success', text: 'Mitigation protocol executed.' });
    }

    if (workflow?.resolveAlert) {
      workflow.resolveAlert(alert.id);
      setIsResolved(true);
    }
  };

  return (
    <div className="ot-alert-drawer-backdrop" onClick={onClose}>
      <div className="ot-alert-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-header-meta">
            <span className="drawer-alert-id font-mono">{alert.id}</span>
            <span className="drawer-sep">•</span>
            <span className="drawer-detected-time font-mono">Detected {alert.timeDetected}</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close drawer" type="button">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="drawer-body-content">
          {/* Action Message Banner */}
          {actionMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: actionMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: actionMessage.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${actionMessage.type === 'success' ? '#86efac' : '#fca5a5'}`,
              marginBottom: '14px'
            }}>
              <CheckCircle2 size={16} />
              <span>{actionMessage.text}</span>
            </div>
          )}

          {/* Title & Severity Banner */}
          <div className={`drawer-severity-banner severity-bg-${alert.severity.toLowerCase()}`}>
            <div className="severity-icon-zone">
              {alert.severity === 'Critical' && <AlertOctagon size={20} className="icon-critical" />}
              {alert.severity === 'Warning' && <AlertTriangle size={20} className="icon-warning" />}
              {alert.severity === 'Information' && <Info size={20} className="icon-info" />}
            </div>
            <div className="severity-text-zone">
              <div className="severity-top-line">
                <span className={`severity-badge-pill pill-${alert.severity.toLowerCase()} font-mono`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className={`status-pill ${isResolved ? 'status-resolved' : 'status-active'} font-mono`}>
                  {isResolved ? 'RESOLVED' : alert.status.toUpperCase()}
                </span>
              </div>
              <h2 className="drawer-alert-title font-display">{alert.title}</h2>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="drawer-info-grid font-mono">
            <div className="drawer-info-cell">
              <span className="cell-label">DEPARTMENT</span>
              <div className="cell-val">
                <Badge variant={alert.deptPillar || 'blue'} size="xs">{alert.department}</Badge>
              </div>
            </div>

            <div className="drawer-info-cell">
              <span className="cell-label">ASSIGNED TEAM</span>
              <span className="cell-val font-display">{alert.assignedTeam}</span>
            </div>

            <div className="drawer-info-cell full-width">
              <span className="cell-label">RELATED ENTITY</span>
              <span className="cell-val font-mono">{alert.relatedEntity}</span>
            </div>

            {alert.patientName && (
              <div className="drawer-info-cell full-width">
                <span className="cell-label">AFFECTED PATIENT</span>
                <span className="cell-val font-bold text-navy-head">{alert.patientName} ({alert.patientId || 'MRN-1042'})</span>
              </div>
            )}
          </div>

          {/* Diagnostic Root Cause */}
          <div className="drawer-section">
            <h3 className="section-title">
              <ShieldAlert size={14} className="section-icon text-red" />
              <span>Diagnostic Root Cause</span>
            </h3>
            <div className="diagnostic-box">
              <p className="diagnostic-text">{alert.reason}</p>
            </div>
          </div>

          {/* AI Recommended Action Box */}
          <div className="drawer-section">
            <h3 className="section-title">
              <Sparkles size={14} className="section-icon text-purple" />
              <span>Recommended Action & Mitigation Protocol</span>
            </h3>
            <div className="ai-recommendation-box">
              <div className="ai-rec-header">
                <span className="ai-rec-tag font-mono">AUTOMATED MITIGATION PROTOCOL</span>
                <span className="ai-rec-speed font-mono">Est. resolution: {alert.estResolutionTime || '5 mins'}</span>
              </div>
              <p className="ai-rec-body">{alert.recommendedAction}</p>
              
              <div className="ai-rec-actions">
                <Button
                  size="sm"
                  variant={alert.severity === 'Critical' ? 'danger' : 'primary'}
                  icon={actionDone ? Check : ArrowRight}
                  onClick={handleActionClick}
                  disabled={actionDone || isResolved}
                >
                  {actionDone ? 'Protocol Dispatched' : alert.primaryActionLabel || 'Execute Action'}
                </Button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="drawer-section">
            <h3 className="section-title">
              <History size={14} className="section-icon text-blue" />
              <span>Incident Event Timeline</span>
            </h3>
            <div className="drawer-timeline-list">
              {(alert.timeline || []).map((step, i) => (
                <div key={i} className="drawer-timeline-item">
                  <div className="timeline-dot-col">
                    <div className={`timeline-node-dot ${step.isFlagged ? 'dot-flagged' : 'dot-normal'}`} />
                    {i < (alert.timeline || []).length - 1 && <div className="timeline-line-connector" />}
                  </div>
                  <div className="timeline-text-col">
                    <div className="timeline-header-line">
                      <span className="timeline-step-title">{step.title}</span>
                      <span className="timeline-step-time font-mono">{step.time}</span>
                    </div>
                    <p className="timeline-step-desc">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="drawer-footer">
          <div className="drawer-footer-left" style={{ display: 'flex', gap: '8px' }}>
            <Button
              size="sm"
              variant="secondary"
              icon={Share2}
              onClick={() => alert(`Escalated alert ${alert.id} to hospital command broadcast.`)}
            >
              Escalate
            </Button>
          </div>

          <div className="drawer-footer-right">
            {isResolved ? (
              <span className="resolved-status-label font-mono">
                <CheckCircle2 size={15} className="text-teal" /> Exception Resolved
              </span>
            ) : (
              <Button
                size="sm"
                variant="teal"
                icon={CheckCircle2}
                onClick={handleResolveClick}
              >
                Resolve Exception
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
