import type { User, Course, ClassGroup, Student, Lesson, Question, AnswerRecord } from '../types'

const nowISO = () => new Date().toISOString()

// --- Mock users ---
export const mockUsers: Array<User & { password: string }> = [
  { id: 'u_admin', username: 'admin', name: '管理员', role: 'admin', password: 'admin123' },
  { id: 'u_t1', username: 'teacher1', name: '张老师', role: 'teacher', password: 'teacher123' }
]

// --- Mock base data ---
export const courses: Course[] = [
  { id: 'c1', name: '数据结构', code: 'CS201', term: '2025秋' },
  { id: 'c2', name: '数据库原理', code: 'CS305', term: '2025秋' }
]

export const classes: ClassGroup[] = [
  { id: 'cl1', name: '计科20-1班' },
  { id: 'cl2', name: '计科20-2班' }
]

export const students: Student[] = [
  { id: 's1', studentNo: '202001001', name: '李雷', classId: 'cl1' },
  { id: 's2', studentNo: '202001002', name: '韩梅梅', classId: 'cl1' },
  { id: 's3', studentNo: '202001101', name: '王强', classId: 'cl2' }
]

// --- Assignment: which teacher can see which course+class ---
export type Assignment = { courseId: string; teacherUserId: string; classIds: string[] }
export const assignments: Assignment[] = [
  { courseId: 'c1', teacherUserId: 'u_t1', classIds: ['cl1', 'cl2'] },
  { courseId: 'c2', teacherUserId: 'u_t1', classIds: ['cl1'] }
]

// --- Teaching data ---
export const lessons: Lesson[] = [
  {
    id: 'l1',
    courseId: 'c1',
    classId: 'cl1',
    date: '2025-12-10',
    period: '1-2',
    topic: '线性表',
    note: '',
    updatedAt: nowISO()
  }
]

export const questions: Question[] = [
  { id: 'q1', lessonId: 'l1', content: '顺序表和链表的区别？', type: '提问', difficulty: '一般', createdAt: nowISO() }
]

export const answerRecords: AnswerRecord[] = [
  { id: 'a1', questionId: 'q1', studentId: 's1', time: '09:10:12', result: '正确', score: 8, remark: '表达清晰', createdAt: nowISO() }
]

export const genId = (prefix: string) => `${prefix}_${Math.random().toString(16).slice(2)}`
