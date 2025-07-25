package com.aicontact.backend.dailySchedule.controller;

import com.aicontact.backend.dailySchedule.dto.DailyScheduleRequestDto;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleResponseDto;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleSummaryDto;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleUpdateDto;
import com.aicontact.backend.dailySchedule.entity.DailyScheduleEntity;
import com.aicontact.backend.dailySchedule.service.DailyScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class DailyScheduleController {

    private final DailyScheduleService dailyScheduleService;

    @PostMapping
    public DailyScheduleResponseDto createSchedule(@RequestBody @Valid DailyScheduleRequestDto dto) {
        DailyScheduleEntity saved = dailyScheduleService.createSchedule(
                dto.getCoupleId(),
                dto.getCreatorId(),
                dto.getScheduleDate(),
                dto.getTitle(),
                dto.getMemo()
        );
        return DailyScheduleResponseDto.fromEntity(saved);
    }


    //일정 수정
    @PutMapping("/{id}")
    public DailyScheduleResponseDto updateSchedule(@PathVariable Long id, @RequestBody DailyScheduleUpdateDto dto) {
        DailyScheduleEntity updated = dailyScheduleService.updateSchedule(id, dto.getTitle(), dto.getMemo(), dto.getScheduleDate());
        return DailyScheduleResponseDto.fromEntity(updated);
    }


    // 일정 삭제
    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable Long id) {
        dailyScheduleService.deleteSchedule(id);
    }

    // 일간 조회
    @GetMapping("/day")
    public List<DailyScheduleResponseDto> getDailySchedules(
            @RequestParam Long coupleId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return dailyScheduleService.getSchedulesByDate(coupleId, date).stream()
                .map(DailyScheduleResponseDto::fromEntity)
                .toList();
    }

    // 월간 조회
    @GetMapping("/month")
    public List<DailyScheduleSummaryDto> getMonthlySchedules(
            @RequestParam Long coupleId,
            @RequestParam int year,
            @RequestParam int month) {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return dailyScheduleService.getSchedulesByMonth(coupleId, start, end).stream()
                .map(DailyScheduleSummaryDto::fromEntity)
                .toList();
    }
}