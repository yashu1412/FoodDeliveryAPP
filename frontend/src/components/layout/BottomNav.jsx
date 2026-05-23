import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Package } from "lucide-react";
import "./BottomNav.css";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/search", label: "Search", icon: Search },
    { to: "/cart", label: "Cart", icon: ShoppingCart },
    { to: "/orders", label: "Orders", icon: Package },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={`bottom-nav-item ${location.pathname === item.to ? "active" : ""}`}
        >
          <item.icon size={20} />
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
