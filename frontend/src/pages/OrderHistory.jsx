import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, RefreshCw, MapPin, Package } from "lucide-react";
import { api } from "../utils/api";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import "./OrderHistory.css";

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  picked: "Picked Up",
  on_the_way: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "picked", "on_the_way"];

export default function OrderHistory() {
  const { isAuthenticated } = useAppContext();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabKey, setTabKey] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.orders.getAll();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setTabKey((k) => k + 1);
  };

  const activeOrders = orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
  const pastOrders = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));
  const displayedOrders = activeTab === "active" ? activeOrders : pastOrders;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="order-history">
        <Navbar />
        <div className="history-state">
          <Spinner size="lg" />
          <p className="history-loading-text">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="order-history">
        <Navbar />
        <div className="history-state">
          <h2>Sign in to view orders</h2>
          <p>Track active deliveries and order history from your account.</p>
          <Link to="/login">
            <Button size="lg">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history">
      <Navbar />

      <div className="history-content">
        <header className="history-header">
          <h1 className="history-title">Your Orders</h1>
          <p className="history-subtitle">
            {orders.length} total · {activeOrders.length} active
          </p>
        </header>

        {error && <p className="history-error">{error}</p>}

        <div className="tabs">
          <button
            type="button"
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => handleTabChange("active")}
          >
            Active Orders
            {activeOrders.length > 0 && <span className="tab-count">{activeOrders.length}</span>}
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "past" ? "active" : ""}`}
            onClick={() => handleTabChange("past")}
          >
            Past Orders
            {pastOrders.length > 0 && <span className="tab-count">{pastOrders.length}</span>}
          </button>
        </div>

        <div className={`orders-list ${tabKey ? "orders-list--switching" : ""}`} key={tabKey}>
          {displayedOrders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon-wrap">
                <Package size={40} strokeWidth={1.5} color="var(--primary)" />
              </div>
              <h2 className="empty-title">
                {activeTab === "active" ? "No active orders" : "No past orders"}
              </h2>
              <p className="empty-text">
                {activeTab === "active"
                  ? "When you place an order, it will show up here for live tracking."
                  : "Completed and cancelled orders appear here."}
              </p>
              <Link to="/">
                <Button size="lg">Browse Restaurants</Button>
              </Link>
            </div>
          ) : (
            displayedOrders.map((order, index) => (
              <Card
                key={order._id}
                className="order-card"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className="order-card-top">
                  <div className="order-header">
                    <div className="order-restaurant">
                      <div className="order-thumb-wrap">
                        <img
                          src={
                            order.restaurant?.image ||
                            "https://placehold.co/144x144?text=R"
                          }
                          alt=""
                          className="restaurant-thumb"
                        />
                      </div>
                      <div>
                        <h3 className="restaurant-name">
                          {order.restaurant?.name || "Restaurant"}
                        </h3>
                        <div className="order-meta">
                          <span>
                            <Clock size={13} />
                            {formatDate(order.createdAt)}
                          </span>
                          <span className="order-id">#{String(order._id).slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`order-status-pill ${order.status}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-summary">
                    {order.items.map((item, idx) => (
                      <span key={idx} className="item-chip">
                        {item.quantity}× {item.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="order-card-footer">
                  <div>
                    <p className="order-total-label">Total</p>
                    <p className="order-total-value">₹{order.pricing?.grandTotal || 0}</p>
                  </div>
                  <div className="order-actions">
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm" className="reorder-button" type="button">
                        <RefreshCw size={16} />
                        Re-order
                      </Button>
                    )}
                    {ACTIVE_STATUSES.includes(order.status) && (
                      <Link to={`/orders/${order._id}/track`}>
                        <Button size="sm" className="track-button">
                          <MapPin size={16} />
                          Track
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
