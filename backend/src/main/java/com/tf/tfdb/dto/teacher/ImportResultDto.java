package com.tf.tfdb.dto.teacher;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportResultDto {
    private int successCount;
    private int failedCount;
    private int duplicateCount;
    private List<ImportRowError> errors;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ImportRowError {
        private int row;      // 1-based (excluding header)
        private String reason;
        private String raw;
    }
}
