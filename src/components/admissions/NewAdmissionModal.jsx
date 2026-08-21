import React, { useState } from 'react';
import { 
  X, 
  Search, 
  UserCheck, 
  Building2, 
  Stethoscope, 
  Bed, 
  CheckCircle2, 
  ArrowRight,
  User,
  Plus
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useWorkflow } from '../../context/WorkflowContext';
import './PatientRegistrationModal.css';

/**
 * New Admission Modal for Existing Patients
 * Search existing patient database, select patient, fill admission details, and start new workflow without duplicating identity.
 */
export const NewAdmissionModal = ({ isOpen, onClose, onSuccess }) => {
  const workflow = useWorkflow();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [admissionData, setAdmissionData] = useState({
    admissionType: 'Surgical Admission',
    department: 'General Surgery',
    consultant: 'Dr. Rajesh Sharma, MD',
    ward: 'Surgical Ward A',
    room: 'Room R-104',
    bed: 'Bed B-1',
    reason: 'Laparoscopic Cholecystectomy Evaluation',
    urgency: 'ROUTINE'
  });

  if (!isOpen) return null;

  const patients = workflow?.patients || [];
  const searchResults = searchQuery.trim() ? patients.filter(p => 
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patient_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone?.includes(searchQuery)
  ) : patients.slice(0, 5);

  const handleCreateAdmission = () => {
    if (!selectedPatient) return;
    setIsSubmitting(true);

    setTimeout(() => {
      if (workflow?.advancePatientWorkflow) {
        workflow.advancePatientWorkflow(selectedPatient.id || selectedPatient.patient_code);
      }
      setIsSubmitting(false);
      onSuccess(selectedPatient);
      onClose();
    }, 500);
  };

  return (
    <div className="synchro-modal-backdrop" onClick={onClose}>
      <div className="synchro-registration-modal font-sans" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="registration-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="font-display font-bold text-navy-head" style={{ fontSize: '18px', margin: 0 }}>
                CREATE NEW ADMISSION FOR EXISTING PATIENT
              </h2>
              <span className="font-mono text-muted" style={{ fontSize: '11px' }}>
                Lookup Existing Patient Identity • Prevents Duplicate MRN Records
              </span>
            </div>
          </div>

          <button className="modal-close-round-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="registration-modal-body">
          {!selectedPatient ? (
            /* STEP 1: SEARCH EXISTING PATIENT */
            <div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-field-label font-mono">SEARCH EXISTING PATIENT (NAME / MRN / PHONE)</label>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="manual-text-input"
                    style={{ paddingLeft: '36px' }}
                    placeholder="Search e.g. Ananya Rao or P-1042..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span className="font-mono text-muted" style={{ fontSize: '10px', fontWeight: 700 }}>MATCHING PATIENTS:</span>
                {searchResults.map(p => (
                  <div
                    key={p.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setSelectedPatient(p)}
                  >
                    <div>
                      <span className="font-display font-bold text-navy-head" style={{ fontSize: '14px', marginRight: '8px' }}>{p.full_name}</span>
                      <span className="font-mono text-blue font-bold" style={{ fontSize: '11px', marginRight: '8px' }}>{p.patient_code}</span>
                      <span className="font-mono text-muted" style={{ fontSize: '11px' }}>Age {p.age} • {p.gender}</span>
                    </div>

                    <Button size="xs" variant="secondary" iconRight={ArrowRight}>
                      Select Patient
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* STEP 2: ADMISSION DETAILS */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ padding: '14px 16px', borderRadius: '10px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span className="font-mono text-muted" style={{ fontSize: '10px' }}>SELECTED PATIENT:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-display font-bold text-navy-head" style={{ fontSize: '16px' }}>{selectedPatient.full_name}</span>
                    <span className="font-mono text-blue font-bold" style={{ fontSize: '12px' }}>{selectedPatient.patient_code}</span>
                  </div>
                </div>
                <Button size="xs" variant="secondary" onClick={() => setSelectedPatient(null)}>
                  Change Patient
                </Button>
              </div>

              <div className="form-grid-2col">
                <div>
                  <label className="form-field-label font-mono">ADMISSION TYPE</label>
                  <select className="manual-text-input" value={admissionData.admissionType} onChange={(e) => setAdmissionData(prev => ({ ...prev, admissionType: e.target.value }))}>
                    <option value="Surgical Admission">Surgical Admission</option>
                    <option value="Inpatient Admission (IPD)">Inpatient Admission (IPD)</option>
                    <option value="Emergency Intake">Emergency Intake</option>
                    <option value="Day Care Procedure">Day Care Procedure</option>
                  </select>
                </div>

                <div>
                  <label className="form-field-label font-mono">DEPARTMENT</label>
                  <select className="manual-text-input" value={admissionData.department} onChange={(e) => setAdmissionData(prev => ({ ...prev, department: e.target.value }))}>
                    <option value="General Surgery">General Surgery</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Trauma Surgery">Trauma Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="form-field-label font-mono">ATTENDING CONSULTANT</label>
                  <select className="manual-text-input" value={admissionData.consultant} onChange={(e) => setAdmissionData(prev => ({ ...prev, consultant: e.target.value }))}>
                    <option value="Dr. Rajesh Sharma, MD">Dr. Rajesh Sharma, MD</option>
                    <option value="Dr. James Gomez, MD">Dr. James Gomez, MD</option>
                    <option value="Dr. Alan Vance, MD">Dr. Alan Vance, MD</option>
                  </select>
                </div>

                <div>
                  <label className="form-field-label font-mono">ASSIGNED ROOM & BED</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="manual-text-input" value={admissionData.room} onChange={(e) => setAdmissionData(prev => ({ ...prev, room: e.target.value }))} />
                    <input type="text" className="manual-text-input" value={admissionData.bed} onChange={(e) => setAdmissionData(prev => ({ ...prev, bed: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedPatient && (
          <div className="registration-modal-footer">
            <Button size="md" variant="secondary" onClick={() => setSelectedPatient(null)}>
              Back
            </Button>
            <Button size="md" variant="primary" icon={Plus} onClick={handleCreateAdmission} disabled={isSubmitting}>
              {isSubmitting ? 'Creating Admission...' : 'CREATE ADMISSION & START WORKFLOW'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
