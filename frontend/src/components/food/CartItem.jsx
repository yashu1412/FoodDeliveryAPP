import { useState } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import "./CartItem.css";

const getMenuItemId = (menuItemRef) => {
  if (!menuItemRef) return null;
  if (typeof menuItemRef === "object") return menuItemRef._id?.toString() || null;
  return menuItemRef.toString();
};

export default function CartItem({ item, index = 0, onUpdateQty, onRemove, isUpdating }) {
  const menuItemId = getMenuItemId(item.menuItem);
  const [qtyPop, setQtyPop] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleQtyChange = (newQty) => {
    setQtyPop(true);
    setTimeout(() => setQtyPop(false), 250);
    onUpdateQty(menuItemId, newQty);
  };

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(menuItemId), 320);
  };

  return (
    <div
      className={`cart-item ${isUpdating ? "cart-item--updating" : ""} ${removing ? "cart-item--removing" : ""}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="cart-item-image-wrap">
        <img
          src={item.image || "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&q=80"}
          alt={item.name}
          className="cart-item-image"
        />
      </div>
      <div className="cart-item-details">
        <div className="cart-item-info">
          <h3 className="cart-item-name">{item.name}</h3>
          <p className="cart-item-unit-price">₹{item.price} each</p>
        </div>
        <div className="cart-item-actions">
          <div className="cart-item-qty">
            {isUpdating ? (
              <Loader2 size={18} className="cart-qty-spinner" style={{ color: "#fff", margin: "0 1rem" }} />
            ) : (
              <>
                <button
                  type="button"
                  className="qty-button"
                  onClick={() => handleQtyChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className={`qty-value ${qtyPop ? "qty-value--pop" : ""}`}>{item.quantity}</span>
                <button
                  type="button"
                  className="qty-button"
                  onClick={() => handleQtyChange(item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </>
            )}
          </div>
          <div className="cart-item-right">
            <p className="cart-item-price">₹{item.price * item.quantity}</p>
            <button
              type="button"
              className="cart-item-remove"
              onClick={handleRemove}
              disabled={isUpdating}
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
