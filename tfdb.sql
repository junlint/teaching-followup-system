/*
 Navicat Premium Dump SQL

 Source Server         : Mysql
 Source Server Type    : MySQL
 Source Server Version : 80039 (8.0.39)
 Source Host           : localhost:3306
 Source Schema         : tfdb

 Target Server Type    : MySQL
 Target Server Version : 80039 (8.0.39)
 File Encoding         : 65001

 Date: 23/12/2025 10:49:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answer_record
-- ----------------------------
DROP TABLE IF EXISTS `answer_record`;
CREATE TABLE `answer_record`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `created_by` bigint UNSIGNED NOT NULL,
  `updated_by` bigint UNSIGNED NULL DEFAULT NULL,
  `score` int NOT NULL,
  `question_note` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `performance_tag` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_answer_record_course_id`(`course_id` ASC) USING BTREE,
  INDEX `idx_answer_record_student_id`(`student_id` ASC) USING BTREE,
  INDEX `idx_answer_record_created_by`(`created_by` ASC) USING BTREE,
  INDEX `idx_answer_record_updated_by`(`updated_by` ASC) USING BTREE,
  INDEX `idx_answer_record_created_at`(`created_at` ASC) USING BTREE,
  CONSTRAINT `fk_answer_record_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_answer_record_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_answer_record_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_answer_record_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ck_answer_record_score` CHECK (`score` between 0 and 10)
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of answer_record
-- ----------------------------
INSERT INTO `answer_record` VALUES (1, 1, 5, 2, 2, 10, '这是一个test', '2025-12-16 23:17:18', '2025-12-16 23:17:18', '优秀');
INSERT INTO `answer_record` VALUES (11, 2, 2, 2, 2, 10, '题1：基础概念', '2025-12-18 00:59:30', '2025-12-18 00:59:30', 'excellent');
INSERT INTO `answer_record` VALUES (12, 2, 15, 2, 2, 0, '题1：基础概念', '2025-12-18 01:51:29', '2025-12-18 01:51:29', 'absent');
INSERT INTO `answer_record` VALUES (13, 1, 5, 2, 2, 10, '这是一个test', '2025-12-18 03:06:02', '2025-12-18 03:06:02', '优秀');
INSERT INTO `answer_record` VALUES (14, 8, 4, 2, 2, 8, '题1：基础概念', '2025-12-18 03:09:18', '2025-12-18 03:09:18', 'good');
INSERT INTO `answer_record` VALUES (15, 12, 29, 2, 2, 10, '题1：基础概念', '2025-12-18 08:47:08', '2025-12-18 08:47:08', 'excellent');
INSERT INTO `answer_record` VALUES (16, 12, 10, 2, 2, 8, '题2：时间复杂度；题2：时间复杂度；题1：基础概念', '2025-12-22 10:39:55', '2025-12-22 10:39:55', 'good');

-- ----------------------------
-- Table structure for course_student
-- ----------------------------
DROP TABLE IF EXISTS `course_student`;
CREATE TABLE `course_student`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_id` bigint UNSIGNED NOT NULL,
  `student_id` bigint UNSIGNED NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_course_student_course_id_student_id`(`course_id` ASC, `student_id` ASC) USING BTREE,
  UNIQUE INDEX `uk_course_student`(`course_id` ASC, `student_id` ASC) USING BTREE,
  INDEX `idx_course_student_course_id`(`course_id` ASC) USING BTREE,
  INDEX `idx_course_student_student_id`(`student_id` ASC) USING BTREE,
  CONSTRAINT `fk_course_student_course_id` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_course_student_student_id` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 170 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of course_student
-- ----------------------------
INSERT INTO `course_student` VALUES (1, 1, 1, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (2, 1, 2, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (3, 1, 3, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (4, 1, 4, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (5, 1, 5, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (6, 1, 6, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (7, 1, 7, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (8, 1, 8, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (9, 1, 9, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (10, 1, 10, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (11, 1, 11, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (12, 1, 12, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (13, 1, 13, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (14, 1, 14, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (15, 1, 15, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (16, 1, 16, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (17, 1, 17, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (18, 1, 18, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (19, 1, 19, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (20, 1, 20, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (21, 1, 21, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (22, 1, 22, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (23, 1, 23, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (24, 1, 24, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (25, 1, 25, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (26, 1, 26, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (27, 1, 27, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (28, 1, 28, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (29, 1, 29, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (30, 1, 30, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (31, 1, 31, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (32, 1, 32, '2025-12-16 13:00:40');
INSERT INTO `course_student` VALUES (74, 2, 1, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (75, 2, 2, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (76, 2, 3, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (77, 2, 4, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (78, 2, 5, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (79, 2, 6, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (80, 2, 7, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (81, 2, 8, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (82, 2, 9, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (83, 2, 10, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (84, 2, 11, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (85, 2, 12, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (86, 2, 13, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (87, 2, 14, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (88, 2, 15, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (89, 2, 16, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (90, 2, 17, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (91, 2, 18, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (92, 2, 19, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (93, 2, 20, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (94, 2, 21, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (95, 2, 22, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (96, 2, 23, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (97, 2, 24, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (98, 2, 25, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (99, 2, 26, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (100, 2, 27, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (101, 2, 28, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (102, 2, 29, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (103, 2, 30, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (104, 2, 31, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (105, 2, 32, '2025-12-18 00:44:22');
INSERT INTO `course_student` VALUES (106, 8, 1, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (107, 8, 2, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (108, 8, 3, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (109, 8, 4, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (110, 8, 5, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (111, 8, 6, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (112, 8, 7, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (113, 8, 8, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (114, 8, 9, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (115, 8, 10, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (116, 8, 11, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (117, 8, 12, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (118, 8, 13, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (119, 8, 14, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (120, 8, 15, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (121, 8, 16, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (122, 8, 17, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (123, 8, 18, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (124, 8, 19, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (125, 8, 20, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (126, 8, 21, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (127, 8, 22, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (128, 8, 23, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (129, 8, 24, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (130, 8, 25, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (131, 8, 26, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (132, 8, 27, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (133, 8, 28, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (134, 8, 29, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (135, 8, 30, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (136, 8, 31, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (137, 8, 32, '2025-12-18 02:38:59');
INSERT INTO `course_student` VALUES (138, 12, 1, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (139, 12, 2, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (140, 12, 3, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (141, 12, 4, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (142, 12, 5, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (143, 12, 6, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (144, 12, 7, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (145, 12, 8, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (146, 12, 9, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (147, 12, 10, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (148, 12, 11, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (149, 12, 12, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (150, 12, 13, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (151, 12, 14, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (152, 12, 15, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (153, 12, 16, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (154, 12, 17, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (155, 12, 18, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (156, 12, 19, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (157, 12, 20, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (158, 12, 21, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (159, 12, 22, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (160, 12, 23, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (161, 12, 24, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (162, 12, 25, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (163, 12, 26, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (164, 12, 27, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (165, 12, 28, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (166, 12, 29, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (167, 12, 30, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (168, 12, 31, '2025-12-18 08:46:37');
INSERT INTO `course_student` VALUES (169, 12, 32, '2025-12-18 08:46:37');

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `course_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `teacher_id` bigint UNSIGNED NOT NULL,
  `term` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_courses_teacher_id`(`teacher_id` ASC) USING BTREE,
  INDEX `idx_courses_term`(`term` ASC) USING BTREE,
  INDEX `idx_courses_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_courses_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of courses
-- ----------------------------
INSERT INTO `courses` VALUES (1, 'Web 开发基础', 2, '2025秋', '课程演示用', 'active', '2025-12-13 23:40:02', '2025-12-13 23:40:02');
INSERT INTO `courses` VALUES (2, '数据库原理', 2, '2025秋', '练习抽答与统计', 'active', '2025-12-13 23:40:02', '2025-12-13 23:40:02');
INSERT INTO `courses` VALUES (3, 'Java 程序设计', 3, '2025秋', '后端课程演示', 'active', '2025-12-13 23:40:02', '2025-12-13 23:40:02');
INSERT INTO `courses` VALUES (4, '软件工程', 3, '2025秋', '课设演示用', 'active', '2025-12-13 23:40:02', '2025-12-13 23:40:02');
INSERT INTO `courses` VALUES (8, '这是一个测试课程', 2, '这是一个测试课程', '这是一个测试课程', 'active', '2025-12-17 12:23:16', '2025-12-17 12:23:16');
INSERT INTO `courses` VALUES (12, 'test', 2, 'yhhh', 'kkk', 'active', '2025-12-18 08:46:33', '2025-12-18 08:46:33');

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `student_no` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `major` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `grade` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `class_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_students_student_no`(`student_no` ASC) USING BTREE,
  UNIQUE INDEX `uk_student_no`(`student_no` ASC) USING BTREE,
  INDEX `idx_students_name`(`name` ASC) USING BTREE,
  INDEX `idx_students_class_name`(`class_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 143 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of students
-- ----------------------------
INSERT INTO `students` VALUES (1, '2023013418', '刘晶', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (2, '2023013425', '徐菲', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (3, '2023013423', '袁文青', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (4, '2023013421', '叶美丽', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (5, '2023013398', '蒋耀庆', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (6, '2023013417', '杨静茹', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (7, '2023013412', '邓江群', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (8, '2023013422', '谭金芳', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (9, '2023013419', '李秋珠', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (10, '2023013400', '彭鑫越', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (11, '2023013420', '张欣敏', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (12, '2023013426', '廖慧宁', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (13, '2023013415', '王淦', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (14, '2023013402', '欧阳怀超', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (15, '2023013397', '赵勇刚', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (16, '2023013410', '罗舟凯', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (17, '2023013409', '赵文韬', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (18, '2023013414', '陈美宏', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (19, '2023013407', '范俊豪', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (20, '2023013408', '王伟江', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (21, '2023013416', '蒋文杰', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (22, '2023013405', '郑浪', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (23, '2023013394', '张云翔', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (24, '2023013403', '罗沂昊', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (25, '2023013393', '朱浩', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (26, '2023013404', '贺昕', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (27, '2023013399', '杨熙', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (28, '2023013411', '曾烨', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (29, '2023013406', '吴柱', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (30, '2023013396', '蒋长海', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (31, '2023013401', '唐鹏', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (32, '2023013413', '戴乐', '计算机科学与技术', '2023', '三班', '2025-12-16 12:57:30', '2025-12-16 13:03:58');
INSERT INTO `students` VALUES (103, 'DELTEST2025121701', '删除测试学生A', 'CS', '2025', '计科1班', '2025-12-17 10:51:12', '2025-12-17 10:51:12');
INSERT INTO `students` VALUES (104, 'DELTEST2025121702', '删除测试学生B', 'CS', '2025', '计科1班', '2025-12-17 10:51:12', '2025-12-17 10:51:12');
INSERT INTO `students` VALUES (105, 'DELTEST2025121703', '删除测试学生C', 'SE', '2025', '软工1班', '2025-12-17 10:51:12', '2025-12-17 10:51:12');
INSERT INTO `students` VALUES (106, 'DELUSERTEST2025121701', 'DELUSERTEST-学生1', 'CS', '2025', '计科1班', '2025-12-17 11:15:09', '2025-12-17 11:15:09');
INSERT INTO `students` VALUES (107, 'DELUSERTEST2025121702', 'DELUSERTEST-学生2', 'CS', '2025', '计科1班', '2025-12-17 11:15:09', '2025-12-17 11:15:09');
INSERT INTO `students` VALUES (108, 'DELUSERTEST2025121703', 'DELUSERTEST-学生3', 'SE', '2025', '软工1班', '2025-12-17 11:15:09', '2025-12-17 11:15:09');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone_number` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `real_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '哈希加密后的密码',
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_users_phone_number`(`phone_number` ASC) USING BTREE,
  INDEX `idx_users_role`(`role` ASC) USING BTREE,
  INDEX `idx_users_status`(`status` ASC) USING BTREE,
  INDEX `idx_users_real_name`(`real_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', '18800000001', '系统管理员', '0192023a7bbd73250516f069df18b500', '1', '2025-12-13 23:40:02', '2025-12-14 13:56:04');
INSERT INTO `users` VALUES (2, 'teacher', '18800000011', '张老师', 'e10adc3949ba59abbe56e057f20f883e', '1', '2025-12-13 23:40:02', '2025-12-16 11:05:58');
INSERT INTO `users` VALUES (3, 'teacher', '18800000012', '李老师', 'e10adc3949ba59abbe56e057f20f883e', '1', '2025-12-13 23:40:02', '2025-12-16 11:06:18');
INSERT INTO `users` VALUES (4, 'admin', 'admin', '管理员', '$2a$10$cFBVNU2qL81u1NzQaUeu8OkbCbciTed5cnJpxo.obT6i9ihIkWxj2', '1', '2025-12-14 10:33:11', '2025-12-14 13:53:14');
INSERT INTO `users` VALUES (5, 'teacher', '18012344321', 'zhangsan', 'e10adc3949ba59abbe56e057f20f883e', '1', '2025-12-15 01:25:12', '2025-12-15 01:25:12');
INSERT INTO `users` VALUES (6, 'teacher', '18012344322', 'zhangsan', 'e10adc3949ba59abbe56e057f20f883e', '1', '2025-12-15 10:42:43', '2025-12-15 10:42:43');
INSERT INTO `users` VALUES (7, 'admin', '18012344325', '蒋耀庆', '111111', '1', '2025-12-15 14:33:42', '2025-12-18 08:49:04');

SET FOREIGN_KEY_CHECKS = 1;
