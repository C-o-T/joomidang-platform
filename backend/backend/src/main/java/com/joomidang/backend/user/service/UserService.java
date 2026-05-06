package com.joomidang.backend.user.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.joomidang.backend.user.dto.UserDTO;
import com.joomidang.backend.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;

    // 회원가입 - 비밀번호를 BCrypt 해시로 변환 후 저장
    public void join(UserDTO userDTO) {
        //평문 비밀번호를 BCrypt 해시로 변환 (예: "1234" → "$2a$12$...")
        String hashed = BCrypt.withDefaults().hashToString(12, userDTO.getPassword().toCharArray());
        userDTO.setPassword(hashed);
        userMapper.insertUser(userDTO);
    }

    // 이메일 사용 가능 여부 (true: 사용 가능, false: 이미 존재)
    public boolean isUsableEmail(String email) {
        String result = userMapper.checkEmail(email);
        return result == null;
    }

    // 로그인 - 이메일로 조회 후 BCrypt로 비밀번호 일치 여부 확인
    public UserDTO login(UserDTO userDTO) {
        //이메일로 회원 조회
        UserDTO found = userMapper.findByEmail(userDTO.getEmail());

        //이메일 없거나 비밀번호 불일치 시 null 반환
        if (found == null) return null;
        BCrypt.Result result = BCrypt.verifyer().verify(
                userDTO.getPassword().toCharArray(), found.getPassword());
        if (!result.verified) return null;

        //응답에서 비밀번호 해시 제거 (보안 - 클라이언트에 해시 노출 방지)
        found.setPassword(null);
        return found;
    }

}
