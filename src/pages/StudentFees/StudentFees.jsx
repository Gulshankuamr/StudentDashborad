// src/pages/student/StudentFees/StudentFees.jsx
import { useEffect, useState } from 'react'
import { feesService } from '../../services/feesService/feesService'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Bus,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Receipt,
  MapPin,
  Ruler,
  ArrowRight,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────
const fmt = (iso) => {
  if (!iso) return '—'
  // Guard against the corrupt 1899 date in API
  const d = new Date(iso)
  if (d.getFullYear() < 2000) return '—'
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const fmtAmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

const cleanAdmissionNo = (s) => (s || '').replace(/^null-/, '')

const statusMeta = (s) => {
  switch (s) {
    case 'paid':    return { label: 'Paid',    cls: 'bg-green-100 text-green-700',  dot: 'bg-green-500'  }
    case 'overdue': return { label: 'Overdue', cls: 'bg-red-100 text-red-600',      dot: 'bg-red-500'    }
    default:        return { label: 'Pending', cls: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500'  }
  }
}

const feeStatusMeta = (s) => {
  switch (s) {
    case 'paid':    return { label: 'PAID',             cls: 'bg-green-100 text-green-700 border-green-200' }
    case 'partial': return { label: 'PARTIAL PAYMENT',  cls: 'bg-orange-100 text-orange-600 border-orange-200' }
    case 'overdue': return { label: 'OVERDUE',          cls: 'bg-red-100 text-red-600 border-red-200' }
    default:        return { label: 'PENDING',          cls: 'bg-amber-100 text-amber-700 border-amber-200' }
  }
}

// ─────────────────────────────────────────────────────────────────
// Summary Card
// ─────────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, icon: Icon, iconBg, iconColor, valueColor }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-extrabold ${valueColor}`}>{value}</p>
    </div>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────
// Fee Breakdown Card (collapsible installments)
// ─────────────────────────────────────────────────────────────────
const FeeBreakdownCard = ({ fee }) => {
  const [open, setOpen] = useState(true)
  const pct = fee.total_amount ? Math.round((fee.paid_amount / fee.total_amount) * 100) : 0
  const sm = feeStatusMeta(fee.status)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-base font-bold text-gray-900">{fee.fee_head_name} Breakdown</h3>
            <p className="text-xs text-gray-400 mt-0.5">Academic Session {fee.academic_year}</p>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border ${sm.cls}`}>
            {sm.label}
          </span>
        </div>

        {/* Expected / Received */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Expected</p>
            <p className="text-xl font-extrabold text-gray-900">{fmtAmt(fee.total_amount)}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-1">Received</p>
            <p className="text-xl font-extrabold text-green-700">{fmtAmt(fee.paid_amount)}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <p className="text-xs font-semibold text-gray-600">Payment Progress</p>
            <p className="text-xs font-bold text-gray-800">{pct}%</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                  : 'linear-gradient(90deg,#16a34a,#22c55e)',
              }}
            />
          </div>
          {fee.pending_amount > 0 && (
            <p className="text-[11px] text-gray-400 mt-1.5">
              {fmtAmt(fee.pending_amount)} remaining for full {fee.fee_head_name?.toLowerCase()} clearance.
            </p>
          )}
        </div>
      </div>

      {/* Installments toggle */}
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>Fee Installments</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>

      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                {['NO.', 'AMOUNT', 'DUE DATE', 'STATUS', 'FINE', 'TOTAL'].map(h => (
                  <th key={h} className="px-5 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fee.installments.map((inst) => {
                const sm2 = statusMeta(inst.calculated_status)
                const isOverdue = inst.calculated_status === 'overdue'
                const dueDate = fmt(inst.end_due_date)
                return (
                  <tr key={inst.id} className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-700 whitespace-nowrap">
                      Inst. {String(inst.installment_no).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">
                      {fmtAmt(inst.amount)}
                    </td>
                    <td className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap ${isOverdue ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                      {dueDate === '—' ? <span className="text-gray-300">—</span> : dueDate}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${sm2.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm2.dot}`} />
                        {sm2.label}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-sm font-semibold ${inst.fine_amount > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                      {fmtAmt(inst.fine_amount)}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                      {fmtAmt(inst.total_amount)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Transport Card
// ─────────────────────────────────────────────────────────────────
const TransportCard = ({ transport }) => {
  const isOverdue = transport.status === 'overdue' ||
    transport.installments?.some(i => i.calculated_status === 'overdue')

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Bus image header */}
      <div className="relative h-28 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Bus className="w-16 h-16 text-white/20" />
        </div>
        {isOverdue && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
            Overdue
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Bus className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Transport Details</h3>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Route',          value: transport.route_name    },
            { label: 'Stop',           value: transport.stop_name     },
            { label: 'Distance',       value: `${transport.distance_km} KM` },
            { label: 'Pending Amount', value: fmtAmt(transport.pending_amount), red: true },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-400 font-medium">{row.label}</span>
              <span className={`text-sm font-bold ${row.red ? 'text-red-500' : 'text-gray-800'}`}>
                {row.value || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Payment History Card
// ─────────────────────────────────────────────────────────────────
const PaymentHistoryCard = ({ payments }) => {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? payments : payments.slice(0, 4)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Payment History</h3>
        {payments.length > 4 && (
          <button
            onClick={() => setShowAll(p => !p)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {showAll ? 'Show Less' : 'View All'}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {visible.map((p) => (
          <div key={p.payment_id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <Receipt className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                {fmtAmt(p.amount)} Received
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {fmt(p.paid_on)} · {p.payment_mode?.charAt(0).toUpperCase() + p.payment_mode?.slice(1)}
              </p>
            </div>
            <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
              {p.status}
            </span>
          </div>
        ))}
      </div>

      {payments.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-6">No payment history found.</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────
const StudentFees = () => {
  const [feeData, setFeeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => { fetchFees() }, [])

  const fetchFees = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await feesService.getStudentFees()
      // Save academic_year to session for future use
      if (res.data?.current_academic_year) {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}')
        sessionStorage.setItem('user', JSON.stringify({
          ...user,
          academic_year: res.data.current_academic_year,
        }))
      }
      setFeeData(res.data)
    } catch (err) {
      setError(err.message || 'Failed to load fees.')
    } finally {
      setLoading(false)
    }
  }

  // ── Derived data ─────────────────────────────────────────────
  const summary    = feeData?.summary?.current_year || {}
  const hasOverdue = feeData?.fee_breakdown?.some(f =>
    f.installments?.some(i => i.calculated_status === 'overdue')
  ) || feeData?.transport_fee_breakdown?.some(t =>
    t.installments?.some(i => i.calculated_status === 'overdue')
  )
  const transportPending = feeData?.transport_fee_breakdown?.some(t => t.pending_amount > 0)

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#f0f2f8]"
      style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif" }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-7">

          {/* ── Page title ──────────────────────────────────── */}
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Fees</h1>
            {feeData?.current_academic_year && (
              <p className="text-xs text-gray-400 mt-0.5">
                Academic Year: {feeData.current_academic_year}
              </p>
            )}
          </div>

          {/* ── Loading ─────────────────────────────────────── */}
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* ── Error ───────────────────────────────────────── */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm mb-6 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
              <button onClick={fetchFees} className="ml-2 underline font-semibold">Retry</button>
            </div>
          )}

          {/* ── Content ─────────────────────────────────────── */}
          {!loading && !error && feeData && (
            <div className="space-y-5">

              {/* ── Urgent Banner ────────────────────────────── */}
              {(hasOverdue || transportPending) && (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-red-700">Urgent: Fee Actions Required</p>
                      <p className="text-xs text-red-500 mt-0.5">
                        {hasOverdue && 'You have overdue installments'}
                        {hasOverdue && transportPending && ' and '}
                        {transportPending && 'pending transport fees'}
                        . Please settle these to avoid further late fines.
                      </p>
                    </div>
                  </div>
                  <button className="flex-shrink-0 ml-4 bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-5 py-2 rounded-xl transition-colors">
                    Pay Now
                  </button>
                </div>
              )}

              {/* ── Summary Cards ────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                  label="Total Fees"  value={fmtAmt(summary.total)}
                  icon={CreditCard}   iconBg="bg-blue-50"   iconColor="text-blue-500"
                  valueColor="text-gray-900"
                />
                <SummaryCard
                  label="Paid"        value={fmtAmt(summary.paid)}
                  icon={CheckCircle2} iconBg="bg-green-50"  iconColor="text-green-500"
                  valueColor="text-green-600"
                />
                <SummaryCard
                  label="Pending"     value={fmtAmt(summary.pending)}
                  icon={Clock}        iconBg="bg-orange-50" iconColor="text-orange-500"
                  valueColor="text-orange-500"
                />
                <SummaryCard
                  label="Fines"       value={fmtAmt(summary.fine)}
                  icon={AlertTriangle} iconBg="bg-red-50"   iconColor="text-red-500"
                  valueColor="text-red-500"
                />
              </div>

              {/* ── Main 2-column layout ─────────────────────── */}
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">

                {/* Left: Fee Breakdowns */}
                <div className="space-y-5">
                  {feeData.fee_breakdown?.map(fee => (
                    <FeeBreakdownCard key={fee.student_fee_id} fee={fee} />
                  ))}

                  {feeData.fee_breakdown?.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-400 text-sm">
                      No fee breakdown available.
                    </div>
                  )}
                </div>

                {/* Right: Transport + Payment History */}
                <div className="space-y-5">
                  {feeData.transport_fee_breakdown?.map(t => (
                    <TransportCard key={t.student_transport_fee_id} transport={t} />
                  ))}

                  <PaymentHistoryCard payments={feeData.payment_history || []} />
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  )
}

export default StudentFees