package com.aicontact.backend.comic.controller;


import com.aicontact.backend.comic.service.DalleService;
import com.aicontact.backend.global.dto.MediaFileDto;
import lombok.RequiredArgsConstructor;
import org.jcodec.api.JCodecException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/comic")
public class ComicUploadController {

    private final DalleService dalleService;

    /**
     * 프론트에서 전달한 DALL·E 이미지 URL을 받아서
     * 서버가 직접 다운로드하여 S3에 업로드 후 DB 저장
     */
    @PostMapping("/upload")
    public ResponseEntity<MediaFileDto> uploadComicImage(
            @RequestParam String imageUrl,
            @RequestParam Long coupleId,
            @RequestParam Long uploaderId
    ) {
        try {
            MediaFileDto dto = dalleService.uploadDalleImageToS3(imageUrl, coupleId, uploaderId);
            return ResponseEntity.ok(dto);
        } catch (IOException | JCodecException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
