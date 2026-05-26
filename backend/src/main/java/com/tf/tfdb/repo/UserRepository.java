package com.tf.tfdb.repo;

import com.tf.tfdb.entity.User;
import com.tf.tfdb.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhoneNumber(String phoneNumber);
    List<User> findByRoleOrderByIdDesc(UserRole role);
    boolean existsByPhoneNumber(String phoneNumber);
}
