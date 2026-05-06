package com.joomidang.backend.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private long id;
    private long userId;                  //주문자 id (users 테이블 참조)
    private long sellerId;                //판매자 id - 정산용 (DB: seller_id)
    private BigDecimal productPrice;      //상품 금액 합계 (DB: product_price)
    private BigDecimal shippingFee;       //배송비 (DB: shipping_fee)
    private BigDecimal totalPrice;        //최종 결제액 = 상품 + 배송 (DB: total_price)
    private String currency;              //결제 통화: USD, JPY, EUR... (DB: currency)
    private BigDecimal exchangeRate;      //주문 시점 환율 스냅샷 KRW 기준 (DB: exchange_rate)
    private String receiverName;          //수취인 이름 (DB: receiver_name)
    private String receiverPhone;         //수취인 전화번호 (DB: receiver_phone)
    private String shippingCountry;       //배송 국가 코드 US/JP/... (DB: shipping_country)
    private String shippingZip;           //우편번호 (DB: shipping_zip)
    private String shippingAddress;       //상세 주소 (DB: shipping_address)
    private String consumerMemo;          //소비자 요청사항 (DB: consumer_memo)
    private String status;                //주문 상태: PENDING | PAID | PREPARING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    //주문 상품 목록 (주문 생성 시 함께 전달)
    private List<OrderItemDTO> items;
}
