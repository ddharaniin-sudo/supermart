import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { showToast } from "../components/Toast";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("user-updated"));
      showToast(`Welcome back, ${user.name || user.email}! 👋`);

      const redirectParam = new URLSearchParams(window.location.search).get("redirect");

      if (redirectParam) {
        navigate(redirectParam);
      } else if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "SELLER") {
        navigate("/seller");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(role) {
    if (role === "admin") {
      setForm({ email: "admin@supermarket.com", password: "Admin@123" });
    } else if (role === "seller") {
      setForm({ email: "seller@supermarket.com", password: "Seller@123" });
    } else {
      setForm({ email: "customer@freshmart.com", password: "Customer@123" });
    }
    setMessage("");
  }

  return (
    <main className="auth-page">
      <div className="auth-card-wrapper">
        {/* Left Visual / Promo Banner */}
        <div className="auth-banner-side">
          <div className="auth-banner-content">
            <div className="hero-tag" style={{ background: "rgba(255,255,255,0.2)", color: "#a7f3d0" }}>
              🛒 FRESHMART MEMBERSHIP
            </div>
            <h2>Welcome to Your Fresh Grocery Hub</h2>
            <p>
              Log in to manage orders, explore daily fresh arrivals, or access your seller & admin dashboards.
            </p>

            <ul className="auth-perks">
              <li className="auth-perk-item">
                <span>⚡</span>
                <span>30-minute doorstep express delivery</span>
              </li>
              <li className="auth-perk-item">
                <span>🥑</span>
                <span>100% farm-sourced organic produce</span>
              </li>
              <li className="auth-perk-item">
                <span>🏷️</span>
                <span>Exclusive member discounts & cashback</span>
              </li>
            </ul>
          </div>

          <div style={{ fontSize: "12px", color: "#a7f3d0", marginTop: "24px" }}>
            🔒 Safe & encrypted authentication
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <div style={{ marginBottom: "20px" }}>
            <h2>Sign In</h2>
            <p className="auth-sub">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label>Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: "none", border: "none", color: "#10b981", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {message && <p className="error-message" style={{ marginBottom: "12px" }}>{message}</p>}

            <button className="primary-btn" style={{ width: "100%", padding: "12px", marginTop: "4px" }} disabled={loading}>
              {loading ? "Authenticating..." : "Sign In to FreshMart →"}
            </button>
          </form>

          {/* 1-Click Demo Accounts */}
          <div className="quick-demo-box">
            <p className="demo-title">⚡ 1-Click Demo Test Accounts</p>
            <div className="demo-buttons-row">
              <button type="button" className="demo-fill-btn" onClick={() => fillDemo("admin")}>
                🛡️ Admin
              </button>
              <button type="button" className="demo-fill-btn" onClick={() => fillDemo("seller")}>
                📦 Seller
              </button>
              <button type="button" className="demo-fill-btn" onClick={() => fillDemo("customer")}>
                👤 Customer
              </button>
            </div>
          </div>

          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#10b981", fontWeight: 700 }}>
              Join FreshMart Free
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
