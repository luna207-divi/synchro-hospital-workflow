import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PackageCheck, 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Thermometer, 
  Calendar, 
  MapPin, 
  Layers, 
  Sparkles, 
  RotateCcw, 
  AlertOctagon, 
  ArrowRight,
  Flame,
  Radio,
  FileCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './PackDetailDrawer.css';

/**
 * Detailed CSSD Instrument Pack Lifecycle Drawer
 * Displays the complete 8-stage lifecycle, autoclave parameters, sterility validation certificate,
 * expired safety blocking banner, and interactive OT suite assignment.
 */
export const PackDetailDrawer = ({ pack, onClose, onAssignOT, onQuarantine }) => {
  const [selectedSuite, setSelectedSuite] = useState(pack?.assignedOT !== 'Unassigned' ? pack?.assignedOT : 'OT-01');
  const [assignSuccess, setAssignSuccess] = useState(false);

  if (!pack) return null;

  const isExpired = pack.sterilizationStatus === 'Expired' || pack.isExpired;

  const lifecycleStages = [
    { name: 'Collected', status: 'done', time: 'Aug 09 • 04:30 PM', by: 'CSSD Logistics Porter', location: 'OT Clean Core 2' },
    { name: 'Cleaning', status: 'done', time: 'Aug 09 • 05:15 PM', by: 'Enzymatic Ultrasonic Bath #3', location: 'Decontamination Zone' },
    { name: 'Sterilization', status: isExpired ? 'done' : 'done', time: `${pack.sterilizedOn} • 06:45 AM`, by: 'Pre-Vacuum Autoclave #02 (134°C Steam)', location: 'Sterilization Core' },
    { name: 'Quality Check', status: isExpired ? 'flagged' : 'done', time: `${pack.sterilizedOn} • 07:40 AM`, by: 'Dual Biological Spore Test Cleared', location: 'Sterile Inspection Desk' },
    { name: 'Sterile Storage', status: isExpired ? 'flagged' : pack.currentStageIdx >= 4 ? 'current' : 'upcoming', time: `${pack.sterilizedOn} • 08:00 AM`, by: 'Barcoded Shelf Location: Storage A', location: pack.location },
    { name: 'Assigned to OT', status: isExpired ? 'blocked' : pack.assignedOT !== 'Unassigned' ? 'done' : 'upcoming', time: pack.assignedOT !== 'Unassigned' ? 'Today • 09:30 AM' : 'Pending Allocation', by: pack.assignedOT !== 'Unassigned' ? `Assigned to ${pack.assignedOT}` : 'Awaiting Surgeon Request', location: pack.assignedOT !== 'Unassigned' ? pack.assignedOT : 'None' },
    { name: 'Used', status: 'upcoming', time: 'Scheduled for Case', by: 'Surgical Team In Room', location: pack.assignedOT !== 'Unassigned' ? pack.assignedOT : 'OT Core' },
    { name: 'Returned', status: 'upcoming', time: 'Post-Op Return', by: 'Closed Return Cart', location: 'Decon Intake' }
  ];

  const handleAssign = () => {
    if (isExpired) return;
    setAssignSuccess(true);
    if (onAssignOT) {
      onAssignOT(pack.id, selectedSuite);
    }
  };

  return (
    <div className="ot-pack-drawer-backdrop" onClick={onClose}>
      <div className="ot-pack-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pack-drawer-header">
          <div className="pack-header-title-group">
            <div className="pack-id-pill font-mono">{pack.id}</div>
            <span className="pack-header-sep">•</span>
            <span className="pack-rfid-chip font-mono">RFID #99824-A</span>
          </div>
          <button className="pack-drawer-close" onClick={onClose} aria-label="Close drawer" type="button">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="pack-drawer-body">
          {/* Pack Hero Info Card */}
          <div className="pack-hero-card">
            <div className="pack-hero-main">
              <div className="pack-icon-wrapper">
                <PackageCheck size={22} className="text-teal" />
              </div>
              <div className="pack-hero-details">
                <div className="pack-title-line">
                  <h2 className="pack-type-name font-display">{pack.type}</h2>
                  <span className={`pack-status-badge badge-${pack.sterilizationStatus.toLowerCase().replace(' ', '-')}`}>
                    {pack.sterilizationStatus}
                  </span>
                </div>
                <div className="pack-location-row font-mono">
                  <span><MapPin size={11} className="text-muted" /> Location: <strong>{pack.location}</strong></span>
                  <span>•</span>
                  <span>Assigned: <strong>{pack.assignedOT}</strong></span>
                </div>
              </div>
            </div>

            {/* Timing & Validity Strip */}
            <div className="pack-validity-strip font-mono">
              <div className="validity-col">
                <span className="v-label">STERILIZED ON</span>
                <span className="v-val">{pack.sterilizedOn}</span>
              </div>
              <div className="validity-col">
                <span className="v-label">STERILE EXPIRY</span>
                <span className={`v-val font-bold ${isExpired ? 'text-red' : 'text-primary'}`}>
                  {pack.expiry}
                </span>
              </div>
              <div className="validity-col">
                <span className="v-label">CYCLE NUMBER</span>
                <span className="v-val">CYCLE #284-A</span>
              </div>
            </div>
          </div>

          {/* CRITICAL EXPIRED SAFETY WARNING BANNER (Strong, Professional Block) */}
          {isExpired && (
            <div className="expired-pack-blocked-banner">
              <div className="blocked-header">
                <AlertOctagon size={20} className="blocked-icon" />
                <div className="blocked-title-group">
                  <h3 className="blocked-headline font-display">PACK BLOCKED</h3>
                  <p className="blocked-subtitle font-mono">Sterile validity expired.</p>
                </div>
              </div>
              <div className="blocked-desc">
                This instrument pack exceeded its maximum 72-hour validated sterile shelf-life. Dispatch to any operating theatre is strictly locked by hospital infection prevention protocol.
              </div>
              <div className="blocked-action-row">
                <Button 
                  size="sm" 
                  variant="danger" 
                  icon={RotateCcw}
                  onClick={() => {
                    alert(`Tray ${pack.id} quarantined and routed to Decontamination Intake for re-sterilization.`);
                    if (onQuarantine) onQuarantine(pack.id);
                  }}
                >
                  Quarantine & Reprocess Tray
                </Button>
              </div>
            </div>
          )}

          {/* Autoclave & Sterility Physical Validation */}
          <div className="pack-section">
            <h4 className="pack-section-title">
              <FileCheck size={14} className="text-teal" />
              <span>Sterilization Biological Parameters</span>
            </h4>

            <div className="autoclave-params-grid font-mono">
              <div className="param-item">
                <span className="param-label">METHOD</span>
                <span className="param-val font-bold">134°C Steam (Pre-Vac)</span>
              </div>
              <div className="param-item">
                <span className="param-label">HOLD TIME</span>
                <span className="param-val">4.5 mins @ 3.1 bar</span>
              </div>
              <div className="param-item">
                <span className="param-label">SPORE TEST</span>
                <span className={`param-val ${isExpired ? 'text-red font-bold' : 'text-teal font-bold'}`}>
                  {isExpired ? 'VALIDITY EXPIRED' : 'PASSED (0 CFU)'}
                </span>
              </div>
              <div className="param-item">
                <span className="param-label">OPERATOR ID</span>
                <span className="param-val">TECH-409 (M. Vance)</span>
              </div>
            </div>
          </div>

          {/* Complete 8-Stage Lifecycle Timeline */}
          <div className="pack-section">
            <h4 className="pack-section-title">
              <Clock size={14} className="text-blue" />
              <span>Complete 8-Stage Instrument Lifecycle</span>
            </h4>

            <div className="lifecycle-timeline">
              {lifecycleStages.map((stg, idx) => {
                const isStepDone = stg.status === 'done';
                const isStepCurrent = stg.status === 'current';
                const isStepFlagged = stg.status === 'flagged';
                const isStepBlocked = stg.status === 'blocked';

                return (
                  <div key={stg.name} className="lifecycle-step-row">
                    <div className="lifecycle-marker-col">
                      <div className={`lifecycle-dot ${isStepBlocked ? 'dot-blocked' : isStepFlagged ? 'dot-flagged' : isStepDone ? 'dot-done' : isStepCurrent ? 'dot-current' : 'dot-upcoming'}`}>
                        {isStepDone && <CheckCircle2 size={10} />}
                        {isStepFlagged && <AlertTriangle size={10} />}
                        {isStepBlocked && <X size={10} />}
                        {!isStepDone && !isStepFlagged && !isStepBlocked && <span>{idx + 1}</span>}
                      </div>
                      {idx < lifecycleStages.length - 1 && (
                        <div className={`lifecycle-line ${isStepDone ? 'line-done' : ''}`} />
                      )}
                    </div>

                    <div className="lifecycle-content-col">
                      <div className="lifecycle-step-top">
                        <span className={`lifecycle-step-name font-display ${isStepCurrent ? 'text-blue font-bold' : ''}`}>
                          {stg.name}
                        </span>
                        <span className="lifecycle-step-time font-mono">{stg.time}</span>
                      </div>
                      <span className="lifecycle-step-desc font-mono">{stg.by} • {stg.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions: OT Assignment for Valid Packs, Blocked for Expired */}
        <div className="pack-drawer-footer">
          {isExpired ? (
            <div className="footer-blocked-notice font-mono">
              <ShieldAlert size={15} className="text-red" />
              <span>OT Assignment Disabled: Expired Pack</span>
            </div>
          ) : (
            <div className="footer-assign-box">
              <div className="assign-select-wrapper">
                <span className="assign-label font-mono">ASSIGN TO OT:</span>
                <select 
                  value={selectedSuite}
                  onChange={(e) => setSelectedSuite(e.target.value)}
                  className="ot-select-dropdown font-mono"
                  disabled={assignSuccess}
                >
                  <option value="OT-01">OT-01 (Orthopedics)</option>
                  <option value="OT-02">OT-02 (General)</option>
                  <option value="OT-03">OT-03 (Sports Med)</option>
                  <option value="OT-04">OT-04 (Cardiovascular)</option>
                </select>
              </div>

              <Button
                size="sm"
                variant="teal"
                icon={Building2}
                onClick={handleAssign}
                disabled={assignSuccess}
              >
                {assignSuccess ? `Assigned to ${selectedSuite}` : 'Assign to OT'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
