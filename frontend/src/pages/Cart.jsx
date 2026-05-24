import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Tag } from "lucide-react";
import { api } from "../utils/api";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import CartItem from "../components/food/CartItem";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Spinner from "../components/ui/Spinner";
import "./Cart.css";

export default function Cart() {
  const { refreshCartCount } = useAppContext();
  const [cart, setCart] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const items = cart?.items || [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = restaurant?.deliveryFee ?? 30;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + tax - discount;

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await api.cart.get();
      setCart(data.cart);
      setRestaurant(data.restaurant);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (itemId, qty) => {
    if (qty < 1) {
      await handleRemove(itemId);
      return;
    }
    setUpdatingId(itemId);
    try {
      await api.cart.updateQuantity(itemId, { quantity: qty });
      await loadCart();
      refreshCartCount();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId) => {
    setUpdatingId(itemId);
    try {
      await api.cart.removeItem(itemId);
      await loadCart();
      refreshCartCount();
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApplyCoupon = async () => {
    const code = coupon.toUpperCase().trim();
    if (!code) return;

    setCouponError("");
    try {
      const data = await api.coupons.apply({ code, orderAmount: subtotal });
      setAppliedCoupon(code);
      setCouponApplied(true);
      setDiscount(data.discount || 0);
    } catch (error) {
      setCouponError(error.message || "Invalid coupon code");
    }
  };

  if (loading) {
    return (
      <div className="cart">
        <Navbar />
        <div className="cart-empty">
          <Spinner size="lg" />
          <p className="cart-loading-text">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="cart">
        <Navbar />
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <ShoppingCart size={56} strokeWidth={1.5} />
          </div>
          <h2 className="cart-empty-title">Nothing here yet</h2>
          <p className="cart-empty-text">
            Your cart is empty. Browse restaurants and add something delicious!
          </p>
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
        <header className="cart-header">
          <h1 className="cart-title">Your Cart</h1>
          <p className="cart-subtitle">
            <strong>{itemCount}</strong> {itemCount === 1 ? "item" : "items"} · Subtotal ₹{subtotal}
          </p>
          {restaurant && (
            <div className="cart-restaurant-chip">
              {restaurant.image && (
                <img src={restaurant.image} alt="" />
              )}
              <span>{restaurant.name}</span>
            </div>
          )}
        </header>

        <div className="cart-grid">
          <div className="cart-items">
            {items.map((item, index) => {
              const id = item.menuItem?._id || item.menuItem;
              return (
                <CartItem
                  key={id}
                  item={item}
                  index={index}
                  isUpdating={updatingId === id?.toString()}
                  onUpdateQty={handleUpdateQty}
                  onRemove={handleRemove}
                />
              );
            })}
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
                <>
                  <div className="coupon-applied-badge">
                    <span className="coupon-applied-text">
                      <Tag size={14} aria-hidden />
                      {appliedCoupon} applied
                    </span>
                  </div>
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                </>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span key={total}>₹{total}</span>
              </div>

              {!couponApplied && (
                <div className="coupon-section">
                  <Input
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => {
                      setCoupon(e.target.value);
                      setCouponError("");
                    }}
                  />
                  <Button className="coupon-apply-btn" onClick={handleApplyCoupon} type="button">
                    Apply
                  </Button>
                </div>
              )}
              {couponError && <p className="coupon-error">{couponError}</p>}

              <Link to="/checkout" className="checkout-link">
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
