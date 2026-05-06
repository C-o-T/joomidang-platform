package com.joomidang.backend.cart.controller;

import com.joomidang.backend.cart.dto.CartDTO;
import com.joomidang.backend.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    // 장바구니 추가 api
    @PostMapping("")
    public ResponseEntity<?> addCart(@RequestBody CartDTO cartDTO) {
        try {
            cartService.addCart(cartDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("장바구니 추가 중 오류가 발생했습니다.");
        }
    }

    // 장바구니 목록 조회 api
    // GET /cart/user/1
    @GetMapping("/user/{userId}")
    public List<CartDTO> getCartListByUserId(@PathVariable("userId") long userId) {
        return cartService.getCartListByUserId(userId);
    }

    // 장바구니 수량 수정 api
    // PUT /cart/1
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCartQuantity(@PathVariable("id") long id, @RequestBody CartDTO cartDTO) {
        try {
            cartDTO.setId(id);
            cartService.updateCartQuantity(cartDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("장바구니 수정 중 오류가 발생했습니다.");
        }
    }

    // 장바구니 항목 삭제 api
    // DELETE /cart/1
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCart(@PathVariable("id") long id) {
        try {
            cartService.deleteCart(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("장바구니 삭제 중 오류가 발생했습니다.");
        }
    }

    // 장바구니 전체 비우기 api
    // DELETE /cart/user/1
    @DeleteMapping("/user/{userId}")
    public ResponseEntity<?> deleteCartByUserId(@PathVariable("userId") long userId) {
        try {
            cartService.deleteCartByUserId(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("장바구니 비우기 중 오류가 발생했습니다.");
        }
    }

}
