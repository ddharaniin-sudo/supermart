import React, { useEffect, useState } from "react";
import api from "../api";
import { showToast } from "../components/Toast";

export default function AdminDashboard() {
  const [customers, setCustomers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("customers");

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
      setMessage("Could not load admin records. Ensure the backend server is running.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <main className="container">
      <div className="dashboard-header">
        <div>
          <h2>🛡️ Supermarket Admin Console</h2>
          <p style={{ color: "#64748b" }}>
            Oversee customer accounts, seller authorizations, and platform administrators.
          </p>
        </div>
      </div>

      {message && <p className="error-message" style={{ marginBottom: "16px" }}>{message}</p>}

      {/* KPI Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap green">👤</div>
          <div className="stat-info">
            <div className="stat-value">{customers.length}</div>
            <div className="stat-label">Registered Customers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap blue">📦</div>
          <div className="stat-info">
            <div className="stat-value">{sellers.length}</div>
            <div className="stat-label">Approved Sellers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap purple">🛡️</div>
          <div className="stat-info">
            <div className="stat-value">{admins.length}</div>
            <div className="stat-label">System Admins</div>
          </div>
        </div>
      </div>

      {/* Add New Admin Section */}
      <section className="dashboard-card">
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

      {/* Tab Navigation for User Lists */}
      <div style={{ display: "flex", gap: "10px", margin: "24px 0 16px" }}>
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

      <section className="dashboard-card">
        {activeTab === "customers" && (
          <>
            <h3 style={{ marginBottom: "16px" }}>Customer Accounts</h3>
            <UserTable users={customers} role="CUSTOMER" onDelete={deleteUser} />
          </>
        )}

        {activeTab === "sellers" && (
          <>
            <h3 style={{ marginBottom: "16px" }}>Seller Accounts</h3>
            <UserTable users={sellers} role="SELLER" onDelete={deleteUser} />
          </>
        )}

        {activeTab === "admins" && (
          <>
            <h3 style={{ marginBottom: "16px" }}>Administrator Accounts</h3>
            <UserTable users={admins} role="ADMIN" />
          </>
        )}
      </section>
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
