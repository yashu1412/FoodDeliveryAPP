import { useParams, Link } from "react-router-dom";
import { Phone, Map as MapIcon, Package, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import StatusStepper from "../components/food/StatusStepper";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import "./OrderTracking.css";

const mockOrder = {
  _id: "1",
  restaurant: {
    name: "SwiftEats Bistro",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80",
  },
  items: [
    { name: "Paneer Tikka", quantity: 2, price: 220 },
    { name: "Butter Naan", quantity: 3, price: 50 },
  ],
  total: 590,
  status: "on_the_way",
  rider: {
    name: "Raj Kumar",
    phone: "+91 9876543210",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    rating: 4.8,
  },
  estimatedTime: "12 mins",
};

export default function OrderTracking() {
  const { id } = useParams();
  const [showItems, setShowItems] = useState(false);

  const order = mockOrder;

  return (
    <div className="order-tracking">
      <Navbar />
      
      <div className="tracking-content">
        <h1 className="tracking-title">Order #{id}</h1>

        <div className="tracking-grid">
          <div className="tracking-left">
            <div className="status-section">
              <StatusStepper currentStatus={order.status} />
              <div className="estimated-time">
                <span>⏱️</span>
                <span className="time-text">{order.estimatedTime} away</span>
              </div>
            </div>

            <Card className="map-section">
              <h2 className="section-title">
                <MapIcon size={20} />
                Live Tracking
              </h2>
              <div className="map-placeholder">
                <div className="map-content">
                  <div className="map-pin rider-pin">🛵</div>
                  <div className="map-pin destination-pin">📍</div>
                </div>
                <p className="map-text">Google Maps will appear here</p>
              </div>
            </Card>

            <Card className="rider-section">
              <h2 className="section-title">Your Rider</h2>
              <div className="rider-info">
                <Avatar src={order.rider.avatar} initials="RK" size="lg" />
                <div className="rider-details">
                  <h3 className="rider-name">{order.rider.name}</h3>
                  <p className="rider-rating">⭐ {order.rider.rating}</p>
                </div>
                <a href={`tel:${order.rider.phone}`} className="call-button">
                  <Phone size={18} />
                </a>
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
                <img src={order.restaurant.image} alt={order.restaurant.name} className="restaurant-thumb" />
                <div>
                  <h3 className="restaurant-name">{order.restaurant.name}</h3>
                </div>
              </div>

              <div className="items-toggle" onClick={() => setShowItems(!showItems)}>
                <span>Order Items ({order.items.length})</span>
                {showItems ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {showItems && (
                <div className="order-items">
                  {order.items.map((item, index) => (
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
                <span>₹{order.total}</span>
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
