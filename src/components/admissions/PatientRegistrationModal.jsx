import React, { useState, useMemo } from 'react';
import { 
  X, CheckCircle2, User, Phone, ShieldCheck, 
  Building2, Stethoscope, Bed, ArrowRight, ArrowLeft, Sparkles,
  FileText, CreditCard, AlertCircle, Upload, Check, FileCheck,
  Flame, AlertOctagon, Search, ShieldAlert, Fingerprint, Calendar
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useWorkflow } from '../../context/WorkflowContext';
import './PatientRegistrationModal.css';

// ── Department & Consultant Dictionary ─────────────────────────
const DEPT_CONSULTANTS = {
  'General Surgery': ['Dr. Rajesh Sharma, MD', 'Dr. K. Patel, MD', 'Dr. S. Nair, MD'],
  'Orthopedics': ['Dr. James Gomez, MD', 'Dr. A. Miller, MD', 'Dr. R. Shah, MD'],
  'Cardiology': ['Dr. Alan Vance, MD', 'Dr. S. Chen, MD', 'Dr. M. Roy, MD'],
  'Trauma Surgery': ['Dr. T. Jenkins, MD', 'Dr. E. Davis, MD', 'Dr. Rajesh Sharma, MD'],
  'Gynecology': ['Dr. M. Vance, MD', 'Dr. A. Verma, MD'],
  'ENT': ['Dr. S. Nair, MD', 'Dr. L. Zhang, MD'],
  'Urology': ['Dr. R. Kapoor, MD', 'Dr. K. Patel, MD'],
  'Neurosurgery': ['Dr. M. Roy, MD', 'Dr. J. Gomez, MD']
};

// ── Automatic Procedure Mapping Rules Engine ───────────────────
const PROCEDURE_MAP = {
  'Laparoscopic Cholecystectomy': {
    department: 'General Surgery',
    consultant: 'Dr. Rajesh Sharma, MD',
    specialty: 'General Surgery',
    cssdKit: 'Laparoscopic General Surgery Kit',
    expectedDuration: '90 minutes',
    otType: 'General Surgery OT'
  },
  'Total Hip Arthroplasty': {
    department: 'Orthopedics',
    consultant: 'Dr. James Gomez, MD',
    specialty: 'Orthopedics',
    cssdKit: 'Orthopedic Instrument Set',
    expectedDuration: '120 minutes',
    otType: 'Orthopedic OT'
  },
  'ACL Reconstruction': {
    department: 'Orthopedics',
    consultant: 'Dr. James Gomez, MD',
    specialty: 'Orthopedics',
    cssdKit: 'Orthopedic Instrument Set',
    expectedDuration: '105 minutes',
    otType: 'Sports Med OT'
  },
  'Coronary Artery Bypass (CABG)': {
    department: 'Cardiology',
    consultant: 'Dr. Alan Vance, MD',
    specialty: 'Cardiovascular',
    cssdKit: 'Cardiac Surgery Set',
    expectedDuration: '240 minutes',
    otType: 'Cardiovascular OT'
  },
  'Emergency Trauma Surgery': {
    department: 'Trauma Surgery',
    consultant: 'Dr. T. Jenkins, MD',
    specialty: 'Trauma Surgery',
    cssdKit: 'Emergency Trauma Kit',
    expectedDuration: '150 minutes',
    otType: 'Trauma OT',
    urgency: 'EMERGENCY'
  },
  'Laparoscopic Hernia Repair': {
    department: 'General Surgery',
    consultant: 'Dr. K. Patel, MD',
    specialty: 'General Surgery',
    cssdKit: 'Laparoscopic General Surgery Kit',
    expectedDuration: '75 minutes',
    otType: 'General Surgery OT'
  }
};

