// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 src/pages/student/NotificationsPage.jsx
//     Also used for: src/pages/admin/NotificationsPage.jsx
//     (Same component — Sidebar adapts per role)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import {
  CheckCheck, Inbox, X,
  Star, AlertTriangle, BookOpen, Bell, Info,
  RefreshCw,
} from 'lucide-react'
import { useNotifications } from '../../context/NotificationContext'
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'

// ── Tokens ──────────────────────────────────
const C = {
  primary:    '#4f46e5',
  primaryHov: '#4338ca',
  primaryBg:  '#eef2ff',
  primaryBdr: '#c7d2fe',
  appBg:      '#f5f7fb',
  card:       '#ffffff',
  heading:    '#111827',
  body:       '#374151',
  muted:      '#6b7280',
  light:      '#9ca3af',
  danger:     '#ef4444',
  success:    '#10b981',
  warning:    '#f59e0b',
  border:     '#e5e7eb',
  borderLt:   '#f3f4f6',
}
const FONT = 'Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif'

const TYPE_META = {
  message: { icon: BookOpen,      bg: '#eef2ff', color: '#4f46e5', label: 'Message' },
  grade:   { icon: Star,          bg: '#ecfdf5', color: '#059669', label: 'Grade'   },
  alert:   { icon: AlertTriangle, bg: '#fffbeb', color: '#b45309', label: 'Alert'   },
  system:  { icon: Bell,          bg: '#fef2f2', color: '#dc2626', label: 'System'  },
}

const FILTERS = ['All', 'Unread', 'Message', 'Grade', 'Alert', 'System']

