package com.aicontact.backend.babychat.repository;

import com.aicontact.backend.babychat.entity.BabySummaryLetter;
import com.aicontact.backend.user.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BabySummaryLetterRepository extends JpaRepository<BabySummaryLetter, Long> {
    List<BabySummaryLetter> findByUserOrderByCreatedAtDesc(UserEntity user);
}
