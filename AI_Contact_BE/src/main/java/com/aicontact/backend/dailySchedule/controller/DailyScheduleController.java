package com.aicontact.backend.dailySchedule.controller;

import com.aicontact.backend.dailySchedule.dto.DailyScheduleRequestDto;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleResponseDto;
import com.aicontact.backend.dailySchedule.dto.DailyScheduleUpdateDto;
import com.aicontact.backend.dailySchedule.entity.DailyScheduleEntity;
import com.aicontact.backend.dailySchedule.service.DailyScheduleService;
import com.aicontact.backend.global.dto.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/schedules")
public class DailyScheduleController {

    private final DailyScheduleService dailyScheduleService;

    @PostMapping
    public ResponseEntity<ApiResponse<DailyScheduleResponseDto>> createSchedule(@RequestBody @Valid DailyScheduleRequestDto dto) {
        DailyScheduleEntity saved = dailyScheduleService.createSchedule(
                dto.getCoupleId(),
                dto.getCreatorId(),
                dto.getScheduleDate(),
                dto.getTitle(),
                dto.getMemo()
        );
        return ResponseEntity.ok(ApiResponse.success(DailyScheduleResponseDto.fromEntity(saved)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DailyScheduleResponseDto>> updateSchedule(
            @PathVariable Long id,
            @RequestBody DailyScheduleUpdateDto dto) {
        DailyScheduleEntity updated = dailyScheduleService.updateSchedule(id, dto.getTitle(), dto.getMemo(), dto.getScheduleDate());
        return ResponseEntity.ok(ApiResponse.success(DailyScheduleResponseDto.fromEntity(updated)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteSchedule(@PathVariable Long id) {
        dailyScheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("일정이 성공적으로 삭제되었습니다."));
    }

    @GetMapping("/day")
    public ResponseEntity<ApiResponse<List<DailyScheduleResponseDto>>> getDailySchedules(
            @RequestParam Long coupleId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<DailyScheduleResponseDto> result = dailyScheduleService.getSchedulesByDate(coupleId, date).stream()
                .map(DailyScheduleResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/month")
    public ResponseEntity<ApiResponse<List<DailyScheduleResponseDto>>> getMonthlySchedules(
            @RequestParam Long coupleId,
            @RequestParam int year,
            @RequestParam int month) {

        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        List<DailyScheduleResponseDto> result = dailyScheduleService.getSchedulesByMonth(coupleId, start, end).stream()
                .map(DailyScheduleResponseDto::fromEntity)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(result));
    }
}
