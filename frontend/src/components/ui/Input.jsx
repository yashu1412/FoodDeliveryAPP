import "./Input.css";

export default function Input({ label, error, icon: Icon, className = "", ...props }) {
  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {Icon && <Icon className="input-icon" size={20} />}
        <input className={`input-field ${error ? "input-error" : ""}`} {...props} />
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
}
