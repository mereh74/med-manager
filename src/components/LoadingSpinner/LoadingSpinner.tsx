import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  message?: string;
  className?: string;
}

function LoadingSpinner({
  size = "medium",
  message = "Loading...",
  className = "",
}: LoadingSpinnerProps) {
  return (
    <div className={`loading-container ${className}`}>
      <div className={`spinner spinner-${size}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;
