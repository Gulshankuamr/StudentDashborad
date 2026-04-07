// src/pages/student/studentattendance/StudentAttendance.jsx
import { useEffect, useState, useMemo } from 'react'
import { attendanceService } from '../../services/attendanceService/attendanceService'
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
  Clock,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_LABELS = ['SUN','MON','TUE','WED','THU','FRI','SAT']

const STATUS_OPTIONS = [
  { value: 'ALL',     label: 'All Status' },
  { value: 'P',       label: 'Present'    },
  { value: 'A',       label: 'Absent'     },
  { value: 'L',       label: 'Leave'      },
]

const MONTH_OPTIONS = [
  { value: 'ALL', label: 'All Months' },
  ...MONTH_NAMES.map((m, i) => ({ value: i, label: m })),
]

const LOGS_PER_PAGE = 5

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const toDateKey = (iso) => {
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
const SmallStatCard = ({ icon: Icon, iconBg, iconColor, label, value, valueColor, accent }) => (
  <div
    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 relative overflow-hidden group hover:shadow-md transition-all duration-300"
  >
    {/* subtle accent stripe on left */}
    <div className={`absolute left-0 top-4 bottom-4 w-0.5 rounded-full ${accent}`} />
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg} group-hover:scale-110 transition-transform duration-300`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider leading-none mb-1">{label}</p>
      <p className={`text-2xl font-black leading-none ${valueColor}`}>{value}</p>
    </div>
  </div>
)

const CalendarDot = ({ day, status, isToday }) => {
  if (day === null) return <div className="h-10" />
  let circleClass = 'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold mx-auto transition-all duration-200'
  if (status === 'P')       circleClass += ' bg-[#1e4d72] text-white shadow-sm shadow-blue-900/30'
  else if (status === 'A')  circleClass += ' bg-red-500 text-white shadow-sm shadow-red-400/30'
  else if (status === 'L')  circleClass += ' bg-amber-400 text-white shadow-sm shadow-amber-400/30'
  else if (isToday)         circleClass += ' bg-blue-600 text-white ring-2 ring-blue-300'
  else                      circleClass += ' text-gray-600 hover:bg-gray-100'

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={circleClass}>{day}</div>
      {status === 'P' && <span className="w-1.5 h-1.5 rounded-full bg-[#1e4d72]" />}
      {status === 'A' && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
      {status === 'L' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
    </div>
  )
}

// Custom Dropdown component
const CustomDropdown = ({ options, value, onChange, icon: Icon }) => {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-gray-700 hover:border-blue-400 hover:shadow-sm transition-all duration-200 min-w-[140px]"
      >
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
        <span className="flex-1 text-left">{selected?.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1.5 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-lg z-20 overflow-hidden py-1">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                  opt.value === value
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 font-medium'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
      <p className="text-xs text-gray-400 font-medium">
        Page <span className="font-bold text-gray-600">{currentPage}</span> of <span className="font-bold text-gray-600">{totalPages}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 ${
              page === currentPage
                ? 'bg-[#1e4d72] text-white shadow-sm shadow-blue-900/30'
                : 'border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
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

  // Filters
  const [searchQuery,    setSearchQuery]    = useState('')
  const [statusFilter,   setStatusFilter]   = useState('ALL')
  const [monthFilter,    setMonthFilter]    = useState('ALL')

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)

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
  const isGood  = parseFloat(percent) >= 75

  // ── Status lookup map ─────────────────────────────────────────
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

  // ── Filtered + sorted logs ────────────────────────────────────
  const filteredLogs = useMemo(() => {
    let logs = [...data].sort((a,b) => new Date(b.attendance_date) - new Date(a.attendance_date))

    // Status filter
    if (statusFilter !== 'ALL') {
      logs = logs.filter(l => l.status === statusFilter)
    }

    // Month filter
    if (monthFilter !== 'ALL') {
      logs = logs.filter(l => new Date(l.attendance_date).getMonth() === monthFilter)
    }

    // Search filter (date string match)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      logs = logs.filter(l =>
        formatShort(l.attendance_date).toLowerCase().includes(q) ||
        getDayName(l.attendance_date).toLowerCase().includes(q) ||
        (l.remarks || '').toLowerCase().includes(q)
      )
    }

    return logs
  }, [data, statusFilter, monthFilter, searchQuery])

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1) }, [statusFilter, monthFilter, searchQuery])

  const totalPages  = Math.max(1, Math.ceil(filteredLogs.length / LOGS_PER_PAGE))
  const visibleLogs = filteredLogs.slice(
    (currentPage - 1) * LOGS_PER_PAGE,
    currentPage * LOGS_PER_PAGE
  )

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div
      className="flex h-screen overflow-hidden bg-[#eef1f8]"
      style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif" }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">

          {/* ── Page Header ─────────────────────────────────── */}
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Attendance Overview</h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Track your presence, absences and leaves</p>
            </div>
            <div className="flex-1" />
            <button className="flex items-center gap-2 bg-[#1e4d72] hover:bg-[#163a56] text-white text-sm font-bold rounded-xl px-5 py-2.5 shadow-md shadow-blue-900/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/30 hover:-translate-y-0.5">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>

          {/* ── Loading ─────────────────────────────────────── */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="w-9 h-9 border-4 border-[#1e4d72] border-t-transparent rounded-full animate-spin" />
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
            <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">

              {/* ═══════════ LEFT COLUMN ════════════ */}
              <div className="flex flex-col gap-4">

                {/* Attendance Rate Card — premium glass look */}
                <div
                  className="rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                  style={{ background: 'linear-gradient(145deg,#1e4d72 0%,#0d2236 100%)' }}
                >
                  {/* decorative circles */}
                  <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
                  <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/5" />
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.05]"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  <div className="relative">
                    <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-3">
                      Attendance Rate
                    </p>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-6xl font-black tracking-tighter leading-none">{percent}</span>
                      <span className="text-2xl font-black text-blue-300 mb-1">%</span>
                      <TrendingUp className={`w-5 h-5 mb-2 ml-1 ${isGood ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 mb-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${isGood ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    {/* 75% marker label */}
                    <div className="flex items-center justify-between text-[10px] text-blue-300 font-semibold mb-3">
                      <span>0%</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isGood ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {isGood ? '✓ Above threshold' : '✗ Below threshold'}
                      </span>
                      <span>100%</span>
                    </div>
                    <p className="text-[11px] text-blue-200 leading-relaxed">
                      {isGood
                        ? 'Great consistency! You are above the 75% required threshold.'
                        : 'Your attendance is below the 75% threshold. Please attend more classes.'}
                    </p>
                  </div>
                </div>

                {/* Stat grid: 2×2 */}
                <div className="grid grid-cols-2 gap-3">
                  <SmallStatCard
                    icon={Calendar}     iconBg="bg-blue-50"   iconColor="text-blue-500"
                    label="Total Days"  value={total}         valueColor="text-gray-900"
                    accent="bg-blue-400"
                  />
                  <SmallStatCard
                    icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-500"
                    label="Present"     value={present}        valueColor="text-emerald-600"
                    accent="bg-emerald-400"
                  />
                  <SmallStatCard
                    icon={XCircle}      iconBg="bg-red-50"    iconColor="text-red-500"
                    label="Absent"      value={absent}         valueColor="text-red-500"
                    accent="bg-red-400"
                  />
                  <SmallStatCard
                    icon={Briefcase}    iconBg="bg-amber-50"  iconColor="text-amber-500"
                    label="Leaves"      value={leaves}         valueColor="text-amber-500"
                    accent="bg-amber-400"
                  />
                </div>

                {/* Quick status legend card */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Legend</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { bg: 'bg-[#1e4d72]', label: 'Present',  desc: 'Attended class' },
                      { bg: 'bg-red-500',   label: 'Absent',   desc: 'Missed class'   },
                      { bg: 'bg-amber-400', label: 'Leave',    desc: 'Approved leave'  },
                      { bg: 'bg-blue-600',  label: 'Today',    desc: 'Current date'    },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${l.bg}`} />
                        <span className="text-xs font-bold text-gray-700">{l.label}</span>
                        <span className="text-[10px] text-gray-400 ml-auto">{l.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ═══════════ RIGHT COLUMN ════════════ */}
              <div className="flex flex-col gap-5">

                {/* ── Calendar Card ─────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-black text-gray-900">
                        {MONTH_NAMES[calMonth]} {calYear}
                      </h2>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Monthly view</p>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
                      <button
                        onClick={prevMonth}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:shadow-sm transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:shadow-sm transition-all duration-200"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-3">
                    {DAY_LABELS.map(d => (
                      <div key={d} className="text-center text-[10px] font-black text-gray-400 tracking-widest">
                        {d}
                      </div>
                    ))}
                  </div>

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
                            <CalendarDot key={di} day={day} status={statusMap[key]} isToday={isToday} />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Detailed Logs ─────────────────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

                  {/* Header + Filters */}
                  <div className="flex flex-wrap items-start gap-3 mb-5">
                    <div>
                      <h2 className="text-base font-black text-gray-900">Detailed Logs</h2>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                        {filteredLogs.length} record{filteredLogs.length !== 1 ? 's' : ''} found
                      </p>
                    </div>

                    <div className="flex-1" />

                    {/* Search input */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search date, day, remarks…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-xl w-52 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-200 bg-gray-50 placeholder:text-gray-400"
                      />
                    </div>

                    {/* Status dropdown */}
                    <CustomDropdown
                      options={STATUS_OPTIONS}
                      value={statusFilter}
                      onChange={setStatusFilter}
                      icon={Filter}
                    />

                    {/* Month dropdown */}
                    <CustomDropdown
                      options={MONTH_OPTIONS}
                      value={monthFilter}
                      onChange={setMonthFilter}
                      icon={Calendar}
                    />
                  </div>

                  {/* Table */}
                  {filteredLogs.length === 0 ? (
                    <div className="text-center py-14">
                      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-bold text-gray-500">No records found</p>
                      <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search query</p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 rounded-xl">
                              {['Date','Day','Status','Remarks'].map((h, i) => (
                                <th
                                  key={h}
                                  className={`py-2.5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 ${
                                    i === 0 ? 'pl-3 rounded-l-lg' : 'pl-0'
                                  } pr-6 ${i === 3 ? 'rounded-r-lg' : ''}`}
                                >
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
                                  className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors duration-150 group"
                                >
                                  {/* Date */}
                                  <td className="py-3.5 pl-3 pr-6 text-sm font-bold text-gray-800 whitespace-nowrap">
                                    {formatShort(item.attendance_date)}
                                  </td>

                                  {/* Day */}
                                  <td className="py-3.5 pr-6 text-sm text-gray-400 font-medium whitespace-nowrap">
                                    {getDayName(item.attendance_date)}
                                  </td>

                                  {/* Status badge */}
                                  <td className="py-3.5 pr-6">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                                      isP ? 'bg-emerald-100 text-emerald-700'
                                      : isL ? 'bg-amber-100 text-amber-700'
                                      : 'bg-red-100 text-red-600'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                        isP ? 'bg-emerald-500' : isL ? 'bg-amber-500' : 'bg-red-500'
                                      }`} />
                                      {isP ? 'Present' : isL ? 'Leave' : 'Absent'}
                                    </span>
                                  </td>

                                  {/* Remarks */}
                                  <td className="py-3.5 text-sm text-gray-500">
                                    {item.remarks ? (
                                      <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold ${
                                        isMedical
                                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}>
                                        {item.remarks}
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1 text-gray-400 text-xs font-medium">
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

                      {/* Pagination */}
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
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