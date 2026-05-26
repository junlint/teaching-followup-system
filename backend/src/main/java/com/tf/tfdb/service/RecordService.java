package com.tf.tfdb.service;

import com.tf.tfdb.dto.teacher.CreateRecordRequest;
import com.tf.tfdb.dto.teacher.RecordDto;
import com.tf.tfdb.entity.AnswerRecord;
import com.tf.tfdb.entity.Course;
import com.tf.tfdb.entity.Student;
import com.tf.tfdb.entity.User;
import com.tf.tfdb.exception.ApiException;
import com.tf.tfdb.model.PerformanceTag;
import com.tf.tfdb.repo.AnswerRecordRepository;
import com.tf.tfdb.repo.CourseRepository;
import com.tf.tfdb.repo.CourseStudentRepository;
import com.tf.tfdb.repo.StudentRepository;
import com.tf.tfdb.repo.UserRepository;
import com.tf.tfdb.security.SecurityUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final CourseRepository courseRepository;
    private final CourseStudentRepository courseStudentRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AnswerRecordRepository answerRecordRepository;

    public RecordDto create(SecurityUser su, Long courseId, @Valid CreateRecordRequest req) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        if (!PerformanceTag.isValid(req.getPerformanceTag())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "performanceTag 非法");
        }

        Student s = studentRepository.findById(req.getStudentId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "学生不存在"));

        if (!courseStudentRepository.existsByCourseIdAndStudentId(c.getId(), s.getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "该学生不在本课程");
        }

        User teacher = userRepository.findById(su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "未登录"));

        AnswerRecord ar = AnswerRecord.builder()
                .course(c)
                .student(s)
                .createdBy(teacher)
                .performanceTag(req.getPerformanceTag())
                .score(req.getScore())
                .questionNote(req.getQuestionNote() == null ? "" : req.getQuestionNote())
                .build();

        answerRecordRepository.save(ar);

        return RecordDto.builder()
                .id(ar.getId())
                .studentId(s.getId())
                .studentNo(s.getStudentNo())
                .studentName(s.getName())
                .performanceTag(ar.getPerformanceTag())
                .score(ar.getScore())
                .questionNote(ar.getQuestionNote())
                .createdAt(ar.getCreatedAt())
                .build();
    }

    public List<RecordDto> list(SecurityUser su, Long courseId) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        return answerRecordRepository.findAllByCourseIdOrderByCreatedAtDesc(c.getId())
                .stream()
                .map(ar -> RecordDto.builder()
                        .id(ar.getId())
                        .studentId(ar.getStudent().getId())
                        .studentNo(ar.getStudent().getStudentNo())
                        .studentName(ar.getStudent().getName())
                        .performanceTag(ar.getPerformanceTag())
                        .score(ar.getScore())
                        .questionNote(ar.getQuestionNote())
                        .createdAt(ar.getCreatedAt())
                        .build())
                .toList();
    }
}
