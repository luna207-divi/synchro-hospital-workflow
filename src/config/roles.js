/* ============================================================
   SYNCHRO — Role & Dashboard Routing Configuration
   ============================================================ */

export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  NURSING: 'NURSING',
  FRONT_DESK: 'FRONT_DESK',
  FRONTDESK: 'FRONT_DESK',
  CSSD: 'CSSD',
  OT_MANAGER: 'OT_MANAGER',
  BILLING: 'BILLING',

  // System aliases
  HOSPITAL_ADMIN: 'ADMIN',
  SURGEON: 'DOCTOR',
  CSSD_MANAGER: 'CSSD',
  ADMISSIONS_STAFF: 'FRONT_DESK',
};

export const ROLE_DASHBOARDS = {
  ADMIN: '/admin',
  HOSPITAL_ADMIN: '/admin',

  DOCTOR: '/doctor',
  SURGEON: '/doctor',

  NURSE: '/nursing',
  NURSING: '/nursing',

  FRONT_DESK: '/frontdesk',
  FRONTDESK: '/frontdesk',
  ADMISSIONS_STAFF: '/frontdesk',

  CSSD: '/cssd',
  CSSD_MANAGER: '/cssd',

  OT_MANAGER: '/ot',

  BILLING: '/billing',
};

export const getDashboardForRole = (role) => {
  if (!role) return '/doctor';
  const cleanRole = String(role).toUpperCase().trim();
  if (cleanRole === 'FRONTDESK') return '/frontdesk';
  return ROLE_DASHBOARDS[cleanRole] || '/doctor';
};

// Check if role is authorized for route
export const isRoleAuthorized = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRole) return false;

  const normalizedUserRole = String(userRole).toUpperCase().trim();
  
  return allowedRoles.some((allowed) => {
    const normAllowed = String(allowed).toUpperCase().trim();
    if (normAllowed === normalizedUserRole) return true;
    // Normalize underscore differences (FRONTDESK vs FRONT_DESK)
    if (normAllowed.replace(/_/g, '') === normalizedUserRole.replace(/_/g, '')) return true;
    // Check aliases
    if (ROLES[normAllowed] && ROLES[normAllowed] === normalizedUserRole) return true;
    if (ROLES[normalizedUserRole] && ROLES[normalizedUserRole] === normAllowed) return true;
    return false;
  });
};
