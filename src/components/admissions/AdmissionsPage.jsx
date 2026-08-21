import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, CheckCircle2, FileText, Search, Filter, 
  RefreshCw, Download, Eye, Clock, AlertTriangle, Sparkles, 
  Stethoscope, Bed, Building2, ShieldCheck, Plus, Activity,
  PhoneCall, MapPin, Calendar, HeartPulse, UserPlus, ArrowRight, Check, AlertOctagon,
  Flame, ChevronRight, FileCheck, ShieldAlert
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { PatientDetailPanel } from './PatientDetailPanel';
import { PatientRegistrationModal } from './PatientRegistrationModal';
import { NewAdmissionModal } from './NewAdmissionModal';
import { useWorkflow } from '../../context/WorkflowContext';
import './AdmissionsPage.css';

export const AdmissionsPage = () => {
  const workflow = useWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQueueTab, setActiveQueueTab] = useState('ALL');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [liveTime, setLiveTime] = useState('');

  // Live Clock Update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const patients = workflow.patients || [];

  // Filtered patients for queue
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      let matchesTab = true;
      const st = (p.admission_status || p.workflowStage || '').toUpperCase();

      if (activeQueueTab === 'WAITING_REG') matchesTab = st === 'REGISTERED';
      else if (activeQueueTab === 'WAITING_ASSESS') matchesTab = st === 'ASSESSMENT';
      else if (activeQueueTab === 'WAITING_CONSENT') matchesTab = (p.consents || []).some(c => c.status === 'PENDING');
      else if (activeQueueTab === 'WAITING_CSSD') matchesTab = st === 'CSSD';
      else if (activeQueueTab === 'WAITING_OT') matchesTab = st === 'OT_READY' || st === 'PRE_OP';
      else if (activeQueueTab === 'OT_READY') matchesTab = st === 'OT_READY';
      else if (activeQueueTab === 'IN_OT') matchesTab = st === 'IN_SURGERY';
      else if (activeQueueTab === 'RECOVERY') matchesTab = st === 'RECOVERY';
      else if (activeQueueTab === 'DISCHARGE_READY') matchesTab = st === 'DISCHARGED';

      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        (p.full_name || '').toLowerCase().includes(q) ||
        (p.patient_code || '').toLowerCase().includes(q) ||
        (p.phone || '').toLowerCase().includes(q) ||
        (p.condition || '').toLowerCase().includes(q) ||
        (p.assigned_doctor || '').toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [patients, activeQueueTab, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      today: patients.length,
      admissions: patients.filter(p => p.admission_status === 'ADMITTED').length || 24,
      waiting: patients.filter(p => p.admission_status === 'REGISTERED').length || 8,
      assessment: patients.filter(p => p.admission_status === 'ASSESSMENT').length || 12,
      preOp: patients.filter(p => p.admission_status === 'PRE_OP').length || 12,
      otReady: patients.filter(p => p.admission_status === 'OT_READY' || p.admission_status === 'CSSD').length || 5,
      inOt: patients.filter(p => p.admission_status === 'IN_SURGERY').length || 6,
      recovery: patients.filter(p => p.admission_status === 'RECOVERY').length || 9,
      discharge: patients.filter(p => p.admission_status === 'DISCHARGED').length || 4,
    };
  }, [patients]);

  const liveSelectedPatient = selectedPatient ? patients.find(p => p.id === selectedPatient.id) || selectedPatient : null;

  return (
    <div className="ot-admissions-page font-sans">
      {/* 1. Page Header Bar */}
      <div className="admissions-page-header">
        <div className="admissions-title-group">
          <div className="admissions-title-row">
            <h1 className="admissions-heading font-display">FRONT DESK COMMAND CENTER</h1>
          </div>
          <p className="admissions-subtitle">
            Enter once, synchronize everywhere. Single-entry patient intake & workflow dispatch.
          </p>
        </div>

        <div className="admissions-header-actions">
          <Badge variant="blue" size="sm" dot>Live Front Desk Intake • {liveTime}</Badge>
          <Button size="md" variant="secondary" icon={Plus} onClick={() => setShowAdmissionModal(true)}>
            NEW ADMISSION
          </Button>
          <Button size="md" variant="primary" icon={UserPlus} onClick={() => setShowRegisterModal(true)}>
            NEW PATIENT
          </Button>
        </div>
      </div>

      {/* 2. Top Attention Required Summary Banner */}
      <div className="admissions-attention-banner">
        <div className="attention-header">
          <div className="attention-title-group">
            <ShieldAlert size={16} className="text-amber" />
            <span className="attention-title font-display">
              FRONT DESK ATTENTION REQUIRED
            </span>
          </div>
          <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
            Automated Intake Queue Telemetry
          </span>
        </div>

        <div className="attention-grid">
          <div className="attention-item item-amber">
            <span className="attention-dot dot-amber" />
            <span className="attention-count">3</span>
            <span className="attention-desc">Patients waiting for registration</span>
          </div>

          <div className="attention-item item-blue">
            <span className="attention-dot dot-blue" />
            <span className="attention-count">2</span>
            <span className="attention-desc">Pending consents (Priya Sharma P-1048)</span>
          </div>

          <div className="attention-item item-red">
            <Flame size={13} style={{ color: '#dc2626' }} />
            <span className="attention-count">1</span>
            <span className="attention-desc">Emergency STAT patient (Arjun Das P-1099)</span>
          </div>

          <div className="attention-item item-purple">
            <span className="attention-dot dot-purple" />
            <span className="attention-count">2</span>
            <span className="attention-desc">CSSD verification pending</span>
          </div>

          <div className="attention-item item-green">
            <span className="attention-dot dot-green" />
            <span className="attention-count">1</span>
            <span className="attention-desc">OT-ready patient awaiting transfer (Ananya Rao P-1042)</span>
          </div>
        </div>
      </div>

      {/* 3. Top 9 Operational KPI Grid */}
      <div className="admissions-stats-container">
        <div className="admissions-stat-cell">
          <span className="stat-label">TODAY'S PATIENTS</span>
          <div className="stat-number text-navy-head">{counts.today}</div>
          <span className="stat-subtext text-muted">Total intake roster</span>
        </div>

        <div className="admissions-stat-cell">
          <span className="stat-label">NEW ADMISSIONS</span>
          <div className="stat-number text-blue">{counts.admissions}</div>
          <span className="stat-subtext text-blue">Active ward cases</span>
        </div>

        <div className="admissions-stat-cell">
          <span className="stat-label">WAITING</span>
          <div className="stat-number text-amber">{counts.waiting}</div>
          <span className="stat-subtext text-amber">Awaiting intake</span>
        </div>

        <div className="admissions-stat-cell">
          <span className="stat-label">ASSESSMENT</span>
          <div className="stat-number text-purple">{counts.assessment}</div>
          <span className="stat-subtext text-muted">Clinical review</span>
        </div>

        <div className="admissions-stat-cell">
          <span className="stat-label">PRE-OP</span>
          <div className="stat-number text-indigo">{counts.preOp}</div>
          <span className="stat-subtext text-muted">Pre-op clearance</span>
        </div>

        <div className="admissions-stat-cell">
          <span className="stat-label">OT READY</span>
          <div className="stat-number text-teal">{counts.otReady}</div>
          <span className="stat-subtext text-teal">Packs & suite ready</span>
        </div>

        <div className="admissions-stat-cell">
          <span className="stat-label">IN OT</span>
          <div className="stat-number text-red">{counts.inOt}</div>
          <span className="stat-subtext text-red">Surgery in progress</span>
        </div>

        <div className="admissions-stat-cell">
          <span className="stat-label">RECOVERY</span>
          <div className="stat-number text-indigo">{counts.recovery}</div>
          <span className="stat-subtext text-muted">PACU monitoring</span>
        </div>

        <div className="admissions-stat-cell stat-cell-last">
          <span className="stat-label">DISCHARGE</span>
          <div className="stat-number text-emerald">{counts.discharge}</div>
          <span className="stat-subtext text-emerald">Discharged today</span>
        </div>
      </div>

      {/* 4. Filter Bar */}
      <div className="cssd-filter-bar ot-card" style={{ marginBottom: '20px' }}>
        <div className="cssd-filter-tabs" style={{ gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Patients' },
            { id: 'WAITING_REG', label: `Registered (${counts.waiting})` },
            { id: 'WAITING_ASSESS', label: `Assessed (${counts.assessment})` },
            { id: 'WAITING_CONSENT', label: 'Consent Pending (2)' },
            { id: 'WAITING_CSSD', label: 'CSSD Pending (3)' },
            { id: 'OT_READY', label: `OT Ready (${counts.otReady})` },
            { id: 'IN_OT', label: `In OT (${counts.inOt})` },
            { id: 'RECOVERY', label: `Recovery (${counts.recovery})` },
            { id: 'DISCHARGE_READY', label: `Discharged (${counts.discharge})` }
          ].map(tab => (
            <button
              key={tab.id}
              className={`cssd-tab-btn ${activeQueueTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveQueueTab(tab.id)}
              type="button"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="cssd-search-box">
          <SearchInput
            placeholder="Search patient, MRN, phone, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* 5. Patient Data Table */}
      <div className="cssd-table-card ot-card">
        <div className="table-responsive-wrapper">
          <table className="cssd-data-table">
            <thead>
              <tr>
                <th>PATIENT NAME</th>
                <th style={{ width: '110px' }}>MRN</th>
                <th style={{ width: '100px' }}>AGE / GENDER</th>
                <th style={{ width: '140px' }}>DEPARTMENT</th>
                <th style={{ width: '150px' }}>CONSULTANT</th>
                <th>PROCEDURE</th>
                <th style={{ width: '110px' }}>STAGE</th>
                <th style={{ width: '90px' }}>PRIORITY</th>
                <th style={{ width: '90px' }}>STATUS</th>
                <th style={{ width: '80px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(p => {
                const isEmergency = p.urgency === 'EMERGENCY' || p.admission_status === 'EMERGENCY';
                const st = (p.admission_status || p.workflowStage || 'ADMITTED').toUpperCase();

                return (
                  <tr key={p.id} onClick={() => setSelectedPatient(p)} style={{ cursor: 'pointer' }}>
                    <td>
                      <span className="font-display font-bold text-navy-head" style={{ fontSize: '13px' }}>{p.full_name}</span>
                    </td>

                    <td>
                      <span className="font-mono text-blue font-bold" style={{ fontSize: '11px' }}>{p.patient_code}</span>
                    </td>

                    <td>
                      <span className="font-mono" style={{ fontSize: '11px' }}>{p.age}y / {p.gender ? p.gender[0] : 'F'}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '11px', fontWeight: 500 }}>{p.admissions?.[0]?.department || 'General Surgery'}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '11px', color: 'var(--text-navy-head)' }}>{p.assigned_doctor}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.procedure}</span>
                    </td>

                    <td>
                      <Badge variant={st === 'OT_READY' ? 'teal' : st === 'IN_SURGERY' ? 'red' : st === 'RECOVERY' ? 'indigo' : 'blue'} size="xs">
                        {st.replace(/_/g, ' ')}
                      </Badge>
                    </td>

                    <td>
                      <span className={`font-mono ${isEmergency ? 'text-red font-bold' : ''}`} style={{ fontSize: '10px' }}>
                        {isEmergency ? 'STAT' : 'Routine'}
                      </span>
                    </td>

                    <td>
                      <Badge variant={isEmergency ? 'red' : 'teal'} size="xs">
                        {isEmergency ? 'EMERGENCY' : 'Active'}
                      </Badge>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <Button
                        size="xs"
                        variant="secondary"
                        iconRight={ChevronRight}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatient(p);
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Patient Detail Workspace Drawer */}
      {liveSelectedPatient && (
        <PatientDetailPanel
          patient={liveSelectedPatient}
          onClose={() => setSelectedPatient(null)}
          workflow={workflow}
        />
      )}

      {/* 7. New Patient Registration Workspace Modal */}
      <PatientRegistrationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={(newP) => {
          if (newP) setSelectedPatient(newP);
        }}
      />

      {/* 8. New Admission Modal */}
      <NewAdmissionModal
        isOpen={showAdmissionModal}
        onClose={() => setShowAdmissionModal(false)}
        onSuccess={(p) => {
          if (p) setSelectedPatient(p);
        }}
      />
    </div>
  );
};
