import { Link } from "react-router-dom";

export default function AuthBrandPanel({ headline, subtext }) {
  return (
    <aside className="auth-brand-panel" aria-hidden="true">
      <div className="auth-brand-content">
        <Link to="/" className="auth-brand-logo">
          <span className="auth-brand-logo-icon">🌶️</span>
          <span className="auth-brand-logo-text">SwiftEats</span>
        </Link>
        <h1 className="auth-brand-headline">{headline}</h1>
        <p className="auth-brand-subtext">{subtext}</p>
        <ul className="auth-brand-features">
          <li>
            <span className="auth-brand-dot" />
            Order from top restaurants near you
          </li>
          <li>
            <span className="auth-brand-dot" />
            Live tracking with real-time updates
          </li>
          <li>
            <span className="auth-brand-dot" />
            Fast delivery to your doorstep
          </li>
        </ul>
      </div>
    </aside>
  );
}
