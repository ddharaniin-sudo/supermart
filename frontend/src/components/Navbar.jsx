import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function getCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  return cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [cartCount, setCartCount] = useState(0);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const count = getCartCount();
      setCartCount(count);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 500);
    };

    updateCartCount();
    window.addEventListener("cart-updated", updateCartCount);
    return () => window.removeEventListener("cart-updated", updateCartCount);
  }, []);

  function logout() {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("user-updated"));
    navigate("/");
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-content">
          <div>
            <span className="top-bar-badge">OFFER</span>
            ⚡ Free 10-Min Express Delivery on orders over ₹299 | Use Code: <strong>FRESH10</strong>
          </div>
          <div className="top-bar-links">
            <span>📍 Gobichettipalayam, Tamil Nadu</span>
            <a href="tel:8825702467" style={{ color: "inherit", textDecoration: "none" }}>📞 +91 8825702467</a>
            <a href="mailto:ddharani.in@gmail.com" style={{ color: "inherit", textDecoration: "none" }}>✉️ ddharani.in@gmail.com</a>
          </div>
        </div>
      </div>

      <header className="navbar-wrap">
        <nav className="navbar">
          <Link className="brand" to="/">
            <div className="brand-icon">🛒</div>
            <div>Fresh<span className="highlight">Mart</span></div>
          </Link>

          <div className="nav-links">
            <Link
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              to="/"
            >
              🏠 Home
            </Link>

            <Link
              className={`nav-link ${location.pathname === "/products" ? "active" : ""}`}
              to="/products"
            >
              🥦 All Products
            </Link>

            <Link className="nav-cart-btn" to="/cart">
              <span>🛍️ Basket</span>
              <span className={`cart-badge ${bouncing ? "bounce" : ""}`}>
                {cartCount}
              </span>
            </Link>

            {!user ? (
              <>
                <Link className="nav-link" to="/login">
                  🔑 Login
                </Link>
                <Link className="primary-btn" to="/register" style={{ padding: "8px 16px" }}>
                  Join FreshMart
                </Link>
              </>
            ) : (
              <>
                {user.role === "ADMIN" && (
                  <Link className="nav-link" to="/admin">
                    🛡️ Admin Panel
                  </Link>
                )}
                {user.role === "SELLER" && (
                  <Link className="nav-link" to="/seller">
                    📦 Seller Hub
                  </Link>
                )}

                <div className="user-badge">
                  <div className="user-avatar">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span>{user.name || user.email}</span>
                  <span className={`role-pill ${user.role ? user.role.toLowerCase() : "customer"}`}>
                    {user.role || "CUSTOMER"}
                  </span>
                </div>

                <button className="small-btn" onClick={logout} title="Sign Out">
                  🚪 Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
