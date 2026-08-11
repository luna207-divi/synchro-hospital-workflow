import React from 'react';
import { 
  UserCheck, 
  Activity, 
  PackageCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  MoreVertical,
  Stethoscope
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import './LiveOTGrid.css';

/**
 * Live Operating Theatres Grid Component
 * Displays real-time theatre operational cards for OT-01, OT-02, OT-03, OT-04.
 * Statuses:
 * - 'on-track' (green)
 * - 'attention' (amber)
 * - 'delayed' (red)
 * - 'available' (blue/gray)
 */
export const LiveOTGrid = ({ onSelectOT }) => {
  const theatreData = [
    {
      id: 'OT-01',
      name: 'OT Suite 01',
      specialty: 'Orthopedics & Joint',
      status: 'on-track',
      statusLabel: 'On Track',
      patient: 'Robert Vance',
      patientMRN: 'MRN-8419',
      procedure: 'Total Hip Arthroplasty (Right)',
      surgeon: 'Dr. A. Miller, MD',
      stage: 'Incision & Implant Placement',
      stageNumber: '3 of 5',
      scheduledTime: '08:30 - 11:00 AM',
      elapsedTime: '1h 45m',
      totalEstimated: '2h 30m',
      progressPercent: 70,
      triad: {
        patient: 'ready',
        staff: 'ready',
        cssd: 'ready'
      },
      trayId: 'CSSD-TH-04 (Verified Sterile)'
    },
    {
      id: 'OT-02',
      name: 'OT Suite 02',
      specialty: 'General & Laparoscopic',
      status: 'attention',
      statusLabel: 'Attention Required',
      patient: 'Elena Rostova',
      patientMRN: 'MRN-9204',
      procedure: 'Laparoscopic Cholecystectomy',
      surgeon: 'Dr. K. Patel, MD',
      stage: 'Pre-Op Anesthesia Induction',
      stageNumber: '2 of 5',
      scheduledTime: '09:15 - 11:45 AM',
      elapsedTime: '25m',
      totalEstimated: '2h 30m',
      progressPercent: 20,
      attentionNote: 'Coagulation lab results flagged for secondary anesthesia sign-off',
      triad: {
        patient: 'pending',
        staff: 'ready',
        cssd: 'ready'
      },
      trayId: 'CSSD-LAP-12 (Ready in Holding)'
    },
    {
      id: 'OT-03',
      name: 'OT Suite 03',
      specialty: 'Sports Medicine & Arthroscopy',
      status: 'delayed',
      statusLabel: 'Delayed (+22m)',
      patient: 'Marcus Chen',
      patientMRN: 'MRN-3318',
      procedure: 'Anterior Cruciate Ligament (ACL) Recon',
      surgeon: 'Dr. J. Gomez, MD',
      stage: 'Sterile Pack Reprocessing Hold',
      stageNumber: '1 of 5',
      scheduledTime: '10:00 - 12:30 PM',
      elapsedTime: '+22m Delay',
      totalEstimated: '2h 30m',
      progressPercent: 8,
      delayReason: 'Autoclave #2 pack cooldown hold. Reserve Tray #99-B en route from CSSD.',
      triad: {
        patient: 'ready',
        staff: 'ready',
        cssd: 'delayed'
      },
      trayId: 'CSSD-ORTHO-09 (Cooling Phase)'
    },
    {
      id: 'OT-04',
      name: 'OT Suite 04',
      specialty: 'Cardiovascular Surgery',
      status: 'available',
      statusLabel: 'Available / Prepped',
      patient: 'Sarah Jenkins',
      patientMRN: 'MRN-7741',
      procedure: 'Next: Total Knee Arthroplasty (TKA)',
      surgeon: 'Dr. R. Sharma, MD',
      stage: 'Room Sanitation Complete • Sterile Prepped',
      stageNumber: 'Turnover Complete',
      scheduledTime: 'Next Case: 11:30 AM',
      elapsedTime: 'Ready in 15m',
      totalEstimated: 'Turnover: 18m',
      progressPercent: 100,
      triad: {
        patient: 'ready',
        staff: 'ready',
        cssd: 'ready'
      },
      trayId: 'CSSD-CV-01 (Verified in Room)'
    }
  ];

  return (
    <div className="ot-theatres-section">
      <div className="theatres-section-header">
        <div className="theatres-title-group">
          <div className="theatres-title-row">
            <h2 className="theatres-main-title font-display">Live Operating Theatres</h2>
            <Badge variant="teal" size="sm" dot>4 Suites Connected</Badge>
          </div>
          <p className="theatres-sub-title">
            Real-time telemetry showing patient readiness, sterile pack verification, and surgical workflow progress.
          </p>
        </div>

        <div className="theatres-header-actions">
          <div className="status-legend">
            <span className="legend-pill status-on-track"><span className="legend-dot" /> On Track</span>
            <span className="legend-pill status-attention"><span className="legend-dot" /> Attention</span>
            <span className="legend-pill status-delayed"><span className="legend-dot" /> Delayed</span>
            <span className="legend-pill status-available"><span className="legend-dot" /> Available</span>
          </div>
        </div>
      </div>

      <div className="theatres-cards-grid">
        {theatreData.map((ot) => {
          return (
            <div key={ot.id} className={`theatre-card ot-card status-border-${ot.status}`}>
              {/* Top Card Bar */}
              <div className="theatre-card-topbar">
                <div className="theatre-id-group">
                  <span className="theatre-id font-display">{ot.id}</span>
                  <span className="theatre-specialty">{ot.specialty}</span>
                </div>
                <div className={`theatre-status-badge badge-${ot.status}`}>
                  {ot.status === 'on-track' && <CheckCircle2 size={11} />}
                  {ot.status === 'attention' && <AlertTriangle size={11} />}
                  {ot.status === 'delayed' && <AlertTriangle size={11} />}
                  {ot.status === 'available' && <CheckCircle2 size={11} />}
                  <span>{ot.statusLabel}</span>
                </div>
              </div>

              {/* Patient & Procedure Info */}
              <div className="theatre-patient-block">
                <div className="patient-name-row">
                  <span className="patient-name font-display">{ot.patient}</span>
                  <span className="patient-mrn font-mono">{ot.patientMRN}</span>
                </div>
                <div className="patient-procedure-row">
                  <span className="procedure-title">{ot.procedure}</span>
                  <span className="surgeon-name font-mono">{ot.surgeon}</span>
                </div>
              </div>

              {/* Workflow Stage & Progress */}
              <div className="theatre-stage-block">
                <div className="stage-meta-row">
                  <span className="stage-label font-mono">STAGE: {ot.stage}</span>
                  <span className="stage-count font-mono">{ot.stageNumber}</span>
                </div>

                <div className="stage-progress-track">
                  <div 
                    className={`stage-progress-fill fill-${ot.status}`}
                    style={{ width: `${ot.progressPercent}%` }}
                  />
                </div>

                <div className="stage-timing-row">
                  <div className="timing-item">
                    <Clock size={11} className="timing-icon" />
                    <span className="timing-text font-mono">{ot.scheduledTime}</span>
                  </div>
                  <div className="timing-item">
                    <span className="elapsed-tag font-mono">Elapsed: <strong>{ot.elapsedTime}</strong></span>
                  </div>
                </div>
              </div>

              {/* Triad Verification Strip */}
              <div className="theatre-triad-strip">
                <div className="triad-item">
                  <UserCheck size={12} className={`triad-icon ${ot.triad.patient === 'ready' ? 'text-teal' : 'text-amber'}`} />
                  <span className="triad-label">Patient</span>
                </div>
                <span className="triad-sep">•</span>
                <div className="triad-item">
                  <Activity size={12} className={`triad-icon ${ot.triad.staff === 'ready' ? 'text-teal' : 'text-amber'}`} />
                  <span className="triad-label">OT Ready</span>
                </div>
                <span className="triad-sep">•</span>
                <div className="triad-item">
                  <PackageCheck size={12} className={`triad-icon ${ot.triad.cssd === 'ready' ? 'text-teal' : ot.triad.cssd === 'pending' ? 'text-amber' : 'text-red'}`} />
                  <span className="triad-label">CSSD Pack</span>
                </div>
              </div>

              {/* Context Note (Delay reason or attention banner) */}
              {ot.delayReason && (
                <div className="theatre-alert-note note-red">
                  <AlertTriangle size={12} className="note-icon" />
                  <span className="note-text">{ot.delayReason}</span>
                </div>
              )}

              {ot.attentionNote && (
                <div className="theatre-alert-note note-amber">
                  <AlertTriangle size={12} className="note-icon" />
                  <span className="note-text">{ot.attentionNote}</span>
                </div>
              )}

              {/* Card Footer / Action */}
              <div className="theatre-card-footer">
                <span className="tray-rfid font-mono">{ot.trayId}</span>
                <Button 
                  size="xs" 
                  variant="secondary" 
                  iconRight={ChevronRight}
                  onClick={() => onSelectOT && onSelectOT(ot)}
                >
                  Suite Details
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
