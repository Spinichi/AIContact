package com.aicontact.backend.chat.controller;

import com.aicontact.backend.chat.entity.ChatMessage;
import com.aicontact.backend.chat.service.ChatService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatRestController {
    private final ChatService chatService;

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessage>>> getMessages(
            @PathVariable Long roomId
    ) {
        List<ChatMessage> messages = chatService.getHistory(roomId);
        // ApiResponse.success(...) 가 있으면 이렇게 간단히
        ApiResponse<List<ChatMessage>> apiResponse = ApiResponse.success(messages);
        return ResponseEntity.ok(apiResponse);
    }
}