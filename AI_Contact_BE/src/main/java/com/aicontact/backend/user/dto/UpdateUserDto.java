package com.aicontact.backend.user.dto;

import com.aicontact.backend.user.entity.UserEntity.CoupleStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateUserDto {

    private String name;  // 닉네임
    private String profileImageUrl;
    private LocalDate birthDate;
    private CoupleStatus coupleStatus;

}

