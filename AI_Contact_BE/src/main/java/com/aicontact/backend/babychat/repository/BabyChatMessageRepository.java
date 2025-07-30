package com.aicontact.backend.babychat.repository;

import com.aicontact.backend.babychat.entity.BabyChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BabyChatMessageRepository extends JpaRepository<BabyChatMessage, Long> {

    List<BabyChatMessage> findTop20ByUserIdAndConversationSessionIdOrderByCreatedAtAsc(
            Long userId, String conversationSessionId
    );
}
