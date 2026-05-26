package com.tf.tfdb.controller.admin;

import com.tf.tfdb.dto.admin.*;
import com.tf.tfdb.service.AdminTeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/teachers")
@RequiredArgsConstructor
public class AdminTeacherController {

    private final AdminTeacherService adminTeacherService;

    @GetMapping
    public List<TeacherDto> list() {
        return adminTeacherService.listTeachers();
    }

    @PostMapping
    public TeacherDto create(@Valid @RequestBody CreateTeacherRequest req) {
        return adminTeacherService.createTeacher(req);
    }

    @PutMapping("/{id}")
    public TeacherDto update(@PathVariable Long id, @Valid @RequestBody UpdateTeacherRequest req) {
        return adminTeacherService.updateTeacherStatus(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        adminTeacherService.deleteTeacher(id);
    }

    @PostMapping("/{id}/reset-password")
    public void resetPassword(@PathVariable Long id, @Valid @RequestBody ResetPasswordRequest req) {
        adminTeacherService.resetPassword(id, req);
    }
}
