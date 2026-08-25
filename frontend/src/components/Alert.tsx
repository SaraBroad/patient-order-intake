interface AlertProps {
  variant?: "success" | "error";
  message: string;
  onDismiss?: () => void;
}

export default function Alert({ variant = "error", message, onDismiss }: AlertProps) {
  const icon =
    variant === "success" ? (
      <svg className="alert__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : (
      <svg className="alert__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 1.5L14.5 13H1.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8 6v3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
      </svg>
    );

  return (
    <div className={`alert alert--${variant}`} role="alert">
      {icon}
      <span className="alert__message">{message}</span>
      {onDismiss && (
        <button className="alert__dismiss" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}
