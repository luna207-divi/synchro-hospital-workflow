import React, { useEffect } from 'react';
import { 
  User, Zap, Package, Clock, AlertTriangle, CheckCircle2, 
  XCircle, Stethoscope, Timer, Loader, Activity, ShieldCheck,
  Building2, ArrowUpRight, Sparkles, RefreshCw
} from 'lucide-react';
import { CountUp } from '../common/CountUp';
import './FlowBoard.css';

/* ============================================================
   SYNCHRO — FLOW BOARD (Sophisticated Animation System)
   - Soft scale & card hover elevation
   - Floating hero 3D graphics & tags
   - Moving workflow SVG dash paths
   - Soft cyan glowing active stage nodes
   - Non-aggressive red pulse for blocked states
   - Smooth animated number counting (CountUp)
   - Progress bar fill animations
   - Scroll-triggered reveals
   ============================================================ */

const STAGES = [
  { id: 'patient',     label: 'Patient Ready',  icon: User },
  { id: 'preparing',   label: 'Preparing',      icon: Zap },
  { id: 'instruments', label: 'Instruments',     icon: Package },
  { id: 'surgery',     label: 'In Surgery',      icon: Stethoscope },
  { id: 'turnover',    label: 'Turnover',        icon: Timer },
  { id: 'ready',       label: 'OT Ready',        icon: CheckCircle2 },
];

const OT_DATA = [
  {
    id: 'OT-01',
    currentStage: 3,
    flowStatus: 'cyan',
    statusLabel: 'In Surgery',
    patient: 'R. Vance',
    procedure: 'Total Hip Arthroplasty',
    surgeon: 'Dr. A. Miller',
    elapsed: '1h 45m',
    expected: '~55m remaining',
    delay: null,
  },
  {
    id: 'OT-02',
    currentStage: 1,
    flowStatus: 'red',
    statusLabel: 'Blocked',
    patient: 'E. Rostova',
    procedure: 'Lap Cholecystectomy',
    surgeon: 'Dr. K. Patel',
    elapsed: '25m waiting',
    expected: 'Blocked',
    delay: 'CSSD pack in autoclave cooldown',
    blockBetween: [1, 2],
  },
  {
    id: 'OT-03',
    currentStage: 4,
    flowStatus: 'amber',
    statusLabel: 'Turnover — Over Time',
    patient: 'M. Chen',
    procedure: 'ACL Reconstruction',
    surgeon: 'Dr. J. Gomez',
    elapsed: '34m turnover',
    expected: 'Benchmark: 25m',
    delay: '+9m over expected turnover',
  },
  {
    id: 'OT-04',
    currentStage: 5,
    flowStatus: 'green',
    statusLabel: 'Ready',
    patient: null,
    procedure: null,
    surgeon: null,
    elapsed: null,
    expected: 'Next: S. Jenkins 11:30',
    delay: null,
  },
];

const ATTENTION_ITEMS = [
  {
    id: 'ATT-1',
    what: 'OT-02 surgery cannot start',
    why: 'CSSD instrument pack stuck in Autoclave #2 cooldown — estimated 18 min remaining',
    who: 'CSSD Team',
    severity: 'red',
    time: '25 min blocked',
  },
  {
    id: 'ATT-2',
    what: 'OT-03 turnover exceeding benchmark',
    why: 'Biohazard cleanup protocol required post-ACL procedure. Sanitation team dispatched.',
    who: 'Cleaning Supervisor',
    severity: 'amber',
    time: '+9 min over',
  },
  {
    id: 'ATT-3',
    what: 'Patient consent missing for 14:00 case',
    why: 'A. Miller — Lap Chole consent form pending signature in EMR.',
    who: 'Admissions',
    severity: 'amber',
    time: '3h until case',
  },
];

