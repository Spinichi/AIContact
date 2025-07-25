package com.aicontact.backend.user.service;


import com.aicontact.backend.global.entity.enumeration.CoupleStatus;
import com.aicontact.backend.user.dto.JoinDto;
import com.aicontact.backend.user.dto.UpdateUserDto;
import com.aicontact.backend.user.dto.UserDto;
import com.aicontact.backend.user.entity.UserEntity;
import com.aicontact.backend.user.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public boolean joinProcess(JoinDto joinDto) {
        String email = joinDto.getEmail();
        String password = joinDto.getPassword();
        String name = joinDto.getName();


        if (userRepository.existsByEmail(email)) {
            return false;
        }

        UserEntity user = new UserEntity();
        user.setEmail(email);
        user.setPassword(bCryptPasswordEncoder.encode(password));
        user.setName(name);
        user.setCoupleStatus(joinDto.getCoupleStatus() != null ? joinDto.getCoupleStatus() : CoupleStatus.SINGLE);
        user.setBirthDate(joinDto.getBirthDate());
        user.setProfileImageUrl(joinDto.getProfileImageUrl());

        // 3) 랜덤 코드 생성 & 중복 방지
        String code;
        do {
            code = SecureRandomCodeGenerator.generateCode();
        } while (userRepository.existsByVerificationCode(code));
        user.setVerificationCode(code);

        userRepository.save(user);
        return true;
    }

    public UserDto getUserByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return new UserDto(user);
    }

    public void updateMyInfo(String email, UpdateUserDto dto) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getProfileImageUrl() != null) user.setProfileImageUrl(dto.getProfileImageUrl());
        if (dto.getBirthDate() != null) user.setBirthDate(dto.getBirthDate());
        if (dto.getCoupleStatus() != null) user.setCoupleStatus(dto.getCoupleStatus());

        userRepository.save(user);
    }

    public void deleteMyAccount(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        userRepository.delete(user);
    }


    public static class SecureRandomCodeGenerator {
        private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        private static final SecureRandom random = new SecureRandom();

        public static String generateCode() {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                int index = random.nextInt(CHARACTERS.length());
                sb.append(CHARACTERS.charAt(index));
            }
            return sb.toString();
        }
    }

}
