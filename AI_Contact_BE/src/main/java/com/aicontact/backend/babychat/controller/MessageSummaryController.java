package com.aicontact.backend.babychat.controller;

import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.babychat.entity.BabyLetter;
import com.aicontact.backend.babychat.repository.BabyLetterRepository;
import com.aicontact.backend.babychat.service.GmsChatService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import com.aicontact.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/summary")
@RequiredArgsConstructor
public class MessageSummaryController {

    private final GmsChatService service;
    private final BabyLetterRepository letterRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping(
            path = "/letter",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<String>> getSummaryLetter(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        String email = userDetails.getUserEntity().getEmail();
        Long userId = userService.getUserByEmail(email).getId();

        String letter = service.summarizeToLetter(userId);
        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, letter));
    }


    @GetMapping(
            path = "/letters",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<String>>> getLetters(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String email = userDetails.getUserEntity().getEmail();

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("유저 없음"));

        List<BabyLetter> letters = letterRepository
                .findBySenderUserOrderByCreatedAtDesc(user);

        List<String> contents = letters.stream()
                .map(BabyLetter::getLetterContent)
                .collect(Collectors.toList());

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, contents));
    }

}

