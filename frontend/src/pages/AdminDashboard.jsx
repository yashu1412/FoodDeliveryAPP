import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";
import { Users, ShoppingBag, TrendingUp, Store, ChevronRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { user } = useAppContext();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role === "admin") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [statsRes, usersRes, ordersRes] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
        api.admin.getOrders(),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users);
      setOrders(ordersRes.orders);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <Navbar />
        <div className="dashboard-loading">
          <Spinner size="lg" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="admin-dashboard">
        <Navbar />
        <div className="dashboard-error">
          <h2>Access Denied</h2>
          <p>You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users size={24} />,
      color: "primary",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <ShoppingBag size={24} />,
      color: "success",
    },
    {
      title: "Total Revenue",
      value: `₹${stats?.totalRevenue || 0}`,
      icon: <TrendingUp size={24} />,
      color: "warning",
    },
    {
      title: "Active Restaurants",
      value: stats?.activeRestaurants || 0,
      icon: <Store size={24} />,
      color: "primary",
    },
  ];

  return (
    <div className="admin-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Admin! Manage your platform here.</p>
        </div>

        <div className="dashboard-tabs">
          {["overview", "users", "orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`dashboard-tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="overview-section">
            <div className="stats-grid">
              {statCards.map((stat, index) => (
                <Card key={index} className={`stat-card ${stat.color}`}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <h3 className="stat-title">{stat.title}</h3>
                    <p className="stat-value">{stat.value}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="users-section">
            <Card className="table-card">
              <div className="table-header">
                <h2 className="table-title">All Users</h2>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <span className="user-name">{user.fullName}</span>
                        </td>
                        <td>
                          <span className="user-email">{user.email}</span>
                        </td>
                        <td>
                          <span className={`role-badge role-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <Card className="table-card">
              <div className="table-header">
                <h2 className="table-title">All Orders</h2>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <span className="order-id">#{order._id.slice(-6)}</span>
                        </td>
                        <td>
                          <span className="customer-name">{order.user?.fullName || "N/A"}</span>
                        </td>
                        <td>
                          <span className="order-total">₹{order.pricing?.grandTotal || 0}</span>
                        </td>
                        <td>
                          <span className={`status-badge status-${order.status}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}