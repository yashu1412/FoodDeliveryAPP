import { Minus, Plus, Trash2 } from "lucide-react";
import "./CartItem.css";

export default function CartItem({ item, onUpdateQty, onRemove }) {
  return (
    <div className="cart-item">
      <img
        src={item.image || "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200&q=80"}
        alt={item.name}
        className="cart-item-image"
      />
      <div className="cart-item-details">
        <div className="cart-item-info">
          <h3 className="cart-item-name">{item.name}</h3>
          <p className="cart-item-restaurant">{item.restaurantName}</p>
        </div>
        <div className="cart-item-actions">
          <div className="cart-item-qty">
            <button
              className="qty-button"
              onClick={() => onUpdateQty(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-button"
              onClick={() => onUpdateQty(item._id, item.quantity + 1)}
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="cart-item-price">₹{item.price * item.quantity}</p>
          <button className="cart-item-remove" onClick={() => onRemove(item._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
