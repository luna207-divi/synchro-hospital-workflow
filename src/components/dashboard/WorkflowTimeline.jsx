import React, { useState } from 'react';
import { 
  UserCheck, 
  Activity, 
  PackageCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Filter,
  Layers
} from 'lucide-react';
import { Badge } from '../common/Badge';
import './WorkflowTimeline.css';

/**
 * Recent Workflow Events Component
 * Chronological multi-department live feed linking Admissions, OT, and CSSD.
 */
export const WorkflowTimeline = () => {
  const [filterDept, setFilterDept] = useState('ALL');

  const events = [
    {
      id: 'EVT-481',
      time: '11:42 AM',
      dept: 'CSSD',
      deptPillar: 'teal',
      icon: PackageCheck,
      title: 'Tray #CSSD-CV-01 Verified Sterile for OT-04',
      entityId: 'RFID #9921-CV',
      status: 'completed',
      statusLabel: 'Sterile Passed',
      details: 'Dual-biological indicator passed 134°C steam validation. Delivered to OT Suite 04 sterile core by Technician S. Rao.'
    },
    {
      id: 'EVT-480',
      time: '11:35 AM',
      dept: 'OT',
      deptPillar: 'indigo',
      icon: Activity,
      title: 'OT-01 Surgery Milestone: Prosthesis Implantation',
      entityId: 'Case #1048 (R. Vance)',
      status: 'in-progress',
      statusLabel: 'Milestone Met',
      details: 'Dr. Miller completed femoral reaming. Cup positioning optimal. Anticipated skin closure in 35 mins.'
    },
    {
      id: 'EVT-479',
      time: '11:20 AM',
      dept: 'Admissions',
      deptPillar: 'blue',
      icon: UserCheck,
      title: 'Patient Transfer Dispatched: Elena Rostova',
      entityId: 'MRN-9204',
      status: 'in-progress',
      statusLabel: 'En Route',
      details: 'Porter dispatched from Pre-Op Bay 4 to OT-02 holding zone with full clinical chart and IV access verified.'
    },
    {
      id: 'EVT-478',
      time: '11:05 AM',
      dept: 'CSSD',
      deptPillar: 'teal',
      icon: PackageCheck,
      title: 'AI Delay Alert Triggered on Chamber #02',
      entityId: 'Tray #CSSD-ORTHO-09',
      status: 'warning',
      statusLabel: 'Delay Hold',
      details: 'Sterilization cycle completed with 14m extended aeration cooldown. OT-03 coordinator notified to delay patient pre-op induction.'
    },
    {
      id: 'EVT-477',
      time: '10:48 AM',
      dept: 'OT',
      deptPillar: 'indigo',
      icon: Activity,
      title: 'OT-04 Rapid Turnover Completed in 18 Minutes',
      entityId: 'Suite OT-04',
      status: 'completed',
      statusLabel: 'Benchmark +7m',
      details: 'Environmental sanitation, surface disinfection, and sterile field setup verified by Nursing Lead J. Doe.'
    },
    {
      id: 'EVT-476',
      time: '10:30 AM',
      dept: 'Admissions',
      deptPillar: 'blue',
      icon: UserCheck,
      title: 'Pre-Op Checklist 100% Completed: Sarah Jenkins',
      entityId: 'MRN-7741',
      status: 'completed',
      statusLabel: 'Cleared',
      details: 'Anesthesia risk evaluation (ASA-II), surgical marking, and consent dual-sign completed for 11:30 AM TKA procedure.'
    }
  ];

  const filteredEvents = events.filter(e => {
    if (filterDept === 'ALL') return true;
    return e.dept.toUpperCase() === filterDept;
  });

  return (
    <div className="ot-workflow-events-card ot-card">
      <div className="events-card-header">
        <div className="events-title-side">
          <div className="events-title-row">
            <h3 className="events-heading font-display">Recent Workflow Events</h3>
            <span className="live-stream-badge font-mono">LIVE FEED</span>
          </div>
          <span className="events-subhead">
            Cross-department operational milestones linking Admissions, Theatres, and CSSD Sterilization
          </span>
        </div>

        <div className="events-dept-filter">
          {['ALL', 'ADMISSIONS', 'OT', 'CSSD'].map((dept) => (
            <button
              key={dept}
              className={`dept-filter-btn ${filterDept === dept ? 'is-active' : ''}`}
              onClick={() => setFilterDept(dept)}
              type="button"
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      <div className="events-timeline-body">
        {filteredEvents.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div key={evt.id} className="timeline-event-row">
              {/* Time Column */}
              <div className="event-time-col">
                <span className="event-time font-mono">{evt.time}</span>
                <span className="event-id font-mono">{evt.id}</span>
              </div>

              {/* Node / Department Icon */}
              <div className="event-node-col">
                <div className={`event-icon-box box-${evt.deptPillar}`}>
                  <Icon size={14} />
                </div>
                {idx < filteredEvents.length - 1 && <div className="event-connector-line" />}
              </div>

              {/* Event Content */}
              <div className="event-content-col">
                <div className="event-header-line">
                  <span className="event-title">{evt.title}</span>
                  <Badge variant={evt.deptPillar} size="xs">{evt.dept}</Badge>
                  <span className="event-entity-id font-mono">{evt.entityId}</span>
                  <span className={`event-status-tag status-${evt.status} font-mono`}>
                    {evt.statusLabel}
                  </span>
                </div>
                <p className="event-description">{evt.details}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
