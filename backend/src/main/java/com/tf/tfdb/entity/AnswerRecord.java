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
@Table(name = "answer_record",
       indexes = {
           @Index(name = "idx_answer_record_course_id", columnList = "course_id"),
           @Index(name = "idx_answer_record_student_id", columnList = "student_id"),
           @Index(name = "idx_answer_record_created_by", columnList = "created_by"),
           @Index(name = "idx_answer_record_updated_by", columnList = "updated_by"),
           @Index(name = "idx_answer_record_created_at", columnList = "created_at")
       })
public class AnswerRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;

    @Column(name = "performance_tag", nullable = false, length = 30)
    private String performanceTag;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "question_note", nullable = false, length = 200)
    private String questionNote;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
