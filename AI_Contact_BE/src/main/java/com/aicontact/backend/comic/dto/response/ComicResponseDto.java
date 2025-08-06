package com.aicontact.backend.comic.dto.response;

import com.aicontact.backend.comic.entity.ComicEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ComicResponseDto {
    private Long id;
    private Long coupleId;
    private Long creatorId;
    private String comicImageUrl;
    private String title;
    private LocalDateTime createdAt;

    public static ComicResponseDto fromEntity(ComicEntity entity) {
        return ComicResponseDto.builder()
                .id(entity.getId())
                .coupleId(entity.getCouple().getId())
                .creatorId(entity.getCreator().getId())
                .comicImageUrl(entity.getComicImageUrl())
                .title(entity.getTitle())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
