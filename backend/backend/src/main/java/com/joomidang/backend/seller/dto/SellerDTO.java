package com.joomidang.backend.seller.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//@Data: Lombok이 getter, setter, toString을 자동으로 생성
@Data
public class SellerDTO {
    private long id;
    private long userId;                  //연결된 회원 id (users 테이블 참조)
    private String breweryName;           //양조장 이름 (DB: brewery_name)
    private String representativeName;    //대표자명 - 수출신고 필수 (DB: representative_name)
    private String businessNumber;        //사업자등록번호 (DB: business_number)
    private String licenseNumber;         //주류 제조면허 번호 (DB: license_number)
    private String address;               //양조장 주소 (DB: address)
    private String contactPhone;          //담당자 연락처 (DB: contact_phone)
    private String contactEmail;          //담당자 이메일 (DB: contact_email)
    private String descriptionKo;         //양조장 소개 한국어 (DB: description_ko)
    private String descriptionEn;         //양조장 소개 영어 (DB: description_en)
    private String logoUrl;               //양조장 로고 이미지 URL (DB: logo_url)
    private BigDecimal commissionRate;    //플랫폼 수수료율 % (DB: commission_rate)
    private String bankName;              //정산 은행명 (DB: bank_name)
    private String bankAccount;           //정산 계좌번호 (DB: bank_account)
    private String accountHolder;         //예금주 (DB: account_holder)
    private String status;                //심사 상태: PENDING(대기) | APPROVED(승인) | REJECTED(반려) | SUSPENDED(정지)
    private String rejectionReason;       //거절 사유 (DB: rejection_reason)
    private LocalDateTime approvedAt;     //승인 일시 (DB: approved_at)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
