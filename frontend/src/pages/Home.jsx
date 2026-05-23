import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Star, Clock, MapPin, Plus } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { api } from "../utils/api";
import Navbar from "../components/layout/Navbar";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import "./Home.css";

const categories = [
  { emoji: "🍕", name: "Pizza" },
  { emoji: "🍔", name: "Burger" },
  { emoji: "🍜", name: "Noodles" },
  { emoji: "🍣", name: "Sushi" },
  { emoji: "🍗", name: "Chicken" },
  { emoji: "🌮", name: "Tacos" },
  { emoji: "🥗", name: "Salad" },
  { emoji: "🍩", name: "Desserts" },
];

export default function Home() {
  const { user } = useAppContext();
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [restaurantsRes] = await Promise.all([
        api.restaurants.getAll(),
      ]);
      setRestaurants(restaurantsRes.restaurants || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const mockRestaurants = [
    {
      _id: "1",
      name: "Vingo Bistro",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
      cuisine: ["Indian", "Continental"],
      rating: 4.5,
      averageDeliveryTime: 30,
      deliveryFee: 30,
      isOpen: true,
    },
    {
      _id: "2",
      name: "Pizza Palace",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80",
      cuisine: ["Italian", "Pizza"],
      rating: 4.2,
      averageDeliveryTime: 25,
      deliveryFee: 25,
      isOpen: true,
    },
  ];

  const mockDishes = [
    {
      _id: "1",
      name: "Paneer Tikka",
      price: 220,
      isVeg: true,
      image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&q=80",
    },
    {
      _id: "2",
      name: "Chicken Biryani",
      price: 380,
      isVeg: false,
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80",
    },
  ];

  const displayRestaurants = restaurants.length > 0 ? restaurants : mockRestaurants;
  const displayDishes = menuItems.length > 0 ? menuItems : mockDishes;

  return (
    <div className="home">
      <Navbar />
      
      <div className="home-content">
        <div className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Hungry? We're swift.</h1>
            <p className="hero-subtitle">Hot food delivered to your door in minutes</p>
            <div className="hero-search">
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Search for dishes or restaurants"
                className="hero-search-input"
              />
              <Button className="hero-search-button">Search</Button>
            </div>
          </div>
        </div>

        <div className="categories">
          <div className="categories-scroll">
            {categories.map((category, index) => (
              <div key={index} className="category-chip">
                <span className="category-emoji">{category.emoji}</span>
                <span className="category-name">{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Top Restaurants Near You</h2>
          <div className="restaurants-grid">
            {displayRestaurants.map((restaurant) => (
              <Link key={restaurant._id} to={`/services`} className="restaurant-card-wrapper">
                <Card className="restaurant-card">
                  <div className="restaurant-image-container">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="restaurant-image"
                    />
                    <Badge variant={restaurant.isOpen ? "success" : "danger"} className="restaurant-status">
                      {restaurant.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </div>
                  <div className="restaurant-info">
                    <h3 className="restaurant-name">{restaurant.name}</h3>
                    <div className="restaurant-cuisines">
                      {restaurant.cuisine?.map((c, i) => (
                        <Badge key={i} variant="primary" className="cuisine-badge">
                          {c}
                        </Badge>
                      ))}
                    </div>
                    <div className="restaurant-details">
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
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">Popular Dishes</h2>
          <div className="dishes-scroll">
            {displayDishes.map((dish) => (
              <Card key={dish._id} className="dish-card">
                <div className="dish-image-container">
                  <img src={dish.image} alt={dish.name} className="dish-image" />
                  <div className={`veg-indicator ${dish.isVeg ? "veg" : "non-veg"}`}></div>
                </div>
                <div className="dish-info">
                  <h3 className="dish-name">{dish.name}</h3>
                  <p className="dish-price">₹{dish.price}</p>
                </div>
                <button className="dish-add-button">
                  <Plus size={16} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
