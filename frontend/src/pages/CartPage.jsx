import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../components/Toast";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80";

export default function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    phone: "+91 8825702467",
    address: "Apt 402, Green Valley Apartments, Gobichettipalayam, Tamil Nadu",
    paymentMethod: "cod"
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.name) {
      setCheckoutForm((prev) => ({
        ...prev,
        customerName: user.name
      }));
    }
  }, []);

  useEffect(() => {
    const loadCart = () =>
      setCartItems(JSON.parse(localStorage.getItem("cart") || "[]"));
    loadCart();
    window.addEventListener("cart-updated", loadCart);
    return () => window.removeEventListener("cart-updated", loadCart);
  }, []);

  function updateQuantity(id, change) {
    const updated = cartItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      )
      .filter((item) => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cart-updated"));
  }

  function removeItem(id, name) {
    const updated = cartItems.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cart-updated"));
    showToast(`Removed ${name || "item"} from cart`);
  }

  function applyCoupon(e) {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === "FRESH10") {
      setDiscountPercent(10);
      setCouponMessage("🎉 Coupon FRESH10 applied! 10% discount unlocked.");
      showToast("Coupon Applied! 10% OFF");
    } else {
      setCouponMessage("❌ Invalid coupon code. Try FRESH10");
    }
  }

  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  function handleCheckout() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      setShowLoginPrompt(true);
      showToast("Please login first to place an order! 🔐");
      return;
    }
    setIsCheckingOut(true);
  }

  function confirmOrder(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) {
      setIsCheckingOut(false);
      setShowLoginPrompt(true);
      showToast("Authentication required to place order! 🔐");
      return;
    }

    const orderId = `${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const etaDate = new Date(now.getTime() + 15 * 60000); // 15 mins
    const etaString = etaDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newOrder = {
      id: orderId,
      orderDate: now.toISOString(),
      estimatedDeliveryTime: "10-15 Mins",
      arrivalEta: `${etaString} (within 15 mins)`,
      status: "CONFIRMED",
      customerName: checkoutForm.customerName || user?.name || user?.email || "Valued Customer",
      customerEmail: user?.email || "customer@supermarket.com",
      customerPhone: checkoutForm.phone || "+91 8825702467",
      deliveryAddress: checkoutForm.address,
      paymentMethod:
        checkoutForm.paymentMethod === "cod"
          ? "Cash on Delivery / UPI upon arrival"
          : "Instant Online Payment (UPI / Card)",
      items: [...cartItems],
      subtotal,
      deliveryFee,
      discountAmount,
      total: finalTotal
    };

    // Save to supermarket_orders
    const existingOrders = JSON.parse(localStorage.getItem("supermarket_orders") || "[]");
    existingOrders.unshift(newOrder);
    localStorage.setItem("supermarket_orders", JSON.stringify(existingOrders));
    window.dispatchEvent(new Event("orders-updated"));

    // Clear cart
    localStorage.removeItem("cart");
    setCartItems([]);
    window.dispatchEvent(new Event("cart-updated"));

    showToast("🎉 Order placed successfully! Arriving in 10-15 mins.");
    setIsCheckingOut(false);

    // Redirect to separate Order Details page
    navigate(`/order/${orderId}`);
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 299 || subtotal === 0 ? 0 : 40;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <main className="container">
        <div className="empty-state" style={{ margin: "40px auto", maxWidth: "500px" }}>
          <div className="empty-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: "#64748b" }}>
            Looks like you haven't added any fresh groceries to your cart yet.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
            <Link to="/products" className="primary-btn">
              🥦 Browse Fresh Products
            </Link>
            <Link to="/orders" className="secondary-btn">
              📦 View My Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="section-header">
        <div>
          <h2>🛍️ Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)</h2>
          <p>Review items, apply promo codes, and proceed to swift 10-minute checkout</p>
        </div>
      </div>

      <div className="cart-layout">
        {/* Items List */}
        <div className="cart-items-list">
          {cartItems.map((item) => (
            <div className="cart-item-card" key={item.id}>
              <div className="cart-item-left">
                <img
                  className="cart-item-thumb"
                  src={item.imageUrl || FALLBACK_IMG}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <div style={{ fontSize: "12px", color: "#64748b" }}>
                    Pack Size: <strong>{item.selectedVariant || "Standard"}</strong>
                  </div>
                  <div className="item-unit-price">₹{item.price} each</div>
                  <div className="item-total-price">₹{item.price * item.quantity}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div className="cart-quantity-stepper">
                  <button
                    className="stepper-btn"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <span className="stepper-qty">{item.quantity}</span>
                  <button
                    className="stepper-btn"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="danger-btn"
                  onClick={() => removeItem(item.id, item.name)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="cart-summary-card">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Items Subtotal</span>
            <span>₹{subtotal}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>
              {deliveryFee === 0 ? (
                <span style={{ color: "#10b981", fontWeight: 700 }}>FREE (Above ₹299)</span>
              ) : (
                `₹${deliveryFee}`
              )}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: "#10b981", fontWeight: 600 }}>
              <span>Promo Discount (10%)</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>Estimated Total</span>
            <span>₹{finalTotal}</span>
          </div>

          <form className="coupon-input-group" onSubmit={applyCoupon}>
            <input
              type="text"
              placeholder="Promo Code (FRESH10)"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="secondary-btn" type="submit">
              Apply
            </button>
          </form>

          {couponMessage && (
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: discountPercent > 0 ? "#059669" : "#dc2626",
                marginBottom: "12px"
              }}
            >
              {couponMessage}
            </p>
          )}

          <button className="primary-btn checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout →
          </button>
        </aside>
      </div>

      {/* Login Required Modal */}
      {showLoginPrompt && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: "460px", textAlign: "center", padding: "32px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "#dcfce7",
                color: "#16a34a",
                fontSize: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px"
              }}
            >
              🔐
            </div>

            <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>Please Log In to Order</h3>
            <p style={{ color: "#64748b", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              To complete your purchase, save your delivery address, and track your 10-minute live order arrival, please log in to your account.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                className="primary-btn"
                style={{ width: "100%", padding: "12px", fontSize: "15px" }}
                onClick={() => navigate("/login?redirect=/cart")}
              >
                🔑 Log In to My Account
              </button>

              <button
                className="secondary-btn"
                style={{ width: "100%", padding: "12px", fontSize: "14px" }}
                onClick={() => navigate("/register?redirect=/cart")}
              >
                📝 Join FreshMart (New Account)
              </button>

              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "13px",
                  cursor: "pointer",
                  marginTop: "6px"
                }}
                onClick={() => setShowLoginPrompt(false)}
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckingOut && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚡ Fast 10-Min Delivery Checkout</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsCheckingOut(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={confirmOrder}>
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  placeholder="Your Full Name"
                  value={checkoutForm.customerName}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, customerName: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  placeholder="Flat / Building, Street, Area"
                  value={checkoutForm.address}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, address: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 8825702467"
                  value={checkoutForm.phone}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={checkoutForm.paymentMethod}
                  onChange={(e) =>
                    setCheckoutForm({ ...checkoutForm, paymentMethod: e.target.value })
                  }
                >
                  <option value="cod">💵 Cash on Delivery / UPI upon arrival</option>
                  <option value="online">💳 Instant Online Payment (Card / NetBanking / UPI)</option>
                </select>
              </div>

              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", margin: "16px 0", fontSize: "14px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span>⏱️ Estimated Arrival:</span>
                  <strong style={{ color: "#059669" }}>In 10-15 Minutes</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Total Payable:</span>
                  <strong style={{ fontSize: "16px" }}>₹{finalTotal}</strong>
                </div>
              </div>

              <button className="primary-btn" style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
                Confirm & Place Order (10-Min Delivery)
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
