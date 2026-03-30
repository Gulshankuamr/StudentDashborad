import { API_BASE_URL } from './api'

const URLS = {
  admin: {
    getNotifications: '/schooladmin/getMyNotifications',
    markAllRead: '/schooladmin/markAllAsRead',
  },
  student: {
    getNotifications: '/student/getMyNotifications',
    markAllRead: '/student/markAllAsRead',
  },
}

const getRole = () => {
  try {
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    const role = (user?.role || '').toLowerCase()

    if (role.includes('student')) return 'student'
    return 'admin'
  } catch {
    return 'admin'
  }
}

const fetchJson = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token')

  if (!token) {
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (res.status === 401) {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    const err = new Error('Unauthorized')
    err.status = 401
    throw err
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || 'API Error')
  }

  return data
}

export const getMyNotifications = ({ page = 1, limit = 50 } = {}) => {
  const role = getRole()
  const endpoint = URLS[role].getNotifications

  const user = JSON.parse(sessionStorage.getItem('user') || '{}')

  const params = {
    page: String(page),
    limit: String(limit),
  }

  // Add student_id only for student role
  if (role === 'student' && user?.student_id) {
    params.student_id = user.student_id
  }

  const qs = new URLSearchParams(params).toString()

  return fetchJson(`${endpoint}?${qs}`, { method: 'GET' })
}

export const markAllAsRead = () => {
  const role = getRole()

  return fetchJson(URLS[role].markAllRead, {
    method: 'PUT',
    body: JSON.stringify({}),
  })
}

export const markAsRead = (id) => Promise.resolve({ success: true, id })