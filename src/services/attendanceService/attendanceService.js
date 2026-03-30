// src/services/attendanceService/attendanceService.js
import { API_BASE_URL, getAuthToken } from '../api'

export const attendanceService = {

  // ── GET STUDENT ATTENDANCE ───────────────────────────────────
  // GET /api/student/getStudentAttendanceForStudentSide
  // Auth: Bearer Token (auto from getAuthToken)
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