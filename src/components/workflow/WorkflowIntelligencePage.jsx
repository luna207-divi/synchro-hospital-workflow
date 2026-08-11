import React, { useState } from 'react';
import { 
  GitMerge, 
  Sparkles, 
  Activity, 
  UserCheck, 
  PackageCheck, 
  Building2, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw, 
  Download, 
  ArrowDown, 
  ChevronRight, 
  Layers, 
  Cpu,
  Radio,
  Zap
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { WhyDelayedModal } from './WhyDelayedModal';
import './WorkflowIntelligencePage.css';

export const WorkflowIntelligencePage = () => {
  const [selectedCaseId, setSelectedCaseId] = useState('P-1024');
  const [selectedBottleneck, setSelectedBottleneck] = useState(null);
  const [isWhyDelayedOpen, setIsWhyDelayedOpen] = useState(false);

  // Cross-department sequential connected timeline events matching prompt
  const timelineCases = {
    'P-1024': {
      patientName: 'Elena Rostova',
      mrn: 'MRN-9204',
      procedure: 'Total Knee Replacement (Left)',
      otSuite: 'OT-02',
      surgeon: 'Dr. K. Patel, MD',
      events: [
        {
          id: 1,
          event: 'Patient P-1024 Admitted',
          department: 'Admissions',
          deptPillar: 'blue',
          timestamp: '07:30 AM',
          status: 'Completed',
          statusType: 'done',
          source: 'Admissions Desk Terminal #01',
          desc: 'Patient checked in for elective morning arthroplasty.'
        },
        {
          id: 2,
          event: 'Admission Complete',
          department: 'Admissions',
          deptPillar: 'blue',
          timestamp: '08:00 AM',
          status: 'Completed',
          statusType: 'done',
          source: 'EMR Inpatient Intake Module',
          desc: 'Insurance verification and bed assignment to Pre-Op Bay 03 complete.'
        },
        {
          id: 3,
          event: 'Consent Verified',
          department: 'Admissions',
          deptPillar: 'blue',
          timestamp: '08:45 AM',
          status: 'Completed',
          statusType: 'done',
          source: 'Digital e-Sign Tablet #03',
          desc: 'Informed surgical and anesthesia consent signed and verified in chart.'
        },
        {
          id: 4,
          event: 'Pre-op Ready',
          department: 'Admissions',
          deptPillar: 'blue',
          timestamp: '09:20 AM',
          status: 'Completed',
          statusType: 'done',
          source: 'Anesthesia Pre-Op Console',
          desc: 'ASA-II pre-anesthetic risk assessment, vitals, and surgical site marking approved.'
        },
        {
          id: 5,
          event: 'Patient Transfer',
          department: 'Admissions',
          deptPillar: 'blue',
          timestamp: '09:40 AM',
          status: 'Delayed (+12m)',
          statusType: 'delayed',
          source: 'Porter Beacon #14 (Bay 03)',
          desc: 'Porter transport delayed due to radiology priority transfer in 4C.',
          isDelayedNode: true
        },
        {
          id: 6,
          event: 'OT Preparation',
          department: 'OT',
          deptPillar: 'indigo',
          timestamp: '09:45 AM',
          status: 'In Progress',
          statusType: 'current',
          source: 'OT-02 Suite Environmental Sensor',
          desc: 'Circulating nurse & scrub tech prepping room sterile field.'
        },
        {
          id: 7,
          event: 'Instrument Pack Verified',
          department: 'CSSD',
          deptPillar: 'teal',
          timestamp: '10:00 AM',
          status: 'Completed',
          statusType: 'done',
          source: 'RFID Gateway #OT-02',
          desc: 'Tray #CSSD-00125 (TKR Set) scanned into surgical core with valid steam spore strip.'
        },
        {
          id: 8,
          event: 'Procedure Started',
          department: 'OT',
          deptPillar: 'indigo',
          timestamp: '10:15 AM',
          status: 'Scheduled',
          statusType: 'upcoming',
          source: 'Surgical Time-Out Console',
          desc: 'Initial incision and surgical time-out verification.'
        },
        {
          id: 9,
          event: 'Procedure Completed',
          department: 'OT',
          deptPillar: 'indigo',
          timestamp: '11:45 AM',
          status: 'Projected',
          statusType: 'upcoming',
          source: 'PACU Handshake Module',
          desc: 'Surgical dressing applied and patient transfer to PACU.'
        },
        {
          id: 10,
          event: 'OT Turnover',
          department: 'OT',
          deptPillar: 'indigo',
          timestamp: '12:10 PM',
          status: 'Projected',
          statusType: 'upcoming',
          source: 'Sanitation IoT Beacon',
          desc: 'Room terminal cleaning, air cycle purge, and waste disposal.'
        },
        {
          id: 11,
          event: 'OT Ready',
          department: 'OT',
          deptPillar: 'indigo',
          timestamp: '12:35 PM',
          status: 'Projected',
          statusType: 'upcoming',
          source: 'Master Surgical Scheduler',
          desc: 'Suite verified 100% prepped for subsequent case #1027.'
        }
      ]
    }
  };

  const activeTimeline = timelineCases[selectedCaseId] || timelineCases['P-1024'];

  // Workflow Bottlenecks Table Data matching prompt
  const bottlenecks = [
    {
      id: 'BN-1',
      bottleneck: 'CSSD Pack Availability',
      department: 'CSSD',
      deptPillar: 'teal',
      frequency: '5 occurrences',
      avgDelay: '14 min average',
      impact: 'High impact',
      impactLevel: 'high',
      rootCauseSummary: 'Autoclave cooldown cycle PURGE overruns + peak morning batching'
    },
    {
      id: 'BN-2',
      bottleneck: 'Patient Transfer',
      department: 'Admissions',
      deptPillar: 'blue',
      frequency: '4 occurrences',
      avgDelay: '9 min average',
      impact: 'Medium impact',
      impactLevel: 'medium',
      rootCauseSummary: 'Porter dispatch queuing between Ward 4C and Surgical Pre-Op'
    },
    {
      id: 'BN-3',
      bottleneck: 'Documentation & Consent',
      department: 'Admissions',
      deptPillar: 'blue',
      frequency: '3 occurrences',
      avgDelay: '11 min average',
      impact: 'Medium impact',
      impactLevel: 'medium',
      rootCauseSummary: 'Surgeon digital countersignature pending at morning intake'
    },
    {
      id: 'BN-4',
      bottleneck: 'Sanitation & Room Turnover',
      department: 'Operating Theatres',
      deptPillar: 'indigo',
      frequency: '2 occurrences',
      avgDelay: '8 min average',
      impact: 'Low impact',
      impactLevel: 'low',
      rootCauseSummary: 'Aerosolized suction canister disposal protocol lag'
    }
  ];

  const handleOpenWhyDelayed = (bn) => {
    setSelectedBottleneck(bn);
    setIsWhyDelayedOpen(true);
  };

  return (
    <div className="ot-workflow-page">
      {/* 1. Page Header */}
      <div className="workflow-page-header">
        <div className="workflow-title-group">
          <div className="workflow-title-row">
            <h1 className="workflow-heading font-display">Workflow Intelligence</h1>
            <Badge variant="purple" size="sm" dot>Cross-Department Engine Active</Badge>
          </div>
          <p className="workflow-subtitle">
            Visualizing real-time synchronization across Admissions, Operating Theatres, and CSSD to eradicate surgical delays.
          </p>
        </div>

        <div className="workflow-header-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Recalibrate ML Model
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export Telemetry Log
          </Button>
        </div>
      </div>

      {/* 2. Triad Core Concept Banner */}
      <div className="workflow-story-banner ot-card">
        <div className="story-banner-left">
          <div className="story-icon-box">
            <Sparkles size={20} className="text-purple" />
          </div>
          <div className="story-text-group">
            <div className="story-headline font-display">
              Patient Readiness + OT Readiness + CSSD Readiness = Zero Surgical Friction
            </div>
            <div className="story-sub font-mono">
              OTFlow AI correlates real-time telemetry from EMR, RFID tray sensors, and room IoT to identify upstream bottlenecks before incision delay occurs.
            </div>
          </div>
        </div>

        <div className="story-pills-row font-mono">
          <span className="story-pill pill-adm">1. ADMISSIONS</span>
          <span className="story-arrow">→</span>
          <span className="story-pill pill-ot">2. OPERATING THEATRE</span>
          <span className="story-arrow">→</span>
          <span className="story-pill pill-cssd">3. CSSD STERILITY</span>
        </div>
      </div>

      {/* 3. Main Split View: Connected Workflow Timeline (Left) + Bottlenecks Radar (Right) */}
      <div className="workflow-layout-grid">
        {/* Left: Connected Visual Workflow Timeline */}
        <div className="workflow-timeline-card ot-card">
          <div className="timeline-card-header">
            <div className="timeline-header-left">
              <div className="case-badge-pill font-mono">CASE #{selectedCaseId}</div>
              <div>
                <h3 className="case-title font-display">{activeTimeline.procedure}</h3>
                <span className="case-meta font-mono">
                  Patient: {activeTimeline.patientName} ({activeTimeline.mrn}) • {activeTimeline.otSuite} • {activeTimeline.surgeon}
                </span>
              </div>
            </div>

            <Button
              size="xs"
              variant="secondary"
              icon={HelpCircle}
              onClick={() => handleOpenWhyDelayed(bottlenecks[1])}
            >
              Why was this delayed?
            </Button>
          </div>

          {/* Sequential Chain of Connected Timeline Nodes */}
          <div className="connected-timeline-container">
            {activeTimeline.events.map((evt, idx) => {
              const isDone = evt.statusType === 'done';
              const isDelayed = evt.statusType === 'delayed';
              const isCurrent = evt.statusType === 'current';
              const isUpcoming = evt.statusType === 'upcoming';

              return (
                <div key={evt.id} className="timeline-node-wrapper">
                  {/* The Node Card */}
                  <div className={`timeline-node-box border-${evt.deptPillar} ${isDelayed ? 'node-delayed' : ''} ${isCurrent ? 'node-current' : ''}`}>
                    <div className="node-top-row">
                      <div className="node-time-dept font-mono">
                        <span className="node-time">{evt.timestamp}</span>
                        <span className="node-sep">•</span>
                        <Badge variant={evt.deptPillar} size="xs">{evt.department}</Badge>
                      </div>

                      <span className={`node-status-pill pill-${evt.statusType} font-mono`}>
                        {isDone && <CheckCircle2 size={10} />}
                        {isDelayed && <AlertTriangle size={10} />}
                        {isCurrent && <Clock size={10} />}
                        {evt.status}
                      </span>
                    </div>

                    <div className="node-main-content">
                      <div className="node-event-name font-display">{evt.event}</div>
                      <p className="node-desc">{evt.desc}</p>
                    </div>

                    <div className="node-footer-source font-mono">
                      <span className="source-label">SOURCE:</span>
                      <span className="source-name">{evt.source}</span>
                    </div>

                    {isDelayed && (
                      <div className="node-delay-cta">
                        <button
                          className="btn-why-delayed-link font-mono"
                          onClick={() => handleOpenWhyDelayed(bottlenecks[1])}
                          type="button"
                        >
                          <Sparkles size={11} className="text-purple" />
                          <span>Why was this delayed? View cross-department root cause →</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Downward Connected Arrow */}
                  {idx < activeTimeline.events.length - 1 && (
                    <div className="timeline-connecting-arrow">
                      <div className={`arrow-vertical-line ${isDone ? 'line-done' : ''}`} />
                      <ArrowDown size={14} className={`arrow-icon-down ${isDone ? 'text-teal' : 'text-muted'}`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Workflow Bottlenecks Section */}
        <div className="workflow-bottlenecks-card ot-card">
          <div className="bottlenecks-card-header">
            <div className="bn-header-title-row">
              <AlertTriangle size={16} className="text-amber" />
              <h3 className="bn-title font-display">Workflow Bottlenecks</h3>
            </div>
            <span className="bn-subtitle font-mono">TOP ACTIVE DELAY DRIVERS</span>
          </div>

          <p className="bn-intro-copy">
            Cross-departmental latency points automatically detected by pattern recognition across the surgical pipeline.
          </p>

          {/* Bottlenecks List / Table */}
          <div className="bottlenecks-list">
            {bottlenecks.map((bn) => (
              <div key={bn.id} className={`bottleneck-item-card impact-${bn.impactLevel}`}>
                <div className="bn-item-top">
                  <div className="bn-title-dept">
                    <h4 className="bn-name font-display">{bn.bottleneck}</h4>
                    <Badge variant={bn.deptPillar} size="xs">{bn.department}</Badge>
                  </div>

                  <span className={`impact-badge badge-${bn.impactLevel} font-mono`}>
                    {bn.impact}
                  </span>
                </div>

                <div className="bn-metrics-strip font-mono">
                  <div className="bn-metric">
                    <span className="bn-label">FREQUENCY</span>
                    <span className="bn-val font-bold">{bn.frequency}</span>
                  </div>
                  <div className="bn-metric">
                    <span className="bn-label">AVERAGE DELAY</span>
                    <span className="bn-val text-red font-bold">{bn.avgDelay}</span>
                  </div>
                </div>

                <div className="bn-root-cause-copy font-mono">
                  <span>Root cause: {bn.rootCauseSummary}</span>
                </div>

                <div className="bn-action-footer">
                  <Button
                    size="xs"
                    variant="secondary"
                    icon={HelpCircle}
                    onClick={() => handleOpenWhyDelayed(bn)}
                  >
                    Why was this delayed?
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* AI Workflow Optimization Callout */}
          <div className="workflow-ai-callout">
            <div className="ai-callout-top">
              <Sparkles size={14} className="text-purple" />
              <span className="ai-callout-title font-display">AI Cross-Silo Orchestration</span>
            </div>
            <p className="ai-callout-text">
              By connecting Admissions transport alerts directly to OT room sanitation IoT, OTFlow AI reduced average cross-department delay from <strong>28 mins to 7.2 mins</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* 4. 'Why was this delayed?' Correlation Diagnostic Modal */}
      <WhyDelayedModal
        isOpen={isWhyDelayedOpen}
        onClose={() => setIsWhyDelayedOpen(false)}
        bottleneck={selectedBottleneck}
      />
    </div>
  );
};
