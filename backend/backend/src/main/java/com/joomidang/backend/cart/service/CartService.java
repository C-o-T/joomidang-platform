package com.joomidang.backend.cart.service;

import com.joomidang.backend.cart.dto.CartDTO;
import com.joomidang.backend.cart.mapper.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartMapper cartMapper;

    // 장바구니 추가 (upsert: 이미 있으면 수량만 증가, 없으면 신규 추가)
    public void addCart(CartDTO cartDTO) {
        CartDTO existing = cartMapper.findByUserAndProduct(cartDTO.getUserId(), cartDTO.getProductId());
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + cartDTO.getQuantity());
            cartMapper.updateCartQuantity(existing);
        } else {
            cartMapper.insertCart(cartDTO);
        }
    }

    // 장바구니 목록 조회
    public List<CartDTO> getCartListByUserId(long userId) {
        return cartMapper.getCartListByUserId(userId);
    }

    // 장바구니 수량 수정
    public void updateCartQuantity(CartDTO cartDTO) {
        cartMapper.updateCartQuantity(cartDTO);
    }

    // 장바구니 항목 삭제
    public void deleteCart(long id) {
        cartMapper.deleteCart(id);
    }

    // 장바구니 전체 비우기
    public void deleteCartByUserId(long userId) {
        cartMapper.deleteCartByUserId(userId);
    }

}
