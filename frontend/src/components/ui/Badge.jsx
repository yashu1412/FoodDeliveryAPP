import "./Badge.css";

export default function Badge({ children, variant = "default", className = "", ...props }) {
  const variants = {
    default: "badge-default",
    primary: "badge-primary",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger",
    info: "badge-info",
  };

  return (
    <span className={`badge ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
