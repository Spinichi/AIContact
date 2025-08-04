package com.aicontact.backend.babychat.dto;

import com.aicontact.backend.babychat.entity.BabyChatMessage;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponseDTO {
    private String reply;
    private String conversationSessionId;
    private LocalDateTime timestamp;

    public static ChatResponseDTO fromEntity(BabyChatMessage entity) {
        return ChatResponseDTO.builder()
                .reply(entity.getContent())
                .conversationSessionId(entity.getConversationSessionId())
                .timestamp(entity.getCreatedAt())
                .build();
    }

}
