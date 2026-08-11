import React, { useState } from 'react';
import { 
  AlertTriangle, ArrowRight, Clock, Zap, Package, User,
  ChevronDown, ChevronUp, ExternalLink, Target
} from 'lucide-react';
import './BottleneckRadar.css';

/* ============================================================
   BOTTLENECK RADAR — "What's stuck and why?"
   Shows active bottlenecks as connected causal chains, 
   sorted by impact.
   ============================================================ */

const BOTTLENECKS = [
  {
    id: 'BN-001',
    severity: 'critical',
    title: 'CSSD pack stuck in autoclave cooldown',
    impact: 'OT-02 start delayed 22+ min',
    impactScore: 'High',
    affectedCases: 1,
    timeBlocked: '22 min',
    chain: [
      { entity: 'OT-02', label: 'Surgery Delayed', sublabel: 'E. Rostova — Lap Chole', dept: 'OT', icon: Zap, status: 'blocked' },
      { entity: 'CSSD-00142', label: 'Pack Not Available', sublabel: 'Power Tool Set awaiting cooldown', dept: 'CSSD', icon: Package, status: 'blocked' },
      { entity: 'Autoclave #2', label: 'Extended Cooldown', sublabel: 'Cycle completed but cooldown pending', dept: 'CSSD', icon: Target, status: 'root' },
    ],
    actions: [
      { label: 'Dispatch Reserve Tray #99-B', type: 'primary' },
      { label: 'Notify Dr. Patel', type: 'secondary' }
    ],
    relatedEvents: [
      { time: '08:45', event: 'Autoclave #2 cycle started for CSSD-00142' },
      { time: '09:20', event: 'Cycle completed — cooldown phase initiated' },
      { time: '09:30', event: 'OT-02 preparation started (pack expected by 09:15)' },
      { time: '09:40', event: 'System flagged: pack unavailable, OT blocked' },
    ]
  },
  {
    id: 'BN-002',
    severity: 'warning',
    title: 'OT-03 turnover exceeding benchmark',
    impact: 'Next case delayed, A. Malik waiting',
    impactScore: 'Medium',
    affectedCases: 1,
    timeBlocked: '9 min over',
    chain: [
      { entity: 'OT-03', label: 'Turnover Overtime', sublabel: '34m elapsed vs 25m benchmark', dept: 'OT', icon: Zap, status: 'attention' },
      { entity: 'Cleaning Team', label: 'Extended Sanitization', sublabel: 'Biohazard protocol required post-ACL', dept: 'OT', icon: User, status: 'attention' },
    ],
    actions: [
      { label: 'Alert Cleaning Supervisor', type: 'primary' },
      { label: 'Notify A. Malik (next patient)', type: 'secondary' }
    ],
    relatedEvents: [
      { time: '09:50', event: 'ACL Reconstruction completed (M. Chen)' },
      { time: '09:55', event: 'Turnover initiated — biohazard cleanup flagged' },
      { time: '10:15', event: 'Standard turnover window expired (25m)' },
      { time: '10:24', event: 'Cleaning still in progress — supervisor notified' },
    ]
  },
  {
    id: 'BN-003',
    severity: 'info',
    title: 'Patient consent form pending verification',
    impact: 'A. Miller — Lap Chole (14:00) at risk',
    impactScore: 'Low',
    affectedCases: 1,
    timeBlocked: 'Not yet blocking',
    chain: [
      { entity: 'OT-02 (14:00)', label: 'Case At Risk', sublabel: 'Consent required before prep', dept: 'OT', icon: Zap, status: 'watch' },
      { entity: 'A. Miller', label: 'Consent Missing', sublabel: 'Surgical consent not signed', dept: 'Admissions', icon: User, status: 'watch' },
    ],
    actions: [
      { label: 'Page Admissions Desk', type: 'primary' },
    ],
    relatedEvents: [
      { time: '08:00', event: 'Patient admitted — pre-op checklist started' },
      { time: '08:30', event: 'Labs submitted, radiology complete' },
      { time: '09:00', event: 'Consent form not yet received from surgical team' },
    ]
  }
];

