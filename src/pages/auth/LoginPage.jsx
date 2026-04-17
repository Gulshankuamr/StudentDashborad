import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { normalizeRole } from '../../utils/role'
import { getDefaultRouteForRole } from '../../config/routeConfig'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ user_email: 'yash@gmail.com', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
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
        setError(res.message || 'Invalid credentials')
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* LEFT SECTION */}
      {/* <div className="hidden lg:flex w-7/12 bg-gradient-to-br from-[#eef2ff] via-[#f5f7ff] to-[#e0f2fe] relative flex-col p-12 -mt-8 justify-between"> */}
      <div className="hidden lg:flex w-7/12 relative flex-col p-12 -mt-8 justify-between 
bg-gradient-to-br from-[#ffffff] via-[#f8fcfc93] to-[#e5e7eb1e]">

        {/* TOP */}
        <div className="relative z-10">
          {/* LOGO IMAGE */}
          <img
            src="/logoconnectskool.png"
            alt="ConnectSkool"
            className="h-24 mb-10 object-contain drop-shadow-md"
          />

          <div className="space-y-3 -mt-8">
            <h4 className="text-[#3b82f6] font-semibold tracking-widest text-sm uppercase">
              Student Portal
            </h4>

            <h1 className="text-5xl font-extrabold text-[#000000] leading-tight">
              Welcome Back 👋 <br />
              <span className="text-[#174261]">Your Learning {''} <span className='text-[#000000]'> Dashboard</span></span>
            </h1>

            <p className="text-gray-600 text-lg max-w-md mt-4">
              Track your{" "}
              <span className="font-semibold text-gray-800">
                academics, attendance, exams, and fees
              </span>{" "}
              — everything in one place.
            </p>

            <p className="text-gray-900 italic text-sm mt-2">
              ✦ Stay organized. Stay ahead.
            </p>
          </div>
        </div>

        {/* CENTER VISUAL */}
       <div className="relative flex justify-center items-center py-6">
  
  <div className="relative w-80 h-80 rounded-full overflow-visible flex items-center justify-center">

    {/* PERFECT ROUND IMAGE */}
    <div className="w-full h-full rounded-full overflow-hidden shadow-xl border-4 border-white">
      <img
        src="/loginn.png"
        alt="Student Dashboard"
        className="w-full h-full object-cover"
      />
    </div>

    {/* TAGS (Clean Positioning) */}
   <FeatureTag text="My Profile" icon="👤" pos="top-0 -left-10" /> 
   <FeatureTag text="Homework" icon="📚" pos="top-0 -right-10" /> 
   <FeatureTag text="Attendance" icon="📅" pos="top-1/2 -left-20" /> 
   <FeatureTag text="Timetable" icon="⏰" pos="top-1/2 -right-20" /> 
   <FeatureTag text="My Fees" icon="💳" pos="bottom-0 -left-10" /> 
   <FeatureTag text="Results" icon="📊" pos="bottom-0 -right-10" />

  </div>
</div>

        {/* FOOTER */}
        <div className="text-gray-100 text-xs flex justify-between py-2">
          <span>© 2026 ConnectSkool</span>
          <div className="space-x-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-white">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Welcome Back <span className="animate-bounce">👋</span>
            </h2>
            <p className="text-gray-500 mt-1">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email / Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">✉️</span>
                <input
                  type="email"
                  name="user_email"
                  value={form.user_email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-[#f1f5f9] rounded-xl 
                  focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-xs text-blue-600 font-bold hover:underline">
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-[#f1f5f9] rounded-xl 
                  focus:ring-2 focus:ring-blue-500 outline-none text-black placeholder-gray-400"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CHECKBOX */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <label className="text-sm text-gray-600">Remember Me</label>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : "Login to Dashboard →"}
            </button>
          </form>

          {/* INFO BOX */}
          {/* <div className="mt-8 p-5 bg-[#eff6ff] rounded-2xl border border-blue-100 flex gap-4">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <ShieldCheck className="text-blue-600" size={20} />
            </div>
            <div>
              <h5 className="text-blue-900 font-bold text-sm">
                Role-based Dashboard Access
              </h5>
              <p className="text-blue-700/70 text-xs mt-1">
                You'll be redirected based on your role.
              </p>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  )
}

/* Feature Tag */
function FeatureTag({ text, icon, pos }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`absolute ${pos} bg-white/80 backdrop-blur-md px-4 py-2 
      rounded-full shadow-lg flex items-center gap-2 border border-white/40 
      text-xs font-medium text-gray-700 hover:scale-105`}
    >
      <span>{icon}</span>
      {text}
    </motion.div>
  )
}