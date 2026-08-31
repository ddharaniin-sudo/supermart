import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { showToast } from "../components/Toast";

export const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

export const defaultSupermarketProducts = [
  // 1. Vegetables
  {
    id: 1,
    name: "Coriander Leaves Without Roots",
    brand: "fresho!",
    category: "Vegetables",
    price: 35.00,
    originalPrice: 45.00,
    discount: "22% OFF",
    stock: 50,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["250 g", "500 g", "1 kg"],
    selectedVariant: "250 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Carrot - Fresh Orange",
    brand: "fresho!",
    category: "Vegetables",
    price: 48.00,
    originalPrice: 65.00,
    discount: "26% OFF",
    stock: 65,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 g", "1 kg", "2 kg"],
    selectedVariant: "500 g",
    hasSpecialOffer: true,
    dealTag: "Har Din Sasta! ∨",
    imageUrl: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Local Tomato - Premium",
    brand: "fresho!",
    category: "Vegetables",
    price: 40.00,
    originalPrice: 55.00,
    discount: "27% OFF",
    stock: 40,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 g", "1 kg", "2 kg"],
    selectedVariant: "500 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 12,
    name: "Fresh Green Bell Pepper / Capsicum",
    brand: "fresho!",
    category: "Vegetables",
    price: 44.00,
    originalPrice: 60.00,
    discount: "26% OFF",
    stock: 45,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["250 g", "500 g", "1 kg"],
    selectedVariant: "250 g",
    hasSpecialOffer: true,
    dealTag: "Har Din Sasta! ∨",
    imageUrl: "https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 13,
    name: "Tender Baby Spinach / Palak Leaves",
    brand: "fresho!",
    category: "Vegetables",
    price: 28.00,
    originalPrice: 38.00,
    discount: "26% OFF",
    stock: 50,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["250 g (1 bunch)", "500 g (2 bunches)"],
    selectedVariant: "250 g (1 bunch)",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 14,
    name: "Nashik Fresh Red Onions",
    brand: "fresho!",
    category: "Vegetables",
    price: 32.00,
    originalPrice: 45.00,
    discount: "28% OFF",
    stock: 120,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 kg", "2 kg", "5 kg bag"],
    selectedVariant: "1 kg",
    hasSpecialOffer: true,
    dealTag: "Mega Saver Pack ∨",
    imageUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 15,
    name: "Baby Potatoes / Dum Aloo Special",
    brand: "fresho!",
    category: "Vegetables",
    price: 36.00,
    originalPrice: 50.00,
    discount: "28% OFF",
    stock: 70,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 g", "1 kg"],
    selectedVariant: "500 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 16,
    name: "Crisp Salad Cucumber",
    brand: "fresho!",
    category: "Vegetables",
    price: 26.00,
    originalPrice: 35.00,
    discount: "25% OFF",
    stock: 60,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 g", "1 kg"],
    selectedVariant: "500 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 17,
    name: "Fresh Snow White Cauliflower",
    brand: "fresho!",
    category: "Vegetables",
    price: 42.00,
    originalPrice: 55.00,
    discount: "23% OFF",
    stock: 35,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 pc (Approx. 500g)", "2 pcs"],
    selectedVariant: "1 pc (Approx. 500g)",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 18,
    name: "Sweet Green Peas / Matar",
    brand: "fresho!",
    category: "Vegetables",
    price: 55.00,
    originalPrice: 75.00,
    discount: "26% OFF",
    stock: 45,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 g", "1 kg"],
    selectedVariant: "500 g",
    hasSpecialOffer: true,
    dealTag: "Season's Best ∨",
    imageUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=80"
  },

  // 2. Fruits
  {
    id: 4,
    name: "Royal Gala Apples - Crisp Sweet",
    brand: "fresho!",
    category: "Fruits",
    price: 140.00,
    originalPrice: 175.00,
    discount: "20% OFF",
    stock: 30,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["4 pcs (Approx. 500-600g)", "1 kg"],
    selectedVariant: "4 pcs (Approx. 500-600g)",
    hasSpecialOffer: true,
    dealTag: "Har Din Sasta! ∨",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    name: "Robusta Banana - Golden Ripe",
    brand: "fresho!",
    category: "Fruits",
    price: 45.00,
    originalPrice: 60.00,
    discount: "25% OFF",
    stock: 55,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 kg (Approx. 5-6 pcs)", "500 g"],
    selectedVariant: "1 kg (Approx. 5-6 pcs)",
    hasSpecialOffer: true,
    dealTag: "Har Din Sasta! ∨",
    imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 19,
    name: "Ratnagiri Alphonso Mangoes",
    brand: "fresho!",
    category: "Fruits",
    price: 240.00,
    originalPrice: 320.00,
    discount: "25% OFF",
    stock: 40,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["6 pcs box", "12 pcs crate"],
    selectedVariant: "6 pcs box",
    hasSpecialOffer: true,
    dealTag: "King of Fruits 👑",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 20,
    name: "Ruby Red Pomegranate / Anar",
    brand: "fresho!",
    category: "Fruits",
    price: 130.00,
    originalPrice: 165.00,
    discount: "21% OFF",
    stock: 35,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["4 pcs (Approx. 800g)", "1 kg"],
    selectedVariant: "4 pcs (Approx. 800g)",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 21,
    name: "Fresh Seedless Black Grapes",
    brand: "fresho!",
    category: "Fruits",
    price: 88.00,
    originalPrice: 115.00,
    discount: "23% OFF",
    stock: 50,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 g", "1 kg"],
    selectedVariant: "500 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 22,
    name: "Sweet Golden Papaya - Semi Ripe",
    brand: "fresho!",
    category: "Fruits",
    price: 65.00,
    originalPrice: 85.00,
    discount: "23% OFF",
    stock: 30,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 pc (Approx. 800g-1kg)", "2 pcs"],
    selectedVariant: "1 pc (Approx. 800g-1kg)",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 23,
    name: "Nagpur Sweet Oranges / Santra",
    brand: "fresho!",
    category: "Fruits",
    price: 75.00,
    originalPrice: 98.00,
    discount: "23% OFF",
    stock: 60,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 kg (Approx. 5-6 pcs)", "2 kg"],
    selectedVariant: "1 kg (Approx. 5-6 pcs)",
    hasSpecialOffer: true,
    dealTag: "Vitamin C Boost 🍊",
    imageUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 24,
    name: "Zespri Fresh Green Kiwi Fruit",
    brand: "fresho!",
    category: "Fruits",
    price: 99.00,
    originalPrice: 135.00,
    discount: "26% OFF",
    stock: 40,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["3 pcs pack", "6 pcs pack"],
    selectedVariant: "3 pcs pack",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=600&q=80"
  },

  // 3. Dairy
  {
    id: 6,
    name: "Pure Farm Fresh Cow Milk",
    brand: "Amul",
    category: "Dairy",
    price: 68.00,
    originalPrice: 78.00,
    discount: "12% OFF",
    stock: 40,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 Litre", "500 ml", "2 Litre"],
    selectedVariant: "1 Litre",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 7,
    name: "Fresh Malai Paneer - Cottage Cheese",
    brand: "Milky Mist",
    category: "Dairy",
    price: 95.00,
    originalPrice: 120.00,
    discount: "20% OFF",
    stock: 35,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["200 g", "500 g", "1 kg"],
    selectedVariant: "200 g",
    hasSpecialOffer: true,
    dealTag: "Har Din Sasta! ∨",
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 25,
    name: "Amul Pasteurized Salted Butter",
    brand: "Amul",
    category: "Dairy",
    price: 58.00,
    originalPrice: 62.00,
    discount: "6% OFF",
    stock: 80,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["100 g", "500 g block"],
    selectedVariant: "100 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 26,
    name: "Epigamia Greek Yogurt - Strawberry",
    brand: "Epigamia",
    category: "Dairy",
    price: 45.00,
    originalPrice: 55.00,
    discount: "18% OFF",
    stock: 50,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["100 g cup", "400 g tub"],
    selectedVariant: "100 g cup",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 27,
    name: "Cheddar Cheese Slices Pack",
    brand: "Britannia",
    category: "Dairy",
    price: 125.00,
    originalPrice: 150.00,
    discount: "16% OFF",
    stock: 45,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["10 slices (200g)", "20 slices (400g)"],
    selectedVariant: "10 slices (200g)",
    hasSpecialOffer: true,
    dealTag: "Buy 1 Get 1 Pack Deal",
    imageUrl: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 28,
    name: "Fresh Thick Set Curd / Dahi",
    brand: "Mother Dairy",
    category: "Dairy",
    price: 35.00,
    originalPrice: 40.00,
    discount: "12% OFF",
    stock: 60,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["400 g pouch", "1 kg tub"],
    selectedVariant: "400 g pouch",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 29,
    name: "Pure A2 Vedic Cow Ghee",
    brand: "Gir Cow Farms",
    category: "Dairy",
    price: 385.00,
    originalPrice: 460.00,
    discount: "16% OFF",
    stock: 30,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 ml jar", "1 Litre tin"],
    selectedVariant: "500 ml jar",
    hasSpecialOffer: true,
    dealTag: "Traditional Bilona ✨",
    imageUrl: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80"
  },

  // 4. Bakery
  {
    id: 8,
    name: "100% Whole Wheat Brown Bread",
    brand: "English Oven",
    category: "Bakery",
    price: 45.00,
    originalPrice: 55.00,
    discount: "18% OFF",
    stock: 30,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["400 g", "800 g"],
    selectedVariant: "400 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 9,
    name: "Fresh Butter Croissants",
    brand: "Bake House",
    category: "Bakery",
    price: 85.00,
    originalPrice: 110.00,
    discount: "22% OFF",
    stock: 25,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["2 pcs", "4 pcs"],
    selectedVariant: "2 pcs",
    hasSpecialOffer: true,
    dealTag: "Har Din Sasta! ∨",
    imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 30,
    name: "Crispy French Garlic & Herb Baguette",
    brand: "Bake House",
    category: "Bakery",
    price: 70.00,
    originalPrice: 90.00,
    discount: "22% OFF",
    stock: 25,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 pc (250g)", "2 pcs pack"],
    selectedVariant: "1 pc (250g)",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 31,
    name: "Multigrain 7-Seed Sandwich Loaf",
    brand: "The Health Factory",
    category: "Bakery",
    price: 52.00,
    originalPrice: 65.00,
    discount: "20% OFF",
    stock: 35,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["400 g pack"],
    selectedVariant: "400 g pack",
    hasSpecialOffer: true,
    dealTag: "Zero Maida 🍞",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 32,
    name: "Belgian Chocolate Glazed Donuts",
    brand: "Mad Over Donuts",
    category: "Bakery",
    price: 110.00,
    originalPrice: 140.00,
    discount: "21% OFF",
    stock: 20,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["2 pcs pack", "4 pcs box"],
    selectedVariant: "2 pcs pack",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 33,
    name: "Rich Vanilla Fruit & Nut Tea Cake",
    brand: "Elite",
    category: "Bakery",
    price: 95.00,
    originalPrice: 125.00,
    discount: "24% OFF",
    stock: 30,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["250 g bar", "500 g box"],
    selectedVariant: "250 g bar",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80"
  },

  // 5. Snacks
  {
    id: 10,
    name: "Classic Salted Crispy Potato Chips",
    brand: "Lay's",
    category: "Snacks",
    price: 30.00,
    originalPrice: 40.00,
    discount: "25% OFF",
    stock: 60,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["70 g", "130 g Party Pack"],
    selectedVariant: "70 g",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 11,
    name: "Roasted Salted Almonds & Nut Delight",
    brand: "Happilo",
    category: "Snacks",
    price: 185.00,
    originalPrice: 240.00,
    discount: "23% OFF",
    stock: 40,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["200 g", "500 g"],
    selectedVariant: "200 g",
    hasSpecialOffer: true,
    dealTag: "Har Din Sasta! ∨",
    imageUrl: "https://images.unsplash.com/photo-1508736793122-f516e3ba5569?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 34,
    name: "Crunchy Masala Roasted Cashew Nuts",
    brand: "Nutty Gritties",
    category: "Snacks",
    price: 220.00,
    originalPrice: 280.00,
    discount: "21% OFF",
    stock: 35,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["200 g pack", "500 g jar"],
    selectedVariant: "200 g pack",
    hasSpecialOffer: true,
    dealTag: "Premium Dry Fruit",
    imageUrl: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 35,
    name: "Dark Chocolate Coated Whole Almonds",
    brand: "Ferrero Rocher / Brookside",
    category: "Snacks",
    price: 165.00,
    originalPrice: 210.00,
    discount: "21% OFF",
    stock: 40,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["150 g pouch", "300 g tin"],
    selectedVariant: "150 g pouch",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 36,
    name: "Nacho Cheese Tortilla Chips with Salsa",
    brand: "Doritos",
    category: "Snacks",
    price: 60.00,
    originalPrice: 80.00,
    discount: "25% OFF",
    stock: 75,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["150 g bag", "300 g party pack"],
    selectedVariant: "150 g bag",
    hasSpecialOffer: true,
    dealTag: "Combo Offer 🍟",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 37,
    name: "Roasted Himalayan Salted Makhana",
    brand: "Farmley",
    category: "Snacks",
    price: 140.00,
    originalPrice: 180.00,
    discount: "22% OFF",
    stock: 50,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["100 g jar", "250 g pouch"],
    selectedVariant: "100 g jar",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=600&q=80"
  },

  // 6. Beverages
  {
    id: 38,
    name: "Cold-Pressed Valencia Orange Juice",
    brand: "Raw Pressery",
    category: "Beverages",
    price: 99.00,
    originalPrice: 125.00,
    discount: "20% OFF",
    stock: 40,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["300 ml bottle", "1 Litre bottle"],
    selectedVariant: "300 ml bottle",
    hasSpecialOffer: true,
    dealTag: "No Added Sugar 🍊",
    imageUrl: "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 39,
    name: "100% Pure Arabica Filter Coffee Blend",
    brand: "Blue Tokai",
    category: "Beverages",
    price: 195.00,
    originalPrice: 250.00,
    discount: "22% OFF",
    stock: 35,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["200 g jar", "500 g refill"],
    selectedVariant: "200 g jar",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 40,
    name: "Organic Kashmiri Kahwa Green Tea",
    brand: "Tetley",
    category: "Beverages",
    price: 145.00,
    originalPrice: 190.00,
    discount: "23% OFF",
    stock: 45,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["25 tea bags", "100 g loose leaf"],
    selectedVariant: "25 tea bags",
    hasSpecialOffer: true,
    dealTag: "Herbal Detox 🍵",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 41,
    name: "Natural Sparkling Himalayan Mineral Water",
    brand: "Perrier / Vedica",
    category: "Beverages",
    price: 45.00,
    originalPrice: 60.00,
    discount: "25% OFF",
    stock: 60,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["330 ml can", "750 ml glass bottle"],
    selectedVariant: "330 ml can",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80"
  },

  // 7. Grains & Staples
  {
    id: 42,
    name: "Daawat Rozana Gold Super Basmati Rice",
    brand: "Daawat",
    category: "Grains",
    price: 340.00,
    originalPrice: 420.00,
    discount: "19% OFF",
    stock: 50,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["1 kg pack", "5 kg bag"],
    selectedVariant: "5 kg bag",
    hasSpecialOffer: true,
    dealTag: "Aromatic Aged Rice 🍚",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 43,
    name: "Aashirvaad Shudh Organic Whole Wheat Atta",
    brand: "Aashirvaad",
    category: "Grains",
    price: 235.00,
    originalPrice: 285.00,
    discount: "17% OFF",
    stock: 60,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["5 kg bag", "10 kg bag"],
    selectedVariant: "5 kg bag",
    hasSpecialOffer: true,
    dealTag: "100% Whole Grain 🌾",
    imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
  },

  // 8. Spices & Oils
  {
    id: 44,
    name: "Cold-Pressed Extra Virgin Olive Oil",
    brand: "Borges / Figaro",
    category: "Spices",
    price: 490.00,
    originalPrice: 650.00,
    discount: "24% OFF",
    stock: 30,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["500 ml bottle", "1 Litre bottle"],
    selectedVariant: "500 ml bottle",
    hasSpecialOffer: true,
    dealTag: "Heart Healthy 🫒",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 45,
    name: "Whole Black Tellicherry Peppercorns",
    brand: "Catch / Everest",
    category: "Spices",
    price: 85.00,
    originalPrice: 110.00,
    discount: "22% OFF",
    stock: 55,
    deliveryTime: "10 MINS",
    isVeg: true,
    variants: ["100 g grinder jar", "200 g refill"],
    selectedVariant: "100 g grinder jar",
    hasSpecialOffer: false,
    imageUrl: "https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80"
  }
];

