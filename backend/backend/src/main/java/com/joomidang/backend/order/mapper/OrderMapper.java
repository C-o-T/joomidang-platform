package com.joomidang.backend.order.mapper;

import com.joomidang.backend.order.dto.OrderDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrderMapper {

    // 주문 생성
    void insertOrder(OrderDTO orderDTO);

    // 주문 단건 조회
    OrderDTO getOrderById(long id);

    // 사용자별 주문 목록 조회
    List<OrderDTO> getOrderListByUserId(long userId);

    // 주문 상태 변경
    void updateOrderStatus(OrderDTO orderDTO);

}
