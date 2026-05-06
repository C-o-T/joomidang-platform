package com.joomidang.backend.cart.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

//@Data: Lombok이 getter, setter, toString을 자동으로 생성
@Data
public class CartDTO {
    private long id;
    private long userId;            //장바구니 주인 (users 테이블 참조)
    private long productId;         //담은 상품 (products 테이블 참조)
    private int quantity;           //수량

    //products 테이블 JOIN으로 가져오는 필드 (cart_items에는 저장 안 함)
    private long sellerId;          //판매자 id (products.seller_id) - order_items.seller_id 채우기 위해 필요
    private String productName;     //상품명 한국어 (products.name_ko)
    private String nameEn;          //상품명 영어 (products.name_en)
    private String nameJa;          //상품명 일본어 (products.name_ja)
    private String nameZh;          //상품명 중국어 (products.name_zh — migration 후 활성화)
    private BigDecimal price;       //현재 가격 (products.price_krw)
    private String category;        //카테고리 (products.category)

    private LocalDateTime createdAt;
}
