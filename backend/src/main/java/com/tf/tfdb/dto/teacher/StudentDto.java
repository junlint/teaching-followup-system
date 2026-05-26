package com.tf.tfdb.dto.teacher;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {
    private Long id;
    private String studentNo;
    private String name;
    private String major;
    private String grade;
    private String className;
}
