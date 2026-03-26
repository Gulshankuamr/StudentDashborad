// src/components/LoginRedirect.jsx
// Guards the /login route — if already authenticated, redirect to dashboard
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLE_ROUTES = {
  admin:   '/admin/dashboard',
  student: '/student/dashboard',
}

const LoginRedirect = ({ children }) => {
  const { isAuthenticated, user, hydrated } = useAuth()

  // Wait for hydration before deciding
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-[3px] border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Already logged in → send to their dashboard
  if (isAuthenticated && user?.role) {
    return <Navigate to={ROLE_ROUTES[user.role] || '/unauthorized'} replace />
  }

  return children
}

export default LoginRedirect