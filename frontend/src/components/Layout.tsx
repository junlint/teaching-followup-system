import React from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

type Item = { to: string; label: string }

export function SideLayout({ title, items }: { title: string; items: Item[] }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  return (
    <div className="container">
      <div className="sidebar-layout">
        <aside className="sidebar">
          <div className="col" style={{ gap: 12 }}>
            <div>
              <div className="h2">{title}</div>
              <div className="muted small" style={{ marginTop: 4 }}>
                {user?.name} · {user?.role === 'admin' ? '管理员' : '教师'}
              </div>
            </div>
            <div className="col" style={{ gap: 6 }}>
              {items.map(it => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}
                >
                  {it.label}
                </NavLink>
              ))}
            </div>
            <div className="spacer" />
            <button
              className="btn"
              onClick={() => { logout(); nav('/login') }}
              title="退出登录"
            >
              退出登录
            </button>
          </div>
        </aside>
        <main className="col" style={{ gap: 14 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
