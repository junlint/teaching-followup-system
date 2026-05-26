package com.tf.tfdb.repo;

import com.tf.tfdb.entity.AnswerRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AnswerRecordRepository extends JpaRepository<AnswerRecord, Long> {

    @Query("""        
        select ar from AnswerRecord ar
        join fetch ar.student s
        where ar.course.id = :courseId
        order by ar.createdAt desc, ar.id desc
    """)
    List<AnswerRecord> findAllByCourseIdOrderByCreatedAtDesc(Long courseId);

    @Query(value = """        
        select s.id     as studentId,
               s.student_no as studentNo,
               s.name as studentName,
               s.major as major,
               s.grade as grade,
               s.class_name as className,
               count(ar.id) as recordCount,
               coalesce(sum(ar.score), 0) as totalScore,
               coalesce(avg(ar.score), 0) as avgScore,
               ar_last.created_at as lastTime,
               ar_last.performance_tag as lastTag,
               ar_last.score as lastScore
        from course_student cs
        join students s on cs.student_id = s.id
        left join answer_record ar
          on ar.course_id = cs.course_id and ar.student_id = cs.student_id
        left join answer_record ar_last
          on ar_last.id = (
            select ar2.id
            from answer_record ar2
            where ar2.course_id = cs.course_id and ar2.student_id = cs.student_id
            order by ar2.created_at desc, ar2.id desc
            limit 1
          )
        where cs.course_id = :courseId
        group by s.id, s.student_no, s.name, s.major, s.grade, s.class_name,
                 ar_last.created_at, ar_last.performance_tag, ar_last.score
        order by recordCount desc, avgScore desc, s.student_no asc
    """, nativeQuery = true)
    List<Object[]> statsByCourse(Long courseId);

    @Query(value = """        
        select s.id     as id,
               s.student_no as studentNo,
               s.name as name,
               s.major as major,
               s.grade as grade,
               s.class_name as className
        from students s
        join course_student cs on cs.student_id = s.id
        where cs.course_id = :courseId
        order by s.student_no asc
    """, nativeQuery = true)
    List<Object[]> studentsInCourse(Long courseId);

}
