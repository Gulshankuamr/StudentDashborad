// src/pages/student/StudentHomeWork/StudentSubmitHomework.jsx
import { useState, useRef, useCallback } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { homeworkService } from '../../services/homeWorkService/homeworkService'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import {
  Upload, X, Trash2, Download,
  Calendar, BookOpen, CheckCircle2, AlertCircle,
  Clock, ArrowLeft, FileText,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const getFileColorClass = (file) => {
  const ext = file.name.split('.').pop().toLowerCase()
  const map = {
    pdf:  'text-red-500 bg-red-50 border-red-200',
    doc:  'text-blue-500 bg-blue-50 border-blue-200',
    docx: 'text-blue-500 bg-blue-50 border-blue-200',
    zip:  'text-yellow-500 bg-yellow-50 border-yellow-200',
    jpg:  'text-green-500 bg-green-50 border-green-200',
    jpeg: 'text-green-500 bg-green-50 border-green-200',
    png:  'text-green-500 bg-green-50 border-green-200',
  }
  return map[ext] || 'text-gray-500 bg-gray-50 border-gray-200'
}

const formatDueDate = (isoDate) => {
  if (!isoDate) return ''
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ── Upload Zone ───────────────────────────────────────────────
const UploadZone = ({ onFiles, isDragging, setIsDragging }) => {
  const inputRef = useRef()

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false)
    onFiles(Array.from(e.dataTransfer.files))
  }, [onFiles, setIsDragging])

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
        ${isDragging
          ? 'border-violet-400 bg-violet-50 scale-[1.01]'
          : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/30'
        }`}
    >
      <div className="w-14 h-14 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-3">
        <Upload className={`w-6 h-6 transition-colors ${isDragging ? 'text-violet-600' : 'text-violet-400'}`} />
      </div>
      <p className="text-sm font-semibold text-gray-700 mb-1">Click or drag files to upload</p>
      <p className="text-xs text-gray-400">Max 50MB · PDF, DOCX, ZIP, JPG, PNG</p>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png"
        onChange={(e) => onFiles(Array.from(e.target.files))}
      />
    </div>
  )
}

// ── File Row ──────────────────────────────────────────────────
const FileRow = ({ file, progress, onRemove }) => {
  const isUploading = progress !== undefined && progress < 100
  const iconClass   = getFileColorClass(file)

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
      ${isUploading ? 'border-violet-200 bg-violet-50/40' : 'border-gray-200 bg-white'}`}
    >
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${iconClass}`}>
        <FileText className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
        {isUploading ? (
          <div className="mt-1.5">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Uploading {progress}%</span>
              <span>{formatBytes(file.size)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">{formatBytes(file.size)}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(file)}
        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        {isUploading
          ? <X className="w-4 h-4 text-gray-400" />
          : <Trash2 className="w-4 h-4 text-gray-400" />
        }
      </button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────
export default function StudentSubmitHomework() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id }   = useParams()

  const homework = location.state?.homework || null

  const [files,        setFiles]        = useState([])
  const [fileProgress, setFileProgress] = useState({})
  const [isDragging,   setIsDragging]   = useState(false)
  const [remarks,      setRemarks]      = useState('')
  const [submitting,   setSubmitting]   = useState(false)
  const [success,      setSuccess]      = useState(false)
  const [error,        setError]        = useState(null)

  const handleFiles = (newFiles) => {
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name))
      return [...prev, ...newFiles.filter((f) => !names.has(f.name))]
    })
  }

  const removeFile = (file) => {
    setFiles((prev) => prev.filter((f) => f.name !== file.name))
    setFileProgress((prev) => { const n = { ...prev }; delete n[file.name]; return n })
  }

  const handleSubmit = async () => {
    if (!files.length) { setError('Please select a file to upload.'); return }
    if (!homework?.homework_id && !id) { setError('Homework ID missing.'); return }

    setSubmitting(true); setError(null)

    const file = files[0]
    const interval = setInterval(() => {
      setFileProgress((prev) => {
        const cur = prev[file.name] || 0
        if (cur >= 90) { clearInterval(interval); return prev }
        return { ...prev, [file.name]: cur + 10 }
      })
    }, 150)

    try {
      await homeworkService.submitHomework({
        homework_id: homework?.homework_id || id,
        file,        // service internally appends as 'attachment'
        remarks,
      })
      clearInterval(interval)
      setFileProgress({ [file.name]: 100 })
      setSuccess(true)
      setTimeout(() => navigate('/student/homework'), 2500)
    } catch (err) {
      clearInterval(interval)
      setFileProgress({})
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const dueDate = formatDueDate(homework?.due_date)
  const isLate  = homework?.status === 'overdue'

  return (
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 overflow-y-auto" style={{ padding: '28px 32px' }}>

          {/* Success Toast */}
          {success && (
            <div
              className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold"
              style={{ animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}
            >
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <p className="font-bold">Submitted Successfully!</p>
                <p className="text-green-200 text-xs font-normal">Redirecting to homework list…</p>
              </div>
              <button onClick={() => setSuccess(false)} className="ml-2 hover:text-green-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-5">
            <button onClick={() => navigate('/student/homework')} className="hover:text-gray-600 transition-colors">
              Homework
            </button>
            <span>›</span>
            <span>{homework?.subject_name || 'Subject'}</span>
            <span>›</span>
            <span className="text-violet-600 font-semibold">Submit</span>
          </div>

          {/* Title */}
          <div className="mb-7">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-2.5 py-1 rounded-lg">
                {homework?.subject_name}
              </span>
              {dueDate && (
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Due {dueDate}
                </span>
              )}
              {isLate && (
                <span className="text-xs font-bold text-white bg-red-500 px-2.5 py-1 rounded-full">
                  Overdue
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {homework?.description || 'Submit Assignment'}
            </h1>
          </div>

          {/* Two-column layout */}
          <div className="flex gap-6 items-start">

            {/* ── Left: Upload Card ── */}
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">

                {/* Card header */}
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-violet-600" />
                  </div>
                  <h2 className="text-base font-bold text-gray-900">Upload Submission</h2>
                </div>

                {/* Upload Zone */}
                <UploadZone
                  onFiles={handleFiles}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                />

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {files.map((file) => (
                      <FileRow
                        key={file.name}
                        file={file}
                        progress={fileProgress[file.name]}
                        onRemove={removeFile}
                      />
                    ))}
                  </div>
                )}

                {/* Remarks */}
                {/* <div className="mt-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remarks <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any notes for your teacher…"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700
                      focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent
                      resize-none placeholder-gray-300 transition-all"
                  />
                </div> */}

                {/* Error */}
                {error && (
                  <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => navigate('/student/homework')}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !files.length}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isLate
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-violet-600 hover:bg-violet-700 shadow-violet-200'
                    }`}
                >
                  {submitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25"/>
                        <path fill="white" opacity="0.85" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Submitting…
                    </>
                  ) : isLate ? 'Submit Late' : 'Submit Homework'}
                </button>
              </div>
            </div>

            {/* ── Right: Info Sidebar ── */}
            <div className="w-64 shrink-0 flex flex-col gap-4">

              {/* Assignment details */}
              {homework && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Assignment Info
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span className="font-medium">Due: </span>
                      <span>{dueDate || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <BookOpen className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                      <span className="font-medium">Subject: </span>
                      <span>{homework.subject_name}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher's Resource */}
              {homework?.attachment?.url && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Teacher's Resource
                  </p>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-700 truncate">
                        {homework.attachment.url.split('/').pop()}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Assignment file</p>
                    </div>
                  </div>
                  <a
                    href={homework.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 mt-3 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Instructions
                  </a>
                </div>
              )}

              {/* Late Policy */}
              {isLate && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                      Late Submission Policy
                    </p>
                  </div>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Submissions after the deadline are penalized 10% per day. Please ensure all work is clearly labeled.
                  </p>
                </div>
              )}

              {/* Tips card */}
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-2">💡 Tips</p>
                <ul className="text-xs text-violet-700 leading-relaxed space-y-1 list-disc list-inside">
                  <li>Upload a clear, readable file</li>
                  <li>PDF format is preferred</li>
                  <li>Max file size is 50MB</li>
                  <li>Add remarks if needed</li>
                </ul>
              </div>

            </div>
          </div>
        </main>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}