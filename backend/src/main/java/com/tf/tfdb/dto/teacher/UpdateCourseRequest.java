package com.tf.tfdb.dto.teacher;

import lombok.Data;

@Data
public class UpdateCourseRequest {
    private String name;
    private String term;
    private String description;
    private String status; // active / archived
}
