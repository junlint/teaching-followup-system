import type {
  User, Course, ClassGroup, Student, Lesson, Question, AnswerRecord
} from '../types'
import {
  mockUsers, courses, classes, students, assignments, lessons, questions, answerRecords, genId
} from './mockDb'

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))

export async function login(username: string, password: string): Promise<User> {
  await sleep(250)
  const found = mockUsers.find(u => u.username === username)
  if (!found) throw new Error('账号不存在')
  if (found.password !== password) throw new Error('密码错误')
  return { id: found.id, username: found.username, name: found.name, role: found.role }
}

export async function getCourses(): Promise<Course[]> {
  await sleep(120); return [...courses]
}
export async function getClasses(): Promise<ClassGroup[]> {
  await sleep(120); return [...classes]
}
export async function getStudentsByClass(classId: string): Promise<Student[]> {
  await sleep(120); return students.filter(s => s.classId === classId)
}

export async function getTeacherScope(teacherUserId: string): Promise<{ courses: Course[]; classMap: Record<string,string[]> }> {
  await sleep(120)
  const a = assignments.filter(x => x.teacherUserId === teacherUserId)
  const scopedCourses = courses.filter(c => a.some(x => x.courseId === c.id))
  const classMap: Record<string,string[]> = {}
  a.forEach(x => { classMap[x.courseId] = x.classIds })
  return { courses: scopedCourses, classMap }
}

export async function saveAssignment(courseId: string, teacherUserId: string, classIds: string[]): Promise<void> {
  await sleep(200)
  const idx = assignments.findIndex(x => x.courseId === courseId)
  if (idx >= 0) assignments[idx] = { courseId, teacherUserId, classIds }
  else assignments.push({ courseId, teacherUserId, classIds })
}

export async function getLessons(filter: Partial<Pick<Lesson,'courseId'|'classId'>> & { dateFrom?: string; dateTo?: string; keyword?: string }): Promise<Lesson[]> {
  await sleep(150)
  let out = [...lessons]
  if (filter.courseId) out = out.filter(l => l.courseId === filter.courseId)
  if (filter.classId) out = out.filter(l => l.classId === filter.classId)
  if (filter.dateFrom) out = out.filter(l => l.date >= filter.dateFrom!)
  if (filter.dateTo) out = out.filter(l => l.date <= filter.dateTo!)
  if (filter.keyword) {
    const kw = filter.keyword.trim()
    out = out.filter(l => (l.topic ?? '').includes(kw) || (l.note ?? '').includes(kw))
  }
  out.sort((a,b)=> (a.date < b.date ? 1 : -1))
  return out
}

export async function createLesson(input: Omit<Lesson,'id'|'updatedAt'>): Promise<Lesson> {
  await sleep(200)
  const l: Lesson = { ...input, id: genId('l'), updatedAt: new Date().toISOString() }
  lessons.push(l)
  return l
}

export async function updateLesson(id: string, patch: Partial<Omit<Lesson,'id'>>): Promise<Lesson> {
  await sleep(200)
  const idx = lessons.findIndex(x => x.id === id)
  if (idx < 0) throw new Error('课堂记录不存在')
  lessons[idx] = { ...lessons[idx], ...patch, updatedAt: new Date().toISOString() }
  return lessons[idx]
}

export async function deleteLesson(id: string): Promise<void> {
  await sleep(150)
  const idx = lessons.findIndex(x => x.id === id)
  if (idx >= 0) lessons.splice(idx, 1)
  // cascade delete
  const qIds = questions.filter(q => q.lessonId === id).map(q => q.id)
  for (let i = questions.length - 1; i >= 0; i--) if (questions[i].lessonId === id) questions.splice(i, 1)
  for (let i = answerRecords.length - 1; i >= 0; i--) if (qIds.includes(answerRecords[i].questionId)) answerRecords.splice(i, 1)
}

