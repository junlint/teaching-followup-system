import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import * as api from '../../api/api'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [courses, setCourses] = React.useState<{ id: string; name: string; classCount: number }[]>([])

  React.useEffect(() => {
    (async () => {
      if (!user) return
      const scope = await api.getTeacherScope(user.id)
      const allClasses = await api.getClasses()
      const data = scope.courses.map(c => ({
        id: c.id,
        name: `${c.name}（${c.term}）`,
        classCount: (scope.classMap[c.id] ?? []).length
      }))
      setCourses(data)
    })()
  }, [user])

  return (
    <div className="card">
      <div className="row">
        <div className="h1">教师仪表盘</div>
        <div className="spacer" />
        <button className="btn primary" onClick={() => nav('/teacher/lessons/new')}>创建课堂记录</button>
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        从这里快速进入课堂记录与统计导出。
      </div>
      <hr className="sep" />
      <div className="row">
        {courses.map(c => (
          <div key={c.id} className="card" style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontWeight: 800 }}>{c.name}</div>
            <div className="muted small" style={{ marginTop: 6 }}>教学班数量：{c.classCount}</div>
            <div className="row" style={{ marginTop: 10 }}>
              <button className="btn" onClick={() => nav('/teacher/lessons')}>去课堂记录</button>
              <button className="btn" onClick={() => nav('/teacher/statistics')}>去统计导出</button>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && <div className="muted">未分配任何课程，请联系管理员分配。</div>}
    </div>
  )
}
