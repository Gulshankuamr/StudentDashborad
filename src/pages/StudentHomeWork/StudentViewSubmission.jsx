// src/pages/student/StudentHomeWork/StudentViewSubmission.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import {
  ArrowLeft, Download, Calendar, Clock,
  CheckCircle2, BookOpen, FileText, ExternalLink,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────
const formatDate = (isoDate) => {
  if (!isoDate) return '—'
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── File Card ─────────────────────────────────────────────────
const FileCard = ({ label, url, type }) => {
  if (!url) return null
  const name  = url.split('/').pop()
  const isPdf = type === 'pdf' || name.endsWith('.pdf')

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${isPdf ? 'bg-red-50 border border-red-200' : 'bg-blue-50 border border-blue-200'}`}
        >
          <FileText className={`w-5 h-5 ${isPdf ? 'text-red-500' : 'text-blue-500'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
          <p className="text-xs text-gray-400 mt-0.5 uppercase">{type || 'File'}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white transition-colors"
            title="Open"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
          <a href={url} download
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white transition-colors"
            title="Download"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
export default function StudentViewSubmission() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const homework  = location.state?.homework || null

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 overflow-y-auto" style={{ padding: '28px 32px' }}>

          {/* Not found state */}
          {!homework && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-gray-400 text-sm mb-4">Homework details not found.</p>
              <button
                onClick={() => navigate('/student/homework')}
                className="px-5 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700"
              >
                Go Back
              </button>
            </div>
          )}

          {homework && (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
                <button onClick={() => navigate('/student/homework')} className="hover:text-gray-600 transition-colors">
                  Homework
                </button>
                <span>›</span>
                <span>{homework.subject_name}</span>
                <span>›</span>
                <span className="text-green-600 font-semibold">Submission</span>
              </div>

              {/* Title */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2.5 py-1 rounded-lg">
                    {homework.subject_name}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-white bg-green-500 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Submitted
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mt-1">
                  {homework.description}
                </h1>
              </div>

              {/* Main Card */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-5 max-w-3xl">

                {/* Green success banner */}
                <div className="bg-green-50 border-b border-green-100 px-6 py-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-800">Submission Received</p>
                    <p className="text-xs text-green-600">
                      Submitted on {formatDate(homework.submitted_at)}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-5">

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Due Date
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{formatDate(homework.due_date)}</p>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-1.5 text-xs text-green-500 mb-1">
                        <Clock className="w-3.5 h-3.5" />
                        Submitted At
                      </div>
                      <p className="text-sm font-semibold text-green-800">{formatDate(homework.submitted_at)}</p>
                    </div>
                  </div>

                  {/* Files */}
                  <FileCard
                    label="Assignment File (from teacher)"
                    url={homework.attachment?.url}
                    type={homework.attachment?.type}
                  />
                  <FileCard
                    label="Your Submitted File"
                    url={homework.submitted_file?.url}
                    type={homework.submitted_file?.type}
                  />

                </div>
              </div>

              {/* Back */}
              <button
                onClick={() => navigate('/student/homework')}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white
                  text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Homework
              </button>
            </>
          )}

        </main>
      </div>
    </div>
  )
}