import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, FileText, Search, Filter, 
  RefreshCw, Download, Eye, Clock, AlertTriangle, Sparkles, 
  Stethoscope, Bed, Building2, ShieldCheck, Plus, Activity,
  PhoneCall, MapPin, Calendar, HeartPulse, UserPlus, ArrowRight, Check, AlertOctagon
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import { PatientDetailPanel } from './PatientDetailPanel';
import { PatientRegistrationModal } from './PatientRegistrationModal';
import { useWorkflow } from '../../context/WorkflowContext';
import './AdmissionsPage.css';

/**
 * SYNCHRO — FRONT DESK COMMAND CENTER
 * Dedicated route: /frontdesk
 * Complete intake, patient registration, admission queue, and bed assignment.
 */
export const AdmissionsPage = () => {
  const workflow = useWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
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

  // Filtered recent patients
  const filteredPatients = patients.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.full_name?.toLowerCase().includes(q) ||
      p.patient_code?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.condition?.toLowerCase().includes(q) ||
      p.assigned_doctor?.toLowerCase().includes(q);
  });

  // Admission Queue Data (Patients waiting for bed/admission completion)
  const [admissionQueue, setAdmissionQueue] = useState([
    { id: 'AQ-101', name: 'Robert Gupta', mrn: 'MRN-1047', dept: 'Cardiology', type: 'Scheduled', waitTime: '18 min', bedStatus: 'Bed Available', bedCode: 'Room R-204 / Bed C2' },
    { id: 'AQ-102', name: 'Arjun Das', mrn: 'MRN-1045', dept: 'General Surgery', type: 'Walk-in', waitTime: '25 min', bedStatus: 'Bed Available', bedCode: 'Room R-103 / Bed B1' },
    { id: 'AQ-103', name: 'Priya Sharma', mrn: 'MRN-1048', dept: 'Orthopedics', type: 'Referral', waitTime: '32 min', bedStatus: 'Bed Assignment Pending', bedCode: null },
    { id: 'AQ-104', name: 'Vikram Malhotra', mrn: 'MRN-1049', dept: 'Neurology', type: 'Emergency', waitTime: '8 min', bedStatus: 'Bed Available', bedCode: 'ICU Suite / Bed ICU-2' }
  ]);

  const handleCompleteAdmission = (queueId) => {
    setAdmissionQueue(prev => prev.filter(item => item.id !== queueId));
  };

  const openPatientDetail = (p) => {
    const mapped = {
      id: p.patient_code || p.id,
      mrn: p.patient_code || p.id,
      name: p.full_name,
      status: p.admission_status,
      procedure: p.procedure || p.condition || 'Admitted Patient',
      age: p.age,
      gender: p.gender === 'FEMALE' ? 'Female' : 'Male',
      bloodGroup: p.blood_group,
      preOpBay: p.assigned_bed?.room?.room_number || 'Room R-103',
      readinessScore: 92,
      missingRequirements: [],
      admissionStatus: 'In Room',
      consentStatus: 'Complete',
      reportsStatus: 'Complete',
      preOpStatus: 'Cleared',
      transferStatus: 'Pending',
      timeline: [
        { time: '08:00 AM', title: 'Front Desk Intake', desc: 'Patient registered & ID verified', isCurrent: false },
        { time: '08:15 AM', title: 'Admission & Bed Assignment', desc: `Assigned to ${p.assigned_bed?.room?.room_number || 'Room R-103'}`, isCurrent: false },
        { time: '08:30 AM', title: 'Consultant Assignment', desc: `Assigned to ${p.assigned_doctor || 'Dr. Rajesh Sharma'}`, isCurrent: true }
      ],
      otSuite: 'OT-02',
      scheduledTime: '11:30 AM',
      surgeon: p.assigned_doctor || 'Dr. Rajesh Sharma, MD',
      anesthesiologist: 'Dr. Kevin Patel, MD'
    };
    setSelectedPatient(mapped);
  };

  return (
    <div className="ot-admissions-page">
      {/* ── 1. Page Header Bar ───────────────────────────────────── */}
      <div className="admissions-page-header">
        <div className="admissions-title-group">
          <div className="admissions-title-row">
            <h1 className="admissions-heading font-display">FRONT DESK COMMAND CENTER</h1>
            <Badge variant="blue" size="sm" dot>Live Front Desk Intake</Badge>
          </div>
          <p className="admissions-subtitle">
            Patient registration, admissions and hospital intake
          </p>
        </div>

        <div className="admissions-header-actions">
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button size="md" variant="secondary" icon={Plus} onClick={() => setShowRegisterModal(true)}>
              New Admission
            </Button>
            <Button size="md" variant="primary" icon={UserPlus} onClick={() => setShowRegisterModal(true)}>
              New Patient
            </Button>
          </div>
        </div>
      </div>

      {/* ── 2. Top 5 Operational KPI Cards ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '24px' }}>
        <div className="ot-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>TODAY'S REGISTRATIONS</span>
            <Users size={18} style={{ color: 'var(--primary-blue)' }} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)' }}>18</span>
          <span style={{ fontSize: '11px', color: 'var(--state-teal-text)', fontWeight: 600 }}>+4 from yesterday</span>
        </div>

        <div className="ot-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>WAITING FOR ADMISSION</span>
            <Clock size={18} style={{ color: 'var(--state-amber)' }} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--state-amber-text)' }}>5</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Awaiting bed assignment</span>
        </div>

        <div className="ot-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>ADMITTED TODAY</span>
            <Bed size={18} style={{ color: 'var(--primary-blue)' }} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary-blue)' }}>12</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Inpatient beds assigned</span>
        </div>

        <div className="ot-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>AVAILABLE BEDS</span>
            <CheckCircle2 size={18} style={{ color: 'var(--state-teal)' }} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--state-teal-text)' }}>23</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>23 of 120 available</span>
        </div>

        <div className="ot-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>PENDING DOCUMENTS</span>
            <FileText size={18} style={{ color: 'var(--state-purple)' }} />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)' }}>4</span>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Consent & ID pending</span>
        </div>
      </div>

      {/* ── 3. Main Dashboard Grid: Recent Patients & Admission Queue ────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Recent Patients Table Container */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Recent Patients Intake
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Real-time patient registrations pushing into hospital workflow
              </span>
            </div>

            <div style={{ width: '280px' }}>
              <SearchInput
                placeholder="Search patient name, MRN or phone number..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                size="sm"
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="ot-table" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th style={{ width: '100px' }}>AGE / GENDER</th>
                  <th>DEPARTMENT</th>
                  <th>CONSULTANT</th>
                  <th style={{ width: '110px' }}>STATUS</th>
                  <th style={{ width: '90px' }}>REGISTERED</th>
                  <th style={{ width: '70px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.slice(0, 8).map((p, idx) => (
                  <tr 
                    key={p.id} 
                    className="table-row-hover"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openPatientDetail(p)}
                  >
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-navy-head)', fontSize: '13px' }}>{p.full_name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>{p.patient_code}</span>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'var(--font-mono)' }}>{p.age}y · {p.gender === 'FEMALE' ? 'Female' : 'Male'}</span></td>
                    <td><div style={{ fontWeight: 500, maxWidth: '140px', lineHeight: 1.35, wordBreak: 'break-word' }}>{p.admissions?.[0]?.department || 'General Medicine'}</div></td>
                    <td><div style={{ fontWeight: 600, color: 'var(--text-navy-head)', maxWidth: '140px', lineHeight: 1.35, wordBreak: 'break-word' }}>{p.assigned_doctor}</div></td>
                    <td>
                      <span style={{
                        padding: '3px 9px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: p.admission_status === 'ADMITTED' ? '#d1fae5' : p.admission_status === 'PRE_OP' ? '#fffbeb' : '#dbeafe',
                        color: p.admission_status === 'ADMITTED' ? '#065f46' : p.admission_status === 'PRE_OP' ? '#b45309' : '#1e40af'
                      }}>
                        {p.admission_status}
                      </span>
                    </td>
                    <td><span className="text-muted" style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>10:{(32 - idx).toString().padStart(2, '0')} AM</span></td>
                    <td style={{ textAlign: 'right' }}>
                      <Button size="xs" variant="secondary" icon={Eye}>View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admission Queue Side Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Admission Queue
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {admissionQueue.length} Patients waiting for admission
              </span>
            </div>
            <Badge variant="amber" size="xs">{admissionQueue.length} Waiting</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {admissionQueue.map(item => (
              <div 
                key={item.id} 
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{item.name}</span>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>{item.mrn}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <span>{item.dept} • {item.type}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--state-amber-text)', fontWeight: 700 }}>⏳ {item.waitTime}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    color: item.bedCode ? '#047857' : '#b45309'
                  }}>
                    {item.bedCode ? `✓ ${item.bedCode}` : '⚠️ Bed Assignment Pending'}
                  </span>

                  <Button 
                    size="xs" 
                    variant={item.bedCode ? 'teal' : 'secondary'}
                    onClick={() => handleCompleteAdmission(item.id)}
                  >
                    {item.bedCode ? 'Complete Admission' : 'Assign Bed'}
                  </Button>
                </div>
              </div>
            ))}

            {admissionQueue.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                ✓ Admission queue clear — all registered patients admitted
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── 4. Secondary Grid: Bed Availability & Today's Intake Flow ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Bed Availability Operational Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bed size={18} style={{ color: 'var(--primary-blue)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Bed Availability Matrix
              </h3>
            </div>
            <Badge variant="teal" size="xs">23 Available</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', padding: '10px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>TOTAL</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>120</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>OCCUPIED</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary-blue)' }}>97</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>AVAILABLE</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--state-teal-text)' }}>23</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>RESERVED</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--state-amber-text)' }}>5</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>MAINT.</span>
              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--state-red-text)' }}>2</span>
            </div>
          </div>

          {/* Department Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            {[
              { dept: 'General Ward', available: 8, total: 40 },
              { dept: 'ICU', available: 3, total: 15 },
              { dept: 'Surgical Ward', available: 5, total: 30 },
              { dept: 'Cardiology', available: 4, total: 20 },
              { dept: 'Orthopedics', available: 3, total: 15 }
            ].map(row => (
              <div key={row.dept} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: '#ffffff', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-navy-head)' }}>{row.dept}</span>
                <span style={{ color: 'var(--state-teal-text)', fontWeight: 700 }}>{row.available} available <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {row.total}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Intake Flow Visual Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Today's Intake Flow Stage Counts
              </h3>
            </div>
            <Badge variant="blue" size="xs">Live Flow</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 0' }}>
            {[
              { stage: '1. Registration', count: 18, desc: 'Registered at desk', color: '#2563eb' },
              { stage: '2. Verification', count: 15, desc: 'ID & Insurance verified', color: '#06b6d4' },
              { stage: '3. Admission', count: 12, desc: 'Admitted to system', color: '#0d9488' },
              { stage: '4. Bed Assignment', count: 10, desc: 'Assigned ward/room bed', color: '#10b981' },
              { stage: '5. Consultant Assignment', count: 9, desc: 'Assigned attending doctor', color: '#7c3aed' },
              { stage: '6. Clinical Workflow', count: 9, desc: 'Pushed into nursing & OT', color: '#0891b2' }
            ].map(item => (
              <div key={item.stage} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '150px', fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-navy-head)' }}>
                  {item.stage}
                </div>
                <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(item.count / 18) * 100}%`, height: '100%', background: item.color, borderRadius: '4px' }} />
                </div>
                <div style={{ width: '70px', fontSize: '12px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: item.color, textAlign: 'right' }}>
                  {item.count} Cases
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Slide-over Patient Detail Panel */}
      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}

      {/* Guided Patient Registration Form Modal */}
      <PatientRegistrationModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={(newRecord) => {
          // Open detail panel for newly created patient
          openPatientDetail(newRecord);
        }}
      />
    </div>
  );
};
