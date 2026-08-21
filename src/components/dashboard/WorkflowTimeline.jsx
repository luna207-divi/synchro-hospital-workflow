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
  Layers,
  Zap,
  CreditCard
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import './WorkflowTimeline.css';

/**
 * Recent Workflow Events Component (Single Source of Truth Live Stream)
 * Chronological multi-department live feed linking Admissions, OT, CSSD, Doctor, and Billing.
 */
export const WorkflowTimeline = () => {
  const [filterDept, setFilterDept] = useState('ALL');
  const { events: liveEvents } = useWorkflowEngine();

  const defaultEvents = [
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
      details: 'Dual-biological indicator passed 134°C steam validation. Delivered to OT Suite 04 sterile core.'
    },
    {
      id: 'EVT-480',
      time: '11:35 AM',
      dept: 'OT',
      deptPillar: 'indigo',
      icon: Activity,
      title: 'OT-01 Surgery Milestone: Prosthesis Implantation',
      entityId: 'Case #1048',
      status: 'in-progress',
      statusLabel: 'Milestone Met',
      details: 'Surgeon completed femoral reaming. Cup positioning optimal. Skin closure in progress.'
    },
    {
      id: 'EVT-479',
      time: '11:20 AM',
      dept: 'FRONT_DESK',
      deptPillar: 'blue',
      icon: UserCheck,
      title: 'Patient Transfer Dispatched: Elena Rostova',
      entityId: 'MRN-9204',
      status: 'in-progress',
      statusLabel: 'En Route',
      details: 'Porter dispatched from Pre-Op Bay 4 to OT-02 holding zone with clinical chart verified.'
    }
  ];

  // Map live workflow engine events to UI presentation format
  const mappedLiveEvents = liveEvents.map(evt => {
    const timeStr = evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now';
    let deptPillar = 'blue';
    let icon = Activity;
    let title = evt.event_type;

    if (evt.department === 'CSSD') {
      deptPillar = 'teal';
      icon = PackageCheck;
    } else if (evt.department === 'OT' || evt.department === 'DOCTOR') {
      deptPillar = 'indigo';
      icon = Activity;
    } else if (evt.department === 'FRONT_DESK' || evt.department === 'NURSING') {
      deptPillar = 'blue';
      icon = UserCheck;
    } else if (evt.department === 'BILLING') {
      deptPillar = 'purple';
      icon = CreditCard;
    }

    if (evt.event_type === 'INSTRUMENT_READY') {
      title = 'OT Instrument Ready — Pack Dispatched to OT';
    } else if (evt.event_type === 'SURGERY_STARTED') {
      title = 'Surgery Started — In Progress';
    } else if (evt.event_type === 'SURGERY_COMPLETED') {
      title = 'Surgery Completed — Turnover Started';
    } else if (evt.event_type === 'PATIENT_REGISTERED') {
      title = 'Patient Registered via Front Desk';
    } else if (evt.event_type === 'PATIENT_ADMITTED') {
      title = 'Patient Admitted to Pre-Op Ward';
    } else if (evt.event_type === 'BILLING_CHARGE_CREATED') {
      title = 'Billing Procedure Charge Auto-Generated';
    }

    return {
      id: evt.event_id,
      time: timeStr,
      dept: evt.department || 'SYSTEM',
      deptPillar,
      icon,
      title,
      entityId: evt.surgery_id ? `Surgery: ${evt.surgery_id.slice(0, 8)}` : evt.patient_id ? `Patient: ${evt.patient_id.slice(0, 8)}` : 'System Event',
      status: 'completed',
      statusLabel: evt.new_status || 'Processed',
      details: evt.metadata?.notes || evt.metadata?.description || `Transition: ${evt.previous_status || 'INIT'} → ${evt.new_status || 'COMPLETED'}`
    };
  });

  const combinedEvents = [...mappedLiveEvents, ...defaultEvents].filter((evt, idx, self) => 
    idx === self.findIndex((e) => e.id === evt.id)
  );

  const filteredEvents = combinedEvents.filter(e => {
    if (filterDept === 'ALL') return true;
    if (filterDept === 'ADMISSIONS' && (e.dept === 'FRONT_DESK' || e.dept === 'NURSING')) return true;
    return e.dept.toUpperCase() === filterDept;
  });

  return (
    <div className="ot-workflow-events-card ot-card">
      <div className="events-card-header">
        <div className="events-title-side">
          <div className="events-title-row">
            <h3 className="events-heading font-display">Recent Workflow Events</h3>
            <span className="live-stream-badge font-mono">LIVE REALTIME ENGINE</span>
          </div>
          <span className="events-subhead">
            Cross-department operational milestones linking Front Desk, Nursing, Doctor, CSSD, and Billing
          </span>
        </div>

        <div className="events-dept-filter">
          {['ALL', 'ADMISSIONS', 'OT', 'CSSD', 'BILLING'].map((dept) => (
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
                <span className="event-id font-mono">{evt.id.slice(0, 10)}</span>
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
