package com.aicontact.backend.babychat.controller;

import com.aicontact.backend.babychat.dto.ChatRequestDTO;
import com.aicontact.backend.babychat.dto.ChatResponseDTO;
import com.aicontact.backend.babychat.entity.AiMessageType;
import com.aicontact.backend.babychat.entity.BabyChatMessage;
import com.aicontact.backend.babychat.repository.BabyChatMessageRepository;
import com.aicontact.backend.babychat.service.GmsChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/baby")
public class BabyChatRestController {

    private final GmsChatService service;
    private final BabyChatMessageRepository repo;

    public BabyChatRestController(GmsChatService service,
                                  BabyChatMessageRepository repo) {
        this.service = service;
        this.repo    = repo;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponseDTO> chat(@RequestBody ChatRequestDTO req) {
        // 1) USER 메시지 저장
        BabyChatMessage userMsg = BabyChatMessage.builder()
                .userId(req.getUserId())
                .aiChildrenId(req.getAiChildrenId())
                .aiMessageType(AiMessageType.USER)
                .content(req.getMessage())
                .conversationSessionId(req.getConversationSessionId())
                .createdAt(LocalDateTime.now())
                .build();
        repo.save(userMsg);


        List<BabyChatMessage> history =
                repo.findTop20ByUserIdAndConversationSessionIdOrderByCreatedAtAsc(
                        req.getUserId(), req.getConversationSessionId()
                );


        String babyReply = service.chatWithBaby(history, req.getMessage());


        BabyChatMessage aiMsg = BabyChatMessage.builder()
                .userId(req.getUserId())
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
        return ResponseEntity.ok(res);
    }




        @GetMapping("/chat")
        public ResponseEntity<List<ChatResponseDTO>> getChatHistoryByUser(
                @RequestParam Long userId
        ) {
            List<BabyChatMessage> messages = repo
                    .findByUserIdOrderByCreatedAtAsc(userId);

            List<ChatResponseDTO> response = messages.stream()
                    .map(ChatResponseDTO::fromEntity)
                    .toList();

            return ResponseEntity.ok(response);
        }
    }


