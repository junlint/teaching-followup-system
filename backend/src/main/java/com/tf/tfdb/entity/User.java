package com.tf.tfdb.entity;

import com.tf.tfdb.model.UserRole;
import com.tf.tfdb.model.UserStatus;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users",
       indexes = {
           @Index(name = "idx_users_role", columnList = "role"),
           @Index(name = "idx_users_status", columnList = "status"),
           @Index(name = "idx_users_real_name", columnList = "real_name")
       },
       uniqueConstraints = @UniqueConstraint(name = "uk_users_phone_number", columnNames = "phone_number"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    /**
     * 注意：前端把它叫 username；你的表字段叫 phone_number。
     * 课设这里直接把 username 映射到 phone_number 存储即可。
     */
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "real_name", nullable = false, length = 50)
    private String realName;

    @Column(nullable = false, length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
