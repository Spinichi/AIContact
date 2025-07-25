package com.aicontact.backend.dailySchedule.service;


import com.aicontact.backend.dailySchedule.entity.DailyScheduleEntity;
import com.aicontact.backend.dailySchedule.repository.DailyScheduleRepository;
import com.aicontact.backend.user.entity.CoupleEntity;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.CoupleRepository;
import com.aicontact.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyScheduleService {

    private final DailyScheduleRepository dailyScheduleRepository;
    private final CoupleRepository coupleRepository;
    private final UserRepository userRepository;

    // ✅ 일정 생성
    @Transactional
    public DailyScheduleEntity createSchedule(Long coupleId, Long creatorId, LocalDate date, String title, String memo) {
        CoupleEntity couple = coupleRepository.findById(coupleId)
                .orElseThrow(() -> new IllegalArgumentException("Couple not found"));

        UserEntity creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        DailyScheduleEntity schedule = DailyScheduleEntity.builder()
                .couple(couple)
                .creator(creator)
                .scheduleDate(date)
                .title(title)
                .memo(memo)
                .build();

        return dailyScheduleRepository.save(schedule);
    }

    // 일정 수정
    @Transactional
    public DailyScheduleEntity updateSchedule(Long scheduleId, String newTitle, String newMemo, LocalDate newDate) {
        DailyScheduleEntity schedule = dailyScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new IllegalArgumentException("Schedule not found"));

        schedule.setTitle(newTitle);
        schedule.setMemo(newMemo);
        schedule.setScheduleDate(newDate);

        return schedule; // JPA의 변경 감지로 자동 업데이트
    }

    // 일정 삭제
    @Transactional
    public void deleteSchedule(Long scheduleId) {
        dailyScheduleRepository.deleteById(scheduleId);
    }

    @Transactional(readOnly = true)
    public List<DailyScheduleEntity> getSchedulesByDate(Long coupleId, LocalDate date) {
        CoupleEntity couple = coupleRepository.findById(coupleId)
                .orElseThrow(() -> new IllegalArgumentException("커플 없음"));
        return dailyScheduleRepository.findByCoupleAndScheduleDate(couple, date);
    }

    @Transactional(readOnly = true)
    public List<DailyScheduleEntity> getSchedulesByMonth(Long coupleId, LocalDate start, LocalDate end) {
        CoupleEntity couple = coupleRepository.findById(coupleId)
                .orElseThrow(() -> new IllegalArgumentException("커플 없음"));
        return dailyScheduleRepository.findByCoupleAndScheduleDateBetweenOrderByScheduleDateAsc(couple, start, end);
    }
}

