package com.aicontact.backend.comic.controller;


import com.aicontact.backend.comic.dto.ComicDto;
import com.aicontact.backend.comic.service.DalleService;
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

    @PostMapping("/upload")
    public ResponseEntity<ComicDto> uploadComicImage(
            @RequestParam String imageUrl,
            @RequestParam Long coupleId,
            @RequestParam Long uploaderId
    ) {
        try {
            ComicDto dto = dalleService.uploadDalleImageToS3(imageUrl, coupleId, uploaderId);
            return ResponseEntity.ok(dto);
        } catch (IOException | JCodecException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
