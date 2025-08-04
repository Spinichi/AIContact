package com.aicontact.backend.aiChild.controller;

import com.aicontact.backend.aiChild.dto.request.CreateAiChildRequest;
import com.aicontact.backend.aiChild.dto.request.UpdateAiChildRequest;
import com.aicontact.backend.aiChild.dto.response.AiChildResponse;
import com.aicontact.backend.aiChild.entity.AiChildEntity;
import com.aicontact.backend.aiChild.service.AiChildService;
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
@RequestMapping("/children")
@RequiredArgsConstructor
public class AiChildController {

    private final AiChildService aiChildService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ApiResponse<AiChildResponse>> createChild(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CreateAiChildRequest req
    ) throws IOException {
        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();

        AiChildEntity created = aiChildService.createChild(
                coupleId,
                req.getName()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(new AiChildResponse(created)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AiChildResponse>> getMyChildren(
            @AuthenticationPrincipal CustomUserDetails userDetails){

        String myEmail = userDetails.getUserEntity().getEmail();
        Long coupleId = userService.getUserByEmail(myEmail).getCoupleId();

        // 2) 서비스에서 단건 조회
        AiChildEntity entity = aiChildService.getMyChild(coupleId);

        // 3) DTO 변환 후 envelope 패턴으로 감싸기
        AiChildResponse dto = new AiChildResponse(entity);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AiChildResponse>> updateChild(
            @PathVariable Long id,
            @RequestBody UpdateAiChildRequest req
    ) {
        AiChildEntity updated = aiChildService.updateChild(
                id,
                req.getName(),
                req.getImageUrl(),
                req.getGrowthLevel(),
                req.getExperiencePoints()
        );
        return ResponseEntity
                .ok(ApiResponse.success(new AiChildResponse(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteChild(
            @PathVariable Long id
    ) {
        aiChildService.deleteChild(id);
        return ResponseEntity
                .ok(ApiResponse.success("안전하게 삭제되었습니다."));
    }
}
