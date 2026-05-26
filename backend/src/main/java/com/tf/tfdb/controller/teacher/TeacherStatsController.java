package com.tf.tfdb.controller.teacher;

import com.tf.tfdb.dto.teacher.StudentStatDto;
import com.tf.tfdb.security.SecurityUser;
import com.tf.tfdb.service.StatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/courses/{courseId}")
@RequiredArgsConstructor
public class TeacherStatsController {

    private final StatsService statsService;

    @GetMapping("/stats")
    public List<StudentStatDto> stats(@AuthenticationPrincipal SecurityUser su,
                                      @PathVariable Long courseId) {
        return statsService.stats(su, courseId);
    }
}
