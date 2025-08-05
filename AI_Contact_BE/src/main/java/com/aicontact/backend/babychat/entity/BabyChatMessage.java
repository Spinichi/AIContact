package com.aicontact.backend.babychat.entity;

import com.aicontact.backend.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "baby_chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BabyChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    private Long aiChildrenId;

    @Enumerated(EnumType.STRING)
    private AiMessageType aiMessageType;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String conversationSessionId;

    private LocalDateTime createdAt;
}
