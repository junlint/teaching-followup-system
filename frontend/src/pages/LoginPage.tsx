import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const { login, user } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const demoHint = useMemo(() => (
    <div className="muted small">
      演示账号：<span className="badge">admin / admin123</span> 或 <span className="badge">teacher1 / teacher123</span>
    </div>
  ), [])

  React.useEffect(() => {
    if (!user) return
    if (user.role === 'admin') nav('/admin/dashboard', { replace: true })
    if (user.role === 'teacher') nav('/teacher/dashboard', { replace: true })
  }, [user, nav])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    if (!username.trim() || !password) {
      setErr('请输入账号和密码')
      return
    }
    setLoading(true)
    try {
      await login(username.trim(), password)
      // redirect happens via effect
    } catch (e: any) {
      setErr(e?.message ?? '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480, paddingTop: 64 }}>
      <div className="card">
        <div className="h1">教学跟进系统</div>
        <div className="muted" style={{ marginTop: 6 }}>账号密码登录</div>
        <hr className="sep" />
        <form className="col" onSubmit={onSubmit}>
          <label className="col">
            <div className="muted small">账号</div>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="请输入账号" />
          </label>
          <label className="col">
            <div className="muted small">密码</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="请输入密码" />
          </label>
          {err && <div className="badge" style={{ borderColor: 'rgba(255,77,109,.55)', background: 'rgba(255,77,109,.12)' }}>{err}</div>}
          <button className="btn primary" disabled={loading} type="submit">
            {loading ? '登录中...' : '登录'}
          </button>
          {demoHint}
        </form>
      </div>
    </div>
  )
}
