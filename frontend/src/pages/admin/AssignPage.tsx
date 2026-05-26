import React from 'react'
import { useAuth } from '../../auth/AuthContext'
import * as api from '../../api/api'

type State = {
  term: string;
  courseId: string;
  teacherId: string;
  selectedClassIds: string[];
}

export default function AdminAssign() {
  const { user } = useAuth()
  const [term, setTerm] = React.useState('2025秋')
  const [courseList, setCourseList] = React.useState(awaitInit(api.getCourses))
  const [classList, setClassList] = React.useState(awaitInit(api.getClasses))
  const [users] = React.useState(api.getUsers().filter(u => u.role === 'teacher'))

  const [state, setState] = React.useState<State>({
    term: '2025秋',
    courseId: '',
    teacherId: users[0]?.id ?? '',
    selectedClassIds: []
  })
  const [saving, setSaving] = React.useState(false)
  const [toast, setToast] = React.useState<string | null>(null)

  React.useEffect(() => { (async () => { setCourseList(await api.getCourses()); setClassList(await api.getClasses()) })() }, [])
  React.useEffect(() => { setState(s => ({ ...s, term })) }, [term])

  const filteredCourses = React.useMemo(() => courseList.filter(c => c.term === term), [courseList, term])

  async function loadCurrent(courseId: string) {
    setState(s => ({ ...s, courseId, selectedClassIds: [] }))
    // In a real app, fetch assignment details. Here we use teacher scope mapping.
    const teacherId = state.teacherId || users[0]?.id || ''
    const scope = await api.getTeacherScope(teacherId)
    const classIds = scope.classMap[courseId] ?? []
    setState(s => ({ ...s, teacherId, selectedClassIds: classIds }))
  }

  function toggleClass(id: string) {
    setState(s => {
      const has = s.selectedClassIds.includes(id)
      return { ...s, selectedClassIds: has ? s.selectedClassIds.filter(x => x !== id) : [...s.selectedClassIds, id] }
    })
  }

  async function onSave() {
    if (!state.courseId) { setToast('请先选择课程'); return }
    if (!state.teacherId) { setToast('请选择任课教师'); return }
    if (state.selectedClassIds.length === 0) { setToast('至少选择 1 个班级'); return }
    setSaving(true)
    try {
      await api.saveAssignment(state.courseId, state.teacherId, state.selectedClassIds)
      setToast('已保存分配关系')
    } catch (e: any) {
      setToast(e?.message ?? '保存失败')
    } finally {
      setSaving(false)
      setTimeout(() => setToast(null), 2500)
    }
  }

  return (
    <div className="card">
      <div className="row">
        <div className="h1">课程-教师-班级分配</div>
        <div className="spacer" />
        {toast && <span className="badge">{toast}</span>}
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        选择课程 → 选择任课教师 → 勾选教学班 → 保存。教师端只会看到被分配的数据范围。
      </div>
      <hr className="sep" />

      <div className="row">
        <label className="col" style={{ minWidth: 180 }}>
          <div className="muted small">学期</div>
          <select value={term} onChange={e => setTerm(e.target.value)}>
            <option value="2025秋">2025秋</option>
          </select>
        </label>
        <div className="spacer" />
      </div>

      <div className="split" style={{ marginTop: 10 }}>
        <div className="card">
          <div className="h2">课程列表</div>
          <div className="muted small" style={{ marginTop: 4 }}>点击课程加载分配信息（示例）</div>
          <hr className="sep" />
          <div className="col">
            {filteredCourses.map(c => (
              <div
                key={c.id}
                className={`listItem ${state.courseId === c.id ? 'active' : ''}`}
                onClick={() => loadCurrent(c.id)}
              >
                <div className="row">
                  <div style={{ fontWeight: 750 }}>{c.name}</div>
                  <span className="badge">{c.code}</span>
                </div>
                <div className="muted small">学期：{c.term}</div>
              </div>
            ))}
            {filteredCourses.length === 0 && <div className="muted">暂无课程，请先创建课程</div>}
          </div>
        </div>

        <div className="card">
          <div className="h2">分配设置</div>
          <hr className="sep" />

          <div className="row">
            <label className="col" style={{ flex: 1, minWidth: 220 }}>
              <div className="muted small">任课教师</div>
              <select value={state.teacherId} onChange={e => setState(s => ({ ...s, teacherId: e.target.value }))}>
                {users.map(t => <option key={t.id} value={t.id}>{t.name}（{t.username}）</option>)}
              </select>
            </label>
          </div>

          <hr className="sep" />
          <div className="h2">教学班（多选）</div>
          <div className="muted small" style={{ marginTop: 4 }}>已选 {state.selectedClassIds.length} 个班</div>

          <div className="col" style={{ marginTop: 10 }}>
            {classList.map(cl => (
              <label key={cl.id} className="row" style={{ padding: 8, borderRadius: 12, border: '1px solid var(--border)', background: 'rgba(255,255,255,.03)' }}>
                <input
                  type="checkbox"
                  checked={state.selectedClassIds.includes(cl.id)}
                  onChange={() => toggleClass(cl.id)}
                />
                <div>{cl.name}</div>
              </label>
            ))}
            {classList.length === 0 && <div className="muted">暂无班级，请先创建班级</div>}
          </div>

          <hr className="sep" />
          <div className="row">
            <button className="btn primary" onClick={onSave} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
            <button className="btn" onClick={() => setState(s => ({ ...s, selectedClassIds: [] }))}>
              重置勾选
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function awaitInit<T>(_fn: () => Promise<T>): T {
  // placeholder initial value; replaced after useEffect
  return [] as unknown as T
}
