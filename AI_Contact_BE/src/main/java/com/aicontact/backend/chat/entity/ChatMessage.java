package com.aicontact.backend.chat.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_message")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomId;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private LocalDateTime sentAt;

    /** 1) 컴파일러가 new ChatMessage() 를 허용할 수 있도록 public no-args 생성자 추가 **/
    public ChatMessage() {}

    /** 2) 필요하다면 all-args 생성자도 유지 **/
    public ChatMessage(Long id,
                       String roomId,
                       Long senderId,
                       String content,
                       LocalDateTime sentAt) {
        this.id       = id;
        this.roomId   = roomId;
        this.senderId = senderId;
        this.content  = content;
        this.sentAt   = sentAt;
    }

    /** 3) 기존 getter/setter 를 모두 남겨두되, 누락된 setter 가 없는지 꼭 확인! **/
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }    // ← 이 라인이 반드시 있어야 합니다!

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
