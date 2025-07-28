package com.aicontact.backend.couple.controller;

import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.couple.dto.*;
import com.aicontact.backend.couple.service.CoupleService;
import com.aicontact.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/couples")
@RequiredArgsConstructor
public class CoupleController {
    private final UserService userService;
    private final CoupleService coupleService;

    @PostMapping("/join")
    public ResponseEntity<CoupleResponse> join(@RequestBody VerificationCodeResponse req) {
        CoupleResponse resp = coupleService.joinByCode(req.getVerificationCode());
        if (!resp.isMatched()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(resp);
        }
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/matching")
    public ResponseEntity<CoupleInfoResponse> matchCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CoupleMatchingRequest req) {

        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();
        CoupleInfoResponse resp = coupleService
                .createCouple(userId, req);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(resp);
    }

    @GetMapping("")
    public ResponseEntity<CoupleInfoResponse> getCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();
        CoupleInfoResponse resp = coupleService.getCoupleInfo(userId);
        return ResponseEntity.ok(resp);
    }

    @DeleteMapping("")
    public ResponseEntity<Void> deleteCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String email = userDetails.getUserEntity().getEmail();
        Long userId  = userService.getUserByEmail(email).getId();
        coupleService.deleteCouple(userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("")
    public ResponseEntity<CoupleInfoResponse> patchCouple(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody CoupleUpdateRequest req) {

        Long userId = userService
                .getUserByEmail(userDetails.getUsername())
                .getId();

        CoupleInfoResponse resp = coupleService
                .updateCoupleInfo(userId, req);

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/myCode")
    public ResponseEntity<VerificationCodeResponse> getMyCode(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String email  = userDetails.getUserEntity().getEmail();
        Long   userId = userService.getUserByEmail(email).getId();

        VerificationCodeResponse resp = coupleService.getMyCode(userId);
        return ResponseEntity.ok(resp);
    }


}



