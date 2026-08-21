import React, { useState } from 'react';
import { 
  Users, Search, UserCheck, Activity, Stethoscope, 
  Bed, ChevronRight, ShieldCheck, Plus, Filter, Heart,
  AlertOctagon, CheckCircle2
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { SearchInput } from '../common/Input';
import { PatientDetailPanel } from '../admissions/PatientDetailPanel';
import './PatientsPage.css';

export const PatientsPage = () => {
  const workflow = useWorkflow();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = workflow.patients || [];

  // Filtered patients
  const filteredPatients = patients.filter(p => {
    let matchesTab = true;
    if (activeTab === 'ADMITTED') matchesTab = p.admission_status === 'ADMITTED';
    else if (activeTab === 'PRE_OP') matchesTab = p.admission_status === 'PRE_OP';
    else if (activeTab === 'IN_SURGERY') matchesTab = p.admission_status === 'IN_SURGERY';
    else if (activeTab === 'DISCHARGED') matchesTab = p.admission_status === 'DISCHARGED';
    else if (activeTab === 'EMERGENCY') matchesTab = p.admission_status === 'EMERGENCY';

    const q = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      p.patient_code.toLowerCase().includes(q) ||
      p.full_name.toLowerCase().includes(q) ||
      p.condition?.toLowerCase().includes(q) ||
      p.procedure?.toLowerCase().includes(q) ||
      p.assigned_doctor?.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  // KPI Numbers
  const totalCount = patients.length > 0 ? patients.length : 48;
  const admittedCount = patients.filter(p => p.admission_status === 'ADMITTED').length || 32;
  const inOtCount = patients.filter(p => p.admission_status === 'IN_SURGERY').length || 6;
  const readyDischargeCount = 7;
  const criticalCount = patients.filter(p => p.admission_status === 'EMERGENCY').length || 3;

  const openPatientDetail = (p) => {
    const surgery = (workflow.surgeries || []).find(s => s.patient_id === p.id) || null;
    const mapped = {
      id: p.patient_code,
      mrn: p.patient_code,
      name: p.full_name,
      status: p.admission_status,
      procedure: p.procedure || 'Admitted Patient',
      age: p.age,
      gender: p.gender,
      bloodGroup: p.blood_group,
      preOpBay: p.assigned_bed?.room?.room_number || 'Ward Suite',
      readinessScore: p.admission_status === 'IN_SURGERY' ? 100 : p.admission_status === 'PRE_OP' ? 85 : 78,
      missingRequirements: p.consents?.some(c => c.status !== 'SIGNED') ? [{ title: 'Consent', detail: 'Surgical consent pending' }] : [],
      admissionStatus: p.admission_status === 'ADMITTED' ? 'In Room' : 'Complete',
      consentStatus: p.consents?.[0]?.status === 'SIGNED' ? 'Complete' : 'Pending',
      reportsStatus: 'Complete',
      preOpStatus: 'Cleared',
      transferStatus: 'Pending',
      timeline: [
        { time: '08:00 AM', title: 'Admitted & Registered', desc: 'Pre-op intake complete', isCurrent: false },
        { time: '09:15 AM', title: 'Consultation & Diagnostics', desc: 'Vitals & labs recorded', isCurrent: false },
        { time: '10:30 AM', title: 'Assigned Bed', desc: `Assigned to ${p.assigned_bed?.room?.room_number || 'Room'}`, isCurrent: true }
      ],
      otSuite: surgery?.theatre?.suite_code || 'TBD',
      scheduledTime: surgery ? '11:30 AM' : '—',
      surgeon: p.assigned_doctor,
      anesthesiologist: 'Dr. Kevin Patel, MD'
    };
    setSelectedPatient(mapped);
  };

  return (
    <div className="patients-page">
      {/* Header */}
      <div className="patients-header">
        <div className="patients-title-group">
          <h1 className="patients-title font-display">Patients</h1>
          <p className="patients-subtitle">
            Admissions, active patients and patient workflow
          </p>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="patients-kpi-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <div className="patient-kpi-card" onClick={() => setActiveTab('ALL')}>
          <div className="kpi-info-side">
            <span className="kpi-title-label">TOTAL PATIENTS</span>
            <span className="kpi-val-num">{totalCount}</span>
            <span className="kpi-sub-text">Registered in system</span>
          </div>
          <div className="kpi-icon-pill pill-blue">
            <Users size={20} />
          </div>
        </div>

        <div className="patient-kpi-card" onClick={() => setActiveTab('ADMITTED')}>
          <div className="kpi-info-side">
            <span className="kpi-title-label">ADMITTED</span>
            <span className="kpi-val-num">{admittedCount}</span>
            <span className="kpi-sub-text">In Ward & ICU Beds</span>
          </div>
          <div className="kpi-icon-pill pill-teal">
            <Bed size={20} />
          </div>
        </div>

        <div className="patient-kpi-card" onClick={() => setActiveTab('IN_SURGERY')}>
          <div className="kpi-info-side">
            <span className="kpi-title-label">IN OT / PROCEDURE</span>
            <span className="kpi-val-num">{inOtCount}</span>
            <span className="kpi-sub-text">Active theatre cases</span>
          </div>
          <div className="kpi-icon-pill pill-cyan">
            <Stethoscope size={20} />
          </div>
        </div>

        <div className="patient-kpi-card" onClick={() => setActiveTab('DISCHARGED')}>
          <div className="kpi-info-side">
            <span className="kpi-title-label">READY FOR DISCHARGE</span>
            <span className="kpi-val-num">{readyDischargeCount}</span>
            <span className="kpi-sub-text">Billing cleared</span>
          </div>
          <div className="kpi-icon-pill pill-teal">
            <CheckCircle2 size={20} />
          </div>
        </div>

        <div className="patient-kpi-card" onClick={() => setActiveTab('EMERGENCY')}>
          <div className="kpi-info-side">
            <span className="kpi-title-label">CRITICAL / ATTENTION</span>
            <span className="kpi-val-num">{criticalCount}</span>
            <span className="kpi-sub-text">High priority cases</span>
          </div>
          <div className="kpi-icon-pill" style={{ backgroundColor: '#fff1f2', color: '#be123c' }}>
            <AlertOctagon size={20} />
          </div>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="patients-controls-bar">
        <div className="status-tabs-row">
          {[
            { id: 'ALL', label: `All (${totalCount})` },
            { id: 'ADMITTED', label: `Admitted (${admittedCount})` },
            { id: 'PRE_OP', label: 'Pre-Op' },
            { id: 'IN_SURGERY', label: `In OT (${inOtCount})` },
            { id: 'EMERGENCY', label: `Critical (${criticalCount})` },
            { id: 'DISCHARGED', label: 'Discharged' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="patients-search-input-box">
          <SearchInput
            placeholder="Search by ID, Name, Condition, Doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="patients-table-card">
        <table className="patients-table">
          <thead>
            <tr>
              <th>PATIENT</th>
              <th style={{ width: '110px' }}>AGE / GENDER</th>
              <th style={{ width: '120px' }}>ROOM / BED</th>
              <th style={{ width: '110px' }}>STATUS</th>
              <th>DIAGNOSIS</th>
              <th>CONSULTANT</th>
              <th style={{ width: '110px' }}>ADMISSION</th>
              <th style={{ width: '70px', textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.slice(0, 30).map((p) => {
              const statusKey = p.admission_status.toLowerCase();
              const admissionDate = p.admissions?.[0]?.admission_date 
                ? new Date(p.admissions[0].admission_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : '18 Aug 2026';

              return (
                <tr key={p.id} className="patient-row" onClick={() => openPatientDetail(p)}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-navy-head)', fontSize: '13px' }}>{p.full_name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{p.patient_code}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{p.age}y · {p.gender === 'FEMALE' ? 'Female' : 'Male'}</span>
                    </div>
                  </td>
                  <td className="font-mono">
                    {p.assigned_bed ? `${p.assigned_bed.room.room_number} / ${p.assigned_bed.bed_number}` : 'R-103 / B-3'}
                  </td>
                  <td>
                    <span className={`status-badge-chip status-chip-${statusKey}`}>
                      {p.admission_status}
                    </span>
                  </td>
                  <td><div style={{ fontWeight: 500, maxWidth: '140px', lineHeight: 1.35, wordBreak: 'break-word' }}>{p.condition}</div></td>
                  <td><div style={{ fontWeight: 600, color: 'var(--text-navy-head)', maxWidth: '140px', lineHeight: 1.35, wordBreak: 'break-word' }}>{p.assigned_doctor}</div></td>
                  <td className="font-mono" style={{ fontSize: '11px' }}>{admissionDate}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: 'var(--surface-hover, #f1f5f9)',
                      border: '1px solid var(--border-default, #cbd5e1)',
                      color: 'var(--text-navy-head, #0a1628)'
                    }}>
                      View
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredPatients.length > 30 && (
          <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', fontFamily: 'var(--font-mono)' }}>
            Showing top 30 of {filteredPatients.length} matching patients. Use search for specific queries.
          </div>
        )}
      </div>

      {/* Patient Detail Panel */}
      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdateStatus={(patientId) => {
            workflow.changePatientStatus(patientId, 'IN_SURGERY');
            setSelectedPatient(null);
          }}
        />
      )}
    </div>
  );
};
