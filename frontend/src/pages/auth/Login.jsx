import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import { api } from "../../utils/api";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import AuthBrandPanel from "./AuthBrandPanel";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { applySession } = useAppContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await api.auth.signin(formData);
      applySession(data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <AuthBrandPanel
        headline="Welcome back, foodie!"
        subtext="Sign in to track orders, save your favourites, and get food delivered fast."
      />

      <div className="auth-content">
        <div className="auth-content-inner">
          <Card className="auth-card">
            <div className="auth-header">
              <Link to="/" className="auth-logo">
                <span className="auth-logo-icon">🌶️</span>
                <span className="auth-logo-text">SwiftEats</span>
              </Link>
              <p className="auth-tagline">Hot food. Swift delivery.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <h2 className="auth-title">Sign in</h2>

              {error && <div className="auth-error">{error}</div>}

              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div className="password-field">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  icon={Lock}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="auth-links">
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight size={18} />}
              </Button>
            </form>

            <div className="auth-divider">
              <span className="auth-divider-text">or</span>
            </div>

            <Button variant="outline" size="lg" className="google-button" type="button">
              <span className="google-icon">G</span>
              Continue with Google
            </Button>

            <p className="auth-footer">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign Up
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
