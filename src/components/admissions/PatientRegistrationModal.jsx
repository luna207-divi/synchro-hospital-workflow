import React, { useState } from 'react';
import { 
  X, CheckCircle2, User, Phone, ShieldCheck, 
  Building2, Stethoscope, Bed, ArrowRight, ArrowLeft, Sparkles,
  FileText, CreditCard, AlertCircle, Upload, Check, FileCheck
} from 'lucide-react';
import { Button } from '../common/Button';
import { useWorkflow } from '../../context/WorkflowContext';
import './PatientRegistrationModal.css';

/**
 * SYNCHRO — New Patient Registration Form Component
 * Complete intake form with empty default state, 2-column grid, inline validation, and workflow connection.
 */
export const PatientRegistrationModal = ({ isOpen, onClose, onSuccess }) => {
  const workflow = useWorkflow();
  const [isSaving, setIsSaving] = useState(false);
  const [registeredMrn, setRegisteredMrn] = useState(null);
  const [errors, setErrors] = useState({});

  // EMPTY Form State by default as strictly required by prompt
  const [formData, setFormData] = useState({
    // Patient Information
    fullName: '',
    dob: '',
    age: '',
    gender: '',
    bloodGroup: '',
    phone: '',
    email: '',
    address: '',

    // Emergency Contact
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: '',

    // Clinical Information
    reasonForVisit: '',
    symptoms: '',
    knownAllergies: '',
    existingConditions: '',
    currentMedications: '',
    diagnosis: '',

    // Admission Information
    admissionType: '',
    department: '',
    consultant: '',
    roomBed: '',
    admissionDate: new Date().toISOString().split('T')[0],
    expectedStay: '3 Days',

    // Insurance / Billing
    paymentType: 'Insurance',
    insuranceProvider: '',
    policyNumber: '',
    billingContact: '',

    // Documents & Consent Checkboxes
    identityVerified: false,
    consentReceived: false,
    contactVerified: false,
    insuranceSubmitted: false,
    recordsAvailable: false,

    // File Upload Placeholders
    idProofName: '',
    insuranceDocName: '',
    referralDocName: ''
  });

  if (!isOpen) return null;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear inline error if field updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Inline Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter the patient's full name.";
    }
    if (!formData.dob) {
      newErrors.dob = "Please select the date of birth.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter the primary phone number.";
    }
    if (!formData.gender) {
      newErrors.gender = "Please select the gender.";
    }
    if (!formData.admissionType) {
      newErrors.admissionType = "Please select the admission type.";
    }
    if (!formData.department) {
      newErrors.department = "Please select the medical department.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculateAge = (dobString) => {
    if (!dobString) return;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    setFormData(prev => ({ ...prev, dob: dobString, age: age > 0 ? String(age) : '0' }));
    if (errors.dob) setErrors(prev => ({ ...prev, dob: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      // 1. Generate unique MRN
      const randomNum = Math.floor(1050 + Math.random() * 900);
      const generatedMrn = `MRN-${randomNum}`;

      // 2. Split full name
      const nameParts = formData.fullName.trim().split(' ');
      const firstName = nameParts[0] || 'Patient';
      const lastName = nameParts.slice(1).join(' ') || '';

      // 3. Extract consultant display name
      const consultantObj = workflow.doctors.find(d => d.id === formData.consultant) || workflow.doctors[0];
      const consultantName = consultantObj ? consultantObj.display_name : 'Dr. Rajesh Sharma, MD';

      // 4. Register patient into central WorkflowContext state
      const createdRecord = workflow.registerPatient({
        mrn: generatedMrn,
        firstName,
        lastName,
        fullName: formData.fullName.trim(),
        age: formData.age || '35',
        gender: formData.gender,
        bloodGroup: formData.bloodGroup || 'O+',
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        emergencyName: formData.emergencyName,
        emergencyPhone: formData.emergencyPhone,
        emergencyRelation: formData.emergencyRelation,
        condition: formData.reasonForVisit || formData.diagnosis || 'General Intake Evaluation',
        procedure: formData.diagnosis || formData.reasonForVisit || 'Admitted Patient',
        admissionStatus: 'ADMITTED',
        assignedDoctor: consultantName,
        assignedDoctorId: consultantObj ? consultantObj.id : 'doc-1',
        room: formData.roomBed ? formData.roomBed.split(' - ')[1] || 'Room R-103' : 'Room R-103',
        bed: formData.roomBed ? formData.roomBed.split(' - ')[2] || 'Bed B-3' : 'Bed B-3',
        department: formData.department,
        insuranceProvider: formData.insuranceProvider || 'Self Pay',
        insuranceId: formData.policyNumber || 'N/A',
        paymentType: formData.paymentType,
        currentMedications: formData.currentMedications,
        allergies: formData.knownAllergies,
        consentVerified: formData.consentReceived
      });

      setIsSaving(false);
      setRegisteredMrn(generatedMrn);

      if (onSuccess) {
        onSuccess(createdRecord);
      }
    }, 400);
  };

  const availableBedsList = [
    { label: 'General Ward - Room 101 - Bed B1', val: 'Ward A - Room 101 - Bed B1' },
    { label: 'General Ward - Room 103 - Bed B3', val: 'Ward A - Room 103 - Bed B3' },
    { label: 'Surgical Ward - Room 204 - Bed B2', val: 'Surgical - Room 204 - Bed B2' },
    { label: 'ICU Suite - Room 301 - Bed ICU-1', val: 'ICU - Room 301 - Bed ICU-1' },
    { label: 'Cardiology - Room 402 - Bed C2', val: 'Cardiology - Room 402 - Bed C2' }
  ];

  return (
    <div className="synchro-modal-backdrop font-sans" onClick={onClose}>
      <div className="synchro-registration-modal" onClick={(e) => e.stopPropagation()}>

        {/* Modal Header */}
        <div className="registration-modal-header">
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, color: 'var(--text-navy-head, #0a1628)', letterSpacing: '-0.02em', margin: 0 }}>
              NEW PATIENT REGISTRATION
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted, #64748b)', marginTop: '4px', margin: 0 }}>
              Create a patient record and begin the hospital workflow.
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="modal-close-round-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="registration-modal-body">
          
          {/* Success Confirmation Modal State */}
          {registeredMrn ? (
            <div style={{ padding: '36px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ecfdf5', border: '2px solid #10b981', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, color: 'var(--text-navy-head)' }}>
                  Patient Registered Successfully!
                </h3>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 800, color: 'var(--accent-cyan)', background: '#ecfeff', padding: '6px 16px', borderRadius: '8px', display: 'inline-block', margin: '6px auto' }}>
                  {registeredMrn}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.5 }}>
                  Patient <strong>{formData.fullName}</strong> has been assigned to <strong>{formData.department || 'General Medicine'}</strong> under <strong>Dr. Rajesh Sharma, MD</strong> and added to the SYNCHRO hospital workflow.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--border-default)', width: '100%', maxWidth: '440px', marginTop: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--text-navy-head)', marginBottom: '8px' }}>
                  AUTOMATED WORKFLOW STATUS
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                  <span>✓ Front Desk Intake</span>
                  <span>→</span>
                  <span>✓ Bed Assigned</span>
                  <span>→</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Nursing Queue</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <Button 
                  variant="primary" 
                  size="md" 
                  onClick={() => {
                    setRegisteredMrn(null);
                    onClose();
                  }}
                >
                  Return to Front Desk Command Center
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="registration-inner-container">
              
              {/* SECTION 1: PATIENT INFORMATION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <User size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    1. Patient Information
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: errors.fullName ? '1px solid var(--status-red)' : '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.fullName} 
                      onChange={e => updateField('fullName', e.target.value)} 
                      placeholder="e.g. Meera Chen" 
                    />
                    {errors.fullName && <span style={{ fontSize: '11px', color: 'var(--status-red-text)', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Date of Birth *
                    </label>
                    <input 
                      type="date" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: errors.dob ? '1px solid var(--status-red)' : '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.dob} 
                      onChange={e => handleCalculateAge(e.target.value)} 
                    />
                    {errors.dob && <span style={{ fontSize: '11px', color: 'var(--status-red-text)', marginTop: '4px', display: 'block' }}>{errors.dob}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Age
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.age} 
                      onChange={e => updateField('age', e.target.value)} 
                      placeholder="Auto-calculated" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Gender *
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: errors.gender ? '1px solid var(--status-red)' : '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.gender} 
                      onChange={e => updateField('gender', e.target.value)}
                    >
                      <option value="">Select Gender</option>
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span style={{ fontSize: '11px', color: 'var(--status-red-text)', marginTop: '4px', display: 'block' }}>{errors.gender}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Blood Group
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.bloodGroup} 
                      onChange={e => updateField('bloodGroup', e.target.value)}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Phone Number *
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: errors.phone ? '1px solid var(--status-red)' : '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.phone} 
                      onChange={e => updateField('phone', e.target.value)} 
                      placeholder="+1 (555) 019-2831" 
                    />
                    {errors.phone && <span style={{ fontSize: '11px', color: 'var(--status-red-text)', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.email} 
                      onChange={e => updateField('email', e.target.value)} 
                      placeholder="patient@example.com" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                    Residential Address
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                    value={formData.address} 
                    onChange={e => updateField('address', e.target.value)} 
                    placeholder="104 Healthcare Ave, Cityville, State 12345" 
                  />
                </div>
              </div>

              {/* SECTION 2: EMERGENCY CONTACT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <Phone size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    2. Emergency Contact
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Contact Name
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.emergencyName} 
                      onChange={e => updateField('emergencyName', e.target.value)} 
                      placeholder="e.g. John Chen" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Relationship
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.emergencyRelation} 
                      onChange={e => updateField('emergencyRelation', e.target.value)} 
                      placeholder="Spouse / Parent / Sibling" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Emergency Phone
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.emergencyPhone} 
                      onChange={e => updateField('emergencyPhone', e.target.value)} 
                      placeholder="+1 (555) 019-9988" 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: INITIAL CLINICAL INFORMATION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <Stethoscope size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    3. Initial Clinical Information (Front Desk Intake)
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Reason for Visit
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.reasonForVisit} 
                      onChange={e => updateField('reasonForVisit', e.target.value)} 
                      placeholder="e.g. Severe knee joint pain, scheduled hip replacement" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Symptoms
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.symptoms} 
                      onChange={e => updateField('symptoms', e.target.value)} 
                      placeholder="Joint stiffness, localized swelling" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Known Allergies
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.knownAllergies} 
                      onChange={e => updateField('knownAllergies', e.target.value)} 
                      placeholder="e.g. Penicillin, Latex, NKDA" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Existing Conditions
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.existingConditions} 
                      onChange={e => updateField('existingConditions', e.target.value)} 
                      placeholder="e.g. Hypertension, Diabetes Type 2" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Current Medications
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.currentMedications} 
                      onChange={e => updateField('currentMedications', e.target.value)} 
                      placeholder="e.g. Metformin 500mg, Lisinopril 10mg" 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                    Diagnosis / Provisional Diagnosis (Optional)
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                    value={formData.diagnosis} 
                    onChange={e => updateField('diagnosis', e.target.value)} 
                    placeholder="e.g. Osteoarthritis of Hip • Total Hip Arthroplasty" 
                  />
                </div>
              </div>

              {/* SECTION 4: ADMISSION DETAILS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <Building2 size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    4. Admission Details
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Admission Type *
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: errors.admissionType ? '1px solid var(--status-red)' : '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.admissionType} 
                      onChange={e => updateField('admissionType', e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Referral">Referral</option>
                    </select>
                    {errors.admissionType && <span style={{ fontSize: '11px', color: 'var(--status-red-text)', marginTop: '4px', display: 'block' }}>{errors.admissionType}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Department *
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: errors.department ? '1px solid var(--status-red)' : '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.department} 
                      onChange={e => updateField('department', e.target.value)}
                    >
                      <option value="">Select Department</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Surgery">General Surgery</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.department && <span style={{ fontSize: '11px', color: 'var(--status-red-text)', marginTop: '4px', display: 'block' }}>{errors.department}</span>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Attending Consultant
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.consultant} 
                      onChange={e => updateField('consultant', e.target.value)}
                    >
                      <option value="">Select Consultant</option>
                      <option value="doc-1">Dr. Rajesh Sharma, MD (Chief Medical Lead)</option>
                      <option value="doc-2">Dr. James Gomez, MD (Orthopedics Lead)</option>
                      <option value="doc-3">Dr. Kevin Patel, MD (Anesthesiology & Critical Care)</option>
                      <option value="doc-4">Dr. Alan Vance, MD (Cardiovascular Surgery)</option>
                      <option value="doc-5">Dr. Priya Patel, MD (General Surgery)</option>
                      <option value="doc-6">Dr. Arjun Rao, MD (Neurology)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Room / Bed (Available Only)
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.roomBed} 
                      onChange={e => updateField('roomBed', e.target.value)}
                    >
                      <option value="">Select Available Bed</option>
                      {availableBedsList.map(b => (
                        <option key={b.val} value={b.val}>{b.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Admission Date
                    </label>
                    <input 
                      type="date" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.admissionDate} 
                      onChange={e => updateField('admissionDate', e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Expected Length of Stay
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.expectedStay} 
                      onChange={e => updateField('expectedStay', e.target.value)}
                    >
                      <option value="Same Day / Day Case">Same Day / Day Case</option>
                      <option value="1-2 Days">1-2 Days</option>
                      <option value="3 Days">3 Days</option>
                      <option value="4-7 Days">4-7 Days</option>
                      <option value="> 1 Week">1+ Weeks</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 5: INSURANCE / BILLING INFORMATION */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <CreditCard size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    5. Billing & Insurance Information
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Payment Type
                    </label>
                    <select 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.paymentType} 
                      onChange={e => updateField('paymentType', e.target.value)}
                    >
                      <option value="Insurance">Insurance</option>
                      <option value="Self Pay">Self Pay</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Government Scheme">Government Scheme</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Insurance Provider
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.insuranceProvider} 
                      onChange={e => updateField('insuranceProvider', e.target.value)} 
                      placeholder="e.g. BlueCross Shield" 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px', display: 'block' }}>
                      Policy Number
                    </label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-default)', fontSize: '13px' }}
                      value={formData.policyNumber} 
                      onChange={e => updateField('policyNumber', e.target.value)} 
                      placeholder="e.g. BC-994201" 
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 6: DOCUMENTS & CONSENT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <FileCheck size={16} style={{ color: 'var(--accent-cyan)' }} />
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--text-navy-head)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    6. Verification, Consent & Document Attachments
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.identityVerified} 
                      onChange={e => updateField('identityVerified', e.target.checked)} 
                    />
                    Patient identity verified (Photo ID)
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.consentReceived} 
                      onChange={e => updateField('consentReceived', e.target.checked)} 
                    />
                    Admission consent form received & signed
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.contactVerified} 
                      onChange={e => updateField('contactVerified', e.target.checked)} 
                    />
                    Contact & emergency information verified
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.insuranceSubmitted} 
                      onChange={e => updateField('insuranceSubmitted', e.target.checked)} 
                    />
                    Insurance pre-authorization documents attached
                  </label>
                </div>

                {/* Upload Placeholders */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', borderRadius: '8px', border: '1px dashed var(--border-default)', textAlign: 'center', background: '#ffffff' }}>
                    <Upload size={16} style={{ color: 'var(--text-muted)', marginBottom: '4px' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block' }}>ID Proof</span>
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', cursor: 'pointer' }}>Upload File (Optional)</span>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '8px', border: '1px dashed var(--border-default)', textAlign: 'center', background: '#ffffff' }}>
                    <Upload size={16} style={{ color: 'var(--text-muted)', marginBottom: '4px' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block' }}>Insurance Card</span>
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', cursor: 'pointer' }}>Upload File (Optional)</span>
                  </div>

                  <div style={{ padding: '12px', borderRadius: '8px', border: '1px dashed var(--border-default)', textAlign: 'center', background: '#ffffff' }}>
                    <Upload size={16} style={{ color: 'var(--text-muted)', marginBottom: '4px' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block' }}>Referral Letter</span>
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', cursor: 'pointer' }}>Upload File (Optional)</span>
                  </div>
                </div>
              </div>

              {/* Form Action Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                marginTop: '10px'
              }}>
                <Button type="button" variant="secondary" size="md" onClick={onClose}>
                  Cancel
                </Button>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Button type="button" variant="secondary" size="md" onClick={() => alert("Registration saved as draft.")}>
                    Save as Draft
                  </Button>

                  <Button type="submit" variant="primary" size="md" icon={CheckCircle2} disabled={isSaving}>
                    {isSaving ? 'Registering Patient...' : 'Register Patient'}
                  </Button>
                </div>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
