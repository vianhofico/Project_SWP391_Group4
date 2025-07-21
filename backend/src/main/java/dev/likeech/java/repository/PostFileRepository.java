package dev.likeech.java.repository;


import dev.likeech.java.entity.PostFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostFileRepository extends JpaRepository<PostFile, Long> {

    List<PostFile> findByPostPostId(Long postId);

    @Modifying
    @Query("UPDATE PostFile pf SET pf.post.postId = null WHERE pf.postFileId IN :fileIds")
    void detachPostFromFiles(@Param("fileIds") List<Long> fileIds);

    @Query("SELECT pf FROM PostFile pf WHERE pf.post IS NULL")
    List<PostFile> findAllByPostIsNull();

}