const UPCOMING_CASES = [
  {
    id: 'UP-1',
    time: '11:30',
    patient: 'S. Jenkins',
    procedure: 'Total Knee Arthroplasty • Dr. R. Sharma',
    ot: 'OT-04',
    readiness: 'green',
    readinessLabel: 'All gates clear',
  },
  {
    id: 'UP-2',
    time: '14:00',
    patient: 'A. Miller',
    procedure: 'Lap Cholecystectomy • Dr. K. Patel',
    ot: 'OT-02',
    readiness: 'amber',
    readinessLabel: 'Consent pending',
  },
  {
    id: 'UP-3',
    time: '15:30',
    patient: 'A. Malik',
    procedure: 'Meniscus Repair • Dr. J. Gomez',
    ot: 'OT-03',
    readiness: 'green',
    readinessLabel: 'All gates clear',
  },
];

const StageNode = ({ stage, index, currentStage, flowStatus, blockBetween }) => {
  const isCompleted = index < currentStage;
  const isCurrent = index === currentStage;
  const isBlocked = blockBetween && index === blockBetween[1];
  const isBlockedBefore = blockBetween && index === blockBetween[0];
  const Icon = stage.icon;

  let nodeClass = 'stage-upcoming';
  if (isCompleted) nodeClass = 'stage-done';
  if (isCurrent) nodeClass = `stage-current-${flowStatus}`;
  if (isBlocked) nodeClass = 'stage-blocked';

  return (
    <div className={`stage-node-wrapper ${isCurrent ? 'is-current' : ''}`}>
      {index > 0 && (
        isBlocked ? (
          <div className="connector-break">
            <span className="connector-break-icon">
              <XCircle size={14} />
            </span>
          </div>
        ) : (
          <svg className="stage-connector-svg" viewBox="0 0 44 6">
            <line 
              x1="0" 
              y1="3" 
              x2="44" 
              y2="3" 
              className={
                isCompleted 
                  ? 'connector-line-done' 
                  : isCurrent 
                  ? 'connector-line-active' 
                  : 'connector-line-future'
              } 
            />
          </svg>
        )
      )}
      
      <div className={`stage-node ${nodeClass}`} title={stage.label}>
        {isCompleted ? (
          <CheckCircle2 size={16} />
        ) : (
          <Icon size={16} />
        )}
      </div>
      
      {isCurrent && (
        <span className={`stage-current-label stage-label-${flowStatus}`}>
          {stage.label}
        </span>
      )}
    </div>
  );
};

const OTLane = ({ ot }) => {
  const statusColorClass = `lane-${ot.flowStatus}`;

  return (
    <div className={`ot-lane ${statusColorClass} scroll-reveal`}>
      <div className="ot-lane-id">
        <span className="ot-id-text">{ot.id}</span>
      </div>

      <div className="ot-lane-flow">
        {STAGES.map((stage, idx) => (
          <StageNode
            key={stage.id}
            stage={stage}
            index={idx}
            currentStage={ot.currentStage}
            flowStatus={ot.flowStatus}
            blockBetween={ot.blockBetween}
          />
        ))}
      </div>

      <div className="ot-lane-info">
        {ot.patient ? (
          <>
            <span className="lane-patient">{ot.patient}</span>
            <span className="lane-procedure">{ot.procedure}</span>
            <span className="lane-surgeon">{ot.surgeon}</span>
            <div className="lane-timing">
              {ot.elapsed && (
                <span className="lane-elapsed">
                  <Clock size={11} />
                  {ot.elapsed}
                </span>
              )}
              {ot.delay && (
                <span className={`lane-delay delay-${ot.flowStatus}`}>
                  <AlertTriangle size={11} />
                  {ot.delay}
                </span>
              )}
              {!ot.delay && ot.expected && (
                <span className="lane-expected">{ot.expected}</span>
              )}
            </div>
          </>
        ) : (
          <div className="lane-available">
            <span className="lane-available-label">
              <CheckCircle2 size={14} />
              <span>OT Ready</span>
            </span>
            {ot.expected && <span className="lane-expected">{ot.expected}</span>}
          </div>
        )}
      </div>

      <div className={`ot-lane-status status-${ot.flowStatus}`}>
        {ot.flowStatus === 'green' && <CheckCircle2 size={14} />}
        {ot.flowStatus === 'amber' && <AlertTriangle size={14} />}
        {ot.flowStatus === 'red' && <XCircle size={14} />}
        {ot.flowStatus === 'cyan' && <Loader size={14} />}
        <span>{ot.statusLabel}</span>
      </div>
    </div>
  );
};

