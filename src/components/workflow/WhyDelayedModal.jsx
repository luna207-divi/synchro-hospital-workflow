import React from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  UserCheck, 
  PackageCheck, 
  Activity, 
  Clock, 
  CheckCircle2, 
  ShieldCheck,
  GitMerge,
  Layers
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './WhyDelayedModal.css';

/**
 * 'Why was this delayed?' Correlation Diagnostic Modal
 * Demonstrates how OTFlow AI correlates multi-department upstream dependencies:
 * CSSD Autoclave Hold + Admissions Porter Lag -> OT Incision Delay
 */
export const WhyDelayedModal = ({ isOpen, onClose, bottleneck }) => {
  if (!isOpen) return null;

  const sampleCorrelation = {
    title: bottleneck?.name || 'CSSD Pack Availability & Patient Transfer Desynchronization',
    primaryDelay: '+22m Delay in OT-03 Start Time',
    primaryCase: 'Case #1026 • Marcus Chen (MRN-3318) • ACL Reconstruction',
    rootCauses: [
      {
        department: 'CSSD',
        pillar: 'teal',
        icon: PackageCheck,
        title: 'Autoclave Cooldown Lag (+14m)',
        timestamp: '09:15 AM',
        desc: 'Autoclave #2 biological spore cooling cycle was delayed by 14 mins due to high-heat chamber purge overrun. Orthopedic Power Tool Tray #04 was locked in chamber.',
        source: 'Steris Autoclave #2 IoT Sensor'
      },
      {
        department: 'Admissions',
        pillar: 'blue',
        icon: UserCheck,
        title: 'Porter Reassignment Hold (+8m)',
        timestamp: '09:40 AM',
        desc: 'Assigned transport porter was rerouted to emergency radiology case in 4C. Patient Marcus Chen was ready in Pre-Op Bay 2 but transfer command queued.',
        source: 'RFID Porter Beacon #14'
      },
      {
        department: 'Operating Theatres',
        pillar: 'indigo',
        icon: Activity,
        title: 'Surgical Team Idle in OT-03 (+22m Total)',
        timestamp: '10:00 AM',
        desc: 'Surgical time-out delayed from 10:00 AM to 10:22 AM awaiting both sterile tray release and patient wheel-in simultaneously.',
        source: 'OT-03 Surgical Console'
      }
    ],
    cascadeImpact: [
      'Next scheduled case (OT-03, 12:00 PM) projected to start 18m behind schedule',
      'Surgeon Dr. J. Gomez schedule compressed into afternoon clinic',
      'PACU Recovery Bed #4 reservation shifted by +25m'
    ],
    aiRecommendation: {
      action: 'Automated Triad Pre-Warning Protocol',
      desc: 'Deploy predictive fast-track buffer: When an autoclave cooling lag exceeds 5m, automatically alert Admissions to pause transport order and stage backup Tray #99-B from Reserve Vault.'
    }
  };

  return (
    <div className="ot-modal-backdrop" onClick={onClose}>
      <div className="ot-correlation-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="correlation-modal-header">
          <div className="corr-title-group">
            <div className="corr-ai-badge">
              <Sparkles size={16} className="text-purple" />
            </div>
            <div>
              <div className="corr-top-line">
                <span className="corr-tag font-mono">CROSS-DEPARTMENT CORRELATION ENGINE</span>
                <span className="corr-sep">•</span>
                <span className="corr-case font-mono">{sampleCorrelation.primaryCase}</span>
              </div>
              <h3 className="corr-headline font-display">Why Was This Delayed?</h3>
            </div>
          </div>
          <button className="corr-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="correlation-modal-body">
          {/* Top Symptom Banner */}
          <div className="corr-symptom-banner">
            <div className="symptom-left">
              <AlertTriangle size={18} className="text-red flex-shrink-0" />
              <div>
                <span className="symptom-label font-mono">PRIMARY OBSERVED DELAY:</span>
                <h4 className="symptom-title font-display">{sampleCorrelation.primaryDelay}</h4>
              </div>
            </div>
            <Badge variant="red" size="sm">Delayed Start</Badge>
          </div>

          {/* Connected Multi-Department Root Cause Flow */}
          <div className="corr-section">
            <h4 className="corr-section-heading font-mono">
              <GitMerge size={14} className="text-purple" />
              <span>UPSTREAM EVENT CAUSAL CHAIN (3 DEPARTMENTS CONNECTED)</span>
            </h4>

            <div className="causal-chain-list">
              {sampleCorrelation.rootCauses.map((rc, idx) => {
                const Icon = rc.icon;
                return (
                  <div key={idx} className={`causal-node-card border-pillar-${rc.pillar}`}>
                    <div className="causal-node-header">
                      <div className="causal-dept-tag">
                        <Badge variant={rc.pillar} size="xs">{rc.department}</Badge>
                        <span className="causal-time font-mono">{rc.timestamp}</span>
                      </div>
                      <span className="causal-source font-mono">{rc.source}</span>
                    </div>

                    <div className="causal-node-body">
                      <div className="causal-title-row">
                        <Icon size={14} className={`text-${rc.pillar}`} />
                        <h5 className="causal-step-title font-display">{rc.title}</h5>
                      </div>
                      <p className="causal-step-desc">{rc.desc}</p>
                    </div>

                    {idx < sampleCorrelation.rootCauses.length - 1 && (
                      <div className="causal-connector-arrow">
                        <div className="arrow-line" />
                        <span className="arrow-text font-mono">CAUSES UPSTREAM DELAY IN</span>
                        <div className="arrow-line" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Downstream Ripple Effects */}
          <div className="corr-section">
            <h4 className="corr-section-heading font-mono">
              <Layers size={14} className="text-indigo" />
              <span>DOWNSTREAM SYSTEM CASCADE IMPACT</span>
            </h4>

            <ul className="impact-bullets-list font-mono">
              {sampleCorrelation.cascadeImpact.map((imp, i) => (
                <li key={i} className="impact-bullet-item">
                  <span className="bullet-dot">•</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Recommended Mitigation */}
          <div className="corr-ai-recommendation-box">
            <div className="rec-top">
              <Sparkles size={16} className="text-purple" />
              <strong className="rec-title font-display">{sampleCorrelation.aiRecommendation.action}</strong>
            </div>
            <p className="rec-desc">{sampleCorrelation.aiRecommendation.desc}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="correlation-modal-footer">
          <Button size="sm" variant="secondary" onClick={onClose}>
            Close Root Cause
          </Button>
          <Button 
            size="sm" 
            variant="primary" 
            icon={ShieldCheck}
            onClick={() => {
              alert('AI Mitigation Rule applied: Automated Cross-Department Buffer activated for OT-03 and CSSD Autoclave #2.');
              onClose();
            }}
          >
            Apply AI Mitigation Rule
          </Button>
        </div>
      </div>
    </div>
  );
};
