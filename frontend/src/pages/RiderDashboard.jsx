import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";
import { Wallet, Clock, Package, MapPin } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import "./RiderDashboard.css";

export default function RiderDashboard() {
  const { user } = useAppContext();
  const [isAvailable, setIsAvailable] = useState(true);
  const [earnings, setEarnings] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "deliveryBoy") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      const [earningsRes, ordersRes] = await Promise.all([
        api.riders.getEarnings(),
        api.orders.getAll(),
      ]);
      setEarnings(earningsRes);
      setOrders(ordersRes.orders.filter(order => order.deliveryPartner?._id === user._id || order.deliveryPartner === user._id));
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      await api.riders.toggleAvailability(!isAvailable);
      setIsAvailable(!isAvailable);
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="rider-dashboard">
        <Navbar />
        <div className="dashboard-loading">
          <Spinner size="lg" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== "deliveryBoy") {
    return (
      <div className="rider-dashboard">
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
      title: "Total Earnings",
      value: `₹${earnings?.total || 0}`,
      icon: <Wallet size={24} />,
      color: "primary",
    },
    {
      title: "Pending",
      value: `₹${earnings?.pending || 0}`,
      icon: <Clock size={24} />,
      color: "warning",
    },
    {
      title: "Deliveries",
      value: earnings?.history?.length || 0,
      icon: <Package size={24} />,
      color: "success",
    },
  ];

  return (
    <div className="rider-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Rider Dashboard</h1>
            <p className="dashboard-subtitle">
              Welcome back, {user?.fullName}
            </p>
          </div>
          <button
            onClick={toggleAvailability}
            className={`status-toggle ${isAvailable ? "online" : "offline"}`}
          >
            {isAvailable ? "Online" : "Offline"}
          </button>
        </div>

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

        <Card className="deliveries-card">
          <div className="deliveries-header">
            <h2 className="deliveries-title">Recent Deliveries</h2>
          </div>
          {orders.length === 0 ? (
            <div className="no-deliveries">
              <Package size={48} className="no-deliveries-icon" />
              <p>No deliveries yet</p>
            </div>
          ) : (
            <div className="deliveries-list">
              {orders.map((order) => (
                <div key={order._id} className="delivery-item">
                  <div className="delivery-info">
                    <div className="delivery-icon">
                      <MapPin size={20} />
                    </div>
                    <div className="delivery-details">
                      <p className="delivery-id">Order #{order._id.slice(-6)}</p>
                      <p className="delivery-total">Total: ₹{order.pricing?.grandTotal || 0}</p>
                    </div>
                  </div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}