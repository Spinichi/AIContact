// ChatResponseDTO.java
package com.aicontact.backend.babychat.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ChatResponseDTO {
    private String reply;
    private String conversationSessionId;
    private LocalDateTime timestamp;
}
