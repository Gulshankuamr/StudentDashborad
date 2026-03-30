// src/components/Sidebar.jsx
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getMenuByRole } from '../config/sidebarConfig'

// ── Import your logo ──────────────────────────────────────────
// Put your logo file at: src/assets/logo.png  (or .svg / .webp)
// Then import it here:


const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = getMenuByRole(user?.role)

  const panelLabel =
    user?.role === 'admin'   ? 'Admin Panel'   :
    user?.role === 'student' ? 'Student Panel' : 'Panel'

  const toggleDropdown = (id) => {
    if (collapsed) {
      setCollapsed(false)
      setOpenDropdowns({ [id]: true })
      return
    }
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div
      className={`${
        collapsed ? 'w-[72px]' : 'w-64'
      } sticky top-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
    >
      {/* ── Header ──────────────────────────────────────────── */}
      <div className={`flex items-center px-4 py-4 border-b border-gray-100 flex-shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>

        {/* Logo image */}
        {/* <img
          src="/logoconnectskool.png"
          alt="ConnectSkool Logo"
          className="w-14 h-14 object-contain flex-shrink-0"
        /> */}

        {/* Brand text */}
        {!collapsed && (
          <div className="flex-1 min-w-0 flex flex-col leading-tight">
            <span className="text-sm font-extrabold text-gray-800 tracking-wide truncate">
              Connect<span className="text-violet-600">Skool</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium truncate">
              {panelLabel}
            </span>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => {
            if (!collapsed) setOpenDropdowns({})
            setCollapsed((p) => !p)
          }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition flex-shrink-0"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isOpen = openDropdowns[item.id]
          const isActive = item.path
            ? location.pathname === item.path
            : item.subItems?.some((s) => location.pathname === s.path)

          if (item.hasDropdown) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => toggleDropdown(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-violet-50 text-violet-600'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  )}
                </button>

                {!collapsed && isOpen && (
                  <div className="ml-4 mt-0.5 pl-4 border-l border-gray-100 space-y-0.5 mb-1">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.id}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-violet-50 text-violet-600'
                              : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-violet-50 text-violet-600'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                } ${collapsed ? 'justify-center' : ''}`
              }
            >
              <Icon className="w-[18px] h-[18px] flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

export default Sidebar