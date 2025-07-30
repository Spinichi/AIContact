package com.aicontact.backend.comic.entity;

import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "comic_strips")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComicEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private CoupleEntity couple;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private UserEntity creator;

    @Column(name = "comic_image_url", nullable = false, length = 500)
    private String comicImageUrl;

    @Column(name = "s3_key", nullable = false, length = 500)
    private String s3Key;

    @Column(length = 100)
    private String title;

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
}

