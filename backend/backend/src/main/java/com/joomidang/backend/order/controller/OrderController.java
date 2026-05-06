package com.joomidang.backend.order.controller;

import com.joomidang.backend.order.dto.OrderDTO;
import com.joomidang.backend.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // 주문 생성 api
    @PostMapping("")
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO orderDTO) {
        try {
            orderService.createOrder(orderDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 생성 중 오류가 발생했습니다.");
        }
    }

    // 주문 단건 조회 api
    // GET /orders/1
    @GetMapping("/{id}")
    public OrderDTO getOrderById(@PathVariable("id") long id) {
        return orderService.getOrderById(id);
    }

    // 사용자별 주문 목록 조회 api
    // GET /orders/user/1
    @GetMapping("/user/{userId}")
    public List<OrderDTO> getOrderListByUserId(@PathVariable("userId") long userId) {
        return orderService.getOrderListByUserId(userId);
    }

    // 주문 상태 변경 api
    // PUT /orders/1/status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable("id") long id, @RequestBody OrderDTO orderDTO) {
        try {
            orderDTO.setId(id);
            orderService.updateOrderStatus(orderDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("주문 상태 변경 중 오류가 발생했습니다.");
        }
    }

}
