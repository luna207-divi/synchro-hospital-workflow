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
  FileCheck,
  ChevronRight,
  Play,
  Fingerprint,
  QrCode,
  Activity
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import './PackDetailDrawer.css';

/**
 * CSSD Pack Detail Drawer — Full Lifecycle, Digital Identity, Verification & Actions
 */
export const PackDetailDrawer = ({ pack, onClose, workflow }) => {
  const [verifyStep, setVerifyStep] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  if (!pack) return null;

  const isExpired = pack.computedStatus === 'EXPIRED' || pack.status === 'EXPIRED' || (pack.expiry && new Date(pack.expiry) < new Date());
  const isEmergency = pack.priority === 'EMERGENCY';

  const getExpiryHours = () => {
    if (!pack.expiry) return null;
    const diff = new Date(pack.expiry) - new Date();
    return Math.round(diff / 3600000);
  };
  const expiryHrs = getExpiryHours();

  const fmtTime = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  const fmtDateFull = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Verification simulation
  const handleVerify = () => {
    if (isExpired) {
      setActionMessage({ type: 'error', text: 'VERIFICATION FAILED: Pack has expired. Cannot verify.' });
      return;
    }
    setVerifying(true);
    setVerifyStep(1);
    const steps = [1, 2, 3, 4, 5];
    steps.forEach((s, i) => {
      setTimeout(() => {
        setVerifyStep(s);
        if (s === 5) {
          setVerifying(false);
          if (workflow?.verifyPack) workflow.verifyPack(pack.id);
          setActionMessage({ type: 'success', text: `Pack ${pack.pack_code} verified successfully. All checks passed.` });
        }
      }, (i + 1) * 500);
    });
  };

  // Action handlers
  const handleReserve = () => {
    if (!workflow?.reservePackForPatient) return;
    const res = workflow.reservePackForPatient(pack.id, pack.assigned_patient || 'Ananya Rao', pack.assigned_patient_code || 'P-1042');
    if (res.success) {
      setActionMessage({ type: 'success', text: `Pack ${pack.pack_code} reserved for ${pack.assigned_patient || 'patient'}.` });
    } else {
      setActionMessage({ type: 'error', text: res.reason });
    }
  };

  const handleIssue = () => {
    if (isExpired) {
      setActionMessage({ type: 'error', text: 'BLOCKED: Expired pack cannot be issued to OT.' });
      return;
    }
    if (workflow?.issuePackToOT) workflow.issuePackToOT(pack.id, pack.assigned_ot || 'OT-02');
    setActionMessage({ type: 'success', text: `Pack ${pack.pack_code} issued to ${pack.assigned_ot || 'OT-02'}.` });
  };

  const handleMarkReturned = () => {
    if (workflow?.markPackReturned) workflow.markPackReturned(pack.id);
    setActionMessage({ type: 'success', text: `Pack ${pack.pack_code} marked as returned to CSSD.` });
  };

  const handleAdvanceLifecycle = () => {
    if (workflow?.advancePackLifecycle) {
      const res = workflow.advancePackLifecycle(pack.id);
      if (res.success) {
        setActionMessage({ type: 'success', text: `Pack ${res.packCode} advanced to ${res.newStatus.replace(/_/g, ' ')}.` });
      }
    }
  };

  const handleQuarantine = () => {
    if (workflow?.advancePackLifecycle) {
      // For expired, jump to DECONTAMINATION
      if (workflow.markPackReturned) workflow.markPackReturned(pack.id);
      setActionMessage({ type: 'success', text: `Pack ${pack.pack_code} quarantined and routed for reprocessing.` });
    }
  };

  const verifyLabels = [
    'Digital Identity',
    'Sterilization Cycle',
    'Sterility Indicators',
    'Expiry Validation',
    'Pack Integrity'
  ];

  return (
    <div className="ot-pack-drawer-backdrop" onClick={onClose}>
      <div className="ot-pack-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pack-drawer-header">
          <div className="pack-header-title-group">
            <div className="pack-id-pill font-mono">{pack.pack_code}</div>
            <span className="pack-header-sep">•</span>
            <span className="pack-rfid-chip font-mono">
              <Radio size={10} style={{ marginRight: '3px' }} />
              {pack.rfid}
            </span>
            <span className="pack-rfid-chip font-mono" style={{ marginLeft: '4px' }}>
              <QrCode size={10} style={{ marginRight: '3px' }} />
              {pack.qr}
            </span>
          </div>
          <button className="pack-drawer-close" onClick={onClose} aria-label="Close drawer" type="button">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="pack-drawer-body">
          {/* Action Messages */}
          {actionMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: actionMessage.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: actionMessage.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${actionMessage.type === 'success' ? '#86efac' : '#fca5a5'}`,
              marginBottom: '12px'
            }}>
              {actionMessage.type === 'success' ? <CheckCircle2 size={14} /> : <AlertOctagon size={14} />}
              <span>{actionMessage.text}</span>
              <button onClick={() => setActionMessage(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                <X size={12} />
              </button>
            </div>
          )}

          {/* Pack Hero Card */}
          <div className="pack-hero-card">
            <div className="pack-hero-main">
              <div className="pack-icon-wrapper">
                {isEmergency ? <Flame size={22} className="text-red" /> : <PackageCheck size={22} className="text-teal" />}
              </div>
              <div className="pack-hero-details">
                <div className="pack-title-line">
                  <h2 className="pack-type-name font-display">{pack.pack_type}</h2>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '3px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: isExpired ? '#fee2e2' : pack.status === 'STERILE' ? '#dcfce7' : pack.status === 'RESERVED' ? '#dbeafe' : pack.status === 'IN_OT' ? '#fef3c7' : '#f1f5f9',
                    color: isExpired ? '#b91c1c' : pack.status === 'STERILE' ? '#15803d' : pack.status === 'RESERVED' ? '#1e40af' : pack.status === 'IN_OT' ? '#b45309' : '#475569'
                  }}>
                    {isExpired && <AlertOctagon size={10} />}
                    {pack.status === 'STERILE' && !isExpired && <CheckCircle2 size={10} />}
                    {(isExpired ? 'EXPIRED' : pack.status).replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="pack-location-row font-mono">
                  <span><MapPin size={11} className="text-muted" /> {pack.location}</span>
                  <span>•</span>
                  <span>Specialty: <strong>{pack.specialty}</strong></span>
                  <span>•</span>
                  <span>{pack.instrument_count} instruments</span>
                </div>
              </div>
            </div>

            {/* Timing Strip */}
            <div className="pack-validity-strip font-mono">
              <div className="validity-col">
                <span className="v-label">STERILIZED</span>
                <span className="v-val">{fmtDateFull(pack.sterilized_at)}</span>
              </div>
              <div className="validity-col">
                <span className="v-label">STERILE EXPIRY</span>
                <span className={`v-val font-bold ${isExpired ? 'text-red' : expiryHrs !== null && expiryHrs <= 24 ? 'text-amber' : 'text-primary'}`}>
                  {fmtDateFull(pack.expiry)}
                  {expiryHrs !== null && !isExpired && expiryHrs <= 48 && (
                    <span style={{ fontSize: '10px', marginLeft: '6px' }}>({expiryHrs}h left)</span>
                  )}
                  {isExpired && (
                    <span style={{ fontSize: '10px', marginLeft: '6px' }}>⚠ EXPIRED</span>
                  )}
                </span>
              </div>
              <div className="validity-col">
                <span className="v-label">CYCLE</span>
                <span className="v-val">{pack.cycle || '—'}</span>
              </div>
              <div className="validity-col">
                <span className="v-label">OPERATOR</span>
                <span className="v-val">{pack.operator || '—'}</span>
              </div>
            </div>
          </div>

          {/* EXPIRED SAFETY BLOCK */}
          {isExpired && (
            <div className="expired-pack-blocked-banner">
              <div className="blocked-header">
                <AlertOctagon size={20} className="blocked-icon" />
                <div className="blocked-title-group">
                  <h3 className="blocked-headline font-display">PACK BLOCKED — EXPIRED</h3>
                  <p className="blocked-subtitle font-mono">Cannot be issued to any patient or OT.</p>
                </div>
              </div>
              <div className="blocked-desc">
                This instrument pack has exceeded its validated sterile shelf-life. OT dispatch and patient assignment are strictly locked by hospital infection prevention protocol.
              </div>
              <div className="blocked-action-row">
                <span className="font-mono" style={{ fontSize: '11px', color: '#92400e' }}>Required: Send for reprocessing →</span>
                <Button size="sm" variant="danger" icon={RotateCcw} onClick={handleQuarantine}>
                  Quarantine & Reprocess
                </Button>
              </div>
            </div>
          )}

          {/* Patient Assignment */}
          {pack.assigned_patient && (
            <div className="pack-section" style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '14px 16px' }}>
              <h4 className="pack-section-title" style={{ marginBottom: '8px' }}>
                <Fingerprint size={14} className="text-blue" />
                <span>Patient Assignment</span>
              </h4>
              <div className="autoclave-params-grid font-mono">
                <div className="param-item">
                  <span className="param-label">PATIENT</span>
                  <span className="param-val font-bold">{pack.assigned_patient}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">MRN</span>
                  <span className="param-val font-bold">{pack.assigned_patient_code}</span>
                </div>
                <div className="param-item">
                  <span className="param-label">ASSIGNED OT</span>
                  <span className="param-val font-bold text-cyan">{pack.assigned_ot}</span>
                </div>
              </div>
            </div>
          )}

          {/* Sterilization Biological Parameters */}
          <div className="pack-section">
            <h4 className="pack-section-title">
              <FileCheck size={14} className="text-teal" />
              <span>Sterilization Parameters & Verification</span>
            </h4>

            <div className="autoclave-params-grid font-mono">
              <div className="param-item">
                <span className="param-label">METHOD</span>
                <span className="param-val font-bold">{pack.sterilization_method || '134°C Steam (Pre-Vac)'}</span>
              </div>
              <div className="param-item">
                <span className="param-label">HOLD TIME</span>
                <span className="param-val">4.5 mins @ 3.1 bar</span>
              </div>
              <div className="param-item">
                <span className="param-label">BIOLOGICAL TEST</span>
                <span className={`param-val font-bold ${pack.verification?.biological ? 'text-teal' : 'text-amber'}`}>
                  {pack.verification?.biological ? '✓ PASSED (0 CFU)' : '○ Pending'}
                </span>
              </div>
              <div className="param-item">
                <span className="param-label">CHEMICAL TEST</span>
                <span className={`param-val font-bold ${pack.verification?.chemical ? 'text-teal' : 'text-amber'}`}>
                  {pack.verification?.chemical ? '✓ PASSED' : '○ Pending'}
                </span>
              </div>
              <div className="param-item">
                <span className="param-label">PACK INTEGRITY</span>
                <span className={`param-val font-bold ${pack.verification?.integrity ? 'text-teal' : isExpired ? 'text-red' : 'text-amber'}`}>
                  {pack.verification?.integrity ? '✓ Sealed' : isExpired ? '✗ Compromised' : '○ Pending'}
                </span>
              </div>
              <div className="param-item">
                <span className="param-label">VERIFIED AT</span>
                <span className="param-val">{pack.verification?.verifiedAt ? `${fmtDateFull(pack.verification.verifiedAt)} ${fmtTime(pack.verification.verifiedAt)}` : '—'}</span>
              </div>
            </div>
          </div>

          {/* Digital Verification Steps */}
          {!isExpired && (
            <div className="pack-section">
              <h4 className="pack-section-title">
                <ShieldCheck size={14} className="text-blue" />
                <span>Digital Pack Verification</span>
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
                {verifyLabels.map((label, i) => {
                  const step = i + 1;
                  const done = verifyStep >= step || pack.verification?.verified;
                  const active = verifyStep === step && verifying;
                  return (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '6px 10px', borderRadius: '6px',
                      backgroundColor: done ? '#f0fdf4' : active ? '#fffbeb' : '#f8fafc',
                      border: `1px solid ${done ? '#bbf7d0' : active ? '#fde68a' : '#e2e8f0'}`,
                      transition: 'all 0.3s ease'
                    }}>
                      <span style={{ width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, backgroundColor: done ? '#dcfce7' : active ? '#fef3c7' : '#f1f5f9', color: done ? '#15803d' : active ? '#b45309' : '#94a3b8' }}>
                        {done ? <CheckCircle2 size={12} /> : active ? <Clock size={12} /> : step}
                      </span>
                      <span className="font-mono" style={{ fontSize: '11px', fontWeight: 600, color: done ? '#15803d' : active ? '#b45309' : '#64748b' }}>
                        {label}
                      </span>
                      <span className="font-mono" style={{ marginLeft: 'auto', fontSize: '10px', color: done ? '#16a34a' : '#94a3b8' }}>
                        {done ? '✓ Verified' : active ? 'Checking...' : 'Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {!pack.verification?.verified && (
                <Button size="sm" variant="teal" icon={ShieldCheck} onClick={handleVerify} disabled={verifying}>
                  {verifying ? 'Verifying...' : 'Verify Pack'}
                </Button>
              )}
              {pack.verification?.verified && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <CheckCircle2 size={14} style={{ color: '#16a34a' }} />
                  <span className="font-mono" style={{ fontSize: '11px', fontWeight: 700, color: '#15803d' }}>PACK VERIFIED — All checks passed</span>
                </div>
              )}
            </div>
          )}

          {/* Pack Lifecycle Timeline */}
          <div className="pack-section">
            <h4 className="pack-section-title">
              <Clock size={14} className="text-blue" />
              <span>Pack Lifecycle Timeline</span>
            </h4>

            <div className="lifecycle-timeline">
              {(pack.lifecycle || []).map((evt, idx) => {
                const isLast = idx === (pack.lifecycle || []).length - 1;
                return (
                  <div key={idx} className="lifecycle-step-row">
                    <div className="lifecycle-marker-col">
                      <div className={`lifecycle-dot ${isLast ? 'dot-current' : 'dot-done'}`}>
                        {isLast ? <Activity size={10} /> : <CheckCircle2 size={10} />}
                      </div>
                      {idx < (pack.lifecycle || []).length - 1 && (
                        <div className="lifecycle-line line-done" />
                      )}
                    </div>
                    <div className="lifecycle-content-col">
                      <div className="lifecycle-step-top">
                        <span className={`lifecycle-step-name font-display ${isLast ? 'text-blue font-bold' : ''}`}>
                          {evt.event}
                        </span>
                        <span className="lifecycle-step-time font-mono">{fmtTime(evt.time)}</span>
                      </div>
                      <span className="lifecycle-step-desc font-mono">{evt.by} • {evt.location}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pack-drawer-footer">
          {isExpired ? (
            <div className="footer-blocked-notice font-mono">
              <ShieldAlert size={15} className="text-red" />
              <span>OT Assignment & Patient Dispatch Disabled: Expired Pack</span>
            </div>
          ) : (
            <div className="footer-assign-box" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {pack.status === 'STERILE' && (
                <>
                  <Button size="sm" variant="teal" icon={PackageCheck} onClick={handleReserve}>
                    Reserve for Patient
                  </Button>
                  <Button size="sm" variant="primary" icon={Building2} onClick={handleIssue}>
                    Issue to OT
                  </Button>
                </>
              )}
              {pack.status === 'RESERVED' && (
                <Button size="sm" variant="primary" icon={Building2} onClick={handleIssue}>
                  Issue to {pack.assigned_ot || 'OT'}
                </Button>
              )}
              {(pack.status === 'IN_OT' || pack.status === 'ISSUED') && (
                <Button size="sm" variant="secondary" icon={RotateCcw} onClick={handleMarkReturned}>
                  Mark Returned
                </Button>
              )}
              {['RETURN_PENDING', 'DECONTAMINATION', 'REPROCESSING', 'STERILIZING', 'VERIFICATION_PENDING'].includes(pack.status) && (
                <Button size="sm" variant="teal" icon={ChevronRight} onClick={handleAdvanceLifecycle}>
                  Advance Lifecycle →
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
