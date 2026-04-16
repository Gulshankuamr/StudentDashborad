import StudentDashboard from '../pages/student/StudentDashboard'
import StudentProfileDetail from '../pages/student/StudentProfileDetail'
import StudentHomeworkList from '../pages/StudentHomeWork/StudentHomeworkList'
import StudentSubmitHomework from '../pages/StudentHomeWork/StudentSubmitHomework'
import StudentViewSubmission from '../pages/StudentHomeWork/StudentViewSubmission'
import StudentAttendance from '../pages/studentattendance/StudentAttendance'
import StudentFees from '../pages/StudentFees/StudentFees'
import StudentAdmitCard from '../pages/StudentAdmitCard/StudentAdmitCard'
import StudentMarksheet from '../pages/StudentMarksheet/StudentMarksheet'
import StudentTimetable from '../pages/StudentTimetable/StudentTimetable'
import Exametimetable from '../pages/Exametimetable/Exametimetable'
import NotificationsPage from '../pages/student/NotificationsPage'

export const ROLES = {
  STUDENT: 'student',
  SCHOOL_ADMIN: 'school_admin',
}

export const STUDENT_ALLOWED_ROLES = [ROLES.STUDENT, ROLES.SCHOOL_ADMIN]

export const ROUTE_KEYS = {
  NOTIFICATIONS: 'notifications',
  DASHBOARD: 'student.dashboard',
  PROFILE: 'student.profile',
  HOMEWORK_LIST: 'student.homework.list',
  HOMEWORK_SUBMIT: 'student.homework.submit',
  HOMEWORK_VIEW: 'student.homework.view',
  ATTENDANCE: 'student.attendance',
  FEES: 'student.fees',
  ADMIT_CARD: 'student.admit_card',
  MARKSHEET: 'student.marksheet',
  SCHOOL_TIMETABLE: 'student.timetable.school',
  EXAM_TIMETABLE: 'student.timetable.exam',
}

export const protectedRouteConfig = [
  {
    key: ROUTE_KEYS.NOTIFICATIONS,
    path: '/notifications',
    element: NotificationsPage,
    allowedRoles: STUDENT_ALLOWED_ROLES,
    requiredPermission: 'notification_view',
  },
  {
    key: ROUTE_KEYS.DASHBOARD,
    path: '/student/dashboard',
    element: StudentDashboard,
    allowedRoles: STUDENT_ALLOWED_ROLES,
  },
  {
    key: ROUTE_KEYS.PROFILE,
    path: '/student/profile',
    element: StudentProfileDetail,
    allowedRoles: STUDENT_ALLOWED_ROLES,
  },
  {
    key: ROUTE_KEYS.HOMEWORK_LIST,
    path: '/student/homework',
    element: StudentHomeworkList,
    allowedRoles: STUDENT_ALLOWED_ROLES,
  },
  {
    key: ROUTE_KEYS.HOMEWORK_SUBMIT,
    path: '/student/homework/submit/:id',
    element: StudentSubmitHomework,
    allowedRoles: STUDENT_ALLOWED_ROLES,
  },
  {
    key: ROUTE_KEYS.HOMEWORK_VIEW,
    path: '/student/homework/view/:id',
    element: StudentViewSubmission,
    allowedRoles: STUDENT_ALLOWED_ROLES,
  },
  {
    key: ROUTE_KEYS.ATTENDANCE,
    path: '/student/attendance',
    element: StudentAttendance,
    allowedRoles: STUDENT_ALLOWED_ROLES,
    requiredPermission: 'view_one_student_attendance',
  },
  {
    key: ROUTE_KEYS.FEES,
    path: '/student/fees',
    element: StudentFees,
    allowedRoles: STUDENT_ALLOWED_ROLES,
    requiredPermission: 'view_fees',
  },
  {
    key: ROUTE_KEYS.ADMIT_CARD,
    path: '/student/admit-card',
    element: StudentAdmitCard,
    allowedRoles: STUDENT_ALLOWED_ROLES,
    requiredPermission: 'generate_admit_card',
  },
  {
    key: ROUTE_KEYS.MARKSHEET,
    path: '/student/marksheet',
    element: StudentMarksheet,
    allowedRoles: STUDENT_ALLOWED_ROLES,
    requiredPermission: 'generate_marksheet',
  },
  {
    key: ROUTE_KEYS.SCHOOL_TIMETABLE,
    path: '/student/timetable',
    element: StudentTimetable,
    allowedRoles: STUDENT_ALLOWED_ROLES,
    requiredPermission: 'view_timetable',
  },
  {
    key: ROUTE_KEYS.EXAM_TIMETABLE,
    path: '/student/exam-timetable',
    element: Exametimetable,
    allowedRoles: STUDENT_ALLOWED_ROLES,
    requiredPermission: 'view_exam_timetable',
  },
]

export const routeConfigByKey = protectedRouteConfig.reduce((acc, route) => {
  acc[route.key] = route
  return acc
}, {})

export const getDefaultRouteForRole = (role) => {
  if (role === ROLES.STUDENT || role === ROLES.SCHOOL_ADMIN) {
    return '/student/dashboard'
  }

  return '/unauthorized'
}
