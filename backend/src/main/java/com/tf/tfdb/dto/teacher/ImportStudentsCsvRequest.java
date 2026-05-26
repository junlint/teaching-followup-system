package com.tf.tfdb.dto.teacher;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ImportStudentsCsvRequest {
    @NotBlank
    private String csvText;
}
