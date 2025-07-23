package com.aicontact.backend.user.controller;


import com.aicontact.backend.auth.jwt.JwtUtil;
import com.aicontact.backend.user.dto.JoinDto;
import com.aicontact.backend.user.dto.UpdateUserDto;
import com.aicontact.backend.user.dto.UserDto;
import com.aicontact.backend.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/sign-up")
    public ResponseEntity<String> joinProcess(@RequestBody JoinDto joinDto) {
        try {
            // 필수 입력값 누락 체크
            if (joinDto.getEmail() == null || joinDto.getPassword() == null || joinDto.getName() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("필수 입력값입니다.");
            }

            boolean result = userService.joinProcess(joinDto);

            if (!result) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(joinDto.getEmail() + " 은(는) 이미 등록된 이메일입니다.");
            }

            // 회원가입 성공 시 201 Created 반환
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("회원가입 성공 및 사용자 정보 반환");

        } catch (Exception e) {
            // 예기치 못한 서버 오류
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("서버 내부 오류: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyInfo(@RequestHeader("Authorization") String authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String token = authHeader.substring(7); // "Bearer " 제거
        String email = jwtUtil.getEmail(token); // JWT에서 이메일 추출
        UserDto userDto = userService.getUserByEmail(email);
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/me")
    public ResponseEntity<String> updateMyInfo(@RequestHeader("Authorization") String authHeader,
                                               @RequestBody UpdateUserDto dto) {
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("잘못된 토큰 형식");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.getEmail(token);

        userService.updateMyInfo(email, dto);
        return ResponseEntity.ok("회원 정보 수정 완료");
    }

    @DeleteMapping("/me")
    public ResponseEntity<String> deleteMyAccount(@RequestHeader("Authorization") String authHeader) {
        if (!authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("잘못된 토큰 형식");
        }

        String token = authHeader.substring(7);
        String email = jwtUtil.getEmail(token);

        userService.deleteMyAccount(email);
        return ResponseEntity.ok("회원 탈퇴 완료");
    }


}
