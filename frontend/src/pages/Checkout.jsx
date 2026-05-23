import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Wallet, ArrowRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import "./Checkout.css";

const mockCartItems = [
  { id: "1", name: "Paneer Tikka", price: 220, quantity: 2 },
  { id: "2", name: "Butter Naan", price: 50, quantity: 3 },
];

const mockAddresses = [
  {
    id: "1",
    type: "Home",
    address: "123 Main Street, Pune, Maharashtra 411001",
    phone: "+91 9359028987",
  },
  {
    id: "2",
    type: "Work",
    address: "456 Business Park, Pune, Maharashtra 411014",
    phone: "+91 9359028987",
  },
];

export default function Checkout() {
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(mockAddresses[0].id);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    address: "",
    phone: "",
  });
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 30;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = () => {
    navigate("/orders/1/track");
  };

  return (
    <div className="checkout">
      <Navbar />

      <div className="checkout-content">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-grid">
          <div className="checkout-left">
            <Card className="address-section">
              <h2 className="section-title">
                <MapPin size={20} />
                Delivery Address
              </h2>
              <div className="address-list">
                {mockAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`address-item ${selectedAddress === addr.id ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                    />
                    <div className="address-details">
                      <span className="address-type">{addr.type}</span>
                      <p className="address-text">{addr.address}</p>
                      <p className="address-phone">{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>

              <button
                className="add-address-button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
              >
                {showNewAddressForm ? "Cancel" : "+ Add New Address"}
              </button>

              {showNewAddressForm && (
                <div className="new-address-form">
                  <Input
                    label="Address Type"
                    placeholder="Home/Work"
                    value={newAddress.type}
                    onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                  />
                  <Input
                    label="Complete Address"
                    placeholder="Enter your full address"
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+91 9999999999"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  />
                  <Button>Save Address</Button>
                </div>
              )}
            </Card>

            <Card className="payment-section">
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
                    <div className="payment-icon">
                      💵
                    </div>
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
              
              <div className="summary-items">
                {mockCartItems.map((item) => (
                  <div key={item.id} className="summary-item">
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
                <span>₹{total}</span>
              </div>

              <Button
                size="lg"
                className="place-order-button"
                onClick={handlePlaceOrder}
              >
                Place Order
                <ArrowRight size={18} />
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
