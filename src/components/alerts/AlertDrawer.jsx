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
  Tag
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './AlertDrawer.css';

/**
 * Right-Side Detail Drawer for Fast Hospital Staff Response
 */
export const AlertDrawer = ({ alert, onClose, onResolve }) => {
  const [isResolved, setIsResolved] = useState(alert?.status === 'Resolved');
  const [actionDone, setActionDone] = useState(false);

  if (!alert) return null;

  const handleResolveClick = () => {
    setIsResolved(true);
    if (onResolve) onResolve(alert.id);
  };

  const handleActionClick = () => {
    setActionDone(true);
  };

  return (
    <div className="ot-alert-drawer-backdrop" onClick={onClose}>
      <div className="ot-alert-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
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
          <div className="drawer-info-grid">
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
          </div>

          {/* Root Cause / Reason Section */}
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
              <span>Recommended Action</span>
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
                  disabled={actionDone}
                >
                  {actionDone ? 'Protocol Dispatched' : alert.primaryActionLabel || 'Execute Action'}
                </Button>
              </div>
            </div>
          </div>

          {/* Workflow Chronological Timeline */}
          <div className="drawer-section">
            <h3 className="section-title">
              <History size={14} className="section-icon text-blue" />
              <span>Workflow Audit Timeline</span>
            </h3>
            <div className="drawer-timeline-list">
              {alert.timeline && alert.timeline.map((step, i) => (
                <div key={i} className="drawer-timeline-item">
                  <div className="timeline-dot-col">
                    <div className={`timeline-node-dot ${step.isFlagged ? 'dot-flagged' : 'dot-normal'}`} />
                    {i < alert.timeline.length - 1 && <div className="timeline-line-connector" />}
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

        {/* Drawer Footer Actions */}
        <div className="drawer-footer">
          <div className="drawer-footer-left">
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
