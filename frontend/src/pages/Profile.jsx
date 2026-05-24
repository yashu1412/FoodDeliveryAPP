import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";
import { User, ShoppingBag, MapPin, Settings, LogOut } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import "./Profile.css";

export default function Profile() {
  const { user, signOut } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const data = await api.orders.getAll();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-loading">
          <Spinner size="lg" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <Navbar />
        <div className="profile-error">
          <h2>Not Logged In</h2>
          <p>Please login to view your profile.</p>
          <Link to="/login">
            <Button size="lg">Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-content">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
        </div>

        <div className="profile-tabs">
          {[
            { id: "profile", label: "Profile", icon: <User size={20} /> },
            { id: "orders", label: "Orders", icon: <ShoppingBag size={20} /> },
            { id: "addresses", label: "Addresses", icon: <MapPin size={20} /> },
            { id: "settings", label: "Settings", icon: <Settings size={20} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`profile-tab ${activeTab === tab.id ? "active" : ""}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "profile" && (
          <div className="profile-section">
            <Card className="profile-card">
              <div className="profile-info">
                <div className="profile-avatar">
                  <User size={64} />
                </div>
                <div className="profile-details">
                  <h2 className="profile-name">{user.fullName}</h2>
                  <p className="profile-email">{user.email}</p>
                  <p className="profile-phone">{user.mobile}</p>
                </div>
              </div>
              <div className="profile-actions">
                <Button variant="outline">Edit Profile</Button>
                <Button variant="danger" onClick={handleSignOut}>
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-section">
            <Card className="orders-card">
              <div className="orders-header">
                <h2 className="orders-title">My Orders</h2>
              </div>
              {orders.length === 0 ? (
                <div className="no-orders">
                  <ShoppingBag size={48} className="no-orders-icon" />
                  <p>No orders yet</p>
                  <Link to="/">
                    <Button>Browse Restaurants</Button>
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <h3 className="order-id">Order #{order._id.slice(-6)}</h3>
                        <p className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="order-total">Total: ₹{order.pricing?.grandTotal || 0}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge status-${order.status}`}>
                          {order.status}
                        </span>
                        <Link to={`/tracking/${order._id}`}>
                          <Button variant="outline" size="sm">
                            Track Order
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "addresses" && (
          <div className="addresses-section">
            <Card className="addresses-card">
              <div className="addresses-header">
                <h2 className="addresses-title">My Addresses</h2>
                <Button>Add Address</Button>
              </div>
              <div className="no-addresses">
                <MapPin size={48} className="no-addresses-icon" />
                <p>No addresses saved yet</p>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="settings-section">
            <Card className="settings-card">
              <div className="settings-header">
                <h2 className="settings-title">Settings</h2>
              </div>
              <div className="settings-list">
                <div className="setting-item">
                  <h3 className="setting-label">Notifications</h3>
                  <p className="setting-desc">Manage your notification preferences</p>
                </div>
                <div className="setting-item">
                  <h3 className="setting-label">Payment Methods</h3>
                  <p className="setting-desc">Add or remove payment methods</p>
                </div>
                <div className="setting-item">
                  <h3 className="setting-label">Privacy</h3>
                  <p className="setting-desc">Manage your privacy settings</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}