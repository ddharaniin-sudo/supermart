package com.supermarket.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.supermarket.model.Product;
import com.supermarket.model.Role;
import com.supermarket.model.User;
import com.supermarket.repository.ProductRepository;
import com.supermarket.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductController(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/products")
    public List<Product> allProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/seller/products")
    public ResponseEntity<?> sellerProducts(@RequestParam String sellerEmail) {
        return userRepository.findByEmail(sellerEmail)
                .map(seller -> ResponseEntity.ok(productRepository.findBySeller(seller)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/seller/products")
    public ResponseEntity<?> addProduct(@RequestBody ProductRequest request) {
        User seller = userRepository.findByEmail(request.sellerEmail())
                .orElse(null);

        if (seller == null || seller.getRole() != Role.SELLER) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Valid seller account required"));
        }

        Product product = new Product(
                request.name(),
                request.category(),
                request.price(),
                request.stock(),
                request.imageUrl(),
                seller
        );

        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/seller/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        return productRepository.findById(id)
                .map(product -> {
                    product.setName(request.name());
                    product.setCategory(request.category());
                    product.setPrice(request.price());
                    product.setStock(request.stock());
                    product.setImageUrl(request.imageUrl());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/seller/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Product deleted"));
    }

    public record ProductRequest(
            String name,
            String category,
            double price,
            int stock,
            String imageUrl,
            String sellerEmail
    ) {}
}
