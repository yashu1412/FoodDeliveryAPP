import "./Avatar.css";

export default function Avatar({ src, alt, initials, size = "md", className = "", ...props }) {
  const sizes = {
    sm: "avatar-sm",
    md: "avatar-md",
    lg: "avatar-lg",
    xl: "avatar-xl",
  };

  return (
    <div className={`avatar ${sizes[size]} ${className}`} {...props}>
      {src ? (
        <img src={src} alt={alt} className="avatar-image" />
      ) : (
        <span className="avatar-initials">{initials}</span>
      )}
    </div>
  );
}
