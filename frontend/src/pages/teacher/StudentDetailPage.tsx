import React from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as api from '../../api/api'

export default function StudentDetailPage() {
  const { studentId } = useParams()
  const nav = useNavigate()
  const [sp] = useSearchParams()
  const courseId = sp.get('courseId') ?? ''
  const classId = sp.get('classId') ?? ''

  const [student, setStudent] = React.useState<any>(null)
  const [courseName, setCourseName] = React.useState('')
  const [className, setClassName] = React.useState('')

  const [rows, setRows] = React.useState<any[]>([])
  const [meta, setMeta] = React.useState<any>(null)

  React.useEffect(() => {
    if (!studentId) return
    setStudent(api.getStudentById(studentId))
  }, [studentId])

  React.useEffect(() => {
    if (!courseId || !classId || !studentId) return
    setCourseName(api.getCourseName(courseId))
    setClassName(api.getClassName(classId))
    ;(async () => {
      const res = await api.computeStatistics(courseId, classId)
      const me = res.rows.find(r => r.studentId === studentId)
      setMeta(me ?? null)
      // detail list: derive by scanning lessons/questions/answers (mock helper not exposed). For V1, we show summary only.
      // If you want full detail in production, add an API endpoint: GET /students/{id}/records?courseId=&classId=
      setRows([]) 
    })()
  }, [courseId, classId, studentId])

  return (
    <div className="card">
      <div className="row">
        <div>
          <div className="h1">学生明细</div>
          <div className="muted small" style={{ marginTop: 6 }}>
            {courseName} · {className}
          </div>
        </div>
        <div className="spacer" />
        <button className="btn" onClick={() => nav('/teacher/statistics')}>返回统计</button>
      </div>

      <hr className="sep" />
      <div className="row">
        <div className="card" style={{ flex: 1, minWidth: 260 }}>
          <div className="muted small">学生</div>
          <div className="h2">{student?.name ?? '-'}</div>
          <div className="muted small" style={{ marginTop: 6 }}>学号：{student?.studentNo ?? '-'}</div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <div className="muted small">回答次数</div>
          <div className="h1">{meta?.count ?? 0}</div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <div className="muted small">总评分</div>
          <div className="h1">{meta?.totalScore ?? 0}</div>
        </div>

        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <div className="muted small">平时分</div>
          <div className="h1">{meta?.usualScore ?? 0}</div>
        </div>
      </div>

      <hr className="sep" />
      <div className="muted">
        V1 演示版这里先展示汇总指标。若要完整明细列表，请在后端提供“按学生查询回答记录”的接口，
        然后在本页渲染明细表（日期/课堂/问题/结果/评分/备注）。
      </div>
    </div>
  )
}
