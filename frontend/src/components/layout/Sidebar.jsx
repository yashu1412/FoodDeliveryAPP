import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Utensils,
  Settings,
  DollarSign,
  Package,
} from "lucide-react";
import "./Sidebar.css";

export default function Sidebar({ userRole }) {
  const location = useLocation();

  const ownerLinks = [
    { to: "/owner-dashboard", label: "Dashboard", icon: Home },
    { to: "/owner-dashboard/orders", label: "Orders", icon: ShoppingBag },
    { to: "/owner-dashboard/menu", label: "Menu", icon: Utensils },
    { to: "/owner-dashboard/settings", label: "Settings", icon: Settings },
  ];

  const riderLinks = [
    { to: "/rider-dashboard", label: "Dashboard", icon: Home },
    { to: "/rider-dashboard/earnings", label: "Earnings", icon: DollarSign },
    { to: "/rider-dashboard/deliveries", label: "Deliveries", icon: Package },
  ];

  const links = userRole === "owner" ? ownerLinks : riderLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <span className="sidebar-logo-icon">🌶️</span>
          <span className="sidebar-logo-text">SwiftEats</span>
        </Link>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
          >
            <link.icon size={20} />
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
