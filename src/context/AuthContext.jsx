// src/context/AuthContext.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { normalizeRole } from '../utils/role'
import { normalizePermissions } from '../utils/permission'

const AuthContext = createContext(null)

// ─── Read sessionStorage ONCE synchronously as lazy initializer ──────────────
const initState = () => {
  try {
    const token = sessionStorage.getItem('token')
    const raw   = sessionStorage.getItem('user')
    if (!token || !raw) return { token: null, user: null }
    const parsed = JSON.parse(raw)
    return {
      token,
      user: {
        ...parsed,
        role: normalizeRole(parsed?.role),
        permissions: normalizePermissions(parsed?.permissions),
      },
    }
  } catch {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    return { token: null, user: null }
  }
}

export const AuthProvider = ({ children }) => {
  const [auth,     setAuth    ] = useState(initState)   // lazy init — runs ONCE
  const [hydrated, setHydrated] = useState(false)

  // Mark hydrated after first paint — ProtectedRoute waits for this
  useEffect(() => { setHydrated(true) }, [])

  // ── login({ token, user }) ─────────────────────────────────────────────────
  const login = useCallback(({ token, user }) => {
    if (!token || !user) {
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      setAuth({ token: null, user: null })
      return
    }

    const normalized = {
      ...user,
      role: normalizeRole(user?.role),
      permissions: normalizePermissions(user?.permissions),
    }

    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(normalized))
    setAuth({ token, user: normalized })
  }, [])

  // ── logout: clear state + storage, then navigate via React Router ──────────
  const logout = useCallback(() => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setAuth({ token: null, user: null })
  }, [])

  // Memoize so all consumers get a stable reference — prevents cascading renders
  const value = useMemo(() => ({
    user:            auth.user,
    token:           auth.token,
    isAuthenticated: !!auth.token,
    hydrated,
    permissions:     auth.user?.permissions || [],
    login,
    logout,
  }), [auth.token, auth.user, hydrated, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

