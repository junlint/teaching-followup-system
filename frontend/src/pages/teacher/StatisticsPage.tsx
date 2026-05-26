import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import * as api from '../../api/api'

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function toCSV(rows: any[]) {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: any) => {
    const s = String(v ?? '')
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n')
}

export default function StatisticsPage() {
  const { user } = useAuth()
  const nav = useNavigate()

  const [scopeCourses, setScopeCourses] = React.useState<{ id: string; name: string }[]>([])
  const [classMap, setClassMap] = React.useState<Record<string,string[]>>({})
  const [classes, setClasses] = React.useState<Record<string,string>>({})

  const [courseId, setCourseId] = React.useState('')
  const [classId, setClassId] = React.useState('')
  const [dateFrom, setDateFrom] = React.useState('')
  const [dateTo, setDateTo] = React.useState('')

  const [meta, setMeta] = React.useState<{ totalStudents: number; answeredStudents: number; totalAnswers: number } | null>(null)
  const [rows, setRows] = React.useState<any[]>([])
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
    if (!courseId) { setClassId(''); return }
    const allowed = classMap[courseId] ?? []
    if (classId && !allowed.includes(classId)) setClassId('')
  }, [courseId, classMap, classId])

  function showToast(msg: string) {
    setToast(msg); setTimeout(()=>setToast(null), 2200)
  }

  async function onQuery() {
    if (!courseId || !classId) { showToast('请选择课程和班级'); return }
    setLoading(true)
    try {
      const res = await api.computeStatistics(courseId, classId, dateFrom || undefined, dateTo || undefined)
      setRows(res.rows)
      setMeta(res.meta)
    } catch (e: any) {
      showToast(e?.message ?? '查询失败')
    } finally {
      setLoading(false)
    }
  }

  function onExport() {
    if (rows.length === 0) { showToast('无可导出数据'); return }
    const out = rows.map(r => ({
      学号: r.studentNo,
      姓名: r.name,
      回答次数: r.count,
      正确次数: r.correct,
      总评分: r.totalScore,
      平均评分: r.avgScore,
      平时分: r.usualScore
    }))
    const csv = toCSV(out)
    downloadText(`平时分_${courseId}_${classId}.csv`, csv)
  }

  return (
    <div className="card">
      <div className="row">
        <div className="h1">统计与导出</div>
        <div className="spacer" />
        <button className="btn primary" onClick={onExport}>导出 CSV</button>
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

        <button className="btn primary" onClick={onQuery} disabled={loading}>
          {loading ? '统计中...' : '查询'}
        </button>
      </div>

      {meta && (
        <>
          <hr className="sep" />
          <div className="row">
            <div className="card" style={{ flex: 1, minWidth: 220 }}>
              <div className="muted small">总学生数</div>
              <div className="h1">{meta.totalStudents}</div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 220 }}>
              <div className="muted small">有记录学生数</div>
              <div className="h1">{meta.answeredStudents}</div>
            </div>
            <div className="card" style={{ flex: 1, minWidth: 220 }}>
              <div className="muted small">总回答次数</div>
              <div className="h1">{meta.totalAnswers}</div>
            </div>
          </div>
        </>
      )}

      <hr className="sep" />
      {rows.length === 0 ? (
        <div className="muted">请选择课程+班级后查询统计。</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>学号</th>
              <th>姓名</th>
              <th>回答次数</th>
              <th>正确次数</th>
              <th>总评分</th>
              <th>平均评分</th>
              <th>平时分</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.studentId}>
                <td className="muted small">{r.studentNo}</td>
                <td>{r.name}</td>
                <td>{r.count}</td>
                <td>{r.correct}</td>
                <td>{r.totalScore}</td>
                <td>{r.avgScore}</td>
                <td><span className="badge">{r.usualScore}</span></td>
                <td>
                  <button className="btn" onClick={() => nav(`/teacher/statistics/student/${r.studentId}?courseId=${courseId}&classId=${classId}`)}>
                    查看明细
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
