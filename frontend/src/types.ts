export type Role = 'admin' | 'teacher';

export type User = {
  id: string;
  username: string;
  name: string;
  role: Role;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  term: string;
};

export type ClassGroup = {
  id: string;
  name: string;
};

export type Student = {
  id: string;
  studentNo: string;
  name: string;
  classId: string;
};

export type Lesson = {
  id: string;
  courseId: string;
  classId: string;
  date: string;        // YYYY-MM-DD
  period: string;      // e.g. "1-2"
  topic?: string;
  note?: string;
  updatedAt: string;   // ISO
};

export type QuestionType = '提问' | '讨论' | '小测';

export type Question = {
  id: string;
  lessonId: string;
  content: string;
  type?: QuestionType;
  difficulty?: '简单' | '一般' | '困难';
  createdAt: string;
};

export type AnswerResult = '正确' | '基本正确' | '错误' | '未答';

export type AnswerRecord = {
  id: string;
  questionId: string;
  studentId: string;
  time: string;        // HH:mm:ss
  result: AnswerResult;
  score: number;       // 0-10
  remark?: string;
  createdAt: string;   // ISO
};
