package com.tf.tfdb.service;

import com.tf.tfdb.dto.teacher.CourseDto;
import com.tf.tfdb.dto.teacher.CreateCourseRequest;
import com.tf.tfdb.dto.teacher.UpdateCourseRequest;
import com.tf.tfdb.entity.Course;
import com.tf.tfdb.entity.User;
import com.tf.tfdb.exception.ApiException;
import com.tf.tfdb.model.CourseStatus;
import com.tf.tfdb.repo.CourseRepository;
import com.tf.tfdb.repo.UserRepository;
import com.tf.tfdb.security.SecurityUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherCourseService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;

    public List<CourseDto> listMyCourses(SecurityUser su) {
        return courseRepository.findByTeacherIdOrderByIdDesc(su.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    public CourseDto create(SecurityUser su, @Valid CreateCourseRequest req) {
        User teacher = userRepository.findById(su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "未登录"));

        Course c = Course.builder()
                .courseName(req.getName())
                .teacher(teacher)
                .term(req.getTerm())
                .description(req.getDescription())
                .status(CourseStatus.active)
                .build();

        courseRepository.save(c);
        return toDto(c);
    }

    public CourseDto update(SecurityUser su, Long courseId, @Valid UpdateCourseRequest req) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));

        if (req.getName() != null) c.setCourseName(req.getName());
        if (req.getTerm() != null) c.setTerm(req.getTerm());
        if (req.getDescription() != null) c.setDescription(req.getDescription());
        if (req.getStatus() != null) {
            try {
                c.setStatus(CourseStatus.valueOf(req.getStatus()));
            } catch (Exception e) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "status 只能是 active/archived");
            }
        }
        courseRepository.save(c);
        return toDto(c);
    }

    public void delete(SecurityUser su, Long courseId) {
        Course c = courseRepository.findByIdAndTeacherId(courseId, su.getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "课程不存在或无权限"));
        courseRepository.delete(c);
    }

    private CourseDto toDto(Course c) {
        return CourseDto.builder()
                .id(c.getId())
                .name(c.getCourseName())
                .term(c.getTerm())
                .description(c.getDescription())
                .status(c.getStatus().name())
                .build();
    }
}
