/* ============================================================
   SYNCHRO — Role Action Permission Matrix & Enforcer
   ============================================================ */

export const ACTION_PERMISSIONS = {
  ADMIN: ['*'], // Admin has all permissions

  FRONT_DESK: [
    'patient:register',
    'admission:create',
    'document:manage',
    'patient:view',
    'workflow:view',
    'alerts:view'
  ],

  DOCTOR: [
    'patient:view',
    'clinical:assess',
    'clinical:note',
    'clinical:clearance',
    'preop:assess',
    'postop:assess',
    'discharge:clear',
    'workflow:view',
    'alerts:view'
  ],

  NURSE: [
    'patient:view',
    'vitals:record',
    'nursing:note',
    'preop:checklist',
    'recovery:checklist',
    'handoff:confirm',
    'discharge:checklist',
    'workflow:view',
    'alerts:view'
  ],

  NURSING: [
    'patient:view',
    'vitals:record',
    'nursing:note',
    'preop:checklist',
    'recovery:checklist',
    'handoff:confirm',
    'discharge:checklist',
    'workflow:view',
    'alerts:view'
  ],

  CSSD: [
    'cssd:view',
    'pack:verify',
    'pack:issue',
    'pack:reserve',
    'pack:return',
    'pack:reprocess',
    'alerts:view'
  ],

  OT_MANAGER: [
    'ot:view',
    'ot:assign',
    'procedure:start',
    'procedure:complete',
    'turnover:manage',
    'alerts:view'
  ],

  BILLING: [
    'billing:view',
    'billing:clearance',
    'reports:view',
    'alerts:view'
  ]
};

/**
 * Check if a role has permission to perform an action
 */
export const canPerformAction = (userRole, action) => {
  if (!userRole) return false;
  const roleKey = String(userRole).toUpperCase().trim();

  // Admin bypass
  if (roleKey === 'ADMIN' || roleKey === 'HOSPITAL_ADMIN') return true;

  const allowedActions = ACTION_PERMISSIONS[roleKey] || [];
  if (allowedActions.includes('*')) return true;

  return allowedActions.includes(action);
};

/**
 * Enforce action permission and trigger alert/toast if denied
 */
export const enforcePermission = (userRole, action, actionName = 'this action') => {
  const allowed = canPerformAction(userRole, action);
  if (!allowed) {
    const msg = `PERMISSION DENIED: Your role (${(userRole || 'USER').toUpperCase()}) does not have permission to perform ${actionName}.`;
    alert(msg);
    return false;
  }
  return true;
};
