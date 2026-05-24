import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  User,
  MapPin,
  ChevronDown,
  Navigation,
  Loader2,
  LocateFixed,
} from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { detectCurrentLocation } from "../../utils/location";
import "./Navbar.css";
import Avatar from "../ui/Avatar";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, cartCount, signOut, deliveryLocation, setDeliveryLocation } =
    useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setLocationMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    navigate("/");
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleDetectLocation = async () => {
    setLocating(true);
    setLocationError("");

    try {
      const location = await detectCurrentLocation();
      setDeliveryLocation(location);
      setLocationMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      setLocationError(error.message || "Failed to get location");
    } finally {
      setLocating(false);
    }
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") return "/admin-dashboard";
    if (user?.role === "owner") return "/owner-dashboard";
    if (user?.role === "deliveryBoy") return "/rider-dashboard";
    return "/profile";
  };

  const getDashboardLabel = () => {
    if (user?.role === "admin") return "Admin Dashboard";
    if (user?.role === "owner") return "Owner Dashboard";
    if (user?.role === "deliveryBoy") return "Rider Dashboard";
    return "My Profile";
  };

  const locationLabel = deliveryLocation?.label || "Select Location";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">🌶️</div>
          <span className="navbar-logo-text">SwiftEats</span>
        </Link>

        <div className="navbar-location-wrap" ref={locationRef}>
          <button
            type="button"
            className={`location-button ${deliveryLocation ? "has-location" : ""}`}
            onClick={() => setLocationMenuOpen((open) => !open)}
            aria-expanded={locationMenuOpen}
            aria-haspopup="true"
          >
            <span className="location-button-icon">
              <MapPin size={18} />
            </span>
            <span className="location-button-text">
              <span className="location-button-label">Deliver to</span>
              <span className="location-button-value">{locationLabel}</span>
            </span>
            <ChevronDown
              size={16}
              className={`location-chevron ${locationMenuOpen ? "open" : ""}`}
            />
          </button>

          {locationMenuOpen && (
            <div className="location-dropdown">
              <p className="location-dropdown-title">Delivery location</p>
              {deliveryLocation && (
                <div className="location-current">
                  <MapPin size={16} />
                  <div>
                    <strong>{deliveryLocation.label}</strong>
                    <span>{deliveryLocation.fullAddress}</span>
                  </div>
                </div>
              )}
              <button
                type="button"
                className="location-detect-btn"
                onClick={handleDetectLocation}
                disabled={locating}
              >
                {locating ? (
                  <>
                    <Loader2 size={18} className="spin" />
                    Detecting location...
                  </>
                ) : (
                  <>
                    <Navigation size={18} />
                    Use my current location
                  </>
                )}
              </button>
              {locationError && <p className="location-error">{locationError}</p>}
            </div>
          )}
        </div>

        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for dishes or restaurants"
            className="search-input"
          />
        </div>

        <div className="navbar-right">
          {isAuthenticated && (
            <Link to="/cart" className="navbar-cart" aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="navbar-user-menu">
              <button
                className="navbar-user"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                type="button"
              >
                <Avatar
                  src={user?.avatar}
                  initials={user?.fullName?.split(" ").map((n) => n[0]).join("")}
                  size="sm"
                />
                <span className="user-name">Hi, {user?.fullName?.split(" ")[0]}</span>
                <ChevronDown size={16} />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <Link
                    to={getDashboardLink()}
                    onClick={() => setUserMenuOpen(false)}
                    className="dropdown-item"
                  >
                    <User size={18} />
                    {getDashboardLabel()}
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setUserMenuOpen(false)}
                    className="dropdown-item"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="dropdown-item"
                  >
                    Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout" type="button">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="navbar-auth-link">
                Sign In
              </Link>
              <Link to="/signup" className="navbar-auth-cta">
                Sign Up
              </Link>
            </div>
          )}

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-content">
            <div className="mobile-location-block">
              <p className="mobile-location-label">
                <MapPin size={16} />
                {deliveryLocation ? deliveryLocation.label : "No location selected"}
              </p>
              <button
                type="button"
                className="mobile-location-btn"
                onClick={handleDetectLocation}
                disabled={locating}
              >
                {locating ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <LocateFixed size={16} />
                    Use current location
                  </>
                )}
              </button>
              {locationError && <p className="location-error">{locationError}</p>}
            </div>

            {isAuthenticated ? (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                  My Orders
                </Link>
                <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  Cart
                </Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                {user?.role === "owner" && (
                  <Link to="/owner-dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Owner Dashboard
                  </Link>
                )}
                {user?.role === "deliveryBoy" && (
                  <Link to="/rider-dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Rider Dashboard
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin-dashboard" onClick={() => setMobileMenuOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="logout-button" type="button">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mobile-auth-primary">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="mobile-auth-signup">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
