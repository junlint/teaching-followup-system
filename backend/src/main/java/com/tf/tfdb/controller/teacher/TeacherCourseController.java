package com.tf.tfdb.controller.teacher;

import com.tf.tfdb.dto.teacher.CourseDto;
import com.tf.tfdb.dto.teacher.CreateCourseRequest;
import com.tf.tfdb.dto.teacher.UpdateCourseRequest;
import com.tf.tfdb.security.SecurityUser;
import com.tf.tfdb.service.TeacherCourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/courses")
@RequiredArgsConstructor
public class TeacherCourseController {

    private final TeacherCourseService teacherCourseService;

    @GetMapping
    public List<CourseDto> list(@AuthenticationPrincipal SecurityUser su) {
        return teacherCourseService.listMyCourses(su);
    }

    @PostMapping
    public CourseDto create(@AuthenticationPrincipal SecurityUser su,
                            @Valid @RequestBody CreateCourseRequest req) {
        return teacherCourseService.create(su, req);
    }

    @PutMapping("/{courseId}")
    public CourseDto update(@AuthenticationPrincipal SecurityUser su,
                            @PathVariable Long courseId,
                            @Valid @RequestBody UpdateCourseRequest req) {
        return teacherCourseService.update(su, courseId, req);
    }

    @DeleteMapping("/{courseId}")
    public void delete(@AuthenticationPrincipal SecurityUser su,
                       @PathVariable Long courseId) {
        teacherCourseService.delete(su, courseId);
    }
}
