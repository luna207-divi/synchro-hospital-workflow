import React from 'react';
import { X, User, ShieldCheck, Mail, Building2, Phone, Calendar, BadgeCheck } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useRole } from '../../context/RoleContext';

/* ============================================================
   SYNCHRO — Translucent User Profile Modal
   Displays active authenticated user details, assigned role,
   department, and permissions.
   ============================================================ */

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();
  const { activeRole } = useRole();

  if (!isOpen) return null;

  const displayName = profile?.display_name || activeRole?.userName || 'Hospital Staff';
  const roleName = profile?.role || activeRole?.name || 'Staff';
  const email = profile?.email || user?.email || '—';
  const jobTitle = profile?.job_title || activeRole?.userRole || 'Staff Member';
  const employeeId = profile?.employee_id || '—';
  const department = profile?.department || activeRole?.description || '—';
  // Derive initials: prefer profile avatar_initials, then compute from name
  const initials = profile?.avatar_initials
    || (displayName ? displayName.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'HS');
  const badgeColor = profile?.badge_color || activeRole?.badgeColor || 'purple';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(10, 25, 47, 0.60)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface-card, #ffffff)',
        borderRadius: 'var(--radius-xl, 24px)',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '520px',
        padding: '32px',
        position: 'relative',
      }} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <X size={20} />
        </button>

        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          <div className={`user-avatar avatar-${badgeColor}`} style={{ width: '64px', height: '64px', fontSize: '24px', borderRadius: '18px' }}>
            <span>{initials}</span>
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-navy-head)' }}>
              {displayName}
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: '2px' }}>
              {jobTitle}
            </p>
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge variant="purple" size="sm">
                <ShieldCheck size={12} style={{ marginRight: '4px' }} />
                {roleName}
              </Badge>
              <Badge variant="teal" size="xs">ACTIVE</Badge>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'var(--border-default)', margin: '20px 0' }} />

        {/* User Information Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              EMAIL ADDRESS
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
              {email}
            </span>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              EMPLOYEE ID
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {employeeId}
            </span>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              DEPARTMENT
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {department}
            </span>
          </div>

          <div style={{ background: 'var(--bg-app)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 'var(--text-2xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              SESSION STATUS
            </span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--status-green-text)' }}>
              Active — Verified
            </span>
          </div>
        </div>

        <Button variant="secondary" size="md" onClick={onClose} style={{ width: '100%' }}>
          Close Profile
        </Button>
      </div>
    </div>
  );
};
