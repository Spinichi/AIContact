package com.aicontact.backend.chat.service;

import com.aicontact.backend.chat.entity.ChatMessage;
import com.aicontact.backend.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatMessageRepository repo;

    public ChatMessage saveMessage(ChatMessage msg) {
        return repo.save(msg);
    }

    public List<ChatMessage> getHistory(String roomId) {
        return repo.findByRoomIdOrderBySentAtAsc(roomId);
    }
}
