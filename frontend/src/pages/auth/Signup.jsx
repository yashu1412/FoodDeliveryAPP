import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Store, Truck } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { api } from "../../utils/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import "./Auth.css";

const roles = [
  { id: "customer", label: "Customer", icon: User, description: "Order delicious food" },
  { id: "owner", label: "Restaurant Owner", icon: Store, description: "Manage your restaurant" },
  { id: "deliveryBoy", label: "Delivery Boy", icon: Truck, description: "Earn by delivering" },
];

export default function Signup() {
  const navigate = useNavigate();
  const { applySession } = useAppContext();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.auth.signup(formData);
      applySession(data);
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        <Card className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <span className="auth-logo-icon">🌶️</span>
              <span className="auth-logo-text">SwiftEats</span>
            </Link>
            <p className="auth-tagline">Hot food. Swift delivery.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <h2 className="auth-title">Create an account</h2>
            
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              error={error}
              required
            />

            <Input
              label="Email"
              type="email"
              icon={Mail}
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={error}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              error={error}
              required
            />

            <div className="role-selector">
              <p className="role-label">I am a:</p>
              <div className="role-options">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={`role-option ${formData.role === role.id ? "active" : ""}`}
                    onClick={() => setFormData({ ...formData, role: role.id })}
                  >
                    <role.icon size={24} />
                    <span className="role-name">{role.label}</span>
                    <span className="role-description">{role.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"}
              {!loading && <ArrowRight size={18} />}
            </Button>
          </form>

          <p className="auth-footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
