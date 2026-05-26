package com.tf.tfdb.controller.teacher;

import com.tf.tfdb.dto.teacher.CreateRecordRequest;
import com.tf.tfdb.dto.teacher.RecordDto;
import com.tf.tfdb.security.SecurityUser;
import com.tf.tfdb.service.RecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher/courses/{courseId}")
@RequiredArgsConstructor
public class TeacherRecordController {

    private final RecordService recordService;

    @PostMapping("/records")
    public RecordDto create(@AuthenticationPrincipal SecurityUser su,
                            @PathVariable Long courseId,
                            @Valid @RequestBody CreateRecordRequest req) {
        return recordService.create(su, courseId, req);
    }

    @GetMapping("/records")
    public List<RecordDto> list(@AuthenticationPrincipal SecurityUser su,
                                @PathVariable Long courseId) {
        return recordService.list(su, courseId);
    }
}
