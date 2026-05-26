package com.tf.tfdb.entity;

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
@Table(name = "students",
       indexes = {
           @Index(name = "idx_students_name", columnList = "name"),
           @Index(name = "idx_students_class_name", columnList = "class_name")
       },
       uniqueConstraints = @UniqueConstraint(name = "uk_students_student_no", columnNames = "student_no"))
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_no", nullable = false, length = 30)
    private String studentNo;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 80)
    private String major;

    @Column(length = 20)
    private String grade;

    @Column(name = "class_name", length = 50)
    private String className;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
