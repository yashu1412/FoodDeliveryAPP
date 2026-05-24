import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { Star, Clock, Plus, Minus } from "lucide-react";
import { api } from "../utils/api";
import { useAppContext } from "../context/AppContext";
import Navbar from "../components/layout/Navbar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import "./RestaurantDetail.css";

const getMenuItemId = (ref) => {
  if (!ref) return null;
  if (typeof ref === "object") return ref._id?.toString() || null;
  return ref.toString();
};

export default function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshCartCount, isAuthenticated } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("");
  const [restaurant, setRestaurant] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingItemId, setAddingItemId] = useState(null);

  useEffect(() => {
    loadRestaurant();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  const loadRestaurant = async () => {
    try {
      setLoading(true);
      const data = await api.restaurants.getById(id);
      setRestaurant(data.restaurant);
      const firstCategory = data.restaurant?.categories?.[0]?.name;
      if (firstCategory) {
        setActiveCategory(firstCategory);
      }
    } catch (error) {
      console.error("Failed to load restaurant:", error);
    } finally {
      if (!isAuthenticated) {
        setLoading(false);
      }
    }
  };

  const loadCart = async () => {
    try {
      const data = await api.cart.get();
      setCart(data.cart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCartQuantity = (itemId) => {
    if (!cart?.items) return 0;
    const cartItem = cart.items.find(
      (ci) => getMenuItemId(ci.menuItem) === itemId?.toString()
    );
    return cartItem?.quantity || 0;
  };

  const handleAddToCart = async (item) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!item._id) {
      console.error("Menu item has no id");
      return;
    }

    setAddingItemId(item._id);
    try {
      await api.cart.addItem({ menuItemId: item._id, quantity: 1 });
      await loadCart();
      refreshCartCount();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setAddingItemId(null);
    }
  };

  const updateQuantity = async (item, newQty) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (newQty < 1) {
      await removeFromCart(item);
      return;
    }
    try {
      await api.cart.updateQuantity(item._id, { quantity: newQty });
      await loadCart();
      refreshCartCount();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const removeFromCart = async (item) => {
    if (!isAuthenticated) return;

    try {
      await api.cart.removeItem(item._id);
      await loadCart();
      refreshCartCount();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const totalCartItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalCartPrice = cart?.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) || 0;

  if (loading) {
    return (
      <div className="restaurant-detail">
        <Navbar />
        <div className="loading-container">
          <Spinner size="lg" />
          <p>Loading restaurant...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="restaurant-detail">
        <Navbar />
        <div className="error-container">
          <h2>Restaurant Not Found</h2>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredMenu = restaurant.menu?.filter(
    (item) => item.category === activeCategory
  ) || [];

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
              {restaurant.cuisine?.map((c, i) => (
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
          {restaurant.categories?.map((category) => (
            <button
              key={category.id || category._id}
              className={`menu-category-tab ${activeCategory === category.name ? "active" : ""}`}
              onClick={() => setActiveCategory(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="menu-items" key={activeCategory}>
          {filteredMenu.map((item, index) => {
            const qty = getCartQuantity(item._id);
            const isAdding = addingItemId === item._id;
            return (
              <div
                key={item._id}
                className={`menu-item ${qty > 0 ? "menu-item--in-cart" : ""}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <img src={item.image} alt={item.name} className="menu-item-image" />
                <div className="menu-item-info">
                  <div className={`veg-indicator ${item.isVeg ? "veg" : "non-veg"}`}></div>
                  <h3 className="menu-item-name">{item.name}</h3>
                  <p className="menu-item-description">{item.description}</p>
                  <p className="menu-item-price">₹{item.price}</p>
                </div>
                {qty > 0 ? (
                  <div className="qty-stepper">
                    <button
                      type="button"
                      className="qty-stepper-button"
                      onClick={() => updateQuantity(item, qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-stepper-value" key={qty}>
                      {qty}
                    </span>
                    <button
                      type="button"
                      className="qty-stepper-button"
                      onClick={() => updateQuantity(item, qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className={`menu-item-add ${isAdding ? "menu-item-add--loading" : ""}`}
                    onClick={() => handleAddToCart(item)}
                    disabled={isAdding}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    <Plus size={18} className="menu-item-add-icon" />
                  </button>
                )}
              </div>
            );
          })}
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