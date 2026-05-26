package com.tf.tfdb.model;

public enum UserRole {
    admin, teacher;

    public String asSpringRole() {
        return "ROLE_" + this.name().toUpperCase();
    }
}
