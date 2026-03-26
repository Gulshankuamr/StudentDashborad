// src/pages/student/StudentProfileDetail.jsx
import { useState, useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { useAuth } from '../../context/AuthContext'
import { profileService } from '../../services/profileServish'
import {
  Droplets, Tag, User2, CalendarDays, Mail, Phone,
  MapPin, Hash, Loader2, AlertCircle,
  Edit2, Printer, ChevronRight,
  Users, FileText, Download,
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (val) =>
  val !== null && val !== undefined && val !== 'null' && String(val).trim() !== ''
    ? String(val)
    : '—'

const fmtDate = (iso) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const getInitials = (name = '') =>
  name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'ST'

// ─── Stat Badge ───────────────────────────────────────────────
const StatBadge = ({ icon: Icon, iconBg, label, value, valueColor }) => (
  <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm border border-gray-100">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`text-base font-black leading-tight ${valueColor}`}>{fmt(value)}</p>
    </div>
  </div>
)

// ─── Field Row ────────────────────────────────────────────────
const FieldRow = ({ label, value, valueClass = 'text-gray-800' }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
    <p className={`text-sm font-semibold ${valueClass}`}>{fmt(value)}</p>
  </div>
)

// ─── Section Title ────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
      <Icon className="w-3.5 h-3.5 text-gray-500" />
    </div>
    <h3 className="text-sm font-bold text-gray-700">{title}</h3>
  </div>
)

// ─── Doc Card ─────────────────────────────────────────────────
const DocCard = ({ label, url, isPdf, placeholder }) => (
  <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
    <div className="h-28 flex items-center justify-center overflow-hidden bg-gray-100">
      {url ? (
        isPdf ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="w-9 h-9 text-blue-400" />
            <span className="text-xs text-gray-400 font-medium">PDF Document</span>
          </div>
        ) : (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        )
      ) : (
        <div className="flex flex-col items-center gap-1.5 text-gray-300">
          {isPdf ? <FileText className="w-9 h-9" /> : <User2 className="w-9 h-9" />}
          <span className="text-[9px] font-bold uppercase tracking-wider text-center px-2">{placeholder}</span>
        </div>
      )}
    </div>
    <div className="px-3 py-2.5 flex items-center justify-between bg-white">
      <div className="min-w-0">
        <p className="text-xs font-bold text-gray-700 truncate">{label}</p>
        <p className="text-[10px] text-gray-400">
          {url ? (isPdf ? 'PDF Document · 1.2MB' : 'Image file') : 'Not uploaded'}
        </p>
      </div>
      {url && (
        <a
          href={url} download target="_blank" rel="noopener noreferrer"
          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-blue-50 flex items-center justify-center transition-colors flex-shrink-0 ml-2"
        >
          <Download className="w-3.5 h-3.5 text-gray-500" />
        </a>
      )}
    </div>
  </div>
)

