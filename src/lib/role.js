export const normalizeRole = (role) => {
  if (!role) return ''

  const map = {
    school_admin: 'school_admin',
    schooladmin: 'school_admin',
    admin: 'school_admin',
    student: 'student',
    teacher: 'teacher',
    accountant: 'accountant',
  }

  return map[String(role).toLowerCase()] || String(role).toLowerCase()
}

export const hasPermission = (permissions = [], permission) => {
  if (!Array.isArray(permissions)) return false
  return permissions.includes(permission)
}

export const hasAnyPermission = (permissions = [], required = []) => {
  return required.some((permission) => permissions.includes(permission))
}
