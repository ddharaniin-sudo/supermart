import React, { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80";

export default function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("orders");

  async function loadData() {
    try {
      const [c, s, a] = await Promise.all([
        api.get("/admin/customers"),
        api.get("/admin/sellers"),
        api.get("/admin/admins")
      ]);
      setCustomers(Array.isArray(c.data) ? c.data : []);
      setSellers(Array.isArray(s.data) ? s.data : []);
      setAdmins(Array.isArray(a.data) ? a.data : []);
    } catch {
      setMessage("Could not load backend user records. Running with local administrative controls.");
    }
  }

  const loadOrders = () => {
    let stored = JSON.parse(localStorage.getItem("supermarket_orders") || "[]");
    if (!stored || stored.length === 0) {
      // Provide an initial sample order so the admin always has rich data
      const sample = [
        {
          id: "849201",
          orderDate: new Date(Date.now() - 3600000).toISOString(),
          estimatedDeliveryTime: "10-15 Mins",
          arrivalEta: "Within 10 Mins",
          status: "OUT_FOR_DELIVERY",
          customerName: "Priya Sharma",
          customerEmail: "priya.sharma@example.com",
          customerPhone: "+91 9840123456",
          deliveryAddress: "Flat 304, Palm Grove Towers, Gobichettipalayam",
          paymentMethod: "Cash on Delivery / UPI",
          items: [
            {
              id: 1,
              name: "Coriander Leaves Without Roots",
              price: 35,
              quantity: 2,
              selectedVariant: "250 g",
              imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=200&q=80"
            },
            {
              id: 4,
              name: "Royal Gala Apples - Crisp Sweet",
              price: 140,
              quantity: 1,
              selectedVariant: "1 kg",
              imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=200&q=80"
            },
            {
              id: 6,
              name: "Pure Farm Fresh Cow Milk",
              price: 68,
              quantity: 2,
              selectedVariant: "1 Litre",
              imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=200&q=80"
            }
          ],
          subtotal: 346,
          deliveryFee: 0,
          discountAmount: 0,
          total: 346
        }
      ];
      localStorage.setItem("supermarket_orders", JSON.stringify(sample));
      stored = sample;
    }
    setOrders(stored);
  };

  useEffect(() => {
    loadData();
    loadOrders();
    window.addEventListener("orders-updated", loadOrders);
    return () => window.removeEventListener("orders-updated", loadOrders);
  }, []);

  function updateOrderStatus(orderId, newStatus) {
    const updated = orders.map((o) =>
      String(o.id) === String(orderId) ? { ...o, status: newStatus } : o
    );
    localStorage.setItem("supermarket_orders", JSON.stringify(updated));
    setOrders(updated);
    showToast(`Order #${orderId} status updated to ${newStatus}! ⚡`);
  }

  function deleteOrder(orderId) {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) return;
    const updated = orders.filter((o) => String(o.id) !== String(orderId));
    localStorage.setItem("supermarket_orders", JSON.stringify(updated));
    setOrders(updated);
    showToast(`Order #${orderId} deleted`);
  }

  async function deleteUser(id, name) {
    if (!window.confirm(`Are you sure you want to delete user "${name || id}"?`)) return;

    try {
      await api.delete(`/admin/users/${id}`);
      showToast("User account deleted");
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed");
    }
  }

  async function addAdmin(e) {
    e.preventDefault();

    try {
      await api.post("/admin/admins", form);
      setForm({ name: "", email: "", password: "" });
      showToast("New administrator account created! 🛡️");
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not add admin");
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const totalItemsSold = orders.reduce(
    (sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + Number(i.quantity || 1), 0) : 0),
    0
  );

  return (
    <main className="container">
      <div className="dashboard-header">
        <div>
          <h2>🛡️ Supermarket Admin Console</h2>
          <p style={{ color: "#64748b" }}>
            Oversee live customer purchases, 10-minute order fulfillments, user accounts, and platform metrics.
          </p>
        </div>
      </div>

      {message && <p className="error-message" style={{ marginBottom: "16px" }}>{message}</p>}

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap green">🛒</div>
          <div className="stat-info">
            <div className="stat-value">{orders.length}</div>
            <div className="stat-label">Customer Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap green">💰</div>
          <div className="stat-info">
            <div className="stat-value">₹{totalRevenue.toFixed(2)}</div>
            <div className="stat-label">Total Gross Sales</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap blue">📦</div>
          <div className="stat-info">
            <div className="stat-value">{totalItemsSold}</div>
            <div className="stat-label">Products Dispatched</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap purple">👤</div>
          <div className="stat-info">
            <div className="stat-value">{customers.length || 1}</div>
            <div className="stat-label">Registered Customers</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation for User Lists & Orders */}
      <div style={{ display: "flex", gap: "10px", margin: "28px 0 18px", flexWrap: "wrap" }}>
        <button
          className={`category-pill ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          🛒 Customer Orders & Purchases ({orders.length})
        </button>
        <button
          className={`category-pill ${activeTab === "customers" ? "active" : ""}`}
          onClick={() => setActiveTab("customers")}
        >
          👤 Customers ({customers.length})
        </button>
        <button
          className={`category-pill ${activeTab === "sellers" ? "active" : ""}`}
          onClick={() => setActiveTab("sellers")}
        >
          📦 Sellers ({sellers.length})
        </button>
        <button
          className={`category-pill ${activeTab === "admins" ? "active" : ""}`}
          onClick={() => setActiveTab("admins")}
        >
          🛡️ Admins ({admins.length})
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <section className="dashboard-card">
          <div className="dashboard-card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>🛒 Customer Buying History & Live Orders</h3>
            <span style={{ fontSize: "13px", color: "#10b981", fontWeight: 700 }}>
              ⚡ 10-Min Supermarket Express Orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px" }}>
              <p style={{ color: "#64748b" }}>No customer orders placed yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {orders.map((ord) => {
                const dateStr = ord.orderDate
                  ? new Date(ord.orderDate).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })
                  : "Recent";

                return (
                  <div
                    key={ord.id}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "14px",
                      padding: "20px",
                      background: "#ffffff",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
                    }}
                  >
                    {/* Order Top Bar */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        paddingBottom: "14px",
                        borderBottom: "1px solid #f1f5f9",
                        flexWrap: "wrap",
                        gap: "10px"
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span style={{ fontSize: "18px", fontWeight: 800, color: "#0f172a" }}>
                            Order #{ord.id}
                          </span>
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 700,
                              padding: "3px 10px",
                              borderRadius: "999px",
                              background:
                                ord.status === "DELIVERED"
                                  ? "#dcfce7"
                                  : ord.status === "OUT_FOR_DELIVERY"
                                  ? "#fef3c7"
                                  : "#e0f2fe",
                              color:
                                ord.status === "DELIVERED"
                                  ? "#15803d"
                                  : ord.status === "OUT_FOR_DELIVERY"
                                  ? "#b45309"
                                  : "#0369a1"
                            }}
                          >
                            {ord.status || "CONFIRMED"}
                          </span>
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                          Placed on: <strong>{dateStr}</strong> • ETA: <strong>{ord.arrivalEta || "10-15 Mins"}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "20px", fontWeight: 800, color: "#10b981" }}>
                          ₹{Number(ord.total).toFixed(2)}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          Payment: <strong>{ord.paymentMethod || "Cash on Delivery"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "12px",
                        padding: "14px 0",
                        fontSize: "13px",
                        borderBottom: "1px solid #f1f5f9"
                      }}
                    >
                      <div>
                        <span style={{ color: "#64748b", display: "block" }}>Customer Details:</span>
                        <strong>👤 {ord.customerName || "Customer"}</strong> ({ord.customerEmail || "N/A"})
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block" }}>Contact Phone:</span>
                        <strong>📞 {ord.customerPhone || "+91 8825702467"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", display: "block" }}>Delivery Address:</span>
                        <span>📍 {ord.deliveryAddress || "Standard Delivery Address"}</span>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div style={{ marginTop: "14px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#334155", marginBottom: "10px" }}>
                        🛍️ Products Purchased ({ord.items?.length || 0} item types):
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "10px" }}>
                        {ord.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              padding: "8px 12px",
                              background: "#f8fafc",
                              borderRadius: "10px",
                              border: "1px solid #e2e8f0"
                            }}
                          >
                            <img
                              src={item.imageUrl || FALLBACK_IMG}
                              alt={item.name}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_IMG;
                              }}
                              style={{ width: "40px", height: "40px", objectFit: "contain", borderRadius: "6px" }}
                            />
                            <div style={{ flex: 1, fontSize: "13px" }}>
                              <div style={{ fontWeight: 700, color: "#1e293b" }}>{item.name}</div>
                              <div style={{ fontSize: "11px", color: "#64748b" }}>
                                {item.selectedVariant || "Standard"} × <strong>{item.quantity}</strong>
                              </div>
                            </div>
                            <div style={{ fontWeight: 700, fontSize: "13px" }}>
                              ₹{(Number(item.price) * Number(item.quantity || 1)).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Admin Actions */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "16px",
                        paddingTop: "12px",
                        borderTop: "1px solid #f1f5f9",
                        flexWrap: "wrap",
                        gap: "10px"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>Update Status:</span>
                        <select
                          value={ord.status || "CONFIRMED"}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          style={{
                            padding: "6px 12px",
                            fontSize: "12px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            background: "white",
                            cursor: "pointer",
                            fontWeight: 600
                          }}
                        >
                          <option value="CONFIRMED">⏳ Confirmed</option>
                          <option value="PACKED">📦 Produce Packed</option>
                          <option value="OUT_FOR_DELIVERY">🚴 Out for Delivery (10-Min)</option>
                          <option value="DELIVERED">✅ Delivered</option>
                        </select>
                      </div>

                      <button
                        className="danger-btn"
                        style={{ padding: "6px 12px", fontSize: "12px" }}
                        onClick={() => deleteOrder(ord.id)}
                      >
                        🗑️ Delete Order Record
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Customers Tab */}
      {activeTab === "customers" && (
        <section className="dashboard-card">
          <h3 style={{ marginBottom: "16px" }}>Customer Accounts</h3>
          <UserTable users={customers} role="CUSTOMER" onDelete={deleteUser} />
        </section>
      )}

      {/* Sellers Tab */}
      {activeTab === "sellers" && (
        <section className="dashboard-card">
          <h3 style={{ marginBottom: "16px" }}>Seller Accounts</h3>
          <UserTable users={sellers} role="SELLER" onDelete={deleteUser} />
        </section>
      )}

      {/* Admins Tab */}
      {activeTab === "admins" && (
        <>
          {/* Add New Admin Section */}
          <section className="dashboard-card" style={{ marginBottom: "24px" }}>
            <div className="dashboard-card-header">
              <h3>➕ Register New Admin</h3>
            </div>
            <form onSubmit={addAdmin} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", alignItems: "end" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Admin Name</label>
                <input
                  placeholder="e.g. Alex Smith"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Admin Email</label>
                <input
                  placeholder="admin2@supermarket.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Password</label>
                <input
                  placeholder="••••••••"
                  type="password"
                  minLength="6"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
              <button className="primary-btn" style={{ height: "46px" }}>
                Add Administrator
              </button>
            </form>
          </section>

          <section className="dashboard-card">
            <h3 style={{ marginBottom: "16px" }}>Administrator Accounts</h3>
            <UserTable users={admins} role="ADMIN" />
          </section>
        </>
      )}
    </main>
  );
}

function UserTable({ users, role, onDelete }) {
  if (!users || !users.length) {
    return (
      <div className="empty-state" style={{ padding: "32px" }}>
        <p style={{ color: "#64748b" }}>No users registered under this role yet.</p>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            {onDelete && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>#{user.id}</td>
              <td style={{ fontWeight: 600 }}>{user.name || "N/A"}</td>
              <td>{user.email}</td>
              <td>
                <span className={`role-pill ${role.toLowerCase()}`}>
                  {user.role || role}
                </span>
              </td>
              {onDelete && (
                <td>
                  <button
                    className="danger-btn"
                    onClick={() => onDelete(user.id, user.name || user.email)}
                  >
                    🗑️ Remove
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
