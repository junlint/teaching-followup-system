package com.tf.tfdb.dto.auth;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeResponse {
    private Long userId;
    private String role;
    private String username;
    private String realName;
    private String status;
}
