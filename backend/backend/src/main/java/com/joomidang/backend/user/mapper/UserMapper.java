package com.joomidang.backend.user.mapper;

import com.joomidang.backend.user.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {

    // 회원가입
    void insertUser(UserDTO userDTO);

    // 이메일 중복 확인 (있으면 이메일 반환, 없으면 null)
    String checkEmail(String email);

    // 이메일로 회원 조회 (BCrypt 비밀번호 검증용 - 비밀번호 해시 포함)
    UserDTO findByEmail(String email);

    // 회원 단건 조회
    UserDTO getUserById(long id);

}
