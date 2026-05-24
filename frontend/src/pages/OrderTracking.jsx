import { useParams, Link } from "react-router-dom";
import { Phone, Map as MapIcon, Package, ChevronDown, Clock, Bike } from "lucide-react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { api, API_BASE_URL } from "../utils/api";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import StatusStepper from "../components/food/StatusStepper";
import TrackingMap from "../components/maps/TrackingMap";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import Spinner from "../components/ui/Spinner";
import "./OrderTracking.css";

const isValidMongoId = (value) => /^[a-f\d]{24}$/i.test(value);

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  picked: "Picked up",
  on_the_way: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderTracking() {
  const { id } = useParams();
  const { isAuthenticated } = useAppContext();
  const [showItems, setShowItems] = useState(false);
  const [order, setOrder] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  useEffect(() => {
    if (!id || !isValidMongoId(id) || !isAuthenticated) return;

    const socketBaseUrl = import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api$/, "");
    const socket = io(socketBaseUrl, { transports: ["websocket"] });

    socket.emit("order:join", id);

    socket.on("order:locationUpdated", (payload) => {
      if (payload.tracking) setTracking(payload.tracking);
      if (payload.status) {
        setOrder((prev) => (prev ? { ...prev, status: payload.status } : prev));
      }
    });

    socket.on("order:statusUpdated", (payload) => {
      if (payload.status) {
        setOrder((prev) => (prev ? { ...prev, status: payload.status } : prev));
      }
    });

    return () => {
      socket.emit("order:leave", id);
      socket.disconnect();
    };
  }, [id, isAuthenticated]);

  const loadOrder = async () => {
    if (!isValidMongoId(id)) {
      setError("Invalid order link. Place a new order or open one from Your Orders.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [orderData, trackingData] = await Promise.all([
        api.orders.getById(id),
        api.tracking.get(id).catch(() => null),
      ]);

      setOrder(orderData.order);
      setTracking(trackingData?.tracking || orderData.order?.tracking || null);
    } catch (err) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="order-tracking">
        <Navbar />
        <div className="loading-container">
          <Spinner size="lg" />
          <p>Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-tracking">
        <Navbar />
        <div className="error-container">
          <h2>Unable to load tracking</h2>
          <p>{error}</p>
          <Link to="/orders">
            <Button size="lg">View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-tracking">
        <Navbar />
        <div className="error-container">
          <h2>Order not found</h2>
          <Link to="/orders">
            <Button size="lg">View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasRider = Boolean(order.deliveryPartner);
  const rider = hasRider
    ? {
        name: order.deliveryPartner.fullName,
        phone: order.deliveryPartner.mobile,
        avatar: order.deliveryPartner.avatar,
        rating: 4.8,
      }
    : {
        name: "Finding your rider",
        phone: "",
        avatar: "",
        rating: null,
      };

  const estimatedMins = order.estimatedDeliveryTime
    ? Math.max(0, Math.ceil((new Date(order.estimatedDeliveryTime) - new Date()) / 60000))
    : 30;

  const orderLabel = String(order._id).slice(-6).toUpperCase();
  const restaurantLocation = order.restaurant?.location;
  const statusLabel = statusLabels[order.status] || order.status;

  return (
    <div className="order-tracking">
      <Navbar />

      <div className="tracking-content">
        <header className="tracking-header">
          <div className="tracking-title-row">
            <h1 className="tracking-title">Order #{orderLabel}</h1>
            <p className="tracking-subtitle">Live updates · {order.items?.length || 0} items</p>
          </div>
          <span className="tracking-status-badge">{statusLabel}</span>
        </header>

        <div className="tracking-grid">
          <div className="tracking-left">
            <Card className="tracking-panel status-section">
              <StatusStepper currentStatus={order.status} />
              <div className="estimated-time">
                <Clock className="estimated-time-icon" size={28} strokeWidth={2.5} color="var(--primary)" />
                <div>
                  <p className="time-text">{estimatedMins} mins</p>
                  <p className="time-label">estimated arrival</p>
                </div>
              </div>
            </Card>

            <Card className="tracking-panel map-section">
              <h2 className="section-title">
                <MapIcon size={20} />
                Live Tracking
              </h2>
              <div className="map-live">
                <TrackingMap tracking={tracking} restaurantLocation={restaurantLocation} />
              </div>
            </Card>

            <Card className="tracking-panel rider-section">
              <h2 className="section-title">
                <Bike size={20} />
                Your Rider
              </h2>
              <div className={`rider-info ${!hasRider ? "rider-info--pending" : ""}`}>
                <div className="rider-avatar-wrap">
                  <Avatar
                    src={rider.avatar}
                    initials={
                      rider.name
                        ? rider.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                        : "?"
                    }
                    size="lg"
                  />
                </div>
                <div className="rider-details">
                  <h3 className="rider-name">{rider.name}</h3>
                  {rider.rating && <p className="rider-rating">⭐ {rider.rating} rating</p>}
                  {!hasRider && (
                    <p className="rider-status-hint">We&apos;ll notify you when a rider is assigned</p>
                  )}
                </div>
                {rider.phone && (
                  <a href={`tel:${rider.phone}`} className="call-button" aria-label="Call rider">
                    <Phone size={20} />
                  </a>
                )}
              </div>
            </Card>
          </div>

          <div className="tracking-right">
            <Card className="tracking-panel order-summary">
              <h2 className="section-title">
                <Package size={20} />
                Order Details
              </h2>

              <div className="restaurant-info">
                <img
                  src={order.restaurant?.image || "https://placehold.co/120x120?text=R"}
                  alt=""
                  className="restaurant-thumb"
                />
                <div>
                  <h3 className="restaurant-name">
                    {order.restaurant?.name || "SwiftEats Restaurant"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                className={`items-toggle ${showItems ? "open" : ""}`}
                onClick={() => setShowItems(!showItems)}
              >
                <span>Order Items ({order.items?.length || 0})</span>
                <ChevronDown size={18} />
              </button>

              {showItems && (
                <div className="order-items">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span key={order.pricing?.grandTotal}>₹{order.pricing?.grandTotal || 0}</span>
              </div>

              <Link to="/orders">
                <Button variant="outline" className="view-orders-button">
                  View All Orders
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
