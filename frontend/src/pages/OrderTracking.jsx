import { useParams, Link } from "react-router-dom";
import { Phone, Map as MapIcon, Package, ChevronDown, ChevronUp } from "lucide-react";
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
          <p>Loading order details...</p>
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
            <Button>View All Orders</Button>
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
          <h2>Order Not Found</h2>
          <Link to="/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const rider = order.deliveryPartner
    ? {
        name: order.deliveryPartner.fullName,
        phone: order.deliveryPartner.mobile,
        avatar: order.deliveryPartner.avatar,
        rating: 4.8,
      }
    : {
        name: "Assigning rider...",
        phone: "",
        avatar: "",
        rating: null,
      };

  const estimatedTime = order.estimatedDeliveryTime
    ? `${Math.max(0, Math.ceil((new Date(order.estimatedDeliveryTime) - new Date()) / 60000))} mins`
    : "30 mins";

  const orderLabel = String(order._id).slice(-6).toUpperCase();
  const restaurantLocation = order.restaurant?.location;

  return (
    <div className="order-tracking">
      <Navbar />

      <div className="tracking-content">
        <h1 className="tracking-title">Order #{orderLabel}</h1>

        <div className="tracking-grid">
          <div className="tracking-left">
            <div className="status-section">
              <StatusStepper currentStatus={order.status} />
              <div className="estimated-time">
                <span>⏱️</span>
                <span className="time-text">{estimatedTime} away</span>
              </div>
            </div>

            <Card className="map-section">
              <h2 className="section-title">
                <MapIcon size={20} />
                Live Tracking
              </h2>
              <div className="map-live">
                <TrackingMap tracking={tracking} restaurantLocation={restaurantLocation} />
              </div>
            </Card>

            <Card className="rider-section">
              <h2 className="section-title">Your Rider</h2>
              <div className="rider-info">
                <Avatar
                  src={rider.avatar}
                  initials={
                    rider.name
                      ? rider.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "AR"
                  }
                  size="lg"
                />
                <div className="rider-details">
                  <h3 className="rider-name">{rider.name}</h3>
                  {rider.rating && <p className="rider-rating">⭐ {rider.rating}</p>}
                </div>
                {rider.phone && (
                  <a href={`tel:${rider.phone}`} className="call-button">
                    <Phone size={18} />
                  </a>
                )}
              </div>
            </Card>
          </div>

          <div className="tracking-right">
            <Card className="order-summary">
              <h2 className="section-title">
                <Package size={20} />
                Order Details
              </h2>

              <div className="restaurant-info">
                <img
                  src={order.restaurant?.image || "https://placehold.co/600x400?text=Restaurant"}
                  alt={order.restaurant?.name}
                  className="restaurant-thumb"
                />
                <div>
                  <h3 className="restaurant-name">
                    {order.restaurant?.name || "SwiftEats Restaurant"}
                  </h3>
                </div>
              </div>

              <div className="items-toggle" onClick={() => setShowItems(!showItems)}>
                <span>Order Items ({order.items?.length || 0})</span>
                {showItems ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {showItems && (
                <div className="order-items">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="item-price">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{order.pricing?.grandTotal || order.total || 0}</span>
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
