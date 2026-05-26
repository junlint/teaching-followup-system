# 教学跟进系统（前端 V1 原型代码）

这是一个 Vite + React + TypeScript 的前端原型项目，用 **Mock 数据** 跑通需求文档中的关键流程：

- 登录（管理员/教师）
- 管理员：课程-教师-班级分配（示例）
- 教师：课堂记录列表、创建课堂记录
- 教师：课堂记录详情（新增问题、记录回答抽屉、编辑/删除）
- 教师：统计与导出（CSV）

## 运行
```bash
npm install
npm run dev
```

打开 http://localhost:5173

## 演示账号
- 管理员：admin / admin123
- 教师：teacher1 / teacher123

## 说明
- 数据与接口在 `src/api/` 下为 mock 实现，便于你后续替换成真实后端 API。
- 平时分规则 V1 简化为「平时分 = 总评分」。
