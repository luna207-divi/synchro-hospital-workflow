import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  FileText, 
  Truck, 
  Search, 
  Filter, 
  ChevronRight, 
  RefreshCw, 
  Download, 
  Eye, 
  Clock, 
  AlertTriangle,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { PatientDetailPanel } from './PatientDetailPanel';
import './AdmissionsPage.css';

export const AdmissionsPage = () => {
  const [filterTab, setFilterTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [patients, setPatients] = useState([
    {
      id: 'P-1024',
      name: 'Elena Rostova',
      mrn: 'MRN-9204',
      age: '58y',
      gender: 'Female',
      bloodGroup: 'A+',
      preOpBay: 'Pre-Op Bay 03',
      procedure: 'Total Knee Replacement (Left)',
      specialty: 'Orthopedics & Joint',
      scheduledTime: '10:00 AM',
      otSuite: 'OT-02',
      surgeon: 'Dr. K. Patel, MD',
      anesthesiologist: 'Dr. S. Nair, MD',
      admissionStatus: 'Complete',
      consentStatus: 'Complete',
      reportsStatus: 'Complete',
      preOpStatus: 'Complete',
      transferStatus: 'Pending',
      readinessScore: 85,
      status: 'Watch',
      missingRequirements: [
        {
          title: 'Transport Porter Dispatch Confirmation',
          detail: 'Assigned transport porter delayed in transit from 4C. Patient ready in Bay 03.'
        }
      ],
      timeline: [
        { time: '07:30 AM', title: 'Inpatient Admission Check-in', desc: 'Patient admitted through day surgery registration.' },
        { time: '08:15 AM', title: 'Diagnostic Lab Reports Ingested', desc: 'CBC, Electrolytes, Coagulation approved by hematology.' },
        { time: '08:45 AM', title: 'Surgical & Anesthesia Consent Validated', desc: 'Dual digital signature on file.' },
        { time: '09:20 AM', title: 'Pre-Anesthetic Risk Assessment Cleared', desc: 'ASA-II risk profile cleared by Dr. Nair.' },
        { time: '09:40 AM', title: 'Transport Order Placed for OT-02', desc: 'Awaiting porter pickup.', isCurrent: true }
      ]
    },
    {
      id: 'P-1025',
      name: 'Robert Vance',
      mrn: 'MRN-8419',
      age: '62y',
      gender: 'Male',
      bloodGroup: 'O+',
      preOpBay: 'Pre-Op Bay 01',
      procedure: 'Total Hip Arthroplasty (Right)',
      specialty: 'Orthopedics & Joint',
      scheduledTime: '08:30 AM',
      otSuite: 'OT-01',
      surgeon: 'Dr. A. Miller, MD',
      anesthesiologist: 'Dr. M. Chen, MD',
      admissionStatus: 'Complete',
      consentStatus: 'Complete',
      reportsStatus: 'Complete',
      preOpStatus: 'Complete',
      transferStatus: 'In Room',
      readinessScore: 100,
      status: 'Ready',
      missingRequirements: [],
      timeline: [
        { time: '06:45 AM', title: 'Admitted & Prepped', desc: 'Pre-op checklist complete.' },
        { time: '07:30 AM', title: 'Anesthesia Induction Cleared', desc: 'Spinal block prepped.' },
        { time: '08:15 AM', title: 'Transferred to OT-01', desc: 'Patient in room on surgical table.' }
      ]
    },
    {
      id: 'P-1026',
      name: 'Marcus Chen',
      mrn: 'MRN-3318',
      age: '34y',
      gender: 'Male',
      bloodGroup: 'B+',
      preOpBay: 'Pre-Op Bay 02',
      procedure: 'Anterior Cruciate Ligament (ACL) Reconstruction',
      specialty: 'Sports Medicine & Arthroscopy',
      scheduledTime: '10:30 AM',
      otSuite: 'OT-03',
      surgeon: 'Dr. J. Gomez, MD',
      anesthesiologist: 'Dr. L. Zhang, MD',
      admissionStatus: 'Complete',
      consentStatus: 'Missing',
      reportsStatus: 'Complete',
      preOpStatus: 'In Progress',
      transferStatus: 'Pending',
      readinessScore: 50,
      status: 'Delay Risk',
      missingRequirements: [
        {
          title: 'Informed Surgical Consent Form Missing',
          detail: 'Attending surgeon signature pending on digital consent form in EMR chart.'
        },
        {
          title: 'Pre-Anesthesia Final Sign-off Pending',
          detail: 'Airway assessment physical exam in progress.'
        }
      ],
      timeline: [
        { time: '08:00 AM', title: 'Admitted in Pre-Op Bay 02', desc: 'Vitals and IV line established.' },
        { time: '09:00 AM', title: 'Automated Pre-Op Audit Flagged Consent', desc: 'Signature missing alert dispatched.', isCurrent: true }
      ]
    },
    {
      id: 'P-1027',
      name: 'Sarah Jenkins',
      mrn: 'MRN-7741',
      age: '49y',
      gender: 'Female',
      bloodGroup: 'AB+',
      preOpBay: 'Pre-Op Bay 04',
      procedure: 'Total Knee Arthroplasty (TKA)',
      specialty: 'Orthopedics & Joint',
      scheduledTime: '11:30 AM',
      otSuite: 'OT-04',
      surgeon: 'Dr. R. Sharma, MD',
      anesthesiologist: 'Dr. K. Patel, MD',
      admissionStatus: 'Complete',
      consentStatus: 'Complete',
      reportsStatus: 'Pending Labs',
      preOpStatus: 'In Progress',
      transferStatus: 'Pending',
      readinessScore: 65,
      status: 'Watch',
      missingRequirements: [
        {
          title: 'Coagulation Panel Lab Result Pending',
          detail: 'PT/INR re-draw requested by anesthesia; lab processing estimated at 10 mins.'
        }
      ],
      timeline: [
        { time: '08:30 AM', title: 'Admitted & Prepped', desc: 'Pre-op documentation initiated.' },
        { time: '09:15 AM', title: 'Stat Lab Coagulation Drawn', desc: 'Sent to central clinical lab.', isCurrent: true }
      ]
    },
    {
      id: 'P-1028',
      name: 'David Wilson',
      mrn: 'MRN-5519',
      age: '67y',
      gender: 'Male',
      bloodGroup: 'O-',
      preOpBay: 'Pre-Op Bay 05',
      procedure: 'Coronary Artery Bypass Graft (CABG)',
      specialty: 'Cardiovascular Surgery',
      scheduledTime: '11:15 AM',
      otSuite: 'OT-06',
      surgeon: 'Dr. E. Thorne, MD',
      anesthesiologist: 'Dr. S. Nair, MD',
      admissionStatus: 'Complete',
      consentStatus: 'Complete',
      reportsStatus: 'Complete',
      preOpStatus: 'Complete',
      transferStatus: 'En Route',
      readinessScore: 95,
      status: 'Ready',
      missingRequirements: [],
      timeline: [
        { time: '07:00 AM', title: 'Cardiac Pre-Op Workup Completed', desc: 'Echo and cross-match verified.' },
        { time: '10:45 AM', title: 'Porter Transport En Route', desc: 'Patient moving to Surgical Core 6.', isCurrent: true }
      ]
    },
    {
      id: 'P-1029',
      name: 'Maria Rodriguez',
      mrn: 'MRN-4421',
      age: '42y',
      gender: 'Female',
      bloodGroup: 'A-',
      preOpBay: 'Pre-Op Bay 06',
      procedure: 'Laparoscopic Cholecystectomy',
      specialty: 'General Surgery',
      scheduledTime: '12:00 PM',
      otSuite: 'OT-05',
      surgeon: 'Dr. J. Gomez, MD',
      anesthesiologist: 'Dr. L. Zhang, MD',
      admissionStatus: 'In Progress',
      consentStatus: 'Complete',
      reportsStatus: 'Complete',
      preOpStatus: 'In Progress',
      transferStatus: 'Pending',
      readinessScore: 40,
      status: 'Watch',
      missingRequirements: [
        {
          title: 'Nursing Pre-Op Checklist in Progress',
          detail: 'IV access verification and surgical site skin preparation underway.'
        }
      ],
      timeline: [
        { time: '09:30 AM', title: 'Arrived at Admissions Counter', desc: 'Intake registration active.', isCurrent: true }
      ]
    }
  ]);

  const handleUpdatePatientStatus = (id) => {
    setPatients(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          transferStatus: 'En Route',
          readinessScore: 100,
          status: 'Ready',
          missingRequirements: []
        };
      }
      return p;
    }));
  };

  const filteredPatients = patients.filter(p => {
    let matchesTab = true;
    if (filterTab === 'READY') matchesTab = p.status === 'Ready';
    else if (filterTab === 'WATCH') matchesTab = p.status === 'Watch';
    else if (filterTab === 'DELAY_RISK') matchesTab = p.status === 'Delay Risk';
    else if (filterTab === 'TRANSFER_PENDING') matchesTab = p.transferStatus === 'Pending';

    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.procedure.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.otSuite.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const totalScheduled = 24;
  const otReadyCount = patients.filter(p => p.status === 'Ready').length + 15; // simulated total today
  const awaitingDocsCount = 3;
  const transferPendingCount = 3;

  return (
    <div className="ot-admissions-page">
      {/* 1. Page Header */}
      <div className="admissions-header">
        <div className="admissions-title-group">
          <div className="admissions-title-row">
            <h1 className="admissions-heading font-display">Admissions & Patient Readiness</h1>
            <Badge variant="teal" size="sm" dot>Active Surgical Roster</Badge>
          </div>
          <p className="admissions-subtitle">
            Real-time tracking of patient intake, pre-operative clinical clearances, consents, and OT transfer status.
          </p>
        </div>

        <div className="admissions-header-actions">
          <Button size="sm" variant="secondary" icon={RefreshCw}>
            Refresh Roster
          </Button>
          <Button size="sm" variant="secondary" icon={Download}>
            Export Readiness Log
          </Button>
        </div>
      </div>

      {/* 2. Top Summary Row (4 Key Operational Metrics) */}
      <div className="admissions-kpi-grid">
        <div className="adm-kpi-card ot-card accent-blue">
          <div className="adm-kpi-left">
            <span className="adm-kpi-title font-mono">PATIENTS SCHEDULED TODAY</span>
            <div className="adm-kpi-val-row">
              <span className="adm-kpi-num font-display">{totalScheduled}</span>
              <span className="adm-kpi-unit font-mono">cases</span>
            </div>
            <span className="adm-kpi-sub">Day Shift: 18 Main Pavilion / 6 West</span>
          </div>
          <div className="adm-kpi-icon-pill pill-blue">
            <Users size={18} />
          </div>
        </div>

        <div className="adm-kpi-card ot-card accent-teal">
          <div className="adm-kpi-left">
            <span className="adm-kpi-title font-mono">OT READY</span>
            <div className="adm-kpi-val-row">
              <span className="adm-kpi-num text-teal font-display">{otReadyCount}</span>
              <span className="adm-kpi-unit font-mono">/ {totalScheduled} (75%)</span>
            </div>
            <span className="adm-kpi-sub">100% Pre-op checklist validated</span>
          </div>
          <div className="adm-kpi-icon-pill pill-teal">
            <CheckCircle2 size={18} />
          </div>
        </div>

        <div className="adm-kpi-card ot-card accent-amber">
          <div className="adm-kpi-left">
            <span className="adm-kpi-title font-mono">AWAITING DOCUMENTATION</span>
            <div className="adm-kpi-val-row">
              <span className="adm-kpi-num text-amber font-display">{awaitingDocsCount}</span>
              <span className="adm-kpi-unit font-mono">pending</span>
            </div>
            <span className="adm-kpi-sub">2 Missing Consents • 1 Lab Delay</span>
          </div>
          <div className="adm-kpi-icon-pill pill-amber">
            <FileText size={18} />
          </div>
        </div>

        <div className="adm-kpi-card ot-card accent-indigo">
          <div className="adm-kpi-left">
            <span className="adm-kpi-title font-mono">TRANSFER PENDING</span>
            <div className="adm-kpi-val-row">
              <span className="adm-kpi-num text-indigo font-display">{transferPendingCount}</span>
              <span className="adm-kpi-unit font-mono">in holding</span>
            </div>
            <span className="adm-kpi-sub">Porters dispatched for OT-02, OT-03, OT-05</span>
          </div>
          <div className="adm-kpi-icon-pill pill-indigo">
            <Truck size={18} />
          </div>
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="admissions-filter-bar ot-card">
        <div className="filter-tabs-wrapper">
          {[
            { id: 'ALL', label: 'All Patients' },
            { id: 'READY', label: 'OT Ready' },
            { id: 'WATCH', label: 'Watch Status' },
            { id: 'DELAY_RISK', label: 'Delay Risk' },
            { id: 'TRANSFER_PENDING', label: 'Transfer Pending' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`filter-tab-pill ${filterTab === tab.id ? 'is-active' : ''}`}
              onClick={() => setFilterTab(tab.id)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="admissions-search-wrapper">
          <SearchInput
            placeholder="Search patient, MRN, procedure, OT suite..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* 4. High-Density Patient Readiness Table */}
      <div className="admissions-table-card ot-card">
        <div className="table-responsive-wrapper">
          <table className="patient-readiness-table">
            <thead>
              <tr>
                <th>PATIENT</th>
                <th>PROCEDURE</th>
                <th style={{ width: '100px' }}>SCHED. TIME</th>
                <th style={{ width: '80px' }}>OT</th>
                <th style={{ width: '100px' }}>ADMISSION</th>
                <th style={{ width: '100px' }}>CONSENT</th>
                <th style={{ width: '110px' }}>REPORTS</th>
                <th style={{ width: '110px' }}>PRE-OP</th>
                <th style={{ width: '105px' }}>TRANSFER</th>
                <th style={{ width: '130px' }}>READINESS</th>
                <th style={{ width: '100px' }}>STATUS</th>
                <th style={{ width: '110px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p) => {
                const isSelected = selectedPatient?.id === p.id;
                return (
                  <tr 
                    key={p.id}
                    className={`patient-row ${isSelected ? 'row-is-selected' : ''}`}
                    onClick={() => setSelectedPatient(p)}
                  >
                    {/* Patient */}
                    <td>
                      <div className="patient-cell-group">
                        <span className="patient-cell-name font-display">{p.name}</span>
                        <div className="patient-cell-ids font-mono">
                          <span className="p-id-tag">{p.id}</span>
                          <span className="p-mrn-tag">{p.mrn}</span>
                        </div>
                      </div>
                    </td>

                    {/* Procedure */}
                    <td>
                      <span className="procedure-cell-text">{p.procedure}</span>
                    </td>

                    {/* Scheduled Time */}
                    <td>
                      <span className="time-cell-text font-mono">{p.scheduledTime}</span>
                    </td>

                    {/* OT */}
                    <td>
                      <span className="ot-badge font-mono">{p.otSuite}</span>
                    </td>

                    {/* Admission */}
                    <td>
                      <span className={`cell-pill pill-${p.admissionStatus === 'Complete' ? 'complete' : 'pending'} font-mono`}>
                        {p.admissionStatus}
                      </span>
                    </td>

                    {/* Consent */}
                    <td>
                      <span className={`cell-pill pill-${p.consentStatus === 'Complete' ? 'complete' : 'missing'} font-mono`}>
                        {p.consentStatus}
                      </span>
                    </td>

                    {/* Reports */}
                    <td>
                      <span className={`cell-pill pill-${p.reportsStatus === 'Complete' ? 'complete' : 'pending'} font-mono`}>
                        {p.reportsStatus}
                      </span>
                    </td>

                    {/* Pre-Op */}
                    <td>
                      <span className={`cell-pill pill-${p.preOpStatus === 'Complete' ? 'complete' : 'pending'} font-mono`}>
                        {p.preOpStatus}
                      </span>
                    </td>

                    {/* Transfer */}
                    <td>
                      <span className={`cell-pill pill-${p.transferStatus === 'In Room' || p.transferStatus === 'En Route' ? 'complete' : 'pending'} font-mono`}>
                        {p.transferStatus}
                      </span>
                    </td>

                    {/* Readiness Score Progress */}
                    <td>
                      <div className="readiness-meter-cell">
                        <div className="readiness-meter-bar">
                          <div 
                            className={`meter-fill ${p.readinessScore >= 90 ? 'fill-teal' : p.readinessScore >= 70 ? 'fill-amber' : 'fill-red'}`}
                            style={{ width: `${p.readinessScore}%` }}
                          />
                        </div>
                        <span className="readiness-score-num font-mono">{p.readinessScore}%</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>
                      <Badge 
                        variant={p.status === 'Ready' ? 'teal' : p.status === 'Watch' ? 'amber' : 'red'}
                        size="xs"
                      >
                        {p.status}
                      </Badge>
                    </td>

                    {/* Action */}
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
                        View Patient
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Right-Side Patient Detail Readiness Panel */}
      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdateStatus={handleUpdatePatientStatus}
        />
      )}
    </div>
  );
};
