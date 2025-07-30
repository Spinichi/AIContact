package com.aicontact.backend.chat.controller;
import com.aicontact.backend.chat.dto.ChatMessageDto;
import com.aicontact.backend.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @MessageMapping("/chat/sendMessage")
    public void sendMessage(ChatMessageDto dto) {
        System.out.println("💬 roomId: " + dto.getRoomId());
        System.out.println("💬 senderId: " + dto.getSenderId());
        chatService.saveAndSend(dto);
    }
}