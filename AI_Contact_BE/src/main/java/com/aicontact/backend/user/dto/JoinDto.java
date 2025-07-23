package com.aicontact.backend.user.dto;

import com.aicontact.backend.user.entity.UserEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class JoinDto {
    private String email;
    private String password;
    private String name;
    private String profileImageUrl;
    private LocalDate birthDate;
    private UserEntity.CoupleStatus coupleStatus;
}


