import { Check } from "lucide-react";
import "./StatusStepper.css";

const steps = [
  { key: "confirmed", label: "Confirmed", match: ["pending", "confirmed"] },
  { key: "preparing", label: "Preparing", match: ["preparing"] },
  { key: "picked", label: "Picked Up", match: ["picked"] },
  { key: "on_the_way", label: "On the Way", match: ["on_the_way"] },
  { key: "delivered", label: "Delivered", match: ["delivered"] },
];

const getStepIndex = (status) => {
  const idx = steps.findIndex((s) => s.match.includes(status));
  return idx >= 0 ? idx : 0;
};

export default function StatusStepper({ currentStatus }) {
  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="status-stepper">
      {steps.map((step, index) => {
        const isComplete = index < currentIndex;
        const isActive = index === currentIndex;
        const isReached = index <= currentIndex;

        return (
          <div key={step.key} className="status-step">
            <div
              className={`status-step-circle ${isComplete ? "completed" : ""} ${isActive && !isComplete ? "active" : ""}`}
            >
              {isComplete ? <Check size={18} strokeWidth={3} /> : <span>{index + 1}</span>}
            </div>
            <span className={`status-step-label ${isActive ? "active" : ""}`}>{step.label}</span>
            {index < steps.length - 1 && (
              <div className={`status-step-line ${index < currentIndex ? "active" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
