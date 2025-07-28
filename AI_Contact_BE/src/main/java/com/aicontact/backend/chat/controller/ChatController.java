package com.aicontact.backend.chat.controller;

import com.aicontact.backend.chat.dto.ChatMessageDto;
import com.aicontact.backend.chat.entity.ChatMessage;
import com.aicontact.backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate template;
    private final ChatService service;

    @MessageMapping("/chat/sendMessage")
    public void onMessage(ChatMessageDto dto) {
        ChatMessage saved = service.saveMessage(dto.toEntity());
        template.convertAndSend("/sub/chat/" + dto.getRoomId(), saved);
    }
}
