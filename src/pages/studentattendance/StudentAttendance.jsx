// src/pages/student/studentattendance/StudentAttendance.jsx
import { useEffect, useState, useMemo } from 'react'
import { attendanceService } from '../../services/attendanceService/attendanceService'
// ↑ File path: src/services/attendanceService/attendanceService.js
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  Briefcase,
  Download,
  Plus,
  Clock,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_LABELS = ['SUN','MON','TUE','WED','THU','FRI','SAT']

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const toDateKey = (iso) => {
  // API returns "2026-03-23T18:30:00.000Z"
  // We normalise to local YYYY-MM-DD
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

const formatShort = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })
}

const getDayName = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US',{ weekday:'long' })
}

const buildCalendarGrid = (year, month) => {
  const firstDow  = new Date(year, month, 1).getDay()
  const daysTotal = new Date(year, month+1, 0).getDate()
  const grid = []
  let week = Array(firstDow).fill(null)
  for (let d = 1; d <= daysTotal; d++) {
    week.push(d)
    if (week.length === 7) { grid.push(week); week = [] }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    grid.push(week)
  }
  return grid
}

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────
const SmallStatCard = ({ icon: Icon, iconBg, iconColor, label, value, valueColor }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-xs text-gray-400 font-medium leading-none mb-1">{label}</p>
      <p className={`text-2xl font-extrabold leading-none ${valueColor}`}>{value}</p>
    </div>
  </div>
)

