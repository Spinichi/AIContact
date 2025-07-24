package com.aicontact.backend.user.controller;


import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.user.dto.NicknameRequestDto;
import com.aicontact.backend.user.dto.NicknameResponseDto;
import com.aicontact.backend.user.entity.NicknameEntity;
import com.aicontact.backend.user.service.NicknameService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

//2

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/nicknames")
public class NicknameController {

    private final NicknameService nicknameService;

    @PostMapping
    public ResponseEntity<NicknameEntity> create(
            @RequestBody NicknameRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(nicknameService.create(dto.getWord(), dto.getDescription(), userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<NicknameResponseDto>> getAll(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            HttpServletResponse response
    ) {
        List<NicknameEntity> entities = nicknameService.getByCouple(userDetails.getUsername());

        // 1. 쿠키에 nickname 목록 저장
        String nicknameList = entities.stream()
                .map(NicknameEntity::getWord)
                .collect(Collectors.joining(","));  // 예: "공주,햄찌,자기야"

        Cookie cookie = new Cookie("nicknames", URLEncoder.encode(nicknameList, StandardCharsets.UTF_8));
        cookie.setPath("/");                // 모든 경로에서 접근 가능
        cookie.setHttpOnly(false);         // JS에서 접근 가능하게
        cookie.setMaxAge(60 * 60 * 24);    // 1일 유효
        response.addCookie(cookie);

        // 2. 원래대로 response body도 내려줌 (프론트에서 필요시)
        List<NicknameResponseDto> result = nicknameService.getByCouple(userDetails.getUsername())
                .stream()
                .map(NicknameResponseDto::fromEntity)
                .toList();

        System.out.println(nicknameList);

        return ResponseEntity.ok(result);
    }


    @PutMapping("/{id}")
    public ResponseEntity<NicknameResponseDto> update(
            @PathVariable Long id,
            @RequestBody NicknameRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        NicknameEntity entity = nicknameService.update(id, dto.getWord(), dto.getDescription(), userDetails.getUsername());
        return ResponseEntity.ok(NicknameResponseDto.fromEntity(entity));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        nicknameService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

}
