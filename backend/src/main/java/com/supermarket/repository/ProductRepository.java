package com.supermarket.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.supermarket.model.Product;
import com.supermarket.model.User;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySeller(User seller);
}
