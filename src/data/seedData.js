/* ============================================================
   SYNCHRO — Shared Seed Data & User Records Foundation
   Contains realistic demo data for all 5 hospital roles,
   central patients, admissions, OTs, CSSD packs, billing records,
   alerts, notifications, and workflow events.
   ============================================================ */

export const DEMO_USERS = [
  {
    id: 'usr-adm-01',
    employeeId: 'EMP-ADM-505',
    name: 'Dr. Evelyn Vance, DHA',
    email: 'admin@synchro.health',
    alternateEmail: 'admin@synchro.demo',
    passwordHash: 'Admin@123',
    role: 'ADMIN',
    department: 'Hospital Administration & Executive Command',
    departmentCode: 'ADMIN',
    phone: '+1 (555) 678-9015',
    jobTitle: 'Vice President of Clinical Operations',
    avatarInitials: 'EV',
    badgeColor: 'purple',
    status: 'ACTIVE',
    createdAt: '2024-09-15T08:00:00.000Z',
    updatedAt: '2026-08-17T10:00:00.000Z'
  },
  {
    id: 'usr-fd-01',
    employeeId: 'EMP-FD-101',
    name: 'Sarah Jenkins, RN',
    email: 'frontdesk@synchro.health',
    alternateEmail: 'frontdesk@synchro.demo',
    passwordHash: 'Front@123',
    role: 'FRONT_DESK',
    department: 'Admissions & Pre-Op Intake',
    departmentCode: 'ADM',
    phone: '+1 (555) 234-5601',
    jobTitle: 'Patient Intake & Admissions Coordinator',
    avatarInitials: 'SJ',
    badgeColor: 'blue',
    status: 'ACTIVE',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2026-08-17T10:00:00.000Z'
  },
  {
    id: 'usr-doc-01',
    employeeId: 'EMP-DOC-303',
    name: 'Dr. Rajesh Sharma, MD',
    email: 'doctor@synchro.health',
    alternateEmail: 'doctor@synchro.demo',
    passwordHash: 'Doctor@123',
    role: 'DOCTOR',
    department: 'General & Surgical Operations',
    departmentCode: 'OT',
    phone: '+1 (555) 456-7803',
    jobTitle: 'Chief Medical & Surgical Lead',
    avatarInitials: 'RS',
    badgeColor: 'indigo',
    status: 'ACTIVE',
    createdAt: '2024-11-01T08:00:00.000Z',
    updatedAt: '2026-08-17T10:00:00.000Z'
  },
  {
    id: 'usr-nr-01',
    employeeId: 'EMP-NR-202',
    name: 'Maria Vance, BSN',
    email: 'nurse@synchro.health',
    alternateEmail: 'nursing@synchro.demo',
    passwordHash: 'Nurse@123',
    role: 'NURSE',
    department: 'Central Sterile & Perioperative Nursing',
    departmentCode: 'CSSD',
    phone: '+1 (555) 345-6702',
    jobTitle: 'SterileFlow & Triage Lead Nurse',
    avatarInitials: 'MV',
    badgeColor: 'teal',
    status: 'ACTIVE',
    createdAt: '2025-01-12T08:00:00.000Z',
    updatedAt: '2026-08-17T10:00:00.000Z'
  },
  {
    id: 'usr-cssd-01',
    employeeId: 'EMP-CS-606',
    name: 'Priya Nair, CSSD Lead',
    email: 'cssd@synchro.health',
    alternateEmail: 'cssd@synchro.demo',
    passwordHash: 'CSSD@123',
    role: 'CSSD',
    department: 'Sterile Processing & Instrument Vault',
    departmentCode: 'CSSD',
    phone: '+1 (555) 789-0123',
    jobTitle: 'CSSD Quality & Sterilization Supervisor',
    avatarInitials: 'PN',
    badgeColor: 'teal',
    status: 'ACTIVE',
    createdAt: '2025-01-15T08:00:00.000Z',
    updatedAt: '2026-08-17T10:00:00.000Z'
  },
  {
    id: 'usr-ot-01',
    employeeId: 'EMP-OT-707',
    name: 'Dr. James Gomez, MD',
    email: 'ot@synchro.health',
    alternateEmail: 'ot@synchro.demo',
    passwordHash: 'OT@123',
    role: 'OT_MANAGER',
    department: 'Operating Theatre Management',
    departmentCode: 'OT',
    phone: '+1 (555) 890-1234',
    jobTitle: 'OT Suite Operations Director',
    avatarInitials: 'JG',
    badgeColor: 'indigo',
    status: 'ACTIVE',
    createdAt: '2024-10-20T08:00:00.000Z',
    updatedAt: '2026-08-17T10:00:00.000Z'
  }
];

export const DEMO_PATIENTS = [];

export const DEMO_ADMISSIONS = [];

export const DEMO_WORKFLOW_EVENTS = [];

export const DEMO_NOTIFICATIONS = [];

