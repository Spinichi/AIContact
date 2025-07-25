package com.aicontact.backend.dailySchedule.dto;

import lombok.Getter;
import java.time.LocalDate;

@Getter
public class DailyScheduleUpdateDto {
    private String title;
    private String memo;
    private LocalDate scheduleDate;
}

