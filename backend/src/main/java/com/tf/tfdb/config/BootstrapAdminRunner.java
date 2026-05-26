package com.tf.tfdb.config;

import com.tf.tfdb.entity.User;
import com.tf.tfdb.model.UserRole;
import com.tf.tfdb.model.UserStatus;
import com.tf.tfdb.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BootstrapAdminRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap.admin.enabled:true}")
    private boolean enabled;

    @Value("${app.bootstrap.admin.username:admin}")
    private String username;

    @Value("${app.bootstrap.admin.password:123456}")
    private String password;

    @Override
    public void run(String... args) {
        if (!enabled) return;

        // 如果已经存在 admin 账号（按 username=phone_number），则不重复创建
        if (userRepository.existsByPhoneNumber(username)) return;

        User admin = User.builder()
                .role(UserRole.admin)
                .phoneNumber(username)
                .realName("管理员")
                .password(passwordEncoder.encode(password))
                .status(UserStatus.active)
                .build();
        userRepository.save(admin);
    }
}
