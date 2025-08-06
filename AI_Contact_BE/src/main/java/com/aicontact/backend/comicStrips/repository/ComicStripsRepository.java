package com.aicontact.backend.comicStrips.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aicontact.backend.comicStrips.entity.ComicStripsEntity;
import com.aicontact.backend.comic.entity.ComicEntity;

public interface ComicStripsRepository extends JpaRepository<ComicStripsEntity, Long> {

    List<ComicEntity> findAllByCoupleIdOrderByCreatedAtDesc(Long coupleId);

}
