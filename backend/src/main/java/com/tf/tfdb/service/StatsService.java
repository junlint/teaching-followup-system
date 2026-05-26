package com.tf.tfdb.service;

import com.tf.tfdb.dto.teacher.StudentStatDto;
import com.tf.tfdb.entity.Course;
import com.tf.tfdb.exception.ApiException;
import com.tf.tfdb.repo.AnswerRecordRepository;
import com.tf.tfdb.repo.CourseRepository;
import com.tf.tfdb.security.SecurityUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final CourseRepository courseRepository;
    private final AnswerRecordRepository answerRecordRepository;

    public List<StudentStatDto> stats(SecurityUser su, Long courseId) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        List<Object[]> rows = answerRecordRepository.statsByCourse(c.getId());
        return rows.stream().map(this::map).toList();
    }

    private StudentStatDto map(Object[] r) {
        // 顺序见 statsByCourse SELECT
        int i = 0;
        Long studentId = ((Number) r[i++]).longValue();
        String studentNo = (String) r[i++];
        String studentName = (String) r[i++];
        String major = (String) r[i++];
        String grade = (String) r[i++];
        String className = (String) r[i++];

        Long count = ((Number) r[i++]).longValue();
        Long totalScore = ((Number) r[i++]).longValue();
        Double avgScore = ((Number) r[i++]).doubleValue();

        LocalDateTime lastTime = null;
        if (r[i] != null) {
            if (r[i] instanceof Timestamp ts) {
                lastTime = ts.toLocalDateTime();
            } else if (r[i] instanceof LocalDateTime ldt) {
                lastTime = ldt;
            }
        }
        i++;
        String lastTag = (String) r[i++];
        Integer lastScore = (r[i] == null) ? null : ((Number) r[i]).intValue();

        return StudentStatDto.builder()
                .studentId(studentId)
                .studentNo(studentNo)
                .studentName(studentName)
                .major(major)
                .grade(grade)
                .className(className)
                .count(count)
                .totalScore(totalScore)
                .avgScore(avgScore)
                .lastTime(lastTime)
                .lastTag(lastTag)
                .lastScore(lastScore)
                .build();
    }
}
