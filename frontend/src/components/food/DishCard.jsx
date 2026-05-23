import { Plus } from "lucide-react";
import Card from "../ui/Card";
import "./DishCard.css";

export default function DishCard({ dish, onAdd }) {
  return (
    <Card className="dish-card">
      <div className="dish-card-image-container">
        <img
          src={dish.image || "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80"}
          alt={dish.name}
          className="dish-card-image"
        />
        <div className={`dish-card-veg-indicator ${dish.isVeg ? "veg" : "non-veg"}`}></div>
      </div>
      <div className="dish-card-info">
        <h3 className="dish-card-name">{dish.name}</h3>
        <p className="dish-card-price">₹{dish.price}</p>
      </div>
      <button className="dish-card-add" onClick={onAdd}>
        <Plus size={16} />
      </button>
    </Card>
  );
}
