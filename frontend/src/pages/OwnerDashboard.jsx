import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";
import { ShoppingBag, Utensils, FolderOpen, Star, Clock } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import "./OwnerDashboard.css";

export default function OwnerDashboard() {
  const { user } = useAppContext();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (user?.role === "owner") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [restaurantRes, ordersRes] = await Promise.all([
        api.restaurants.getMyRestaurant(),
        api.orders.getAll(),
      ]);
      setRestaurant(restaurantRes.restaurant);
      if (restaurantRes.restaurant) {
        const [menuRes, categoriesRes] = await Promise.all([
          api.menu.getByRestaurant(restaurantRes.restaurant._id),
          api.categories.getByRestaurant(restaurantRes.restaurant._id),
        ]);
        setMenuItems(menuRes.items);
        setCategories(categoriesRes.categories);
      }
      setOrders(ordersRes.orders);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOpen = async () => {
    try {
      await api.restaurants.toggleOpen();
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="owner-dashboard">
        <Navbar />
        <div className="dashboard-loading">
          <Spinner size="lg" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "owner") {
    return (
      <div className="owner-dashboard">
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
      title: "Total Orders",
      value: orders.length,
      icon: <ShoppingBag size={24} />,
      color: "primary",
    },
    {
      title: "Menu Items",
      value: menuItems.length,
      icon: <Utensils size={24} />,
      color: "success",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: <FolderOpen size={24} />,
      color: "warning",
    },
    {
      title: "Rating",
      value: `${restaurant?.rating || 0}/5`,
      icon: <Star size={24} />,
      color: "primary",
    },
  ];

  return (
    <div className="owner-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Owner Dashboard</h1>
            <p className="dashboard-subtitle">
              Manage your restaurant: {restaurant?.name}
            </p>
          </div>
          <button
            onClick={toggleOpen}
            className={`status-toggle ${restaurant?.isOpen ? "open" : "closed"}`}
          >
            {restaurant?.isOpen ? "Open" : "Closed"}
          </button>
        </div>

        <div className="dashboard-tabs">
          {["overview", "orders", "menu", "categories"].map((tab) => (
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

        {activeTab === "orders" && (
          <div className="orders-section">
            <Card className="table-card">
              <div className="table-header">
                <h2 className="table-title">Orders</h2>
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

        {activeTab === "menu" && (
          <div className="menu-section">
            <Card className="menu-card">
              <div className="menu-header">
                <h2 className="menu-title">Menu Items</h2>
              </div>
              <div className="menu-grid">
                {menuItems.map((item) => (
                  <div key={item._id} className="menu-item-card">
                    <div className="menu-item-info">
                      <h3 className="menu-item-name">{item.name}</h3>
                      <p className="menu-item-desc">{item.description}</p>
                      <p className="menu-item-price">₹{item.price}</p>
                      <p className={`menu-item-status ${item.isAvailable ? "available" : "unavailable"}`}>
                        {item.isAvailable ? "Available" : "Out of Stock"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="categories-section">
            <Card className="categories-card">
              <div className="categories-header">
                <h2 className="categories-title">Categories</h2>
              </div>
              <div className="categories-grid">
                {categories.map((category) => (
                  <div key={category._id} className="category-card">
                    <h3 className="category-name">{category.name}</h3>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}