// ─── Main ──────────────────────────────────────────────────────
export default function StudentProfileDetail() {
  const { user: authUser } = useAuth()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await profileService.getStudentDetails()
        setStudent(res.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const d        = student || {}
  const initials = getInitials(d.name)
  const isActive = d.status === 1 && !d.passed_out && !d.transfer

  return (
    // ── EXACT same root wrapper as StudentDashboard ──────────────
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .sp-fade   { animation: spFade 0.35s ease both; }
        .sp-fade-1 { animation: spFade 0.35s 0.06s ease both; }
        .sp-fade-2 { animation: spFade 0.35s 0.12s ease both; }
        .sp-fade-3 { animation: spFade 0.35s 0.18s ease both; }
        .sp-fade-4 { animation: spFade 0.35s 0.24s ease both; }
        @keyframes spFade {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Sidebar — same as StudentDashboard */}
      <Sidebar />

      {/* Right wrapper — same as StudentDashboard */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Navbar — same as StudentDashboard */}
        <Navbar />

        {/* Main — SAME padding: 28px 32px as StudentDashboard */}
        <main className="flex-1 overflow-y-auto" style={{ padding: '28px 32px' }}>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                <p className="text-sm text-gray-400 font-medium">Loading student details…</p>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white rounded-2xl border border-red-100 p-8 flex flex-col items-center gap-3 text-center max-w-sm shadow-sm">
                <AlertCircle className="w-10 h-10 text-red-400" />
                <p className="font-bold text-gray-800">Could not load profile</p>
                <p className="text-sm text-gray-400">{error}</p>
              </div>
            </div>
          )}

          {/* ── Content ── */}
          {!loading && !error && student && (
            <div className="flex flex-col gap-5">

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 sp-fade">
                <span className="hover:text-gray-600 cursor-pointer">Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="hover:text-gray-600 cursor-pointer">Students</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-700 font-semibold">{d.name || 'Student'}</span>
              </div>

              {/* ══ HERO CARD ══════════════════════════════════════ */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sp-fade">
                <div className="flex flex-col sm:flex-row items-start gap-5">

                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center border-2 border-white shadow-md">
                      {d.student_photo_url
                        ? <img src={d.student_photo_url} alt={d.name} className="w-full h-full object-cover" />
                        : <span className="text-2xl font-black text-violet-400">{initials}</span>
                      }
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-400" />
                  </div>

                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
                        {fmt(d.name)}
                      </h1>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-gray-50 text-gray-500 border-gray-200'
                      }`}>
                        {d.passed_out ? 'Passed Out' : d.transfer ? 'Transferred' : isActive ? '● Active Student' : 'Inactive'}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 font-medium mb-3">
                      {d.class_id    ? `Class ${d.class_id}`       : ''}
                      {d.section_id  ? ` · Section ${d.section_id}` : ''}
                      {d.academic_year ? ` · ${d.academic_year}`    : ''}
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Hash         className="w-3.5 h-3.5 text-gray-300" />
                        Admission: {fmt(d.admission_no)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-300" />
                        Academic Year: {fmt(d.academic_year)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail  className="w-3.5 h-3.5 text-gray-300" />
                        {fmt(d.user_email)}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone className="w-3.5 h-3.5 text-gray-300" />
                        Mobile: {fmt(d.mobile_number)}
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  {/* <div className="flex flex-col gap-2 flex-shrink-0">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-sm">
                      <Edit2   className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-600 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                      <Printer className="w-3.5 h-3.5" /> Print ID Card
                    </button>
                  </div> */}
                </div>
              </div>

              {/* ══ STAT BADGES ══════════════════════════════════════ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sp-fade-1">
                <StatBadge icon={Droplets}    iconBg="bg-blue-500"   label="Blood Group"   value={d.blood_group}   valueColor="text-blue-600" />
                <StatBadge icon={Tag}         iconBg="bg-purple-500" label="Category"      value={d.category}      valueColor="text-purple-600" />
                <StatBadge
                  icon={User2} iconBg="bg-pink-500" label="Gender"
                  value={d.gender ? d.gender.charAt(0).toUpperCase() + d.gender.slice(1) : null}
                  valueColor="text-pink-600"
                />
                <StatBadge icon={CalendarDays} iconBg="bg-amber-500" label="Academic Year" value={d.academic_year} valueColor="text-amber-600" />
              </div>

              {/* ══ TWO-COL: Personal/Address  +  Family ═══════════ */}
              {/*
                  Same flex gap-6 pattern as Dashboard's left/right split.
                  Left = flex-1 (grows), Right = fixed w-72 (like Dashboard's w-64 right panel)
              */}
              <div className="flex gap-6 sp-fade-2">

                {/* LEFT — Personal Info + Address */}
                <div className="flex-1 min-w-0 flex flex-col gap-5">

                  {/* Personal Information */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <SectionTitle icon={User2} title="Personal Information" />
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                      <FieldRow label="Full Name"     value={d.name} />
                      <FieldRow label="Gender"
                        value={d.gender ? d.gender.charAt(0).toUpperCase() + d.gender.slice(1) : null} />
                      <FieldRow label="Date of Birth" value={fmtDate(d.dob)} />
                      <FieldRow label="Blood Group"   value={d.blood_group} valueClass="text-blue-600 font-black" />
                      <FieldRow label="Religion"      value={d.religion} />
                      <FieldRow label="Category"      value={d.category} />
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <SectionTitle icon={MapPin} title="Address Details" />
                    <div className="flex flex-col gap-4">
                      <FieldRow label="Residential Address" value={d.address} />
                      <div className="grid grid-cols-2 gap-6">
                        <FieldRow label="City" value={d.city} />
                        <FieldRow
                          label="State / Pincode"
                          value={
                            d.state && d.pincode
                              ? `${d.state} - ${d.pincode}`
                              : d.state || d.pincode
                          }
                        />
                      </div>

                      {/* Emergency Contact */}
                      <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-wider text-red-400 mb-0.5">Emergency Contact</p>
                          <p className="text-sm font-bold text-red-600">
                            {fmt(d.emergency_contact_number)}
                            {d.mother_name ? ` (${d.mother_name})` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Family Info  (w-72 matches Dashboard's w-64 right panel style) */}
                <div className="w-72 flex-shrink-0">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full">
                    <SectionTitle icon={Users} title="Family Information" />

                    {/* Father */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
                          <User2 className="w-3 h-3 text-blue-500" />
                        </div>
                        <p className="text-xs font-black text-blue-600 uppercase tracking-wider">Father's Details</p>
                      </div>
                      <div className="space-y-3 pl-2">
                        <FieldRow label="Name"       value={d.father_name} />
                        <FieldRow label="Occupation" value={d.father_occupation} />
                        <FieldRow label="Contact"    value={d.father_mobile} />
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-100 mb-5" />

                    {/* Mother */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-pink-100 flex items-center justify-center">
                          <User2 className="w-3 h-3 text-pink-500" />
                        </div>
                        <p className="text-xs font-black text-pink-500 uppercase tracking-wider">Mother's Details</p>
                      </div>
                      <div className="space-y-3 pl-2">
                        <FieldRow label="Name"       value={d.mother_name} />
                        <FieldRow label="Occupation" value={d.mother_occupation} />
                        <FieldRow label="Contact"    value={d.mother_mobile} />
                      </div>
                    </div>

                    <div className="border-t border-dashed border-gray-100 mb-4" />

                    <FieldRow label="Guardian Name" value={d.guardian_name} />
                  </div>
                </div>
              </div>

              {/* ══ STUDENT DOCUMENTS ══════════════════════════════════ */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sp-fade-3">
                <SectionTitle icon={FileText} title="Student Documents" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DocCard label="Student Photo" url={d.student_photo_url} isPdf={false} placeholder="Student Photo" />
                  <DocCard label="Father Photo"  url={d.father_photo_url}  isPdf={false} placeholder="Father Photo" />
                  <DocCard label="Mother Photo"  url={d.mother_photo_url}  isPdf={false} placeholder="Mother Photo" />
                  <DocCard label="Aadhaar Card"  url={d.aadhar_card_url}   isPdf={true}  placeholder="Aadhaar Card Scan" />
                </div>
              </div>

              {/* Footer */}
              <p className="text-center text-[11px] text-gray-300 font-medium pb-2 sp-fade-4">
                © {new Date().getFullYear()} EduFlow Management System. All rights reserved.
              </p>

            </div>
          )}
        </main>
      </div>
    </div>
  )
}