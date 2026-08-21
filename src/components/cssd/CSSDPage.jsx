import React, { useState, useMemo } from 'react';
import { 
  PackageCheck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Building2, 
  QrCode, 
  Search, 
  Filter, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  AlertOctagon, 
  Flame, 
  ShieldCheck, 
  ShieldAlert,
  ArrowUpDown,
  Barcode,
  Radio,
  RotateCcw,
  Activity
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { PackDetailDrawer } from './PackDetailDrawer';
import { ScanPackModal } from './ScanPackModal';
import { useWorkflow } from '../../context/WorkflowContext';
import './CSSDPage.css';

// ── Helpers ─────────────────────────────────────────────────────
const getExpiryState = (expiryISO) => {
  if (!expiryISO) return 'NONE';
  const diff = new Date(expiryISO) - new Date();
  const hrs = diff / 3600000;
  if (hrs <= 0) return 'EXPIRED';
  if (hrs <= 24) return 'URGENT';
  if (hrs <= 48) return 'EXPIRING_SOON';
  return 'NORMAL';
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

const fmtDateFull = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
};

const getHoursUntilExpiry = (expiryISO) => {
  if (!expiryISO) return null;
  const diff = new Date(expiryISO) - new Date();
  return Math.round(diff / 3600000);
};

const STATUS_COLORS = {
  STERILE:              { bg: '#dcfce7', text: '#15803d', label: 'STERILE' },
  RESERVED:             { bg: '#dbeafe', text: '#1e40af', label: 'RESERVED' },
  ISSUED:               { bg: '#e0e7ff', text: '#4338ca', label: 'ISSUED' },
  IN_OT:                { bg: '#fef3c7', text: '#b45309', label: 'IN OT' },
  RETURN_PENDING:       { bg: '#fce7f3', text: '#be185d', label: 'RETURN PENDING' },
  DECONTAMINATION:      { bg: '#f5f3ff', text: '#7c3aed', label: 'DECONTAMINATION' },
  REPROCESSING:         { bg: '#fff7ed', text: '#c2410c', label: 'REPROCESSING' },
  STERILIZING:          { bg: '#fffbeb', text: '#a16207', label: 'STERILIZING' },
  VERIFICATION_PENDING: { bg: '#fefce8', text: '#854d0e', label: 'VERIFICATION' },
  EXPIRED:              { bg: '#fee2e2', text: '#b91c1c', label: 'EXPIRED' },
  QUARANTINED:          { bg: '#fee2e2', text: '#991b1b', label: 'QUARANTINED' },
};

const getStatusStyle = (status) => STATUS_COLORS[status] || { bg: '#f1f5f9', text: '#475569', label: status };

// ── Component ──────────────────────────────────────────────────
export const CSSDPage = () => {
  const [filterTab, setFilterTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPack, setSelectedPack] = useState(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const workflow = useWorkflow();
  const packs = workflow.cssd_packs || [];

  // Compute expiry states for all packs
  const enrichedPacks = useMemo(() => packs.map(p => ({
    ...p,
    expiryState: getExpiryState(p.expiry),
    computedStatus: (p.status === 'STERILE' && p.expiry && new Date(p.expiry) < new Date()) ? 'EXPIRED' : p.status,
  })), [packs]);

  // Filter logic
  const filteredPacks = enrichedPacks.filter(p => {
    let matchesTab = true;
    if (filterTab === 'AVAILABLE') matchesTab = p.computedStatus === 'STERILE';
    else if (filterTab === 'RESERVED') matchesTab = p.computedStatus === 'RESERVED';
    else if (filterTab === 'IN_OT') matchesTab = p.computedStatus === 'IN_OT' || p.computedStatus === 'ISSUED';
    else if (filterTab === 'EXPIRING') matchesTab = p.expiryState === 'EXPIRING_SOON' || p.expiryState === 'URGENT';
    else if (filterTab === 'EXPIRED') matchesTab = p.computedStatus === 'EXPIRED';
    else if (filterTab === 'REPROCESSING') matchesTab = ['RETURN_PENDING', 'DECONTAMINATION', 'REPROCESSING', 'STERILIZING', 'VERIFICATION_PENDING'].includes(p.computedStatus);

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q ||
      (p.pack_code || '').toLowerCase().includes(q) ||
      (p.rfid || '').toLowerCase().includes(q) ||
      (p.pack_type || '').toLowerCase().includes(q) ||
      (p.specialty || '').toLowerCase().includes(q) ||
      (p.assigned_patient || '').toLowerCase().includes(q) ||
      (p.location || '').toLowerCase().includes(q) ||
      (p.assigned_ot || '').toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  // KPI Computations
  const sterileCount = enrichedPacks.filter(p => p.computedStatus === 'STERILE').length;
  const reservedCount = enrichedPacks.filter(p => p.computedStatus === 'RESERVED').length;
  const inOTCount = enrichedPacks.filter(p => p.computedStatus === 'IN_OT' || p.computedStatus === 'ISSUED').length;
  const expiringSoonCount = enrichedPacks.filter(p => p.expiryState === 'EXPIRING_SOON' || p.expiryState === 'URGENT').length;
  const expiredCount = enrichedPacks.filter(p => p.computedStatus === 'EXPIRED').length;
  const reprocessingCount = enrichedPacks.filter(p => ['RETURN_PENDING', 'DECONTAMINATION', 'REPROCESSING', 'STERILIZING', 'VERIFICATION_PENDING'].includes(p.computedStatus)).length;

  // Keep selectedPack in sync with live data
  const liveSelectedPack = selectedPack ? enrichedPacks.find(p => p.id === selectedPack.id) || selectedPack : null;

  return (
    <div className="ot-cssd-page">
      {/* 1. Page Header */}
      <div className="cssd-page-header">
        <div className="cssd-title-group">
          <div className="cssd-title-row">
            <h1 className="cssd-heading font-display">Central Sterile Services Department</h1>
            <Badge variant="teal" size="sm" dot>RFID Tracking Active</Badge>
          </div>
          <p className="cssd-subtitle">
            Digital sterile pack lifecycle tracking — from sterilization to OT and back.
          </p>
        </div>

        <div className="cssd-header-actions">
          <Button
            size="sm"
            variant="primary"
            icon={QrCode}
            onClick={() => setIsScanModalOpen(true)}
          >
            Scan Pack
          </Button>
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Sync Autoclaves
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export Audit Log
          </Button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="cssd-kpi-grid">
        <div className="cssd-kpi-card ot-card accent-blue" onClick={() => setFilterTab('ALL')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">TOTAL PACKS</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display">{enrichedPacks.length}</span>
              <span className="cssd-kpi-unit font-mono">tracked</span>
            </div>
            <span className="cssd-kpi-sub">Digital lifecycle tracking active</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-blue">
            <PackageCheck size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-teal" onClick={() => setFilterTab('AVAILABLE')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">STERILE / AVAILABLE</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-teal font-display">{sterileCount}</span>
              <span className="cssd-kpi-unit font-mono">packs</span>
            </div>
            <span className="cssd-kpi-sub">Verified & ready for OT dispatch</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-teal">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-indigo" onClick={() => setFilterTab('RESERVED')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">RESERVED</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-indigo font-display">{reservedCount}</span>
              <span className="cssd-kpi-unit font-mono">assigned</span>
            </div>
            <span className="cssd-kpi-sub">Reserved for scheduled patients</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-indigo">
            <Building2 size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-amber" onClick={() => setFilterTab('REPROCESSING')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">REPROCESSING</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-amber font-display">{reprocessingCount}</span>
              <span className="cssd-kpi-unit font-mono">in cycle</span>
            </div>
            <span className="cssd-kpi-sub">Decon → Sterilization → QC</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-amber">
            <RotateCcw size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-red" onClick={() => setFilterTab('EXPIRING')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">EXPIRING SOON</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-red font-display">{expiringSoonCount}</span>
              <span className="cssd-kpi-unit font-mono">within 48h</span>
            </div>
            <span className="cssd-kpi-sub">{expiredCount > 0 ? `${expiredCount} expired / quarantined` : 'Prioritized dispatch required'}</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-red">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="cssd-filter-bar ot-card">
        <div className="cssd-filter-tabs">
          {[
            { id: 'ALL', label: 'All Packs' },
            { id: 'AVAILABLE', label: `Sterile (${sterileCount})` },
            { id: 'RESERVED', label: `Reserved (${reservedCount})` },
            { id: 'IN_OT', label: `In OT (${inOTCount})` },
            { id: 'EXPIRING', label: `Expiring (${expiringSoonCount})` },
            { id: 'EXPIRED', label: `Expired (${expiredCount})` },
            { id: 'REPROCESSING', label: `Reprocessing (${reprocessingCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`cssd-tab-btn ${filterTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setFilterTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="cssd-search-box">
          <SearchInput
            placeholder="Search pack ID, RFID, type, patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* 4. Pack Table */}
      <div className="cssd-table-card ot-card">
        <div className="table-responsive-wrapper">
          <table className="cssd-data-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>PACK ID</th>
                <th>TYPE</th>
                <th style={{ width: '110px' }}>SPECIALTY</th>
                <th style={{ width: '120px' }}>STATUS</th>
                <th style={{ width: '90px' }}>STERILIZED</th>
                <th style={{ width: '100px' }}>EXPIRY</th>
                <th style={{ width: '140px' }}>LOCATION</th>
                <th style={{ width: '120px' }}>PATIENT</th>
                <th style={{ width: '70px' }}>OT</th>
                <th style={{ width: '80px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map((pack) => {
                const ss = getStatusStyle(pack.computedStatus);
                const expiryHrs = getHoursUntilExpiry(pack.expiry);
                const isExpiredComputed = pack.computedStatus === 'EXPIRED';
                const isExpiringSoon = pack.expiryState === 'URGENT' || pack.expiryState === 'EXPIRING_SOON';

                return (
                  <tr 
                    key={pack.id}
                    className={`cssd-row ${isExpiredComputed ? 'row-expired' : ''}`}
                    onClick={() => setSelectedPack(pack)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pack ID */}
                    <td>
                      <div className="pack-id-cell font-mono">
                        <span className={`id-tag ${isExpiredComputed ? 'id-expired' : 'id-valid'}`}>{pack.pack_code}</span>
                      </div>
                    </td>

                    {/* Type */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span className="pack-type-text font-display" style={{ fontSize: '12px', fontWeight: 600 }}>{pack.pack_type}</span>
                        <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{pack.rfid}</span>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-primary)' }}>{pack.specialty}</span>
                    </td>

                    {/* Status */}
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '10px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: ss.bg,
                        color: ss.text,
                      }}>
                        {isExpiredComputed && <AlertOctagon size={10} />}
                        {pack.computedStatus === 'STERILE' && <CheckCircle2 size={10} />}
                        {pack.computedStatus === 'STERILIZING' && <Flame size={10} />}
                        {pack.computedStatus === 'IN_OT' && <Activity size={10} />}
                        {ss.label}
                      </span>
                    </td>

                    {/* Sterilized */}
                    <td>
                      <span className="font-mono" style={{ fontSize: '11px' }}>{fmtDate(pack.sterilized_at)}</span>
                    </td>

                    {/* Expiry */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span className={`font-mono ${isExpiredComputed ? 'text-red font-bold' : isExpiringSoon ? 'text-amber font-bold' : ''}`} style={{ fontSize: '11px' }}>
                          {fmtDate(pack.expiry)}
                        </span>
                        {expiryHrs !== null && expiryHrs > 0 && expiryHrs <= 48 && (
                          <span className="font-mono" style={{ fontSize: '9px', color: expiryHrs <= 24 ? '#dc2626' : '#d97706' }}>
                            {expiryHrs}h remaining
                          </span>
                        )}
                        {isExpiredComputed && (
                          <span className="font-mono" style={{ fontSize: '9px', color: '#dc2626', fontWeight: 700 }}>
                            EXPIRED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td>
                      <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{pack.location}</span>
                    </td>

                    {/* Patient */}
                    <td>
                      {pack.assigned_patient ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-navy-head)' }}>{pack.assigned_patient}</span>
                          <span className="font-mono" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{pack.assigned_patient_code}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* OT */}
                    <td>
                      <span className={`font-mono ${pack.assigned_ot !== 'Unassigned' ? 'font-bold' : ''}`} style={{ fontSize: '11px', color: pack.assigned_ot !== 'Unassigned' ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                        {pack.assigned_ot !== 'Unassigned' ? pack.assigned_ot : '—'}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        size="xs"
                        variant={isExpiredComputed ? 'danger' : 'secondary'}
                        iconRight={ChevronRight}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPack(pack);
                        }}
                      >
                        {isExpiredComputed ? 'Blocked' : 'View'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pack Detail Drawer */}
      {liveSelectedPack && (
        <PackDetailDrawer
          pack={liveSelectedPack}
          onClose={() => setSelectedPack(null)}
          workflow={workflow}
        />
      )}

      {/* 6. Scan Pack Modal */}
      <ScanPackModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        availablePacks={enrichedPacks}
        onPackScanned={(scannedPack) => setSelectedPack(scannedPack)}
        workflow={workflow}
      />
    </div>
  );
};
