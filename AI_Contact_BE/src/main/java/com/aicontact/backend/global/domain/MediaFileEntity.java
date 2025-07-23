package com.aicontact.backend.global.domain;

import com.aicontact.backend.couple.entity.CoupleEntity;
import com.aicontact.backend.global.entity.BaseTimeEntity;
import com.aicontact.backend.global.entity.enumeration.FileType;
import com.aicontact.backend.user.entity.UserEntity;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "media_files")
public class MediaFileEntity extends BaseTimeEntity {

    @Id @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couple_id", nullable = false)
    private CoupleEntity couple;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id", nullable = false)
    private UserEntity uploader;

    @Column(nullable = false, length = 500)
    private String fileUrl;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FileType fileType; // IMAGE or VIDEO

    private Long fileSize;

    private String originalFilename;

    @Column(length = 500)
    private String s3Key;

    @Column(length = 500)
    private String thumbnailUrl;

    @Column(nullable = false)
    private boolean isFavorite = false;

    @Column(nullable = false)
    private LocalDate uploadDate;

    // createdAt은 BaseTimeEntity에 포함
}