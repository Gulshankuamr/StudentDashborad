const ROLE_MAP = {
  admin: 'admin',
  schooladmin: 'admin',
  school_admin: 'admin',
  schooladministrator: 'admin',
  student: 'student',
  teacher: 'teacher',
  accountant: 'accountant',
}

const parseJson = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const decodeJwtPayload = (token) => {
  try {
    const part = token?.split('.')?.[1]
    if (!part) return null
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    return parseJson(atob(padded))
  } catch {
    return null
  }
}

export const normalizeRole = (role) => {
  const key = String(role || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/-/g, '_')

  return ROLE_MAP[key] || 'unknown'
}

export const getRoleFromToken = (token) => {
  const payload = decodeJwtPayload(token)
  return normalizeRole(payload?.role || payload?.user?.role)
}

export const getStoredRole = () => {
  const userRaw = sessionStorage.getItem('user')
  const user = userRaw ? parseJson(userRaw) : null
  if (user?.role) return normalizeRole(user.role)

  const token = sessionStorage.getItem('token')
  if (!token) return 'student'
  return getRoleFromToken(token)
}


