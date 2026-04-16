import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Menu, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMenuByRole } from '../config/sidebarConfig'
import { routeConfigByKey } from '../config/routeConfig'
import { hasPermission } from '../utils/permission'

const SECTION_IDS = {
  Main: ['dashboard', 'my-profile'],
  Academics: ['homework', 'attendance', 'school-timetable', 'exam-timetable'],
  Finance: ['fees'],
  Records: ['admit-card', 'marksheet'],
  Other: ['notifications'],
}

const roleMeta = {
  student: { label: 'Student', color: '#7c3aed', bg: '#ede9fe' },
  school_admin: { label: 'School Admin', color: '#0369a1', bg: '#e0f2fe' },
}

const isPathActive = (pathname, item) => {
  if (!item.path) return false
  if (pathname === item.path) return true
  if (!item.matchPrefix) return false
  return pathname.startsWith(`${item.path}/`)
}

const resolveMenuItem = (item) => {
  const route = item.routeKey ? routeConfigByKey[item.routeKey] : null

  return {
    ...item,
    path: item.path || route?.path || '',
    permission: item.permission ?? route?.requiredPermission ?? null,
  }
}

const Avatar = ({ name = '', size = 32 }) => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 700,
        fontSize: size * 0.35,
      }}
    >
      {initials || '?'}
    </div>
  )
}

const Sidebar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const panelLabel =
    user?.role === 'school_admin' ? 'Admin Panel' :
    user?.role === 'student' ? 'Student Panel' :
    'Panel'

  const menuItems = useMemo(() => {
    const items = (getMenuByRole(user?.role) || []).map(resolveMenuItem)
    return items.filter((item) => hasPermission(user?.permissions, item.permission))
  }, [user?.role, user?.permissions])

  const grouped = useMemo(() => (
    Object.entries(SECTION_IDS)
      .map(([section, ids]) => ({
        section,
        items: menuItems.filter((item) => ids.includes(item.id)),
      }))
      .filter(({ items }) => items.length > 0)
  ), [menuItems])

  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        height: '100vh',
        background: '#fff',
        borderRight: '1px solid #f3f4f6',
        transition: 'width 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '16px 0' : '16px 14px',
          borderBottom: '1px solid #f3f4f6',
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
              }}
            >
              C
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>
                Connect<span style={{ color: '#7c3aed' }}>Skool</span>
              </p>
              <p style={{ margin: 0, fontSize: 10, color: '#9ca3af' }}>{panelLabel}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: '1px solid #f3f4f6',
            background: '#fff',
            color: '#9ca3af',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu style={{ width: 15, height: 15 }} />
        </button>
      </div>

      <div style={{ padding: collapsed ? '10px 0' : '12px 10px 0' }}>
        {collapsed ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar name={user?.name || ''} size={36} />
          </div>
        ) : (
          <div
            style={{
              padding: '10px 12px',
              background: '#faf9ff',
              borderRadius: 10,
              border: '1px solid #ede9fe',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Avatar name={user?.name || ''} size={34} />
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#111827',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.name || 'User'}
              </p>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '2px 7px',
                  borderRadius: 20,
                  background: roleMeta[user?.role]?.bg || '#f3f4f6',
                  color: roleMeta[user?.role]?.color || '#6b7280',
                }}
              >
                {roleMeta[user?.role]?.label || user?.role || 'User'}
              </span>
            </div>
          </div>
        )}
      </div>

      <nav
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: collapsed ? '8px' : '8px 10px',
        }}
      >
        {grouped.map(({ section, items }) => (
          <div key={section}>
            {collapsed ? (
              <div
                style={{
                  height: 1,
                  background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
                  margin: '8px 12px',
                }}
              />
            ) : (
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#d1d5db',
                  padding: '12px 12px 4px',
                  margin: 0,
                }}
              >
                {section}
              </p>
            )}

            {items.map((item) => {
              const Icon = item.icon
              const active = isPathActive(location.pathname, item)

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: collapsed ? '9px 0' : '9px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    borderRadius: 10,
                    textDecoration: 'none',
                    fontSize: 13.5,
                    fontWeight: 500,
                    marginBottom: 2,
                    background: active ? 'linear-gradient(90deg, #ede9fe 0%, #f5f3ff 100%)' : 'transparent',
                    color: active ? '#6d28d9' : '#4b5563',
                    position: 'relative',
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '20%',
                        bottom: '20%',
                        width: 3,
                        borderRadius: '0 3px 3px 0',
                        background: 'linear-gradient(180deg, #7c3aed, #a855f7)',
                      }}
                    />
                  )}
                  <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      <div
        style={{
          padding: collapsed ? '12px 8px' : '12px 10px',
          borderTop: '1px solid #f3f4f6',
        }}
      >
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: collapsed ? '9px 0' : '9px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            width: '100%',
            borderRadius: 10,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: 500,
            color: '#ef4444',
          }}
        >
          <LogOut style={{ width: 17, height: 17, flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
