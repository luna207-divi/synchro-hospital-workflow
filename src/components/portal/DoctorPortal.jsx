import React, { useState, useMemo } from 'react';
import { 
  User, Zap, Package, Stethoscope, Timer, CheckCircle2, 
  XCircle, AlertTriangle, Clock, Activity, ShieldCheck, 
  Sparkles, ArrowRight, Loader, BellOff, Heart, Pill, 
  FileText, Users, ChevronRight, Eye, Search, Building2, 
  TrendingUp, Check, AlertOctagon, Flame, FileCheck, Send, Bed
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';
import { PatientDetailPanel } from '../admissions/PatientDetailPanel';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { SearchInput } from '../common/Input';
import './DoctorPortal.css';

export const DoctorPortal = () => {
  const workflow = useWorkflow();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const doctorName = 'Dr. Rajesh Sharma, MD';
  const patients = workflow.patients || [];
  const alerts = workflow.alerts || [];

  // Derived counts
  const counts = useMemo(() => {
    return {
      myPatients: patients.filter(p => (p.assigned_doctor || '').includes('Sharma')).length || 8,
      today: patients.length,
      waitingAssess: patients.filter(p => p.admission_status === 'ASSESSMENT' || p.admission_status === 'REGISTERED').length || 3,
      preOp: patients.filter(p => p.admission_status === 'PRE_OP').length || 4,
      otReady: patients.filter(p => p.admission_status === 'OT_READY' || p.admission_status === 'CSSD').length || 2,
      inOt: patients.filter(p => p.admission_status === 'IN_SURGERY').length || 2,
      recovery: patients.filter(p => p.admission_status === 'RECOVERY').length || 3,
    };
  }, [patients]);

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      let matchesTab = true;
      const st = (p.admission_status || p.workflowStage || '').toUpperCase();

      if (activeTab === 'MY_PATIENTS') matchesTab = (p.assigned_doctor || '').includes('Sharma');
      else if (activeTab === 'WAITING_ASSESS') matchesTab = st === 'ASSESSMENT' || st === 'REGISTERED';
      else if (activeTab === 'PRE_OP') matchesTab = st === 'PRE_OP';
      else if (activeTab === 'OT_READY') matchesTab = st === 'OT_READY' || st === 'CSSD';
      else if (activeTab === 'IN_OT') matchesTab = st === 'IN_SURGERY';
      else if (activeTab === 'RECOVERY') matchesTab = st === 'RECOVERY';

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (p.full_name || '').toLowerCase().includes(q) ||
        (p.patient_code || '').toLowerCase().includes(q) ||
        (p.condition || '').toLowerCase().includes(q) ||
        (p.procedure || '').toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [patients, activeTab, searchQuery]);

  const liveSelectedPatient = selectedPatient ? patients.find(p => p.id === selectedPatient.id) || selectedPatient : null;

  return (
    <div className="ot-doctor-portal font-sans">
      {/* 1. Header Banner */}
      <div className="doctor-portal-header">
        <div className="doctor-header-titles">
          <div className="doctor-title-row">
            <h1 className="doctor-heading font-display">CLINICAL COMMAND & DOCTOR WORKSPACE</h1>
            <Badge variant="teal" size="sm" dot>Attending: {doctorName}</Badge>
          </div>
          <p className="doctor-subhead">
            Clinical pre-op clearances, patient assessment queues, nursing handoffs, and surgical readiness telemetry.
          </p>
        </div>

        <div className="doctor-header-actions">
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button size="sm" variant="secondary" icon={FileText} onClick={() => alert('Exported Clinical Roster.')}>
              Export Roster
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', marginBottom: '20px' }}>
        <div className="ot-card" style={{ padding: '12px', textAlign: 'center' }} onClick={() => setActiveTab('MY_PATIENTS')}>
          <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>MY PATIENTS</span>
          <div className="font-display font-bold text-navy-head" style={{ fontSize: '20px' }}>{counts.myPatients}</div>
        </div>

        <div className="ot-card" style={{ padding: '12px', textAlign: 'center' }} onClick={() => setActiveTab('ALL')}>
          <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>TODAY'S TOTAL</span>
          <div className="font-display font-bold text-blue" style={{ fontSize: '20px' }}>{counts.today}</div>
        </div>

        <div className="ot-card" style={{ padding: '12px', textAlign: 'center' }} onClick={() => setActiveTab('WAITING_ASSESS')}>
          <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>WAITING ASSESS</span>
          <div className="font-display font-bold text-amber" style={{ fontSize: '20px' }}>{counts.waitingAssess}</div>
        </div>

        <div className="ot-card" style={{ padding: '12px', textAlign: 'center' }} onClick={() => setActiveTab('PRE_OP')}>
          <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>PRE-OP</span>
          <div className="font-display font-bold text-purple" style={{ fontSize: '20px' }}>{counts.preOp}</div>
        </div>

        <div className="ot-card" style={{ padding: '12px', textAlign: 'center' }} onClick={() => setActiveTab('OT_READY')}>
          <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>OT READY</span>
          <div className="font-display font-bold text-teal" style={{ fontSize: '20px' }}>{counts.otReady}</div>
        </div>

        <div className="ot-card" style={{ padding: '12px', textAlign: 'center' }} onClick={() => setActiveTab('IN_OT')}>
          <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>IN OT</span>
          <div className="font-display font-bold text-red" style={{ fontSize: '20px' }}>{counts.inOt}</div>
        </div>

        <div className="ot-card" style={{ padding: '12px', textAlign: 'center' }} onClick={() => setActiveTab('RECOVERY')}>
          <span className="font-mono text-muted" style={{ fontSize: '9px', fontWeight: 700 }}>RECOVERY</span>
          <div className="font-display font-bold text-indigo" style={{ fontSize: '20px' }}>{counts.recovery}</div>
        </div>
      </div>

      {/* 3. Filter Bar */}
      <div className="cssd-filter-bar ot-card" style={{ marginBottom: '20px' }}>
        <div className="cssd-filter-tabs" style={{ gap: '4px', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Patients' },
            { id: 'MY_PATIENTS', label: `My Cases (${counts.myPatients})` },
            { id: 'WAITING_ASSESS', label: `Waiting Assessment (${counts.waitingAssess})` },
            { id: 'PRE_OP', label: `Pre-Op (${counts.preOp})` },
            { id: 'OT_READY', label: `OT Ready (${counts.otReady})` },
            { id: 'IN_OT', label: `In OT (${counts.inOt})` },
            { id: 'RECOVERY', label: `Recovery (${counts.recovery})` },
          ].map(t => (
            <button
              key={t.id}
              className={`cssd-tab-btn ${activeTab === t.id ? 'is-active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              type="button"
              style={{ fontSize: '11px', padding: '5px 10px' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="cssd-search-box">
          <SearchInput
            placeholder="Search patient, MRN, procedure..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="sm"
          />
        </div>
      </div>

      {/* 4. Patient Queue Table */}
      <div className="cssd-table-card ot-card">
        <div className="table-responsive-wrapper">
          <table className="cssd-data-table">
            <thead>
              <tr>
                <th>PATIENT NAME</th>
                <th style={{ width: '110px' }}>MRN</th>
                <th style={{ width: '100px' }}>AGE / GENDER</th>
                <th>PRIMARY CONDITION</th>
                <th>PLANNED PROCEDURE</th>
                <th style={{ width: '100px' }}>PRIORITY</th>
                <th style={{ width: '120px' }}>CURRENT STAGE</th>
                <th style={{ width: '90px' }}>READINESS</th>
                <th style={{ width: '80px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(p => {
                const isEmergency = p.urgency === 'EMERGENCY' || p.priority === 'EMERGENCY';
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
                      <span style={{ fontSize: '11px', fontWeight: 500 }}>{p.condition}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.procedure}</span>
                    </td>

                    <td>
                      <span className={`font-mono ${isEmergency ? 'text-red font-bold' : ''}`} style={{ fontSize: '10px' }}>
                        {isEmergency ? 'STAT' : 'Routine'}
                      </span>
                    </td>

                    <td>
                      <Badge variant={st === 'OT_READY' ? 'teal' : st === 'IN_SURGERY' ? 'red' : st === 'RECOVERY' ? 'indigo' : 'blue'} size="xs">
                        {st.replace(/_/g, ' ')}
                      </Badge>
                    </td>

                    <td>
                      <span className="font-mono font-bold text-teal" style={{ fontSize: '11px' }}>
                        {st === 'OT_READY' ? '100%' : st === 'PRE_OP' ? '85%' : '75%'}
                      </span>
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

      {/* 5. Patient Detail Workspace Drawer */}
      {liveSelectedPatient && (
        <PatientDetailPanel
          patient={liveSelectedPatient}
          onClose={() => setSelectedPatient(null)}
          workflow={workflow}
        />
      )}
    </div>
  );
};
