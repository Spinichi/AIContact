package com.aicontact.backend.comicStrips.controller;

import com.aicontact.backend.comicStrips.dto.request.CreateComicStripsRequest;
import com.aicontact.backend.comicStrips.dto.response.ComicStripsResponse;
import com.aicontact.backend.comicStrips.entity.ComicStripsEntity;
import com.aicontact.backend.comicStrips.service.ComicStripsService;
import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/comic")
@RequiredArgsConstructor
public class ComicStripsController {

    private final ComicStripsService comicStripsService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<ComicStripsResponse>> createComicStrips(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CreateComicStripsRequest req
    ) throws IOException {
        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();

        ComicStripsEntity created = comicStripsService.createComicStrips(
                coupleId,
                req.getName()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(new ComicStripsResponse(created)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ComicStripsResponse>> getMyComicStrips(
            @AuthenticationPrincipal CustomUserDetails userDetails){

        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();

        // 2) 서비스에서 단건 조회
        ComicStripsEntity entity = comicStripsService.getMyComicStrips(coupleId);

        // 3) DTO 변환 후 envelope 패턴으로 감싸기
        ComicStripsResponse dto = new ComicStripsResponse(entity);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteComicStrips(
            @PathVariable Long id
    ) {
        comicStripsService.deleteComicStrips(id);
        return ResponseEntity
                .ok(ApiResponse.success("안전하게 삭제되었습니다."));
    }
}
