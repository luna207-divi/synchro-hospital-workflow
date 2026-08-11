import React, { useState } from 'react';
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
  Barcode
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { PackDetailDrawer } from './PackDetailDrawer';
import { ScanPackModal } from './ScanPackModal';
import './CSSDPage.css';

export const CSSDPage = () => {
  const [filterTab, setFilterTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPack, setSelectedPack] = useState(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const [packs, setPacks] = useState([
    {
      id: 'CSSD-00125',
      type: 'TKR Instrument Set',
      sterilizationStatus: 'Sterile',
      sterilizedOn: '10 Aug',
      expiry: '15 Aug',
      location: 'Storage A',
      assignedOT: 'OT-02',
      status: 'Available',
      currentStageIdx: 4,
      isExpired: false
    },
    {
      id: 'CSSD-EXP-09',
      type: 'General Laparotomy Set #02',
      sterilizationStatus: 'Expired',
      sterilizedOn: '03 Aug',
      expiry: '08 Aug (Expired)',
      location: 'Storage B - Bay 4',
      assignedOT: 'Unassigned',
      status: 'Expired',
      currentStageIdx: 4,
      isExpired: true
    },
    {
      id: 'CSSD-00142',
      type: 'Orthopedic Power Tool Set #04',
      sterilizationStatus: 'In Sterilization',
      sterilizedOn: '10 Aug',
      expiry: '15 Aug',
      location: 'Autoclave #02 (Cooldown)',
      assignedOT: 'OT-03',
      status: 'In Process',
      currentStageIdx: 2,
      isExpired: false
    },
    {
      id: 'CSSD-00118',
      type: 'Total Hip Arthroplasty Tray #01',
      sterilizationStatus: 'Sterile',
      sterilizedOn: '10 Aug',
      expiry: '14 Aug',
      location: 'OT-01 Holding Core',
      assignedOT: 'OT-01',
      status: 'In Room',
      currentStageIdx: 5,
      isExpired: false
    },
    {
      id: 'CSSD-00109',
      type: 'Micro-Vascular Set #03',
      sterilizationStatus: 'Sterile',
      sterilizedOn: '09 Aug',
      expiry: '11 Aug (24h left)',
      location: 'Storage A - Shelf 2',
      assignedOT: 'Unassigned',
      status: 'Available',
      currentStageIdx: 4,
      isExpired: false,
      isExpiringSoon: true
    },
    {
      id: 'CSSD-00098',
      type: 'Laparoscopic Cholecystectomy Kit',
      sterilizationStatus: 'Sterile',
      sterilizedOn: '10 Aug',
      expiry: '15 Aug',
      location: 'Storage C',
      assignedOT: 'OT-04',
      status: 'Available',
      currentStageIdx: 4,
      isExpired: false
    },
    {
      id: 'CSSD-00084',
      type: 'Spinal Fusion Instrument Tray #02',
      sterilizationStatus: 'Decontaminated',
      sterilizedOn: 'Pending',
      expiry: '16 Aug',
      location: 'Decon Bay 3',
      assignedOT: 'Unassigned',
      status: 'Awaiting Sterilization',
      currentStageIdx: 1,
      isExpired: false
    }
  ]);

  const handleAssignOT = (packId, suiteName) => {
    setPacks(prev => prev.map(p => {
      if (p.id === packId) {
        return {
          ...p,
          assignedOT: suiteName,
          status: 'Assigned',
          currentStageIdx: 5
        };
      }
      return p;
    }));
  };

  const handleQuarantine = (packId) => {
    setPacks(prev => prev.map(p => {
      if (p.id === packId) {
        return {
          ...p,
          location: 'Quarantine Vault',
          status: 'Quarantined',
          assignedOT: 'Unassigned'
        };
      }
      return p;
    }));
  };

  const filteredPacks = packs.filter(p => {
    let matchesTab = true;
    if (filterTab === 'STERILE') matchesTab = p.sterilizationStatus === 'Sterile';
    else if (filterTab === 'AWAITING') matchesTab = p.sterilizationStatus === 'Decontaminated' || p.sterilizationStatus === 'In Sterilization';
    else if (filterTab === 'ASSIGNED') matchesTab = p.assignedOT !== 'Unassigned';
    else if (filterTab === 'EXPIRED') matchesTab = p.isExpired;
    else if (filterTab === 'EXPIRING_SOON') matchesTab = p.isExpiringSoon;

    const matchesSearch = searchQuery === '' || 
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.assignedOT.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const totalPacks = 142;
  const sterilePacksCount = 98;
  const awaitingSterilizationCount = 18;
  const assignedToOTCount = 21;
  const expiringSoonCount = 5;

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
            Track sterile instrument packs from sterilization to operating theatre.
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

      {/* 2. Top Summary Cards (5 Operational Metrics) */}
      <div className="cssd-kpi-grid">
        <div className="cssd-kpi-card ot-card accent-blue">
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">TOTAL PACKS</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num font-display">{totalPacks}</span>
              <span className="cssd-kpi-unit font-mono">trays</span>
            </div>
            <span className="cssd-kpi-sub">Across 4 surgical specialties</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-blue">
            <PackageCheck size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-teal" onClick={() => setFilterTab('STERILE')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">STERILE</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-teal font-display">{sterilePacksCount}</span>
              <span className="cssd-kpi-unit font-mono">(69%)</span>
            </div>
            <span className="cssd-kpi-sub">Dual biological spore verified</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-teal">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-amber" onClick={() => setFilterTab('AWAITING')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">AWAITING STERILIZATION</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-amber font-display">{awaitingSterilizationCount}</span>
              <span className="cssd-kpi-unit font-mono">in queue</span>
            </div>
            <span className="cssd-kpi-sub">12 In Decon • 6 In Autoclave</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-amber">
            <Clock size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-indigo" onClick={() => setFilterTab('ASSIGNED')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">ASSIGNED TO OT</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-indigo font-display">{assignedToOTCount}</span>
              <span className="cssd-kpi-unit font-mono">in suites</span>
            </div>
            <span className="cssd-kpi-sub">Allocated for active cases</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-indigo">
            <Building2 size={18} />
          </div>
        </div>

        <div className="cssd-kpi-card ot-card accent-red" onClick={() => setFilterTab('EXPIRING_SOON')}>
          <div className="cssd-kpi-left">
            <span className="cssd-kpi-title font-mono">EXPIRING SOON</span>
            <div className="cssd-kpi-val-row">
              <span className="cssd-kpi-num text-red font-display">{expiringSoonCount}</span>
              <span className="cssd-kpi-unit font-mono">within 24h</span>
            </div>
            <span className="cssd-kpi-sub">Requires prioritized dispatch</span>
          </div>
          <div className="cssd-kpi-icon-pill pill-red">
            <AlertTriangle size={18} />
          </div>
        </div>
      </div>

      {/* 3. Filter Controls Bar */}
      <div className="cssd-filter-bar ot-card">
        <div className="cssd-filter-tabs">
          {[
            { id: 'ALL', label: 'All Instrument Packs' },
            { id: 'STERILE', label: 'Sterile & Available' },
            { id: 'AWAITING', label: 'Awaiting Sterilization' },
            { id: 'ASSIGNED', label: 'Assigned to OT' },
            { id: 'EXPIRING_SOON', label: 'Expiring Soon' },
            { id: 'EXPIRED', label: 'Expired / Quarantined' }
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
            placeholder="Search pack ID, instrument set, location, OT..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* 4. Instrument Pack Table */}
      <div className="cssd-table-card ot-card">
        <div className="table-responsive-wrapper">
          <table className="cssd-data-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>PACK ID</th>
                <th>PACK TYPE</th>
                <th style={{ width: '160px' }}>STERILIZATION STATUS</th>
                <th style={{ width: '110px' }}>STERILIZED ON</th>
                <th style={{ width: '130px' }}>EXPIRY</th>
                <th style={{ width: '160px' }}>LOCATION</th>
                <th style={{ width: '110px' }}>ASSIGNED OT</th>
                <th style={{ width: '110px' }}>STATUS</th>
                <th style={{ width: '110px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPacks.map((pack) => {
                const isSelected = selectedPack?.id === pack.id;
                const isPackExpired = pack.isExpired;
                return (
                  <tr 
                    key={pack.id}
                    className={`cssd-row ${isSelected ? 'row-selected' : ''} ${isPackExpired ? 'row-expired' : ''}`}
                    onClick={() => setSelectedPack(pack)}
                  >
                    {/* Pack ID */}
                    <td>
                      <div className="pack-id-cell font-mono">
                        <span className={`id-tag ${isPackExpired ? 'id-expired' : 'id-valid'}`}>{pack.id}</span>
                      </div>
                    </td>

                    {/* Pack Type */}
                    <td>
                      <span className="pack-type-text font-display">{pack.type}</span>
                    </td>

                    {/* Sterilization Status */}
                    <td>
                      <span className={`status-pill pill-${pack.sterilizationStatus.toLowerCase().replace(' ', '-')} font-mono`}>
                        {pack.sterilizationStatus === 'Sterile' && <CheckCircle2 size={11} />}
                        {pack.sterilizationStatus === 'Expired' && <AlertOctagon size={11} />}
                        {pack.sterilizationStatus === 'In Sterilization' && <Flame size={11} />}
                        {pack.sterilizationStatus === 'Decontaminated' && <Clock size={11} />}
                        {pack.sterilizationStatus}
                      </span>
                    </td>

                    {/* Sterilized On */}
                    <td>
                      <span className="time-text font-mono">{pack.sterilizedOn}</span>
                    </td>

                    {/* Expiry */}
                    <td>
                      <span className={`expiry-text font-mono ${isPackExpired ? 'text-red font-bold' : pack.isExpiringSoon ? 'text-amber font-bold' : ''}`}>
                        {pack.expiry}
                      </span>
                    </td>

                    {/* Location */}
                    <td>
                      <span className="location-text">{pack.location}</span>
                    </td>

                    {/* Assigned OT */}
                    <td>
                      <span className={`ot-assign-badge font-mono ${pack.assignedOT !== 'Unassigned' ? 'has-ot' : 'unassigned'}`}>
                        {pack.assignedOT}
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <Badge 
                        variant={isPackExpired ? 'red' : pack.status === 'Available' ? 'teal' : pack.status === 'In Room' ? 'indigo' : 'amber'}
                        size="xs"
                      >
                        {pack.status}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <Button
                        size="xs"
                        variant={isPackExpired ? 'danger' : 'secondary'}
                        iconRight={ChevronRight}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPack(pack);
                        }}
                      >
                        {isPackExpired ? 'Blocked' : 'Inspect'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pack Detail Lifecycle Drawer */}
      {selectedPack && (
        <PackDetailDrawer
          pack={selectedPack}
          onClose={() => setSelectedPack(null)}
          onAssignOT={handleAssignOT}
          onQuarantine={handleQuarantine}
        />
      )}

      {/* 6. Scan Pack Modal */}
      <ScanPackModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        availablePacks={packs}
        onPackScanned={(scannedPack) => setSelectedPack(scannedPack)}
      />
    </div>
  );
};
