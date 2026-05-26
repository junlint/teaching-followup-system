package com.tf.tfdb.controller.teacher;

import com.tf.tfdb.dto.teacher.DrawStudentRequest;
import com.tf.tfdb.dto.teacher.StudentDto;
import com.tf.tfdb.security.SecurityUser;
import com.tf.tfdb.service.RollcallService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teacher/courses/{courseId}")
@RequiredArgsConstructor
public class TeacherRollcallController {

    private final RollcallService rollcallService;

    @PostMapping("/draw")
    public StudentDto draw(@AuthenticationPrincipal SecurityUser su,
                           @PathVariable Long courseId,
                           @Valid @RequestBody DrawStudentRequest req) {
        return rollcallService.draw(su, courseId, req);
    }
}