const ChainNode = ({ node, isLast }) => {
  const statusClass = node.status === 'blocked' ? 'chain-blocked' :
    node.status === 'attention' ? 'chain-attention' :
    node.status === 'root' ? 'chain-root' : 'chain-watch';
  const Icon = node.icon;

  return (
    <div className="chain-step">
      <div className={`chain-node ${statusClass}`}>
        <div className="chain-node-icon">
          <Icon size={14} />
        </div>
        <div className="chain-node-content">
          <div className="chain-node-entity font-mono">{node.entity}</div>
          <div className="chain-node-label">{node.label}</div>
          <div className="chain-node-sublabel">{node.sublabel}</div>
          <span className="chain-node-dept font-mono">{node.dept}</span>
        </div>
      </div>
      {!isLast && (
        <div className={`chain-arrow ${statusClass}`}>
          <ArrowRight size={14} />
          <span className="arrow-label">caused by</span>
        </div>
      )}
    </div>
  );
};

const BottleneckCard = ({ bottleneck }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const sevClass = bottleneck.severity === 'critical' ? 'bn-critical' :
    bottleneck.severity === 'warning' ? 'bn-warning' : 'bn-info';

  return (
    <div className={`bottleneck-card ${sevClass}`}>
      <div className="bn-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="bn-severity-indicator">
          <AlertTriangle size={14} />
        </div>
        <div className="bn-header-content">
          <div className="bn-title">{bottleneck.title}</div>
          <div className="bn-impact-row">
            <span className="bn-impact">{bottleneck.impact}</span>
            <span className="bn-time-badge font-mono">
              <Clock size={10} />
              {bottleneck.timeBlocked}
            </span>
            <span className={`bn-impact-badge font-mono impact-${bottleneck.impactScore.toLowerCase()}`}>
              {bottleneck.impactScore} Impact
            </span>
          </div>
        </div>
        <button className="bn-expand-btn" type="button">
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Causal Chain — always visible */}
      <div className="bn-causal-chain">
        {bottleneck.chain.map((node, idx) => (
          <ChainNode key={idx} node={node} isLast={idx === bottleneck.chain.length - 1} />
        ))}
      </div>

      {/* Actions */}
      <div className="bn-actions">
        {bottleneck.actions.map((action, idx) => (
          <button key={idx} className={`bn-action-btn bn-action-${action.type}`} type="button">
            {action.label}
          </button>
        ))}
      </div>

      {/* Expanded: Related Events Timeline */}
      {isExpanded && (
        <div className="bn-events-section">
          <div className="bn-events-title font-mono">Correlated Events</div>
          <div className="bn-events-list">
            {bottleneck.relatedEvents.map((evt, idx) => (
              <div key={idx} className="bn-event-item">
                <span className="bn-event-time font-mono">{evt.time}</span>
                <span className="bn-event-dot" />
                <span className="bn-event-text">{evt.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const BottleneckRadar = () => {
  const criticalCount = BOTTLENECKS.filter(b => b.severity === 'critical').length;
  const warningCount = BOTTLENECKS.filter(b => b.severity === 'warning').length;

  return (
    <div className="bottleneck-radar">
      <div className="bn-page-header">
        <div className="bn-header-left">
          <h2 className="bn-page-title">Bottleneck Radar</h2>
          <p className="bn-page-subtitle">What's stuck, why, and what to do about it.</p>
        </div>
        <div className="bn-header-stats">
          <div className="bn-stat bn-stat-critical">
            <span className="bn-stat-number">{criticalCount}</span>
            <span className="bn-stat-label">Critical</span>
          </div>
          <div className="bn-stat bn-stat-warning">
            <span className="bn-stat-number">{warningCount}</span>
            <span className="bn-stat-label">Warnings</span>
          </div>
          <div className="bn-stat bn-stat-total">
            <span className="bn-stat-number">{BOTTLENECKS.length}</span>
            <span className="bn-stat-label">Active</span>
          </div>
        </div>
      </div>

      <div className="bn-list">
        {BOTTLENECKS.map(bn => (
          <BottleneckCard key={bn.id} bottleneck={bn} />
        ))}
      </div>
    </div>
  );
};
