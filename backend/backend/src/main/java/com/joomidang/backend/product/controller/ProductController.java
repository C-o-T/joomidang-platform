package com.joomidang.backend.product.controller;

import com.joomidang.backend.product.dto.ProductDTO;
import com.joomidang.backend.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    // 상품 등록 api
    @PostMapping("")
    public ResponseEntity<?> registerProduct(@RequestBody ProductDTO productDTO) {
        try {
            productService.registerProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 등록 중 오류가 발생했습니다.");
        }
    }

    // 전체 상품 목록 조회 api
    // GET /products
    @GetMapping("")
    public List<ProductDTO> getProductList() {
        return productService.getProductList();
    }

    // 상품 단건 조회 api
    // GET /products/1
    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable("id") long id) {
        return productService.getProductById(id);
    }

    // 판매자별 상품 목록 조회 api
    // GET /products/seller/1
    @GetMapping("/seller/{sellerId}")
    public List<ProductDTO> getProductListBySellerId(@PathVariable("sellerId") long sellerId) {
        return productService.getProductListBySellerId(sellerId);
    }

    // 상품 수정 api
    // PUT /products/1
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable("id") long id, @RequestBody ProductDTO productDTO) {
        try {
            productDTO.setId(id);
            productService.updateProduct(productDTO);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 수정 중 오류가 발생했습니다.");
        }
    }

    // 상품 삭제 api
    // DELETE /products/1
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상품 삭제 중 오류가 발생했습니다.");
        }
    }

    // 전체 상품 목록 조회 api (어드민용 - 상태 무관)
    // GET /products/admin
    @GetMapping("/admin")
    public List<ProductDTO> getProductListForAdmin() {
        return productService.getProductListForAdmin();
    }

    // 상품 상태 변경 api (어드민: ACTIVE / REJECTED / INACTIVE)
    // PATCH /products/1/status  body: { "status": "ACTIVE" }
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateProductStatus(@PathVariable("id") long id,
                                                 @RequestBody Map<String, String> body) {
        try {
            productService.updateProductStatus(id, body.get("status"));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("상태 변경 중 오류가 발생했습니다.");
        }
    }

}