const CalendarDot = ({ day, status, isToday }) => {
  if (day === null) return <div className="h-10" />

  let circleClass = 'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mx-auto'

  if (status === 'P')       circleClass += ' bg-[#1e4d72] text-white'
  else if (status === 'A')  circleClass += ' bg-red-500 text-white'
  else if (isToday)         circleClass += ' bg-blue-600 text-white'
  else                      circleClass += ' text-gray-700'

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={circleClass}>{day}</div>
      {/* dot under present days (like design) */}
      {status === 'P' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#1e4d72]" />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────
const StudentAttendance = () => {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [showAll, setShowAll] = useState(false)

  const today    = new Date()
  const [calYear,  setCalYear]  = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  // ── Fetch ─────────────────────────────────────────────────────
  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await attendanceService.getStudentAttendance()
      // Service returns full response: { success, message, data: [...] }
      setData(res.data || [])
    } catch (err) {
      setError(err.message || 'Failed to load attendance.')
    } finally {
      setLoading(false)
    }
  }

  // ── Derived stats ─────────────────────────────────────────────
  const present = useMemo(() => data.filter(d => d.status === 'P').length, [data])
  const absent  = useMemo(() => data.filter(d => d.status === 'A').length, [data])
  const leaves  = useMemo(() => data.filter(d => d.status === 'L').length, [data])
  const total   = data.length
  const percent = total ? ((present / total) * 100).toFixed(1) : '0.0'

  // ── Date range label ──────────────────────────────────────────
  const sorted = useMemo(() =>
    [...data].sort((a,b) => new Date(a.attendance_date) - new Date(b.attendance_date))
  , [data])
  const rangeLabel = sorted.length
    ? `${formatShort(sorted[0].attendance_date)} - ${formatShort(sorted[sorted.length-1].attendance_date)}`
    : ''

  // ── Status lookup map { "YYYY-MM-DD": "P"|"A"|"L" } ──────────
  const statusMap = useMemo(() => {
    const map = {}
    data.forEach(d => { if (d.attendance_date) map[toDateKey(d.attendance_date)] = d.status })
    return map
  }, [data])

  // ── Calendar ──────────────────────────────────────────────────
  const grid = useMemo(() => buildCalendarGrid(calYear, calMonth), [calYear, calMonth])

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y-1) }
    else setCalMonth(m => m-1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y+1) }
    else setCalMonth(m => m+1)
  }

  // ── Logs (newest first) ───────────────────────────────────────
  const logs = useMemo(() =>
    [...data].sort((a,b) => new Date(b.attendance_date) - new Date(a.attendance_date))
  , [data])
  const visibleLogs = showAll ? logs : logs.slice(0, 6)

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className="flex h-screen overflow-hidden bg-[#f0f2f8]"
      style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif" }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">

          {/* ── Top Bar ─────────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Month selector pill */}
            <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
              {MONTH_NAMES[calMonth]} {calYear}
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-90" />
            </button>

            {/* Date range pill */}
            {rangeLabel && (
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-500 shadow-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                {rangeLabel}
              </div>
            )}

            <div className="flex-1" />

            {/* Export */}
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-5 py-2 shadow-sm transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* ── Loading ─────────────────────────────────────── */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* ── Error ───────────────────────────────────────── */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm mb-6">
              ⚠️ {error}
              <button onClick={fetchData} className="ml-3 underline font-semibold">Retry</button>
            </div>
          )}

          {/* ── Main Content ─────────────────────────────────── */}
          {!loading && !error && (
            <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-6">

              {/* ═══════════ LEFT COLUMN ════════════ */}
              <div className="flex flex-col gap-4">

                {/* Attendance Rate Card */}
                <div
                  className="rounded-2xl p-5 text-white shadow-md relative overflow-hidden"
                  style={{ background: 'linear-gradient(145deg,#1e4d72 0%,#0f2d45 100%)' }}
                >
                  {/* Background dot pattern */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.07]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                      backgroundSize: '18px 18px',
                    }}
                  />
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">
                    Attendance Rate
                  </p>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-5xl font-black tracking-tight">{percent}%</span>
                    <TrendingUp className="w-5 h-5 text-blue-300 mb-1.5" />
                  </div>
                  <p className="text-[11px] text-blue-200 leading-relaxed">
                    {parseFloat(percent) >= 75
                      ? 'You have maintained a consistent presence this month. Keep it up to stay above the 75% threshold.'
                      : 'Your attendance is below the 75% threshold. Please attend more classes.'}
                  </p>
                </div>

                {/* Stat grid: 2×2 */}
                <div className="grid grid-cols-2 gap-3">
                  <SmallStatCard
                    icon={Calendar}      iconBg="bg-blue-50"   iconColor="text-blue-500"
                    label="Total Days"   value={total}         valueColor="text-gray-900"
                  />
                  <SmallStatCard
                    icon={CheckCircle2}  iconBg="bg-green-50"  iconColor="text-green-500"
                    label="Present"      value={present}       valueColor="text-green-600"
                  />
                  <SmallStatCard
                    icon={XCircle}       iconBg="bg-red-50"    iconColor="text-red-500"
                    label="Absent"       value={absent}        valueColor="text-red-500"
                  />
                  <SmallStatCard
                    icon={Briefcase}     iconBg="bg-amber-50"  iconColor="text-amber-500"
                    label="Leaves"       value={leaves}        valueColor="text-amber-500"
                  />
                </div>
              </div>

              {/* ═══════════ RIGHT COLUMN ════════════ */}
              <div className="flex flex-col gap-5">

                {/* ── Calendar Card ─────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  {/* Calendar header */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold text-gray-800">
                      {MONTH_NAMES[calMonth]} {calYear}
                    </h2>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={prevMonth}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 mb-3">
                    {DAY_LABELS.map(d => (
                      <div key={d} className="text-center text-[10px] font-bold text-gray-400 tracking-wider">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Week rows */}
                  <div className="flex flex-col gap-2">
                    {grid.map((week, wi) => (
                      <div key={wi} className="grid grid-cols-7">
                        {week.map((day, di) => {
                          if (day === null) return <div key={di} className="h-10" />
                          const key = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                          const isToday =
                            day === today.getDate() &&
                            calMonth === today.getMonth() &&
                            calYear === today.getFullYear()
                          return (
                            <CalendarDot
                              key={di}
                              day={day}
                              status={statusMap[key]}
                              isToday={isToday}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100">
                    {[
                      { bg: 'bg-[#1e4d72]', label: 'Present' },
                      { bg: 'bg-red-500',   label: 'Absent'  },
                      { bg: 'bg-blue-600',  label: 'Today'   },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${l.bg}`} />
                        <span className="text-xs text-gray-500">{l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Detailed Logs ─────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-bold text-gray-800">Detailed Logs</h2>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        Showing {visibleLogs.length} of {logs.length} entries
                      </span>
                      <button className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center shadow transition-colors">
                        <Plus className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>

                  {logs.length === 0 ? (
                    <div className="text-center py-14 text-gray-400 text-sm">
                      No attendance records found.
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr>
                              {['DATE','DAY','STATUS','REMARKS'].map(h => (
                                <th key={h} className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest pr-6 border-b border-gray-100">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {visibleLogs.map((item) => {
                              const isP = item.status === 'P'
                              const isL = item.status === 'L'
                              const remarkLower = (item.remarks || '').toLowerCase()
                              const isMedical = remarkLower.includes('leave') || remarkLower.includes('medical')

                              return (
                                <tr
                                  key={item.attendance_id}
                                  className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors"
                                >
                                  {/* Date */}
                                  <td className="py-3.5 pr-6 text-sm font-semibold text-gray-800 whitespace-nowrap">
                                    {formatShort(item.attendance_date)}
                                  </td>

                                  {/* Day */}
                                  <td className="py-3.5 pr-6 text-sm text-gray-500 whitespace-nowrap">
                                    {getDayName(item.attendance_date)}
                                  </td>

                                  {/* Status badge */}
                                  <td className="py-3.5 pr-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                      isP ? 'bg-green-100 text-green-700'
                                      : isL ? 'bg-amber-100 text-amber-700'
                                      : 'bg-red-100 text-red-600'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                        isP ? 'bg-green-500' : isL ? 'bg-amber-500' : 'bg-red-500'
                                      }`} />
                                      {isP ? 'Present' : isL ? 'Leave' : 'Absent'}
                                    </span>
                                  </td>

                                  {/* Remarks */}
                                  <td className="py-3.5 text-sm text-gray-500">
                                    {item.remarks ? (
                                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                                        isMedical
                                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                          : 'text-gray-500'
                                      }`}>
                                        {item.remarks}
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-gray-400 text-xs">
                                        <Clock className="w-3 h-3" />
                                        On Time
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* View more / less */}
                      {logs.length > 6 && (
                        <div className="text-center mt-5 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => setShowAll(p => !p)}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
                          >
                            {showAll
                              ? '↑ Show Less'
                              : `View Older Records ↓`}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default StudentAttendance