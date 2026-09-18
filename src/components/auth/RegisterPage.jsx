import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, User, Building2, FileCheck, CheckCircle2, 
  Upload, AlertCircle, Lock, Mail, Phone, Calendar, IdCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SynchroLogo } from '../common/SynchroLogo';
import { Button } from '../common/Button';
import './RegisterPage.css';

/* ============================================================
   SYNCHRO — New Member Registration Component
   "Secure Hospital Team Onboarding"
   ============================================================ */

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerMember } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    employeeId: '',
    dateOfJoining: '',
    department: 'Admissions & Pre-Op',
    requestedRole: 'FRONT_DESK',
    hospitalFacility: 'SYNCHRO Central Hospital',
    idProofType: 'Aadhaar / National ID'
  });

  const [idProofFile, setIdProofFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (!file) {
      setIdProofFile(null);
      return;
    }

    // Validate file type (PDF, PNG, JPG, JPEG)
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setFileError('Invalid file type. Please upload a PDF, PNG, or JPG document.');
      setIdProofFile(null);
      return;
    }

    // Validate file size (Max 5MB)
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setFileError('File size exceeds 5MB limit. Please upload a smaller file.');
      setIdProofFile(null);
      return;
    }

    setIdProofFile(file);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full name is required.';
    if (!formData.email.trim()) return 'Email address is required.';
    
    // Email regex format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) return 'Phone number is required.';
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Password and Confirm Password do not match.';
    }

    if (!formData.employeeId.trim()) return 'Employee ID is required.';
    if (!formData.department) return 'Department selection is required.';
    if (!formData.requestedRole) return 'Requested role is required.';
    if (!idProofFile) return 'Please upload an ID proof document for identity verification.';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationErr = validateForm();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setIsLoading(true);

    try {
      await registerMember(formData, idProofFile);
      setIsSubmitted(true);
    } catch (err) {
      console.error('[Registration Error]', err);
      setError(err.message || 'Failed to submit registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="synchro-register-page">
      {/* ── LEFT SIDE: Branding Panel ── */}
      <div className="register-left-side">
        <div className="register-brand-header">
          <SynchroLogo size="lg" variant="dark" showTagline={true} onClick={() => navigate('/')} />
        </div>

        <div className="register-left-content" style={{ marginTop: '40px', marginBottom: '40px' }}>
          <div className="register-3d-graphic-wrapper" style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img 
              src="/assets/images/hospital_triad.png" 
              alt="Synchro Hospital Workflow Illustration" 
              style={{ width: '100%', maxWidth: '280px', height: 'auto', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}
            />
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, margin: '0 0 10px 0' }}>
            Join SYNCHRO Health
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
            Secure team onboarding for hospital admissions, surgical suites, nursing units, CSSD sterilization, and billing departments.
          </p>
        </div>

        <div className="register-left-footer" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
          <ShieldCheck size={14} />
          <span>Role-Based Verified Access Control</span>
        </div>
      </div>

      {/* ── RIGHT SIDE: Registration Form Panel ── */}
      <div className="register-right-side">
        <div className="register-card-panel">
          
          <button 
            type="button" 
            className="register-back-link"
            onClick={() => navigate('/login')}
          >
            <ArrowLeft size={14} />
            <span>Back to Login</span>
          </button>

          {!isSubmitted ? (
            <>
              <div className="register-panel-header">
                <h1 className="register-panel-title">Create Your SYNCHRO Account</h1>
                <p className="register-panel-sub">
                  Register as a new hospital team member. Your details will be securely submitted for verification.
                </p>
              </div>

              {/* Error Message Display */}
              {error && (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: '#fef2f2',
                  border: '1px solid #fca5a5',
                  color: '#991b1b',
                  fontSize: '13px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* ── 1. PERSONAL DETAILS ── */}
                <div className="register-form-section">
                  <div className="register-section-header">
                    <User size={15} />
                    <span>Personal Details</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Dr. Sarah Jenkins"
                      required 
                    />
                  </div>

                  <div className="register-grid-2" style={{ marginBottom: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Date of Birth</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Gender</label>
                      <select 
                        className="form-input"
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="register-grid-2" style={{ marginBottom: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input 
                        type="tel" 
                        className="form-input" 
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-input" 
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="name@hospital.org"
                        required 
                      />
                    </div>
                  </div>

                  <div className="register-grid-2">
                    <div className="form-group">
                      <label className="form-label">Password *</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Min 8 characters"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password *</label>
                      <input 
                        type="password" 
                        className="form-input" 
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter password"
                        required 
                      />
                    </div>
                  </div>
                </div>

                {/* ── 2. EMPLOYEE DETAILS ── */}
                <div className="register-form-section">
                  <div className="register-section-header">
                    <Building2 size={15} />
                    <span>Employee & Role Details</span>
                  </div>

                  <div className="register-grid-2" style={{ marginBottom: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Employee ID / Code *</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={formData.employeeId}
                        onChange={(e) => handleInputChange('employeeId', e.target.value)}
                        placeholder="e.g. EMP-FD-101"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Date of Joining</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={formData.dateOfJoining}
                        onChange={(e) => handleInputChange('dateOfJoining', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="register-grid-2" style={{ marginBottom: '14px' }}>
                    <div className="form-group">
                      <label className="form-label">Department *</label>
                      <select 
                        className="form-input"
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        required
                      >
                        <option value="Admissions & Pre-Op">Admissions & Pre-Op Intake</option>
                        <option value="Operating Theatres">Operating Theatres & Surgical Suites</option>
                        <option value="Nursing & PACU">Nursing & Recovery PACU</option>
                        <option value="CSSD Sterilization">CSSD Sterile Processing</option>
                        <option value="Billing & Claims">Billing & Revenue Operations</option>
                        <option value="Administration">Hospital Executive Administration</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Requested Designation / Role *</label>
                      <select 
                        className="form-input"
                        value={formData.requestedRole}
                        onChange={(e) => handleInputChange('requestedRole', e.target.value)}
                        required
                      >
                        <option value="FRONT_DESK">Front Desk / Admissions Staff</option>
                        <option value="DOCTOR">Doctor / Clinical Lead</option>
                        <option value="NURSE">Nursing Lead</option>
                        <option value="CSSD">CSSD Technician / Lead</option>
                        <option value="OT_MANAGER">Operating Theatre Coordinator</option>
                        <option value="BILLING">Billing / Finance Officer</option>
                        <option value="ADMIN">Hospital Administrator</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hospital / Facility Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={formData.hospitalFacility}
                      onChange={(e) => handleInputChange('hospitalFacility', e.target.value)}
                      placeholder="SYNCHRO Central Hospital"
                    />
                  </div>
                </div>

                {/* ── 3. IDENTITY VERIFICATION ── */}
                <div className="register-form-section">
                  <div className="register-section-header">
                    <IdCard size={15} />
                    <span>Identity Verification</span>
                  </div>

                  <div className="form-group" style={{ marginBottom: '14px' }}>
                    <label className="form-label">ID Proof Document Type *</label>
                    <select 
                      className="form-input"
                      value={formData.idProofType}
                      onChange={(e) => handleInputChange('idProofType', e.target.value)}
                      required
                    >
                      <option value="Aadhaar / National ID">Aadhaar / National ID Card</option>
                      <option value="Medical Council License">Medical Council Registration License</option>
                      <option value="Employee Badge ID">Hospital Employee Identification Badge</option>
                      <option value="Passport">Government Passport</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Upload Document (PDF, PNG, JPG - Max 5MB) *</label>
                    <div 
                      className="register-file-upload-zone"
                      onClick={() => document.getElementById('idProofFileInput').click()}
                    >
                      <input 
                        type="file"
                        id="idProofFileInput"
                        style={{ display: 'none' }}
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                      />
                      <Upload size={24} style={{ color: 'var(--primary-blue, #2563eb)', marginBottom: '8px' }} />
                      {idProofFile ? (
                        <div>
                          <p style={{ fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0', fontSize: '13px' }}>
                            {idProofFile.name}
                          </p>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                            {(idProofFile.size / (1024 * 1024)).toFixed(2)} MB • Click to replace file
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontWeight: 600, color: '#334155', margin: '0 0 4px 0', fontSize: '13px' }}>
                            Click to select document or drop file here
                          </p>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                            Supported: PDF, PNG, JPG (Maximum size: 5MB)
                          </p>
                        </div>
                      )}
                    </div>

                    {fileError && (
                      <p style={{ fontSize: '12px', color: '#dc2626', marginTop: '6px', marginBotton: 0 }}>
                        {fileError}
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  icon={ArrowRight}
                  className="register-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting Registration...' : 'SUBMIT REGISTRATION'}
                </Button>
              </form>
            </>
          ) : (
            /* ── SUCCESS CONFIRMATION ── */
            <div className="register-success-card">
              <div className="register-success-icon">
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>
                Registration Submitted Successfully
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 24px auto' }}>
                Your account details and identity verification document for <strong>{formData.email}</strong> have been securely submitted.
              </p>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px 20px',
                textAlign: 'left',
                fontSize: '13px',
                color: '#334155',
                marginBottom: '28px'
              }}>
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} style={{ color: '#2563eb' }} />
                  <span>Pending Administrator Verification</span>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b', lineHeight: 1.5 }}>
                  Your account is currently in <strong>PENDING</strong> verification status. A SYNCHRO hospital administrator will review your requested role (<strong>{formData.requestedRole}</strong>) and identity document. You will be able to log in once your registration is approved.
                </p>
              </div>

              <Button 
                variant="primary" 
                size="lg"
                onClick={() => navigate('/login')}
                style={{ width: '100%' }}
              >
                RETURN TO LOGIN
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
