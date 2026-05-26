package com.tf.tfdb.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateTeacherRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    /**
     * active / disabled
     */
    private String status = "active";

    // 可选
    private String realName;
}
