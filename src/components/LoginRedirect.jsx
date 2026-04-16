import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDefaultRouteForRole } from '../config/routeConfig'

const LoginRedirect = ({ children }) => {
  const { isAuthenticated, user, hydrated } = useAuth()

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-[3px] border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated && user?.role) {
    return <Navigate to={getDefaultRouteForRole(user.role)} replace />
  }

  return children
}

export default LoginRedirect
