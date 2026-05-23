import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Restaurants" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, cartCount, signOut } = useAppContext();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    signOut();
    navigate("/signin");
  };

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#ff4d2d] rounded-full flex items-center justify-center text-white font-bold text-xl">
            V
          </div>
          <span className="text-xl font-semibold text-[#ff4d2d]">Vingo</span>
        </Link>

        <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <li key={link.to} className="cursor-pointer hover:text-[#ff4d2d] transition">
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
          {isAuthenticated && (
            <>
              <li className="cursor-pointer hover:text-[#ff4d2d] transition">
                <Link to="/orders">Orders</Link>
              </li>
              <li className="cursor-pointer hover:text-[#ff4d2d] transition">
                <Link to="/cart">Cart ({cartCount})</Link>
              </li>
            </>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">
                Hi, {user?.fullName?.split(" ")[0] || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-[#ff4d2d] text-[#ff4d2d] rounded-lg hover:bg-[#ff4d2d] hover:text-white transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="px-4 py-2 text-[#ff4d2d] rounded-lg hover:bg-orange-50 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 border border-[#ff4d2d] text-[#ff4d2d] rounded-lg hover:bg-[#ff4d2d] hover:text-white transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-[#ff4d2d]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white w-full shadow-md animate-fadeIn">
          <div className="flex flex-col gap-4 px-6 py-4 text-gray-700 font-medium">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={() => setOpen(false)}>
                  Orders
                </Link>
                <Link to="/cart" onClick={() => setOpen(false)}>
                  Cart ({cartCount})
                </Link>
                {user?.role === "owner" && (
                  <Link to="/owner-dashboard" onClick={() => setOpen(false)}>
                    Owner Dashboard
                  </Link>
                )}
                {user?.role === "deliveryBoy" && (
                  <Link to="/rider-dashboard" onClick={() => setOpen(false)}>
                    Rider Dashboard
                  </Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin-dashboard" onClick={() => setOpen(false)}>
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="text-left text-[#ff4d2d]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" onClick={() => setOpen(false)}>
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full px-4 py-2 border border-[#ff4d2d] text-[#ff4d2d] rounded-lg hover:bg-[#ff4d2d] hover:text-white transition mt-2"
                >
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
