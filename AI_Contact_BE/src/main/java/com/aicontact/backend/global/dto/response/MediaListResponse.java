package com.aicontact.backend.global.dto.response;

import com.aicontact.backend.global.dto.MediaFileDto;
import com.aicontact.backend.global.dto.PaginationInfo;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Getter
public class MediaListResponse {
    @JsonProperty("media_files")
    private final List<MediaFileDto> mediaFiles;

    private final PaginationInfo pagination;

    public MediaListResponse(Page<MediaFileDto> page) {
        this.mediaFiles = page.getContent();
        this.pagination = new PaginationInfo(page);
    }

}
