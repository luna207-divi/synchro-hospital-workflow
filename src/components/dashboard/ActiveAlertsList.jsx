import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './ActiveAlertsList.css';

/**
 * Active Alerts Component for Hospital Operations
 */
export const ActiveAlertsList = () => {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'warning'
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-101',
      title: 'OT-03 may be delayed',
      severity: 'critical',
      time: '4 mins ago',
      department: 'Operating Theatres',
      deptCode: 'OT',
      deptPillar: 'indigo',
      description: 'Case #1050 (Marcus Chen - ACL Reconstruction) start projected 22m late due to CSSD sterile tray cooldown hold.',
      actionLabel: 'Reroute Sterile Tray',
      actionExecuted: false
    },
    {
      id: 'ALT-102',
      title: 'CSSD-00125 instrument pack unavailable',
      severity: 'critical',
      time: '12 mins ago',
      department: 'CSSD Sterilization',
      deptCode: 'CSSD',
      deptPillar: 'teal',
      description: 'Orthopedic Power Tool Set #04 in autoclave cooling phase. Reserve Tray #99-B available in Central Sterile Vault.',
      actionLabel: 'Expedite Reserve',
      actionExecuted: false
    },
    {
      id: 'ALT-103',
      title: 'Patient P-1024 transfer pending',
      severity: 'warning',
      time: '18 mins ago',
      department: 'Admissions & Pre-Op',
      deptCode: 'ADM',
      deptPillar: 'blue',
      description: 'Patient P-1024 transfer from Pre-Op Bay 3 to OT-02 holding area awaiting porter dispatch confirmation.',
      actionLabel: 'Ping Transport',
      actionExecuted: false
    },
    {
      id: 'ALT-104',
      title: 'Consent missing for scheduled procedure',
      severity: 'warning',
      time: '25 mins ago',
      department: 'Admissions & Pre-Op',
      deptCode: 'ADM',
      deptPillar: 'blue',
      description: 'Patient P-1029 (OT-04 upcoming 11:30 AM) informed surgical consent form not signed in EMR chart.',
      actionLabel: 'Request e-Sign',
      actionExecuted: false
    }
  ]);

  const handleAction = (id, label) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, actionExecuted: true } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  return (
    <div className="ot-active-alerts-card ot-card">
      <div className="alerts-card-header">
        <div className="alerts-title-side">
          <div className="alerts-title-row">
            <h3 className="alerts-heading font-display">Active Bottleneck Alerts</h3>
            <span className="alerts-count-tag font-mono">{alerts.filter(a => !a.actionExecuted).length} ACTIVE</span>
          </div>
          <span className="alerts-subhead">Live clinical delay triggers requiring coordinator intervention</span>
        </div>

        <div className="alerts-filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
            type="button"
          >
            All ({alerts.length})
          </button>
          <button
            className={`filter-tab ${filter === 'critical' ? 'is-active' : ''}`}
            onClick={() => setFilter('critical')}
            type="button"
          >
            Critical (2)
          </button>
          <button
            className={`filter-tab ${filter === 'warning' ? 'is-active' : ''}`}
            onClick={() => setFilter('warning')}
            type="button"
          >
            Warnings (2)
          </button>
        </div>
      </div>

      <div className="alerts-list-container">
        {filteredAlerts.map((item) => (
          <div key={item.id} className={`alert-row-item severity-border-${item.severity}`}>
            <div className="alert-row-left">
              <div className={`alert-icon-indicator indicator-${item.severity}`}>
                {item.severity === 'critical' ? (
                  <AlertOctagon size={16} />
                ) : (
                  <AlertTriangle size={16} />
                )}
              </div>

              <div className="alert-row-content">
                <div className="alert-row-topline">
                  <span className="alert-item-title">{item.title}</span>
                  <Badge variant={item.deptPillar} size="xs">{item.department}</Badge>
                  <span className="alert-timestamp font-mono">{item.time}</span>
                </div>
                <p className="alert-item-desc">{item.description}</p>
              </div>
            </div>

            <div className="alert-row-action">
              {item.actionExecuted ? (
                <span className="action-resolved-badge font-mono">
                  <Check size={12} /> Dispatched
                </span>
              ) : (
                <Button
                  size="xs"
                  variant={item.severity === 'critical' ? 'danger' : 'secondary'}
                  onClick={() => handleAction(item.id, item.actionLabel)}
                  iconRight={ChevronRight}
                >
                  {item.actionLabel}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
