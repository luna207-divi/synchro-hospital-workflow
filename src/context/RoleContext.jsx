import React, { createContext, useContext, useState } from 'react';

export const ROLES = {
  HOSPITAL_ADMIN: {
    id: 'HOSPITAL_ADMIN',
    name: 'Hospital Administrator',
    userName: 'Dr. R. Sharma',
    userRole: 'Chief Medical & Ops Lead',
    avatarInitials: 'DR',
    allowedNavIds: [
      'flow-board',
      'readiness',
      'instruments',
      'alerts',
      'analytics',
      'reports'
    ],
    badgeColor: 'purple',
    description: 'Complete visibility across Admissions, OT, and CSSD operations'
  },
  OT_MANAGER: {
    id: 'OT_MANAGER',
    name: 'OT Manager',
    userName: 'Dr. J. Gomez',
    userRole: 'Surgical Director & OT Lead',
    avatarInitials: 'JG',
    allowedNavIds: [
      'flow-board',
      'readiness',
      'instruments',
      'alerts',
      'analytics',
      'reports'
    ],
    badgeColor: 'indigo',
    description: 'Surgical suite utilization, workflow intelligence, delays, and analytics'
  },
  CSSD_MANAGER: {
    id: 'CSSD_MANAGER',
    name: 'CSSD Manager',
    userName: 'M. Vance',
    userRole: 'CSSD Quality & Logistics Lead',
    avatarInitials: 'MV',
    allowedNavIds: [
      'flow-board',
      'readiness',
      'instruments',
      'alerts'
    ],
    badgeColor: 'teal',
    description: 'Sterile tray lifecycle, autoclave compliance, RFID tracking, and alerts'
  },
  ADMISSIONS_STAFF: {
    id: 'ADMISSIONS_STAFF',
    name: 'Admissions Staff',
    userName: 'H. Jenkins, RN',
    userRole: 'Pre-Op & Patient Intake Coordinator',
    avatarInitials: 'HJ',
    allowedNavIds: [
      'flow-board',
      'readiness',
      'alerts'
    ],
    badgeColor: 'blue',
    description: 'Patient check-in, consent verification, pre-op readiness, and transfers'
  }
};

const RoleContext = createContext({
  activeRole: ROLES.HOSPITAL_ADMIN,
  setActiveRole: () => {},
  switchRole: () => {},
  isNavAllowed: () => true
});

export const RoleProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState(ROLES.HOSPITAL_ADMIN);

  const switchRole = (roleKey) => {
    if (ROLES[roleKey]) {
      setActiveRole(ROLES[roleKey]);
    }
  };

  const isNavAllowed = (navId) => {
    return activeRole.allowedNavIds.includes(navId);
  };

  return (
    <RoleContext.Provider value={{ activeRole, setActiveRole, switchRole, isNavAllowed }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
