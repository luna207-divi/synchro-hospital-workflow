import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  UserCheck, 
  Activity, 
  PackageCheck, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  CornerDownLeft, 
  Sparkles,
  ChevronRight,
  Command
} from 'lucide-react';
import { Badge } from '../common/Badge';
import './CommandPalette.css';

export const CommandPalette = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Search Data Index
  const searchIndex = [
    // 1. Patients
    {
      id: 'P-1024',
      name: 'Elena Rostova (P-1024)',
      type: 'Total Knee Replacement',
      category: 'Patients',
      dept: 'Admissions',
      pillar: 'blue',
      status: '85% Readiness',
      statusVariant: 'amber',
      route: { id: 'admissions', label: 'Admissions', section: 'Clinical Operations' },
      meta: 'OT-02 • Dr. K. Patel • Pre-Op Bay 3'
    },
    {
      id: 'P-1025',
      name: 'Robert Vance (P-1025)',
      type: 'Total Hip Arthroplasty',
      category: 'Patients',
      dept: 'Admissions',
      pillar: 'blue',
      status: '100% OT Ready',
      statusVariant: 'teal',
      route: { id: 'admissions', label: 'Admissions', section: 'Clinical Operations' },
      meta: 'OT-01 • Dr. S. Rao • Holding Bay 1'
    },
    {
      id: 'P-1026',
      name: 'Marcus Chen (P-1026)',
      type: 'ACL Reconstruction',
      category: 'Patients',
      dept: 'Admissions',
      pillar: 'blue',
      status: '90% Ready',
      statusVariant: 'teal',
      route: { id: 'admissions', label: 'Admissions', section: 'Clinical Operations' },
      meta: 'OT-03 • Dr. J. Gomez • Pre-Op Bay 2'
    },
    {
      id: 'P-1027',
      name: 'Alice Miller (P-1027)',
      type: 'Laparoscopic Cholecystectomy',
      category: 'Patients',
      dept: 'Admissions',
      pillar: 'blue',
      status: 'Awaiting Docs (40%)',
      statusVariant: 'red',
      route: { id: 'admissions', label: 'Admissions', section: 'Clinical Operations' },
      meta: 'OT-04 • Dr. H. Lin • Intake Bay 4'
    },

    // 2. Operating Theatres
    {
      id: 'OT-01',
      name: 'OT-01 (Orthopedics Suite)',
      type: 'Total Hip Arthroplasty (R. Vance)',
      category: 'Operating Theatres',
      dept: 'Operating Theatres',
      pillar: 'indigo',
      status: 'In Progress (65%)',
      statusVariant: 'teal',
      route: { id: 'operating-theatres', label: 'Operating Theatres', section: 'Clinical Operations' },
      meta: 'Surgeon: Dr. S. Rao • Scheduled: 08:30 - 10:30'
    },
    {
      id: 'OT-02',
      name: 'OT-02 (General & Lap Suite)',
      type: 'TKR Prep (E. Rostova)',
      category: 'Operating Theatres',
      dept: 'Operating Theatres',
      pillar: 'indigo',
      status: 'Preparation (20%)',
      statusVariant: 'blue',
      route: { id: 'operating-theatres', label: 'Operating Theatres', section: 'Clinical Operations' },
      meta: 'Surgeon: Dr. K. Patel • Scheduled: 10:00 - 12:00'
    },
    {
      id: 'OT-03',
      name: 'OT-03 (Sports Med Suite)',
      type: 'ACL Reconstruction (M. Chen)',
      category: 'Operating Theatres',
      dept: 'Operating Theatres',
      pillar: 'indigo',
      status: 'Attention (+22m)',
      statusVariant: 'amber',
      route: { id: 'operating-theatres', label: 'Operating Theatres', section: 'Clinical Operations' },
      meta: 'Surgeon: Dr. J. Gomez • Autoclave Cooldown Lag'
    },
    {
      id: 'OT-04',
      name: 'OT-04 (Cardiovascular Suite)',
      type: 'CABG / Open Suite',
      category: 'Operating Theatres',
      dept: 'Operating Theatres',
      pillar: 'indigo',
      status: 'Ready (100%)',
      statusVariant: 'teal',
      route: { id: 'operating-theatres', label: 'Operating Theatres', section: 'Clinical Operations' },
      meta: 'Surgeon: Dr. H. Lin • Room Sanitized'
    },

    // 3. CSSD Packs
    {
      id: 'CSSD-00125',
      name: 'CSSD-00125 (TKR Instrument Set)',
      type: 'Total Knee Replacement Tray #01',
      category: 'CSSD Packs',
      dept: 'CSSD',
      pillar: 'teal',
      status: 'Sterile / Assigned OT-02',
      statusVariant: 'teal',
      route: { id: 'cssd', label: 'CSSD', section: 'Clinical Operations' },
      meta: 'Location: Storage A • Expiry: 15 Aug'
    },
    {
      id: 'CSSD-EXP-09',
      name: 'CSSD-EXP-09 (General Laparotomy Set)',
      type: 'General Laparotomy Kit #02',
      category: 'CSSD Packs',
      dept: 'CSSD',
      pillar: 'teal',
      status: 'PACK BLOCKED (Expired)',
      statusVariant: 'red',
      route: { id: 'cssd', label: 'CSSD', section: 'Clinical Operations' },
      meta: 'Location: Storage B • Expired 08 Aug'
    },
    {
      id: 'CSSD-00142',
      name: 'CSSD-00142 (Orthopedic Power Tool Set)',
      type: 'Heavy Saw & Reamer Kit #04',
      category: 'CSSD Packs',
      dept: 'CSSD',
      pillar: 'teal',
      status: 'In Sterilization (Cooldown)',
      statusVariant: 'amber',
      route: { id: 'cssd', label: 'CSSD', section: 'Clinical Operations' },
      meta: 'Location: Autoclave #02 • Target: OT-03'
    },
    {
      id: 'CSSD-00118',
      name: 'CSSD-00118 (THA Arthroplasty Tray)',
      type: 'Hip Replacement Set #01',
      category: 'CSSD Packs',
      dept: 'CSSD',
      pillar: 'teal',
      status: 'In Room (OT-01 Core)',
      statusVariant: 'indigo',
      route: { id: 'cssd', label: 'CSSD', section: 'Clinical Operations' },
      meta: 'Location: OT-01 Holding Core • Expiry: 14 Aug'
    },

    // 4. Alerts
    {
      id: 'ALT-101',
      name: 'Expired sterile pack detected (CSSD-EXP-09)',
      type: 'Safety Compliance Alert',
      category: 'Alerts',
      dept: 'CSSD',
      pillar: 'teal',
      status: 'Critical Alert',
      statusVariant: 'red',
      route: { id: 'alerts', label: 'Alerts', section: 'Intelligence' },
      meta: 'Tray exceeded 72h validated shelf-life • Dispatch blocked'
    },
    {
      id: 'ALT-102',
      name: 'OT-03 turnover exceeded expected duration',
      type: 'Operational Friction Alert',
      category: 'Alerts',
      dept: 'OT',
      pillar: 'indigo',
      status: 'Warning',
      statusVariant: 'amber',
      route: { id: 'alerts', label: 'Alerts', section: 'Intelligence' },
      meta: 'Turnover at 34m (Target 25m) • Assist sanitation dispatched'
    },
    {
      id: 'ALT-103',
      name: 'Patient transfer pending (P-1024)',
      type: 'Admissions Transport Delay',
      category: 'Alerts',
      dept: 'Admissions',
      pillar: 'blue',
      status: 'Warning',
      statusVariant: 'amber',
      route: { id: 'alerts', label: 'Alerts', section: 'Intelligence' },
      meta: 'Porter Beacon #14 queuing delay • Transfer lag +12m'
    },
    {
      id: 'ALT-104',
      name: 'Required instrument pack unavailable (CSSD-00142)',
      type: 'Supply Chain Bottleneck',
      category: 'Alerts',
      dept: 'CSSD',
      pillar: 'teal',
      status: 'Critical Alert',
      statusVariant: 'red',
      route: { id: 'alerts', label: 'Alerts', section: 'Intelligence' },
      meta: 'Autoclave cooldown purge overrun • OT-03 start delayed'
    },

    // 5. Workflow Events
    {
      id: 'EVT-01',
      name: 'Admission Complete (Case #1024)',
      type: 'Pre-Op Intake Milestone',
      category: 'Workflow Events',
      dept: 'Admissions',
      pillar: 'blue',
      status: 'Completed (08:00 AM)',
      statusVariant: 'teal',
      route: { id: 'workflow', label: 'Workflow', section: 'Intelligence' },
      meta: 'EMR Inpatient Intake Module • Bay 03'
    },
    {
      id: 'EVT-02',
      name: 'Consent Verified (Case #1024)',
      type: 'Clinical Document Compliance',
      category: 'Workflow Events',
      dept: 'Admissions',
      pillar: 'blue',
      status: 'Completed (08:45 AM)',
      statusVariant: 'teal',
      route: { id: 'workflow', label: 'Workflow', section: 'Intelligence' },
      meta: 'Digital e-Sign Tablet #03 • Signed by E. Rostova'
    },
    {
      id: 'EVT-03',
      name: 'Patient Transfer (Case #1024)',
      type: 'Handoff & Transportation',
      category: 'Workflow Events',
      dept: 'Admissions',
      pillar: 'blue',
      status: 'Delayed (+12m)',
      statusVariant: 'amber',
      route: { id: 'workflow', label: 'Workflow', section: 'Intelligence' },
      meta: 'Porter Beacon #14 • In transit from Pre-Op to OT-02'
    },
    {
      id: 'EVT-04',
      name: 'Instrument Pack Verified (Tray #CSSD-00125)',
      type: 'Sterile Field RFID Verification',
      category: 'Workflow Events',
      dept: 'CSSD',
      pillar: 'teal',
      status: 'Completed (10:00 AM)',
      statusVariant: 'teal',
      route: { id: 'workflow', label: 'Workflow', section: 'Intelligence' },
      meta: 'RFID Gateway #OT-02 • Biological Spore Passed'
    },
    {
      id: 'EVT-05',
      name: 'Procedure Started (OT-02 Incision)',
      type: 'Surgical Milestone',
      category: 'Workflow Events',
      dept: 'OT',
      pillar: 'indigo',
      status: 'Scheduled (10:15 AM)',
      statusVariant: 'blue',
      route: { id: 'workflow', label: 'Workflow', section: 'Intelligence' },
      meta: 'Surgical Time-Out Console • Dr. K. Patel'
    }
  ];

  // Filter items matching query
  const filteredItems = searchIndex.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      item.id.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.dept.toLowerCase().includes(q) ||
      item.meta.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  });

  // Group filtered results
  const groupedResults = {
    'Patients': filteredItems.filter(i => i.category === 'Patients'),
    'Operating Theatres': filteredItems.filter(i => i.category === 'Operating Theatres'),
    'CSSD Packs': filteredItems.filter(i => i.category === 'CSSD Packs'),
    'Alerts': filteredItems.filter(i => i.category === 'Alerts'),
    'Workflow Events': filteredItems.filter(i => i.category === 'Workflow Events')
  };

  const flattenedResults = [
    ...groupedResults['Patients'],
    ...groupedResults['Operating Theatres'],
    ...groupedResults['CSSD Packs'],
    ...groupedResults['Alerts'],
    ...groupedResults['Workflow Events']
  ];

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(flattenedResults.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flattenedResults.length) % Math.max(flattenedResults.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flattenedResults[selectedIndex]) {
          handleSelect(flattenedResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, flattenedResults]);

  const handleSelect = (item) => {
    onNavigate(item.route);
    onClose();
  };

  if (!isOpen) return null;

  let runningIndex = 0;

  return (
    <div className="ot-command-backdrop" onClick={onClose}>
      <div className="ot-command-palette" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Header */}
        <div className="command-search-header">
          <Search size={18} className="text-muted search-lead-icon" />
          <input
            ref={inputRef}
            type="text"
            className="command-search-input font-display"
            placeholder="Search patients, OTs, CSSD packs, events, alerts (e.g. P-1024, OT-03, CSSD-00125)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {query && (
            <button className="command-clear-btn" onClick={() => setQuery('')} aria-label="Clear query">
              <X size={14} />
            </button>
          )}
          <div className="command-esc-badge font-mono">ESC</div>
        </div>

        {/* Search Preset Suggestions (when empty) */}
        {!query && (
          <div className="command-suggestions-bar font-mono">
            <span className="sugg-label">TRY SEARCHING:</span>
            {['P-1024', 'OT-03', 'CSSD-00125', 'Total Knee Replacement', 'Expired Pack'].map((preset) => (
              <button
                key={preset}
                className="sugg-chip"
                onClick={() => setQuery(preset)}
                type="button"
              >
                {preset}
              </button>
            ))}
          </div>
        )}

        {/* Grouped Results List */}
        <div ref={listRef} className="command-results-body">
          {flattenedResults.length === 0 ? (
            <div className="command-no-results font-mono">
              <Search size={24} className="text-muted" />
              <span>No results matching "{query}" across Patients, OTs, CSSD, or Alerts</span>
            </div>
          ) : (
            Object.entries(groupedResults).map(([groupName, items]) => {
              if (items.length === 0) return null;

              return (
                <div key={groupName} className="command-result-group">
                  <div className="group-heading font-mono">
                    <span>{groupName.toUpperCase()}</span>
                    <span className="group-count">({items.length})</span>
                  </div>

                  <div className="group-items-list">
                    {items.map((item) => {
                      const currentIndex = runningIndex++;
                      const isSelected = currentIndex === selectedIndex;

                      return (
                        <div
                          key={item.id}
                          className={`command-item-row border-pillar-${item.pillar} ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                        >
                          <div className="item-left-col">
                            <div className="item-title-row">
                              <span className="item-name font-display">{item.name}</span>
                              <Badge variant={item.pillar} size="xs">{item.dept}</Badge>
                            </div>
                            <span className="item-type-meta font-mono">{item.type} • {item.meta}</span>
                          </div>

                          <div className="item-right-col">
                            <Badge variant={item.statusVariant} size="xs">{item.status}</Badge>
                            <span className="item-jump-action font-mono">
                              <span>Go</span>
                              <ChevronRight size={12} />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="command-palette-footer font-mono">
          <div className="footer-keys">
            <span className="key-combo"><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span className="key-combo"><kbd>↵</kbd> to open</span>
            <span className="key-combo"><kbd>esc</kbd> to close</span>
          </div>
          <div className="footer-ai-note">
            <Sparkles size={11} className="text-purple" />
            <span>OTFlow AI Global Index</span>
          </div>
        </div>
      </div>
    </div>
  );
};
