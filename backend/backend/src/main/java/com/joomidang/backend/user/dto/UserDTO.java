package com.joomidang.backend.user.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

//@Data: Lombok이 getter, setter, toString을 자동으로 생성
@Data
public class UserDTO {
    private long id;
    private String email;
    private String password;
    private String name;
    private String role;              //회원 역할: CONSUMER(소비자) | SELLER(판매자) | ADMIN(관리자)
    private String country;           //국가 코드 (US, JP, KR...)
    private String phone;
    private LocalDate birthDate;      //생년월일 - 성인인증용
    private int ageVerified;          //성인인증 여부: 0(미인증) / 1(인증)
    private String preferredLanguage; //선호 언어: en, ko, ja, zh
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
