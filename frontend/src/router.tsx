import React from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RequireAuth } from './auth/RequireAuth'
import { SideLayout } from './components/Layout'

import LoginPage from './pages/LoginPage'

import AdminDashboard from './pages/admin/Dashboard'
import AdminAssign from './pages/admin/AssignPage'

import TeacherDashboard from './pages/teacher/Dashboard'
import LessonsListPage from './pages/teacher/LessonsListPage'
import LessonNewPage from './pages/teacher/LessonNewPage'
import LessonDetailPage from './pages/teacher/LessonDetailPage'
import StatisticsPage from './pages/teacher/StatisticsPage'
import StudentDetailPage from './pages/teacher/StudentDetailPage'

const adminNav = [
  { to: '/admin/dashboard', label: '仪表盘' },
  { to: '/admin/assign', label: '课程-教师-班级分配' }
]

const teacherNav = [
  { to: '/teacher/dashboard', label: '仪表盘' },
  { to: '/teacher/lessons', label: '课堂记录' },
  { to: '/teacher/statistics', label: '统计与导出' }
]

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },

  {
    path: '/admin',
    element: (
      <RequireAuth allow={['admin']}>
        <SideLayout title="管理员端" items={adminNav} />
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'assign', element: <AdminAssign /> }
    ]
  },

  {
    path: '/teacher',
    element: (
      <RequireAuth allow={['teacher']}>
        <SideLayout title="教师端" items={teacherNav} />
      </RequireAuth>
    ),
    children: [
      { path: 'dashboard', element: <TeacherDashboard /> },
      { path: 'lessons', element: <LessonsListPage /> },
      { path: 'lessons/new', element: <LessonNewPage /> },
      { path: 'lessons/:lessonId', element: <LessonDetailPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'statistics/student/:studentId', element: <StudentDetailPage /> }
    ]
  },

  { path: '*', element: <Navigate to="/login" replace /> }
])
