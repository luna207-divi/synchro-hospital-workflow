import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Barcode, 
  ArrowRight,
  PackageCheck,
  AlertOctagon,
  ShieldCheck,
  Building2,
  FileCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import './ScanPackModal.css';

/**
 * Digital Scan Pack Modal Component
 * Simulates handheld RFID and 2D DataMatrix scanner in hospital CSSD & surgical suites.
 * Validates digital identity, sterility, expiry, procedure compatibility, and OT readiness.
 */
export const ScanPackModal = ({ isOpen, onClose, onPackScanned, availablePacks, workflow }) => {
  const [scanInput, setScanInput] = useState('');
  const [simulatedScanning, setSimulatedScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  if (!isOpen) return null;

  const performScanValidation = (pack) => {
    setSimulatedScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setSimulatedScanning(false);
      const isExpired = pack.computedStatus === 'EXPIRED' || pack.status === 'EXPIRED' || (pack.expiry && new Date(pack.expiry) < new Date());
      const isSterile = pack.status === 'STERILE' || pack.status === 'RESERVED' || pack.status === 'IN_OT';

      const result = {
        pack,
        identityConfirmed: true,
        sterilityValid: isSterile && !isExpired,
        expiryValid: !isExpired,
        procedureCompatible: true,
        otCompatible: pack.assigned_ot ? pack.assigned_ot !== 'Unassigned' : true,
        cleared: isSterile && !isExpired
      };

      setScanResult(result);
    }, 800);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const q = scanInput.trim().toLowerCase();
    const match = availablePacks.find(p => 
      (p.pack_code || p.id || '').toLowerCase() === q ||
      (p.rfid || '').toLowerCase() === q ||
      (p.qr || '').toLowerCase() === q ||
      (p.pack_type || '').toLowerCase().includes(q)
    );
    if (match) {
      performScanValidation(match);
    } else {
      alert(`No active CSSD pack found matching '${scanInput}'.`);
    }
  };

  const handleConfirmScan = () => {
    if (scanResult?.pack) {
      onPackScanned(scanResult.pack);
      onClose();
    }
  };

  return (
    <div className="ot-modal-backdrop" onClick={onClose}>
      <div className="ot-scan-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="scan-modal-header">
          <div className="scan-title-row">
            <div className="scan-icon-badge">
              <QrCode size={18} className="text-teal" />
            </div>
            <div>
              <h3 className="scan-heading font-display">RFID & 2D Barcode Digital Scanner</h3>
              <p className="scan-sub font-mono">Digital identification & sterility validation engine</p>
            </div>
          </div>
          <button className="scan-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="scan-modal-body">
          {/* Visual Scanner Viewfinder */}
          <div className={`scanner-viewfinder-box ${simulatedScanning ? 'is-scanning' : ''}`}>
            <div className="viewfinder-corner tl" />
            <div className="viewfinder-corner tr" />
            <div className="viewfinder-corner bl" />
            <div className="viewfinder-corner br" />
            <div className="scanner-laser-line" />
            
            <div className="viewfinder-content">
              <Radio size={28} className="scanner-radio-icon text-teal animate-pulse" />
              <span className="viewfinder-text font-mono">
                {simulatedScanning ? 'DECODING RFID / DATAMATRIX PAYLOAD...' : 'READY FOR RFID / 2D DATAMATRIX SCAN'}
              </span>
            </div>
          </div>

          {/* Live Digital Scan Result Telemetry */}
          {scanResult && (
            <div style={{
              marginTop: '16px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: scanResult.cleared ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${scanResult.cleared ? '#86efac' : '#fca5a5'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Barcode size={18} className={scanResult.cleared ? 'text-teal' : 'text-red'} />
                  <div>
                    <h4 className="font-display font-bold" style={{ fontSize: '14px', color: 'var(--text-navy-head)' }}>
                      {scanResult.pack.pack_code}
                    </h4>
                    <span className="font-mono text-muted" style={{ fontSize: '10px' }}>
                      RFID: {scanResult.pack.rfid} • {scanResult.pack.pack_type}
                    </span>
                  </div>
                </div>

                <span style={{
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  backgroundColor: scanResult.cleared ? '#15803d' : '#b91c1c',
                  color: '#ffffff'
                }}>
                  {scanResult.cleared ? 'PACK CLEARED FOR USE' : 'PACK BLOCKED'}
                </span>
              </div>

              {/* Validation Checklist */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: scanResult.identityConfirmed ? '#15803d' : '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {scanResult.identityConfirmed ? <CheckCircle2 size={12} /> : <AlertOctagon size={12} />}
                  <span>Identity Confirmed</span>
                </div>

                <div style={{ color: scanResult.sterilityValid ? '#15803d' : '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {scanResult.sterilityValid ? <CheckCircle2 size={12} /> : <AlertOctagon size={12} />}
                  <span>Sterility Valid</span>
                </div>

                <div style={{ color: scanResult.expiryValid ? '#15803d' : '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {scanResult.expiryValid ? <CheckCircle2 size={12} /> : <AlertOctagon size={12} />}
                  <span>Expiry Valid</span>
                </div>

                <div style={{ color: scanResult.procedureCompatible ? '#15803d' : '#b91c1c', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {scanResult.procedureCompatible ? <CheckCircle2 size={12} /> : <AlertOctagon size={12} />}
                  <span>Procedure Compatible</span>
                </div>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button size="sm" variant={scanResult.cleared ? 'teal' : 'secondary'} onClick={handleConfirmScan}>
                  {scanResult.cleared ? 'Inspect Verified Pack' : 'View Pack Details'}
                </Button>
              </div>
            </div>
          )}

          {/* Quick Select Presets */}
          {!scanResult && (
            <div className="quick-scan-section">
              <span className="quick-scan-label font-mono">SIMULATE DIGITAL SCAN:</span>
              <div className="preset-packs-list">
                {availablePacks.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    className="preset-pack-pill"
                    onClick={() => performScanValidation(p)}
                    type="button"
                  >
                    <Barcode size={13} className="text-muted" />
                    <span className="font-mono text-primary font-bold">{p.pack_code}</span>
                    <span className="preset-pack-name">{p.pack_type}</span>
                    <ArrowRight size={11} className="text-teal" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Search */}
          {!scanResult && (
            <form className="manual-scan-form" onSubmit={handleManualSearch}>
              <span className="manual-label font-mono">OR ENTER RFID / QR / PACK ID:</span>
              <div className="manual-input-row">
                <input
                  type="text"
                  placeholder="e.g. CSSD-LAP-021 or RFID-9921-LAP"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  className="manual-text-input font-mono"
                />
                <Button size="sm" variant="primary" type="submit">
                  Scan / Lookup
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
