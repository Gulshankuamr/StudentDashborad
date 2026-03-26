// src/pages/admin/AdminDashboard.jsx
import Sidebar from '../../components/Sidebar'
import Navbar  from '../../components/Navbar'
import { Activity, DollarSign, TrendingUp, Users, BookOpen, ClipboardCheck, GraduationCap, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const StatCard = ({ title, value, change, icon: Icon, iconBg, iconColor, trend }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <ArrowUpRight className="w-3 h-3" />
        {trend}
      </span>
    </div>
    <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
    <p className="text-sm text-gray-400 font-medium">{title}</p>
  </div>
)

const QuickLink = ({ label, path, icon: Icon, color }) => {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center gap-3 p-4 rounded-xl border hover:shadow-sm transition-all text-left w-full
        ${color}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}

const ActivityRow = ({ title, time, badge, badgeColor }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor}`}>{badge}</span>
  </div>
)

export default function AdminDashboard() {
  const { user } = useAuth()
  const firstName = user?.name?.split(' ')[0] || 'Admin'

  const stats = [
    { title: 'Total Students', value: '1,250', trend: '12%', icon: Users,        iconBg: 'bg-blue-50',   iconColor: 'text-blue-600'   },
    { title: 'Active Teachers', value: '48',   trend: '3%',  icon: BookOpen,     iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
    { title: 'Fee Collected',  value: '₹3.45L', trend: '18%', icon: DollarSign,  iconBg: 'bg-emerald-50',iconColor: 'text-emerald-600'},
    { title: 'Attendance Today',value: '94%',  trend: '2%',  icon: ClipboardCheck,iconBg:'bg-orange-50', iconColor: 'text-orange-600' },
  ]

  const quickLinks = [
    { label: 'Add Student',    path: '/admin/students/add',      icon: Users,      color: 'bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100'     },
    { label: 'Mark Attendance', path: '/admin/attendance',       icon: ClipboardCheck,color:'bg-green-50 border-green-100 text-green-700 hover:bg-green-100' },
    { label: 'Collect Fee',    path: '/admin/fees-payment/collect',icon: DollarSign,color:'bg-violet-50 border-violet-100 text-violet-700 hover:bg-violet-100'},
    { label: 'Create Homework',path: '/admin/homework/create',   icon: BookOpen,   color: 'bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100'},
    { label: 'Create Exam',    path: '/admin/exams/add',         icon: GraduationCap,color:'bg-pink-50 border-pink-100 text-pink-700 hover:bg-pink-100'      },
    { label: 'View Reports',   path: '/admin/reports',           icon: Activity,   color: 'bg-cyan-50 border-cyan-100 text-cyan-700 hover:bg-cyan-100'       },
  ]

  const activities = [
    { title: 'New student enrolled — Rahul Sharma', time: '2 hours ago', badge: 'New',     badgeColor: 'bg-green-100 text-green-700'  },
    { title: 'Fee payment received — ₹12,500',      time: '4 hours ago', badge: 'Payment', badgeColor: 'bg-blue-100 text-blue-700'    },
    { title: 'System backup completed',             time: '6 hours ago', badge: 'System',  badgeColor: 'bg-gray-100 text-gray-600'    },
    { title: 'Exam timetable published',            time: '1 day ago',   badge: 'Exams',   badgeColor: 'bg-orange-100 text-orange-700'},
  ]

  return (
    <div className="flex min-h-screen bg-gray-50/80" style={{ fontFamily: "'DM Sans','Nunito',sans-serif" }}>
      <Sidebar />

      <div className="flex-1 lg:ml-64">
        <Navbar />

        <main className="p-6">

          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Good morning, {firstName}! 👋
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Here's your school overview for today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {stats.map((s) => <StatCard key={s.title} {...s} />)}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                {quickLinks.map((l) => <QuickLink key={l.label} {...l} />)}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Recent Activity</h2>
              {activities.map((a) => <ActivityRow key={a.title} {...a} />)}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}