export const PatientRegistrationModal = ({ isOpen, onClose, onSuccess }) => {
  const workflow = useWorkflow();
  const [isSaving, setIsSaving] = useState(false);
  const [registeredResult, setRegisteredResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    age: '',
    gender: '',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',

    emergencyName: '',
    emergencyRelation: 'Spouse',
    emergencyPhone: '',

    idType: 'National ID / Passport',
    idNumber: '',
    mrn: `MRN-2026-${Math.floor(1050 + Math.random() * 900)}`,

    condition: 'Gallstones (Cholelithiasis)',
    procedure: 'Laparoscopic Cholecystectomy',
    urgency: 'ROUTINE',
    allergies: 'NKDA',
    existingConditions: 'None',
    clinicalNotes: '',

    department: 'General Surgery',
    consultant: 'Dr. Rajesh Sharma, MD',
    referringDoctor: 'Dr. S. Nair, MD',
    preferredOt: 'OT-02',

    admissionType: 'Surgical Admission',
    admissionDate: new Date().toISOString().split('T')[0],
    expectedStay: '3 Days',
    ward: 'Surgical Ward A',
    room: 'Room R-103',
    bed: 'Bed B-2',

    consentStatus: 'SIGNED',
    idVerified: true,
    admissionFormSigned: true,
    assessmentComplete: true,
    insuranceVerified: true
  });

  if (!isOpen) return null;

  // Auto-fill procedure mappings
  const handleProcedureChange = (procName) => {
    const map = PROCEDURE_MAP[procName];
    if (map) {
      setFormData(prev => ({
        ...prev,
        procedure: procName,
        condition: procName.includes('Chole') ? 'Cholelithiasis (Gallstones)' : procName.includes('Hip') ? 'Osteoarthritis of Hip' : procName.includes('ACL') ? 'ACL Tear' : procName.includes('Trauma') ? 'Acute Abdominal Trauma' : 'Surgical Evaluation',
        department: map.department,
        consultant: map.consultant,
        urgency: map.urgency || prev.urgency
      }));
    } else {
      setFormData(prev => ({ ...prev, procedure: procName }));
    }
  };

  // Duplicate Patient Prevention Check
  const handleNameOrPhoneChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));

    const checkName = field === 'fullName' ? val : formData.fullName;
    const checkPhone = field === 'phone' ? val : formData.phone;

    if (checkName.length >= 4 || checkPhone.length >= 7) {
      const match = (workflow?.patients || []).find(p => 
        (checkName && p.full_name?.toLowerCase() === checkName.toLowerCase().trim()) ||
        (checkPhone && p.phone === checkPhone.trim())
      );
      if (match) {
        setDuplicateWarning(match);
      } else {
        setDuplicateWarning(null);
      }
    }
  };

  // Field updates
  const updateField = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  // Inline Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.dob) newErrors.dob = "Date of birth is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.gender) newErrors.gender = "Gender selection is required.";
    if (!formData.condition.trim()) newErrors.condition = "Primary condition is required.";
    if (!formData.procedure.trim()) newErrors.procedure = "Procedure is required.";
    if (!formData.department) newErrors.department = "Department is required.";
    if (!formData.consultant) newErrors.consultant = "Consultant is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Registration Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);

    setTimeout(() => {
      const mappedRule = PROCEDURE_MAP[formData.procedure] || { cssdKit: 'General Laparotomy Set', otType: 'General Surgery OT' };
      const isEmergency = formData.urgency === 'EMERGENCY';

      const newRecord = {
        mrn: formData.mrn,
        fullName: formData.fullName,
        firstName: formData.fullName.split(' ')[0] || 'New',
        lastName: formData.fullName.split(' ').slice(1).join(' ') || 'Patient',
        dob: formData.dob,
        age: formData.age || 42,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyName: formData.emergencyName,
        emergencyRelation: formData.emergencyRelation,
        emergencyPhone: formData.emergencyPhone,
        condition: formData.condition,
        procedure: formData.procedure,
        urgency: formData.urgency,
        assignedDoctor: formData.consultant,
        department: formData.department,
        room: formData.room,
        bed: formData.bed,
        admissionStatus: isEmergency ? 'EMERGENCY' : formData.consentStatus === 'SIGNED' ? 'ADMITTED' : 'PRE_OP',
        consentVerified: formData.consentStatus === 'SIGNED',
        cssdKitRequired: mappedRule.cssdKit,
        otTypeRequired: mappedRule.otType
      };

      let created = null;
      if (workflow?.registerPatient) {
        created = workflow.registerPatient(newRecord);
      }

      setIsSaving(false);
      setRegisteredResult({
        patientName: formData.fullName,
        mrn: formData.mrn,
        department: formData.department,
        consultant: formData.consultant,
        procedure: formData.procedure,
        cssdKit: mappedRule.cssdKit,
        urgency: formData.urgency,
        record: created
      });
    }, 600);
  };

  return (
    <div className="synchro-modal-backdrop" onClick={onClose}>
      <div className="synchro-registration-modal font-sans" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="registration-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7' }}>
              <User size={20} />
            </div>
            <div>
              <h2 className="font-display font-bold text-navy-head" style={{ fontSize: '18px', margin: 0 }}>
                New Patient Registration
              </h2>
              <p className="font-mono text-muted" style={{ fontSize: '11px', margin: '2px 0 0 0' }}>
                Create a patient record and begin the hospital workflow. Single-Entry Intake Engine • Auto-Assigns MRN, CSSD Kit & OT Requirements
              </p>
            </div>
          </div>

          <button className="modal-close-round-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="registration-modal-body">
          {registeredResult ? (
            /* SUCCESS OVERLAY */
            <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-display font-bold text-navy-head" style={{ fontSize: '22px', marginBottom: '8px' }}>
                PATIENT WORKFLOW REGISTERED
              </h3>
              <p className="font-mono text-muted" style={{ fontSize: '12px', marginBottom: '24px' }}>
                Centralized patient identity created. Workflow requirements dispatched to CSSD, OT, and Admissions.
              </p>

              <div style={{ backgroundColor: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', textAlign: 'left', marginBottom: '24px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">PATIENT NAME:</span>
                  <strong className="text-navy-head">{registeredResult.patientName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">ASSIGNED MRN:</span>
                  <strong className="text-blue">{registeredResult.mrn}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">DEPARTMENT:</span>
                  <span>{registeredResult.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">CONSULTANT:</span>
                  <span>{registeredResult.consultant}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">PROCEDURE:</span>
                  <span>{registeredResult.procedure}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="text-muted">REQUIRED CSSD KIT:</span>
                  <strong className="text-teal">{registeredResult.cssdKit}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button size="md" variant="primary" icon={ArrowRight} onClick={() => { onSuccess(registeredResult.record); onClose(); }}>
                  View Patient Workflow
                </Button>
                <Button size="md" variant="secondary" onClick={onClose}>
                  Done & Close
                </Button>
              </div>
            </div>
          ) : (
            /* FORM WORKSPACE */
            <form onSubmit={handleSubmit} className="registration-inner-container">
              {/* Duplicate Warning Banner */}
              {duplicateWarning && (
                <div style={{ padding: '12px 16px', borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldAlert size={18} />
                    <span>POSSIBLE EXISTING PATIENT: <strong>{duplicateWarning.full_name}</strong> ({duplicateWarning.patient_code})</span>
                  </div>
                  <Button size="xs" variant="secondary" onClick={() => { onSuccess(duplicateWarning); onClose(); }}>
                    Use Existing Patient Record
                  </Button>
                </div>
              )}

              {/* Emergency Pathway Banner */}
              {formData.urgency === 'EMERGENCY' && (
                <div style={{ padding: '14px 18px', borderRadius: '10px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Flame size={22} className="animate-pulse" />
                  <div>
                    <h4 className="font-display font-bold" style={{ fontSize: '14px', margin: 0 }}>EMERGENCY PATHWAY ACTIVATED — STAT PRIORITY</h4>
                    <span className="font-mono" style={{ fontSize: '11px' }}>Patient will be fast-tracked to Emergency Queue, STAT CSSD Demand & Priority OT Suite.</span>
                  </div>
                </div>
              )}

              {/* SECTION 1: PATIENT INFORMATION */}
              <div className="ot-card" style={{ padding: '20px' }}>
                <div className="registration-section-header">
                  <User size={16} className="text-blue" />
                  <h3 className="registration-section-title">1. PATIENT DEMOGRAPHICS & CONTACT</h3>
                </div>

                <div className="form-grid-2col">
                  <div>
                    <label className="form-field-label font-mono">FULL NAME *</label>
                    <input
                      type="text"
                      className={`manual-text-input ${errors.fullName ? 'has-error' : ''}`}
                      placeholder="e.g. Ananya Rao"
                      value={formData.fullName}
                      onChange={(e) => handleNameOrPhoneChange('fullName', e.target.value)}
                    />
                    {errors.fullName && <span className="inline-field-error font-mono">{errors.fullName}</span>}
                  </div>

                  <div>
                    <label className="form-field-label font-mono">DATE OF BIRTH * & AGE</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="date"
                        className={`manual-text-input ${errors.dob ? 'has-error' : ''}`}
                        value={formData.dob}
                        onChange={(e) => {
                          updateField('dob', e.target.value);
                          if (e.target.value) {
                            const birth = new Date(e.target.value);
                            const age = new Date().getFullYear() - birth.getFullYear();
                            updateField('age', age);
                          }
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Age"
                        className="manual-text-input"
                        style={{ width: '80px' }}
                        value={formData.age}
                        onChange={(e) => updateField('age', e.target.value)}
                      />
                    </div>
                    {errors.dob && <span className="inline-field-error font-mono">{errors.dob}</span>}
                  </div>

                  <div>
                    <label className="form-field-label font-mono">GENDER * & BLOOD GROUP</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        className={`manual-text-input ${errors.gender ? 'has-error' : ''}`}
                        value={formData.gender}
                        onChange={(e) => updateField('gender', e.target.value)}
                      >
                        <option value="">Select Gender</option>
                        <option value="FEMALE">Female</option>
                        <option value="MALE">Male</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <select
                        className="manual-text-input"
                        style={{ width: '100px' }}
                        value={formData.bloodGroup}
                        onChange={(e) => updateField('bloodGroup', e.target.value)}
                      >
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-field-label font-mono">PRIMARY PHONE *</label>
                    <input
                      type="text"
                      className={`manual-text-input ${errors.phone ? 'has-error' : ''}`}
                      placeholder="+1 (555) 019-2831"
                      value={formData.phone}
                      onChange={(e) => handleNameOrPhoneChange('phone', e.target.value)}
                    />
                    {errors.phone && <span className="inline-field-error font-mono">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              {/* SECTION 2: IDENTIFICATION */}
              <div className="ot-card" style={{ padding: '20px' }}>
                <div className="registration-section-header">
                  <Fingerprint size={16} className="text-teal" />
                  <h3 className="registration-section-title">2. PATIENT IDENTIFICATION & MRN</h3>
                </div>

                <div className="form-grid-3col">
                  <div>
                    <label className="form-field-label font-mono">ID TYPE</label>
                    <select className="manual-text-input" value={formData.idType} onChange={(e) => updateField('idType', e.target.value)}>
                      <option value="National ID / Passport">National ID / Passport</option>
                      <option value="Driver License">Driver's License</option>
                      <option value="Health Insurance Card">Health Insurance Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-field-label font-mono">ID NUMBER</label>
                    <input type="text" className="manual-text-input" placeholder="ID-8841-9921" value={formData.idNumber} onChange={(e) => updateField('idNumber', e.target.value)} />
                  </div>

                  <div>
                    <label className="form-field-label font-mono">AUTO-GENERATED MRN</label>
                    <input type="text" className="manual-text-input font-bold text-blue" value={formData.mrn} readOnly />
                  </div>
                </div>
              </div>

              {/* SECTION 3: CLINICAL INFORMATION & PROCEDURE */}
              <div className="ot-card" style={{ padding: '20px' }}>
                <div className="registration-section-header">
                  <Stethoscope size={16} className="text-purple" />
                  <h3 className="registration-section-title">3. CLINICAL CONDITION & PROCEDURE SELECTION</h3>
                </div>

                <div className="form-grid-2col">
                  <div>
                    <label className="form-field-label font-mono">PLANNED PROCEDURE / TREATMENT *</label>
                    <select
                      className={`manual-text-input ${errors.procedure ? 'has-error' : ''}`}
                      value={formData.procedure}
                      onChange={(e) => handleProcedureChange(e.target.value)}
                    >
                      <option value="Laparoscopic Cholecystectomy">Laparoscopic Cholecystectomy (General Surgery)</option>
                      <option value="Total Hip Arthroplasty">Total Hip Arthroplasty (Orthopedics)</option>
                      <option value="ACL Reconstruction">ACL Reconstruction (Orthopedics)</option>
                      <option value="Coronary Artery Bypass (CABG)">Coronary Artery Bypass CABG (Cardiology)</option>
                      <option value="Emergency Trauma Surgery">Emergency Trauma Surgery (Trauma)</option>
                      <option value="Laparoscopic Hernia Repair">Laparoscopic Hernia Repair (General Surgery)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-field-label font-mono">PRIMARY CONDITION / DIAGNOSIS *</label>
                    <input type="text" className={`manual-text-input ${errors.condition ? 'has-error' : ''}`} value={formData.condition} onChange={(e) => updateField('condition', e.target.value)} />
                  </div>

                  <div>
                    <label className="form-field-label font-mono">CLINICAL URGENCY *</label>
                    <select
                      className="manual-text-input font-bold"
                      style={{ color: formData.urgency === 'EMERGENCY' ? '#dc2626' : 'var(--text-navy-head)' }}
                      value={formData.urgency}
                      onChange={(e) => updateField('urgency', e.target.value)}
                    >
                      <option value="ROUTINE">Routine Elective</option>
                      <option value="URGENT">Urgent (Within 24h)</option>
                      <option value="HIGH PRIORITY">High Priority (Within 6h)</option>
                      <option value="EMERGENCY">EMERGENCY (STAT Immediate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-field-label font-mono">KNOWN ALLERGIES</label>
                    <input type="text" className="manual-text-input" placeholder="NKDA / Penicillin" value={formData.allergies} onChange={(e) => updateField('allergies', e.target.value)} />
                  </div>
                </div>
              </div>

              {/* SECTION 4: CARE TEAM & DEPARTMENT */}
              <div className="ot-card" style={{ padding: '20px' }}>
                <div className="registration-section-header">
                  <Building2 size={16} className="text-cyan" />
                  <h3 className="registration-section-title">4. CARE TEAM & CONSULTANT SELECTION</h3>
                </div>

                <div className="form-grid-2col">
                  <div>
                    <label className="form-field-label font-mono">DEPARTMENT *</label>
                    <select
                      className="manual-text-input"
                      value={formData.department}
                      onChange={(e) => {
                        const dept = e.target.value;
                        const consultants = DEPT_CONSULTANTS[dept] || ['Dr. Rajesh Sharma, MD'];
                        setFormData(prev => ({
                          ...prev,
                          department: dept,
                          consultant: consultants[0]
                        }));
                      }}
                    >
                      {Object.keys(DEPT_CONSULTANTS).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="form-field-label font-mono">ATTENDING CONSULTANT *</label>
                    <select
                      className="manual-text-input"
                      value={formData.consultant}
                      onChange={(e) => updateField('consultant', e.target.value)}
                    >
                      {(DEPT_CONSULTANTS[formData.department] || ['Dr. Rajesh Sharma, MD']).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 5: CONSENT & DOCUMENTATION */}
              <div className="ot-card" style={{ padding: '20px' }}>
                <div className="registration-section-header">
                  <FileCheck size={16} className="text-teal" />
                  <h3 className="registration-section-title">5. DOCUMENTATION & CONSENT VERIFICATION</h3>
                </div>

                <div className="form-grid-2col font-mono" style={{ fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formData.idVerified} onChange={(e) => updateField('idVerified', e.target.checked)} />
                    <span>Patient Government ID Verified</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={formData.admissionFormSigned} onChange={(e) => updateField('admissionFormSigned', e.target.checked)} />
                    <span>Admission Form Signed</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <select
                      className="manual-text-input"
                      style={{ fontSize: '11px', width: '160px' }}
                      value={formData.consentStatus}
                      onChange={(e) => updateField('consentStatus', e.target.value)}
                    >
                      <option value="SIGNED">Surgical Consent SIGNED</option>
                      <option value="PENDING">Consent PENDING (Pre-Op Hold)</option>
                    </select>
                    <span>Surgical Consent Status</span>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        {!registeredResult && (
          <div className="registration-modal-footer">
            <Button size="md" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button size="md" variant="primary" icon={Check} onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? 'Registering Patient...' : 'REGISTER PATIENT & START WORKFLOW'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
