// src/pages/auth/LoginPage.jsx
// NO useEffect redirect here — LoginRedirect component handles that at route level
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { normalizeRole } from '../../utils/role'
import { getDefaultRouteForRole } from '../../config/routeConfig'
import {
  Eye, EyeOff, GraduationCap,
  CalendarCheck, Wallet, BarChart2, ClipboardList,
  Zap, ShieldCheck, Smartphone, LayoutGrid,
} from 'lucide-react'

const LEFT_CARDS = [
  { icon: CalendarCheck, label: 'Track Attendance',   sub: 'Daily & monthly view'      },
  { icon: Wallet,        label: 'Fees & Payments',    sub: 'Dues, receipts & history'  },
  { icon: BarChart2,     label: 'Results & Progress', sub: 'Grades, ranks & reports'   },
  { icon: ClipboardList, label: 'Assignments',         sub: 'Submit & track homework'   },
]

const RIGHT_CARDS = [
  { icon: Zap,         label: 'Fast & Easy Access', sub: 'One-click dashboard login' },
  { icon: ShieldCheck, label: 'Secure Dashboard',   sub: 'Role-based safe access'    },
  { icon: Smartphone,  label: 'Mobile Friendly',    sub: 'Works on any device'       },
  { icon: LayoutGrid,  label: 'All-in-One System',  sub: 'Everything in one place'   },
]

