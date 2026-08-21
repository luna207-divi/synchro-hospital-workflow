import React, { useState, useEffect } from 'react';
import { 
  Package, ShieldCheck, CheckCircle2, AlertTriangle, 
  XCircle, ArrowRight, RefreshCw, QrCode, Sparkles, 
  Zap, Clock, MapPin, Stethoscope, ShieldAlert, Check
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { useWorkflow } from '../../context/WorkflowContext';
import { Button } from '../common/Button';
import './SterileFlow.css';

export const SterileFlow = ({ onNavigateToOTControl }) => {
  const { demoState, assignPackToOT2 } = useDemo();
  const workflow = useWorkflow();

  const cssdPacks = workflow.cssd_packs || [];
  
  // 6 Inventory Metrics matching requirement
  const metrics = {
    total: 42,
    ready: 27,
    inSterilization: 8,
    inUse: 4,
    expiredQuarantined: 3,
    reprocessing: 5
  };

  // 8-step Lifecycle Stages
  const lifecycleStages = [
    { name: 'Prepared', status: 'done' },
    { name: 'Sterilized', status: 'done' },
    { name: 'Validated', status: 'done' },
    { name: 'Stored', status: 'active' },
    { name: 'Dispatched', status: 'pending' },
    { name: 'Used', status: 'pending' },
    { name: 'Returned', status: 'pending' },
    { name: 'Reprocessed / Quarantined', status: 'alert' }
  ];

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
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
      {/* 1. Header */}
      <div className="sterileflow-header">
        <div className="sterileflow-title-block">
          <h1 className="sterileflow-main-title font-display">SterileFlow CSSD Inventory & Lifecycle Tracking</h1>
          <p className="sterileflow-subtitle">
            Central Sterile Services Department — real-time sterility, RFID tracking, and complete pack lifecycle.
          </p>
        </div>

        <div className="sterileflow-actions-toolbar">
          <Button variant="primary" size="sm" icon={QrCode}>
            SCAN PACK RFID
          </Button>
        </div>
      </div>

      {/* 2. Top 6 CSSD Inventory Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <div className="ot-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STERILE PACKS</span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)' }}>{metrics.total}</div>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Vault Inventory</span>
        </div>

        <div className="ot-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>READY / STERILE</span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--state-teal-text)' }}>{metrics.ready}</div>
          <span style={{ fontSize: '11px', color: 'var(--state-teal-text)' }}>Cleared for OT Dispatch</span>
        </div>

        <div className="ot-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>IN STERILIZATION</span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary-blue)' }}>{metrics.inSterilization}</div>
          <span style={{ fontSize: '11px', color: 'var(--primary-blue)' }}>Autoclave Chambers 1-3</span>
        </div>

        <div className="ot-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>IN USE</span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--status-cyan-text)' }}>{metrics.inUse}</div>
          <span style={{ fontSize: '11px', color: 'var(--status-cyan-text)' }}>Active Surgical Suites</span>
        </div>

        <div className="ot-card" style={{ padding: '16px', borderLeft: '3px solid var(--state-red)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>EXPIRED / QUARANTINED</span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--state-red-text)' }}>{metrics.expiredQuarantined}</div>
          <span style={{ fontSize: '11px', color: 'var(--state-red-text)' }}>Auto-Flagged & Isolated</span>
        </div>

        <div className="ot-card" style={{ padding: '16px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REPROCESSING</span>
          <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--state-amber-text)' }}>{metrics.reprocessing}</div>
          <span style={{ fontSize: '11px', color: 'var(--state-amber-text)' }}>Decontamination Bay</span>
        </div>
      </div>

      {/* 3. Sterile Pack Complete Lifecycle Bar */}
      <div className="ot-card" style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)', marginBottom: '14px' }}>
          Complete Sterile-Pack Lifecycle Flow
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          {lifecycleStages.map((stg, idx) => (
            <React.Fragment key={stg.name}>
              {idx > 0 && <span style={{ color: 'var(--text-dim)', fontWeight: 700 }}>→</span>}
              <div style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                fontFamily: 'var(--font-mono)',
                backgroundColor: stg.status === 'done' ? '#d1fae5' : stg.status === 'active' ? '#ecfeff' : stg.status === 'alert' ? '#fee2e2' : '#f1f5f9',
                color: stg.status === 'done' ? '#065f46' : stg.status === 'active' ? '#0891b2' : stg.status === 'alert' ? '#991b1b' : '#64748b',
                border: stg.status === 'done' ? '1px solid #a7f3d0' : stg.status === 'active' ? '1px solid #a5f3fc' : stg.status === 'alert' ? '1px solid #fecdd3' : '1px solid #e2e8f0'
              }}>
                {idx + 1}. {stg.name}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 4. Quarantined Expired Pack Containment Alert */}
      <div className="ot-card" style={{ padding: '18px', marginBottom: '24px', backgroundColor: '#fffdfd', border: '1px solid var(--state-red-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={20} style={{ color: 'var(--state-red)' }} />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--state-red-text)', fontFamily: 'var(--font-display)' }}>
              SYNCHRO Sterility Assurance Engine — Expired Containment Alert
            </h3>
          </div>
          <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--state-red-text)', background: 'var(--state-red-light)', padding: '2px 8px', borderRadius: '4px' }}>
            3 PACKS QUARANTINED
          </span>
        </div>

        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5, fontWeight: 600 }}>
          ⚠️ <strong>3 sterile packs quarantined after expiry detection</strong> (CSSD-EXP-09, CSSD-EXP-10, CSSD-EXP-11). SYNCHRO automatically flagged the RFID tags, quarantined the units in Vault B, notified OT Charge Nurses, and assigned backup pack <strong>CSSD-00428</strong>.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
          <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: 700 }}>1. Expired Pack Detected</span>
          <span>→</span>
          <span style={{ padding: '4px 8px', background: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontWeight: 700 }}>2. Automatically Flagged</span>
          <span>→</span>
          <span style={{ padding: '4px 8px', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontWeight: 700 }}>3. Quarantined in Vault B</span>
          <span>→</span>
          <span style={{ padding: '4px 8px', background: '#dbeafe', color: '#1e40af', borderRadius: '4px', fontWeight: 700 }}>4. OT Notified</span>
          <span>→</span>
          <span style={{ padding: '4px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '4px', fontWeight: 700 }}>5. Replacement Pack CSSD-00428 Assigned</span>
        </div>
      </div>

      {/* 5. Available Valid Packs Selection for OT-02 */}
      <section className="scanned-section">
        <div className="section-header">
          <h2 className="section-title">Available Valid Packs for OT-02 ({demoState.procedure})</h2>
          <span className="section-count">{demoState.availablePacks.length} Valid Sets Staged</span>
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

      {/* 6. Inventory Pack Table List */}
      <div className="ot-card" style={{ padding: '20px', marginTop: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)', marginBottom: '12px' }}>
          CSSD Vault Pack Inventory (Showing 42 Active Packs)
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
              <th style={{ padding: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>PACK CODE</th>
              <th style={{ padding: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>PACK TYPE</th>
              <th style={{ padding: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>STERILIZATION CYCLE</th>
              <th style={{ padding: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>LOCATION</th>
              <th style={{ padding: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>ASSIGNED OT</th>
              <th style={{ padding: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {cssdPacks.slice(0, 15).map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-blue)' }}>{p.pack_code}</td>
                <td style={{ padding: '10px', fontWeight: 600 }}>{p.pack_type}</td>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>{p.sterilization_cycle}</td>
                <td style={{ padding: '10px' }}>{p.location}</td>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>{p.assigned_ot}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    backgroundColor: p.status === 'STERILE' ? '#d1fae5' : p.status === 'STERILIZING' ? '#dbeafe' : p.status === 'AWAITING_QC' ? '#fef3c7' : '#fee2e2',
                    color: p.status === 'STERILE' ? '#065f46' : p.status === 'STERILIZING' ? '#1e40af' : p.status === 'AWAITING_QC' ? '#92400e' : '#991b1b'
                  }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
