import {
  LayoutDashboard,
  Bell,
  CalendarDays,
  DollarSign,
  ClipboardCheck,
  FileText,
  IdCard,
  BookCheck,
  ClipboardList,
} from 'lucide-react'
import { ROUTE_KEYS } from './routeConfig'

const getStudentMenuItems = () => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    routeKey: ROUTE_KEYS.DASHBOARD,
  },
  {
    id: 'my-profile',
    label: 'My Profile',
    icon: IdCard,
    routeKey: ROUTE_KEYS.PROFILE,
  },
  {
    id: 'homework',
    label: 'Homework',
    icon: BookCheck,
    routeKey: ROUTE_KEYS.HOMEWORK_LIST,
    matchPrefix: true,
  },
  {
    id: 'attendance',
    label: 'My Attendance',
    icon: ClipboardCheck,
    routeKey: ROUTE_KEYS.ATTENDANCE,
  },
  {
    id: 'school-timetable',
    label: 'School Timetable',
    icon: CalendarDays,
    routeKey: ROUTE_KEYS.SCHOOL_TIMETABLE,
  },
  {
    id: 'exam-timetable',
    label: 'Exam Timetable',
    icon: CalendarDays,
    routeKey: ROUTE_KEYS.EXAM_TIMETABLE,
  },
  {
    id: 'fees',
    label: 'My Fees',
    icon: DollarSign,
    routeKey: ROUTE_KEYS.FEES,
  },
  {
    id: 'admit-card',
    label: 'Admit Card',
    icon: FileText,
    routeKey: ROUTE_KEYS.ADMIT_CARD,
  },
  {
    id: 'marksheet',
    label: 'Marksheet',
    icon: ClipboardList,
    routeKey: ROUTE_KEYS.MARKSHEET,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    routeKey: ROUTE_KEYS.NOTIFICATIONS,
  },
]

export const getMenuByRole = (role) => {
  const studentMenuItems = getStudentMenuItems()
  const ROLE_MENU = {
    student: studentMenuItems,
    school_admin: studentMenuItems,
  }
  return ROLE_MENU[role] || []
}
