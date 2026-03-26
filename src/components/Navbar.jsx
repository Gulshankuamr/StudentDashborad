// src/components/Navbar.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, UserCircle2, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const roleLabel =
    user?.role === 'admin'      ? 'School Admin' :
    user?.role === 'student'    ? 'Student'       :
    user?.role === 'teacher'    ? 'Teacher'       :
    user?.role === 'accountant' ? 'Accountant'    : ''

  // Close dropdown on outside click
  useEffect(() => {
    const fn = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpenMenu(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left */}
      <div />

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <NotificationBell />
        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* User Dropdown */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpenMenu((p) => !p)}
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[13px] font-semibold text-gray-800 leading-tight">{user?.name}</p>
              <p className="text-[11px] text-gray-400 capitalize">{roleLabel}</p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                openMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-50">
                <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
                <p className="text-[11px] text-gray-400 capitalize">{roleLabel}</p>
              </div>
              <div className="p-1.5">
                <Link
                  to="/student/profile"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-[13px] text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UserCircle2 className="h-4 w-4" />
                  My Profile
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar