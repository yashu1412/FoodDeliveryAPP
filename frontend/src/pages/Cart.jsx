import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import CartItem from "../components/food/CartItem";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import "./Cart.css";

const mockCartItems = [
  {
    _id: "1",
    name: "Paneer Tikka",
    price: 220,
    quantity: 2,
    restaurantName: "Vingo Bistro",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&q=80",
  },
  {
    _id: "2",
    name: "Butter Naan",
    price: 50,
    quantity: 3,
    restaurantName: "Vingo Bistro",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200&q=80",
  },
];

export default function Cart() {
  const [items, setItems] = useState(mockCartItems);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 30;
  const tax = Math.round(subtotal * 0.05);
  const discount = couponApplied ? 50 : 0;
  const total = subtotal + deliveryFee + tax - discount;

  const handleUpdateQty = (itemId, qty) => {
    if (qty < 1) return;
    setItems(items.map((item) =>
      item._id === itemId ? { ...item, quantity: qty } : item
    ));
  };

  const handleRemove = (itemId) => {
    setItems(items.filter((item) => item._id !== itemId));
  };

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() === "WELCOME10") {
      setCouponApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart">
        <Navbar />
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingCart size={80} />
          </div>
          <h2 className="cart-empty-title">Nothing here yet</h2>
          <p className="cart-empty-text">Let's fix that and order some delicious food! 🍔</p>
          <Link to="/">
            <Button size="lg">Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <Navbar />
      <div className="cart-content">
        <h1 className="cart-title">Your Cart</h1>
        
        <div className="cart-grid">
          <div className="cart-items">
            {items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQty={handleUpdateQty}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="cart-summary">
            <Card className="summary-card">
              <h2 className="summary-title">Order Summary</h2>
              
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
              {couponApplied && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              {!couponApplied && (
                <div className="coupon-section">
                  <Input
                    placeholder="Enter coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button onClick={handleApplyCoupon}>Apply</Button>
                </div>
              )}

              <Link to="/checkout">
                <Button size="lg" className="checkout-button">
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
