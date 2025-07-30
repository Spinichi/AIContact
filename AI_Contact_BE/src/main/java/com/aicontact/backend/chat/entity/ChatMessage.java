package com.aicontact.backend.chat.entity;

import com.aicontact.backend.user.entity.UserEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom room;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private UserEntity sender;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", columnDefinition = "ENUM('TEXT', 'IMAGE') DEFAULT 'TEXT'")
    private MessageType messageType = MessageType.TEXT;

    @Column(name = "sent_at")
    private LocalDateTime sentAt = LocalDateTime.now();

    public enum MessageType {
        TEXT, IMAGE
    }
}