const AttentionCard = ({ item }) => {
  const Icon = item.severity === 'red' ? XCircle : AlertTriangle;

  return (
    <div className={`attention-card att-${item.severity} scroll-reveal`}>
      <div className="att-card-top">
        <div className={`att-icon-box att-icon-${item.severity}`}>
          <Icon size={16} />
        </div>
        <span className={`att-who att-who-${item.severity}`}>{item.who}</span>
      </div>
      <div className="att-what">{item.what}</div>
      <div className="att-why">{item.why}</div>
      <div className="att-time">{item.time}</div>
    </div>
  );
};

const UpcomingRow = ({ item, isLast }) => {
  const ReadinessIcon = item.readiness === 'green' ? CheckCircle2 : AlertTriangle;

  return (
    <div className={`upcoming-row ${isLast ? 'is-last' : ''}`}>
      <div className="upcoming-time">{item.time}</div>
      <div className={`upcoming-dot upcoming-dot-${item.readiness}`}>
        <ReadinessIcon size={14} />
      </div>
      <div className="upcoming-details">
        <div className="upcoming-header">
          <span className="upcoming-patient">{item.patient}</span>
          <span className="upcoming-ot">{item.ot}</span>
        </div>
        <span className="upcoming-procedure">{item.procedure}</span>
        <span className={`upcoming-readiness readiness-${item.readiness}`}>
          <ReadinessIcon size={12} />
          <span>{item.readinessLabel}</span>
        </span>
      </div>
    </div>
  );
};

