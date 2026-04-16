// src/services/attendanceService/attendanceService.js
import { API_BASE_URL, getAuthToken } from '../api'

export const attendanceService = {

 
  getStudentAttendance: async () => {
    const token = getAuthToken()
    if (!token) throw new Error('Token missing')

    const response = await fetch(
      `${API_BASE_URL}/student/getStudentAttendanceForStudentSide`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to fetch attendance')
    }

    return data
  },
}