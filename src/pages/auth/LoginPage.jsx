// src/pages/auth/LoginPage.jsx
// NO useEffect redirect here — LoginRedirect component handles that at route level
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { normalizeRole } from '../../utils/role'
import { Eye, EyeOff, GraduationCap } from 'lucide-react'

const ROLE_ROUTES = {
  admin:   '/admin/dashboard',
  student: '/student/dashboard',
}

export default function LoginPage() {
  const navigate               = useNavigate()
  const { login }              = useAuth()

  const [form,         setForm        ] = useState({ user_email: '', password: '' })
  const [loading,      setLoading     ] = useState(false)
  const [error,        setError       ] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await loginUser(form)
      if (res.success) {
        login(res.data)
        const role = normalizeRole(res.data.user?.role)
        navigate(ROLE_ROUTES[role] || '/unauthorized', { replace: true })
      } else {
        setError(res.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 relative overflow-hidden">

      {/* ── Grid pattern background ─────────────────── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(160,160,190,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(160,160,190,0.15) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ── Purple Header Banner ─────────────────────── */}
      <div
        className="relative w-full flex-shrink-0 z-10 overflow-hidden"
        style={{
          height: 230,
          background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 55%, #5b21b6 100%)',
        }}
      >
        {/* Team photo overlay — swap url() with real image path */}
        {/* <div className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: 'url(/assets/team.jpg)' }} /> */}

        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-10 z-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
            backgroundSize: '22px 22px',
          }}
        />

        {/* Floating sparkle dots */}
        {[
          { top: '16%', left: '7%',  size: 6 },
          { top: '60%', left: '13%', size: 4 },
          { top: '22%', left: '87%', size: 5 },
          { top: '72%', left: '79%', size: 7 },
          { top: '10%', left: '57%', size: 4 },
          { top: '78%', left: '43%', size: 5 },
        ].map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/50 z-10"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
          />
        ))}

        {/* Logo + Welcome */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-white text-3xl font-extrabold tracking-widest uppercase">
              LOGO
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white text-sm font-medium px-5 py-2 rounded-full">
            Hello 👋 Welcome!
          </div>
        </div>

        {/* Wave bottom curve */}
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full z-20"
          style={{ height: 72 }}
        >
          <path d="M0,36 C400,80 1040,-8 1440,36 L1440,72 L0,72 Z" fill="#f3f4f6" />
        </svg>
      </div>

      {/* ── Card wrapper ─────────────────────────────── */}
      <div
        className="relative z-10 flex items-end justify-center px-4 pb-16"
        style={{ marginTop: -52 }}
      >

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-gray-100">

          <h2 className="text-2xl font-bold text-gray-900 mb-1">LogIn</h2>
          <p className="text-gray-400 text-sm mb-6">Please login to admin dashboard</p>

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              <span className="mt-0.5 flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* ── Email field ── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email/Username<span className="text-red-400 ml-0.5">*</span>
              </label>
              <input
                type="email"
                name="user_email"
                placeholder="Admin@gmail.com"
                value={form.user_email}
                onChange={handleChange}
                autoComplete="email"
                required
                className="
                  w-full px-4 py-3 rounded-xl border border-gray-200
                  bg-gray-50 text-gray-900 placeholder-gray-400
                  text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-violet-500
                  focus:border-transparent focus:bg-white transition-all
                "
              />
            </div>

            {/* ── Password field ── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password<span className="text-red-400 ml-0.5">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                  className="
                    w-full px-4 py-3 pr-11 rounded-xl border border-gray-200
                    bg-gray-50 text-gray-900 placeholder-gray-400
                    text-sm font-medium
                    focus:outline-none focus:ring-2 focus:ring-violet-500
                    focus:border-transparent focus:bg-white transition-all
                  "
                />
                {/* Always-visible eye toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-violet-500 hover:text-violet-700 transition-colors focus:outline-none"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye    className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* ── Remember me + Forgot password ── */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded accent-violet-600"
                />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <button
                type="button"
                tabIndex={-1}
                className="text-xs text-violet-600 hover:text-violet-800 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-3 rounded-xl text-white font-bold text-sm
                transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed
                hover:brightness-110 active:scale-[0.98]
              "
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                boxShadow: '0 4px 18px rgba(124,58,237,0.38)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" />
                    <path fill="white" opacity="0.85" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>

          </form>
        </div>

        {/* ── 3-D Character slot ──────────────────────────
            Uncomment and drop your PNG in /public/assets/character.png
        ────────────────────────────────────────────────── */}
        {/*
        <div className="hidden md:block absolute right-[calc(50%-340px)] bottom-16
                        w-44 h-72 pointer-events-none select-none z-20">
          <img
            src="/assets/character.png"
            alt="Welcome character"
            className="w-full h-full object-contain drop-shadow-xl"
          />
        </div>
        */}

      </div>
    </div>
  )
}