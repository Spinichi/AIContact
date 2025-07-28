package com.aicontact.backend.chat.controller;

import com.aicontact.backend.chat.entity.ChatMessage;
import com.aicontact.backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatRestController {
    private final ChatService service;

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String roomId) {
        return ResponseEntity.ok(service.getHistory(roomId));
    }
}
