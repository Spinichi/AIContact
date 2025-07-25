package com.aicontact.backend.global.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Getter;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
@AllArgsConstructor
@Getter
public class ApiResponse<T> {

    private final boolean success;

    private final T data;

    /** 성공 응답 생성 */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data);
    }
}