package com.tf.tfdb.dto.teacher;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentStatDto {
    private Long studentId;
    private String studentNo;
    private String studentName;
    private String major;
    private String grade;
    private String className;

    private Long count;
    private Long totalScore;
    private Double avgScore;

    private LocalDateTime lastTime;
    private String lastTag;
    private Integer lastScore;
}
