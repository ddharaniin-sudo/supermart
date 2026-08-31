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
                // 1. Vegetables
                productRepository.save(new Product(
                        "Coriander Leaves Without Roots",
                        "Vegetables",
                        35,
                        50,
                        "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Carrot - Fresh Orange",
                        "Vegetables",
                        48,
                        65,
                        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Local Tomato - Premium",
                        "Vegetables",
                        40,
                        40,
                        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Fresh Green Bell Pepper / Capsicum",
                        "Vegetables",
                        44,
                        45,
                        "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Tender Baby Spinach / Palak Leaves",
                        "Vegetables",
                        28,
                        50,
                        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Nashik Fresh Red Onions",
                        "Vegetables",
                        32,
                        120,
                        "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Baby Potatoes / Dum Aloo Special",
                        "Vegetables",
                        36,
                        70,
                        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Crisp Salad Cucumber",
                        "Vegetables",
                        26,
                        60,
                        "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Fresh Snow White Cauliflower",
                        "Vegetables",
                        42,
                        35,
                        "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Sweet Green Peas / Matar",
                        "Vegetables",
                        55,
                        45,
                        "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // 2. Fruits
                productRepository.save(new Product(
                        "Royal Gala Apples - Crisp Sweet",
                        "Fruits",
                        140,
                        30,
                        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Robusta Banana - Golden Ripe",
                        "Fruits",
                        45,
                        55,
                        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Ratnagiri Alphonso Mangoes",
                        "Fruits",
                        240,
                        40,
                        "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Ruby Red Pomegranate / Anar",
                        "Fruits",
                        130,
                        35,
                        "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Fresh Seedless Black Grapes",
                        "Fruits",
                        88,
                        50,
                        "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Sweet Golden Papaya - Semi Ripe",
                        "Fruits",
                        65,
                        30,
                        "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Nagpur Sweet Oranges / Santra",
                        "Fruits",
                        75,
                        60,
                        "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Zespri Fresh Green Kiwi Fruit",
                        "Fruits",
                        99,
                        40,
                        "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // 3. Dairy
                productRepository.save(new Product(
                        "Pure Farm Fresh Cow Milk",
                        "Dairy",
                        68,
                        40,
                        "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Fresh Malai Paneer - Cottage Cheese",
                        "Dairy",
                        95,
                        35,
                        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Amul Pasteurized Salted Butter",
                        "Dairy",
                        58,
                        80,
                        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Epigamia Greek Yogurt - Strawberry",
                        "Dairy",
                        45,
                        50,
                        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Cheddar Cheese Slices Pack",
                        "Dairy",
                        125,
                        45,
                        "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Fresh Thick Set Curd / Dahi",
                        "Dairy",
                        35,
                        60,
                        "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Pure A2 Vedic Cow Ghee",
                        "Dairy",
                        385,
                        30,
                        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // 4. Bakery
                productRepository.save(new Product(
                        "100% Whole Wheat Brown Bread",
                        "Bakery",
                        45,
                        30,
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Fresh Butter Croissants",
                        "Bakery",
                        85,
                        25,
                        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Crispy French Garlic & Herb Baguette",
                        "Bakery",
                        70,
                        25,
                        "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Multigrain 7-Seed Sandwich Loaf",
                        "Bakery",
                        52,
                        35,
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Belgian Chocolate Glazed Donuts",
                        "Bakery",
                        110,
                        20,
                        "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Rich Vanilla Fruit & Nut Tea Cake",
                        "Bakery",
                        95,
                        30,
                        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // 5. Snacks
                productRepository.save(new Product(
                        "Classic Salted Crispy Potato Chips",
                        "Snacks",
                        30,
                        60,
                        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Roasted Salted Almonds & Nut Delight",
                        "Snacks",
                        185,
                        40,
                        "https://images.unsplash.com/photo-1508736793122-f516e3ba5569?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Crunchy Masala Roasted Cashew Nuts",
                        "Snacks",
                        220,
                        35,
                        "https://images.unsplash.com/photo-1536591375315-1b8e71887e14?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Dark Chocolate Coated Whole Almonds",
                        "Snacks",
                        165,
                        40,
                        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Nacho Cheese Tortilla Chips with Salsa",
                        "Snacks",
                        60,
                        75,
                        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Roasted Himalayan Salted Makhana",
                        "Snacks",
                        140,
                        50,
                        "https://images.unsplash.com/photo-1599599810694-a5f808b1b5b1?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // 6. Beverages
                productRepository.save(new Product(
                        "Cold-Pressed Valencia Orange Juice",
                        "Beverages",
                        99,
                        40,
                        "https://images.unsplash.com/photo-1600271886742-f049cd1f3b19?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "100% Pure Arabica Filter Coffee Blend",
                        "Beverages",
                        195,
                        35,
                        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Organic Kashmiri Kahwa Green Tea",
                        "Beverages",
                        145,
                        45,
                        "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Natural Sparkling Himalayan Mineral Water",
                        "Beverages",
                        45,
                        60,
                        "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // 7. Grains & Staples
                productRepository.save(new Product(
                        "Daawat Rozana Gold Super Basmati Rice",
                        "Grains",
                        340,
                        50,
                        "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Aashirvaad Shudh Organic Whole Wheat Atta",
                        "Grains",
                        235,
                        60,
                        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                        seller
                ));

                // 8. Spices & Oils
                productRepository.save(new Product(
                        "Cold-Pressed Extra Virgin Olive Oil",
                        "Spices",
                        490,
                        30,
                        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
                productRepository.save(new Product(
                        "Whole Black Tellicherry Peppercorns",
                        "Spices",
                        85,
                        55,
                        "https://images.unsplash.com/photo-1599599810694-a5f808b1b5b1?auto=format&fit=crop&w=800&q=80",
                        seller
                ));
            }
        };
    }
}
