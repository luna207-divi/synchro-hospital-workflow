import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  Activity, 
  UserCheck, 
  PackageCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  Plus, 
  Filter, 
  Layers,
  Sparkles,
  Stethoscope,
  Maximize2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { OTPerformanceSidebar } from './OTPerformanceSidebar';
import { OTSuiteDrawer } from './OTSuiteDrawer';
import './TheatresPage.css';

export const TheatresPage = () => {
  const [selectedSuite, setSelectedSuite] = useState(null);

  const stagesList = [
    'Patient Ready',
    'Preparation',
    'Procedure Started',
    'Procedure In Progress',
    'Procedure Completed',
    'Cleaning / Turnover',
    'Ready'
  ];

  const [theatres, setTheatres] = useState([
    {
      id: 'OT-01',
      name: 'OT Suite 01',
      specialty: 'Orthopedics & Joint Replacement',
      status: 'In Surgery',
      statusType: 'on-track',
      statusLabel: 'On Track (In Surgery)',
      patient: 'Robert Vance',
      patientMRN: 'MRN-8419',
      procedure: 'Total Hip Arthroplasty (Right)',
      surgeon: 'Dr. A. Miller, MD',
      anesthesiologist: 'Dr. M. Chen, MD',
      scheduledStart: '08:30 AM',
      actualStart: '08:35 AM',
      elapsedTime: '1h 45m',
      expectedCompletion: '11:00 AM',
      currentStageIdx: 3, // 'Procedure In Progress'
      progressPercent: 70,
      trayId: 'CSSD-TH-04 (Verified Sterile)',
      triad: { patient: 'ready', staff: 'ready', cssd: 'ready' }
    },
    {
      id: 'OT-02',
      name: 'OT Suite 02',
      specialty: 'General & Laparoscopic Surgery',
      status: 'Preparation',
      statusType: 'attention',
      statusLabel: 'Attention (Prep)',
      patient: 'Elena Rostova',
      patientMRN: 'MRN-9204',
      procedure: 'Laparoscopic Cholecystectomy',
      surgeon: 'Dr. K. Patel, MD',
      anesthesiologist: 'Dr. S. Nair, MD',
      scheduledStart: '09:15 AM',
      actualStart: '09:30 AM (+15m)',
      elapsedTime: '25m',
      expectedCompletion: '11:45 AM',
      currentStageIdx: 1, // 'Preparation'
      progressPercent: 25,
      attentionNote: 'Coagulation lab result flagged for secondary anesthesia sign-off',
      trayId: 'CSSD-LAP-12 (Ready in Holding)',
      triad: { patient: 'pending', staff: 'ready', cssd: 'ready' }
    },
    {
      id: 'OT-03',
      name: 'OT Suite 03',
      specialty: 'Sports Medicine & Arthroscopy',
      status: 'Delayed Hold',
      statusType: 'delayed',
      statusLabel: 'Delayed (+22m)',
      patient: 'Marcus Chen',
      patientMRN: 'MRN-3318',
      procedure: 'Anterior Cruciate Ligament (ACL) Recon',
      surgeon: 'Dr. J. Gomez, MD',
      anesthesiologist: 'Dr. L. Zhang, MD',
      scheduledStart: '10:00 AM',
      actualStart: 'Awaiting Sterile Release',
      elapsedTime: '+22m Delay',
      expectedCompletion: '12:30 PM',
      currentStageIdx: 0, // 'Patient Ready'
      progressPercent: 10,
      delayReason: 'Autoclave #2 pack cooldown hold. Reserve Tray #99-B en route from CSSD.',
      trayId: 'CSSD-ORTHO-09 (Cooling Phase)',
      triad: { patient: 'ready', staff: 'ready', cssd: 'delayed' }
    },
    {
      id: 'OT-04',
      name: 'OT Suite 04',
      specialty: 'Cardiovascular & Thoracic Surgery',
      status: 'Turnover Complete',
      statusType: 'available',
      statusLabel: 'Available / Prepped',
      patient: 'Sarah Jenkins',
      patientMRN: 'MRN-7741',
      procedure: 'Next: Total Knee Arthroplasty (TKA)',
      surgeon: 'Dr. R. Sharma, MD',
      anesthesiologist: 'Dr. K. Patel, MD',
      scheduledStart: '11:30 AM',
      actualStart: 'Turnover Finished 10:48 AM',
      elapsedTime: 'Ready for Patient (15m)',
      expectedCompletion: '01:45 PM',
      currentStageIdx: 6, // 'Ready'
      progressPercent: 100,
      trayId: 'CSSD-CV-01 (Verified in Room)',
      triad: { patient: 'ready', staff: 'ready', cssd: 'ready' }
    }
  ]);

  const handleAdvanceStage = (id, newStage) => {
    setTheatres(prev => prev.map(t => {
      if (t.id === id) {
        const nextIdx = Math.min(t.currentStageIdx + 1, stagesList.length - 1);
        return {
          ...t,
          currentStageIdx: nextIdx,
          progressPercent: Math.round(((nextIdx + 1) / stagesList.length) * 100)
        };
      }
      return t;
    }));
  };

  return (
    <div className="ot-theatres-page">
      {/* 1. Top Header */}
      <div className="theatres-page-header">
        <div className="theatres-header-left">
          <div className="theatres-header-title-row">
            <h1 className="theatres-title font-display">Operating Theatres</h1>
            <Badge variant="teal" size="sm" dot>4 Active Suites Connected</Badge>
          </div>
          <p className="theatres-subtitle">
            Real-time theatre command board tracking surgical stages, timing variances, team rosters, and turnaround efficiency.
          </p>
        </div>

        <div className="theatres-header-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Sync OT Sensors
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export Case Log
          </Button>
          <Button size="sm" variant="primary" icon={Plus}>
            Add Add-On Case
          </Button>
        </div>
      </div>

      {/* 2. Main Layout Frame: 4 Large OT Cards on Left + Performance Sidebar on Right */}
      <div className="theatres-layout-grid">
        {/* Left Side: 4 Large Operational Theatre Cards */}
        <div className="theatres-board-list">
          {theatres.map((ot) => {
            const currentStageName = stagesList[ot.currentStageIdx];
            return (
              <div key={ot.id} className={`large-ot-card ot-card border-status-${ot.statusType}`}>
                {/* Card Top Strip */}
                <div className="card-top-strip">
                  <div className="ot-badge-group">
                    <div className="ot-id-banner font-display">{ot.id}</div>
                    <div className="ot-name-meta">
                      <h3 className="ot-suite-heading font-display">{ot.name}</h3>
                      <span className="ot-specialty-text">{ot.specialty}</span>
                    </div>
                  </div>

                  <div className={`ot-status-badge badge-${ot.statusType}`}>
                    {ot.statusType === 'on-track' && <CheckCircle2 size={12} />}
                    {ot.statusType === 'attention' && <AlertTriangle size={12} />}
                    {ot.statusType === 'delayed' && <AlertTriangle size={12} />}
                    {ot.statusType === 'available' && <CheckCircle2 size={12} />}
                    <span>{ot.statusLabel}</span>
                  </div>
                </div>

                {/* Patient & Surgical Metadata Grid */}
                <div className="ot-surgical-meta-grid">
                  <div className="meta-col">
                    <span className="meta-label font-mono">CURRENT PATIENT</span>
                    <span className="meta-patient font-display">{ot.patient}</span>
                    <span className="meta-mrn font-mono">{ot.patientMRN}</span>
                  </div>

                  <div className="meta-col">
                    <span className="meta-label font-mono">PROCEDURE</span>
                    <span className="meta-procedure">{ot.procedure}</span>
                  </div>

                  <div className="meta-col">
                    <span className="meta-label font-mono">ATTENDING SURGEON</span>
                    <div className="meta-surgeon-row">
                      <Stethoscope size={13} className="text-indigo" />
                      <span className="meta-surgeon font-display">{ot.surgeon}</span>
                    </div>
                  </div>
                </div>

                {/* Standardized 7-Stage Workflow Stepper */}
                <div className="ot-stage-stepper-box">
                  <div className="stepper-stage-title-line">
                    <span className="stage-active-name font-mono">
                      CURRENT STAGE: <strong>{currentStageName}</strong> (Stage {ot.currentStageIdx + 1} of 7)
                    </span>
                    <span className="stage-percent font-mono">{ot.progressPercent}% Completed</span>
                  </div>

                  {/* Progress Bar & Stage Nodes */}
                  <div className="stepper-visual-track">
                    <div 
                      className={`stepper-fill fill-${ot.statusType}`} 
                      style={{ width: `${((ot.currentStageIdx + 0.5) / stagesList.length) * 100}%` }}
                    />
                    <div className="stage-nodes-flex">
                      {stagesList.map((stg, i) => {
                        const isDone = i < ot.currentStageIdx;
                        const isCurrent = i === ot.currentStageIdx;
                        return (
                          <div 
                            key={stg} 
                            className={`stage-tick-node ${isDone ? 'is-done' : isCurrent ? 'is-current' : 'is-upcoming'}`}
                            title={stg}
                          >
                            <span className="tick-dot" />
                            <span className="tick-label">{stg}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Timing Telemetry Strip */}
                <div className="ot-timing-telemetry-row font-mono">
                  <div className="telemetry-pill">
                    <span className="tel-label">SCHED START</span>
                    <span className="tel-val">{ot.scheduledStart}</span>
                  </div>
                  <div className="telemetry-pill">
                    <span className="tel-label">ACTUAL START</span>
                    <span className="tel-val">{ot.actualStart}</span>
                  </div>
                  <div className="telemetry-pill tel-highlight">
                    <span className="tel-label">ELAPSED TIME</span>
                    <span className="tel-val text-primary font-bold">{ot.elapsedTime}</span>
                  </div>
                  <div className="telemetry-pill">
                    <span className="tel-label">EXPECTED COMPLETION</span>
                    <span className="tel-val">{ot.expectedCompletion}</span>
                  </div>
                </div>

                {/* Delay / Attention Alert Note if active */}
                {ot.delayReason && (
                  <div className="ot-card-note note-red font-mono">
                    <AlertTriangle size={13} className="text-red flex-shrink-0" />
                    <span>{ot.delayReason}</span>
                  </div>
                )}

                {ot.attentionNote && (
                  <div className="ot-card-note note-amber font-mono">
                    <AlertTriangle size={13} className="text-amber flex-shrink-0" />
                    <span>{ot.attentionNote}</span>
                  </div>
                )}

                {/* Card Action Footer */}
                <div className="large-ot-card-footer">
                  <div className="footer-triad-pills font-mono">
                    <span className="pack-rfid-pill">{ot.trayId}</span>
                  </div>

                  <div className="footer-action-buttons">
                    <Button
                      size="sm"
                      variant="primary"
                      iconRight={ChevronRight}
                      onClick={() => setSelectedSuite(ot)}
                    >
                      View OT Details
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: OT Performance Panel */}
        <OTPerformanceSidebar />
      </div>

      {/* 3. Detailed OT Suite Drawer */}
      {selectedSuite && (
        <OTSuiteDrawer
          suite={selectedSuite}
          onClose={() => setSelectedSuite(null)}
          onAdvanceStage={handleAdvanceStage}
        />
      )}
    </div>
  );
};
