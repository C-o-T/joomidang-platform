package com.joomidang.backend.order.mapper;

import com.joomidang.backend.order.dto.OrderItemDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderItemMapper {

    // 주문 상품 저장
    void insertOrderItem(OrderItemDTO orderItemDTO);

    // 주문별 상품 목록 조회
    List<OrderItemDTO> getOrderItemListByOrderId(long orderId);

}
