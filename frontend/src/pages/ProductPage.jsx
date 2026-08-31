import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import { showToast } from "../components/Toast";
import { defaultSupermarketProducts } from "./Home";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(defaultSupermarketProducts[0]);
  const [selectedVariant, setSelectedVariant] = useState(
    defaultSupermarketProducts[0].variants ? defaultSupermarketProducts[0].variants[0] : "1 unit"
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products`)
      .then((res) => {
        const list = Array.isArray(res.data) && res.data.length ? res.data : defaultSupermarketProducts;
        const selected =
          list.find((item) => String(item.id) === String(id)) ||
          defaultSupermarketProducts.find((item) => String(item.id) === String(id)) ||
          defaultSupermarketProducts[0];
        setProduct(selected);
        if (selected.variants && selected.variants.length > 0) {
          setSelectedVariant(selected.variants[0]);
        }
      })
      .catch(() => {
        const fallback =
          defaultSupermarketProducts.find((item) => String(item.id) === String(id)) ||
          defaultSupermarketProducts[0];
        setProduct(fallback);
        if (fallback.variants && fallback.variants.length > 0) {
          setSelectedVariant(fallback.variants[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  function addToCart(qty = quantity, redirect = false) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const cartItemId = `${product.id}-${selectedVariant}`;
    const existing = cart.find((item) => item.cartId === cartItemId || item.id === product.id);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        ...product,
        cartId: cartItemId,
        selectedVariant: selectedVariant,
        quantity: qty
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    showToast(`Added ${qty}x ${product.name} (${selectedVariant}) to basket! 🛒`);

    if (redirect) {
      navigate("/cart");
    }
  }

  // Related recommended items
  const relatedProducts = defaultSupermarketProducts.filter(
    (p) => String(p.id) !== String(product.id)
  ).slice(0, 4);

  if (loading) {
    return (
      <main className="container">
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <h3>Loading fresh grocery details...</h3>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" className="secondary-btn" style={{ display: "inline-flex", gap: "6px" }}>
          ← Back to Supermarket
        </Link>
      </div>

      <div className="product-detail-page">
        <div className="product-detail-image-box" style={{ background: "white", padding: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {product.discount && (
            <span className="discount-ribbon" style={{ fontSize: "14px", padding: "4px 10px" }}>
              {product.discount}
            </span>
          )}
          <img
            className="product-detail-image"
            src={
              product.imageUrl ||
              "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
            }
            alt={product.name}
            style={{ objectFit: "contain", maxHeight: "360px" }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>

        <div className="product-detail-info">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="veg-icon">
              <div className="veg-dot" />
            </div>
            <span className="delivery-badge">⚡ {product.deliveryTime || "10 MINS"}</span>
            <span style={{ fontSize: "12px", color: "#8c8c8c", fontWeight: 700 }}>
              {product.brand || "fresho!"}
            </span>
          </div>

          <h1 style={{ fontSize: "28px" }}>{product.name}</h1>

          {/* Pack Size / Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div style={{ margin: "6px 0" }}>
              <label style={{ fontSize: "13px", fontWeight: 700, color: "#475569", display: "block", marginBottom: "6px" }}>
                Select Pack Size:
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {product.variants.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`category-pill ${selectedVariant === v ? "active" : ""}`}
                    onClick={() => setSelectedVariant(v)}
                    style={{ fontSize: "13px", padding: "6px 14px" }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail-price">
            ₹{Number(product.price).toFixed(2)}
            {product.originalPrice && (
              <span className="original-price" style={{ fontSize: "18px", marginLeft: "6px" }}>
                ₹{Number(product.originalPrice).toFixed(2)}
              </span>
            )}
            <span className="unit-tag">({selectedVariant})</span>
          </div>

          {product.hasSpecialOffer && (
            <div className="deal-banner" style={{ display: "inline-flex", width: "fit-content", gap: "10px", padding: "6px 14px" }}>
              <span>🏷️ Har Din Sasta! Best wholesale pricing guaranteed</span>
            </div>
          )}

          <div className="detail-features-grid">
            <div className="detail-feature-card">
              <span className="detail-feature-icon">⚡</span>
              <div>
                <div>Superfast Delivery</div>
                <small style={{ color: "#64748b" }}>10 - 15 Mins arrival</small>
              </div>
            </div>
            <div className="detail-feature-card">
              <span className="detail-feature-icon">🥦</span>
              <div>
                <div>100% Farm Sourced</div>
                <small style={{ color: "#64748b" }}>Cleaned & sorted daily</small>
              </div>
            </div>
            <div className="detail-feature-card">
              <span className="detail-feature-icon">🛡️</span>
              <div>
                <div>Hygiene Sealed</div>
                <small style={{ color: "#64748b" }}>Safe contactless packaging</small>
              </div>
            </div>
            <div className="detail-feature-card">
              <span className="detail-feature-icon">📦</span>
              <div>
                <div>Warehouse Stock</div>
                <small style={{ color: "#059669", fontWeight: 700 }}>
                  {product.stock || 50} units in stock
                </small>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "12px 0" }}>
            <span style={{ fontWeight: 600, fontSize: "14px" }}>Quantity:</span>
            <div className="cart-quantity-stepper">
              <button
                className="stepper-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="stepper-qty">{quantity}</span>
              <button
                className="stepper-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              className="primary-btn"
              style={{ flex: 1, padding: "14px" }}
              onClick={() => addToCart(quantity, false)}
            >
              🛒 Add to Basket (₹{(Number(product.price) * quantity).toFixed(2)})
            </button>
            <button
              className="secondary-btn"
              style={{ padding: "14px 20px" }}
              onClick={() => addToCart(quantity, true)}
            >
              ⚡ Instant Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Items from My Smart Basket */}
      <section className="smart-basket-section" style={{ marginTop: "40px" }}>
        <div className="smart-basket-header">
          <h2>Frequently Bought Together</h2>
          <div className="carousel-controls">
            <Link to="/" className="view-all-link">Browse All Aisles</Link>
          </div>
        </div>

        <div className="smart-grid">
          {relatedProducts.map((item) => (
            <div className="smart-card" key={item.id}>
              {item.discount && (
                <span className="discount-ribbon">{item.discount}</span>
              )}

              <div className="smart-img-wrap">
                <img
                  className="smart-img"
                  src={item.imageUrl || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";
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

              <div className="smart-price-row">
                <span className="smart-price">₹{Number(item.price).toFixed(2)}</span>
                {item.originalPrice && (
                  <span className="smart-mrp">₹{Number(item.originalPrice).toFixed(2)}</span>
                )}
              </div>

              <button
                className="add-basket-btn primary"
                onClick={() => {
                  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
                  cart.push({ ...item, quantity: 1 });
                  localStorage.setItem("cart", JSON.stringify(cart));
                  window.dispatchEvent(new Event("cart-updated"));
                  showToast(`Added ${item.name} to basket! 🛒`);
                }}
              >
                + Add to Basket
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
