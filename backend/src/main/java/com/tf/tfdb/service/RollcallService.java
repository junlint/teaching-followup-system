package com.tf.tfdb.service;

import com.tf.tfdb.dto.teacher.DrawStudentRequest;
import com.tf.tfdb.dto.teacher.StudentDto;
import com.tf.tfdb.entity.Course;
import com.tf.tfdb.exception.ApiException;
import com.tf.tfdb.repo.CourseRepository;
import com.tf.tfdb.repo.CourseStudentRepository;
import com.tf.tfdb.security.SecurityUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RollcallService {

    private final CourseRepository courseRepository;
    private final CourseStudentRepository courseStudentRepository;
    private final JdbcTemplate jdbcTemplate;

    public StudentDto draw(SecurityUser su, Long courseId, @Valid DrawStudentRequest req) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        long count = courseStudentRepository.countByCourseId(c.getId());
        if (count == 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "课程无学生，请先导入学生");
        }

        List<Long> exclude = req.getExcludeStudentIds() == null ? List.of() : req.getExcludeStudentIds();
        String sql = """            
            select s.id, s.student_no, s.name, s.major, s.grade, s.class_name
            from course_student cs
            join students s on s.id = cs.student_id
            where cs.course_id = ?
        """;
        if (!exclude.isEmpty()) {
            String in = exclude.stream().map(x -> "?").collect(Collectors.joining(","));
            sql += " and s.id not in (" + in + ")";
        }
        sql += " order by rand() limit 1";

        Object[] args;
        if (exclude.isEmpty()) {
            args = new Object[]{c.getId()};
        } else {
            args = new Object[1 + exclude.size()];
            args[0] = c.getId();
            for (int i = 0; i < exclude.size(); i++) args[i + 1] = exclude.get(i);
        }

        List<StudentDto> res = jdbcTemplate.query(sql, (rs, rowNum) -> StudentDto.builder()
                .id(rs.getLong("id"))
                .studentNo(rs.getString("student_no"))
                .name(rs.getString("name"))
                .major(rs.getString("major"))
                .grade(rs.getString("grade"))
                .className(rs.getString("class_name"))
                .build(), args);

        if (res.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "没有可抽取的学生（可能已全部排除）");
        }
        return res.get(0);
    }
}
