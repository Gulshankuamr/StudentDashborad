// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📁 src/components/NotificationBell.jsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, BookOpen, Star, AlertTriangle, Inbox } from 'lucide-react'
import { useNotifications } from '../context/NotificationContext'

// ── Design Tokens ──────────────────────────
const C = {
  primary:    '#4f46e5',
  primaryHov: '#4338ca',
  primaryBg:  '#eef2ff',
  primaryBdr: '#c7d2fe',
  card:       '#ffffff',
  heading:    '#111827',
  body:       '#374151',
  muted:      '#6b7280',
  light:      '#9ca3af',
  danger:     '#ef4444',
  success:    '#10b981',
  border:     '#e5e7eb',
  appBg:      '#f5f7fb',
}

const FONT = 'Inter,ui-sans-serif,system-ui,-apple-system,sans-serif'

const TYPE_META = {
  message: { icon: BookOpen,      bg: '#eef2ff', color: '#4f46e5' },
  grade:   { icon: Star,          bg: '#ecfdf5', color: '#059669' },
  alert:   { icon: AlertTriangle, bg: '#fffbeb', color: '#b45309' },
  system:  { icon: Bell,          bg: '#fef2f2', color: '#dc2626' },
}

const getNotifRoute = () => '/notifications'

export default function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    readNotification,
    markAllRead,
  } = useNotifications()

  const [open, setOpen]       = useState(false)
  const [showAll, setShowAll] = useState(false)
  const ref                   = useRef(null)
  const navigate              = useNavigate()

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setShowAll(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const displayed = showAll ? notifications : notifications.slice(0, 6)

  // Click on a notification item → mark read + go to full page with modal open
  const handleItemClick = (notif) => {
    readNotification(notif.id)
    setOpen(false)
    setShowAll(false)
    navigate(getNotifRoute(), { state: { selectedId: notif.id } })
  }

  // View All → go to full notifications page
  const handleViewAll = () => {
    setOpen(false)
    navigate(getNotifRoute())
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <style>{`
        @keyframes nbPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          60%      { box-shadow: 0 0 0 6px rgba(239,68,68,0); }
        }
        @keyframes nbDrop {
          from { opacity:0; transform:translateY(-10px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .nb-bell-btn:hover { background:${C.appBg} !important; }
        .nb-item:hover     { background:${C.primaryBg} !important; }
        .nb-item           { transition:background 0.15s; cursor:pointer; }
        .nb-more:hover     { background:${C.primaryBg} !important; color:${C.primaryHov} !important; }
        .nb-mread:hover    { color:${C.primaryHov} !important; }
        .nb-vall:hover     { background:#dde4ff !important; }
        .nb-sc::-webkit-scrollbar       { width:3px; }
        .nb-sc::-webkit-scrollbar-thumb { background:${C.border}; border-radius:4px; }
      `}</style>

      {/* ── Bell Button ─────────────────────── */}
      <button
        className="nb-bell-btn"
        onClick={() => { setOpen((p) => !p); setShowAll(false) }}
        style={{
          position: 'relative', width: 38, height: 38,
          borderRadius: 8, background: 'transparent',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
        }}
        aria-label="Notifications"
      >
        <Bell size={18} color={open ? C.primary : C.muted} strokeWidth={2} />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            minWidth: 18, height: 18,
            background: C.danger, color: '#fff',
            fontSize: 10, fontWeight: 700,
            borderRadius: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 4px', border: '2px solid #fff',
            fontFamily: FONT,
            animation: 'nbPulse 2s ease infinite',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ──────────────────── */}
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 10px)',
          width: 380,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: '0 12px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 1000, overflow: 'hidden',
          animation: 'nbDrop 0.2s cubic-bezier(0.22,1,0.36,1) both',
          fontFamily: FONT,
        }}>

          {/* ── Header ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px 12px',
            borderBottom: `1px solid ${C.border}`,
            background: '#fafbff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.heading }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  background: C.danger, color: '#fff',
                  borderRadius: 20, padding: '2px 7px',
                  lineHeight: 1.4,
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {unreadCount > 0 && (
                <button
                  className="nb-mread"
                  onClick={(e) => { e.stopPropagation(); markAllRead() }}
                  title="Mark all as read"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 11, fontWeight: 500, color: C.muted,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'color 0.15s', padding: '2px 4px',
                  }}
                >
                  <CheckCheck size={13} />
                  Mark all read
                </button>
              )}
              <button
                className="nb-vall"
                onClick={handleViewAll}
                style={{
                  fontSize: 11, fontWeight: 600, color: C.primary,
                  background: C.primaryBg, border: `1px solid ${C.primaryBdr}`,
                  borderRadius: 8, padding: '5px 11px', cursor: 'pointer',
                  fontFamily: 'inherit', transition: 'background 0.15s',
                }}
              >
                View all →
              </button>
            </div>
          </div>

          {/* ── Notification List ── */}
          <div
            className="nb-sc"
            style={{ maxHeight: 400, overflowY: 'auto' }}
          >
            {/* Loading state */}
            {loading && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 10, padding: '36px 0',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: `3px solid ${C.primaryBg}`,
                  borderTopColor: C.primary,
                  animation: 'spin 0.7s linear infinite',
                }} />
                <span style={{ fontSize: 12, color: C.light }}>Loading…</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {/* Empty state */}
            {!loading && notifications.length === 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '40px 0',
              }}>
                <Inbox size={36} strokeWidth={1.2} color={C.light} />
                <p style={{ margin: '10px 0 0', fontSize: 13, color: C.light }}>
                  No notifications yet
                </p>
              </div>
            )}

            {/* Items */}
            {!loading && displayed.map((n) => {
              const meta = TYPE_META[n.type] || TYPE_META.system
              const Icon = meta.icon
              return (
                <div
                  key={n.id}
                  className="nb-item"
                  onClick={() => handleItemClick(n)}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '12px 16px',
                    borderBottom: `1px solid #f3f4f6`,
                    background: n.read ? C.card : '#f5f3ff',
                    position: 'relative',
                  }}
                >
                  {/* Unread left accent */}
                  {!n.read && (
                    <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: 3, background: C.primary,
                      borderRadius: '0 2px 2px 0',
                    }} />
                  )}

                  {/* Icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: meta.bg,
                  }}>
                    <Icon size={16} color={meta.color} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex', alignItems: 'flex-start',
                      justifyContent: 'space-between', gap: 8,
                    }}>
                      <span style={{
                        fontSize: 12, fontWeight: n.read ? 500 : 700,
                        color: C.heading,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', maxWidth: 200,
                        display: 'block',
                      }}>
                        {n.title}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: C.light, whiteSpace: 'nowrap' }}>
                          {n.time}
                        </span>
                        {!n.read && (
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: C.danger, flexShrink: 0,
                          }} />
                        )}
                      </div>
                    </div>
                    <p style={{
                      fontSize: 11, color: C.muted,
                      margin: '3px 0 0',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {n.preview}
                    </p>
                    {/* From sender */}
                    {n.fullContent?.from && (
                      <span style={{
                        display: 'inline-block', marginTop: 4,
                        fontSize: 10, color: C.light,
                        background: '#f3f4f6', borderRadius: 4,
                        padding: '1px 6px',
                      }}>
                        From: {n.fullContent.from}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Show More ── */}
          {!loading && !showAll && notifications.length > 6 && (
            <button
              className="nb-more"
              onClick={() => setShowAll(true)}
              style={{
                width: '100%', padding: '12px',
                background: '#fafafa',
                border: 'none', borderTop: `1px solid ${C.border}`,
                fontSize: 12, fontWeight: 600, color: C.muted,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s',
              }}
            >
              Show {notifications.length - 6} more notifications ↓
            </button>
          )}

          {/* ── Footer ── */}
          {!loading && notifications.length > 0 && (
            <div style={{
              padding: '10px 16px',
              borderTop: `1px solid ${C.border}`,
              background: '#fafbff',
              textAlign: 'center',
            }}>
              <button
                onClick={handleViewAll}
                style={{
                  fontSize: 12, fontWeight: 600, color: C.primary,
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Open full notifications page →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
