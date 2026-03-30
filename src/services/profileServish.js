// src/services/profileServish.js
import { API_BASE_URL, getAuthToken } from './api'

export const profileService = {

  // ════════════════════════════════
  // GET MY PROFILE (general - all roles)
  // GET /api/profile
  // ════════════════════════════════
  getProfile: async () => {
    const token = getAuthToken()
    if (!token) throw new Error('Token missing')

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await response.json()
    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to fetch profile')
    }
    return data
  },

  // ════════════════════════════════
  // GET STUDENT DETAILS (student side)
  // GET /api/student/getStudentDetailsByIdStudentSide?student_id=278
  // Response: { success, message, data: { student_id, name, dob, ... } }
  // ════════════════════════════════
  getStudentDetails: async () => {
    const token = getAuthToken()
    if (!token) throw new Error('Token missing')

    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    if (!user?.student_id) throw new Error('student_id missing from session')

    const response = await fetch(
      `${API_BASE_URL}/student/getStudentDetailsByIdStudentSide?student_id=${user.student_id}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const data = await response.json()
    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to fetch student details')
    }
    return data // { success, message, data: { ...studentFields } }
  },

  // ════════════════════════════════
  // UPDATE PROFILE
  // PUT /api/profile
  // Body: { name, phone, address }
  // ════════════════════════════════
  updateProfile: async (payload) => {
    const token = getAuthToken()
    if (!token) throw new Error('Token missing')

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to update profile')
    }
    return data
  },

  // ════════════════════════════════
  // CHANGE PASSWORD
  // POST /api/profile/change-password
  // Body: { current_password, new_password }
  // ════════════════════════════════
  changePassword: async ({ current_password, new_password }) => {
    const token = getAuthToken()
    if (!token) throw new Error('Token missing')

    const response = await fetch(`${API_BASE_URL}/profile/change-password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ current_password, new_password }),
    })

    const data = await response.json()
    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to change password')
    }
    return data
  },
}