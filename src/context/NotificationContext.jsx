import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  getMyNotifications,
  markAllAsRead,
  markAsRead,
} from '../services/Notificationservice'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

const POLL_INTERVAL_MS = 30_000
const RETRY_DELAYS_MS  = [2_000, 5_000, 10_000]
const PAGE_LIMIT       = 50

const formatTime = (iso) => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60_000)
  const hr   = Math.floor(min / 60)
  const day  = Math.floor(hr / 24)
  if (min < 1)   return 'Just now'
  if (min < 60)  return `${min} min ago`
  if (hr  < 24)  return `${hr}h ago`
  if (day === 1) return 'Yesterday'
  return `${day} days ago`
}

const ROLE_COLOR = {
  school_admin: '#4f46e5',
  admin:        '#4f46e5',
  teacher:      '#10b981',
  student:      '#f59e0b',
  accountant:   '#ef4444',
}

const detectType = (n) => {
  const text = `${n.title || ''} ${n.description || ''}`.toLowerCase()
  if (text.includes('grade')  || text.includes('result') || text.includes('marks')) return 'grade'
  if (text.includes('alert')  || text.includes('urgent') || text.includes('warn'))  return 'alert'
  if (text.includes('fee')    || text.includes('pay')    || text.includes('due'))   return 'system'
  return 'message'
}

const normalize = (n) => {
  const senderName  = n.sender_name  || ''
  const senderEmail = n.sender_email || ''
  const senderRole  = n.sender_role  || 'school_admin'
  const initials    = senderName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return {
    id:          n.notification_id ?? n.id,
    type:        detectType(n),
    title:       n.title       || 'Notification',
    preview:     n.description || '',
    time:        formatTime(n.created_at),
    read:        n.is_read === 1 || n.is_read === true || n.read === true,
    avatar:      initials || '🔔',
    avatarColor: ROLE_COLOR[senderRole] || '#4f46e5',
    fullContent: {
      from:    senderName  || 'System',
      email:   senderEmail,
      role:    senderRole,
      subject: n.title       || '',
      body:    n.description || '',
      date: n.created_at
        ? new Date(n.created_at).toLocaleString('en-IN', {
            weekday: 'long', year: 'numeric', month: 'long',
            day: 'numeric', hour: '2-digit', minute: '2-digit',
          })
        : '',
      readAt: n.read_at || null,
      status: n.status  || '',
    },
  }
}

export function NotificationProvider({ children }) {
  const { isAuthenticated, hydrated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [lastFetchedAt, setLastFetchedAt] = useState(null)

  const isFetchingRef  = useRef(false)
  const blockedRef     = useRef(false)
  const retryCountRef  = useRef(0)
  const retryTimerRef  = useRef(null)
  const pollTimerRef   = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const fetchNotifications = useCallback(async ({ silent = false } = {}) => {
    if (!hydrated || !isAuthenticated) {
      return
    }

    if (isFetchingRef.current) return
    if (blockedRef.current && silent) return
    isFetchingRef.current = true

    if (!silent) setLoading(true)
    setError(null)

    try {
      const res = await getMyNotifications({ page: 1, limit: PAGE_LIMIT })
      const list =
        res?.data?.notifications ||
        res?.notifications ||
        res?.data ||
        []

      const safeList = Array.isArray(list) ? list : []
      setNotifications(safeList.map(normalize))
      setLastFetchedAt(new Date())
      retryCountRef.current = 0

    } catch (err) {
      const isPermissionError =
        err?.status === 401 ||
        err?.status === 403 ||
        /permission|forbidden|unauthorized/i.test(String(err?.message || ''))

      if (isPermissionError) {
        blockedRef.current = true
        setError('Notifications are not available for this account.')
        return
      }

      setError(err.message)

      const delay = RETRY_DELAYS_MS[retryCountRef.current] ?? null
      if (delay !== null) {
        retryCountRef.current += 1
        retryTimerRef.current = setTimeout(() => fetchNotifications({ silent }), delay)
      }

    } finally {
      if (!silent) setLoading(false)
      isFetchingRef.current = false
    }
  }, [hydrated, isAuthenticated])

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated) {
      setNotifications([])
      setError(null)
      setLoading(false)
      return
    }

    fetchNotifications({ silent: false })
  }, [fetchNotifications, hydrated, isAuthenticated])

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return
    pollTimerRef.current = setInterval(() => {
      fetchNotifications({ silent: true })
    }, POLL_INTERVAL_MS)
    return () => clearInterval(pollTimerRef.current)
  }, [fetchNotifications, hydrated, isAuthenticated])

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchNotifications({ silent: true })
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [fetchNotifications, hydrated, isAuthenticated])

  useEffect(() => {
    if (!hydrated || !isAuthenticated) return
    const handleFocus = () => fetchNotifications({ silent: true })
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchNotifications, hydrated, isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) return
    blockedRef.current = false
    retryCountRef.current = 0
    clearTimeout(retryTimerRef.current)
    clearInterval(pollTimerRef.current)
  }, [isAuthenticated])

  useEffect(() => {
    return () => {
      clearInterval(pollTimerRef.current)
      clearTimeout(retryTimerRef.current)
    }
  }, [])

  const readNotification = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
    try {
      await markAsRead(id)
    } catch (err) {
      console.warn('markAsRead skipped:', err.message)
    }
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllAsRead()
    } catch (err) {
      console.warn('markAllAsRead failed:', err.message)
    }
  }, [])

  const refresh = useCallback(() => {
    blockedRef.current    = false
    retryCountRef.current = 0
    clearTimeout(retryTimerRef.current)
    return fetchNotifications({ silent: false })
  }, [fetchNotifications])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        lastFetchedAt,
        readNotification,
        markAllRead,
        refresh,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}
