import React, { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";

const emptyForm = {
  name: "",
  category: "Fruits",
  price: "",
  stock: "",
  imageUrl: ""
};

const categoryOptions = ["Fruits", "Vegetables", "Dairy", "Bakery", "Snacks", "Beverages", "Household"];

export default function SellerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadProducts() {
    if (!user?.email) return;
    try {
      const res = await api.get("/seller/products", {
        params: { sellerEmail: user.email }
      });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMessage("Could not load products. Ensure the backend server is running.");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const body = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        sellerEmail: user.email
      };

      if (editingId) {
        await api.put(`/seller/products/${editingId}`, body);
        showToast("Product updated successfully! ✨");
      } else {
        await api.post("/seller/products", body);
        showToast("New product added to inventory! 📦");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id, name) {
    if (!window.confirm(`Delete "${name || "this product"}"?`)) return;
    try {
      await api.delete(`/seller/products/${id}`);
      showToast("Product deleted from catalogue");
      await loadProducts();
    } catch {
      showToast("Failed to delete product", "error");
    }
  }

  function edit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category || "Fruits",
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl || ""
    });
    window.scrollTo({ top: 180, behavior: "smooth" });
  }

  // Calculated Stats
  const totalStock = products.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);
  const totalValue = products.reduce((acc, p) => acc + (Number(p.price) || 0) * (Number(p.stock) || 0), 0);

  return (
    <main className="container">
      <div className="dashboard-header">
        <div>
          <h2>📦 Seller Inventory Hub</h2>
          <p style={{ color: "#64748b" }}>Logged in as: <strong>{user?.email || "Seller"}</strong></p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap green">📦</div>
          <div className="stat-info">
            <div className="stat-value">{products.length}</div>
            <div className="stat-label">Active Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap blue">📊</div>
          <div className="stat-info">
            <div className="stat-value">{totalStock} units</div>
            <div className="stat-label">Total Stock in Warehouse</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap amber">💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{totalValue.toLocaleString()}</div>
            <div className="stat-label">Estimated Catalogue Value</div>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <section className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>{editingId ? "✏️ Edit Product Details" : "➕ Add New Supermarket Product"}</h3>
          {editingId && (
            <button
              className="small-btn"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {message && <p className="error-message" style={{ marginBottom: "12px" }}>{message}</p>}

        <form onSubmit={submit}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div className="form-group">
              <label>Product Name</label>
              <input
                placeholder="e.g. Organic Red Apples"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Selling Price (₹)</label>
              <input
                placeholder="0.00"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Units Available</label>
              <input
                placeholder="0"
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              placeholder="https://images.unsplash.com/..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </div>

          {form.imageUrl && (
            <div style={{ marginBottom: "16px" }}>
              <small style={{ color: "#64748b", display: "block", marginBottom: "4px" }}>Image Preview:</small>
              <img
                src={form.imageUrl}
                alt="Preview"
                style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
            </div>
          )}

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button className="primary-btn" disabled={loading}>
              {editingId ? "Save Changes" : "Publish to Store"}
            </button>
            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* Current Products */}
      <div className="section-header" style={{ marginTop: "32px" }}>
        <div>
          <h3>🏪 Your Listed Products ({products.length})</h3>
          <p>Manage pricing, stock inventory, and catalogue items</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products added yet</h3>
          <p style={{ color: "#64748b" }}>Use the form above to add your first grocery product.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-card-img-wrap">
                <img
                  className="product-card-img"
                  src={
                    product.imageUrl ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={product.name}
                />
              </div>

              <div className="product-card-body">
                <div className="product-meta-row">
                  <span className="product-category-tag">{product.category || "Grocery"}</span>
                  <span className="stock-indicator">
                    <span className="stock-dot" />
                    {product.stock} in stock
                  </span>
                </div>

                <h3 className="product-title">{product.name}</h3>

                <div className="product-price-row">
                  <span className="current-price">₹{product.price}</span>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                  <button
                    className="secondary-btn"
                    style={{ flex: 1, padding: "8px" }}
                    onClick={() => edit(product)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="danger-btn"
                    style={{ padding: "8px 12px" }}
                    onClick={() => remove(product.id, product.name)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
