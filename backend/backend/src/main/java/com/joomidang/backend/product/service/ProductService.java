package com.joomidang.backend.product.service;

import com.joomidang.backend.product.dto.ProductDTO;
import com.joomidang.backend.product.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductMapper productMapper;

    // 상품 등록
    public void registerProduct(ProductDTO productDTO) {
        productMapper.insertProduct(productDTO);
    }

    // 상품 단건 조회
    public ProductDTO getProductById(long id) {
        return productMapper.getProductById(id);
    }

    // 전체 상품 목록 조회
    public List<ProductDTO> getProductList() {
        return productMapper.getProductList();
    }

    // 판매자별 상품 목록 조회
    public List<ProductDTO> getProductListBySellerId(long sellerId) {
        return productMapper.getProductListBySellerId(sellerId);
    }

    // 상품 수정
    public void updateProduct(ProductDTO productDTO) {
        productMapper.updateProduct(productDTO);
    }

    // 상품 삭제
    public void deleteProduct(long id) {
        productMapper.deleteProduct(id);
    }

    // 전체 상품 목록 조회 (어드민용)
    public List<ProductDTO> getProductListForAdmin() {
        return productMapper.getProductListForAdmin();
    }

    // 상품 상태 변경 (어드민)
    public void updateProductStatus(long id, String status) {
        productMapper.updateProductStatus(id, status);
    }

}
