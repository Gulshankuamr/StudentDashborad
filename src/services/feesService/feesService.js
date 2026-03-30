// src/services/feesService/feesService.js
import { API_BASE_URL, getAuthToken } from '../api'

/**
 * Fees service for student-side fees data.
 *
 * API endpoint:
 *   GET /api/student/getStudentFeesStudentSide?academic_year=2026-27
 *   Auth: Bearer Token
 *
 * Response shape:
 * {
 *   "success": true,
 *   "data": {
 *     "student_info": { ... },
 *     "current_academic_year": "2026-27",
 *     "fee_breakdown": [ { ...installments[] } ],
 *     "transport_fee_breakdown": [ { ...installments[] } ],
 *     "payment_history": [ ... ],
 *     "summary": {
 *       "current_year": { total, paid, pending, fine },
 *       "grand_total_pending": 600,
 *       "grand_total_fine": 100
 *     }
 *   }
 * }
 */
export const feesService = {

  // ── GET STUDENT FEES ─────────────────────────────────────────
  // GET /api/student/getStudentFeesStudentSide?academic_year=2026-27
  getStudentFees: async () => {
    const token = getAuthToken()
    if (!token) throw new Error('Token missing')

    const user = JSON.parse(sessionStorage.getItem('user') || '{}')

    // Use academic_year from session OR fallback to current_academic_year from API
    const academicYear = user?.academic_year || '2026-27'

    const qs = new URLSearchParams({
      academic_year: academicYear,
    }).toString()

    const response = await fetch(
      `${API_BASE_URL}/student/getStudentFeesStudentSide?${qs}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await response.json()

    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to fetch fees')
    }

    return data
  },
}