import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, RefreshCw, MapPin } from "lucide-react";
import { api } from "../utils/api";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import "./OrderHistory.css";

const statusConfig = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "primary", label: "Confirmed" },
  preparing: { variant: "primary", label: "Preparing" },
  picked: { variant: "info", label: "Picked Up" },
  on_the_way: { variant: "info", label: "On the Way" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "danger", label: "Cancelled" },
};

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "picked", "on_the_way"];

export default function OrderHistory() {
  const { isAuthenticated } = useAppContext();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        <div className="history-content" style={{ textAlign: "center", padding: "4rem" }}>
          <Spinner size="lg" />
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="order-history">
        <Navbar />
        <div className="history-content" style={{ textAlign: "center", padding: "4rem" }}>
          <h2>Sign in to view your orders</h2>
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
        <h1 className="history-title">Your Orders</h1>
        {error && <p className="history-error">{error}</p>}

        <div className="tabs">
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Orders
            {activeOrders.length > 0 && <span className="tab-count">{activeOrders.length}</span>}
          </button>
          <button
            className={`tab ${activeTab === "past" ? "active" : ""}`}
            onClick={() => setActiveTab("past")}
          >
            Past Orders
          </button>
        </div>

        <div className="orders-list">
          {displayedOrders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h2 className="empty-title">No orders yet</h2>
              <p className="empty-text">Your delicious food journey starts here!</p>
              <Link to="/">
                <Button size="lg">Browse Restaurants</Button>
              </Link>
            </div>
          ) : (
            displayedOrders.map((order) => (
              <Card key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-restaurant">
                    <img
                      src={order.restaurant?.image}
                      alt={order.restaurant?.name}
                      className="restaurant-thumb"
                    />
                    <div>
                      <h3 className="restaurant-name">{order.restaurant?.name}</h3>
                      <p className="order-date">
                        <Clock size={14} />
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={statusConfig[order.status]?.variant || "primary"}
                    className="order-status"
                  >
                    {statusConfig[order.status]?.label || order.status}
                  </Badge>
                </div>

                <div className="order-items-summary">
                  {order.items.map((item, index) => (
                    <span key={index} className="item-summary">
                      {item.quantity}x {item.name}
                      {index < order.items.length - 1 && ", "}
                    </span>
                  ))}
                </div>

                <div className="order-footer">
                  <p className="order-total">
                    <strong>Total: ₹{order.pricing?.grandTotal || 0}</strong>
                  </p>
                  <div className="order-actions">
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        <RefreshCw size={16} />
                        Re-order
                      </Button>
                    )}
                    {ACTIVE_STATUSES.includes(order.status) && (
                      <Link to={`/orders/${order._id}/track`}>
                        <Button size="sm">
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
