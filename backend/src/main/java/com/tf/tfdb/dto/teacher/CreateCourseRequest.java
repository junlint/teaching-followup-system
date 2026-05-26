package com.tf.tfdb.dto.teacher;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCourseRequest {
    @NotBlank
    private String name;

    private String term = "";
    private String description = "";
}
