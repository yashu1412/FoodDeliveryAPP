import { Star, Clock } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import "./RestaurantCard.css";

export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <Card className="restaurant-card" onClick={onClick}>
      <div className="restaurant-card-image-container">
        <img
          src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"}
          alt={restaurant.name}
          className="restaurant-card-image"
        />
        <Badge variant={restaurant.isOpen ? "success" : "danger"} className="restaurant-card-status">
          {restaurant.isOpen ? "Open" : "Closed"}
        </Badge>
      </div>
      <div className="restaurant-card-info">
        <h3 className="restaurant-card-name">{restaurant.name}</h3>
        <div className="restaurant-card-cuisines">
          {restaurant.cuisine?.map((c, i) => (
            <Badge key={i} variant="primary" className="restaurant-card-cuisine-badge">
              {c}
            </Badge>
          ))}
        </div>
        <div className="restaurant-card-details">
          <div className="restaurant-card-detail">
            <Star size={16} className="restaurant-card-detail-icon" />
            <span>{restaurant.rating || 4.5}</span>
          </div>
          <div className="restaurant-card-detail">
            <Clock size={16} className="restaurant-card-detail-icon" />
            <span>{restaurant.averageDeliveryTime || 30} mins</span>
          </div>
          <div className="restaurant-card-detail">
            <span>₹{restaurant.deliveryFee || 30} delivery</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
