import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { showToast } from "../components/Toast";
import { defaultSupermarketProducts } from "./Home";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

const categories = [
  { label: "All Categories", value: "ALL", icon: "🛒" },
  { label: "Vegetables", value: "Vegetables", icon: "🥦" },
  { label: "Fruits", value: "Fruits", icon: "🍎" },
  { label: "Dairy", value: "Dairy", icon: "🥛" },
  { label: "Bakery", value: "Bakery", icon: "🍞" },
  { label: "Snacks", value: "Snacks", icon: "🍿" },
  { label: "Beverages", value: "Beverages", icon: "🧃" },
  { label: "Grains & Staples", value: "Grains", icon: "🌾" },
  { label: "Spices & Oils", value: "Spices", icon: "🧂" }
];

export default function ProductsList() {
  const [products, setProducts] = useState(defaultSupermarketProducts);
  const [selectedVariants, setSelectedVariants] = useState({});

  // Staged Filter States (edited by user in sidebar)
  const [stagedCategory, setStagedCategory] = useState("ALL");
  const [stagedSearch, setStagedSearch] = useState("");
  const [stagedMaxPrice, setStagedMaxPrice] = useState(600);
  const [stagedVegOnly, setStagedVegOnly] = useState(false);
  const [stagedOnlyDeals, setStagedOnlyDeals] = useState(false);
  const [stagedSortBy, setStagedSortBy] = useState("featured");

  // Applied Filter States (drives the product list results)
  const [appliedCategory, setAppliedCategory] = useState("ALL");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(600);
  const [appliedVegOnly, setAppliedVegOnly] = useState(false);
  const [appliedOnlyDeals, setAppliedOnlyDeals] = useState(false);
  const [appliedSortBy, setAppliedSortBy] = useState("featured");

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

  // Apply Staged Filters
  const handleApplyFilters = () => {
    setAppliedCategory(stagedCategory);
    setAppliedSearch(stagedSearch);
    setAppliedMaxPrice(stagedMaxPrice);
    setAppliedVegOnly(stagedVegOnly);
    setAppliedOnlyDeals(stagedOnlyDeals);
    setAppliedSortBy(stagedSortBy);
    showToast("Filters applied successfully! 🔍");
  };

  // Reset all filters immediately
  const handleResetFilters = () => {
    setStagedCategory("ALL");
    setStagedSearch("");
    setStagedMaxPrice(600);
    setStagedVegOnly(false);
    setStagedOnlyDeals(false);
    setStagedSortBy("featured");

    setAppliedCategory("ALL");
    setAppliedSearch("");
    setAppliedMaxPrice(600);
    setAppliedVegOnly(false);
    setAppliedOnlyDeals(false);
    setAppliedSortBy("featured");

    showToast("All filters have been reset! 🔄");
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
          appliedCategory === "ALL" ||
          p.category?.toLowerCase() === appliedCategory.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          p.category?.toLowerCase().includes(appliedSearch.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(appliedSearch.toLowerCase()));
        const matchesPrice = Number(p.price) <= Number(appliedMaxPrice);
        const matchesVeg = !appliedVegOnly || p.isVeg;
        const matchesDeals = !appliedOnlyDeals || p.hasSpecialOffer || p.discount;

        return (
          matchesCat && matchesSearch && matchesPrice && matchesVeg && matchesDeals
        );
      })
      .sort((a, b) => {
        if (appliedSortBy === "price-low") return a.price - b.price;
        if (appliedSortBy === "price-high") return b.price - a.price;
        if (appliedSortBy === "name") return a.name.localeCompare(b.name);
        return 0;
      });
  }, [
    products,
    appliedCategory,
    appliedSearch,
    appliedMaxPrice,
    appliedVegOnly,
    appliedOnlyDeals,
    appliedSortBy
  ]);

  const hasPendingChanges =
    stagedCategory !== appliedCategory ||
    stagedSearch !== appliedSearch ||
    stagedMaxPrice !== appliedMaxPrice ||
    stagedVegOnly !== appliedVegOnly ||
    stagedOnlyDeals !== appliedOnlyDeals ||
    stagedSortBy !== appliedSortBy;

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
          gridTemplateColumns: "270px 1fr",
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
              type="button"
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
              onClick={handleResetFilters}
            >
              🔄 Reset All
            </button>
          </div>

          {/* Action Buttons: Apply & Reset */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            <button
              type="button"
              className="primary-btn"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "14px",
                fontWeight: 700,
                boxShadow: hasPendingChanges ? "0 0 12px rgba(16, 185, 129, 0.4)" : "none"
              }}
              onClick={handleApplyFilters}
            >
              ✨ Apply Filters {hasPendingChanges ? "•" : ""}
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
                    background: stagedCategory === cat.value ? "#d1fae5" : "transparent",
                    color: stagedCategory === cat.value ? "#065f46" : "#475569",
                    fontWeight: stagedCategory === cat.value ? 700 : 500,
                    fontSize: "13px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                  onClick={() => setStagedCategory(cat.value)}
                >
                  <span>
                    <span style={{ marginRight: "8px" }}>{cat.icon}</span>
                    {cat.label}
                  </span>
                  {stagedCategory === cat.value && <span>✓</span>}
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
                ₹{stagedMaxPrice}
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="600"
              step="10"
              value={stagedMaxPrice}
              onChange={(e) => setStagedMaxPrice(Number(e.target.value))}
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
                checked={stagedVegOnly}
                onChange={(e) => setStagedVegOnly(e.target.checked)}
                style={{ accentColor: "#16a34a", width: "16px", height: "16px" }}
              />
              <span>🥦 100% Vegetarian Only</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 600, color: "#334155", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={stagedOnlyDeals}
                onChange={(e) => setStagedOnlyDeals(e.target.checked)}
                style={{ accentColor: "#10b981", width: "16px", height: "16px" }}
              />
              <span>🏷️ On Sale / Special Deals</span>
            </label>
          </div>

          {/* Bottom Apply Button */}
          <div style={{ marginTop: "20px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
            <button
              type="button"
              className="primary-btn"
              style={{ width: "100%", padding: "10px", fontSize: "13px" }}
              onClick={handleApplyFilters}
            >
              Apply Filter Results →
            </button>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleApplyFilters();
              }}
              className="nav-search"
              style={{ minWidth: "260px", flex: 1, maxWidth: "440px", display: "flex", alignItems: "center" }}
            >
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search coriander, potato, milk, almonds... (Press Enter)"
                value={stagedSearch}
                onChange={(e) => setStagedSearch(e.target.value)}
              />
              <button
                type="submit"
                className="secondary-btn"
                style={{ padding: "6px 12px", fontSize: "12px", marginLeft: "6px", whiteSpace: "nowrap" }}
              >
                Search
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>
                Showing <strong>{filteredProducts.length}</strong> items
              </span>
              <select
                className="sort-select"
                value={stagedSortBy}
                onChange={(e) => {
                  setStagedSortBy(e.target.value);
                  setAppliedSortBy(e.target.value);
                }}
              >
                <option value="featured">✨ Featured</option>
                <option value="price-low">💵 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
                <option value="name">🔤 Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Applied Filters Summary Bar */}
          {(appliedCategory !== "ALL" || appliedSearch || appliedMaxPrice < 600 || appliedVegOnly || appliedOnlyDeals) && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "16px",
                background: "#f1f5f9",
                padding: "10px 14px",
                borderRadius: "10px"
              }}
            >
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Active Filters:</span>

              {appliedCategory !== "ALL" && (
                <span className="hero-pill" style={{ fontSize: "11px", padding: "3px 10px", background: "white" }}>
                  Category: {appliedCategory}
                </span>
              )}

              {appliedSearch && (
                <span className="hero-pill" style={{ fontSize: "11px", padding: "3px 10px", background: "white" }}>
                  Keyword: "{appliedSearch}"
                </span>
              )}

              {appliedMaxPrice < 600 && (
                <span className="hero-pill" style={{ fontSize: "11px", padding: "3px 10px", background: "white" }}>
                  Max: ₹{appliedMaxPrice}
                </span>
              )}

              {appliedVegOnly && (
                <span className="hero-pill" style={{ fontSize: "11px", padding: "3px 10px", background: "#dcfce7", color: "#166534" }}>
                  🥦 Veg Only
                </span>
              )}

              {appliedOnlyDeals && (
                <span className="hero-pill" style={{ fontSize: "11px", padding: "3px 10px", background: "#fef3c7", color: "#92400e" }}>
                  🏷️ On Sale
                </span>
              )}

              <button
                type="button"
                onClick={handleResetFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  marginLeft: "auto"
                }}
              >
                Clear All ✕
              </button>
            </div>
          )}

          {/* Grid */}
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No items match your filter criteria</h3>
              <p style={{ color: "#64748b" }}>
                Try relaxing the price slider, changing categories, or resetting active search keywords.
              </p>
              <button
                type="button"
                className="primary-btn"
                style={{ marginTop: "12px" }}
                onClick={handleResetFilters}
              >
                🔄 Reset All Filters
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
