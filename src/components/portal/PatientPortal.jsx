import React, { useEffect } from 'react';
import { 
  CheckCircle2, User, Clock, MapPin, Stethoscope, 
  ShieldCheck, FileText, Activity, PhoneCall, HelpCircle, 
  ArrowRight, Sparkles, HeartPulse
} from 'lucide-react';
import { Button } from '../common/Button';
import './PatientPortal.css';

/* ============================================================
   SYNCHRO — Reassuring & Friendly Patient Portal
   "Your care journey is on track."
   ============================================================ */

const TIMELINE_STEPS = [
  { id: 's1', title: 'ADMISSION',    status: 'done',   label: 'Completed' },
  { id: 's2', title: 'PREPARATION',  status: 'done',   label: 'Completed' },
  { id: 's3', title: 'READY FOR OT', status: 'active', label: 'In Progress' },
  { id: 's4', title: 'SURGERY',      status: 'future', label: 'Upcoming' },
  { id: 's5', title: 'RECOVERY',     status: 'future', label: 'Upcoming' },
];

const CARE_TEAM = [
  {
    id: 't1',
    name: 'Dr. R. Sharma',
    role: 'Chief Surgical Lead',
    initials: 'RS',
    avatarBg: 'rgba(6, 182, 212, 0.12)'
  },
  {
    id: 't2',
    name: 'Dr. A. Miller',
    role: 'Lead Anesthesiologist',
    initials: 'AM',
    avatarBg: 'rgba(37, 99, 235, 0.12)'
  },
  {
    id: 't3',
    name: 'Nurse S. Jenkins',
    role: 'Pre-Op Care Coordinator',
    initials: 'SJ',
    avatarBg: 'rgba(16, 185, 129, 0.12)'
  }
];

