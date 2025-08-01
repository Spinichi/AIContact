package com.aicontact.backend.babychat.controller;

import com.aicontact.backend.babychat.entity.BabySummaryLetter;
import com.aicontact.backend.babychat.repository.BabySummaryLetterRepository;
import com.aicontact.backend.babychat.service.GmsChatService;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/summary")
@RequiredArgsConstructor
public class MessageSummaryController {

    private final GmsChatService service;
    private final BabySummaryLetterRepository letterRepository;
    private final UserRepository userRepository;

    @GetMapping("/letter")
    public ResponseEntity<String> getSummaryLetter(@RequestParam Long userId) {
        String letter = service.summarizeToLetter(userId);
        return ResponseEntity.ok(letter);
    }

    @GetMapping("/letters")
    public ResponseEntity<List<String>> getLetters(@RequestParam Long userId) {
        UserEntity user = userRepository.findById(userId).orElseThrow();
        List<BabySummaryLetter> letters = letterRepository.findByUserOrderByCreatedAtDesc(user);

        List<String> contents = letters.stream()
                .map(BabySummaryLetter::getContent)
                .collect(Collectors.toList());

        return ResponseEntity.ok(contents);
    }
}

