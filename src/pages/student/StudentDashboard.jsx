// src/pages/student/StudentDashboard.jsx
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { profileService } from '../../services/profileServish'
import { attendanceService } from '../../services/attendanceService/attendanceService'
import { feesService } from '../../services/feesService/feesService'
import {
  CalendarCheck2, CreditCard, Clock3, AlertTriangle,
  ChevronRight, ArrowRight, MessageSquare, Phone,
  Droplets, Tag, BookOpen, Activity,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
const fmtAmt  = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`
const fmtDate = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}
const fmtTime = (iso) => {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

// static recent activities (can be replaced by API)
const STATIC_ACTIVITIES = [
  {
    title:  'Math Assignment Submitted',
    sub:    'Chapter 4: Algebra exercises completed.',
    time:   '10:30 AM',
    timeLabel: '10:30 AM',
  },
  {
    title:  'Library Book Due Tomorrow',
    sub:    '"Introduction to Physics" needs to be returned.',
    time:   'Yesterday',
    timeLabel: 'Yesterday',
  },
  {
    title:  'Fee Installment Paid',
    sub:    'Term 1 Tuition Fee - ₹700 successful.',
    time:   'Oct 18',
    timeLabel: 'Oct 18',
  },
]

// static instructors
const INSTRUCTORS = [
  { name: 'Mrs. Sarah Jenkins', role: 'Class Teacher / English', color: 'bg-rose-400' },
  { name: 'Mr. David Chen',     role: 'Mathematics',             color: 'bg-slate-500' },
]

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, iconBg, iconColor, label, value, valueColor }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <p className={`text-2xl font-extrabold leading-none ${valueColor}`}>{value}</p>
    <p className="text-xs text-gray-400 font-medium leading-none">{label}</p>
  </div>
)

const AttDot = ({ status }) => (
  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
    ${status === 'P' ? 'bg-green-500' : status === 'A' ? 'bg-red-400' : 'bg-gray-300'}`}>
    {status}
  </div>
)

