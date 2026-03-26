// src/components/Sidebar.jsx
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, GraduationCap, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { adminMenuItems, studentMenuItems } from '../config/sidebarConfig'

const Sidebar = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [collapsed, setCollapsed] = useState(false)

  const menuItems =
    user?.role === 'admin'   ? adminMenuItems   :
    user?.role === 'student' ? studentMenuItems : []

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
      } bg-white border-r border-gray-100 min-h-screen flex flex-col transition-all duration-300 ease-in-out shadow-sm`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-[18px] border-b border-gray-100 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0">
          <GraduationCap className="text-white w-5 h-5" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="font-bold text-gray-800 text-sm leading-tight whitespace-nowrap">
              SchoolPro
            </p>
            <p className="text-xs text-gray-400 whitespace-nowrap">{panelLabel}</p>
          </div>
        )}
        <button
          onClick={() => {
            if (!collapsed) setOpenDropdowns({})
            setCollapsed((p) => !p)
          }}
          className={`${collapsed ? 'mx-auto' : 'ml-auto'} w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex-shrink-0`}
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
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