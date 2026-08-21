import React, { createContext, useContext, useState, useEffect } from 'react';

/* ============================================================
   SYNCHRO — Role Context
   
   Syncs the activeRole with the authenticated user's role from
   AuthContext. Also provides legacy isNavAllowed() for Sidebar
   nav filtering based on the authenticated user's role.
   ============================================================ */

// Nav items allowed per role
const ROLE_NAV_PERMISSIONS = {
  ADMIN:        ['flow-board', 'frontdesk', 'live-flow', 'patients', 'readiness', 'instruments', 'alerts', 'analytics', 'reports', 'settings'],
  HOSPITAL_ADMIN: ['flow-board', 'frontdesk', 'live-flow', 'patients', 'readiness', 'instruments', 'alerts', 'analytics', 'reports', 'settings'],

  FRONT_DESK:   ['frontdesk', 'patients', 'alerts'],
  FRONTDESK:    ['frontdesk', 'patients', 'alerts'],
  ADMISSIONS_STAFF: ['frontdesk', 'patients', 'alerts'],

  DOCTOR:       ['flow-board', 'live-flow', 'patients', 'alerts', 'reports'],
  SURGEON:      ['flow-board', 'live-flow', 'patients', 'alerts', 'reports'],

  NURSE:        ['nursing', 'flow-board', 'readiness', 'alerts'],
  NURSING:      ['nursing', 'flow-board', 'readiness', 'alerts'],

  CSSD:         ['instruments', 'alerts', 'reports'],
  CSSD_MANAGER: ['instruments', 'alerts', 'reports'],

  OT_MANAGER:   ['flow-board', 'readiness', 'instruments', 'alerts', 'reports'],
  BILLING:      ['analytics', 'reports', 'alerts'],
};

// Legacy ROLES object kept for backward compatibility with existing components
export const ROLES = {
  HOSPITAL_ADMIN: {
    id: 'HOSPITAL_ADMIN',
    name: 'Hospital Administrator',
    userName: 'Dr. R. Sharma',
    userRole: 'Chief Medical & Ops Lead',
    avatarInitials: 'DR',
    allowedNavIds: ROLE_NAV_PERMISSIONS.HOSPITAL_ADMIN,
    badgeColor: 'purple',
    description: 'Complete visibility across Admissions, OT, and CSSD operations'
  },
  ADMIN: {
    id: 'ADMIN',
    name: 'Administrator',
    userName: 'Dr. Evelyn Vance',
    userRole: 'VP Clinical Operations',
    avatarInitials: 'EV',
    allowedNavIds: ROLE_NAV_PERMISSIONS.ADMIN,
    badgeColor: 'purple',
    description: 'Complete visibility across all hospital departments'
  },
  OT_MANAGER: {
    id: 'OT_MANAGER',
    name: 'OT Manager',
    userName: 'Dr. J. Gomez',
    userRole: 'Surgical Director & OT Lead',
    avatarInitials: 'JG',
    allowedNavIds: ROLE_NAV_PERMISSIONS.OT_MANAGER,
    badgeColor: 'indigo',
    description: 'Surgical suite utilization, workflow intelligence, delays, and analytics'
  },
  DOCTOR: {
    id: 'DOCTOR',
    name: 'Doctor',
    userName: 'Dr. Rajesh Sharma',
    userRole: 'Chief Medical & Surgical Lead',
    avatarInitials: 'RS',
    allowedNavIds: ROLE_NAV_PERMISSIONS.DOCTOR,
    badgeColor: 'indigo',
    description: 'Surgical pipeline, readiness, analytics, and patient care'
  },
  CSSD_MANAGER: {
    id: 'CSSD_MANAGER',
    name: 'CSSD Manager',
    userName: 'M. Vance',
    userRole: 'CSSD Quality & Logistics Lead',
    avatarInitials: 'MV',
    allowedNavIds: ROLE_NAV_PERMISSIONS.CSSD_MANAGER,
    badgeColor: 'teal',
    description: 'Sterile tray lifecycle, autoclave compliance, RFID tracking, and alerts'
  },
  NURSING: {
    id: 'NURSING',
    name: 'Nursing',
    userName: 'Maria Vance',
    userRole: 'SterileFlow & Triage Lead Nurse',
    avatarInitials: 'MV',
    allowedNavIds: ROLE_NAV_PERMISSIONS.NURSING,
    badgeColor: 'teal',
    description: 'Ward management, instrument sterility, and patient readiness'
  },
  ADMISSIONS_STAFF: {
    id: 'ADMISSIONS_STAFF',
    name: 'Admissions Staff',
    userName: 'H. Jenkins, RN',
    userRole: 'Pre-Op & Patient Intake Coordinator',
    avatarInitials: 'HJ',
    allowedNavIds: ROLE_NAV_PERMISSIONS.ADMISSIONS_STAFF,
    badgeColor: 'blue',
    description: 'Patient check-in, consent verification, pre-op readiness, and transfers'
  },
  FRONT_DESK: {
    id: 'FRONT_DESK',
    name: 'Front Desk',
    userName: 'Sarah Jenkins',
    userRole: 'Patient Intake & Admissions Coordinator',
    avatarInitials: 'SJ',
    allowedNavIds: ROLE_NAV_PERMISSIONS.FRONT_DESK,
    badgeColor: 'blue',
    description: 'Patient registration, admissions, and pre-op coordination'
  },
  BILLING: {
    id: 'BILLING',
    name: 'Billing',
    userName: 'Robert Sterling',
    userRole: 'Director of Billing & Revenue Cycle',
    avatarInitials: 'RS',
    allowedNavIds: ROLE_NAV_PERMISSIONS.BILLING,
    badgeColor: 'emerald',
    description: 'Financial reports, billing lifecycle, and revenue management'
  },
};

const RoleContext = createContext({
  activeRole: ROLES.DOCTOR,
  setActiveRole: () => {},
  switchRole: () => {},
  isNavAllowed: () => true
});

export const RoleProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(ROLES.DOCTOR);

  const switchRole = (roleKey) => {
    const cleanKey = String(roleKey || '').toUpperCase().trim();
    // Try direct match first
    if (ROLES[cleanKey]) {
      setActiveRole(ROLES[cleanKey]);
      return;
    }
    // Normalize FRONTDESK → FRONT_DESK
    if (cleanKey === 'FRONTDESK') {
      setActiveRole(ROLES.FRONT_DESK);
      return;
    }
  };

  const isNavAllowed = (navId) => {
    return activeRole?.allowedNavIds?.includes(navId) ?? true;
  };

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole, switchRole, isNavAllowed }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
