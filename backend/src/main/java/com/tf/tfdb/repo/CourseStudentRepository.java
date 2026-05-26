package com.tf.tfdb.repo;

import com.tf.tfdb.entity.CourseStudent;
import com.tf.tfdb.repo.proj.StudentRow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseStudentRepository extends JpaRepository<CourseStudent, Long> {

    @Query("""        
        select cs from CourseStudent cs
        join fetch cs.student s
        where cs.course.id = :courseId
        order by s.studentNo asc
    """)
    List<CourseStudent> findAllByCourseIdWithStudent(Long courseId);

    boolean existsByCourseIdAndStudentId(Long courseId, Long studentId);

    long countByCourseId(Long courseId);

    @Query("""        
        select cs.student.id from CourseStudent cs
        where cs.course.id = :courseId
    """)
    List<Long> findStudentIdsByCourseId(Long courseId);

    @Query(value = """        
        select s.id     as id,
               s.student_no as studentNo,
               s.name as name,
               s.major as major,
               s.grade as grade,
               s.class_name as className
        from course_student cs
        join students s on cs.student_id = s.id
        where cs.course_id = :courseId
          and (s.student_no like concat('%', :kw, '%') or s.name like concat('%', :kw, '%'))
        order by s.student_no asc
        limit 50
    """, nativeQuery = true)
    List<StudentRow> searchStudents(Long courseId, String kw);
}