export const FlowBoard = () => {
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  // Scroll-triggered reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flow-board">
      {/* ── Page Header Bar ────────────────────────────── */}
      <div className="flow-board-header">
        <div className="flow-board-title-block">
          <h1 className="flow-board-title">Hospital Operations</h1>
          <p className="flow-board-subtitle">
            Real-time surgical workflow telemetry across connected hospital departments
          </p>
        </div>
        <div className="flow-board-meta">
          <span className="flow-board-date">{dateStr}</span>
          <div className="flow-board-live">
            <span className="live-dot" />
            <span className="live-label">Live Sync</span>
          </div>
        </div>
      </div>

      {/* ── HERO VISUAL BANNER: Everything in the Hospital is Connected ── */}
      <div className="hero-triad-banner">
        <div className="hero-banner-content">
          <div className="hero-banner-badge">
            <Sparkles size={14} />
            <span>Workflow Correlation Engine</span>
          </div>
          <h2 className="hero-banner-heading">
            Everything in the hospital is connected.
          </h2>
          <p className="hero-banner-desc">
            Synchro continuously correlates patient pre-op intake, surgical room prep, and CSSD sterile pack readiness to prevent delays before incision.
          </p>

          {/* Animated Progress Bar Fill */}
          <div className="hero-progress-section">
            <div className="hero-progress-label font-mono text-2xs text-muted">
              <span>Overall Hospital Sync Index</span>
              <CountUp end={94.8} decimals={1} suffix="%" />
            </div>
            <div className="progress-bar-animated" style={{ '--progress-val': '94.8%' }} />
          </div>

          <div className="hero-nodes-grid">
            <div className="triad-node-card">
              <div className="node-icon-wrapper node-icon-blue">
                <User size={18} />
              </div>
              <div className="node-info">
                <span className="node-title">Admissions</span>
                <span className="node-status text-green">
                  <CountUp end={96.2} decimals={1} suffix="% Ready" />
                </span>
              </div>
            </div>

            <div className="triad-node-card">
              <div className="node-icon-wrapper node-icon-purple">
                <Stethoscope size={18} />
              </div>
              <div className="node-info">
                <span className="node-title">Operating Suites</span>
                <span className="node-status text-cyan">
                  <CountUp end={4} suffix=" Active Suites" />
                </span>
              </div>
            </div>

            <div className="triad-node-card">
              <div className="node-icon-wrapper node-icon-teal">
                <Package size={18} />
              </div>
              <div className="node-info">
                <span className="node-title">CSSD Sterilization</span>
                <span className="node-status text-amber">1 Tray Cooldown</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-graphic-wrapper">
          <span className="hero-floating-tag tag-top-left">
            <Activity size={12} />
            <span>Triad Telemetry Live</span>
          </span>
          <img 
            src="/assets/images/hospital_triad.png" 
            alt="Connected Hospital Triad" 
            className="hero-3d-graphic"
          />
          <span className="hero-floating-tag tag-bottom-right">
            <CheckCircle2 size={12} />
            <span>In Sync</span>
          </span>
        </div>
      </div>

      {/* ── 3D VISUAL CARDS SHOWCASE GRID ─────────────────── */}
      <div className="visual-cards-grid">
        <div className="dept-visual-card scroll-reveal">
          <div className="card-graphic-container">
            <img 
              src="/assets/images/patient_journey.png" 
              alt="Patient Readiness Journey" 
              className="card-3d-image"
            />
          </div>
          <div className="card-body-content">
            <span className="card-dept-badge">Intake & Pre-Op</span>
            <h3 className="card-dept-title">Patient Readiness Journey</h3>
            <span className="card-dept-metric">
              <CountUp end={100} suffix="% Pre-Op Cleared for 11:30 Case" />
            </span>
          </div>
        </div>

        <div className="dept-visual-card scroll-reveal">
          <div className="card-graphic-container">
            <img 
              src="/assets/images/operating_theatre.png" 
              alt="OT Suite Telemetry" 
              className="card-3d-image"
            />
          </div>
          <div className="card-body-content">
            <span className="card-dept-badge">Operating Theatres</span>
            <h3 className="card-dept-title">OT Suite Utilization</h3>
            <span className="card-dept-metric">
              OT-01 In Surgery • <CountUp end={89.2} decimals={1} suffix="% Utilization" />
            </span>
          </div>
        </div>

        <div className="dept-visual-card scroll-reveal">
          <div className="card-graphic-container">
            <img 
              src="/assets/images/sterile_tray.png" 
              alt="CSSD Sterile Instrument Lifecycle" 
              className="card-3d-image"
            />
          </div>
          <div className="card-body-content">
            <span className="card-dept-badge">CSSD Sterilization</span>
            <h3 className="card-dept-title">Sterile Pack Lifecycle</h3>
            <span className="card-dept-metric">Tray #00142 in Autoclave Cooldown</span>
          </div>
        </div>
      </div>

      {/* ── Section 1: Right Now (OT Lanes Flow) ────────── */}
      <section className="flow-section">
        <div className="section-header">
          <h2 className="section-title">Right Now</h2>
          <span className="section-count">4 Operating Suites Active</span>
        </div>

        <div className="flow-legend">
          <div className="flow-legend-item">
            <span className="flow-legend-dot dot-done" />
            <span>Completed</span>
          </div>
          <div className="flow-legend-item">
            <span className="flow-legend-dot dot-active" />
            <span>In Progress</span>
          </div>
          <div className="flow-legend-item">
            <span className="flow-legend-dot dot-warn" />
            <span>Warning</span>
          </div>
          <div className="flow-legend-item">
            <span className="flow-legend-dot dot-block" />
            <span>Blocked</span>
          </div>
          <div className="flow-legend-item">
            <span className="flow-legend-dot dot-future" />
            <span>Upcoming</span>
          </div>
        </div>

        <div className="ot-lanes-container">
          {OT_DATA.map(ot => (
            <OTLane key={ot.id} ot={ot} />
          ))}
        </div>
      </section>

      {/* ── Section 2: Needs Attention ──────────────────── */}
      <section className="flow-section">
        <div className="section-header">
          <h2 className="section-title">Needs Attention</h2>
          <span className="section-count">{ATTENTION_ITEMS.length} Active Bottlenecks</span>
        </div>

        <div className="attention-list">
          {ATTENTION_ITEMS.map(item => (
            <AttentionCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* ── Section 3: Coming Up ────────────────────────── */}
      <section className="flow-section">
        <div className="section-header">
          <h2 className="section-title">Coming Up</h2>
          <span className="section-count">Next 3 Procedures</span>
        </div>

        <div className="upcoming-timeline">
          {UPCOMING_CASES.map((item, idx) => (
            <UpcomingRow 
              key={item.id} 
              item={item} 
              isLast={idx === UPCOMING_CASES.length - 1}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
