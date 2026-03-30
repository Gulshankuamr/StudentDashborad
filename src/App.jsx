// src/App.jsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

import ProtectedRoute from './components/ProtectedRoute'
import LoginRedirect  from './components/LoginRedirect'

// Auth
import LoginPage    from './pages/auth/LoginPage'
import Unauthorized from './pages/Unauthorized'
// import ProfilePage  from './pages/ProfilePage'

// Dashboards

import StudentDashboard from './pages/student/StudentDashboard'

// Shared
import NotificationsPage from './pages/student/NotificationsPage'

// Student — Profile Detail  ← NEW
import StudentProfileDetail from './pages/student/StudentProfileDetail'

// Homework
import StudentHomeworkList   from './pages/StudentHomeWork/StudentHomeworkList'
import StudentSubmitHomework from './pages/StudentHomeWork/StudentSubmitHomework'
import StudentViewSubmission from './pages/StudentHomeWork/StudentViewSubmission'



import StudentAttendance from './pages/studentattendance/StudentAttendance'


import StudentFees from './pages/StudentFees/StudentFees'


function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter
          future={{
            v7_startTransition:   true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>

            {/* Root → login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* ── Public ────────────────────────────────────────── */}
            <Route
              path="/login"
              element={
                <LoginRedirect>
                  <LoginPage />
                </LoginRedirect>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ── Shared Protected (any role) ───────────────────── */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  {/* <ProfilePage /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }


            />
            <Route path="/admin/notifications"   element={<Navigate to="/notifications" replace />} />
            <Route path="/student/notifications" element={<Navigate to="/notifications" replace />} />

            {/* ── Admin ─────────────────────────────────────────── */}
         

            {/* ── Student ───────────────────────────────────────── */}
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            {/* Student — Full Profile Detail  ← NEW */}
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentProfileDetail />
                </ProtectedRoute>
              }
            />

            {/* Homework */}
            <Route
              path="/student/homework"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentHomeworkList />
                </ProtectedRoute>
              }
            />


            <Route
  path="/student/attendance"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentAttendance />
    </ProtectedRoute>
  }
/>


<Route
  path="/student/fees"
  element={
    <ProtectedRoute allowedRoles={['student']}>
      <StudentFees />
    </ProtectedRoute>
  }
/>

            <Route
              path="/student/homework/submit/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentSubmitHomework />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/homework/view/:id"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentViewSubmission />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App