package com.joomidang.backend.product.mapper;

import com.joomidang.backend.product.dto.ProductDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ProductMapper {

    // 상품 등록
    void insertProduct(ProductDTO productDTO);

    // 상품 단건 조회
    ProductDTO getProductById(long id);

    // 전체 상품 목록 조회 (판매중인 것만)
    List<ProductDTO> getProductList();

    // 판매자별 상품 목록 조회
    List<ProductDTO> getProductListBySellerId(long sellerId);

    // 상품 수정
    void updateProduct(ProductDTO productDTO);

    // 상품 삭제 (소프트 삭제)
    void deleteProduct(long id);

    // 재고 감소 (주문 생성 시 호출 - stock >= quantity 조건 만족 시에만 실행)
    int decreaseStock(@org.apache.ibatis.annotations.Param("productId") long productId,
                      @org.apache.ibatis.annotations.Param("quantity") int quantity);

    // 전체 상품 목록 조회 (어드민용 - 삭제된 것 제외, 상태 무관)
    List<ProductDTO> getProductListForAdmin();

    // 상품 상태만 변경 (어드민: ACTIVE / REJECTED / INACTIVE)
    void updateProductStatus(@org.apache.ibatis.annotations.Param("id") long id,
                             @org.apache.ibatis.annotations.Param("status") String status);

}
