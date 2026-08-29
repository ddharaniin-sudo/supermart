import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand" style={{ color: "white", marginBottom: "12px" }}>
            <span className="brand-icon">🛒</span>
            <span>Fresh<span style={{ color: "#34d399" }}>Mart</span></span>
          </div>
          <p>
            Your trusted neighborhood supermarket delivered to your doorstep.
            Farm-fresh produce, daily staples, organic goods, and household essentials.
          </p>
        </div>

        <div className="footer-column">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/">🍎 Fresh Fruits</Link></li>
            <li><Link to="/">🥦 Organic Vegetables</Link></li>
            <li><Link to="/">🥛 Dairy & Eggs</Link></li>
            <li><Link to="/">🍞 Bakery & Snacks</Link></li>
            <li><Link to="/">🧴 Household Essentials</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Customer Support</h4>
          <ul style={{ marginBottom: "12px" }}>
            <li>
              <a href="tel:8825702467" style={{ color: "#34d399", fontWeight: "600" }}>
                📞 +91 8825702467
              </a>
            </li>
            <li>
              <a href="mailto:dharani@gmail.com" style={{ color: "#38bdf8", wordBreak: "break-all" }}>
                ✉️ ddharani.in@gmail.com
              </a>
            </li>
            <li style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>
              📍 Gobichettipalayam, Tamil Nadu
            </li>
          </ul>
          <ul style={{ borderTop: "1px solid #1e293b", paddingTop: "8px" }}>
            <li><a href="#track">Track My Order</a></li>
            <li><a href="#returns">Refunds & Returns</a></li>
            <li><a href="#faq">FAQs & Help</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>FreshMart Promise</h4>
          <p style={{ fontSize: "13px", lineHeight: "1.6", marginBottom: "12px" }}>
            ⚡ 30-Min Express Delivery<br />
            🌱 100% Quality Guaranteed<br />
            💳 100% Safe & Secure Payments
          </p>
          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: "6px", fontSize: "12px" }}>💳 Visa / MC</span>
            <span style={{ background: "#1e293b", padding: "6px 12px", borderRadius: "6px", fontSize: "12px" }}>📱 UPI / GPay</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} FreshMart Supermarket Inc. All rights reserved.</p>
        <p style={{ color: "#64748b" }}>Contact: +91 8825702467 | dharani@gmail.com | Gobichettipalayam</p>
      </div>
    </footer>
  );
}
