package com.joomidang.backend.seller.controller;

import com.joomidang.backend.seller.dto.SellerDTO;
import com.joomidang.backend.seller.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sellers")
@RequiredArgsConstructor
public class SellerController {
    private final SellerService sellerService;

    // 판매자 등록 신청 api
    @PostMapping("")
    public ResponseEntity<?> registerSeller(@RequestBody SellerDTO sellerDTO) {
        try {
            sellerService.registerSeller(sellerDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("판매자 등록 중 오류가 발생했습니다.");
        }
    }

    // 사업자등록번호 중복 확인 api
    // GET /sellers/check-business-number/1234567890
    @GetMapping("/check-business-number/{businessNumber}")
    public boolean checkBusinessNumber(@PathVariable("businessNumber") String businessNumber) {
        // 사용 가능: true, 이미 존재: false
        return sellerService.isUsableBusinessNumber(businessNumber);
    }

    // 전체 판매자 목록 조회 api (어드민용)
    // GET /sellers
    @GetMapping("")
    public List<SellerDTO> getSellerList() {
        return sellerService.getSellerList();
    }

    // 판매자 단건 조회 api (seller id로)
    @GetMapping("/{id}")
    public SellerDTO getSellerById(@PathVariable("id") long id) {
        return sellerService.getSellerById(id);
    }

    // 판매자 조회 api (user id로 - 내 판매자 신청 상태 확인)
    @GetMapping("/user/{userId}")
    public SellerDTO getSellerByUserId(@PathVariable("userId") long userId) {
        return sellerService.getSellerByUserId(userId);
    }

    // 판매자 심사 상태 변경 api (어드민)
    // PUT /sellers/1/status  body: { "status": "APPROVED" / "REJECTED", "rejectionReason": "..." }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSellerStatus(@PathVariable("id") long id,
                                                @RequestBody Map<String, String> body) {
        try {
            String status          = body.get("status");
            String rejectionReason = body.getOrDefault("rejectionReason", null);
            sellerService.updateSellerStatus(id, status, rejectionReason);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상태 변경 중 오류가 발생했습니다.");
        }
    }

}
