package com.tf.tfdb.dto.teacher;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordDto {
    private Long id;
    private Long studentId;
    private String studentNo;
    private String studentName;

    private String performanceTag;
    private Integer score;
    private String questionNote;

    private LocalDateTime createdAt;
}
