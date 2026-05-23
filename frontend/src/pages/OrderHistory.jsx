import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, RefreshCw, MapPin } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import "./OrderHistory.css";

const mockOrders = [
  {
    _id: "1",
    restaurant: {
      name: "Vingo Bistro",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80",
    },
    items: [
      { name: "Paneer Tikka", quantity: 2 },
      { name: "Butter Naan", quantity: 3 },
    ],
    total: 590,
    status: "on_the_way",
    date: "2024-01-15T18:30:00Z",
  },
  {
    _id: "2",
    restaurant: {
      name: "Pizza Palace",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80",
    },
    items: [
      { name: "Margherita Pizza", quantity: 1 },
    ],
    total: 350,
    status: "delivered",
    date: "2024-01-12T19:45:00Z",
  },
  {
    _id: "3",
    restaurant: {
      name: "Vingo Bistro",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&q=80",
    },
    items: [
      { name: "Chicken Biryani", quantity: 1 },
    ],
    total: 380,
    status: "cancelled",
    date: "2024-01-10T20:15:00Z",
  },
];

const statusConfig = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "primary", label: "Confirmed" },
  preparing: { variant: "primary", label: "Preparing" },
  picked: { variant: "info", label: "Picked Up" },
  on_the_way: { variant: "info", label: "On the Way" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "danger", label: "Cancelled" },
};

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("active");

  const activeOrders = mockOrders.filter((o) =>
    ["pending", "confirmed", "preparing", "picked", "on_the_way"].includes(o.status)
  );
  const pastOrders = mockOrders.filter((o) =>
    ["delivered", "cancelled"].includes(o.status)
  );

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

  return (
    <div className="order-history">
      <Navbar />
      
      <div className="history-content">
        <h1 className="history-title">Your Orders</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "active" ? "active" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            Active Orders
            {activeOrders.length > 0 && (
              <span className="tab-count">{activeOrders.length}</span>
            )}
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
                      src={order.restaurant.image}
                      alt={order.restaurant.name}
                      className="restaurant-thumb"
                    />
                    <div>
                      <h3 className="restaurant-name">{order.restaurant.name}</h3>
                      <p className="order-date">
                        <Clock size={14} />
                        {formatDate(order.date)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={statusConfig[order.status].variant}
                    className="order-status"
                  >
                    {statusConfig[order.status].label}
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
                    <strong>Total: ₹{order.total}</strong>
                  </p>
                  <div className="order-actions">
                    {order.status === "delivered" && (
                      <Button variant="outline" size="sm">
                        <RefreshCw size={16} />
                        Re-order
                      </Button>
                    )}
                    {["pending", "confirmed", "preparing", "picked", "on_the_way"].includes(
                      order.status
                    ) && (
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