export async function getQuestions(lessonId: string): Promise<Question[]> {
  await sleep(120)
  return questions.filter(q => q.lessonId === lessonId)
}
export async function addQuestion(input: Omit<Question,'id'|'createdAt'>): Promise<Question> {
  await sleep(180)
  const q: Question = { ...input, id: genId('q'), createdAt: new Date().toISOString() }
  questions.push(q)
  return q
}
export async function updateQuestion(id: string, patch: Partial<Omit<Question,'id'|'lessonId'|'createdAt'>>): Promise<Question> {
  await sleep(180)
  const idx = questions.findIndex(x => x.id === id)
  if (idx < 0) throw new Error('问题不存在')
  questions[idx] = { ...questions[idx], ...patch }
  return questions[idx]
}
export async function deleteQuestion(id: string): Promise<void> {
  await sleep(160)
  const idx = questions.findIndex(x => x.id === id)
  if (idx >= 0) questions.splice(idx, 1)
  for (let i = answerRecords.length - 1; i >= 0; i--) if (answerRecords[i].questionId === id) answerRecords.splice(i, 1)
}

export async function getAnswerRecords(questionId: string): Promise<AnswerRecord[]> {
  await sleep(120)
  return answerRecords.filter(a => a.questionId === questionId).sort((a,b)=> a.time.localeCompare(b.time))
}
export async function addAnswerRecord(input: Omit<AnswerRecord,'id'|'createdAt'>): Promise<AnswerRecord> {
  await sleep(200)
  const ar: AnswerRecord = { ...input, id: genId('a'), createdAt: new Date().toISOString() }
  answerRecords.push(ar)
  return ar
}
export async function updateAnswerRecord(id: string, patch: Partial<Omit<AnswerRecord,'id'|'questionId'|'createdAt'>>): Promise<AnswerRecord> {
  await sleep(180)
  const idx = answerRecords.findIndex(x => x.id === id)
  if (idx < 0) throw new Error('回答记录不存在')
  answerRecords[idx] = { ...answerRecords[idx], ...patch }
  return answerRecords[idx]
}
export async function deleteAnswerRecord(id: string): Promise<void> {
  await sleep(150)
  const idx = answerRecords.findIndex(x => x.id === id)
  if (idx >= 0) answerRecords.splice(idx, 1)
}

export async function computeStatistics(courseId: string, classId: string, dateFrom?: string, dateTo?: string) {
  await sleep(200)
  // Gather lessons under scope
  let ls = lessons.filter(l => l.courseId === courseId && l.classId === classId)
  if (dateFrom) ls = ls.filter(l => l.date >= dateFrom)
  if (dateTo) ls = ls.filter(l => l.date <= dateTo)
  const lIds = ls.map(l => l.id)
  const qs = questions.filter(q => lIds.includes(q.lessonId))
  const qIds = qs.map(q => q.id)
  const ars = answerRecords.filter(a => qIds.includes(a.questionId))

  const classStudents = students.filter(s => s.classId === classId)
  const byStudent: Record<string, { count: number; correct: number; totalScore: number }> = {}
  classStudents.forEach(s => byStudent[s.id] = { count: 0, correct: 0, totalScore: 0 })

  ars.forEach(a => {
    const agg = byStudent[a.studentId]
    if (!agg) return
    agg.count += 1
    if (a.result === '正确' || a.result === '基本正确') agg.correct += 1
    agg.totalScore += a.score
  })

  const rows = classStudents.map(s => {
    const agg = byStudent[s.id]
    const avg = agg.count > 0 ? agg.totalScore / agg.count : 0
    // V1 简化：平时分 = 总评分（可在后端替换为配置规则）
    const usual = agg.totalScore
    return {
      studentId: s.id,
      studentNo: s.studentNo,
      name: s.name,
      count: agg.count,
      correct: agg.correct,
      totalScore: agg.totalScore,
      avgScore: Math.round(avg * 10) / 10,
      usualScore: usual
    }
  })

  rows.sort((a,b)=> b.usualScore - a.usualScore)
  return { rows, meta: { totalStudents: classStudents.length, answeredStudents: rows.filter(r=>r.count>0).length, totalAnswers: ars.length } }
}

export function getCourseName(id: string): string {
  return courses.find(c => c.id === id)?.name ?? id
}
export function getClassName(id: string): string {
  return classes.find(c => c.id === id)?.name ?? id
}
export function getStudentById(id: string) {
  return students.find(s => s.id === id)
}
export function getQuestionById(id: string) {
  return questions.find(q => q.id === id)
}
export function getLessonById(id: string) {
  return lessons.find(l => l.id === id)
}
export function getUsers() {
  return mockUsers.map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role }))
}
