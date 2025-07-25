package com.aicontact.backend.dailySchedule.dto;

import lombok.Getter;
import java.time.LocalDate;

@Getter
public class DailyScheduleRequestDto {
    private Long coupleId;
    private Long creatorId;
    private LocalDate scheduleDate;
    private String title;
    private String memo;
}


