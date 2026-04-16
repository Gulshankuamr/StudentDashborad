import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginRedirect from './components/LoginRedirect'
import LoginPage from './pages/auth/LoginPage'
import Unauthorized from './pages/Unauthorized'
import { protectedRouteConfig } from './config/routeConfig'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/login"
              element={
                <LoginRedirect>
                  <LoginPage />
                </LoginRedirect>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {protectedRouteConfig.map((route) => {
              const Page = route.element

              return (
                <Route
                  key={route.key}
                  path={route.path}
                  element={
                    <ProtectedRoute
                      allowedRoles={route.allowedRoles}
                      requiredPermission={route.requiredPermission}
                    >
                      <Page />
                    </ProtectedRoute>
                  }
                />
              )
            })}

            <Route path="/admin/notifications" element={<Navigate to="/notifications" replace />} />
            <Route path="/student/notifications" element={<Navigate to="/notifications" replace />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
