// src/pages/student/StudentDashboard.jsx
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { profileService } from '../../services/profileServish'
import {
  BookOpen, BarChart2, ChevronRight, Bell,
  User2, Droplets, Tag, CalendarDays, Loader2,
  Hash, Phone, MapPin, ArrowRight,
} from 'lucide-react'

/* ─── Static data ───────────────────────────────────────────── */
const financeCards = [
  {
    label: '₹ 10,000', sub: 'Total Payable', active: false,
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <ellipse cx="24" cy="38" rx="14" ry="4" fill="#ddd6fe"/>
        <rect x="10" y="18" width="28" height="18" rx="4" fill="#a78bfa"/>
        <rect x="10" y="14" width="28" height="8"  rx="3" fill="#7c3aed"/>
        <circle cx="24" cy="23" r="4" fill="#ede9fe"/>
      </svg>
    ),
  },
  {
    label: '₹ 5,000', sub: 'Total Paid', active: true,
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <ellipse cx="24" cy="38" rx="14" ry="4" fill="#c4b5fd"/>
        <rect x="8"  y="22" width="20" height="14" rx="3" fill="#8b5cf6"/>
        <rect x="20" y="16" width="20" height="14" rx="3" fill="#7c3aed"/>
        <circle cx="24" cy="23" r="3.5" fill="#ede9fe"/>
      </svg>
    ),
  },
  {
    label: '₹ 300', sub: 'Others', active: false,
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <rect x="8"  y="30" width="6"  height="10" rx="2" fill="#c4b5fd"/>
        <rect x="18" y="22" width="6"  height="18" rx="2" fill="#a78bfa"/>
        <rect x="28" y="14" width="6"  height="26" rx="2" fill="#8b5cf6"/>
        <rect x="38" y="20" width="6"  height="20" rx="2" fill="#7c3aed"/>
      </svg>
    ),
  },
]

const courses = [
  {
    title: 'Object oriented programming',
    bg: 'from-purple-100 to-violet-50',
    titleColor: 'text-violet-700',
    icon: (
      <svg viewBox="0 0 80 60" className="w-20 h-14" fill="none">
        <rect x="8"  y="8"  width="64" height="40" rx="5" fill="#c4b5fd"/>
        <rect x="14" y="14" width="52" height="28" rx="3" fill="#ede9fe"/>
        <rect x="20" y="20" width="36" height="4"  rx="2" fill="#a78bfa"/>
        <rect x="20" y="28" width="24" height="4"  rx="2" fill="#c4b5fd"/>
        <rect x="28" y="50" width="24" height="4"  rx="2" fill="#a78bfa"/>
        <rect x="22" y="48" width="36" height="2"  rx="1" fill="#ddd6fe"/>
      </svg>
    ),
  },
  {
    title: 'Fundamentals of database systems',
    bg: 'from-violet-100 to-purple-50',
    titleColor: 'text-violet-700',
    icon: (
      <svg viewBox="0 0 80 60" className="w-20 h-14" fill="none">
        <ellipse cx="40" cy="16" rx="22" ry="8"  fill="#a78bfa"/>
        <rect   x="18" y="16" width="44" height="20" fill="#8b5cf6"/>
        <ellipse cx="40" cy="36" rx="22" ry="8"  fill="#7c3aed"/>
        <ellipse cx="40" cy="16" rx="22" ry="8"  fill="#c4b5fd"/>
        <ellipse cx="40" cy="26" rx="22" ry="8"  fill="#a78bfa" opacity=".6"/>
      </svg>
    ),
  },
]

const notices = [
  {
    title: 'Prelim payment due',
    body: 'Sorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    title: 'Exam schedule',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum.',
  },
]

