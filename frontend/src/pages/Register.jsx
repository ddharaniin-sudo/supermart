import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { showToast } from "../components/Toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      showToast("🎉 Customer account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const getPasswordStrength = () => {
    if (!form.password) return { label: "", color: "" };
    if (form.password.length < 6) return { label: "Weak (minimum 6 chars)", color: "#ef4444" };
    if (form.password.length < 10) return { label: "Moderate", color: "#f59e0b" };
    return { label: "Strong & Secure", color: "#10b981" };
  };

  const strength = getPasswordStrength();

  return (
    <main className="auth-page">
      <div className="auth-card-wrapper">
        {/* Left Visual / Promo Banner */}
        <div className="auth-banner-side">
          <div className="auth-banner-content">
            <div className="hero-tag" style={{ background: "rgba(255,255,255,0.2)", color: "#a7f3d0" }}>
              ✨ JOIN THE FRESH MART CLUB
            </div>
            <h2>Unlock Farm-Fresh Perks & Instant Delivery</h2>
            <p>
              Create your customer account today and join thousands of happy families enjoying premium daily groceries.
            </p>

            <ul className="auth-perks">
              <li className="auth-perk-item">
                <span>🎁</span>
                <span><strong>Instant ₹50 voucher</strong> on your first grocery basket</span>
              </li>
              <li className="auth-perk-item">
                <span>⚡</span>
                <span><strong>Free 30-min express</strong> delivery on orders over ₹299</span>
              </li>
              <li className="auth-perk-item">
                <span>🥦</span>
                <span><strong>100% Quality guarantee</strong> or instant refund replacement</span>
              </li>
            </ul>
          </div>

          <div style={{ fontSize: "12px", color: "#a7f3d0", marginTop: "24px" }}>
            🌱 Supporting 200+ local organic farmers & sellers
          </div>
        </div>

        {/* Right Form Side */}
        <div className="auth-form-side">
          <div style={{ marginBottom: "20px" }}>
            <h2>Create Account</h2>
            <p className="auth-sub">Join FreshMart in less than a minute</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

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
                <label>Create Password</label>
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
                placeholder="At least 6 characters"
                minLength="6"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              {strength.label && (
                <div style={{ fontSize: "12px", color: strength.color, marginTop: "4px", fontWeight: 600 }}>
                  Password Strength: {strength.label}
                </div>
              )}
            </div>

            {message && <p className="error-message" style={{ marginBottom: "12px" }}>{message}</p>}

            <button className="primary-btn" style={{ width: "100%", padding: "12px", marginTop: "8px" }} disabled={loading}>
              {loading ? "Creating your account..." : "Join FreshMart Now →"}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#10b981", fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
