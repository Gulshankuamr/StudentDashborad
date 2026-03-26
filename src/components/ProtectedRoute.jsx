// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * allowedRoles = []         → any authenticated user
 * allowedRoles = ['admin']  → only admin
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, hydrated } = useAuth()

  // Wait for sessionStorage read — prevents false redirect on first load
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-[3px] border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default ProtectedRoute
