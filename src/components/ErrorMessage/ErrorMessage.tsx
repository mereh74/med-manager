import "./ErrorMessage.css";

interface ErrorMessageProps {
  message: string;
  variant?: "error" | "warning" | "info";
  onRetry?: () => void;
  className?: string;
}

function ErrorMessage({
  message,
  variant = "error",
  onRetry,
  className = "",
}: ErrorMessageProps) {
  return (
    <div className={`error-container error-${variant} ${className}`}>
      <div className="error-icon">
        {variant === "error" && "⚠️"}
        {variant === "warning" && "⚠️"}
        {variant === "info" && "ℹ️"}
      </div>
      <div className="error-content">
        <p className="error-message">{message}</p>
        {onRetry && (
          <button
            className="error-retry-button"
            onClick={onRetry}
            type="button"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
