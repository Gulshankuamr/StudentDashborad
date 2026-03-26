// src/utils/role.js

/**
 * Normalize role strings from API to internal role keys
 * API returns: "school_admin" → internal: "admin"
 */
export const normalizeRole = (role) => {
  if (!role) return ''
  const map = {
    school_admin: 'admin',
    admin: 'admin',
    student: 'student',
    teacher: 'teacher',
    accountant: 'accountant',
  }
  return map[role?.toLowerCase()] || role?.toLowerCase()
}

/**
 * Check if user has a specific permission
 * @param {string[]} permissions - array from user object
 * @param {string} permission - permission key to check
 */
export const hasPermission = (permissions = [], permission) => {
  if (!Array.isArray(permissions)) return false
  return permissions.includes(permission)
}

/**
 * Check if user has any of the given permissions
 */
export const hasAnyPermission = (permissions = [], required = []) => {
  return required.some((p) => permissions.includes(p))
}