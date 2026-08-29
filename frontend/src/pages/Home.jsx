import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { showToast } from "../components/Toast";

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
  }
];

const categories = [
  { label: "All Items", value: "ALL", icon: "✨" },
  { label: "Vegetables", value: "Vegetables", icon: "🥦" },
  { label: "Fruits", value: "Fruits", icon: "🍎" },
  { label: "Dairy", value: "Dairy", icon: "🥛" },
  { label: "Bakery", value: "Bakery", icon: "🍞" },
  { label: "Snacks", value: "Snacks", icon: "🍿" }
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

  // Smart Basket subset (first 4 items matching reference screenshot)
  const smartBasketItems = products.slice(0, 4);

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
              View All (12 items)
            </span>
            <button className="carousel-btn" title="Previous">‹</button>
            <button className="carousel-btn" title="Next">›</button>
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
                    src={item.imageUrl}
                    alt={item.name}
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
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
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
