import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Plus, Minus } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import "./RestaurantDetail.css";

const mockRestaurant = {
  _id: "1",
  name: "SwiftEats Bistro",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  cuisine: ["Indian", "Continental"],
  rating: 4.5,
  averageDeliveryTime: 30,
  deliveryFee: 30,
  isOpen: true,
  categories: [
    { id: "1", name: "Starters" },
    { id: "2", name: "Main Course" },
    { id: "3", name: "Desserts" },
  ],
  menu: [
    {
      _id: "1",
      name: "Paneer Tikka",
      description: "Grilled paneer cubes with spices",
      price: 220,
      isVeg: true,
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&q=80",
      category: "Starters",
    },
    {
      _id: "2",
      name: "Chicken Biryani",
      description: "Aromatic basmati rice with spiced chicken",
      price: 380,
      isVeg: false,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&q=80",
      category: "Main Course",
    },
    {
      _id: "3",
      name: "Butter Naan",
      description: "Soft naan with butter",
      price: 50,
      isVeg: true,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&q=80",
      category: "Main Course",
    },
    {
      _id: "4",
      name: "Gulab Jamun",
      description: "Deep fried dumplings in sugar syrup",
      price: 120,
      isVeg: true,
      image: "https://images.unsplash.com/photo-1614241121036-f975462fba29?w=300&q=80",
      category: "Desserts",
    },
  ],
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const [activeCategory, setActiveCategory] = useState("Starters");
  const [cartItems, setCartItems] = useState({});

  const restaurant = mockRestaurant;

  const filteredMenu = restaurant.menu.filter(
    (item) => item.category === activeCategory
  );

  const addToCart = (item) => {
    setCartItems((prev) => ({
      ...prev,
      [item._id]: (prev[item._id] || 0) + 1,
    }));
  };

  const removeFromCart = (item) => {
    setCartItems((prev) => {
      const newQty = (prev[item._id] || 0) - 1;
      if (newQty <= 0) {
        const { [item._id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [item._id]: newQty };
    });
  };

  const totalCartItems = Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  const totalCartPrice = Object.entries(cartItems).reduce(
    (sum, [itemId, qty]) => {
      const item = restaurant.menu.find((m) => m._id === itemId);
      return sum + (item?.price || 0) * qty;
    },
    0
  );

  return (
    <div className="restaurant-detail">
      <Navbar />
      
      <div className="restaurant-hero">
        <img src={restaurant.image} alt={restaurant.name} className="restaurant-hero-image" />
        <div className="restaurant-hero-overlay"></div>
      </div>

      <div className="restaurant-content">
        <div className="restaurant-header">
          <div className="restaurant-header-left">
            <h1 className="restaurant-header-name">{restaurant.name}</h1>
            <div className="restaurant-header-cuisines">
              {restaurant.cuisine.map((c, i) => (
                <Badge key={i} variant="primary" className="cuisine-badge">
                  {c}
                </Badge>
              ))}
            </div>
            <div className="restaurant-header-details">
              <div className="detail-item">
                <Star size={16} className="detail-icon" />
                <span>{restaurant.rating}</span>
              </div>
              <div className="detail-item">
                <Clock size={16} className="detail-icon" />
                <span>{restaurant.averageDeliveryTime} mins</span>
              </div>
              <div className="detail-item">
                <span>₹{restaurant.deliveryFee} delivery</span>
              </div>
            </div>
          </div>
          <Badge variant={restaurant.isOpen ? "success" : "danger"} className="open-badge">
            {restaurant.isOpen ? "Open" : "Closed"}
          </Badge>
        </div>

        <div className="menu-categories">
          {restaurant.categories.map((category) => (
            <button
              key={category.id}
              className={`menu-category-tab ${activeCategory === category.name ? "active" : ""}`}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="menu-items">
          {filteredMenu.map((item) => (
            <div key={item._id} className="menu-item">
              <img src={item.image} alt={item.name} className="menu-item-image" />
              <div className="menu-item-info">
                <div className={`veg-indicator ${item.isVeg ? "veg" : "non-veg"}`}></div>
                <h3 className="menu-item-name">{item.name}</h3>
                <p className="menu-item-description">{item.description}</p>
                <p className="menu-item-price">₹{item.price}</p>
              </div>
              {cartItems[item._id] ? (
                <div className="qty-stepper">
                  <button className="qty-stepper-button" onClick={() => removeFromCart(item)}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-stepper-value">{cartItems[item._id]}</span>
                  <button className="qty-stepper-button" onClick={() => addToCart(item)}>
                    <Plus size={14} />
                  </button>
                </div>
              ) : (
                <button className="menu-item-add" onClick={() => addToCart(item)}>
                  <Plus size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {totalCartItems > 0 && (
          <div className="floating-cart">
            <div className="floating-cart-content">
              <div>
                <p className="floating-cart-items">{totalCartItems} items</p>
                <p className="floating-cart-price">₹{totalCartPrice}</p>
              </div>
              <Link to="/cart">
                <Button>
                  View Cart
                  <Plus size={18} />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
