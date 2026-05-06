package com.joomidang.backend.cart.mapper;

import com.joomidang.backend.cart.dto.CartDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CartMapper {

    // 장바구니 추가
    void insertCart(CartDTO cartDTO);

    // 동일 (userId + productId) 장바구니 항목 조회 - upsert 판단용
    CartDTO findByUserAndProduct(@org.apache.ibatis.annotations.Param("userId") long userId,
                                 @org.apache.ibatis.annotations.Param("productId") long productId);

    // 장바구니 목록 조회 (user id로)
    List<CartDTO> getCartListByUserId(long userId);

    // 장바구니 수량 수정
    void updateCartQuantity(CartDTO cartDTO);

    // 장바구니 항목 삭제
    void deleteCart(long id);

    // 장바구니 전체 비우기 (user id로)
    void deleteCartByUserId(long userId);

}
