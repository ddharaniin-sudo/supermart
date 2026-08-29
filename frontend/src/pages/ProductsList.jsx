import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { showToast } from "../components/Toast";
import { defaultSupermarketProducts } from "./Home";

const categories = [
  { label: "All Categories", value: "ALL", icon: "🛒" },
  { label: "Vegetables", value: "Vegetables", icon: "🥦" },
  { label: "Fruits", value: "Fruits", icon: "🍎" },
  { label: "Dairy", value: "Dairy", icon: "🥛" },
  { label: "Bakery", value: "Bakery", icon: "🍞" },
  { label: "Snacks", value: "Snacks", icon: "🍿" }
];

export default function ProductsList() {
  const [products, setProducts] = useState(defaultSupermarketProducts);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(600);
  const [vegOnly, setVegOnly] = useState(false);
  const [onlyDeals, setOnlyDeals] = useState(false);

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

          // Combine with default products so all categories remain populated
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

  function addToCart(product, selectedPack) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItemId = selectedPack ? `${product.id}-${selectedPack}` : product.id;
    const existing = cart.find(
      (item) => item.cartId === cartItemId || item.id === product.id
    );

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

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat =
          selectedCategory === "ALL" ||
          p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = Number(p.price) <= Number(maxPrice);
        const matchesVeg = !vegOnly || p.isVeg;
        const matchesDeals = !onlyDeals || p.hasSpecialOffer || p.discount;

        return (
          matchesCat && matchesSearch && matchesPrice && matchesVeg && matchesDeals
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [
    products,
    selectedCategory,
    searchQuery,
    maxPrice,
    vegOnly,
    onlyDeals,
    sortBy
  ]);

  return (
    <main className="container">
      {/* Top Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
          color: "white",
          padding: "32px 36px",
          borderRadius: "16px",
          marginBottom: "32px",
          boxShadow: "0 10px 25px rgba(6, 78, 59, 0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <span className="hero-tag" style={{ background: "rgba(255,255,255,0.2)", color: "#a7f3d0" }}>
            🛒 ALL SUPERMARKET AISLES
          </span>
          <h1 style={{ color: "white", fontSize: "32px", marginTop: "6px" }}>
            Fresh Produce & Daily Essentials
          </h1>
          <p style={{ color: "#d1fae5", fontSize: "14px", marginTop: "4px" }}>
            Over {products.length} farm-fresh items available with instant 10-minute delivery.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <div className="hero-pill" style={{ background: "rgba(255,255,255,0.15)" }}>
            ⚡ 10-Min Delivery
          </div>
          <div className="hero-pill" style={{ background: "rgba(255,255,255,0.15)" }}>
            🥦 100% Quality Checked
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "260px 1fr",
          gap: "28px",
          alignItems: "start"
        }}
      >
        {/* Sidebar Filters */}
        <aside
          style={{
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            position: "sticky",
            top: "85px"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid #e2e8f0"
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: 800 }}>🔍 Filter Products</h3>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#10b981",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
                setMaxPrice(600);
                setVegOnly(false);
                setOnlyDeals(false);
              }}
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155", display: "block", marginBottom: "10px" }}>
              Category
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "none",
                    background: selectedCategory === cat.value ? "#d1fae5" : "transparent",
                    color: selectedCategory === cat.value ? "#065f46" : "#475569",
                    fontWeight: selectedCategory === cat.value ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <span>
                    <span style={{ marginRight: "8px" }}>{cat.icon}</span>
                    {cat.label}
                  </span>
                  {selectedCategory === cat.value && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div style={{ marginBottom: "20px", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "#334155" }}>
                Max Price
              </label>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#10b981" }}>
                ₹{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="600"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{ width: "100%", accentColor: "#10b981", cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              <span>₹30</span>
              <span>₹600</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                style={{ accentColor: "#16a34a", width: "16px", height: "16px" }}
              />
              <span>🥦 100% Vegetarian Only</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={onlyDeals}
                onChange={(e) => setOnlyDeals(e.target.checked)}
                style={{ accentColor: "#10b981", width: "16px", height: "16px" }}
              />
              <span>🏷️ On Sale / Special Deals</span>
            </label>
          </div>
        </aside>

        {/* Products Right Column */}
        <section>
          {/* Top Search & Sort Controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "white",
              padding: "14px 18px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div className="nav-search" style={{ minWidth: "260px", flex: 1, maxWidth: "420px" }}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search coriander, potato, garlic, milk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                Showing <strong>{filteredProducts.length}</strong> items
              </span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">✨ Featured</option>
                <option value="price-low">💵 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="name">🔤 Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No items match your filter criteria</h3>
              <p style={{ color: "#64748b" }}>
                Try relaxing the price slider or resetting your active search keywords.
              </p>
              <button
                className="secondary-btn"
                onClick={() => {
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                  setMaxPrice(600);
                  setVegOnly(false);
                  setOnlyDeals(false);
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="smart-grid">
              {filteredProducts.map((item) => {
                const currentVariant =
                  selectedVariants[item.id] ||
                  (item.variants ? item.variants[0] : "1 unit");

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
                        onChange={(e) =>
                          handleVariantChange(item.id, e.target.value)
                        }
                      >
                        {item.variants.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    )}

                    <div className="smart-price-row">
                      <span className="smart-price">
                        ₹{Number(item.price).toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="smart-mrp">
                          ₹{Number(item.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {item.hasSpecialOffer && item.dealTag && (
                      <div className="deal-banner">
                        <span>{item.dealTag}</span>
                        <span>🏷️</span>
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1.2fr",
                        gap: "8px"
                      }}
                    >
                      <Link
                        className="secondary-btn"
                        style={{ padding: "8px", fontSize: "12px" }}
                        to={`/product/${item.id}`}
                      >
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
        </section>
      </div>
    </main>
  );
}
