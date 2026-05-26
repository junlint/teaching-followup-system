import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import * as api from '../../api/api'
import type { AnswerRecord, Question, Student, AnswerResult } from '../../types'
import { Drawer, Modal } from '../../components/Modal'

const nowTime = () => new Date().toTimeString().slice(0,8)

export default function LessonDetailPage() {
  const { lessonId } = useParams()
  const nav = useNavigate()
  const [lesson, setLesson] = React.useState<ReturnType<typeof api.getLessonById> | null>(null)

  const [courseName, setCourseName] = React.useState('')
  const [className, setClassName] = React.useState('')

  const [qs, setQs] = React.useState<Question[]>([])
  const [activeQ, setActiveQ] = React.useState<Question | null>(null)
  const [records, setRecords] = React.useState<AnswerRecord[]>([])
  const [students, setStudents] = React.useState<Student[]>([])

  const [toast, setToast] = React.useState<string | null>(null)

  // Question modal state
  const [qModalOpen, setQModalOpen] = React.useState(false)
  const [qEditing, setQEditing] = React.useState<Question | null>(null)
  const [qContent, setQContent] = React.useState('')
  const [qType, setQType] = React.useState<'提问'|'讨论'|'小测' | ''>('')
  const [qDifficulty, setQDifficulty] = React.useState<'简单'|'一般'|'困难' | ''>('')

  // Answer drawer state
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [editingRecord, setEditingRecord] = React.useState<AnswerRecord | null>(null)
  const [studentId, setStudentId] = React.useState('')
  const [time, setTime] = React.useState(nowTime())
  const [result, setResult] = React.useState<AnswerResult>('正确')
  const [score, setScore] = React.useState(5)
  const [remark, setRemark] = React.useState('')
  const [recentStudents, setRecentStudents] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!lessonId) return
    const l = api.getLessonById(lessonId)
    setLesson(l ?? null)
    if (l) {
      setCourseName(api.getCourseName(l.courseId))
      setClassName(api.getClassName(l.classId))
      api.getStudentsByClass(l.classId).then(setStudents)
      api.getQuestions(l.id).then(list => {
        setQs(list)
        setActiveQ(list[0] ?? null)
      })
    }
  }, [lessonId])

  React.useEffect(() => {
    if (!activeQ) { setRecords([]); return }
    api.getAnswerRecords(activeQ.id).then(setRecords)
  }, [activeQ?.id])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function openNewQuestion() {
    setQEditing(null)
    setQContent('')
    setQType('')
    setQDifficulty('')
    setQModalOpen(true)
  }

  function openEditQuestion(q: Question) {
    setQEditing(q)
    setQContent(q.content)
    setQType((q.type ?? '') as any)
    setQDifficulty((q.difficulty ?? '') as any)
    setQModalOpen(true)
  }

  async function saveQuestion() {
    if (!lesson) return
    if (!qContent.trim()) { showToast('请输入问题内容'); return }
    try {
      if (!qEditing) {
        const q = await api.addQuestion({
          lessonId: lesson.id,
          content: qContent.trim(),
          type: qType || undefined,
          difficulty: qDifficulty || undefined
        })
        const newList = await api.getQuestions(lesson.id)
        setQs(newList)
        setActiveQ(q)
      } else {
        await api.updateQuestion(qEditing.id, {
          content: qContent.trim(),
          type: qType || undefined,
          difficulty: qDifficulty || undefined
        })
        const newList = await api.getQuestions(lesson.id)
        setQs(newList)
        setActiveQ(newList.find(x => x.id === qEditing.id) ?? newList[0] ?? null)
      }
      setQModalOpen(false)
      showToast('已保存问题')
    } catch (e: any) {
      showToast(e?.message ?? '保存失败')
    }
  }

  async function removeQuestion(q: Question) {
    if (!confirm('确认删除该问题？删除后该问题下的回答记录也会被删除。')) return
    await api.deleteQuestion(q.id)
    if (!lesson) return
    const list = await api.getQuestions(lesson.id)
    setQs(list)
    setActiveQ(list[0] ?? null)
    showToast('已删除问题')
  }

  function openNewAnswer() {
    if (!activeQ) { showToast('请先选择/创建问题'); return }
    setEditingRecord(null)
    setStudentId('')
    setTime(nowTime())
    setResult('正确')
    setScore(5)
    setRemark('')
    setDrawerOpen(true)
  }

  function openEditAnswer(a: AnswerRecord) {
    setEditingRecord(a)
    setStudentId(a.studentId)
    setTime(a.time)
    setResult(a.result)
    setScore(a.score)
    setRemark(a.remark ?? '')
    setDrawerOpen(true)
  }

  async function saveAnswer(continueNext: boolean) {
    if (!activeQ) return
    if (!studentId) { showToast('请选择学生'); return }
    if (score < 0 || score > 10) { showToast('评分范围建议 0-10'); return }

    try {
      if (!editingRecord) {
        await api.addAnswerRecord({
          questionId: activeQ.id,
          studentId,
          time,
          result,
          score,
          remark: remark || undefined
        })
      } else {
        await api.updateAnswerRecord(editingRecord.id, { studentId, time, result, score, remark: remark || undefined })
      }
      const list = await api.getAnswerRecords(activeQ.id)
      setRecords(list)

      setRecentStudents(prev => {
        const next = [studentId, ...prev.filter(x => x !== studentId)]
        return next.slice(0, 5)
      })

      showToast('已保存回答记录')

      if (continueNext) {
        setEditingRecord(null)
        setStudentId('')
        setTime(nowTime())
        setRemark('')
      } else {
        setDrawerOpen(false)
      }
    } catch (e: any) {
      showToast(e?.message ?? '保存失败')
    }
  }

  async function removeAnswer(a: AnswerRecord) {
    if (!confirm('确认删除该条回答记录？')) return
    await api.deleteAnswerRecord(a.id)
    if (activeQ) setRecords(await api.getAnswerRecords(activeQ.id))
    showToast('已删除回答记录')
  }

  const studentName = (id: string) => students.find(s => s.id === id)?.name ?? id
  const studentNo = (id: string) => students.find(s => s.id === id)?.studentNo ?? '-'

  if (!lesson) {
    return (
      <div className="card">
        <div className="h1">课堂记录详情</div>
        <div className="muted" style={{ marginTop: 10 }}>记录不存在或已删除。</div>
        <hr className="sep" />
        <button className="btn" onClick={() => nav('/teacher/lessons')}>返回列表</button>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div>
          <div className="h1">课堂记录详情</div>
          <div className="muted small" style={{ marginTop: 6 }}>
            {courseName} · {className} · {lesson.date} · {lesson.period} · {lesson.topic ?? '未填写主题'}
          </div>
        </div>
        <div className="spacer" />
        <div className="row">
          <button className="btn primary" onClick={openNewQuestion}>新增问题</button>
          <button className="btn" onClick={() => nav('/teacher/lessons')}>返回列表</button>
        </div>
      </div>
      {toast && <div className="badge" style={{ marginTop: 10 }}>{toast}</div>}
      <hr className="sep" />

      <div className="split">
        <div className="card">
          <div className="row">
            <div className="h2">问题列表</div>
            <div className="spacer" />
            <span className="badge">{qs.length} 个</span>
          </div>
          <div className="muted small" style={{ marginTop: 6 }}>点击问题查看右侧回答记录</div>
          <hr className="sep" />
          <div className="col">
            {qs.map(q => (
              <div
                key={q.id}
                className={`listItem ${activeQ?.id === q.id ? 'active' : ''}`}
                onClick={() => setActiveQ(q)}
              >
                <div style={{ fontWeight: 750 }}>{q.content}</div>
                <div className="row" style={{ marginTop: 8 }}>
                  {q.type && <span className="badge">{q.type}</span>}
                  {q.difficulty && <span className="badge">{q.difficulty}</span>}
                  <div className="spacer" />
                  <button className="btn link" onClick={(e) => { e.stopPropagation(); openEditQuestion(q) }}>编辑</button>
                  <button className="btn link" onClick={(e) => { e.stopPropagation(); removeQuestion(q) }}>删除</button>
                </div>
              </div>
            ))}
            {qs.length === 0 && (
              <div className="muted">暂无问题。点击“新增问题”开始记录。</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="row">
            <div className="h2">回答记录</div>
            <div className="spacer" />
            <button className="btn primary" onClick={openNewAnswer} disabled={!activeQ}>记录回答</button>
          </div>

          {activeQ ? (
            <div className="muted small" style={{ marginTop: 6 }}>当前问题：{activeQ.content}</div>
          ) : (
            <div className="muted small" style={{ marginTop: 6 }}>请先选择或创建问题</div>
          )}

          <hr className="sep" />
          {records.length === 0 ? (
            <div className="muted">暂无回答记录。点击“记录回答”快速录入。</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>时间</th>
                  <th>学号</th>
                  <th>姓名</th>
                  <th>结果</th>
                  <th>评分</th>
                  <th>备注</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r.id}>
                    <td>{r.time}</td>
                    <td className="muted small">{studentNo(r.studentId)}</td>
                    <td>{studentName(r.studentId)}</td>
                    <td><span className="badge">{r.result}</span></td>
                    <td>{r.score}</td>
                    <td className="muted small">{r.remark ?? '-'}</td>
                    <td>
                      <div className="row">
                        <button className="btn" onClick={() => openEditAnswer(r)}>编辑</button>
                        <button className="btn danger" onClick={() => removeAnswer(r)}>删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={qModalOpen} title={qEditing ? '编辑问题' : '新增问题'} onClose={() => setQModalOpen(false)}>
        <div className="col">
          <label className="col">
            <div className="muted small">问题内容（必填）</div>
            <textarea rows={3} value={qContent} onChange={e => setQContent(e.target.value)} placeholder="简要描述问题" />
          </label>
          <div className="row">
            <label className="col" style={{ flex: 1 }}>
              <div className="muted small">类型（可选）</div>
              <select value={qType} onChange={e => setQType(e.target.value as any)}>
                <option value="">不设置</option>
                <option value="提问">提问</option>
                <option value="讨论">讨论</option>
                <option value="小测">小测</option>
              </select>
            </label>
            <label className="col" style={{ flex: 1 }}>
              <div className="muted small">难度（可选）</div>
              <select value={qDifficulty} onChange={e => setQDifficulty(e.target.value as any)}>
                <option value="">不设置</option>
                <option value="简单">简单</option>
                <option value="一般">一般</option>
                <option value="困难">困难</option>
              </select>
            </label>
          </div>

          <div className="row" style={{ marginTop: 6 }}>
            <button className="btn primary" onClick={saveQuestion}>保存</button>
            <button className="btn" onClick={() => setQModalOpen(false)}>取消</button>
          </div>
        </div>
      </Modal>

      <Drawer open={drawerOpen} title={editingRecord ? '编辑回答记录' : '记录回答'} onClose={() => setDrawerOpen(false)}>
        <div className="col">
          {recentStudents.length > 0 && (
            <div className="card" style={{ padding: 12 }}>
              <div className="muted small">最近选择</div>
              <div className="row" style={{ marginTop: 8 }}>
                {recentStudents.map(id => (
                  <button key={id} className="btn" onClick={() => setStudentId(id)}>{studentName(id)}</button>
                ))}
              </div>
            </div>
          )}

          <label className="col">
            <div className="muted small">学生（必选）</div>
            <select value={studentId} onChange={e => setStudentId(e.target.value)}>
              <option value="">请选择学生</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.studentNo} · {s.name}</option>)}
            </select>
          </label>

          <div className="row">
            <label className="col" style={{ flex: 1 }}>
              <div className="muted small">回答时间</div>
              <input value={time} onChange={e => setTime(e.target.value)} placeholder="HH:mm:ss" />
            </label>
            <label className="col" style={{ flex: 1 }}>
              <div className="muted small">回答结果</div>
              <select value={result} onChange={e => setResult(e.target.value as any)}>
                <option value="正确">正确</option>
                <option value="基本正确">基本正确</option>
                <option value="错误">错误</option>
                <option value="未答">未答</option>
              </select>
            </label>
          </div>

          <div className="row">
            <label className="col" style={{ flex: 1 }}>
              <div className="muted small">评分（0-10）</div>
              <input
                type="number"
                value={score}
                onChange={e => setScore(Number(e.target.value))}
                min={0}
                max={10}
              />
            </label>
            <div className="row" style={{ marginTop: 22 }}>
              <button className="btn" onClick={() => setScore(s => Math.max(0, s - 1))}>-</button>
              <button className="btn" onClick={() => setScore(s => Math.min(10, s + 1))}>+</button>
            </div>
          </div>

          <label className="col">
            <div className="muted small">备注（可选）</div>
            <textarea rows={3} value={remark} onChange={e => setRemark(e.target.value)} placeholder="对学生表现做简短说明" />
          </label>

          <div className="row" style={{ marginTop: 6 }}>
            <button className="btn primary" onClick={() => saveAnswer(false)}>保存</button>
            <button className="btn" onClick={() => saveAnswer(true)}>保存并继续</button>
            <button className="btn" onClick={() => setDrawerOpen(false)}>取消</button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
