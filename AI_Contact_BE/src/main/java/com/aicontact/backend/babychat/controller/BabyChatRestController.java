package com.aicontact.backend.babychat.controller;

import com.aicontact.backend.auth.dto.CustomUserDetails;
import com.aicontact.backend.babychat.dto.ChatRequestDTO;
import com.aicontact.backend.babychat.dto.ChatResponseDTO;
import com.aicontact.backend.babychat.entity.AiMessageType;
import com.aicontact.backend.babychat.entity.BabyChatMessage;
import com.aicontact.backend.babychat.repository.BabyChatMessageRepository;
import com.aicontact.backend.babychat.service.GmsChatService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/baby")
public class BabyChatRestController {

    private final GmsChatService service;
    private final BabyChatMessageRepository repo;
    private final UserRepository userRepository;

    public BabyChatRestController(GmsChatService service,
                                  BabyChatMessageRepository repo,
                                  UserRepository userRepository) {
        this.service = service;
        this.repo = repo;
        this.userRepository = userRepository;
    }

    @PostMapping(
            path = "/chat",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<ChatResponseDTO>> chat(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody ChatRequestDTO req
    ) {

        UserEntity user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("유저 없음"));


        BabyChatMessage userMsg = BabyChatMessage.builder()
                .user(user)
                .aiChildrenId(req.getAiChildrenId())
                .aiMessageType(AiMessageType.USER)
                .content(req.getMessage())
                .conversationSessionId(req.getConversationSessionId())
                .createdAt(LocalDateTime.now())
                .build();
        repo.save(userMsg);


        List<BabyChatMessage> history = repo.findTop20ByUserIdAndConversationSessionIdOrderByCreatedAtAsc(
                req.getUserId(), req.getConversationSessionId()
        );


        String babyReply = service.chatWithBaby(history, req.getMessage());


        BabyChatMessage aiMsg = BabyChatMessage.builder()
                .user(user)
                .aiChildrenId(req.getAiChildrenId())
                .aiMessageType(AiMessageType.AI)
                .content(babyReply)
                .conversationSessionId(req.getConversationSessionId())
                .createdAt(LocalDateTime.now())
                .build();
        repo.save(aiMsg);


        ChatResponseDTO res = ChatResponseDTO.builder()
                .reply(babyReply)
                .conversationSessionId(req.getConversationSessionId())
                .timestamp(aiMsg.getCreatedAt())
                .build();


        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, res));
    }


    @GetMapping(
            path = "/chat",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ApiResponse<List<ChatResponseDTO>>> getChatHistoryByUser(
            @RequestParam Long userId
    ) {
        List<BabyChatMessage> messages = repo
                .findByUserIdOrderByCreatedAtAsc(userId);

        List<ChatResponseDTO> dtoList = messages.stream()
                .map(ChatResponseDTO::fromEntity)
                .toList();

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new ApiResponse<>(true, dtoList));
    }

}
