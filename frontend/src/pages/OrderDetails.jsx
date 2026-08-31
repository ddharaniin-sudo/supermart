import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [countdown, setCountdown] = useState(720); // 12 minutes in seconds

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("supermarket_orders") || "[]");
    setOrders(stored);

    if (orderId) {
      const match = stored.find((o) => String(o.id) === String(orderId));
      if (match) {
        setSelectedOrder(match);
      } else if (stored.length > 0) {
        setSelectedOrder(stored[0]);
      }
    } else if (stored.length > 0) {
      setSelectedOrder(stored[0]);
    }
  }, [orderId]);

  // Live countdown timer for express delivery
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s < 10 ? "0" : ""}${s}s`;
  };

  if (!selectedOrder) {
    return (
      <main className="container">
        <div className="empty-state" style={{ margin: "60px auto", maxWidth: "520px" }}>
          <div className="empty-icon">📦</div>
          <h2>No Orders Found</h2>
          <p style={{ color: "#64748b" }}>
            You haven't placed any orders yet. Fill your basket with farm-fresh produce and get 10-minute delivery!
          </p>
          <Link to="/products" className="primary-btn" style={{ marginTop: "16px" }}>
            🥦 Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  const orderDate = selectedOrder.orderDate
    ? new Date(selectedOrder.orderDate).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      })
    : new Date().toLocaleString();

  return (
    <main className="container">
      {/* Top Banner with Back & Quick Links */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px"
        }}
      >
        <div>
          <Link to="/" className="secondary-btn" style={{ display: "inline-flex", gap: "6px", padding: "8px 14px" }}>
            ← Back to Supermarket
          </Link>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="secondary-btn"
            style={{ padding: "8px 14px" }}
            onClick={() => window.print()}
          >
            🖨️ Print Invoice
          </button>
          <button
            className="primary-btn"
            style={{ padding: "8px 16px" }}
            onClick={() => navigate("/products")}
          >
            🛍️ Shop More Items
          </button>
        </div>
      </div>

      {/* Order Tabs if multiple orders exist */}
      {orders.length > 1 && (
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "20px" }}>
          {orders.map((ord) => (
            <button
              key={ord.id}
              className={`category-pill ${selectedOrder.id === ord.id ? "active" : ""}`}
              onClick={() => {
                setSelectedOrder(ord);
                navigate(`/order/${ord.id}`);
              }}
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              📦 Order #{ord.id} (₹{ord.total})
            </button>
          ))}
        </div>
      )}

      {/* Main Order Details Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: "28px", alignItems: "start" }}>
        {/* Left Column: Live Tracking & Items */}
        <div>
          {/* Live Delivery Status Card */}
          <div
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #047857 100%)",
              color: "white",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 10px 25px rgba(6, 78, 59, 0.2)",
              marginBottom: "24px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <span className="hero-tag" style={{ background: "rgba(255,255,255,0.2)", color: "#a7f3d0" }}>
                  ⚡ EXPRESS 10-MIN DELIVERY
                </span>
                <h2 style={{ color: "white", fontSize: "26px", marginTop: "8px" }}>
                  Arriving in <span style={{ color: "#fef08a" }}>{formatTime(countdown)}</span>
                </h2>
                <p style={{ color: "#d1fae5", fontSize: "14px", marginTop: "4px" }}>
                  Estimated Arrival: <strong>{selectedOrder.arrivalEta || "Within 10-15 Mins"}</strong>
                </p>
              </div>

              <div style={{ textAlign: "right", background: "rgba(255,255,255,0.15)", padding: "12px 18px", borderRadius: "12px" }}>
                <div style={{ fontSize: "12px", color: "#d1fae5" }}>Order ID</div>
                <div style={{ fontSize: "18px", fontWeight: 800 }}>#{selectedOrder.id}</div>
                <div style={{ fontSize: "11px", color: "#a7f3d0", marginTop: "2px" }}>{orderDate}</div>
              </div>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ marginTop: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", position: "relative" }}>
                {/* Step 1 */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 800, border: "3px solid white" }}>
                    ✓
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>Order Placed</div>
                  <small style={{ fontSize: "10px", color: "#a7f3d0" }}>Confirmed</small>
                </div>

                {/* Step 2 */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#10b981", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 800, border: "3px solid white" }}>
                    ✓
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700 }}>Produce Packed</div>
                  <small style={{ fontSize: "10px", color: "#a7f3d0" }}>Quality Checked</small>
                </div>

                {/* Step 3 */}
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f59e0b", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 800, border: "3px solid white", animation: "pulse 2s infinite" }}>
                    🚴
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: "#fef08a" }}>Out for Delivery</div>
                  <small style={{ fontSize: "10px", color: "#fef08a" }}>On the way</small>
                </div>

                {/* Step 4 */}
                <div style={{ textAlign: "center", opacity: 0.6 }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontWeight: 800, border: "3px solid rgba(255,255,255,0.4)" }}>
                    🏠
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: 600 }}>Delivered</div>
                  <small style={{ fontSize: "10px" }}>At Doorstep</small>
                </div>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>🛒 Items in this Order ({selectedOrder.items?.reduce((a, b) => a + Number(b.quantity || 1), 0)} items)</span>
              <span style={{ fontSize: "13px", color: "#10b981", fontWeight: 700 }}>⚡ 10-Min Packed</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {selectedOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "14px",
                    borderBottom: idx === selectedOrder.items.length - 1 ? "none" : "1px solid #f1f5f9"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <img
                      src={item.imageUrl || FALLBACK_IMG}
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                        borderRadius: "10px",
                        background: "#f8fafc",
                        padding: "4px",
                        border: "1px solid #e2e8f0"
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "15px", color: "#1e293b" }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                        Pack: <strong>{item.selectedVariant || "Standard"}</strong> • Qty: <strong>{item.quantity}</strong>
                      </div>
                      <div style={{ fontSize: "12px", color: "#059669", fontWeight: 600, marginTop: "2px" }}>
                        ₹{Number(item.price).toFixed(2)} each
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontWeight: 800, fontSize: "16px", color: "#0f172a" }}>
                    ₹{(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Info & Price Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Delivery Details Card */}
          <div style={{ background: "white", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "14px", fontWeight: 800, color: "#1e293b" }}>
              📍 Delivery Address & Contact
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <div>
                <span style={{ color: "#64748b", fontSize: "12px", display: "block" }}>Customer Name</span>
                <strong>{selectedOrder.customerName || "Valued Customer"}</strong>
              </div>

              <div>
                <span style={{ color: "#64748b", fontSize: "12px", display: "block" }}>Address</span>
                <span style={{ color: "#334155" }}>{selectedOrder.deliveryAddress || "Apt 402, Green Valley Apartments, Gobichettipalayam"}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
                <div>
                  <span style={{ color: "#64748b", fontSize: "12px", display: "block" }}>Phone Number</span>
                  <strong>{selectedOrder.customerPhone || "+91 8825702467"}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748b", fontSize: "12px", display: "block" }}>Payment Method</span>
                  <strong style={{ color: "#059669" }}>{selectedOrder.paymentMethod || "Cash on Delivery / UPI"}</strong>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
              <a
                href="tel:8825702467"
                className="secondary-btn"
                style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "10px" }}
              >
                📞 Call Delivery Driver
              </a>
            </div>
          </div>

          {/* Payment & Invoice Summary Card */}
          <div style={{ background: "white", borderRadius: "16px", padding: "22px", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "16px", marginBottom: "14px", fontWeight: 800, color: "#1e293b" }}>
              🧾 Payment Summary
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>Items Subtotal</span>
                <span>₹{Number(selectedOrder.subtotal || selectedOrder.total).toFixed(2)}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", color: "#475569" }}>
                <span>Delivery Fee</span>
                <span>
                  {Number(selectedOrder.deliveryFee) === 0 ? (
                    <strong style={{ color: "#10b981" }}>FREE</strong>
                  ) : (
                    `₹${Number(selectedOrder.deliveryFee || 0).toFixed(2)}`
                  )}
                </span>
              </div>

              {Number(selectedOrder.discountAmount) > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981", fontWeight: 600 }}>
                  <span>Promo Discount</span>
                  <span>-₹{Number(selectedOrder.discountAmount).toFixed(2)}</span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "#0f172a",
                  paddingTop: "12px",
                  marginTop: "6px",
                  borderTop: "1px solid #e2e8f0"
                }}
              >
                <span>Total Amount Paid</span>
                <span style={{ color: "#10b981" }}>₹{Number(selectedOrder.total).toFixed(2)}</span>
              </div>
            </div>

            <button
              className="primary-btn"
              style={{ width: "100%", marginTop: "16px", padding: "12px" }}
              onClick={() => {
                showToast("Order tracking link copied to clipboard! 📋");
                navigator.clipboard?.writeText(window.location.href);
              }}
            >
              🔗 Share Tracking Link
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
