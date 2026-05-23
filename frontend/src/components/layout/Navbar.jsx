import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, User, MapPin } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import "./Navbar.css";
import Avatar from "../ui/Avatar";
import Badge from "../ui/Badge";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, cartCount, signOut } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🌶️</div>
          <span className="navbar-logo-text">SwiftEats</span>
        </Link>

        <div className="navbar-location">
          <MapPin size={18} className="location-icon" />
          <span className="location-text">Select Location</span>
        </div>

        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text" placeholder="Search for dishes or restaurants" className="search-input" />
        </div>

        <div className="navbar-right">
          {isAuthenticated && (
            <Link to="/cart" className="navbar-cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="navbar-user">
              <Avatar
                src={user?.avatar}
                initials={user?.fullName?.split(" ").map((n) => n[0]).join("")}
                size="sm"
              />
              <span className="user-name">Hi, {user?.fullName?.split(" ")[0]}</span>
            </div>
          ) : (
            <div className="navbar-auth">
            <Link to="/signin" className="auth-link">Sign In</Link>
            <Link to="/signup" className="auth-button">Sign Up</Link>
          </div>
          )}

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}\
            </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            {isAuthenticated ? (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
              <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>Cart</Link>
              {user?.role === "owner" && (
                <Link to="/owner-dashboard" onClick={() => setMobileMenuOpen(false)}>Owner Dashboard</Link>
              )}
              {user?.role === "deliveryBoy" && (
                <Link to="/rider-dashboard" onClick={() => setMobileMenuOpen(false)}>Rider Dashboard</Link>
              )}
              {user?.role === "admin" && (
                <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
              )}
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
          </div>
        </div>
      )}
    </nav>
  );
}
