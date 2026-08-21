import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, 
  Activity, User, Stethoscope, Package, AlertTriangle, 
  XCircle, Clock, Zap, ChevronRight, Layers, Workflow, BarChart3, Timer
} from 'lucide-react';
import { SynchroLogo } from '../common/SynchroLogo';
import { Button } from '../common/Button';
import './LandingPage.css';

/* ============================================================
   SYNCHRO — Premium Healthcare Technology Landing Page
   "Hospital Workflow, In Sync."
   ============================================================ */

export const LandingPage = ({ onEnterPlatform }) => {
  const navigate = useNavigate();

  const handleEnter = (e) => {
    if (typeof onEnterPlatform === 'function') return onEnterPlatform(e);
    navigate('/login');
  };

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
    <div className="synchro-landing">
      {/* ── 1. Top Navigation Bar ────────────────────────────── */}
      <header className="landing-nav">
        <div className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
          <SynchroLogo size="md" variant="dark" />
        </div>

        <div className="landing-nav-actions">
          <Button variant="primary" size="sm" onClick={handleEnter}>
            Sign In
          </Button>
        </div>
      </header>

      {/* ── 2. HERO SECTION (Visual-First, NOT a Dashboard!) ──── */}
      <section className="landing-hero">
        {/* Left Column Text */}
        <div className="hero-left-col">
          <div className="hero-brand-pill">
            <Sparkles size={14} />
            <span>SYNCHRO HEALTHCARE PLATFORM</span>
          </div>

          <h1 className="hero-main-title">
            Hospital Workflow, <br />
            <span className="hero-title-accent">In Sync.</span>
          </h1>

          <p className="hero-subtext">
            One intelligent workflow connecting patients, doctors, operating theatres and sterile services.
          </p>

          <div className="hero-cta-row">
            <Button variant="primary" size="lg" icon={ArrowRight} onClick={handleEnter}>
              Sign In
            </Button>
            <Button variant="secondary" size="lg" icon={ArrowRight} onClick={handleEnter}>
              Log In
            </Button>
          </div>
        </div>

        {/* Right Column 3D Visual Composition + Floating Tags */}
        <div className="hero-right-visual">
          <div className="hero-composition-card">
            {/* Floating Visual Tags */}
            <div className="hero-tag-card tag-pos-1">
              <span className="tag-dot-green" />
              <span>PATIENT READY</span>
            </div>

            <div className="hero-tag-card tag-pos-2">
              <CheckCircle2 size={14} />
              <span>OT-02 READY</span>
            </div>

            <div className="hero-tag-card tag-pos-3">
              <ShieldCheck size={14} />
              <span>CSSD PACK VERIFIED</span>
            </div>

            <div className="hero-tag-card tag-pos-4">
              <span className="tag-dot-cyan" />
              <span>LIVE</span>
            </div>

            {/* Main 3D Hospital Graphic */}
            <img 
              src="/assets/images/landing_hero.png" 
              alt="Synchro Connected Hospital Visual" 
              className="hero-3d-main-img"
            />
          </div>
        </div>
      </section>

      {/* ── 3. SECTION: "One Hospital. One Flow." ────────────── */}
      <section className="landing-section">
        <div className="section-title-center">
          <h2 className="section-head-title">One Hospital. One Flow.</h2>
          <p className="section-head-sub">
            Synchronizing the three critical pillars of surgical operations.
          </p>
        </div>

        <div className="triad-cards-grid">
          {/* Card 1: PATIENTS */}
          <div className="triad-card scroll-reveal">
            <div className="triad-card-img-box">
              <img src="/assets/images/patient_journey.png" alt="Patients Flow" className="triad-card-img" />
            </div>
            <div className="triad-card-body">
              <span className="triad-card-tag">Pillar 01</span>
              <h3 className="triad-card-heading">PATIENTS</h3>
              <p className="triad-card-text">
                Pre-flight intake clearance, EMR consent verification, and instant transfer readiness notifications.
              </p>
            </div>
          </div>

          {/* Card 2: OPERATING THEATRES */}
          <div className="triad-card scroll-reveal">
            <div className="triad-card-img-box">
              <img src="/assets/images/operating_theatre.png" alt="OT Flow" className="triad-card-img" />
            </div>
            <div className="triad-card-body">
              <span className="triad-card-tag">Pillar 02</span>
              <h3 className="triad-card-heading">OPERATING THEATRES</h3>
              <p className="triad-card-text">
                Real-time room occupancy telemetry, surgical team prep tracking, and turnover benchmark analysis.
              </p>
            </div>
          </div>

          {/* Card 3: CSSD */}
          <div className="triad-card scroll-reveal">
            <div className="triad-card-img-box">
              <img src="/assets/images/sterile_tray.png" alt="CSSD Flow" className="triad-card-img" />
            </div>
            <div className="triad-card-body">
              <span className="triad-card-tag">Pillar 03</span>
              <h3 className="triad-card-heading">CSSD</h3>
              <p className="triad-card-text">
                RFID sterile tray lifecycle tracking, autoclave cooldown compliance, and instrument pack delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. SECTION: "Where the Flow Breaks" ──────────────── */}
      <section className="landing-section">
        <div className="section-title-center">
          <h2 className="section-head-title">Where the Flow Breaks</h2>
          <p className="section-head-sub">
            Traditional hospital systems operate in silos. Synchro pinpoints friction before incision.
          </p>
        </div>

        <div className="breaks-grid">
          <div className="break-card scroll-reveal">
            <div className="break-icon-box">
              <XCircle size={20} />
            </div>
            <h3 className="break-title">Patient Not Ready</h3>
            <p className="break-desc">
              Missing consent signature or incomplete pre-op intake holds up patient transport.
            </p>
          </div>

          <div className="break-card scroll-reveal">
            <div className="break-icon-box">
              <AlertTriangle size={20} />
            </div>
            <h3 className="break-title">Instrument Unavailable</h3>
            <p className="break-desc">
              Sterile pack delayed in autoclave cooldown causes last-minute surgical delays.
            </p>
          </div>

          <div className="break-card scroll-reveal">
            <div className="break-icon-box">
              <Clock size={20} />
            </div>
            <h3 className="break-title">OT Delayed</h3>
            <p className="break-desc">
              Turnover time exceeds benchmark due to uncoordinated sanitation dispatch.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION: "Synchro connects the dots." ─────────── */}
      <section className="landing-section">
        <div className="section-title-center">
          <h2 className="section-head-title">Synchro connects the dots.</h2>
          <p className="section-head-sub">
            A continuous, intelligent pipeline from admission to post-op turnover.
          </p>
        </div>

        <div className="animated-flow-banner scroll-reveal">
          <div className="journey-track-row">
            {/* Stage 1 */}
            <div className="journey-node-item">
              <div className="journey-node-circle">
                <User size={20} />
              </div>
              <span className="journey-node-label">ADMISSION</span>
            </div>

            <svg className="journey-connector-line" viewBox="0 0 70 6">
              <line x1="0" y1="3" x2="70" y2="3" className="connector-line-active" />
            </svg>

            {/* Stage 2 */}
            <div className="journey-node-item">
              <div className="journey-node-circle">
                <CheckCircle2 size={20} />
              </div>
              <span className="journey-node-label">READY</span>
            </div>

            <svg className="journey-connector-line" viewBox="0 0 70 6">
              <line x1="0" y1="3" x2="70" y2="3" className="connector-line-active" />
            </svg>

            {/* Stage 3 */}
            <div className="journey-node-item">
              <div className="journey-node-circle">
                <Zap size={20} />
              </div>
              <span className="journey-node-label">OT</span>
            </div>

            <svg className="journey-connector-line" viewBox="0 0 70 6">
              <line x1="0" y1="3" x2="70" y2="3" className="connector-line-active" />
            </svg>

            {/* Stage 4 */}
            <div className="journey-node-item">
              <div className="journey-node-circle">
                <Package size={20} />
              </div>
              <span className="journey-node-label">CSSD</span>
            </div>

            <svg className="journey-connector-line" viewBox="0 0 70 6">
              <line x1="0" y1="3" x2="70" y2="3" className="connector-line-active" />
            </svg>

            {/* Stage 5 */}
            <div className="journey-node-item">
              <div className="journey-node-circle">
                <Stethoscope size={20} />
              </div>
              <span className="journey-node-label">SURGERY</span>
            </div>

            <svg className="journey-connector-line" viewBox="0 0 70 6">
              <line x1="0" y1="3" x2="70" y2="3" className="connector-line-active" />
            </svg>

            {/* Stage 6 */}
            <div className="journey-node-item">
              <div className="journey-node-circle">
                <Timer size={20} />
              </div>
              <span className="journey-node-label">TURNOVER</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. SECTION: "Built around real hospital workflows." ─ */}
      <section className="landing-section">
        <div className="section-title-center">
          <h2 className="section-head-title">Built around real hospital workflows.</h2>
          <p className="section-head-sub">
            Purpose-built modules for specialized hospital teams.
          </p>
        </div>

        <div className="modules-grid">
          <div className="module-card scroll-reveal">
            <div className="module-icon-box">
              <User size={20} />
            </div>
            <h3 className="module-title">Patient Readiness</h3>
            <p className="module-desc">
              Pre-flight gate clearance, consent tracking, and patient transport coordination.
            </p>
          </div>

          <div className="module-card scroll-reveal">
            <div className="module-icon-box">
              <Stethoscope size={20} />
            </div>
            <h3 className="module-title">OT Control</h3>
            <p className="module-desc">
              Live room telemetry, surgical suite occupancy, and automated delay alerts.
            </p>
          </div>

          <div className="module-card scroll-reveal">
            <div className="module-icon-box">
              <Package size={20} />
            </div>
            <h3 className="module-title">SterileFlow</h3>
            <p className="module-desc">
              CSSD instrument RFID tracking, autoclave cooldown compliance, and pack delivery.
            </p>
          </div>

          <div className="module-card scroll-reveal">
            <div className="module-icon-box">
              <BarChart3 size={20} />
            </div>
            <h3 className="module-title">Workflow Intelligence</h3>
            <p className="module-desc">
              Delay root-cause correlation engine, turnaround analytics, and executive reporting.
            </p>
          </div>
        </div>
      </section>

      {/* ── 7. FINAL HERO CTA SECTION: "Everything in sync." ─── */}
      <section className="landing-cta-banner">
        <h2 className="landing-cta-title">Everything in sync.</h2>
        <p className="landing-cta-sub">
          Experience the next generation of hospital workflow automation.
        </p>
        <Button variant="primary" size="lg" icon={ArrowRight} onClick={handleEnter}>
          Sign In
        </Button>
      </section>
    </div>
  );
};
