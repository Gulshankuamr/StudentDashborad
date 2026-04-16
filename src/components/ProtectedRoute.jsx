import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { hasPermission } from '../utils/permission'

const isTokenExpired = (token) => {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload?.exp) return true
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requiredPermission = null,
}) => {
  const { isAuthenticated, user, token, logout, hydrated } = useAuth()

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-[3px] border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated || !token || isTokenExpired(token)) {
    logout()
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  if (!hasPermission(user?.permissions, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
