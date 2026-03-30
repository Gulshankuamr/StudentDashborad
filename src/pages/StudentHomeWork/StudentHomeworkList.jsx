// src/pages/student/StudentHomeWork/StudentHomeworkList.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { homeworkService } from '../../services/homeWorkService/homeworkService'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import {
  Calendar, Download, SlidersHorizontal,
  RefreshCw, HelpCircle, BookOpen, AlertCircle, ChevronDown,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────
const formatDueDate = (isoDate) => {
  if (!isoDate) return { text: '', overdue: false }
  const due  = new Date(isoDate)
  const now  = new Date()
  const days = Math.ceil((due - now) / (1000 * 60 * 60 * 24))

  const fmt = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const fmtTime = due.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  if (days < 0)  return { text: `Due ${fmt}`,             overdue: true  }
  if (days === 0) return { text: `Due Today, ${fmtTime}`,  overdue: false }
  if (days === 1) return { text: `Due Tomorrow, ${fmtTime}`, overdue: false }
  return { text: `Due ${fmt}`, overdue: false }
}

// ── Status Badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    submitted: { label: 'Submitted', cls: 'bg-green-500'  },
    pending:   { label: 'Pending',   cls: 'bg-orange-400' },
    overdue:   { label: 'Overdue',   cls: 'bg-red-500'    },
  }
  const s = map[status] || map.pending
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold text-white px-2.5 py-1 rounded-full ${s.cls}`}>
      ● {s.label}
    </span>
  )
}

// ── Homework Card ─────────────────────────────────────────────
const HomeworkCard = ({ item, onSubmit, onView }) => {
  const due        = formatDueDate(item.due_date)
  const fileName   = item.attachment?.url?.split('/').pop()
  const isSubmitted = item.status === 'submitted'
  const isOverdue   = item.status === 'overdue'

  const topBorder = {
    submitted: 'border-t-green-400',
    pending:   'border-t-orange-400',
    overdue:   'border-t-red-400',
  }[item.status] || 'border-t-orange-400'

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 border-t-4 ${topBorder} shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col`}>
      <div className="p-5 flex-1">

        {/* Subject + Status */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {item.subject_name}
          </span>
          <StatusBadge status={item.status} />
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-gray-900 mb-2 leading-snug line-clamp-2">
          {item.description}
        </h3>

        {/* Due Date */}
        <div className={`flex items-center gap-1.5 text-xs font-medium mb-4 ${due.overdue ? 'text-red-500' : 'text-gray-500'}`}>
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          {due.text}
        </div>

        {/* Attachment */}
        {item.attachment?.url && (
          <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" />
              </div>
              <p className="text-xs font-semibold text-gray-700 truncate max-w-[140px]">{fileName}</p>
            </div>
            <a
              href={item.attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={(e) => e.stopPropagation()}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
            </a>
          </div>
        )}
      </div>

      {/* Action */}
      <div className="px-5 pb-5">
        {isSubmitted ? (
          <button
            onClick={() => onView(item)}
            className="w-full py-2.5 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Submission
          </button>
        ) : isOverdue ? (
          <button
            onClick={() => onSubmit(item)}
            className="w-full py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
          >
            Submit Late
          </button>
        ) : (
          <button
            onClick={() => onSubmit(item)}
            className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-sm"
          >
            Submit Homework
          </button>
        )}
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────
const EmptyState = ({ onRefresh }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-40 h-40 mb-6 opacity-80">
      <svg viewBox="0 0 200 200" fill="none">
        <rect x="30" y="130" width="140" height="6" rx="3" fill="#E5C9A0"/>
        <rect x="50" y="136" width="8" height="30" rx="2" fill="#D4A96A"/>
        <rect x="142" y="136" width="8" height="30" rx="2" fill="#D4A96A"/>
        <rect x="70" y="115" width="60" height="16" rx="2" fill="#6B8FD4"/>
        <line x1="100" y1="115" x2="100" y2="131" stroke="white" strokeWidth="1"/>
        <rect x="145" y="105" width="14" height="20" rx="3" fill="#E5E7EB"/>
        <line x1="149" y1="95" x2="149" y2="107" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="153" y1="92" x2="153" y2="107" stroke="#6B8FD4" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="157" y1="94" x2="157" y2="107" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="78" y="75" width="44" height="40" rx="10" fill="#6EE7B7"/>
        <circle cx="100" cy="60" r="20" fill="#FBBF24"/>
        <circle cx="93" cy="58" r="2" fill="#374151"/>
        <circle cx="107" cy="58" r="2" fill="#374151"/>
        <path d="M93 67 Q100 73 107 67" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
        <path d="M82 52 Q84 38 100 40 Q116 38 118 52" fill="#1F2937"/>
      </svg>
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">No assignments yet</h2>
    <p className="text-sm text-gray-400 max-w-xs mb-8 leading-relaxed">
      Your instructors haven't posted any tasks yet. Stay tuned!
    </p>
    <div className="flex items-center gap-3">
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-full hover:bg-violet-700 transition-colors shadow-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
      <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors">
        <HelpCircle className="w-4 h-4" />
        Help Center
      </button>
    </div>
  </div>
)

// ── Main ──────────────────────────────────────────────────────
export default function StudentHomeworkList() {
  const navigate = useNavigate()

  const [homeworks,     setHomeworks]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState(null)
  const [filterSubject, setFilterSubject] = useState('All')
  const [filterStatus,  setFilterStatus]  = useState('All')

  const fetchHomework = async () => {
    setLoading(true); setError(null)
    try {
      const res = await homeworkService.getStudentHomework()
      setHomeworks(res?.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHomework() }, [])

  const subjects = useMemo(() => {
    const names = [...new Set(homeworks.map((h) => h.subject_name))]
    return ['All', ...names]
  }, [homeworks])

  const filtered = useMemo(() => homeworks.filter((h) => {
    const okSubject = filterSubject === 'All' || h.subject_name === filterSubject
    const okStatus  = filterStatus  === 'All' || h.status === filterStatus.toLowerCase()
    return okSubject && okStatus
  }), [homeworks, filterSubject, filterStatus])

  const handleSubmit = (item) => navigate(`/student/homework/submit/${item.homework_id}`, { state: { homework: item } })
  const handleView   = (item) => navigate(`/student/homework/view/${item.homework_id}`,   { state: { homework: item } })

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto" style={{ padding: '28px 32px' }}>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Homework</h1>
              <p className="text-sm text-gray-400 mt-0.5">View and submit your assignments</p>
            </div>
            <button
              onClick={fetchHomework}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">

            {/* Subject */}
            <div className="relative">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8
                  text-sm font-medium text-gray-700 cursor-pointer shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                {subjects.map((s) => <option key={s} value={s}>Subject: {s}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Status */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8
                  text-sm font-medium text-gray-700 cursor-pointer shadow-sm
                  focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                {['All', 'Pending', 'Submitted', 'Overdue'].map((s) => (
                  <option key={s} value={s}>Status: {s}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>

            <div className="flex-1" />

            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More Filters
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button onClick={fetchHomework} className="ml-auto text-xs underline font-semibold">Retry</button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="h-3 w-20 bg-gray-100 rounded-full" />
                    <div className="h-5 w-16 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
                  <div className="h-3 w-1/2 bg-gray-100 rounded mb-4" />
                  <div className="h-12 bg-gray-100 rounded-xl mb-4" />
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <EmptyState onRefresh={fetchHomework} />
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((item) => (
                <HomeworkCard
                  key={item.homework_id}
                  item={item}
                  onSubmit={handleSubmit}
                  onView={handleView}
                />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}