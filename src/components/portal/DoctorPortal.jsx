import React, { useState, useMemo } from 'react';
import { 
  User, Zap, Package, Stethoscope, Timer, CheckCircle2, 
  XCircle, AlertTriangle, Clock, Activity, ShieldCheck, 
  Sparkles, ArrowRight, Loader, BellOff, Heart, Pill, 
  FileText, Users, ChevronRight, Eye, Search, Building2, 
  TrendingUp, Check, AlertOctagon
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { PatientDetailPanel } from '../admissions/PatientDetailPanel';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import './DoctorPortal.css';

/**
 * SYNCHRO — DOCTOR COMMAND WORKSPACE (PART C)
 * Powered entirely by WorkflowContext.
 * Features 4 KPI Cards, My Patients, Surgical Pipeline, Live Workflow Dependencies,
 * Active Alerts, Doctor Analytics Snapshot, and Global Search.
 */
export const DoctorPortal = () => {
  const workflow = useWorkflow();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlertDetail, setActiveAlertDetail] = useState(null);

  const DOCTOR_ID = 'doc-1';
  const doctorName = 'Rajesh Sharma, MD';

  const patients = workflow.patients || [];
  const surgeries = workflow.surgeries || [];
  const alerts = workflow.alerts || [];
  const cssdPacks = workflow.cssd_packs || [];
  const theatres = workflow.operatingTheatres || [];

  // Filter doctor's assigned patients
  const myPatients = useMemo(() => {
    return patients.filter(p => p.assigned_doctor_id === DOCTOR_ID || p.assigned_doctor?.includes('Sharma'));
  }, [patients]);

  // Global search filtering across patients, OTs, and sterile packs
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();
    
    const matchedPatients = patients.filter(p => 
      p.full_name?.toLowerCase().includes(q) ||
      p.first_name?.toLowerCase().includes(q) ||
      p.last_name?.toLowerCase().includes(q) ||
      p.patient_code?.toLowerCase().includes(q) ||
      p.condition?.toLowerCase().includes(q) ||
      p.procedure?.toLowerCase().includes(q)
    );

    const matchedOTs = theatres.filter(ot => 
      ot.suite_code?.toLowerCase().includes(q) ||
      ot.name?.toLowerCase().includes(q) ||
      ot.surgeon?.toLowerCase().includes(q)
    );

    const matchedPacks = cssdPacks.filter(pk => 
      pk.pack_code?.toLowerCase().includes(q) ||
      pk.pack_type?.toLowerCase().includes(q) ||
      pk.assigned_ot?.toLowerCase().includes(q)
    );

    return {
      patients: matchedPatients.slice(0, 5),
      ots: matchedOTs.slice(0, 3),
      packs: matchedPacks.slice(0, 3)
    };
  }, [searchQuery, patients, theatres, cssdPacks]);

  // Map patient to detail drawer
  const openPatientDetail = (patient) => {
    const surgery = surgeries.find(s => s.patient_id === patient.id || s.patient?.patient_code === patient.patient_code);
    const mapped = {
      id: patient.patient_code || patient.id,
      mrn: patient.patient_code || patient.id,
      name: patient.full_name || `${patient.first_name} ${patient.last_name}`,
      status: patient.admission_status || 'ADMITTED',
      procedure: surgery?.procedure_name || patient.procedure || 'Under Assessment',
      age: patient.age || 45,
      gender: patient.gender === 'FEMALE' ? 'Female' : 'Male',
      bloodGroup: patient.blood_group || 'O+',
      preOpBay: patient.assigned_bed?.room?.room_number ? `${patient.assigned_bed.room.room_number} / ${patient.assigned_bed.bed_number}` : 'Room R-103',
      readinessScore: patient.admission_status === 'IN_SURGERY' ? 100 : patient.admission_status === 'PRE_OP' ? 85 : 75,
      otSuite: surgery?.theatre?.suite_code || 'OT-02',
      scheduledTime: surgery?.scheduled_start ? new Date(surgery.scheduled_start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '11:30 AM',
      surgeon: patient.assigned_doctor || `Dr. ${doctorName}`,
      anesthesiologist: 'Dr. Kevin Patel, MD',
      diagnosis: patient.condition || patient.admissions?.[0]?.diagnosis || 'Cholelithiasis',
      allergies: patient.allergies || 'NKDA'
    };
    setSelectedPatient(mapped);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="doctor-portal">
      {/* ── 1. Page Header & Global Search Bar ───────────────────── */}
      <div className="doctor-header-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="doctor-greeting-title" style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
            {getGreeting()}, Dr. {doctorName}
          </h1>
          <p className="doctor-greeting-sub" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Hospital Command Workspace • Active Surgical & Perioperative Telemetry
          </p>
        </div>

        {/* Global Search Input */}
        <div style={{ position: 'relative', width: '360px' }}>
          <SearchInput
            placeholder="Search patients, MRNs, OTs, sterile packs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />

          {/* Search Dropdown Results */}
          {searchResults && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '6px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              zIndex: 100,
              maxHeight: '380px',
              overflowY: 'auto',
              padding: '8px'
            }}>
              {searchResults.patients.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', padding: '4px 8px' }}>PATIENTS</span>
                  {searchResults.patients.map(p => (
                    <div 
                      key={p.id}
                      onClick={() => { openPatientDetail(p); setSearchQuery(''); }}
                      style={{ padding: '6px 8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      className="table-row-hover"
                    >
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{p.full_name}</span>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary-blue)' }}>{p.patient_code}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.ots.length > 0 && (
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', padding: '4px 8px' }}>OPERATING THEATRES</span>
                  {searchResults.ots.map(ot => (
                    <div key={ot.id} style={{ padding: '6px 8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: 700 }}>{ot.suite_code} — {ot.name}</span>
                      <Badge size="xs" variant={ot.status === 'ACTIVE' ? 'teal' : 'amber'}>{ot.status}</Badge>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.packs.length > 0 && (
                <div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', padding: '4px 8px' }}>STERILE PACKS</span>
                  {searchResults.packs.map(pk => (
                    <div key={pk.id} style={{ padding: '6px 8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ fontWeight: 700 }}>{pk.pack_code}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{pk.pack_type}</span>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.patients.length === 0 && searchResults.ots.length === 0 && searchResults.packs.length === 0 && (
                <div style={{ padding: '12px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                  No matching patients, OTs, or packs found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. TOP 4 GROUPED KPI CARDS (LARGE NUMBERS) ────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '20px 0' }}>
        
        {/* KPI Card 1: PATIENTS */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PATIENTS</span>
            <Users size={20} style={{ color: 'var(--primary-blue)' }} />
          </div>
          <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)', lineHeight: 1 }}>
            42
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span><strong>8</strong> assigned to me</span>
            <span style={{ color: 'var(--state-red-text)', fontWeight: 700 }}><strong>3</strong> critical priority</span>
            <span><strong>5</strong> discharged today</span>
          </div>
        </div>

        {/* KPI Card 2: SURGERIES */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SURGERIES TODAY</span>
            <Stethoscope size={20} style={{ color: 'var(--accent-cyan)' }} />
          </div>
          <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--primary-blue)', lineHeight: 1 }}>
            12
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--status-cyan-text)', fontWeight: 700 }}><strong>4</strong> in progress</span>
            <span><strong>6</strong> completed</span>
            <span style={{ color: 'var(--state-amber-text)', fontWeight: 700 }}><strong>1</strong> delayed case</span>
          </div>
        </div>

        {/* KPI Card 3: OPERATING THEATRES */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OPERATING THEATRES</span>
            <Building2 size={20} style={{ color: 'var(--state-teal)' }} />
          </div>
          <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--state-teal-text)', lineHeight: 1 }}>
            12
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span><strong>4</strong> available suites</span>
            <span><strong>5</strong> occupied in surgery</span>
            <span><strong>2</strong> cleaning / turnover</span>
            <span><strong>1</strong> maintenance</span>
          </div>
        </div>

        {/* KPI Card 4: STERILE PACKS */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>STERILE PACKS</span>
            <Package size={20} style={{ color: 'var(--state-purple)' }} />
          </div>
          <span style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-navy-head)', lineHeight: 1 }}>
            156
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span><strong>142</strong> ready / sterile</span>
            <span><strong>4</strong> currently in use</span>
            <span style={{ color: 'var(--state-amber-text)', fontWeight: 700 }}><strong>5</strong> expiring soon</span>
            <span style={{ color: 'var(--state-red-text)', fontWeight: 700 }}><strong>2</strong> quarantined</span>
          </div>
        </div>

      </div>

      {/* ── 3. MY PATIENTS SECTION ─────────────────────────────── */}
      <section style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
              My Assigned Patients ({myPatients.length})
            </h2>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Inpatient clinical roster & scheduled cases assigned to Dr. Rajesh Sharma
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {myPatients.slice(0, 6).map((patient) => {
            const statusColor = patient.admission_status === 'IN_SURGERY' ? '#0284c7' : patient.admission_status === 'ADMITTED' ? '#059669' : '#d97706';
            return (
              <div 
                key={patient.id} 
                className="ot-card table-row-hover" 
                onClick={() => openPatientDetail(patient)}
                style={{ padding: '16px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-navy-head)', margin: 0 }}>{patient.full_name}</h3>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--primary-blue)', fontWeight: 700 }}>{patient.patient_code}</span>
                  </div>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: `${statusColor}15`,
                    color: statusColor
                  }}>
                    {patient.admission_status || 'ADMITTED'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div><strong>Age / Gender:</strong> {patient.age}y · {patient.gender === 'FEMALE' ? 'Female' : 'Male'}</div>
                  <div><strong>Blood Group:</strong> <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{patient.blood_group || 'O+'}</span></div>
                  <div><strong>Room / Bed:</strong> {patient.assigned_bed?.room?.room_number || 'Room R-103'}</div>
                  <div><strong>Priority:</strong> <span style={{ color: patient.condition?.includes('Chole') ? 'var(--state-teal-text)' : 'var(--state-amber-text)', fontWeight: 700 }}>Routine</span></div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', fontSize: '11px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>DIAGNOSIS:</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-navy-head)' }}>{patient.condition || 'ACL Knee Tear'}</div>
                  <div style={{ color: 'var(--primary-blue)', fontWeight: 600, marginTop: '2px' }}>Next: {patient.procedure || 'Laparoscopic Cholecystectomy'}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 4. SURGICAL PIPELINE & LIVE WORKFLOW DEPENDENCIES ──────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        
        {/* Surgical Pipeline Table */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Today's Surgical Pipeline
              </h2>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Real-time surgical schedule & active operating room telemetry
              </span>
            </div>
            <Badge variant="blue" size="xs">12 Cases Scheduled</Badge>
          </div>

          <div className="table-responsive">
            <table className="ot-table font-mono" style={{ width: '100%', fontSize: '12px' }}>
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>TIME</th>
                  <th style={{ width: '70px' }}>OT</th>
                  <th>PATIENT</th>
                  <th>PROCEDURE</th>
                  <th>SURGEON</th>
                  <th style={{ width: '110px' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: '08:30 AM', ot: 'OT-02', name: 'Meera Chen', mrn: 'MRN-1044', procedure: 'ACL Reconstruction', surgeon: 'Dr. Rajesh Sharma', status: 'READY', color: '#10b981' },
                  { time: '10:00 AM', ot: 'OT-01', name: 'Arjun Das', mrn: 'MRN-1045', procedure: 'Hernia Repair', surgeon: 'Dr. Rajesh Sharma', status: 'IN OT', color: '#0284c7' },
                  { time: '11:30 AM', ot: 'OT-03', name: 'Robert Gupta', mrn: 'MRN-1047', procedure: 'CABG Bypass', surgeon: 'Dr. Alan Vance', status: 'PRE-OP', color: '#f59e0b' },
                  { time: '01:15 PM', ot: 'OT-04', name: 'Priya Sharma', mrn: 'MRN-1048', procedure: 'Thyroidectomy', surgeon: 'Dr. Rajesh Sharma', status: 'PRE-OP', color: '#6366f1' },
                  { time: '02:30 PM', ot: 'OT-02', name: 'Vikram Malhotra', mrn: 'MRN-1049', procedure: 'Appendectomy', surgeon: 'Dr. James Gomez', status: 'SCHEDULED', color: '#64748b' }
                ].map((s, idx) => (
                  <tr key={idx} className="table-row-hover" style={{ cursor: 'pointer' }} onClick={() => openPatientDetail({ full_name: s.name, patient_code: s.mrn, procedure: s.procedure })}>
                    <td style={{ fontWeight: 700 }}>{s.time}</td>
                    <td><span style={{ fontWeight: 800, color: 'var(--primary-blue)' }}>{s.ot}</span></td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, color: 'var(--text-navy-head)' }}>{s.name}</span>
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--text-muted)' }}>{s.mrn}</span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-sans)' }}>{s.procedure}</td>
                    <td style={{ fontFamily: 'var(--font-sans)' }}>{s.surgeon}</td>
                    <td>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: `${s.color}15`,
                        color: s.color
                      }}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Workflow Dependencies Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
              Live Department Dependencies
            </h2>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Admissions → Nursing → Readiness → CSSD → OT → Recovery
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Case 1 */}
            <div style={{ padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-navy-head)' }}>
                <span>Meera Chen (ACL Reconstruction)</span>
                <span style={{ color: '#10b981' }}>✓ READY</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#10b981' }}>✓ Admission</span>
                <span>•</span>
                <span style={{ color: '#10b981' }}>✓ Consent</span>
                <span>•</span>
                <span style={{ color: '#10b981' }}>✓ Pre-op</span>
                <span>•</span>
                <span style={{ color: '#10b981' }}>✓ Sterile Pack</span>
                <span>•</span>
                <span style={{ color: '#10b981' }}>✓ OT Assigned</span>
              </div>
            </div>

            {/* Case 2 */}
            <div style={{ padding: '10px', borderRadius: '8px', background: '#fffbeb', border: '1px solid var(--state-amber-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-navy-head)' }}>
                <span>Arjun Das (Hernia Repair)</span>
                <span style={{ color: '#d97706' }}>⚠️ HOLD</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#10b981' }}>✓ Admission</span>
                <span>•</span>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>⚠️ Consent Pending</span>
                <span>•</span>
                <span style={{ color: '#10b981' }}>✓ Pre-op</span>
                <span>•</span>
                <span style={{ color: '#10b981' }}>✓ Sterile Pack</span>
              </div>
            </div>

            {/* Case 3 */}
            <div style={{ padding: '10px', borderRadius: '8px', background: '#fef2f2', border: '1px solid var(--state-red-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-navy-head)' }}>
                <span>Robert Gupta (CABG Bypass)</span>
                <span style={{ color: '#dc2626' }}>⚠️ WARN</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '6px', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: '#10b981' }}>✓ Admission</span>
                <span>•</span>
                <span style={{ color: '#10b981' }}>✓ Consent</span>
                <span>•</span>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>⚠️ Pack expires in 3h</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 5. ALERTS & DOCTOR ANALYTICS SNAPSHOT ──────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Active System Alerts Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertOctagon size={18} style={{ color: 'var(--state-red)' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Clinical & OT System Alerts ({alerts.length})
              </h2>
            </div>
            <Badge variant="red" size="xs">{alerts.filter(a => a.severity === 'Critical').length} Critical</Badge>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {alerts.slice(0, 3).map(alert => (
              <div 
                key={alert.id}
                onClick={() => setActiveAlertDetail(alert)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: alert.severity === 'Critical' ? '#fef2f2' : '#fffbeb',
                  border: `1px solid ${alert.severity === 'Critical' ? '#fecaca' : '#fef3c7'}`,
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: alert.severity === 'Critical' ? '#dc2626' : '#d97706', textTransform: 'uppercase' }}>
                    {alert.severity} • {alert.alert_type?.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{alert.timeDetected}</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-navy-head)' }}>{alert.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{alert.relatedEntity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Analytics Snapshot Card */}
        <div className="ot-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: 'var(--accent-cyan)' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                Doctor Analytics Snapshot
              </h2>
            </div>
            <Badge variant="blue" size="xs">Live Telemetry</Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontFamily: 'var(--font-mono)' }}>
            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>OT UTILIZATION</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-blue)' }}>78%</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>AVG TURNAROUND</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--state-teal-text)' }}>42 min</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>ON-TIME CASES</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--state-teal-text)' }}>91%</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>DELAYED CASES</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--state-amber-text)' }}>3</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>PRE-OP READINESS</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary-blue)' }}>94%</span>
            </div>

            <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>STERILE PACK AVAIL.</span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--state-teal-text)' }}>96%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Slide-over Patient Detail Panel */}
      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onUpdateStatus={(patientId, newStatus) => {
            workflow.changePatientStatus(patientId, newStatus);
          }}
        />
      )}

      {/* Alert Detail Modal */}
      {activeAlertDetail && (
        <div className="ot-patient-panel-backdrop" style={{ zIndex: 1100 }} onClick={() => setActiveAlertDetail(null)}>
          <div className="ot-card" style={{ width: '500px', padding: '24px', background: '#ffffff' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                System Alert Detail ({activeAlertDetail.id})
              </h3>
              <button onClick={() => setActiveAlertDetail(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <XCircle size={18} />
              </button>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase' }}>{activeAlertDetail.severity} ALERT</span>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-navy-head)', margin: '4px 0' }}>{activeAlertDetail.title}</h4>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{activeAlertDetail.relatedEntity}</span>
            </div>

            <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '12px', marginBottom: '16px' }}>
              <strong>Root Cause:</strong> {activeAlertDetail.reason || 'Sterile pack expired prior to case dispatch.'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button size="sm" variant="secondary" onClick={() => setActiveAlertDetail(null)}>
                Dismiss
              </Button>
              <Button size="sm" variant="primary" onClick={() => {
                workflow.resolveAlert(activeAlertDetail.id);
                setActiveAlertDetail(null);
              }}>
                Resolve Alert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
