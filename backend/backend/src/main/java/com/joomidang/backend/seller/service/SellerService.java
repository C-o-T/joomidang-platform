package com.joomidang.backend.seller.service;

import com.joomidang.backend.seller.dto.SellerDTO;
import com.joomidang.backend.seller.mapper.SellerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerService {
    private final SellerMapper sellerMapper;

    // 판매자 등록 신청
    public void registerSeller(SellerDTO sellerDTO) {
        sellerMapper.insertSeller(sellerDTO);
    }

    // 사업자등록번호 사용 가능 여부 (true: 사용 가능, false: 이미 존재)
    public boolean isUsableBusinessNumber(String businessNumber) {
        String result = sellerMapper.checkBusinessNumber(businessNumber);
        return result == null;
    }

    // 판매자 단건 조회 (seller id로)
    public SellerDTO getSellerById(long id) {
        return sellerMapper.getSellerById(id);
    }

    // 판매자 조회 (user id로)
    public SellerDTO getSellerByUserId(long userId) {
        return sellerMapper.getSellerByUserId(userId);
    }

    // 전체 판매자 목록 조회 (어드민용)
    public List<SellerDTO> getSellerList() {
        return sellerMapper.getSellerList();
    }

    // 판매자 심사 상태 변경 (어드민)
    public void updateSellerStatus(long id, String status, String rejectionReason) {
        sellerMapper.updateSellerStatus(id, status, rejectionReason);
    }

}