// ────────────────────────────────────────────
export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    readNotification,
    markAllRead,
    refresh,
  } = useNotifications()

  const [filter, setFilter]         = useState('All')
  const [selectedId, setSelectedId] = useState(null)
  const location                    = useLocation()

  // If Bell sent us here with a pre-selected notification → open modal immediately
  useEffect(() => {
    if (location.state?.selectedId) {
      setSelectedId(location.state.selectedId)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  // Escape key closes modal
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') setSelectedId(null) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  // ── Derived ──
  const filtered = notifications.filter((n) => {
    if (filter === 'All')    return true
    if (filter === 'Unread') return !n.read
    return n.type.toLowerCase() === filter.toLowerCase()
  })

  const selectedNotif = notifications.find((n) => n.id === selectedId)

  const handleSelect = (notif) => {
    readNotification(notif.id)   // mark read (optimistic + API)
    setSelectedId(notif.id)      // open modal
  }

  // ────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.appBg, fontFamily: FONT }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes modalIn {
          from { opacity:0; transform:translate(-50%,-46%) scale(0.95); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }

        .np-fade       { animation: fadeUp 0.2s ease both; }
        .np-row        { transition: background 0.15s, box-shadow 0.15s; cursor: pointer; }
        .np-row:hover  { background: #eef0ff !important; box-shadow: inset 3px 0 0 ${C.primary}; }
        .np-ftab       { transition: all 0.15s; cursor: pointer; border: none; font-family:${FONT}; border-radius: 8px; padding: 6px 14px; font-size: 13px; font-weight: 600; }
        .np-ftab:hover { background: ${C.primaryBg} !important; color: ${C.primaryHov} !important; }
        .np-markall:hover { background: #dde4ff !important; }
        .np-reply:hover   { background: ${C.primaryHov} !important; }
        .np-arch:hover    { background: #e5e7eb !important; }
        .np-refresh:hover { background: ${C.primaryBg} !important; }

        /* Modal scrollbar */
        .np-msc::-webkit-scrollbar       { width: 5px; }
        .np-msc::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 6px; }

        /* Page scrollbar */
        .np-lsc::-webkit-scrollbar       { width: 4px; }
        .np-lsc::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
      `}</style>

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar />

        <div className="np-lsc" style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* ── Page Header ── */}
          <div className="np-fade" style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            marginBottom: 24,
          }}>
            <div>
              <h1 style={{
                fontSize: 22, fontWeight: 800, color: C.heading,
                margin: 0, letterSpacing: '-0.4px',
              }}>
                Notifications
              </h1>
              <p style={{ fontSize: 12, color: C.light, margin: '4px 0 0' }}>
                {loading
                  ? 'Fetching notifications…'
                  : error
                    ? '⚠️ Could not load notifications'
                    : unreadCount > 0
                      ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                      : 'All caught up! ✓'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {/* Refresh */}
              <button
                className="np-refresh"
                onClick={refresh}
                disabled={loading}
                title="Refresh"
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 500, color: C.muted,
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 9, padding: '7px 14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: FONT, transition: 'background 0.15s',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <RefreshCw
                  size={13}
                  style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }}
                />
                Refresh
              </button>

              {/* Mark all read */}
              {unreadCount > 0 && (
                <button
                  className="np-markall"
                  onClick={markAllRead}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 13, fontWeight: 600, color: C.primary,
                    background: C.primaryBg, border: `1px solid ${C.primaryBdr}`,
                    borderRadius: 9, padding: '8px 16px',
                    cursor: 'pointer', fontFamily: FONT, transition: 'background 0.15s',
                  }}
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* ── Filter Tabs ── */}
          <div className="np-fade" style={{
            display: 'flex', gap: 4, flexWrap: 'wrap',
            marginBottom: 20,
            background: C.card, borderRadius: 11,
            padding: '5px 6px', width: 'fit-content',
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            {FILTERS.map((f) => {
              const active = filter === f
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="np-ftab"
                  style={{
                    background: active ? C.primary : 'transparent',
                    color:      active ? '#fff'    : C.muted,
                  }}
                >
                  {f}
                  {f === 'Unread' && unreadCount > 0 && (
                    <span style={{
                      marginLeft: 6,
                      background: active ? 'rgba(255,255,255,0.3)' : C.danger,
                      color: '#fff', fontSize: 9, fontWeight: 700,
                      borderRadius: 20, padding: '1px 5px',
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Notification List Card ── */}
          <div style={{
            background: C.card, borderRadius: 16,
            border: `1px solid ${C.border}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}>

            {/* Loading skeleton */}
            {loading && (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', margin: '0 auto 12px',
                  border: `3px solid ${C.primaryBg}`,
                  borderTopColor: C.primary,
                  animation: 'spin 0.7s linear infinite',
                }} />
                <p style={{ fontSize: 13, color: C.light, margin: 0 }}>
                  Loading notifications…
                </p>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '48px 0',
              }}>
                <span style={{ fontSize: 32 }}>⚠️</span>
                <p style={{ fontSize: 14, color: C.muted, margin: '10px 0 16px' }}>
                  Failed to load notifications
                </p>
                <button
                  onClick={refresh}
                  style={{
                    fontSize: 13, fontWeight: 600, color: C.primary,
                    background: C.primaryBg, border: `1px solid ${C.primaryBdr}`,
                    borderRadius: 8, padding: '8px 20px',
                    cursor: 'pointer', fontFamily: FONT,
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && filtered.length === 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '64px 0',
              }}>
                <Inbox size={44} strokeWidth={1.2} color={C.light} />
                <p style={{ marginTop: 14, fontSize: 14, color: C.light }}>
                  {filter === 'Unread' ? 'No unread notifications' : 'No notifications here'}
                </p>
              </div>
            )}

            {/* ── Items ── */}
            {!loading && !error && filtered.map((n, i) => {
              const meta   = TYPE_META[n.type] || TYPE_META.system
              const Icon   = meta.icon
              const isLast = i === filtered.length - 1

              return (
                <div
                  key={n.id}
                  className="np-row np-fade"
                  onClick={() => handleSelect(n)}
                  style={{
                    animationDelay: `${Math.min(i * 0.035, 0.3)}s`,
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '16px 22px',
                    borderBottom: isLast ? 'none' : `1px solid ${C.borderLt}`,
                    background: n.read ? C.card : '#f8f7ff',
                    position: 'relative',
                  }}
                >
                  {/* Unread left bar */}
                  {!n.read && (
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: 3, background: C.primary,
                      borderRadius: '0 2px 2px 0',
                    }} />
                  )}

                  {/* Type icon */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: meta.bg,
                  }}>
                    <Icon size={19} color={meta.color} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: 12,
                    }}>
                      <p style={{
                        fontSize: 14,
                        fontWeight: n.read ? 500 : 700,
                        color: C.heading, margin: '0 0 4px',
                      }}>
                        {n.title}
                      </p>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 11, color: C.light, whiteSpace: 'nowrap' }}>
                          {n.time}
                        </span>
                        {!n.read && (
                          <span style={{
                            width: 8, height: 8, borderRadius: '50%',
                            background: C.danger, flexShrink: 0,
                          }} />
                        )}
                      </div>
                    </div>

                    <p style={{
                      fontSize: 13, color: C.muted, margin: '0 0 6px',
                      lineHeight: 1.55,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {n.preview}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Type badge */}
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: meta.color, background: meta.bg,
                        padding: '2px 8px', borderRadius: 20,
                        border: `1px solid ${meta.color}22`,
                      }}>
                        {meta.label}
                      </span>
                      {/* Sender */}
                      {n.fullContent?.from && (
                        <span style={{ fontSize: 11, color: C.light }}>
                          from {n.fullContent.from}
                        </span>
                      )}
                      {/* Read hint */}
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: 11, color: C.light,
                        fontStyle: 'italic',
                      }}>
                        {n.read ? '' : 'Click to read →'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Count info */}
          {!loading && filtered.length > 0 && (
            <p style={{
              textAlign: 'center', marginTop: 16,
              fontSize: 12, color: C.light,
            }}>
              Showing {filtered.length} of {notifications.length} notifications
            </p>
          )}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          NOTIFICATION DETAIL MODAL (POPUP)
          Opens when a notification is clicked
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {selectedNotif && (() => {
        const meta = TYPE_META[selectedNotif.type] || TYPE_META.system
        const Icon = meta.icon
        return (
          <>
            {/* Dark overlay */}
            <div
              onClick={() => setSelectedId(null)}
              style={{
                position: 'fixed', inset: 0, zIndex: 400,
                background: 'rgba(10,10,30,0.5)',
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* Modal */}
            <div
              className="np-msc"
              style={{
                position: 'fixed',
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 'min(700px, 94vw)',
                maxHeight: '90vh',
                overflowY: 'auto',
                background: C.card,
                borderRadius: 22,
                boxShadow: '0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(79,70,229,0.1)',
                zIndex: 401,
                fontFamily: FONT,
                animation: 'modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
              }}
            >
              {/* ── Modal Top Bar ── */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 22px',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                borderRadius: '22px 22px 0 0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: meta.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color={meta.color} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>
                      {meta.label} Notification
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                      {selectedNotif.fullContent.date || selectedNotif.time}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: 'rgba(255,255,255,0.12)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.8)',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                  title="Close (Esc)"
                >
                  <X size={16} />
                </button>
              </div>

              {/* ── Modal Body ── */}
              <div style={{ padding: '0 26px 26px' }}>

                {/* Subject + Sender */}
                <div style={{
                  padding: '22px 0 18px',
                  borderBottom: `1px solid ${C.borderLt}`,
                  marginBottom: 22,
                }}>
                  <h2 style={{
                    fontSize: 21, fontWeight: 800, color: C.heading,
                    margin: '0 0 16px', letterSpacing: '-0.4px', lineHeight: 1.3,
                  }}>
                    {selectedNotif.fullContent.subject || selectedNotif.title}
                  </h2>

                  {/* Sender row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: selectedNotif.avatarColor + '20',
                      border: `2px solid ${selectedNotif.avatarColor}35`,
                      fontSize: typeof selectedNotif.avatar === 'string'
                        && /^[A-Z]{1,2}$/.test(selectedNotif.avatar) ? 15 : 20,
                      fontWeight: 700,
                      color: selectedNotif.avatarColor,
                    }}>
                      {selectedNotif.avatar}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: C.heading, margin: 0 }}>
                        {selectedNotif.fullContent.from}
                      </p>
                      {selectedNotif.fullContent.email && (
                        <p style={{ fontSize: 12, color: C.light, margin: '2px 0 0' }}>
                          {selectedNotif.fullContent.email}
                        </p>
                      )}
                    </div>
                    <span style={{
                      marginLeft: 'auto',
                      fontSize: 11, fontWeight: 700,
                      background: meta.bg, color: meta.color,
                      padding: '4px 14px', borderRadius: 20,
                      border: `1px solid ${meta.color}25`,
                    }}>
                      {meta.label}
                    </span>
                  </div>
                </div>

                {/* ── Message Content ── */}
                <div style={{
                  background: '#f9fafb',
                  border: `1px solid ${C.borderLt}`,
                  borderRadius: 14,
                  padding: '22px 26px',
                  marginBottom: 20,
                  minHeight: 120,
                }}>
                  {(selectedNotif.fullContent.body || selectedNotif.preview)
                    .split('\n')
                    .map((line, idx) => {
                      const isEmpty    = line.trim() === ''
                      const isInfoLine = /^[📌📊📅💰⚠️🗓📍✅💬📋📚🏦💻🔔]/.test(line)
                      return (
                        <p key={idx} style={{
                          fontSize: 14, color: C.body,
                          fontWeight: isInfoLine ? 600 : 400,
                          lineHeight: 1.85, margin: 0,
                          minHeight: isEmpty ? 14 : undefined,
                          paddingLeft: isInfoLine ? 2 : 0,
                        }}>
                          {line || '\u00A0'}
                        </p>
                      )
                    })}
                </div>

                {/* ── Meta Info Strip ── */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '11px 16px',
                  background: C.primaryBg,
                  borderRadius: 11,
                  border: `1px solid ${C.primaryBdr}`,
                  marginBottom: 22,
                }}>
                  <Info size={14} color={C.primary} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.primary, fontWeight: 500 }}>
                    Received: {selectedNotif.fullContent.date || selectedNotif.time}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: 11, fontWeight: 700,
                    color: selectedNotif.read ? C.success : C.primary,
                    background: selectedNotif.read ? '#ecfdf5' : C.primaryBg,
                    border: `1px solid ${selectedNotif.read ? '#a7f3d0' : C.primaryBdr}`,
                    padding: '3px 12px', borderRadius: 20,
                  }}>
                    {selectedNotif.read ? '✓ Read' : '● Unread'}
                  </span>
                </div>

                {/* ── Action Buttons ── */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    className="np-reply"
                    style={{
                      padding: '10px 24px',
                      background: C.primary, color: '#fff',
                      border: 'none', borderRadius: 11,
                      fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: FONT,
                      transition: 'background 0.15s',
                    }}
                  >
                    ↩ Reply
                  </button>
                  <button
                    className="np-arch"
                    style={{
                      padding: '10px 24px',
                      background: '#f3f4f6', color: C.muted,
                      border: 'none', borderRadius: 11,
                      fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: FONT,
                      transition: 'background 0.15s',
                    }}
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => setSelectedId(null)}
                    style={{
                      padding: '10px 20px', marginLeft: 'auto',
                      background: 'transparent', color: C.muted,
                      border: `1px solid ${C.border}`, borderRadius: 11,
                      fontSize: 13, fontWeight: 500,
                      cursor: 'pointer', fontFamily: FONT,
                    }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </div>
  )
}