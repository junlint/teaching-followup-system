package com.tf.tfdb.model;

import java.util.Arrays;

public enum PerformanceTag {
    excellent, good, ok, poor, none, absent;

    public static boolean isValid(String code) {
        if (code == null) return false;
        return Arrays.stream(values()).anyMatch(v -> v.name().equalsIgnoreCase(code));
    }
}
