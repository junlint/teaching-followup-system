# 教学跟进系统（课堂抽问记录）后端 - Spring Boot

## 1) 对齐前端 API
前端 src/api/index.js 使用的接口路径（你给的文件）：
- POST /api/login
- GET  /api/me
- GET/POST/PUT/DELETE /api/admin/teachers ...
- GET/POST/PUT/DELETE /api/teacher/courses ...
- GET /api/teacher/courses/{courseId}/students
- POST /api/teacher/courses/{courseId}/import-students-csv
- POST /api/teacher/courses/{courseId}/draw
- POST /api/teacher/courses/{courseId}/students/search
- POST /api/teacher/courses/{courseId}/records
- GET  /api/teacher/courses/{courseId}/records
- GET  /api/teacher/courses/{courseId}/stats

## 2) 建表
项目已内置 Flyway 脚本（默认关闭，可按需开启）：src/main/resources/db/migration/V1__schema.sql
其中 **比你原始 SQL 多了一个字段**：answer_record.performance_tag（JPA update 也会自动补这列）
用来匹配前端传的 performanceTag。

如果你已经手动建好表（且没有 performance_tag），执行：
```sql
ALTER TABLE answer_record
  ADD COLUMN performance_tag VARCHAR(30) NOT NULL DEFAULT 'ok' AFTER updated_by;
```

## 3) 配置数据库
修改 application.yml 的 datasource（库名 tfdb、用户名密码）。

## 4) 启动
```bash
mvn spring-boot:run
```

## 5) 默认管理员账号
第一次启动会自动创建：
- username: admin
- password: 123456
（见 application.yml 的 app.bootstrap.admin）
