package com.tf.tfdb.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateTeacherRequest {
    @NotBlank
    private String status; // active / disabled
}
