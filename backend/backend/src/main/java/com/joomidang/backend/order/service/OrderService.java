package com.joomidang.backend.order.service;

import com.joomidang.backend.order.dto.OrderDTO;
import com.joomidang.backend.order.dto.OrderItemDTO;
import com.joomidang.backend.order.mapper.OrderItemMapper;
import com.joomidang.backend.order.mapper.OrderMapper;
import com.joomidang.backend.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    //재고 감소를 위해 ProductMapper 주입
    private final ProductMapper productMapper;

    // 주문 생성 (orders + order_items 저장 + 재고 감소 - 트랜잭션으로 묶어서 하나라도 실패하면 전체 롤백)
    @Transactional
    public void createOrder(OrderDTO orderDTO) {
        // 0. 주문 상품 목록 유효성 검사 - 비어있으면 주문 거부
        if (orderDTO.getItems() == null || orderDTO.getItems().isEmpty()) {
            throw new IllegalArgumentException("주문 상품이 없습니다.");
        }

        // 1. 주문 저장 (useGeneratedKeys로 생성된 id가 orderDTO.id에 자동 세팅)
        orderMapper.insertOrder(orderDTO);

        // 2. 주문 상품 목록 저장 + 재고 감소
        if (orderDTO.getItems() != null) {
            for (OrderItemDTO item : orderDTO.getItems()) {
                //방금 생성된 주문 id를 각 아이템에 세팅
                item.setOrderId(orderDTO.getId());
                orderItemMapper.insertOrderItem(item);

                //재고 감소 - 재고 부족 시 decreaseStock이 0을 반환
                int updated = productMapper.decreaseStock(item.getProductId(), item.getQuantity());
                if (updated == 0) {
                    //재고 부족 → 트랜잭션 롤백을 위해 예외 던짐
                    throw new RuntimeException("재고가 부족합니다. 상품 id: " + item.getProductId());
                }
            }
        }
    }

    // 주문 단건 조회 (주문 상품 목록 포함)
    public OrderDTO getOrderById(long id) {
        OrderDTO order = orderMapper.getOrderById(id);
        if (order != null) {
            order.setItems(orderItemMapper.getOrderItemListByOrderId(id));
        }
        return order;
    }

    // 사용자별 주문 목록 조회
    public List<OrderDTO> getOrderListByUserId(long userId) {
        return orderMapper.getOrderListByUserId(userId);
    }

    // 주문 상태 변경
    public void updateOrderStatus(OrderDTO orderDTO) {
        orderMapper.updateOrderStatus(orderDTO);
    }

}
