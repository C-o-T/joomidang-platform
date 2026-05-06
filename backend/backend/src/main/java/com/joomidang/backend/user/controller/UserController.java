package com.joomidang.backend.user.controller;

import com.joomidang.backend.user.dto.UserDTO;
import com.joomidang.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // 회원가입 api
    @PostMapping("")
    public ResponseEntity<?> join(@RequestBody UserDTO userDTO) {
        try {
            userService.join(userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("회원가입 중 오류가 발생했습니다.");
        }
    }

    // 이메일 중복 확인 api
    // GET /users/check-email?email=test@gmail.com
    // query parameter 방식 사용: @ 문자가 포함된 이메일을 URL 경로로 받으면
    // Tomcat 10+이 @ 문자를 차단하므로 path variable 대신 query param으로 변경
    @GetMapping("/check-email")
    public boolean checkEmail(@RequestParam("email") String email) {
        // 사용 가능: true, 이미 존재: false
        return userService.isUsableEmail(email);
    }

    // 로그인 api - 성공 시 사용자 정보 반환, 실패 시 401 반환
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO userDTO) {
        UserDTO result = userService.login(userDTO);
        //로그인 실패 (이메일 없거나 비밀번호 불일치)
        if (result == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        return ResponseEntity.ok(result);
    }

}