export const categories = [
  { label: "All Items", value: "ALL", icon: "✨" },
  { label: "Vegetables", value: "Vegetables", icon: "🥦" },
  { label: "Fruits", value: "Fruits", icon: "🍎" },
  { label: "Dairy", value: "Dairy", icon: "🥛" },
  { label: "Bakery", value: "Bakery", icon: "🍞" },
  { label: "Snacks", value: "Snacks", icon: "🍿" },
  { label: "Beverages", value: "Beverages", icon: "🧃" },
  { label: "Grains & Staples", value: "Grains", icon: "🌾" },
  { label: "Spices & Oils", value: "Spices", icon: "🧂" }
];

function addToCart(product, selectedPack) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const cartItemId = selectedPack ? `${product.id}-${selectedPack}` : product.id;
  const existing = cart.find((item) => item.cartId === cartItemId || item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      cartId: cartItemId,
      selectedVariant: selectedPack || product.selectedVariant || "Standard",
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
  showToast(`Added ${product.name} (${selectedPack || "1 unit"}) to basket! 🛒`);
}

export default function Home() {
  const [products, setProducts] = useState(defaultSupermarketProducts);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [carouselPosition, setCarouselPosition] = useState(0);

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const backendItems = res.data.map((item, idx) => {
            const defaultMatch =
              defaultSupermarketProducts.find(
                (d) =>
                  d.name.toLowerCase() === item.name?.toLowerCase() ||
                  d.category?.toLowerCase() === item.category?.toLowerCase()
              ) || defaultSupermarketProducts[idx % defaultSupermarketProducts.length];
            return {
              ...defaultMatch,
              ...item,
              id: item.id || `backend-${idx}`,
              name: item.name || defaultMatch?.name,
              category: item.category || defaultMatch?.category || "Fruits",
              price: item.price !== undefined ? Number(item.price) : defaultMatch?.price,
              originalPrice: defaultMatch?.originalPrice || Math.round(Number(item.price) * 1.25),
              discount: defaultMatch?.discount || "20% OFF",
              stock: item.stock !== undefined ? item.stock : 50,
              deliveryTime: defaultMatch?.deliveryTime || "10 MINS",
              isVeg: defaultMatch?.isVeg !== undefined ? defaultMatch.isVeg : true,
              variants: defaultMatch?.variants || ["500 g", "1 kg"],
              selectedVariant: defaultMatch?.selectedVariant || "500 g",
              imageUrl: item.imageUrl || defaultMatch?.imageUrl
            };
          });

          // Ensure all default categories are represented so all filters have products
          const combined = [...backendItems];
          defaultSupermarketProducts.forEach((defItem) => {
            const exists = combined.some(
              (p) => p.name.toLowerCase() === defItem.name.toLowerCase()
            );
            if (!exists) {
              combined.push(defItem);
            }
          });
          setProducts(combined);
        } else {
          setProducts(defaultSupermarketProducts);
        }
      })
      .catch(() => {
        setProducts(defaultSupermarketProducts);
      });
  }, []);

  const handleVariantChange = (productId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant
    }));
  };

  // Carousel handlers
  const itemsPerSlide = 4;
  const maxCarouselPosition = Math.max(0, products.length - itemsPerSlide);

  const handleCarouselPrev = () => {
    setCarouselPosition((prev) => Math.max(0, prev - 1));
  };

  const handleCarouselNext = () => {
    setCarouselPosition((prev) => Math.min(maxCarouselPosition, prev + 1));
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat =
          selectedCategory === "ALL" ||
          p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCat && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Smart Basket subset (carousel items)
  const smartBasketItems = products.slice(carouselPosition, carouselPosition + itemsPerSlide);

  return (
    <main className="container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-tag">🌱 FARM FRESH DIRECT</div>
          <h1>
            India's Most Trusted <br />
            <span className="accent">Online Supermarket</span>
          </h1>
          <p className="hero-desc">
            Get farm-fresh vegetables, organic fruits, daily staples and dairy delivered to your kitchen in 10-30 minutes.
          </p>

          <div className="hero-pills">
            <span className="hero-pill">⚡ 10-Min Superfast Express</span>
            <span className="hero-pill">🥬 100% Quality Checked</span>
            <span className="hero-pill">💰 Har Din Sasta Guaranteed</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrapper">
            <img
              className="hero-main-img"
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
              alt="Fresh Supermarket Basket"
            />
            <div className="floating-card card-1">
              <div className="floating-icon">🥦</div>
              <div>
                <div>My Smart Basket</div>
                <small style={{ color: "#059669" }}>Daily Essentials at Best MRP</small>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="floating-icon">⚡</div>
              <div>
                <div>10 Mins Delivery</div>
                <small style={{ color: "#d97706" }}>To Your Doorstep</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          My Smart Basket (Exact BigBasket Style Section from Image)
          ========================================================= */}
      <section className="smart-basket-section">
        <div className="smart-basket-header">
          <h2>My Smart Basket</h2>
          <div className="carousel-controls">
            <span className="view-all-link" onClick={() => setSelectedCategory("ALL")}>
              View All ({products.length} items)
            </span>
            <button 
              className="carousel-btn" 
              title="Previous"
              onClick={handleCarouselPrev}
              disabled={carouselPosition === 0}
              style={{ opacity: carouselPosition === 0 ? 0.5 : 1, cursor: carouselPosition === 0 ? "not-allowed" : "pointer" }}
            >
              ‹
            </button>
            <button 
              className="carousel-btn" 
              title="Next"
              onClick={handleCarouselNext}
              disabled={carouselPosition >= maxCarouselPosition}
              style={{ opacity: carouselPosition >= maxCarouselPosition ? 0.5 : 1, cursor: carouselPosition >= maxCarouselPosition ? "not-allowed" : "pointer" }}
            >
              ›
            </button>
          </div>
        </div>

        <div className="smart-grid">
          {smartBasketItems.map((item) => {
            const currentVariant =
              selectedVariants[item.id] || (item.variants ? item.variants[0] : "1 unit");

            return (
              <div className="smart-card" key={item.id}>
                {item.discount && (
                  <span className="discount-ribbon">{item.discount}</span>
                )}

                <div className="smart-img-wrap">
                  <img
                    className="smart-img"
                    src={item.imageUrl || FALLBACK_IMG}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                </div>

                <div className="smart-meta-row">
                  <div className="veg-icon">
                    <div className="veg-dot" />
                  </div>
                  <div className="delivery-badge">
                    ⚡ {item.deliveryTime || "10 MINS"}
                  </div>
                </div>

                <div className="brand-label">{item.brand || "fresho!"}</div>

                <h3 className="smart-title">
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </h3>

                {item.variants && item.variants.length > 0 && (
                  <select
                    className="variant-dropdown"
                    value={currentVariant}
                    onChange={(e) => handleVariantChange(item.id, e.target.value)}
                  >
                    {item.variants.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                )}

                <div className="smart-price-row">
                  <span className="smart-price">₹{Number(item.price).toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="smart-mrp">₹{Number(item.originalPrice).toFixed(2)}</span>
                  )}
                </div>

                {item.hasSpecialOffer && item.dealTag && (
                  <div className="deal-banner">
                    <span>{item.dealTag}</span>
                    <span>🏷️</span>
                  </div>
                )}

                <button
                  className="add-basket-btn primary"
                  onClick={() => addToCart(item, currentVariant)}
                >
                  + Add to Basket
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Aisles Category Filter Section */}
      <section className="category-filter-wrap">
        <div className="section-header">
          <div>
            <h2>🛒 All Supermarket Aisles ({filteredProducts.length} Items)</h2>
            <p>Explore farm-fresh groceries, vegetables, fruits, and daily staples</p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
            <div className="nav-search" style={{ minWidth: "240px" }}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search coriander, carrot, tomato, garlic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">✨ Featured Deals</option>
              <option value="price-low">💵 Price: Low to High</option>
              <option value="price-high">💎 Price: High to Low</option>
              <option value="name">🔤 Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="category-pills">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`category-pill ${selectedCategory === cat.value ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* All Products Grid with 12 Supermarket Quick Commerce Cards */}
      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No groceries match your search</h3>
          <p style={{ color: "#64748b" }}>
            Try searching for coriander, carrots, tomatoes or milk.
          </p>
          <button
            className="secondary-btn"
            onClick={() => {
              setSelectedCategory("ALL");
              setSearchQuery("");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="smart-grid">
          {filteredProducts.map((item) => {
            const currentVariant =
              selectedVariants[item.id] || (item.variants ? item.variants[0] : "1 unit");

            return (
              <div className="smart-card" key={item.id}>
                {item.discount && (
                  <span className="discount-ribbon">{item.discount}</span>
                )}

                <div className="smart-img-wrap">
                  <img
                    className="smart-img"
                    src={item.imageUrl || FALLBACK_IMG}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_IMG;
                    }}
                  />
                </div>

                <div className="smart-meta-row">
                  <div className="veg-icon">
                    <div className="veg-dot" />
                  </div>
                  <div className="delivery-badge">
                    ⚡ {item.deliveryTime || "10 MINS"}
                  </div>
                </div>

                <div className="brand-label">{item.brand || "fresho!"}</div>

                <h3 className="smart-title">
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </h3>

                {item.variants && item.variants.length > 0 && (
                  <select
                    className="variant-dropdown"
                    value={currentVariant}
                    onChange={(e) => handleVariantChange(item.id, e.target.value)}
                  >
                    {item.variants.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                )}

                <div className="smart-price-row">
                  <span className="smart-price">₹{Number(item.price).toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="smart-mrp">₹{Number(item.originalPrice).toFixed(2)}</span>
                  )}
                </div>

                {item.hasSpecialOffer && item.dealTag && (
                  <div className="deal-banner">
                    <span>{item.dealTag}</span>
                    <span>🏷️</span>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "8px" }}>
                  <Link className="secondary-btn" style={{ padding: "8px", fontSize: "12px" }} to={`/product/${item.id}`}>
                    Details
                  </Link>
                  <button
                    className="add-basket-btn primary"
                    onClick={() => addToCart(item, currentVariant)}
                  >
                    + Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
