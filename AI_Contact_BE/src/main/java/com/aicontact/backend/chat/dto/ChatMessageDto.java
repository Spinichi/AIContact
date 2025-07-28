package com.aicontact.backend.chat.dto;

import com.aicontact.backend.chat.entity.ChatMessage;
import java.time.LocalDateTime;

public class ChatMessageDto {
    // 1) 필요한 모든 필드 정의
    private String roomId;
    private Long   senderId;
    private String content;

    // 2) JSON 디직화나 스프링이 바인딩할 때 쓰이는 no-args 생성자
    public ChatMessageDto() { }

    // 3) 실제 사용할 생성자
    public ChatMessageDto(String roomId, Long senderId, String content) {
        this.roomId   = roomId;
        this.senderId = senderId;
        this.content  = content;
    }

    // 4) getter / setter
    public String getRoomId() {
        return roomId;
    }
    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public Long getSenderId() {
        return senderId;
    }
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    // 5) 엔티티 변환 메서드
    public ChatMessage toEntity() {
        ChatMessage msg = new ChatMessage();   // 이제 public no-args 생성자가 있어야 함
        msg.setRoomId(this.roomId);
        msg.setSenderId(this.senderId);
        msg.setContent(this.content);
        msg.setSentAt(LocalDateTime.now());
        return msg;
    }
}
