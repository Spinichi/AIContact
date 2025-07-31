package com.aicontact.backend.comic.dto;

import com.aicontact.backend.comic.entity.ComicEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ComicDto {
    private Long id;
    private Long coupleId;
    private Long creatorId;
    private String comicImageUrl;
    private String title;
    private LocalDateTime createdAt;

    public static ComicDto fromEntity(ComicEntity entity) {
        return ComicDto.builder()
                .id(entity.getId())
                .coupleId(entity.getCouple().getId())
                .creatorId(entity.getCreator().getId())
                .comicImageUrl(entity.getComicImageUrl())
                .title(entity.getTitle())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}


