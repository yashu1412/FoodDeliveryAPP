import "./Toggle.css";

export default function Toggle({ checked, onChange, disabled, className = "" }) {
  return (
    <button
      className={`toggle ${checked ? "toggle-on" : "toggle-off"} ${disabled ? "toggle-disabled" : ""} ${className}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      aria-pressed={checked}
    >
      <span className="toggle-thumb"></span>
    </button>
  );
}
