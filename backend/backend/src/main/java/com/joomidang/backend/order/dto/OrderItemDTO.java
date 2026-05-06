package com.joomidang.backend.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderItemDTO {
    private long id;
    private long orderId;                 //주문 id (orders 테이블 참조)
    private long productId;               //상품 id (products 테이블 참조)
    private long sellerId;                //판매자 id - 정산 쿼리 최적화용 (DB: seller_id)
    private int quantity;                 //주문 수량
    private BigDecimal priceAtOrder;      //주문 당시 가격 스냅샷 (DB: price_at_order)
    private String currency;              //결제 통화: USD, JPY, EUR... (DB: currency)
    private LocalDateTime createdAt;
}
