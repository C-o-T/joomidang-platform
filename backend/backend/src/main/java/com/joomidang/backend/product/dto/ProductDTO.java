package com.joomidang.backend.product.dto;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductDTO {
    private long id;
    private long sellerId;

    // 상품명 다국어
    private String name;                  // 한국어 (DB: name_ko)
    private String nameEn;                // 영어   (DB: name_en)
    private String nameJa;                // 일본어 (DB: name_ja)
    private String nameZh;                // 중국어 (DB: name_zh)

    private String category;

    // 상품 설명
    private String description;           // 한국어 (DB: description_ko)
    private String descriptionEn;         // 영어   (DB: description_en)

    // 가격
    private BigDecimal price;             // KRW (DB: price_krw)
    private BigDecimal originalPrice;     // 원가 KRW (DB: original_price_krw)
    private int discount;                 // 할인율 % (DB: discount)

    // 재고/물류
    private int stock;
    private int minOrderQuantity;         // DB: min_order_quantity
    private int weightGram;               // DB: weight_gram
    private String customsHsCode;         // DB: customs_hs_code

    // 원재료
    private String ingredients;           // 한국어 (DB: ingredients_ko)
    private String ingredientsEn;         // 영어   (DB: ingredients_en)

    // 이미지
    private String thumbnailUrl;          // DB: thumbnail_url

    // 주류 정보
    private BigDecimal alcoholPercentage; // DB: alcohol
    private int volumeMl;                 // DB: volume

    // 양조장 다국어
    private String brewery;               // 한국어 (DB: brewery_ko)
    private String breweryEn;             // 영어   (DB: brewery_en)
    private String breweryJa;             // 일본어 (DB: brewery_ja)
    private String breweryZh;             // 중국어 (DB: brewery_zh)

    // 산지
    private String region;                // 한국어 (DB: region_ko)
    private String regionEn;              // 영어   (DB: region_en)

    // 문화재/유산 인증
    private String heritage;              // 한국어 (DB: heritage_ko)
    private String heritageEn;            // 영어   (DB: heritage_en)

    // 테이스팅 노트 (JSON: {nose, palate, finish}) — @JsonRawValue: DB JSON 문자열을 그대로 객체로 직렬화
    @JsonRawValue
    private String tastingKo;             // DB: tasting_ko
    @JsonRawValue
    private String tastingEn;             // DB: tasting_en
    @JsonRawValue
    private String tastingJa;             // DB: tasting_ja
    @JsonRawValue
    private String tastingZh;             // DB: tasting_zh

    // 페어링 (JSON array) — @JsonRawValue: DB JSON 배열 문자열을 그대로 배열로 직렬화
    @JsonRawValue
    private String pairing;               // DB: pairing (한국어)
    @JsonRawValue
    private String pairingEn;             // DB: pairing_en (영어)

    // 서양 주종 비교 (US/EU 타겟용)
    private String bridgeEn;              // DB: bridge_en

    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
