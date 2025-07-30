package com.aicontact.backend.chat.service;

import com.aicontact.backend.chat.dto.ChatMessageDto;
import com.aicontact.backend.chat.entity.ChatMessage;
import com.aicontact.backend.chat.entity.ChatRoom;
import com.aicontact.backend.chat.repository.ChatMessageRepository;
import com.aicontact.backend.chat.repository.ChatRoomRepository;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void saveAndSend(ChatMessageDto dto) {
        ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
        UserEntity sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid sender ID"));

        ChatMessage.MessageType type;
        try {
            type = ChatMessage.MessageType.valueOf(
                    dto.getMessageType() != null ? dto.getMessageType().toUpperCase() : "TEXT"
            );
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid messageType: " + dto.getMessageType());
        }

        ChatMessage message = new ChatMessage();
        message.setRoom(room);
        message.setSender(sender);
        message.setContent(dto.getContent());
        message.setMessageType(type);
        message.setSentAt(LocalDateTime.now());

        chatMessageRepository.save(message);

        ChatMessageDto response = new ChatMessageDto(
                dto.getRoomId(),
                dto.getSenderId(),
                dto.getContent(),
                type.name(),
                message.getSentAt().toString()
        );

        messagingTemplate.convertAndSend("/sub/chat/" + dto.getRoomId(), response);
    }

    public List<ChatMessage> getHistory(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }
}
