package com.tf.tfdb.repo;

import com.tf.tfdb.entity.Course;
import com.tf.tfdb.model.CourseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherIdOrderByIdDesc(Long teacherId);
    Optional<Course> findByIdAndTeacherId(Long id, Long teacherId);
    boolean existsByTeacherId(Long teacherId);
    long countByTeacherId(Long teacherId);
    List<Course> findByTeacherIdAndStatusOrderByIdDesc(Long teacherId, CourseStatus status);
}