function SideCard({ icon: Icon, label, sub, delay = 0 }) {
  return (
    <div className="side-card" style={{ animationDelay: `${delay}ms` }}>
      <div className="side-card-icon">
        <Icon size={16} />
      </div>
      <div>
        <p className="side-card-label">{label}</p>
        <p className="side-card-sub">{sub}</p>
      </div>
    </div>
  )
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
        navigate(getDefaultRouteForRole(role), { replace: true })
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .erp-root  { font-family: 'DM Sans', sans-serif; }
        .erp-title { font-family: 'Syne', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardPop {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bannerIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .banner-anim { animation: bannerIn 0.45s ease both; }
        .card-pop    { animation: cardPop 0.55s cubic-bezier(.22,.68,0,1.2) 0.1s both; }

        .side-card {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          background: #fff;
          border: 1px solid #ede9fe;
          border-radius: 14px;
          padding: 0.85rem 1rem;
          box-shadow: 0 2px 10px rgba(109,40,217,0.06);
          animation: fadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          cursor: default;
        }
        .side-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(109,40,217,0.13);
          border-color: #c4b5fd;
        }
        .side-card-icon {
          flex-shrink: 0;
          width: 34px; height: 34px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #ede9fe, #ddd6fe);
          color: #7c3aed;
        }
        .side-card-label { font-size: 0.82rem; font-weight: 600; color: #1f2937; line-height: 1.3; }
        .side-card-sub   { font-size: 0.71rem; color: #9ca3af; margin-top: 1px; }

        .side-heading {
          font-family: 'Syne', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: #6d28d9;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .side-heading::before {
          content: '';
          display: inline-block;
          width: 3px; height: 16px;
          border-radius: 2px;
          background: linear-gradient(180deg, #7c3aed, #4f46e5);
          flex-shrink: 0;
        }

        .erp-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #f9fafb;
          color: #111827;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }
        .erp-input::placeholder { color: #9ca3af; }
        .erp-input:focus {
          border-color: #7c3aed;
          background: #fff;
          box-shadow: 0 0 0 3.5px rgba(124,58,237,0.12);
        }

        .erp-btn {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          box-shadow: 0 5px 20px rgba(124,58,237,0.35);
          transition: filter 0.18s, transform 0.14s, box-shadow 0.18s;
        }
        .erp-btn:hover:not(:disabled) {
          filter: brightness(1.08);
          box-shadow: 0 8px 28px rgba(124,58,237,0.45);
        }
        .erp-btn:active:not(:disabled) { transform: scale(0.975); }
        .erp-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div
        className="erp-root min-h-screen flex flex-col relative overflow-hidden"
        style={{ background: '#f5f3ff' }}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(109,40,217,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(109,40,217,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ── HEADER BANNER ── */}
        <div
          className="banner-anim relative w-full flex-shrink-0 overflow-hidden"
          style={{
            height: 220,
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 55%, #4f46e5 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)',
              backgroundSize: '22px 22px',
            }}
          />
          {[
            { top: '15%', left: '6%',  s: 6 },
            { top: '62%', left: '12%', s: 4 },
            { top: '20%', left: '88%', s: 5 },
            { top: '70%', left: '80%', s: 7 },
            { top: '10%', left: '56%', s: 4 },
            { top: '75%', left: '44%', s: 5 },
          ].map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/40"
              style={{ top: d.top, left: d.left, width: d.s, height: d.s }}
            />
          ))}

          <div className="relative z-10 flex flex-col items-center justify-center h-full gap-3">
        <div className="flex items-center gap-4">

  <img
    src="/logoconnectskool.png"
    alt="ConnectSkool"
    className="h-25 w-auto object-contain drop-shadow-lg"
  />

  {/* <span className="text-white text-3xl font-extrabold tracking-wide">
    Connect<span className="text-yellow-300">Skool</span>
  </span> */}

</div>
          </div>

          <svg
            viewBox="0 0 1440 72"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 w-full"
            style={{ height: 72 }}
          >
            <path d="M0,36 C400,80 1040,-8 1440,36 L1440,72 L0,72 Z" fill="#f5f3ff" />
          </svg>
        </div>

        {/* ── 3-COLUMN BODY ── */}
        <div
          className="relative z-10 w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 pb-14"
          style={{ maxWidth: 1100, marginTop: -48 }}
        >

          {/* LEFT */}
          <div className="hidden md:flex flex-col justify-center pt-10">
            <p className="side-heading">Student Portal</p>
            <div className="flex flex-col gap-3">
              {LEFT_CARDS.map(({ icon, label, sub }, i) => (
                <SideCard key={label} icon={icon} label={label} sub={sub} delay={i * 75} />
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: '#a78bfa' }}>
              Everything you need to stay on top of your academic life — accessible anytime, anywhere.
            </p>
          </div>

          {/* CENTER — Login Card */}
          <div className="flex justify-center items-start">
            <div
              className="card-pop bg-white w-full rounded-2xl p-8"
              style={{
                maxWidth: 380,
                boxShadow: '0 8px 40px rgba(109,40,217,0.14)',
                border: '1px solid #ede9fe',
              }}
            >
              <h2 className="erp-title text-gray-900 font-bold mb-1" style={{ fontSize: '1.6rem' }}>
                Student Login
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                Sign in to access your dashboard
              </p>

              {error && (
                <div
                  className="flex items-start gap-2 text-sm px-4 py-3 rounded-xl mb-5"
                  style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
                >
                  <span className="mt-0.5 flex-shrink-0">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                <div>
                  <label htmlFor="erp-email" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                    Student Email or ID <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="erp-email"
                    type="email"
                    name="user_email"
                    placeholder="student@school.edu"
                    value={form.user_email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className="erp-input"
                  />
                </div>

                <div>
                  <label htmlFor="erp-pass" style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                    Password <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="erp-pass"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      required
                      className="erp-input"
                      style={{ paddingRight: '2.75rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      style={{
                        position: 'absolute', right: '0.75rem', top: '50%',
                        transform: 'translateY(-50%)', background: 'none',
                        border: 'none', cursor: 'pointer', color: '#7c3aed', padding: 0,
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', userSelect: 'none' }}>
                    <input type="checkbox" style={{ width: 15, height: 15, accentColor: '#7c3aed' }} />
                    <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Remember me</span>
                  </label>
                  <button
                    type="button"
                    tabIndex={-1}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, color: '#7c3aed' }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button type="submit" disabled={loading} className="erp-btn" style={{ marginTop: '0.4rem' }}>
                  {loading ? (
                    <>
                      <svg className="animate-spin" style={{ width: 15, height: 15 }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.25" />
                        <path fill="white" opacity="0.85" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Signing in…
                    </>
                  ) : 'Login →'}
                </button>
              </form>

              <p style={{ textAlign: 'center', fontSize: '0.76rem', color: '#9ca3af', marginTop: '1.1rem' }}>
                Trouble logging in?{' '}
                <span style={{ color: '#7c3aed', fontWeight: 600, cursor: 'pointer' }}>
                  Contact School Admin
                </span>
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '1.3rem' }}>
                <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
                <span style={{ fontSize: '0.68rem', color: '#d1d5db', whiteSpace: 'nowrap' }}>Powered by Sckool ERP</span>
                <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex flex-col justify-center pt-10">
            <p className="side-heading">Why Students Love It</p>
            <div className="flex flex-col gap-3">
              {RIGHT_CARDS.map(({ icon, label, sub }, i) => (
                <SideCard key={label} icon={icon} label={label} sub={sub} delay={i * 75 + 40} />
              ))}
            </div>
            <p className="mt-5 text-xs leading-relaxed" style={{ color: '#a78bfa' }}>
              Designed to keep students focused, organized, and in control of their entire school journey.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
