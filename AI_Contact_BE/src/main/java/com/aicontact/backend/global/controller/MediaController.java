package com.aicontact.backend.global.controller;


import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.global.dto.MediaFileDto;
import com.aicontact.backend.global.dto.MediaSearchCondition;
import com.aicontact.backend.global.dto.MediaThumbnailDto;
import com.aicontact.backend.global.dto.response.*;
import com.aicontact.backend.global.service.MediaFileService;
import com.aicontact.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.jcodec.api.JCodecException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaFileService mediaFileService;
    private final UserService userService;

    /** 1) 이미지 업로드 → POST /api/v1/media/images */
    @PostMapping(path = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaFileDto>> uploadImage(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam("coupleId") Long coupleId
    ) throws IOException, JCodecException {

        String email = userDetails.getUserEntity().getEmail();
        Long uploaderId = userService.getUserByEmail(email).getId();

        System.out.println(coupleId);
        System.out.println(email);
        MediaFileDto dto = mediaFileService.uploadMedia(file, coupleId, uploaderId);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(dto.getId())
                .toUri();
        return ResponseEntity
                .created(location)
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, dto));
    }

    /** 2) 비디오 업로드 → POST /api/v1/media/videos */
    @PostMapping(path = "/videos", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<MediaFileDto>> uploadVideo(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam("coupleId") Long coupleId
    ) throws IOException, JCodecException {
        // 구현은 이미지 업로드와 동일하게 서비스에 위임
        return uploadImage(userDetails, file, coupleId);
    }

    /** 3) media 삭제 → DELETE /api/v1/media/{id} (200 OK) */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<DeleteMediaResponse>> deleteMedia(@PathVariable Long id) throws IOException {
        mediaFileService.deleteMedia(id);

        DeleteMediaResponse payload = new DeleteMediaResponse(
                "미디어 파일이 성공적으로 삭제되었습니다.",
                id
        );
        ApiResponse<DeleteMediaResponse> response = new ApiResponse<>(true, payload);

        // 삭제 성공 시 본문을 내려주려면 200 OK 로 바꿔야 합니다.
        return ResponseEntity.ok(response);
    }

    /** 4) 찜한 미디어 조회 → GET /api/v1/media/favorites?coupleId=xxx&page=0&size=20 */
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<MediaListResponse>> listFavorites(
            @RequestParam("coupleId") Long coupleId,
            @RequestParam(value = "page",  defaultValue = "0")  int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            @ModelAttribute MediaSearchCondition cond
    ) {

        Pageable pageable = PageRequest.of(page, limit, Sort.by("uploadDate").descending());
        Page<MediaFileDto> pageResult = mediaFileService.listFavorites(
                pageable,
                cond.getFileType(),
                cond.getDateFrom(),
                cond.getDateTo(),
                coupleId,
                true
        );

        MediaListResponse body = new MediaListResponse(pageResult);
        ApiResponse<MediaListResponse> response = ApiResponse.success(body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("")
    public ResponseEntity<ApiResponse<MediaListResponse>> getMedia(
            @RequestParam("coupleId") Long coupleId,
            @RequestParam(value = "page",  defaultValue = "0")  int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            @ModelAttribute MediaSearchCondition cond
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("uploadDate").descending());
        Page<MediaFileDto> pageResult = mediaFileService.findMedia(
                pageable,
                cond.getFileType(),
                cond.getDateFrom(),
                cond.getDateTo(),
                coupleId
        );

        MediaListResponse body = new MediaListResponse(pageResult);
        ApiResponse<MediaListResponse> response = ApiResponse.success(body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/thumbnails")
    public ResponseEntity<ApiResponse<MediaThumbnailListResponse>> getThumbnails(
            @RequestParam("coupleId") Long coupleId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit,
            @ModelAttribute MediaSearchCondition cond
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by("uploadDate").descending());
        Page<MediaThumbnailDto> pageResult = mediaFileService.findThumbnails(
                pageable,
                cond.getFileType(),
                cond.getDateFrom(),
                cond.getDateTo(),
                coupleId
        );

        MediaThumbnailListResponse body = new MediaThumbnailListResponse(pageResult);
        ApiResponse<MediaThumbnailListResponse> response = ApiResponse.success(body);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MediaFileDto>> getMedia(
            @RequestParam Long coupleId,
            @PathVariable("id") Long id
    ) {
        MediaFileDto dto = mediaFileService.getMedia(coupleId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, dto));
    }

    @PostMapping("/{id}/favorite")
    public ResponseEntity<ApiResponse<FavoriteResponse>> toggleFavorite(
            @RequestParam Long coupleId,
            @PathVariable("id") Long id
    ) throws IOException {
        FavoriteResponse resp = mediaFileService.toggleFavorite(coupleId, id);
        return ResponseEntity.ok(new ApiResponse<>(true, resp));
    }
}