// ─────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────
export default function StudentDashboard() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'Student'
  const dateStr   = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const [student,    setStudent]    = useState(null)
  const [attendance, setAttendance] = useState([])
  const [feeSummary, setFeeSummary] = useState({ total: 0, paid: 0, pending: 0, fine: 0 })
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        // Profile
        const pRes = await profileService.getStudentDetails()
        setStudent(pRes.data || null)
      } catch { /* silent */ }

      try {
        // Attendance (latest 5)
        const aRes = await attendanceService.getStudentAttendance()
        const sorted = [...(aRes.data || [])].sort(
          (a, b) => new Date(b.attendance_date) - new Date(a.attendance_date)
        )
        setAttendance(sorted.slice(0, 5))
      } catch { /* silent */ }

      try {
        // Fees summary
        const fRes = await feesService.getStudentFees()
        const s = fRes.data?.summary?.current_year
        if (s) setFeeSummary({ total: s.total, paid: s.paid, pending: s.pending, fine: s.fine })
      } catch { /* silent */ }

      setLoading(false)
    })()
  }, [])

  const d        = student || {}
  const initials = ((d.name || user?.name || 'ST')
    .split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2))

  const presentCount = attendance.filter(a => a.status === 'P').length
  const absentCount  = attendance.filter(a => a.status === 'A').length
  const feePct       = feeSummary.total ? Math.round((feeSummary.paid / feeSummary.total) * 100) : 0

  const admNo = (d.admission_no || '').replace(/^null-/, '') || '—'

  return (
    <div
      className="flex min-h-screen bg-[#f4f5fb]"
      style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif" }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6 lg:p-7">
          <div className="max-w-[1200px] mx-auto">

            {/* ══ 2-column grid ══════════════════════════════ */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-6">

              {/* ════ LEFT COLUMN ════════════════════════════ */}
              <div className="flex flex-col gap-5">

                {/* Welcome Banner */}
                <div
                  className="relative rounded-2xl overflow-hidden px-7 py-7"
                  style={{ background: 'linear-gradient(130deg,#4f35d2 0%,#6d4fe0 50%,#8a5ff0 100%)', minHeight: 130 }}
                >
                  {/* dot grid */}
                  <div className="absolute inset-0 opacity-[0.08]"
                    style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
                  {/* blobs */}
                  <div className="absolute top-4 right-44 w-4 h-4 rounded-full bg-pink-400 opacity-80" />
                  <div className="absolute top-10 right-32 w-2.5 h-2.5 rounded-full bg-yellow-300 opacity-90" />
                  <div className="absolute bottom-5 right-52 w-3 h-3 rounded-full bg-green-300 opacity-80" />

                  <div className="relative z-10">
                    <p className="text-white/60 text-xs font-medium mb-2">{dateStr}</p>
                    <h2 className="text-white text-2xl font-extrabold leading-tight mb-1">
                      Welcome back, {firstName} 👋
                    </h2>
                    <p className="text-white/65 text-sm font-medium">
                      Track your progress, fees, and stay updated with your classes.
                    </p>
                  </div>
                </div>

                {/* ── Summary Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <SummaryCard
                    icon={CreditCard}    iconBg="bg-violet-100" iconColor="text-violet-600"
                    label="Total Fees"   value={fmtAmt(feeSummary.total)}  valueColor="text-gray-900"
                  />
                  <SummaryCard
                    icon={Activity}      iconBg="bg-green-100"  iconColor="text-green-600"
                    label="Paid Amount"  value={fmtAmt(feeSummary.paid)}   valueColor="text-green-600"
                  />
                  <SummaryCard
                    icon={Clock3}        iconBg="bg-orange-100" iconColor="text-orange-500"
                    label="Pending Amount" value={fmtAmt(feeSummary.pending)} valueColor="text-orange-500"
                  />
                  <SummaryCard
                    icon={AlertTriangle} iconBg="bg-amber-100"  iconColor="text-amber-500"
                    label="Fine / Dues"  value={fmtAmt(feeSummary.fine)}   valueColor="text-amber-500"
                  />
                </div>

                {/* ── Attendance + Fee Progress ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Attendance Overview */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-800">Attendance Overview</h3>
                      <CalendarCheck2 className="w-4 h-4 text-gray-300" />
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-bold text-green-600">
                        Present: {presentCount} Day{presentCount !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs font-bold text-red-500">
                        Absent: {absentCount} Day{absentCount !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-2">
                      Last 5 Days
                    </p>
                    <div className="flex items-center gap-2">
                      {attendance.length === 0
                        ? [null,null,null,null,null].map((_,i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
                          ))
                        : attendance.map((a, i) => (
                            <AttDot key={i} status={a.status} />
                          ))
                      }
                    </div>
                  </div>

                  {/* Fee Progress */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-gray-800">Fee Progress</h3>
                      <Clock3 className="w-4 h-4 text-gray-300" />
                    </div>

                    <div className="flex items-end justify-between mb-2">
                      <p className="text-xl font-extrabold text-gray-900">
                        {fmtAmt(feeSummary.paid)}
                        <span className="text-sm font-semibold text-gray-400 ml-1">
                          / {fmtAmt(feeSummary.total)}
                        </span>
                      </p>
                      <p className="text-sm font-extrabold text-pink-500">{feePct}%</p>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${feePct}%`,
                          background: 'linear-gradient(90deg,#7c3aed,#ec4899)',
                        }}
                      />
                    </div>

                    {feeSummary.pending > 0 && (
                      <p className="text-xs text-red-500 font-semibold mb-3">
                        {fmtAmt(feeSummary.pending)} Pending
                      </p>
                    )}

                    <Link
                      to="/student/fees"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      View Detailed Breakdown
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* ── Recent Activity ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">Recent Activity</h3>
                    <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                      View All
                    </button>
                  </div>

                  <div className="divide-y divide-gray-50">
                    {STATIC_ACTIVITIES.map((act, i) => (
                      <div key={i} className="py-3.5 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 leading-snug">{act.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{act.sub}</p>
                        </div>
                        <span className="text-[11px] text-gray-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                          {act.timeLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ════ RIGHT COLUMN ═══════════════════════════ */}
              <div className="flex flex-col gap-5">

                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center overflow-hidden shadow-md mb-3 border-4 border-white">
                      {d.student_photo_url ? (
                        <img src={d.student_photo_url} alt={d.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-black text-white">{initials}</span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      {d.name || user?.name || '—'}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Admission No: {admNo}
                    </p>
                    {(d.class_name || d.section_name) && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        <BookOpen className="w-3 h-3" />
                        {d.class_name} {d.section_name ? `- Section ${d.section_name}` : ''}
                      </div>
                    )}
                  </div>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-400 font-semibold mb-0.5">Blood Group</p>
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-red-400" />
                        <p className="text-xs font-bold text-gray-700">{d.blood_group || '—'}</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-[10px] text-gray-400 font-semibold mb-0.5">Category</p>
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-violet-400" />
                        <p className="text-xs font-bold text-gray-700">{d.category || '—'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Emergency contact */}
                  {(d.mobile_number || d.father_mobile) && (
                    <div className="bg-gray-50 rounded-xl p-2.5 mb-3">
                      <p className="text-[10px] text-gray-400 font-semibold mb-0.5">Emergency Contact</p>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-green-500" />
                        <p className="text-xs font-bold text-gray-700">
                          {d.mobile_number || d.father_mobile || '—'}
                        </p>
                      </div>
                    </div>
                  )}

                  <Link
                    to="/student/profile"
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors py-2 border border-violet-100 rounded-xl bg-violet-50 hover:bg-violet-100"
                  >
                    View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Class Instructors */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-800">Class Instructors</h3>
                  </div>
                  <div className="space-y-3">
                    {INSTRUCTORS.map((ins) => (
                      <div key={ins.name} className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${ins.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm`}>
                          {ins.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-800 leading-tight truncate">{ins.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">{ins.role}</p>
                        </div>
                        <button className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors flex-shrink-0">
                          <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notice */}
               

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}