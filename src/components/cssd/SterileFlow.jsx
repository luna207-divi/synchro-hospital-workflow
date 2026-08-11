import React, { useState, useEffect } from 'react';
import { 
  Package, ShieldCheck, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, RefreshCw, QrCode, Sparkles, 
  Zap, Clock, MapPin, Stethoscope
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Button } from '../common/Button';
import './SterileFlow.css';

/* ============================================================
   SYNCHRO — STERILEFLOW (Connected Demo Mode)
   Scenario: Select CSSD-00428 & Assign to OT-02
   State 1: Select & Assign Pack CSSD-00428 to OT-02
   Animation: Pack travels from CSSD -> OT-02, updating OT-02 to READY
   ============================================================ */

export const SterileFlow = ({ onNavigateToOTControl }) => {
  const { demoState, assignPackToOT2 } = useDemo();
  const [selectedPack, setSelectedPack] = useState('CSSD-00428');

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

  const handleAssignClick = (packId) => {
    assignPackToOT2(packId);
    if (onNavigateToOTControl) {
      setTimeout(() => {
        onNavigateToOTControl();
      }, 1400);
    }
  };

  return (
    <div className="sterileflow-container">
      {/* ── 1. Top Header & Action Controls ──────────────────── */}
      <div className="sterileflow-header">
        <div className="sterileflow-title-block">
          <h1 className="sterileflow-main-title">STERILEFLOW</h1>
          <p className="sterileflow-subtitle">
            Sterile Instrument Lifecycle & RFID Telemetry.
          </p>
        </div>

        <div className="sterileflow-actions-toolbar">
          <Button variant="primary" size="sm" icon={QrCode}>
            SCAN PACK
          </Button>
        </div>
      </div>

      {/* Dispatch Signal Toast */}
      {demoState.dispatchToast && (
        <div className="live-signal-toast toast-cyan toast-inline">
          <Sparkles size={16} />
          <span>{demoState.dispatchToast}</span>
        </div>
      )}

      {/* ── 2. HERO VISUAL: Large 3D Sterile Pack Showcase ──── */}
      <div className="sterileflow-hero-card">
        <div className="sterileflow-graphic-container">
          <div className="floating-pack-tag tag-pack-id">
            <Package size={14} />
            <span>CSSD-00428</span>
          </div>

          <div className="floating-pack-tag tag-set-name">
            <Sparkles size={14} />
            <span>Lap Chole Pack B</span>
          </div>

          <div className="floating-pack-tag tag-sterile">
            <CheckCircle2 size={14} />
            <span>STERILE ✓</span>
          </div>

          <div className="floating-pack-tag tag-valid">
            <ShieldCheck size={14} />
            <span>VALID ✓ • AVAILABLE ✓</span>
          </div>

          <img 
            src="/assets/images/sterile_tray.png" 
            alt="3D Sterile Surgical Pack" 
            className="sterileflow-3d-hero-img"
          />
        </div>

        <div className="sterileflow-hero-info">
          <h2 className="sterileflow-hero-heading">Laparoscopic Cholecystectomy Pack B</h2>
          <p className="sterileflow-hero-desc">
            RFID-tagged sterile surgical instrument set. Fully sterilized via Steam Autoclave Cycle #1 and verified ready for immediate OT dispatch.
          </p>

          <div className="sterileflow-tags-row">
            <span className="badge badge-green">
              <CheckCircle2 size={12} />
              <span>Sterilization Cleared</span>
            </span>

            <span className="badge badge-cyan">
              <ShieldCheck size={12} />
              <span>RFID CSSD-00428 Verified</span>
            </span>

            <span className="badge badge-navy">
              <Clock size={12} />
              <span>Valid (22h Remaining)</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. AVAILABLE VALID PACKS SELECTION FOR OT-02 ───── */}
      <section className="scanned-section">
        <div className="section-header">
          <h2 className="section-title">Available Valid Packs for OT-02 ({demoState.procedure})</h2>
          <span className="section-count">{demoState.availablePacks.length} Valid Sets Ready</span>
        </div>

        <div className="scanned-pack-card">
          <div className="scanned-header">
            <div className="scanned-title-block">
              <CheckCircle2 size={28} className="text-green" />
              <h3 className="scanned-pack-title">
                CSSD-00428 • Laparoscopic Cholecystectomy Pack B
              </h3>
            </div>

            <span className="badge badge-green">STERILE & AVAILABLE</span>
          </div>

          <div className="scanned-details-grid">
            <div className="detail-tile">
              <span className="tile-label">Pack ID</span>
              <span className="tile-value">CSSD-00428</span>
            </div>

            <div className="detail-tile">
              <span className="tile-label">Sterilization Status</span>
              <span className="tile-value text-green">Autoclave #1 Verified</span>
            </div>

            <div className="detail-tile">
              <span className="tile-label">Validity</span>
              <span className="tile-value text-navy">Valid • 22h Remaining</span>
            </div>

            <div className="detail-tile">
              <span className="tile-label">Current Location</span>
              <span className="tile-value">CSSD Sterile Bay 2</span>
            </div>
          </div>

          <div className="assignment-bar">
            <span className="assignment-text">
              {demoState.ot2Status === 'BLOCKED' 
                ? '⚠️ OT-02 BLOCKED — Assign CSSD-00428 to resolve autoclave cooldown blockage'
                : `✓ PACK ASSIGNED — Pack CSSD-00428 Dispatched to OT-02`}
            </span>
            
            <Button 
              variant="primary" 
              size="md" 
              icon={ArrowRight} 
              onClick={() => handleAssignClick('CSSD-00428')}
              disabled={demoState.isDispatching}
            >
              {demoState.isDispatching ? 'Dispatching Pack...' : 'Assign CSSD-00428 to OT-02 →'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
