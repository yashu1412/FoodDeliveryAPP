import { Check } from "lucide-react";
import "./StatusStepper.css";

const steps = [
  { key: "pending", label: "Confirmed" },
  { key: "confirmed", label: "Preparing" },
  { key: "picked", label: "Picked Up" },
  { key: "on_the_way", label: "On the Way" },
  { key: "delivered", label: "Delivered" },
];

export default function StatusStepper({ currentStatus }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div className="status-stepper">
      {steps.map((step, index) => (
        <div key={step.key} className="status-step">
          <div className={`status-step-circle ${index <= currentIndex ? "active" : ""}`}>
            {index < currentIndex ? (
              <Check size={16} />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <span className={`status-step-label ${index <= currentIndex ? "active" : ""}`}>
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <div className={`status-step-line ${index < currentIndex ? "active" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}
