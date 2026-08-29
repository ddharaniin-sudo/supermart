package com.supermarket;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.supermarket.model.Product;
import com.supermarket.model.Role;
import com.supermarket.model.User;
import com.supermarket.repository.ProductRepository;
import com.supermarket.repository.UserRepository;

@SpringBootApplication
public class SupermarketBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SupermarketBackendApplication.class, args);
    }

    @Bean
    CommandLineRunner seedAccounts(UserRepository userRepository, ProductRepository productRepository, PasswordEncoder encoder) {
        return args -> {
            if (userRepository.findByEmail("admin@supermarket.com").isEmpty()) {
                userRepository.save(new User(
                        "Main Admin",
                        "admin@supermarket.com",
                        encoder.encode("Admin@123"),
                        Role.ADMIN
                ));
            }

            User seller = userRepository.findByEmail("seller@supermarket.com").orElseGet(() ->
                    userRepository.save(new User(
                            "Main Seller",
                            "seller@supermarket.com",
                            encoder.encode("Seller@123"),
                            Role.SELLER
                    ))
            );

            if (productRepository.count() == 0) {
                // Vegetables
                productRepository.save(new Product(
                        "Coriander Leaves",
                        "Vegetables",
                        35,
                        50,
                        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Fresh Orange Carrot",
                        "Vegetables",
                        48,
                        60,
                        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // Fruits
                productRepository.save(new Product(
                        "Fresh Apple",
                        "Fruits",
                        140,
                        50,
                        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Organic Banana",
                        "Fruits",
                        45,
                        60,
                        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // Dairy
                productRepository.save(new Product(
                        "Whole Milk",
                        "Dairy",
                        68,
                        40,
                        "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Malai Paneer",
                        "Dairy",
                        95,
                        35,
                        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // Bakery
                productRepository.save(new Product(
                        "Whole Wheat Bread",
                        "Bakery",
                        45,
                        30,
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Butter Croissant",
                        "Bakery",
                        85,
                        25,
                        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // Snacks
                productRepository.save(new Product(
                        "Salted Potato Chips",
                        "Snacks",
                        30,
                        60,
                        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Roasted Salted Almonds",
                        "Snacks",
                        185,
                        40,
                        "https://images.unsplash.com/photo-1508736793122-f516e3ba5569?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
            }
        };
    }
}
