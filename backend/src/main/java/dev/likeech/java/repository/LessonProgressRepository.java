package dev.likeech.java.repository;

import dev.likeech.java.entity.Lesson;
import dev.likeech.java.entity.LessonProgress;
import dev.likeech.java.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserAndLesson(User user, Lesson lesson);
    List<LessonProgress> findByUser_UserIdAndIsCompletedTrue(Long userId);
    @Query("SELECT lp FROM LessonProgress lp WHERE lp.user.userId = :userId AND lp.lesson.lessonId IN :lessonIds AND lp.isCompleted = true")
    List<LessonProgress> findCompletedByUserAndLessonIds(@Param("userId") Long userId, @Param("lessonIds") List<Long> lessonIds);

}
