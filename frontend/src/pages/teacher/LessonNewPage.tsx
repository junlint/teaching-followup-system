import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import * as api from '../../api/api'

export default function LessonNewPage() {
  const { user } = useAuth()
  const nav = useNavigate()

  const [scopeCourses, setScopeCourses] = React.useState<{ id: string; name: string }[]>([])
  const [classMap, setClassMap] = React.useState<Record<string,string[]>>({})
  const [classes, setClasses] = React.useState<Record<string,string>>({})

  const [courseId, setCourseId] = React.useState('')
  const [classId, setClassId] = React.useState('')
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0,10))
  const [period, setPeriod] = React.useState('1-2')
  const [topic, setTopic] = React.useState('')
  const [note, setNote] = React.useState('')
  const [err, setErr] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

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
    if (allowed.length === 1) setClassId(allowed[0])
    if (classId && !allowed.includes(classId)) setClassId('')
  }, [courseId, classMap])

  async function onSave() {
    setErr(null)
    if (!courseId || !classId || !date || !period) {
      setErr('请填写必填项：课程、班级、日期、节次')
      return
    }
    setSaving(true)
    try {
      const lesson = await api.createLesson({ courseId, classId, date, period, topic: topic || undefined, note: note || undefined })
      nav(`/teacher/lessons/${lesson.id}`, { replace: true })
    } catch (e: any) {
      setErr(e?.message ?? '创建失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card">
      <div className="row">
        <div className="h1">创建课堂记录</div>
        <div className="spacer" />
        <button className="btn" onClick={() => nav('/teacher/lessons')}>返回列表</button>
      </div>
      <div className="muted" style={{ marginTop: 6 }}>保存后进入课堂详情页，可新增问题并记录回答。</div>
      <hr className="sep" />

      <div className="row">
        <label className="col" style={{ minWidth: 280 }}>
          <div className="muted small">课程（必填）</div>
          <select value={courseId} onChange={e => setCourseId(e.target.value)}>
            <option value="">请选择</option>
            {scopeCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>

        <label className="col" style={{ minWidth: 240 }}>
          <div className="muted small">班级（必填）</div>
          <select value={classId} onChange={e => setClassId(e.target.value)} disabled={!courseId}>
            <option value="">请选择</option>
            {(classMap[courseId] ?? []).map(id => <option key={id} value={id}>{classes[id] ?? id}</option>)}
          </select>
        </label>

        <label className="col" style={{ minWidth: 180 }}>
          <div className="muted small">日期（必填）</div>
          <input value={date} onChange={e => setDate(e.target.value)} placeholder="YYYY-MM-DD" />
        </label>

        <label className="col" style={{ minWidth: 180 }}>
          <div className="muted small">节次（必填）</div>
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="1-2">1-2</option>
            <option value="3-4">3-4</option>
            <option value="5-6">5-6</option>
            <option value="7-8">7-8</option>
          </select>
        </label>
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <label className="col" style={{ flex: 1, minWidth: 320 }}>
          <div className="muted small">章节/主题（可选）</div>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="例如：线性表 / 树 / SQL查询等" />
        </label>
      </div>

      <div className="row" style={{ marginTop: 8 }}>
        <label className="col" style={{ flex: 1 }}>
          <div className="muted small">备注（可选）</div>
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} placeholder="课后补充说明" />
        </label>
      </div>

      {err && <div className="badge" style={{ marginTop: 10, borderColor: 'rgba(255,77,109,.55)', background: 'rgba(255,77,109,.12)' }}>{err}</div>}

      <div className="row" style={{ marginTop: 12 }}>
        <button className="btn primary" onClick={onSave} disabled={saving}>
          {saving ? '保存中...' : '保存并进入记录'}
        </button>
        <button className="btn" onClick={() => nav('/teacher/lessons')}>取消</button>
      </div>
    </div>
  )
}
