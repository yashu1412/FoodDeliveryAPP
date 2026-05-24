import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MapPin, CreditCard, Wallet, ArrowRight, LocateFixed } from "lucide-react";
import { api } from "../utils/api";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, deliveryLocation } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cart, setCart] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    line1: "",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    loadCart();
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setAddress((prev) => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        phone: user.mobile || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    if (!deliveryLocation) return;

    setAddress((prev) => ({
      ...prev,
      line1: deliveryLocation.fullAddress || prev.line1,
      city: deliveryLocation.city || prev.city,
      state: deliveryLocation.state || prev.state,
      pincode: deliveryLocation.pincode || prev.pincode,
    }));
  }, [deliveryLocation]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await api.cart.get();
      if (!data.cart?.items?.length) {
        setCart(null);
        return;
      }
      setCart(data.cart);
      setRestaurant(data.restaurant);
      setPricing(data.pricing);
    } catch (err) {
      setError(err.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = pricing?.itemsTotal ?? 0;
  const deliveryFee = pricing?.deliveryFee ?? 0;
  const tax = pricing?.taxAmount ?? 0;
  const total = pricing?.grandTotal ?? 0;

  const handlePlaceOrder = async () => {
    if (paymentMethod === "razorpay") {
      setError("Online payment is not wired in this demo. Please use Cash on Delivery.");
      return;
    }

    if (
      !address.fullName ||
      !address.phone ||
      !address.line1 ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      setError("Please fill in your complete delivery address.");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const deliveryAddress = {
        ...address,
        latitude: deliveryLocation?.latitude ?? restaurant?.location?.latitude ?? 18.5314,
        longitude: deliveryLocation?.longitude ?? restaurant?.location?.longitude ?? 73.8446,
      };

      const data = await api.orders.create({ deliveryAddress });
      navigate(`/orders/${data.order._id}/track`, { replace: true });
    } catch (err) {
      setError(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout">
        <Navbar />
        <div className="checkout-state">
          <Spinner size="lg" />
          <p className="checkout-loading-text">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="checkout">
        <Navbar />
        <div className="checkout-state">
          <h2>Your cart is empty</h2>
          <p>Add items from a restaurant before checkout.</p>
          <Link to="/">
            <Button size="lg">Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <Navbar />

      <div className="checkout-content">
        <header className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">
            {itemCount} {itemCount === 1 ? "item" : "items"} · Confirm delivery & pay
          </p>
          <div className="checkout-steps">
            <span className="checkout-step done">Cart</span>
            <span className="checkout-step-arrow">→</span>
            <span className="checkout-step active">Checkout</span>
            <span className="checkout-step-arrow">→</span>
            <span className="checkout-step">Track</span>
          </div>
        </header>

        {error && <div className="checkout-error">{error}</div>}

        <div className="checkout-grid">
          <div className="checkout-left">
            <Card className="checkout-panel address-section">
              <h2 className="section-title">
                <MapPin size={20} />
                Delivery Address
              </h2>

              {deliveryLocation?.label && (
                <div className="location-hint">
                  <LocateFixed size={18} aria-hidden />
                  <span>
                    Delivering near <strong>{deliveryLocation.label}</strong>
                    {deliveryLocation.fullAddress ? ` — ${deliveryLocation.fullAddress}` : ""}
                  </span>
                </div>
              )}

              <div className="new-address-form">
                <Input
                  label="Full Name"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  required
                />
                <Input
                  label="Address Line"
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="Street, building, area"
                  required
                />
                <Input
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
                <Input
                  label="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  required
                />
              </div>
            </Card>

            <Card className="checkout-panel payment-section">
              <h2 className="section-title">
                <CreditCard size={20} />
                Payment Method
              </h2>
              <div className="payment-methods">
                <label
                  className={`payment-method ${paymentMethod === "razorpay" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  <div className="payment-details">
                    <div className="payment-icon">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <span className="payment-name">Razorpay</span>
                      <span className="payment-desc">UPI, Cards, Netbanking</span>
                    </div>
                  </div>
                </label>

                <label
                  className={`payment-method ${paymentMethod === "cod" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  <div className="payment-details">
                    <div className="payment-icon">💵</div>
                    <div>
                      <span className="payment-name">Cash on Delivery</span>
                      <span className="payment-desc">Pay when you receive</span>
                    </div>
                  </div>
                </label>
              </div>
            </Card>
          </div>

          <div className="checkout-right">
            <Card className="order-summary">
              <h2 className="section-title">Order Summary</h2>

              {restaurant && (
                <div className="checkout-restaurant-chip">
                  {restaurant.image && <img src={restaurant.image} alt="" />}
                  <span>{restaurant.name}</span>
                </div>
              )}

              <div className="summary-items">
                {items.map((item, index) => (
                  <div
                    key={item.menuItem?._id || item.menuItem || item.name}
                    className="summary-item"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <span className="summary-item-name">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="summary-item-price">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Item Total</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="summary-row">
                <span>Taxes (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span key={total}>₹{total}</span>
              </div>

              <Button
                size="lg"
                className="place-order-button"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? "Placing Order..." : "Place Order"}
                {!placing && <ArrowRight size={18} />}
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
