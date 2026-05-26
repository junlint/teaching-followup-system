# 课堂抽问记录系统 · Teaching Follow-up System

全栈 Web 应用，用于高校课堂抽问记录与学情追踪。教师可管理课程、随机点名、记录答题评分，系统自动生成学生平时分统计。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18, TypeScript, Vite, React Router v6 |
| 后端 | Spring Boot 3.3, Java 17, Spring Security, JPA |
| 认证 | JWT (JJWT 0.12), 角色权限控制 (admin / teacher) |
| 数据库 | MySQL 8.0, Flyway 迁移（可选） |
| 工具 | Lombok, Apache Commons CSV, Maven |

## 功能概览

**管理员端**
- 教师账号管理（增删改查、重置密码）
- 课程与教师的分配管理

**教师端**
- 课程管理：创建/编辑课程，CSV 批量导入学生名单
- 随机点名：从课程学生中随机抽取
- 答题记录：对每次抽问评分（0-10 分），标记表现等级（优秀/良好/一般/较差）
- 学生搜索与筛选
- 统计看板：按课程/班级维度查看出勤、正确率、平均分、平时分

## 项目结构

```
├── frontend/          # React + TypeScript + Vite
│   └── src/
│       ├── api/       # API 层（当前为 mock 实现）
│       ├── auth/      # 认证上下文与路由守卫
│       ├── components/# 通用组件（Layout, Modal）
│       ├── pages/     # 页面组件（admin/, teacher/）
│       └── types.ts   # TypeScript 类型定义
├── backend/           # Spring Boot
│   └── src/main/java/com/tf/tfdb/
│       ├── config/    # Security 配置、启动引导
│       ├── controller/# REST 控制器（admin/, teacher/）
│       ├── dto/       # 请求/响应 DTO
│       ├── entity/    # JPA 实体
│       ├── repo/      # Spring Data 仓库
│       ├── security/  # JWT 过滤器、认证服务
│       └── service/   # 业务逻辑层
└── tfdb.sql           # 数据库初始化脚本
```

## 快速启动

### 1. 数据库

创建 MySQL 数据库并导入表结构：

```sql
CREATE DATABASE IF NOT EXISTS tfdb DEFAULT CHARACTER SET utf8mb4;
-- 然后导入 tfdb.sql 或使用 Flyway 迁移
```

### 2. 后端

```bash
cd backend

# 配置环境变量（参考 application-local.yml.example）
export DB_PASSWORD=your_password
export JWT_SECRET=your_32_char_secret
export ADMIN_PASSWORD=your_admin_password

mvn spring-boot:run
# 启动于 http://localhost:8080
```

首次启动会自动创建默认管理员账号（默认用户名 `admin`）。

### 3. 前端

```bash
cd frontend
npm install
npm run dev
# 启动于 http://localhost:5173
```

> 前端当前使用 mock 数据独立运行，连接后端需替换 `src/api/api.ts` 中的 mock 实现为真实 HTTP 请求。

## 演示账号（mock 模式）

| 角色 | 用户名 | 密码 |
|---|---|---|
| 管理员 | admin | admin123 |
| 教师 | teacher1 | teacher123 |

## 截图

<!-- TODO: 添加应用截图 -->
<!-- 建议截图：登录页、课程列表、随机点名、答题记录、统计看板 -->

## License

MIT
