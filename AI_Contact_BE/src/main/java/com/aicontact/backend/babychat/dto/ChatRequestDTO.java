package com.aicontact.backend.babychat.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatRequestDTO {
    private Long userId;
    private Long aiChildrenId;
    private String conversationSessionId;
    private String message;
}
