import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { Role } from '../types'

export function RequireAuth({ children, allow }: { children: React.ReactNode; allow: Role[] }) {
  const { user } = useAuth()
  const loc = useLocation()

  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (!allow.includes(user.role)) return <Navigate to="/login" replace />
  return <>{children}</>
}
