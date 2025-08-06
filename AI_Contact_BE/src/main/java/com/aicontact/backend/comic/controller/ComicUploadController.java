package com.aicontact.backend.comic.controller;


import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.aiChild.service.AiChildService;
import com.aicontact.backend.comic.dto.response.ComicResponseDto;
import com.aicontact.backend.comic.service.DalleService;
import com.aicontact.backend.global.dto.response.ApiResponse;
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
    private final AiChildService aiChildService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<ComicResponseDto>> uploadComicImage(
            @RequestParam String imageUrl,
            @RequestParam Long coupleId,
            @RequestParam Long uploaderId
    ) {
        try {
            ComicResponseDto dto = dalleService.uploadDalleImageToS3(imageUrl, coupleId, uploaderId);
            AiChildEntity myChild = aiChildService.updateChildPoints(coupleId,30);
            return ResponseEntity.ok(ApiResponse.success(dto));

        } catch (IOException | JCodecException e) {
            e.printStackTrace();
            // 명시적으로 제네릭 타입을 지정해서 컴파일 오류 방지
            ApiResponse<ComicResponseDto> errorResponse = new ApiResponse<ComicResponseDto>(false, null);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse);
        }
    }
}