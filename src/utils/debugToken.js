/**
 * Debug utility to inspect JWT token structure
 * Use in browser console to verify backend permission issue
 */

export const debugToken = () => {
  const token = sessionStorage.getItem('token')
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  if (!token) {
    console.error('❌ No token found in sessionStorage')
    return
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('❌ Invalid token format (should be 3 parts)')
      return
    }

    // Decode JWT payload
    const payload = JSON.parse(atob(parts[1]))

    console.group('🔍 TOKEN DEBUG INFO')
    console.log('✅ Token valid and decodable')
    console.group('Payload:')
    console.table(payload)
    console.groupEnd()

    console.group('User from sessionStorage:')
    console.table(user)
    console.groupEnd()

    console.group('🚨 PERMISSION CHECK')
    console.log('Role:', payload?.role || '❌ Missing')
    console.log('Student ID:', payload?.student_id || user?.student_id || '❌ Missing')
    console.log('Permissions array:', payload?.permissions || '⚠️ Missing or empty')
    console.log('Token expires at:', new Date(payload?.exp * 1000).toLocaleString())
    console.groupEnd()

    console.group('📋 EXPECTED by backend:')
    console.log('✅ role should be: "student"')
    console.log('✅ student_id should be present')
    console.log('⚠️ permissions array should have: ["view_student_profile", "view_homework", "view_notifications"]')
    console.groupEnd()

    console.groupEnd()
  } catch (err) {
    console.error('❌ Failed to decode token:', err.message)
  }
}

// Quick check if token is expired
export const isTokenExpired = () => {
  const token = sessionStorage.getItem('token')
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const isExpired = payload.exp * 1000 < Date.now()
    console.log(isExpired ? '⏰ Token EXPIRED' : '✅ Token still valid')
    return isExpired
  } catch {
    return true
  }
}
