package com.tf.tfdb.dto.teacher;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DrawStudentRequest {
    private List<Long> excludeStudentIds = new ArrayList<>();
}