export const PatientPortal = () => {
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
    <div className="patient-portal">
      {/* ── 1. Reassuring Top Greeting Header ────────────────── */}
      <div className="patient-header-bar">
        <div className="patient-greeting-block">
          <h1 className="patient-greeting-title">Good morning, Sarah</h1>
          <p className="patient-greeting-sub">
            <CheckCircle2 size={18} className="sub-check-icon" />
            <span>Your care journey is on track.</span>
          </p>
        </div>
        <div className="patient-status-chip">
          <HeartPulse size={14} />
          <span>Active Case • Pavilion B</span>
        </div>
      </div>

      {/* ── 2. HERO VISUAL: MY CARE JOURNEY (Timeline) ───────── */}
      <div className="patient-journey-card">
        <div className="patient-journey-top">
          <div className="patient-journey-badge">
            <Sparkles size={14} />
            <span>Real-time Patient Journey</span>
          </div>
          <h2 className="patient-journey-title">MY CARE JOURNEY</h2>
        </div>

        {/* 5-Node Visual Timeline */}
        <div className="patient-timeline-track">
          {TIMELINE_STEPS.map((step, idx) => {
            let circleClass = 'node-future';
            if (step.status === 'done') circleClass = 'node-done';
            if (step.status === 'active') circleClass = 'node-active-pulse';

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && (
                  <svg className="patient-path-svg" viewBox="0 0 80 6">
                    <line 
                      x1="0" 
                      y1="3" 
                      x2="80" 
                      y2="3" 
                      className={
                        idx <= 2 ? 'connector-line-done' : 'connector-line-future'
                      } 
                    />
                  </svg>
                )}

                <div className="patient-node-box">
                  <div className={`patient-node-circle ${circleClass}`}>
                    {step.status === 'done' ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <span className="font-mono text-sm font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span className="patient-node-title">{step.title}</span>
                  <span className={`patient-node-state text-${step.status === 'done' ? 'green' : step.status === 'active' ? 'cyan' : 'muted'}`}>
                    {step.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── 3. SECTION: NEXT STEP LARGE CARD ─────────────────── */}
      <section className="next-step-section">
        <div className="section-header">
          <h2 className="section-title">Next Step</h2>
        </div>

        <div className="next-step-card scroll-reveal">
          <div className="next-step-left">
            <span className="next-step-tag">Next Up</span>
            <h3 className="next-step-heading">Pre-operative preparation</h3>

            <div className="next-step-details-grid">
              <div className="detail-item-pair">
                <div className="detail-icon-box">
                  <Clock size={16} />
                </div>
                <div className="detail-text-block">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">11:30 AM</span>
                </div>
              </div>

              <div className="detail-item-pair">
                <div className="detail-icon-box">
                  <MapPin size={16} />
                </div>
                <div className="detail-text-block">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">Pre-Op Suite 3, Pavilion B</span>
                </div>
              </div>

              <div className="detail-item-pair">
                <div className="detail-icon-box">
                  <Stethoscope size={16} />
                </div>
                <div className="detail-text-block">
                  <span className="detail-label">Lead Doctor</span>
                  <span className="detail-value">Dr. R. Sharma</span>
                </div>
              </div>

              <div className="detail-item-pair">
                <div className="detail-icon-box">
                  <Activity size={16} />
                </div>
                <div className="detail-text-block">
                  <span className="detail-label">Assigned Suite</span>
                  <span className="detail-value">Operating Suite 04</span>
                </div>
              </div>
            </div>

            <Button variant="primary" size="md" icon={ArrowRight}>
              View Details
            </Button>
          </div>

          <img 
            src="/assets/images/patient_journey.png" 
            alt="Pre-op preparation visual" 
            className="next-step-right-img"
          />
        </div>
      </section>

      {/* ── 4. SECTION: TODAY'S STATUS ───────────────────────── */}
      <section className="today-status-section">
        <div className="section-header">
          <h2 className="section-title">Today's Status</h2>
        </div>

        <div className="patient-status-grid">
          <div className="status-simple-card scroll-reveal">
            <div className="status-card-icon-wrapper icon-green">
              <CheckCircle2 size={24} />
            </div>
            <div className="status-card-info">
              <h4 className="status-card-title">Patient Ready</h4>
              <span className="status-card-state">100% Pre-op Cleared</span>
            </div>
          </div>

          <div className="status-simple-card scroll-reveal">
            <div className="status-card-icon-wrapper icon-blue">
              <FileText size={24} />
            </div>
            <div className="status-card-info">
              <h4 className="status-card-title">Documents</h4>
              <span className="status-card-state">EMR Consent Signed</span>
            </div>
          </div>

          <div className="status-simple-card scroll-reveal">
            <div className="status-card-icon-wrapper icon-cyan">
              <Activity size={24} />
            </div>
            <div className="status-card-info">
              <h4 className="status-card-title">OT Status</h4>
              <span className="status-card-state">On Schedule for 11:30 AM</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. SECTION: YOUR CARE TEAM ───────────────────────── */}
      <section className="care-team-section">
        <div className="section-header">
          <h2 className="section-title">Your Care Team</h2>
        </div>

        <div className="team-grid">
          {CARE_TEAM.map(doc => (
            <div key={doc.id} className="team-doctor-card scroll-reveal">
              <div className="doctor-avatar-box" style={{ background: doc.avatarBg }}>
                {doc.initials}
              </div>
              <div className="doctor-info-block">
                <span className="doctor-name">{doc.name}</span>
                <span className="doctor-role">{doc.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. SECTION: NEED HELP? FRIENDLY SUPPORT CARD ────── */}
      <section className="support-section">
        <div className="support-banner-card scroll-reveal">
          <div className="support-left-block">
            <h3 className="support-heading">Have a question about your care?</h3>
            <p className="support-sub">
              Our patient care team is available 24/7 to reassure you and answer any questions.
            </p>
          </div>
          <Button variant="secondary" size="md" icon={PhoneCall}>
            Contact Care Team
          </Button>
        </div>
      </section>
    </div>
  );
};
