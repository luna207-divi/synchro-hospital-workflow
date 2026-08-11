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
  PackageCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import './ScanPackModal.css';

/**
 * Scan Pack Modal Component
 * Simulates mobile / handheld RFID and 2D DataMatrix scanner in hospital CSSD & surgical suites.
 */
export const ScanPackModal = ({ isOpen, onClose, onPackScanned, availablePacks }) => {
  const [scanInput, setScanInput] = useState('');
  const [simulatedScanning, setSimulatedScanning] = useState(false);

  if (!isOpen) return null;

  const handleSimulateScan = (pack) => {
    setSimulatedScanning(true);
    setTimeout(() => {
      setSimulatedScanning(false);
      onPackScanned(pack);
      onClose();
    }, 600);
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const match = availablePacks.find(p => 
      p.id.toLowerCase() === scanInput.trim().toLowerCase() ||
      p.type.toLowerCase().includes(scanInput.trim().toLowerCase())
    );
    if (match) {
      onPackScanned(match);
      onClose();
    } else {
      alert(`No active CSSD pack found matching '${scanInput}'.`);
    }
  };

  return (
    <div className="ot-modal-backdrop" onClick={onClose}>
      <div className="ot-scan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scan-modal-header">
          <div className="scan-title-row">
            <div className="scan-icon-badge">
              <QrCode size={18} className="text-teal" />
            </div>
            <div>
              <h3 className="scan-heading font-display">RFID & 2D Barcode Scanner</h3>
              <p className="scan-sub font-mono">Scan or select any sterile instrument tray</p>
            </div>
          </div>
          <button className="scan-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="scan-modal-body">
          {/* Visual Scanner Simulation Box */}
          <div className={`scanner-viewfinder-box ${simulatedScanning ? 'is-scanning' : ''}`}>
            <div className="viewfinder-corner tl" />
            <div className="viewfinder-corner tr" />
            <div className="viewfinder-corner bl" />
            <div className="viewfinder-corner br" />
            <div className="scanner-laser-line" />
            
            <div className="viewfinder-content">
              <Radio size={28} className="scanner-radio-icon text-teal animate-pulse" />
              <span className="viewfinder-text font-mono">
                {simulatedScanning ? 'DECODING RFID PAYLOAD...' : 'READY FOR RFID / 2D DATAMATRIX SCAN'}
              </span>
            </div>
          </div>

          {/* Quick Select Preset Packs */}
          <div className="quick-scan-section">
            <span className="quick-scan-label font-mono">FAST-SCAN PRESETS:</span>
            <div className="preset-packs-list">
              {availablePacks.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  className="preset-pack-pill"
                  onClick={() => handleSimulateScan(p)}
                  type="button"
                >
                  <Barcode size={13} className="text-muted" />
                  <span className="font-mono text-primary font-bold">{p.id}</span>
                  <span className="preset-pack-name">{p.type}</span>
                  <ArrowRight size={11} className="text-teal" />
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Form */}
          <form className="manual-scan-form" onSubmit={handleManualSearch}>
            <span className="manual-label font-mono">OR ENTER RFID / PACK ID:</span>
            <div className="manual-input-row">
              <input
                type="text"
                placeholder="e.g. CSSD-00125 or CSSD-EXP-09"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                className="manual-text-input font-mono"
              />
              <Button size="sm" variant="primary" type="submit">
                Lookup
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