// ── Mini info chip ─────────────────────────────────────────────
const InfoChip = ({ icon: Icon, label, value, color }) => (
  <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${color}`}>
    <Icon className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
      <p className="text-xs font-bold leading-tight">{value || '—'}</p>
    </div>
  </div>
)

/* ─── Component ─────────────────────────────────────────────── */
export default function StudentDashboard() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'Student'
  const dateStr   = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  // Student details from API
  const [student, setStudent] = useState(null)
  const [stuLoading, setStuLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setStuLoading(true)
      try {
        const res = await profileService.getStudentDetails()
        setStudent(res.data)
      } catch {
        // silently fail — widget just won't show
      } finally {
        setStuLoading(false)
      }
    })()
  }, [])

  const d = student || {}
  const initials = (d.name || user?.name || 'ST')
    .split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 overflow-y-auto" style={{ padding: '28px 32px' }}>
          <div className="flex gap-6 w-full">

            {/* ── LEFT ─────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {/* Welcome Banner */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 60%, #a78bfa 100%)',
                  minHeight: 160,
                }}
              >
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="absolute top-3 right-52 w-5 h-5 rounded-full bg-pink-400 opacity-90"/>
                <div className="absolute top-8 right-40 w-3 h-3 rounded-full bg-yellow-300 opacity-90"/>
                <div className="absolute bottom-6 right-64 w-4 h-4 rounded-full bg-green-300 opacity-80"/>

                <div className="relative z-10 p-6 pr-56">
                  <p className="text-white/70 text-xs mb-3 font-medium">{dateStr}</p>
                  <h2 className="text-white text-2xl font-extrabold leading-tight mb-1">
                    Welcome back, {firstName}!
                  </h2>
                  <p className="text-white/70 text-sm">Always stay updated in your student portal</p>
                </div>

                <div className="absolute right-6 bottom-0 w-36 h-36 flex items-end justify-center opacity-30">
                  <svg viewBox="0 0 80 96" fill="none" className="w-28 h-28">
                    <circle cx="40" cy="22" r="18" fill="white"/>
                    <path d="M8 88 Q8 56 40 56 Q72 56 72 88" fill="white"/>
                  </svg>
                </div>
              </div>

              {/* ── Student Quick Info Widget (from API) ── */}
              {!stuLoading && student && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center border border-white shadow-sm flex-shrink-0">
                        {d.student_photo_url ? (
                          <img src={d.student_photo_url} alt={d.name}
                            className="w-full h-full rounded-xl object-cover" />
                        ) : (
                          <span className="text-base font-black text-blue-500">{initials}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-black text-gray-800">{d.name || user?.name}</p>
                        <p className="text-xs text-gray-400">
                          {d.admission_no && d.admission_no !== 'null' ? `Adm: ${d.admission_no}` : ''}
                          {d.academic_year ? ` · ${d.academic_year}` : ''}
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/student/profile"
                      className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
                    >
                      View Full Profile <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Info chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <InfoChip icon={Droplets}    color="bg-blue-50 text-blue-700"   label="Blood Group"   value={d.blood_group} />
                    <InfoChip icon={Tag}          color="bg-purple-50 text-purple-700" label="Category"    value={d.category} />
                    <InfoChip icon={Hash}         color="bg-amber-50 text-amber-700"  label="Class"
                      value={d.class_id ? `Class ${d.class_id}` : null} />
                    <InfoChip icon={Phone}        color="bg-green-50 text-green-700"  label="Mobile"      value={d.mobile_number} />
                  </div>
                </div>
              )}

              {/* Loading skeleton for student widget */}
              {stuLoading && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                  <p className="text-sm text-gray-400">Loading your details…</p>
                </div>
              )}

              {/* Finance Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-800">Finance</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {financeCards.map((fc) => (
                    <div
                      key={fc.sub}
                      className={`rounded-2xl p-4 flex flex-col items-center gap-2 transition-all cursor-pointer
                        ${fc.active
                          ? 'border-2 border-violet-500 bg-white shadow-md shadow-violet-100'
                          : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
                        }`}
                    >
                      {fc.icon}
                      <p className="text-lg font-extrabold text-gray-800">{fc.label}</p>
                      <p className="text-xs text-gray-400 font-medium">{fc.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrolled Courses */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-gray-800">Enrolled Courses</h3>
                  <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                    See all
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {courses.map((c) => (
                    <div key={c.title}
                      className={`rounded-2xl bg-gradient-to-br ${c.bg} p-5 flex flex-col gap-3 border border-violet-100`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-bold leading-snug ${c.titleColor} max-w-[120px]`}>{c.title}</p>
                        <div className="flex-shrink-0">{c.icon}</div>
                      </div>
                      <button
                        onClick={() => navigate('/student/courses')}
                        className="self-start text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors px-5 py-2 rounded-full"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT ────────────────────────────────────────── */}
            <div className="w-64 flex-shrink-0 flex flex-col gap-5">

              {/* Course Instructors */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-800">Course instructors</h3>
                  <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                    See all
                  </button>
                </div>
                <div className="flex gap-2">
                  {[
                    { name: 'Sarah',  color: 'bg-rose-400' },
                    { name: 'Marcus', color: 'bg-slate-500' },
                    { name: 'Elena',  color: 'bg-amber-600' },
                  ].map((ins) => (
                    <div key={ins.name} className="flex flex-col items-center gap-1.5">
                      <div className={`w-14 h-14 rounded-full ${ins.color} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                        {ins.name[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Notice */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-800">Daily notice</h3>
                  <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                    See all
                  </button>
                </div>
                <div className="flex flex-col gap-5">
                  {notices.map((n) => (
                    <div key={n.title}>
                      <p className="text-sm font-bold text-gray-800 mb-1">{n.title}</p>
                      <p className="text-xs text-gray-400 leading-relaxed mb-2">{n.body}</p>
                      <button className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors">
                        See more
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}