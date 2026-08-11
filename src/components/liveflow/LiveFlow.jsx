import React from 'react';
import { 
  User, CheckCircle2, Zap, Package, Stethoscope, Timer, 
  Sparkles, AlertTriangle, RefreshCw, Activity
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Button } from '../common/Button';
import './LiveFlow.css';

/* ============================================================
   SYNCHRO — LIVE FLOW (Connected Demo Mode)
   Scenario: Patient P-1024 • Lap Cholecystectomy • OT-02
   State 1: OT-02 BLOCKED -> Cooldown Hold
   State 2: OT-02 READY -> Instrument Ready
   State 3: OT-02 SURGERY -> Surgery Active Telemetry
   ============================================================ */

export const LiveFlow = () => {
  const { demoState } = useDemo();

  return (
    <div className="live-flow-container">
      {/* ── Header & Title Block ──────────────────────────── */}
      <div className="live-flow-header">
        <div className="live-flow-title-block">
          <h1 className="live-flow-main-title">LIVE FLOW</h1>
          <p className="live-flow-subtitle">
            See the hospital move in real time.
          </p>
        </div>

        <div className="live-flow-controls">
          <div className="doctor-live-badge">
            <span className="live-dot" />
            <span className="live-label">Telemetry Live</span>
          </div>
        </div>
      </div>

      {/* ── Main Live Canvas ────────────────────────────────── */}
      <div className="live-flow-canvas">
        {/* Signal Toast Overlay */}
        {demoState.dispatchToast && (
          <div className={`live-signal-toast toast-${demoState.ot2Status === 'BLOCKED' ? 'red' : 'cyan'}`}>
            <Activity size={16} />
            <span>{demoState.dispatchToast}</span>
          </div>
        )}

        {/* 6 Visual Department Cards */}
        <div className="depts-visual-flow-grid">
          {/* Node 1: ADMISSIONS */}
          <div className="dept-flow-card is-active">
            <div className="dept-card-icon-glow circle-done">
              <User size={22} />
            </div>
            <span className="dept-title-text">ADMISSIONS</span>
            <span className="dept-status-text text-green">Cleared</span>
          </div>

          {/* Node 2: PATIENT READY */}
          <div className="dept-flow-card is-active">
            <div className="dept-card-icon-glow circle-done">
              <CheckCircle2 size={22} />
            </div>
            <span className="dept-title-text">PATIENT READY</span>
            <span className="dept-status-text text-green">100% Pre-Op</span>
          </div>

          {/* Node 3: OT PREPARATION */}
          <div className="dept-flow-card is-active">
            <div className="dept-card-icon-glow circle-active-cyan">
              <Zap size={22} />
            </div>
            <span className="dept-title-text">OT PREP</span>
            <span className="dept-status-text text-cyan">OT-02 Suite</span>
          </div>

          {/* Node 4: CSSD STERILIZATION */}
          <div className={`dept-flow-card ${demoState.ot2Status === 'BLOCKED' ? 'is-blocked' : 'is-active'}`}>
            <div className={`dept-card-icon-glow ${demoState.ot2Status === 'BLOCKED' ? 'circle-blocked-red' : 'circle-active-cyan'}`}>
              <Package size={22} />
            </div>
            <span className="dept-title-text">CSSD STERILE</span>
            <span className={`dept-status-text text-${demoState.ot2Status === 'BLOCKED' ? 'red' : 'green'}`}>
              {demoState.ot2Status === 'BLOCKED' ? 'Pack #00421 Hold' : `Pack ${demoState.ot2Pack} Verified ✓`}
            </span>
          </div>

          {/* Node 5: SURGERY */}
          <div className={`dept-flow-card ${demoState.ot2Status === 'SURGERY' ? 'is-active' : ''}`}>
            <div className={`dept-card-icon-glow ${demoState.ot2Status === 'SURGERY' ? 'circle-active-cyan' : 'circle-future'}`}>
              <Stethoscope size={22} />
            </div>
            <span className="dept-title-text">SURGERY</span>
            <span className={`dept-status-text text-${demoState.ot2Status === 'SURGERY' ? 'cyan' : 'muted'}`}>
              {demoState.ot2Status === 'SURGERY' ? 'IN SURGERY' : 'Pending Start'}
            </span>
          </div>

          {/* Node 6: TURNOVER */}
          <div className="dept-flow-card">
            <div className="dept-card-icon-glow circle-future">
              <Timer size={22} />
            </div>
            <span className="dept-title-text">TURNOVER</span>
            <span className="dept-status-text text-muted">Upcoming</span>
          </div>
        </div>

        {/* Live Visual Connected Banner */}
        <div className="today-triad-showcase">
          <div className="hero-banner-content">
            <div className="hero-banner-badge">
              <Sparkles size={14} />
              <span>Real-Time Workflow Telemetry</span>
            </div>
            <h2 className="hero-banner-heading">
              {demoState.ot2Status === 'BLOCKED'
                ? '⚠️ Flow Interruption Detected on OT-02'
                : demoState.ot2Status === 'READY'
                ? '✓ Sterile Pack CSSD-00428 Verified for OT-02'
                : '⚡ Surgery In Progress on OT-02'}
            </h2>
            <p className="hero-banner-desc">
              {demoState.ot2Status === 'BLOCKED'
                ? 'CSSD Tray #00421 is held in autoclave cooldown. Re-assigning to Pack #00428 resolves the bottleneck instantly.'
                : demoState.ot2Status === 'READY'
                ? 'RFID telemetry confirmed Tray #00428 sterilization. OT-02 cleared for immediate incision prep.'
                : 'Procedure telemetry live for Laparoscopic Cholecystectomy (Dr. K. Patel).'}
            </p>
          </div>

          <div className="hero-graphic-wrapper">
            <img 
              src={demoState.ot2Status === 'BLOCKED' ? '/assets/images/flow_break.png' : '/assets/images/hospital_triad.png'} 
              alt="Live Flow Visual" 
              className="hero-3d-graphic"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
