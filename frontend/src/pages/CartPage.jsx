import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../components/Toast";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  function handleCheckout() {
    setIsCheckingOut(true);
  }

  function confirmOrder(e) {
    e.preventDefault();
    setOrderPlaced(true);
    localStorage.removeItem("cart");
    setCartItems([]);
    window.dispatchEvent(new Event("cart-updated"));
    showToast("🎉 Order placed successfully! Arriving in 30 mins.");
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal > 299 || subtotal === 0 ? 0 : 40;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount + deliveryFee;

  if (orderPlaced) {
    return (
      <main className="container">
        <div className="empty-state" style={{ maxWidth: "560px", margin: "40px auto" }}>
          <div className="empty-icon" style={{ background: "#dcfce7", color: "#16a34a" }}>
            🎉
          </div>
          <h2>Order Confirmed!</h2>
          <p style={{ color: "#475569", lineHeight: "1.6" }}>
            Thank you for shopping with <strong>FreshMart</strong>! Your groceries are being packed
            with love and will arrive at your doorstep in under <strong>30 minutes</strong>.
          </p>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", width: "100%", textAlign: "left", fontSize: "14px", border: "1px solid #e2e8f0" }}>
            <div>📦 <strong>Order ID:</strong> #FM-{Math.floor(100000 + Math.random() * 900000)}</div>
            <div style={{ marginTop: "4px" }}>💳 <strong>Payment Mode:</strong> Cash on Delivery / UPI</div>
            <div style={{ marginTop: "4px" }}>⏱️ <strong>Estimated Arrival:</strong> 25-30 Mins</div>
          </div>
          <Link to="/" className="primary-btn" style={{ marginTop: "12px" }}>
            🛍️ Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="container">
        <div className="empty-state" style={{ margin: "40px auto", maxWidth: "500px" }}>
          <div className="empty-icon">🛒</div>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: "#64748b" }}>
            Looks like you haven't added any fresh groceries to your cart yet.
          </p>
          <Link to="/" className="primary-btn">
            🥦 Browse Fresh Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="section-header">
        <div>
          <h2>🛍️ Shopping Cart ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)</h2>
          <p>Review items, apply promo codes, and proceed to swift checkout</p>
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
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={item.name}
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
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

      {/* Checkout Modal */}
      {isCheckingOut && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>⚡ Fast Delivery Checkout</h3>
              <button
                className="modal-close-btn"
                onClick={() => setIsCheckingOut(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={confirmOrder}>
              <div className="form-group">
                <label>Delivery Address</label>
                <input
                  placeholder="Flat / Building, Street, Area"
                  defaultValue="Apt 402, Green Valley Apartments, Mumbai"
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  defaultValue="+91 9876543210"
                  required
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select defaultValue="cod">
                  <option value="cod">💵 Cash on Delivery / UPI upon arrival</option>
                  <option value="online">💳 Instant Online Payment (Card / NetBanking)</option>
                </select>
              </div>

              <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "8px", margin: "16px 0", fontSize: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Total Payable:</span>
                  <strong>₹{finalTotal}</strong>
                </div>
              </div>

              <button className="primary-btn" style={{ width: "100%", padding: "12px" }}>
                Confirm & Place Order (30-Min Delivery)
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
