package com.tf.tfdb.service;

import com.tf.tfdb.dto.admin.*;
import com.tf.tfdb.entity.User;
import com.tf.tfdb.exception.ApiException;
import com.tf.tfdb.model.UserRole;
import com.tf.tfdb.model.UserStatus;
import com.tf.tfdb.repo.CourseRepository;
import com.tf.tfdb.repo.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminTeacherService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    public List<TeacherDto> listTeachers() {
        return userRepository.findByRoleOrderByIdDesc(UserRole.teacher).stream()
                .map(u -> TeacherDto.builder()
                        .id(u.getId())
                        .username(u.getPhoneNumber())
                        .realName(u.getRealName())
                        .status(u.getStatus().name())
                        .build())
                .toList();
    }

    public TeacherDto createTeacher(@Valid CreateTeacherRequest req) {
        if (userRepository.existsByPhoneNumber(req.getUsername())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "用户名已存在");
        }
        UserStatus status;
        try {
            status = UserStatus.valueOf(req.getStatus());
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "status 只能是 active/disabled");
        }

        String realName = (req.getRealName() == null || req.getRealName().isBlank())
                ? req.getUsername()
                : req.getRealName();

        User t = User.builder()
                .role(UserRole.teacher)
                .phoneNumber(req.getUsername())
                .realName(realName)
                .password(passwordEncoder.encode(req.getPassword()))
                .status(status)
                .build();

        userRepository.save(t);

        return TeacherDto.builder()
                .id(t.getId())
                .username(t.getPhoneNumber())
                .realName(t.getRealName())
                .status(t.getStatus().name())
                .build();
    }

    public TeacherDto updateTeacherStatus(Long id, @Valid UpdateTeacherRequest req) {
        User t = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "老师不存在"));

        if (t.getRole() != UserRole.teacher) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "只能修改老师账号");
        }

        UserStatus status;
        try {
            status = UserStatus.valueOf(req.getStatus());
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "status 只能是 active/disabled");
        }
        t.setStatus(status);
        userRepository.save(t);

        return TeacherDto.builder()
                .id(t.getId())
                .username(t.getPhoneNumber())
                .realName(t.getRealName())
                .status(t.getStatus().name())
                .build();
    }

    public void deleteTeacher(Long id) {
        User t = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "老师不存在"));

        if (t.getRole() != UserRole.teacher) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "只能删除老师账号");
        }

        // 如果老师下有课程，建议限制删除（按 PRD）
        if (courseRepository.countByTeacherId(id) > 0) {
            throw new ApiException(HttpStatus.CONFLICT, "该老师名下存在课程，建议禁用而不是删除");
        }

        userRepository.deleteById(id);
    }

    public void resetPassword(Long id, @Valid ResetPasswordRequest req) {
        User t = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "老师不存在"));
        if (t.getRole() != UserRole.teacher) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "只能重置老师密码");
        }
        t.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(t);
    }
}
