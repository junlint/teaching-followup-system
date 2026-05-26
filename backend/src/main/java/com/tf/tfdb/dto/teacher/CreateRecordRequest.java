package com.tf.tfdb.dto.teacher;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateRecordRequest {

    @NotNull
    private Long studentId;

    @NotBlank
    private String performanceTag;

    @NotNull
    @Min(0)
    @Max(10)
    private Integer score;

    @Size(max = 200)
    private String questionNote = "";
}
