// src/config/sidebarConfig.js
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Wallet,
  Calendar,
  DollarSign,
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
  Bell,
  GraduationCap,
  BookMarked,
  UserCircle2,
  BookCheck,
  ClipboardList,
  IdCard,
} from 'lucide-react'

// ─── ADMIN MENU ───────────────────────────────────────────────
export const adminMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
    hasDropdown: false,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/notifications',
    hasDropdown: false,
  },
  {
    id: 'students',
    label: 'Students',
    icon: Users,
    hasDropdown: true,
    subItems: [
      { id: 'student-list', label: 'All Students', path: '/admin/students' },
      { id: 'add-student',  label: 'Add Student',  path: '/admin/students/add' },
    ],
  },
  {
    id: 'teachers',
    label: 'Teachers',
    icon: BookOpen,
    hasDropdown: true,
    subItems: [
      { id: 'teacher-list', label: 'All Teachers', path: '/admin/teachers' },
      { id: 'add-teacher',  label: 'Add Teacher',  path: '/admin/teachers/add' },
    ],
  },
  {
    id: 'accountants',
    label: 'Accountants',
    icon: Wallet,
    hasDropdown: true,
    subItems: [
      { id: 'accountant-list', label: 'All Accountants', path: '/admin/accountants' },
      { id: 'add-accountant',  label: 'Add Accountant',  path: '/admin/accountants/add' },
    ],
  },
  {
    id: 'classes',
    label: 'Classes',
    icon: Calendar,
    path: '/admin/classes',
    hasDropdown: false,
  },
  {
    id: 'sections',
    label: 'Sections',
    icon: BarChart3,
    path: '/admin/sections',
    hasDropdown: false,
  },
  {
    id: 'subjects',
    label: 'Subjects',
    icon: BookMarked,
    path: '/admin/subjects',
    hasDropdown: false,
  },
  {
    id: 'fees',
    label: 'Fees',
    icon: DollarSign,
    path: '/admin/fees',
    hasDropdown: false,
  },
  {
    id: 'student-attendance',
    label: 'Student Attendance',
    icon: ClipboardCheck,
    path: '/admin/student-attendance',
    hasDropdown: false,
  },
  {
    id: 'teacher-attendance',
    label: 'Teacher Attendance',
    icon: ClipboardCheck,
    path: '/admin/teacher-attendance',
    hasDropdown: false,
  },
  {
    id: 'accountant-attendance',
    label: 'Accountant Attendance',
    icon: ClipboardCheck,
    path: '/admin/accountant-attendance',
    hasDropdown: false,
  },
  {
    id: 'exams',
    label: 'Exams',
    icon: FileText,
    path: '/admin/exams',
    hasDropdown: false,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    path: '/admin/reports',
    hasDropdown: false,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircle2,
    path: '/profile',
    hasDropdown: false,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings',
    hasDropdown: false,
  },
]

// ─── STUDENT MENU ─────────────────────────────────────────────
// Order: Dashboard → Profile → Academics → Finance → Misc
export const studentMenuItems = [

  // ── 1. Home ───────────────────────────────────────────────
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/student/dashboard',
    hasDropdown: false,
  },

  // ── 2. Profile ────────────────────────────────────────────
  {
    id: 'my-profile',
    label: 'My Profile',
    icon: IdCard,
    path: '/student/profile',
    hasDropdown: false,
  },

  // ── 3. Academics ──────────────────────────────────────────
  {
    id: 'subjects',
    label: 'My Subjects',
    icon: BookMarked,
    path: '/student/subjects',
    hasDropdown: false,
  },
  {
    id: 'homework',
    label: 'Homework',
    icon: BookCheck,
    path: '/student/homework',
    hasDropdown: false,
  },
  {
    id: 'attendance',
    label: 'My Attendance',
    icon: ClipboardCheck,
    path: '/student/attendance',
    hasDropdown: false,
  },
  {
    id: 'exams',
    label: 'Exams',
    icon: ClipboardList,
    path: '/student/exams',
    hasDropdown: false,
  },
  {
    id: 'results',
    label: 'Results',
    icon: GraduationCap,
    path: '/student/results',
    hasDropdown: false,
  },

  // ── 4. Finance ────────────────────────────────────────────
  {
    id: 'fees',
    label: 'My Fees',
    icon: DollarSign,
    path: '/student/fees',
    hasDropdown: false,
  },

  // ── 5. Misc ───────────────────────────────────────────────
  {
    id: 'notifications',                   
    label: 'Notifications',
    icon: Bell,
    path: '/notifications',
    hasDropdown: false,
  },
]

// ─── Helper ───────────────────────────────────────────────────
export const getMenuByRole = (role) => {
  switch (role) {
    case 'admin':   return adminMenuItems
    case 'student': return studentMenuItems
    default:        return []
  }
}