import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import * as api from '../../api/api'
import type { Lesson } from '../../types'

export default function LessonsListPage() {
  const { user } = useAuth()
  const nav = useNavigate()

  const [scopeCourses, setScopeCourses] = React.useState<{ id: string; name: string }[]>([])
  const [classMap, setClassMap] = React.useState<Record<string,string[]>>({})
  const [classes, setClasses] = React.useState<Record<string,string>>({})

  const [courseId, setCourseId] = React.useState('')
  const [classId, setClassId] = React.useState('')
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')
  const [keyword, setKeyword] = React.useState('')
  const [rows, setRows] = React.useState<Lesson[]>([])
  const [loading, setLoading] = React.useState(false)
  const [toast, setToast] = React.useState<string | null>(null)

  React.useEffect(() => {
    (async () => {
      if (!user) return
      const [scope, cls] = await Promise.all([api.getTeacherScope(user.id), api.getClasses()])
      setScopeCourses(scope.courses.map(c => ({ id: c.id, name: `${c.name}（${c.term}）` })))
      setClassMap(scope.classMap)
      const m: Record<string,string> = {}
      cls.forEach(x => m[x.id] = x.name)
      setClasses(m)
    })()
  }, [user])

  React.useEffect(() => {
    // reset class if not in scope
    if (!courseId) { setClassId(''); return }
    const allowed = classMap[courseId] ?? []
    if (classId && !allowed.includes(classId)) setClassId('')
  }, [courseId, classMap, classId])

  async function onQuery() {
    if (!courseId || !classId) { setToast('请选择课程和班级'); setTimeout(()=>setToast(null), 2000); return }
    setLoading(true)
    try {
      const list = await api.getLessons({ courseId, classId, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined, keyword: keyword || undefined })
      setRows(list)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="row">
        <div className="h1">课堂记录</div>
        <div className="spacer" />
        <button className="btn primary" onClick={() => nav('/teacher/lessons/new')}>创建课堂记录</button>
      </div>
      {toast && <div className="badge" style={{ marginTop: 10 }}>{toast}</div>}
      <hr className="sep" />

      <div className="row">
        <label className="col" style={{ minWidth: 260 }}>
          <div className="muted small">课程</div>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}>
            <option value="">请选择</option>
            {scopeCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <label className="col" style={{ minWidth: 220 }}>
          <div className="muted small">班级</div>
          <select value={classId} onChange={e => setClassId(e.target.value)} disabled={!courseId}>
            <option value="">请选择</option>
            {(classMap[courseId] ?? []).map(id => <option key={id} value={id}>{classes[id] ?? id}</option>)}
          </select>
        </label>

        <label className="col" style={{ minWidth: 170 }}>
          <div className="muted small">开始日期</div>
          <input value={dateFrom} onChange={e => setDateFrom(e.target.value)} placeholder="YYYY-MM-DD" />
        </label>

        <label className="col" style={{ minWidth: 170 }}>
          <div className="muted small">结束日期</div>
          <input value={dateTo} onChange={e => setDateTo(e.target.value)} placeholder="YYYY-MM-DD" />
        </label>

        <label className="col" style={{ minWidth: 220, flex: 1 }}>
          <div className="muted small">章节关键词</div>
          <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="主题/备注关键词" />
        </label>

        <button className="btn primary" onClick={onQuery} disabled={loading}>
          {loading ? '查询中...' : '查询'}
        </button>
        <button className="btn" onClick={() => { setDateFrom(''); setDateTo(''); setKeyword(''); setRows([]) }}>重置</button>
      </div>

      <hr className="sep" />
      {rows.length === 0 ? (
        <div className="muted">
          暂无记录。请选择课程+班级后查询，或直接创建课堂记录。
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>日期</th>
              <th>节次</th>
              <th>章节/主题</th>
              <th>最后更新</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.period}</td>
                <td>{r.topic ?? '-'}</td>
                <td className="muted small">{new Date(r.updatedAt).toLocaleString()}</td>
                <td>
                  <button className="btn" onClick={() => nav(`/teacher/lessons/${r.id}`)}>查看</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
