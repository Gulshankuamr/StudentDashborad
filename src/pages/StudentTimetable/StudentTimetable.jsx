import { useEffect, useMemo, useState } from 'react'
import { API_BASE_URL, getAuthToken } from '../../services/api'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'

const timetableApi = {
  async get(path) {
    const token = getAuthToken()
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || `Error ${response.status}`)
    return data
  },
}

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const formatTime = (time) => {
  if (!time) return ''
  const [hourRaw, minute] = time.split(':')
  const hour = Number(hourRaw)
  return `${hour % 12 || 12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`
}

const StudentTimetable = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedDay, setSelectedDay] = useState('')
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState({ initial: true, sections: false, timetable: false })
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const [classRes, subjectRes, teacherRes] = await Promise.all([
          timetableApi.get('/schooladmin/getAllClassList'),
          timetableApi.get('/schooladmin/getAllSubjects'),
          timetableApi.get('/schooladmin/getTotalTeachersListBySchoolId'),
        ])
        setClasses(classRes.data || [])
        setSubjects(subjectRes.data || [])
        setTeachers(teacherRes.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load timetable data.')
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }))
      }
    })()
  }, [])

  useEffect(() => {
    if (!selectedClass) {
      setSections([])
      setSelectedSection('')
      setTimetable([])
      return
    }

    ;(async () => {
      setLoading((prev) => ({ ...prev, sections: true }))
      try {
        const response = await timetableApi.get(`/schooladmin/getAllSections?class_id=${selectedClass}`)
        setSections(response.data || [])
      } catch (err) {
        setError(err.message || 'Failed to load sections.')
      } finally {
        setLoading((prev) => ({ ...prev, sections: false }))
      }
    })()
  }, [selectedClass])

  const fetchTimetable = async () => {
    if (!selectedClass || !selectedSection) return
    setLoading((prev) => ({ ...prev, timetable: true }))
    setError('')

    try {
      const response = await timetableApi.get(
        `/schooladmin/getTimetable?class_id=${selectedClass}&section_id=${selectedSection}`
      )
      setTimetable(response.data || [])
    } catch (err) {
      setTimetable([])
      setError(err.message || 'Failed to load timetable.')
    } finally {
      setLoading((prev) => ({ ...prev, timetable: false }))
    }
  }

  useEffect(() => {
    fetchTimetable()
  }, [selectedClass, selectedSection])

  const getName = (list, idKey, labelKey, id) => list.find((item) => item[idKey] == id)?.[labelKey] || 'N/A'
  const getSubjectName = (id) => getName(subjects, 'subject_id', 'subject_name', id)
  const getTeacherName = (id) => getName(teachers, 'teacher_id', 'name', id)

  const groupedByDay = useMemo(() => {
    const grouped = timetable.reduce((acc, period) => {
      if (!acc[period.day_of_week]) acc[period.day_of_week] = []
      acc[period.day_of_week].push(period)
      return acc
    }, {})

    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => a.start_time.localeCompare(b.start_time))
    })

    return grouped
  }, [timetable])

  const orderedDays = DAY_ORDER.filter((day) => groupedByDay[day]?.length)
  const visibleDays = selectedDay ? [selectedDay] : orderedDays

  return (
    <div className="flex h-screen overflow-hidden bg-[#f3f4f6]" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900">School Timetable</h1>
            <p className="text-sm text-gray-500 mt-1">View your class schedule by day and period.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={loading.initial}
              >
                <option value="">Select class</option>
                {classes.map((item) => (
                  <option key={item.class_id} value={item.class_id}>
                    {item.class_name}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass || loading.sections}
              >
                <option value="">Select section</option>
                {sections.map((item) => (
                  <option key={item.section_id} value={item.section_id}>
                    {item.section_name}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                disabled={!timetable.length}
              >
                <option value="">All days</option>
                {orderedDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <button
                onClick={fetchTimetable}
                disabled={!selectedClass || !selectedSection || loading.timetable}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold bg-gray-50 disabled:opacity-50"
              >
                {loading.timetable ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading.initial ? (
            <div className="text-sm text-gray-500">Loading...</div>
          ) : !selectedClass || !selectedSection ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
              Select class and section to load timetable.
            </div>
          ) : timetable.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
              No timetable found for selected class/section.
            </div>
          ) : (
            <div className="space-y-4">
              {visibleDays.map((day) => (
                <section key={day} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-800">{day}</h2>
                    <span className="text-xs font-semibold text-gray-500">
                      {groupedByDay[day].length} period{groupedByDay[day].length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {groupedByDay[day].map((period) => (
                      <div
                        key={period.timetable_id}
                        className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-center justify-between gap-4"
                      >
                        <div className="text-sm font-semibold text-violet-700 min-w-[170px]">
                          {formatTime(period.start_time)} - {formatTime(period.end_time)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {getSubjectName(period.subject_id)}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {getTeacherName(period.teacher_id)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default StudentTimetable
