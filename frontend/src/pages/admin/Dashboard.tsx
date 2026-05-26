import React from 'react'
import * as api from '../../api/api'

export default function AdminDashboard() {
  const [courses, setCourses] = React.useState(0)
  const [classes, setClasses] = React.useState(0)
  const [users, setUsers] = React.useState(0)

  React.useEffect(() => {
    (async () => {
      const [cs, cls] = await Promise.all([api.getCourses(), api.getClasses()])
      setCourses(cs.length)
      setClasses(cls.length)
      setUsers(api.getUsers().length)
    })()
  }, [])

  return (
    <div className="card">
      <div className="row">
        <div className="h1">管理员仪表盘</div>
        <div className="spacer" />
        <span className="badge">V1 · Mock 数据</span>
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        用于快速验证业务流程：学期初配置 → 教师录入 → 统计导出。
      </div>
      <hr className="sep" />
      <div className="row">
        <div className="card" style={{ flex: 1 }}>
          <div className="muted small">课程数</div>
          <div className="h1">{courses}</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div className="muted small">班级数</div>
          <div className="h1">{classes}</div>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <div className="muted small">用户数</div>
          <div className="h1">{users}</div>
        </div>
      </div>
    </div>
  )
}
