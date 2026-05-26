package com.tf.tfdb.service;

import com.tf.tfdb.dto.teacher.*;
import com.tf.tfdb.entity.Course;
import com.tf.tfdb.entity.CourseStudent;
import com.tf.tfdb.entity.Student;
import com.tf.tfdb.exception.ApiException;
import com.tf.tfdb.repo.CourseRepository;
import com.tf.tfdb.repo.CourseStudentRepository;
import com.tf.tfdb.repo.StudentRepository;
import com.tf.tfdb.repo.proj.StudentRow;
import com.tf.tfdb.security.SecurityUser;
import com.tf.tfdb.util.CsvImportUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherStudentService {

    private final CourseRepository courseRepository;
    private final CourseStudentRepository courseStudentRepository;
    private final StudentRepository studentRepository;

    public List<StudentDto> listCourseStudents(SecurityUser su, Long courseId) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        return courseStudentRepository.findAllByCourseIdWithStudent(c.getId())
                .stream()
                .map(cs -> toDto(cs.getStudent()))
                .toList();
    }

    public List<StudentDto> search(SecurityUser su, Long courseId, @Valid SearchStudentsRequest req) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        String kw = req.getKeyword().trim();
        List<StudentRow> rows = courseStudentRepository.searchStudents(c.getId(), kw);
        return rows.stream().map(r -> StudentDto.builder()
                .id(r.getId())
                .studentNo(r.getStudentNo())
                .name(r.getName())
                .major(r.getMajor())
                .grade(r.getGrade())
                .className(r.getClassName())
                .build()).toList();
    }

    @Transactional
    public ImportResultDto importCsv(SecurityUser su, Long courseId, @Valid ImportStudentsCsvRequest req) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        CsvImportUtils.ParseResult parsed = CsvImportUtils.parse(req.getCsvText());
        if (!parsed.headerOk()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "CSV 缺少必填列：student_no(学号)、name(姓名)");
        }

        int success = 0;
        int failed = 0;
        int dup = 0;
        List<ImportResultDto.ImportRowError> errors = new ArrayList<>();

        int rowIdx = 0;
        for (CsvImportUtils.StudentRow row : parsed.rows()) {
            rowIdx++;
            String studentNo = row.studentNo();
            String name = row.name();

            if (studentNo == null || studentNo.isBlank() || name == null || name.isBlank()) {
                failed++;
                errors.add(ImportResultDto.ImportRowError.builder()
                        .row(rowIdx)
                        .reason("学号或姓名为空")
                        .raw(row.raw())
                        .build());
                continue;
            }

            // students 表按 student_no 唯一：存在则更新，不存在则插入
            Student s = studentRepository.findByStudentNo(studentNo).orElseGet(() ->
                    Student.builder().studentNo(studentNo).build()
            );
            s.setName(name);
            if (row.major() != null) s.setMajor(row.major());
            if (row.grade() != null) s.setGrade(row.grade());
            if (row.className() != null) s.setClassName(row.className());
            s = studentRepository.save(s);

            // course_student 表：同一课程重复学号算重复，跳过
            if (courseStudentRepository.existsByCourseIdAndStudentId(c.getId(), s.getId())) {
                dup++;
                continue;
            }

            CourseStudent cs = CourseStudent.builder().course(c).student(s).build();
            courseStudentRepository.save(cs);
            success++;
        }

        return ImportResultDto.builder()
                .successCount(success)
                .failedCount(failed)
                .duplicateCount(dup)
                .errors(errors)
                .build();
    }

    private StudentDto toDto(Student s) {
        return StudentDto.builder()
                .id(s.getId())
                .studentNo(s.getStudentNo())
                .name(s.getName())
                .major(s.getMajor())
                .grade(s.getGrade())
                .className(s.getClassName())
                .build();
    }
}
