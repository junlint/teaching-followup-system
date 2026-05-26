package com.tf.tfdb.controller.teacher;

import com.tf.tfdb.dto.teacher.*;
import com.tf.tfdb.security.SecurityUser;
import com.tf.tfdb.service.TeacherStudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/courses/{courseId}")
@RequiredArgsConstructor
public class TeacherStudentController {

    private final TeacherStudentService teacherStudentService;

    @GetMapping("/students")
    public List<StudentDto> list(@AuthenticationPrincipal SecurityUser su,
                                 @PathVariable Long courseId) {
        return teacherStudentService.listCourseStudents(su, courseId);
    }

    @PostMapping("/import-students-csv")
    public ImportResultDto importCsv(@AuthenticationPrincipal SecurityUser su,
                                     @PathVariable Long courseId,
                                     @Valid @RequestBody ImportStudentsCsvRequest req) {
        return teacherStudentService.importCsv(su, courseId, req);
    }

    @PostMapping("/students/search")
    public List<StudentDto> search(@AuthenticationPrincipal SecurityUser su,
                                   @PathVariable Long courseId,
                                   @Valid @RequestBody SearchStudentsRequest req) {
        return teacherStudentService.search(su, courseId, req);
    }
}
