/* ============================================================
   SYNCHRO — Role & Dashboard Routing Configuration
   ============================================================ */

export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSING: 'NURSING',
  FRONT_DESK: 'FRONT_DESK',
  FRONTDESK: 'FRONT_DESK',
  BILLING: 'BILLING',

  // System aliases
  HOSPITAL_ADMIN: 'ADMIN',
  OT_MANAGER: 'DOCTOR',
  SURGEON: 'DOCTOR',
  CSSD_MANAGER: 'NURSING',
  NURSE: 'NURSING',
  ADMISSIONS_STAFF: 'FRONT_DESK',
};

export const ROLE_DASHBOARDS = {
  ADMIN: '/admin',
  HOSPITAL_ADMIN: '/admin',

  DOCTOR: '/doctor',
  OT_MANAGER: '/doctor',
  SURGEON: '/doctor',

  NURSING: '/nursing',
  CSSD_MANAGER: '/nursing',
  NURSE: '/nursing',

  FRONT_DESK: '/frontdesk',
  FRONTDESK: '/frontdesk',
  ADMISSIONS_STAFF: '/frontdesk',

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
    if (normAllowed.replace('_', '') === normalizedUserRole.replace('_', '')) return true;
    // Check aliases
    if (ROLES[normAllowed] && ROLES[normAllowed] === normalizedUserRole) return true;
    if (ROLES[normalizedUserRole] && ROLES[normalizedUserRole] === normAllowed) return true;
    return false;
  });
};

