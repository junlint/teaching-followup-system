package com.tf.tfdb.controller;

import com.tf.tfdb.dto.auth.LoginRequest;
import com.tf.tfdb.dto.auth.LoginResponse;
import com.tf.tfdb.dto.auth.MeResponse;
import com.tf.tfdb.security.SecurityUser;
import com.tf.tfdb.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @GetMapping("/me")
    public MeResponse me(@AuthenticationPrincipal SecurityUser su) {
        return authService.me(su);
    }
}
