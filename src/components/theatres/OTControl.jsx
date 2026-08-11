import React, { useEffect } from 'react';
import { 
  Stethoscope, CheckCircle2, XCircle, AlertTriangle, 
  Clock, Activity, Loader, Sparkles, User, Timer, ArrowRight, Play
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Button } from '../common/Button';
import './OTControl.css';

/* ============================================================
   SYNCHRO — OT CONTROL (Connected Demo Mode)
   Scenario: Patient P-1024 • Lap Cholecystectomy • OT-02
   State 1: BLOCKED (CSSD-00421 Autoclave Cooldown Hold) -> Action: Resolve in SterileFlow
   State 2: READY (CSSD-00428 Assigned) -> Action: Start Surgery
   State 3: SURGERY (IN SURGERY) -> Reflected in Live Flow & Analytics
   ============================================================ */

export const OTControl = ({ onNavigateToCSSD }) => {
  const { demoState, startSurgeryOT2 } = useDemo();

  // Scroll reveal observer
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
    <div className="ot-control-container">
      {/* ── Top Header Bar ───────────────────────────────── */}
      <div className="ot-control-header">
        <div className="ot-control-title-block">
          <h1 className="ot-control-main-title">OT CONTROL</h1>
          <p className="ot-control-subtitle">
            Operating Theatre Telemetry & Suite Command Room.
          </p>
        </div>

        <div className="ot-control-meta">
          <div className="doctor-live-badge">
            <span className="live-dot" />
            <span className="live-label">4 Operating Suites Active</span>
          </div>
        </div>
      </div>

      {/* Demo Signal Toast Overlay */}
      {demoState.dispatchToast && (
        <div className="live-signal-toast toast-cyan toast-inline">
          <Sparkles size={16} />
          <span>{demoState.dispatchToast}</span>
        </div>
      )}

      {/* ── FOUR VISUAL OT SUITE CARDS GRID ──────────────── */}
      <div className="ot-suites-visual-grid">
        {/* OT-01: IN SURGERY */}
        <div className="ot-visual-card ot-card-active-cyan scroll-reveal">
          <div className="ot-card-top-bar">
            <div className="ot-card-title-group">
              <span className="ot-suite-number-badge">OT-01</span>
              <span className="badge badge-cyan">
                <Loader size={12} />
                <span>IN SURGERY</span>
              </span>
            </div>
            <span className="font-mono text-xs text-cyan font-bold">89.2% Utilization</span>
          </div>

          <div className="ot-theatre-visual-box">
            <span className="ot-overlay-indicator badge-cyan">
              <Activity size={10} /> Live Telemetry
            </span>
            <img 
              src="/assets/images/operating_theatre.png" 
              alt="OT-01 Suite Visual" 
              className="ot-theatre-img"
            />
          </div>

          <div className="ot-patient-info-block">
            <span className="ot-patient-name">R. Vance</span>
            <span className="ot-procedure-title">Total Hip Arthroplasty • Dr. A. Miller</span>
          </div>

          <div className="ot-info-footer">
            <span className="flex items-center gap-1">
              <Clock size={12} /> 1h 45m elapsed
            </span>
            <span className="text-cyan font-bold">~55m remaining</span>
          </div>
        </div>

        {/* OT-02: CONNECTED DEMO SCENARIO CARD */}
        {demoState.ot2Status === 'BLOCKED' && (
          <div className="ot-visual-card ot-card-blocked-red scroll-reveal">
            <div className="ot-card-top-bar">
              <div className="ot-card-title-group">
                <span className="ot-suite-number-badge">OT-02</span>
                <span className="badge badge-red">
                  <XCircle size={12} />
                  <span>CSSD PACK WAITING</span>
                </span>
              </div>
              <span className="font-mono text-xs text-red font-bold">BLOCKED</span>
            </div>

            <div className="ot-theatre-visual-box" style={{ border: '1px solid var(--status-red-border)' }}>
              <span className="ot-overlay-indicator badge-red">
                <AlertTriangle size={10} /> Workflow Stopped
              </span>
              <img 
                src="/assets/images/flow_break.png" 
                alt="OT-02 Blocked Visual" 
                className="ot-theatre-img"
              />
            </div>

            <div className="ot-patient-info-block">
              <span className="ot-patient-name">{demoState.patientName} ({demoState.patientId})</span>
              <span className="ot-procedure-title">{demoState.procedure} • {demoState.surgeon}</span>
            </div>

            <div className="ot-info-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <span className="text-red font-bold flex items-center gap-1">
                <XCircle size={12} /> {demoState.ot2BlockReason}
              </span>
              <Button 
                variant="primary" 
                size="sm" 
                icon={ArrowRight}
                onClick={onNavigateToCSSD}
                style={{ width: '100%' }}
              >
                Resolve in SterileFlow →
              </Button>
            </div>
          </div>
        )}

        {demoState.ot2Status === 'READY' && (
          <div className="ot-visual-card ot-card-ready-green scroll-reveal">
            <div className="ot-card-top-bar">
              <div className="ot-card-title-group">
                <span className="ot-suite-number-badge">OT-02</span>
                <span className="badge badge-green">
                  <CheckCircle2 size={12} />
                  <span>INSTRUMENT READY ✓</span>
                </span>
              </div>
              <span className="font-mono text-xs text-green font-bold">Pack {demoState.ot2Pack} Verified</span>
            </div>

            <div className="ot-theatre-visual-box" style={{ border: '1px solid var(--status-green-border)' }}>
              <span className="ot-overlay-indicator badge-green">
                <CheckCircle2 size={10} /> All Gates Cleared
              </span>
              <img 
                src="/assets/images/operating_theatre.png" 
                alt="OT-02 Ready Visual" 
                className="ot-theatre-img"
              />
            </div>

            <div className="ot-patient-info-block">
              <span className="ot-patient-name">{demoState.patientName} ({demoState.patientId})</span>
              <span className="ot-procedure-title">{demoState.procedure} • {demoState.surgeon}</span>
            </div>

            <div className="ot-info-footer">
              <span className="text-green font-bold">Pack #{demoState.ot2Pack} Dispatched from CSSD</span>
              <Button 
                variant="primary" 
                size="sm" 
                icon={Play}
                onClick={startSurgeryOT2}
              >
                Start Surgery ▶
              </Button>
            </div>
          </div>
        )}

        {demoState.ot2Status === 'SURGERY' && (
          <div className="ot-visual-card ot-card-active-cyan scroll-reveal">
            <div className="ot-card-top-bar">
              <div className="ot-card-title-group">
                <span className="ot-suite-number-badge">OT-02</span>
                <span className="badge badge-cyan">
                  <Loader size={12} />
                  <span>IN SURGERY</span>
                </span>
              </div>
              <span className="font-mono text-xs text-cyan font-bold">Procedure Active</span>
            </div>

            <div className="ot-theatre-visual-box">
              <span className="ot-overlay-indicator badge-cyan">
                <Activity size={10} /> Incision In Progress
              </span>
              <img 
                src="/assets/images/operating_theatre.png" 
                alt="OT-02 Surgery Active Visual" 
                className="ot-theatre-img"
              />
            </div>

            <div className="ot-patient-info-block">
              <span className="ot-patient-name">{demoState.patientName} ({demoState.patientId})</span>
              <span className="ot-procedure-title">{demoState.procedure} • {demoState.surgeon}</span>
            </div>

            <div className="ot-info-footer">
              <span className="flex items-center gap-1 text-cyan font-bold">
                <Clock size={12} /> Surgery In Progress • Telemetry Live
              </span>
            </div>
          </div>
        )}

        {/* OT-03: TURNOVER */}
        <div className="ot-visual-card ot-card-turnover-amber scroll-reveal">
          <div className="ot-card-top-bar">
            <div className="ot-card-title-group">
              <span className="ot-suite-number-badge">OT-03</span>
              <span className="badge badge-amber">
                <Timer size={12} />
                <span>TURNOVER</span>
              </span>
            </div>
            <span className="font-mono text-xs text-amber font-bold">+9m Over Time</span>
          </div>

          <div className="turnover-progress-ring-box">
            <svg className="circular-progress-svg" viewBox="0 0 36 36">
              <path
                className="circle-bg"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="circle-val"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-mono text-xs font-bold text-navy">34m Turnover Elapsed</span>
              <span className="text-2xs text-amber font-semibold">Benchmark: 25m (+9m sanitation delay)</span>
            </div>
          </div>

          <div className="ot-patient-info-block">
            <span className="ot-patient-name">M. Chen (Post-Op)</span>
            <span className="ot-procedure-title">ACL Reconstruction • Dr. J. Gomez</span>
          </div>

          <div className="ot-info-footer">
            <span>Biohazard protocol sanitation in progress</span>
          </div>
        </div>

        {/* OT-04: READY */}
        <div className="ot-visual-card ot-card-ready-green scroll-reveal">
          <div className="ot-card-top-bar">
            <div className="ot-card-title-group">
              <span className="ot-suite-number-badge">OT-04</span>
              <span className="badge badge-green">
                <CheckCircle2 size={12} />
                <span>READY</span>
              </span>
            </div>
            <span className="font-mono text-xs text-green font-bold">100% Cleared</span>
          </div>

          <div className="ot-theatre-visual-box" style={{ border: '1px solid var(--status-green-border)' }}>
            <span className="ot-overlay-indicator badge-green">
              <CheckCircle2 size={10} /> Suite Available
            </span>
            <img 
              src="/assets/images/operating_theatre.png" 
              alt="OT-04 Suite Ready Visual" 
              className="ot-theatre-img"
            />
          </div>

          <div className="ot-patient-info-block">
            <span className="ot-patient-name">Available Suite</span>
            <span className="ot-procedure-title">Next Scheduled: S. Jenkins (11:30 AM)</span>
          </div>

          <div className="ot-info-footer">
            <span className="text-green font-bold flex items-center gap-1">
              <CheckCircle2 size={12} /> All pre-op intake, consent & sterile gates cleared
            </span>
          </div>
        </div>
      </div>

      {/* ── TODAY'S SURGICAL FLOW (VISUAL TIMELINE) ──────── */}
      <section className="today-timeline-section">
        <div className="section-header">
          <h2 className="section-title">TODAY'S SURGICAL FLOW</h2>
          <span className="section-count">Live Suite Timeline</span>
        </div>

        <div className="visual-timeline-banner scroll-reveal">
          <div className="timeline-suites-rows">
            <div className="suite-timeline-row">
              <span className="suite-row-label">OT-01</span>
              <div className="suite-track-bar">
                <div className="suite-case-block case-block-cyan" style={{ width: '70%', marginLeft: '10%' }}>
                  09:00 - 12:30 • R. Vance (Total Hip) — IN SURGERY
                </div>
              </div>
            </div>

            <div className="suite-timeline-row">
              <span className="suite-row-label">OT-02</span>
              <div className="suite-track-bar">
                <div className={`suite-case-block case-block-${demoState.ot2Status === 'BLOCKED' ? 'red' : demoState.ot2Status === 'READY' ? 'green' : 'cyan'}`} style={{ width: '50%', marginLeft: '25%' }}>
                  10:00 - 12:00 • E. Rostova — {demoState.ot2Status === 'BLOCKED' ? 'CSSD PACK WAITING' : demoState.ot2Status === 'READY' ? 'INSTRUMENT READY' : 'IN SURGERY'}
                </div>
              </div>
            </div>

            <div className="suite-timeline-row">
              <span className="suite-row-label">OT-03</span>
              <div className="suite-track-bar">
                <div className="suite-case-block case-block-amber" style={{ width: '40%', marginLeft: '5%' }}>
                  08:30 - 11:00 • M. Chen — TURNOVER (+9m)
                </div>
              </div>
            </div>

            <div className="suite-timeline-row">
              <span className="suite-row-label">OT-04</span>
              <div className="suite-track-bar">
                <div className="suite-case-block case-block-green" style={{ width: '60%', marginLeft: '40%' }}>
                  11:30 - 14:00 • S. Jenkins — READY
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
