-- Flyway: V1__schema.sql
-- 按你提供的表结构 + 增加 answer_record.performance_tag（为匹配前端 performanceTag）

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  role          ENUM('admin','teacher') NOT NULL,
  phone_number  VARCHAR(20) NOT NULL,
  real_name     VARCHAR(50) NOT NULL,
  password      VARCHAR(255) NOT NULL COMMENT '哈希加密后的密码',
  status        ENUM('active','disabled') NOT NULL DEFAULT 'active',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_users_phone_number (phone_number),
  KEY idx_users_role (role),
  KEY idx_users_status (status),
  KEY idx_users_real_name (real_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS students (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  student_no  VARCHAR(30) NOT NULL,
  name        VARCHAR(50) NOT NULL,
  major       VARCHAR(80) DEFAULT NULL,
  grade       VARCHAR(20) DEFAULT NULL,
  class_name  VARCHAR(50) DEFAULT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uk_students_student_no (student_no),
  KEY idx_students_name (name),
  KEY idx_students_class_name (class_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS courses (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  course_name VARCHAR(100) NOT NULL,
  teacher_id  BIGINT UNSIGNED NOT NULL,
  term        VARCHAR(50) DEFAULT NULL,
  description VARCHAR(200) DEFAULT NULL,
  status      ENUM('active','archived') NOT NULL DEFAULT 'active',
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  KEY idx_courses_teacher_id (teacher_id),
  KEY idx_courses_term (term),
  KEY idx_courses_status (status),

  CONSTRAINT fk_courses_teacher_id
    FOREIGN KEY (teacher_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS answer_record (
  id            BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  course_id     BIGINT UNSIGNED NOT NULL,
  student_id    BIGINT UNSIGNED NOT NULL,
  created_by    BIGINT UNSIGNED NOT NULL,
  updated_by    BIGINT UNSIGNED DEFAULT NULL,
  performance_tag VARCHAR(30) NOT NULL DEFAULT 'ok',
  score         TINYINT UNSIGNED NOT NULL,
  question_note VARCHAR(200) NOT NULL DEFAULT '',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  KEY idx_answer_record_course_id (course_id),
  KEY idx_answer_record_student_id (student_id),
  KEY idx_answer_record_created_by (created_by),
  KEY idx_answer_record_updated_by (updated_by),
  KEY idx_answer_record_created_at (created_at),

  CONSTRAINT ck_answer_record_score CHECK (score BETWEEN 0 AND 10),

  CONSTRAINT fk_answer_record_course_id
    FOREIGN KEY (course_id) REFERENCES courses(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_answer_record_student_id
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_answer_record_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,

  CONSTRAINT fk_answer_record_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS course_student (
  id          BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  course_id   BIGINT UNSIGNED NOT NULL,
  student_id  BIGINT UNSIGNED NOT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uk_course_student_course_id_student_id (course_id, student_id),
  KEY idx_course_student_course_id (course_id),
  KEY idx_course_student_student_id (student_id),

  CONSTRAINT fk_course_student_course_id
    FOREIGN KEY (course_id) REFERENCES courses(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,

  CONSTRAINT fk_course_student_student_id
    FOREIGN KEY (student_id) REFERENCES students(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
