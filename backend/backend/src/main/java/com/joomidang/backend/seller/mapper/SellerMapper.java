package com.joomidang.backend.seller.mapper;

import com.joomidang.backend.seller.dto.SellerDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SellerMapper {

    // 판매자 등록 신청
    void insertSeller(SellerDTO sellerDTO);

    // 사업자등록번호 중복 확인 (있으면 번호 반환, 없으면 null)
    String checkBusinessNumber(String businessNumber);

    // 판매자 단건 조회 (seller id로)
    SellerDTO getSellerById(long id);

    // 판매자 조회 (user id로)
    SellerDTO getSellerByUserId(long userId);

    // 전체 판매자 목록 조회 (어드민용)
    List<SellerDTO> getSellerList();

    // 판매자 심사 상태 변경 (어드민: APPROVED / REJECTED / SUSPENDED)
    void updateSellerStatus(@Param("id") long id,
                            @Param("status") String status,
                            @Param("rejectionReason") String rejectionReason);

}
