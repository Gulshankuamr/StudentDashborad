// src/services/homeWorkService/homeworkService.js
import { API_BASE_URL, getAuthToken } from '../api'

export const homeworkService = {

  // ── GET STUDENT HOMEWORK ─────────────────────────────────────
  // GET /api/student/getStudentHomeworkSubjectWise?student_id=278&class_id=142&section_id=205
  getStudentHomework: async () => {
    const token = getAuthToken()
    if (!token) throw new Error('Token missing')

    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    if (!user?.student_id) throw new Error('student_id missing from session')
    if (!user?.class_id) throw new Error('class_id missing from session')
    if (!user?.section_id) throw new Error('section_id missing from session')

    const qs = new URLSearchParams({
      student_id: user.student_id,
      class_id: user.class_id,
      section_id: user.section_id,
    }).toString()

    const response = await fetch(
      `${API_BASE_URL}/student/getStudentHomeworkSubjectWise?${qs}`,
      {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const data = await response.json()

    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to fetch homework')
    }

    return data
  },

  // ── SUBMIT HOMEWORK ──────────────────────────────────────────
  // POST /api/student/submitHomework
  // FormData fields:
  //   homework_id : number
  //   attachment  : File   ← ✅ API expects "attachment" (NOT "file")
  //   remarks     : string (optional)
  submitHomework: async ({ homework_id, file, remarks }) => {
    const token = getAuthToken()
    if (!token)      throw new Error('Token missing')
    if (!homework_id) throw new Error('homework_id is required')
    if (!file)        throw new Error('file is required')

    const formData = new FormData()
    formData.append('homework_id', homework_id)
    formData.append('attachment', file)          // ✅ FIXED: was 'file', API needs 'attachment'
    if (remarks) formData.append('remarks', remarks)

    const response = await fetch(
      `${API_BASE_URL}/student/submitHomework`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // ❌ DO NOT set Content-Type — browser sets multipart/form-data + boundary automatically
        },
        body: formData,
      }
    )

    const data = await response.json()

    if (!response.ok || data.success !== true) {
      throw new Error(data?.message || 'Failed to submit homework')
    }

    return data
  },
}