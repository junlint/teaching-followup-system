package com.tf.tfdb.service;

import com.tf.tfdb.dto.auth.LoginRequest;
import com.tf.tfdb.dto.auth.LoginResponse;
import com.tf.tfdb.dto.auth.MeResponse;
import com.tf.tfdb.entity.User;
import com.tf.tfdb.exception.ApiException;
import com.tf.tfdb.model.UserStatus;
import com.tf.tfdb.repo.UserRepository;
import com.tf.tfdb.security.JwtService;
import com.tf.tfdb.security.SecurityUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public LoginResponse login(@Valid LoginRequest req) {
        User user = userRepository.findByPhoneNumber(req.getUsername())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "账号或密码错误"));

        if (user.getStatus() == UserStatus.disabled) {
            throw new ApiException(HttpStatus.FORBIDDEN, "账号已禁用");
        }
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "账号或密码错误");
        }

        String token = jwtService.issueToken(user.getId(), user.getRole().name());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .role(user.getRole().name())
                .username(user.getPhoneNumber())
                .build();
    }

    public MeResponse me(SecurityUser su) {
        if (su == null) throw new ApiException(HttpStatus.UNAUTHORIZED, "未登录");
        return MeResponse.builder()
                .userId(su.getId())
                .role(su.getRole().replace("ROLE_", "").toLowerCase())
                .username(su.getUsername())
                .realName(su.getRealName())
                .status(su.getStatus().name())
                .build();
    }
}
