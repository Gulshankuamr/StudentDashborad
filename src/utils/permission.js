export const normalizePermissions = (permissions) => {
  if (!Array.isArray(permissions)) return []

  return permissions
    .map((permission) => {
      if (typeof permission === 'string') return permission
      if (permission && typeof permission === 'object') {
        return permission.key || permission.name || permission.permission || ''
      }
      return ''
    })
    .filter(Boolean)
}

export const hasPermission = (permissions, requiredPermission) => {
  if (!requiredPermission) return true
  return normalizePermissions(permissions).includes(requiredPermission)
}
