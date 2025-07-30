package com.aicontact.backend.comic.repository;

import java.util.List;

import com.aicontact.backend.comic.entity.ComicEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComicRepository extends JpaRepository<ComicEntity, Long> {
    List<ComicEntity> findAllByCoupleIdOrderByCreatedAtDesc(Long coupleId);
}

