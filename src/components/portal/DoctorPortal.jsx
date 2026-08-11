import React, { useEffect } from 'react';
import { 
  User, Zap, Package, Stethoscope, Timer, CheckCircle2, 
  XCircle, AlertTriangle, Clock, Activity, ShieldCheck, 
  Sparkles, ArrowRight, Play, Loader
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Button } from '../common/Button';
import './DoctorPortal.css';

/* ============================================================
   SYNCHRO — Doctor / Hospital Staff Command Workspace
   (Connected Demo Mode)
   ============================================================ */

export const DoctorPortal = ({ onNavigateToCSSD, onNavigateToOTControl }) => {
  const { demoState, startSurgeryOT2 } = useDemo();

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

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
    <div className="doctor-portal">
      {/* ── 1. Top Doctor Greeting Header ────────────────────── */}
      <div className="doctor-header-bar">
        <div className="doctor-greeting-block">
          <h1 className="doctor-greeting-title">Good morning, Dr. Sharma</h1>
          <p className="doctor-greeting-sub">
            {demoState.ot2Status === 'BLOCKED' 
              ? "Here's what needs your attention today." 
              : "✓ OT-02 Delay Resolved — All operating suites on track."}
          </p>
        </div>
        <div className="doctor-header-meta">
          <span className="doctor-meta-date">{dateStr}</span>
          <div className="doctor-live-badge">
            <span className="live-dot" />
            <span className="live-label">Live Sync</span>
          </div>
        </div>
      </div>

      {/* Demo Signal Toast */}
      {demoState.dispatchToast && (
        <div className="live-signal-toast toast-cyan toast-inline">
          <Sparkles size={16} />
          <span>{demoState.dispatchToast}</span>
        </div>
      )}

      {/* ── 2. HERO VISUAL: TODAY'S SURGICAL FLOW ────────────── */}
      <div className="today-flow-banner">
        <div className="today-flow-top">
          <div className="today-flow-badge">
            <Sparkles size={14} />
            <span>Today's Surgical Pipeline</span>
          </div>
          <h2 className="today-flow-title">TODAY'S SURGICAL FLOW</h2>
        </div>

        {/* Horizontal 6-Node Workflow Journey Track */}
        <div className="today-workflow-track">
          <div className="workflow-node-box">
            <div className="node-circle-glow circle-done">
              <CheckCircle2 size={20} />
            </div>
            <span className="node-label-title">PATIENT READY</span>
            <span className="node-label-status text-green">Cleared Intake</span>
          </div>

          <svg className="workflow-path-svg" viewBox="0 0 60 6">
            <line x1="0" y1="3" x2="60" y2="3" className="connector-line-active" />
          </svg>

          <div className="workflow-node-box">
            <div className="node-circle-glow circle-done">
              <CheckCircle2 size={20} />
            </div>
            <span className="node-label-title">OT PREP</span>
            <span className="node-label-status text-green">Pre-op Clear</span>
          </div>

          <svg className="workflow-path-svg" viewBox="0 0 60 6">
            <line x1="0" y1="3" x2="60" y2="3" className="connector-line-active" />
          </svg>

          <div className="workflow-node-box">
            <div className={`node-circle-glow ${demoState.ot2Status === 'BLOCKED' ? 'circle-blocked-red' : 'circle-done'}`}>
              {demoState.ot2Status === 'BLOCKED' ? <XCircle size={20} /> : <CheckCircle2 size={20} />}
            </div>
            <span className="node-label-title">INSTRUMENT READY</span>
            <span className={`node-label-status text-${demoState.ot2Status === 'BLOCKED' ? 'red' : 'green'}`}>
              {demoState.ot2Status === 'BLOCKED' ? 'Pack Hold' : `Pack ${demoState.ot2Pack} ✓`}
            </span>
          </div>

          <svg className="workflow-path-svg" viewBox="0 0 60 6">
            <line x1="0" y1="3" x2="60" y2="3" className="connector-line-active" />
          </svg>

          <div className="workflow-node-box">
            <div className={`node-circle-glow ${demoState.ot2Status === 'SURGERY' ? 'circle-active-cyan' : 'circle-future'}`}>
              <Stethoscope size={20} />
            </div>
            <span className="node-label-title">SURGERY</span>
            <span className={`node-label-status text-${demoState.ot2Status === 'SURGERY' ? 'cyan' : 'muted'}`}>
              {demoState.ot2Status === 'SURGERY' ? 'IN SURGERY' : 'Pending Start'}
            </span>
          </div>

          <svg className="workflow-path-svg" viewBox="0 0 60 6">
            <line x1="0" y1="3" x2="60" y2="3" className="connector-line-future" />
          </svg>

          <div className="workflow-node-box">
            <div className="node-circle-glow circle-future">
              <Timer size={20} />
            </div>
            <span className="node-label-title">TURNOVER</span>
            <span className="node-label-status text-muted">OT-03 +9m</span>
          </div>

          <svg className="workflow-path-svg" viewBox="0 0 60 6">
            <line x1="0" y1="3" x2="60" y2="3" className="connector-line-future" />
          </svg>

          <div className="workflow-node-box">
            <div className="node-circle-glow circle-future">
              <CheckCircle2 size={20} />
            </div>
            <span className="node-label-title">OT READY</span>
            <span className="node-label-status text-muted">OT-04 Ready</span>
          </div>
        </div>
      </div>

      {/* ── 3. SECTION: Needs Your Attention ────────────────── */}
      <section className="attention-section">
        <div className="section-header">
          <h2 className="section-title">Needs Your Attention</h2>
          <span className="section-count">
            {demoState.ot2Status === 'BLOCKED' ? '3 active bottlenecks' : '2 active bottlenecks (1 Resolved)'}
          </span>
        </div>

        <div className="attention-cards-grid">
          {demoState.ot2Status === 'BLOCKED' ? (
            <div className="attn-card attn-red scroll-reveal">
              <div className="attn-card-top">
                <div className="attn-icon-badge attn-icon-red">
                  <XCircle size={18} />
                </div>
                <span className="attn-tag attn-tag-red">Critical Blockage</span>
              </div>
              <h3 className="attn-title">OT-02 waiting for CSSD pack</h3>
              <p className="attn-desc">{demoState.ot2BlockReason}</p>
            </div>
          ) : (
            <div className="attn-card attn-green scroll-reveal">
              <div className="attn-card-top">
                <div className="attn-icon-badge attn-icon-green">
                  <CheckCircle2 size={18} />
                </div>
                <span className="attn-tag attn-tag-green">Delay Resolved</span>
              </div>
              <h3 className="attn-title">OT-02 Pack #{demoState.ot2Pack} Verified</h3>
              <p className="attn-desc">Re-assigned from CSSD Sterile Bay 2. OT-02 ready for surgery.</p>
            </div>
          )}

          <div className="attn-card attn-green scroll-reveal">
            <div className="attn-card-top">
              <div className="attn-icon-badge attn-icon-green">
                <CheckCircle2 size={18} />
              </div>
              <span className="attn-tag attn-tag-green">Ready for Transfer</span>
            </div>
            <h3 className="attn-title">Patient P-1024 ready for transfer</h3>
            <p className="attn-desc">E. Rostova pre-flight intake and consent forms verified in EMR.</p>
          </div>

          <div className="attn-card attn-amber scroll-reveal">
            <div className="attn-card-top">
              <div className="attn-icon-badge attn-icon-amber">
                <AlertTriangle size={18} />
              </div>
              <span className="attn-tag attn-tag-amber">Turnover Delay</span>
            </div>
            <h3 className="attn-title">OT-03 turnover running late</h3>
            <p className="attn-desc">Biohazard post-ACL cleanup required. Sanitation team dispatched (+9m).</p>
          </div>
        </div>
      </section>

      {/* ── 4. SECTION: Your Day (Upcoming Surgeries) ────────── */}
      <section className="your-day-section">
        <div className="section-header">
          <h2 className="section-title">Your Day</h2>
          <span className="section-count">3 Scheduled Procedures</span>
        </div>

        <div className="timeline-cards-list">
          <div className="timeline-card-item scroll-reveal">
            <div className="timeline-time-box">
              <Clock size={14} />
              <span>10:00 AM</span>
            </div>
            <div className="timeline-patient-block">
              <span className="timeline-patient-name">{demoState.patientName} ({demoState.patientId})</span>
              <span className="timeline-procedure-name">{demoState.procedure}</span>
            </div>
            <div className="timeline-ot-badge">
              <Stethoscope size={14} />
              <span>Assigned to OT-02</span>
            </div>
            <div className={`timeline-status-pill status-${demoState.ot2Status === 'BLOCKED' ? 'red' : demoState.ot2Status === 'READY' ? 'green' : 'cyan'}`}>
              {demoState.ot2Status === 'BLOCKED' ? <XCircle size={14} /> : demoState.ot2Status === 'READY' ? <CheckCircle2 size={14} /> : <Loader size={14} />}
              <span>{demoState.ot2Status === 'BLOCKED' ? 'Pack Hold' : demoState.ot2Status === 'READY' ? 'Instrument Ready' : 'In Surgery'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
