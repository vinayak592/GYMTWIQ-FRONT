import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  isLoading,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base font-bold rounded-xl gap-2.5",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`orange-glow-button flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none ${
        sizeClasses[size]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  isLoading,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-sm font-semibold rounded-xl gap-2",
    lg: "px-6 py-3.5 text-base font-bold rounded-xl gap-2.5",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`bg-gymSurface hover:bg-gymCardElevated text-gymTextPrimary border border-gymBorder hover:border-gymOrange/40 transition-all duration-200 flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        sizeClasses[size]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-gymTextSecondary border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};

export const DangerButton: React.FC<ButtonProps> = ({
  children,
  icon,
  isLoading,
  fullWidth = false,
  size = "md",
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`bg-gymError/10 hover:bg-gymError/20 text-gymError border border-gymError/30 px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 disabled:opacity-50 ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-gymError border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
};

export const StatusBadge: React.FC<{
  status: "ACTIVE" | "PENDING" | "EXPIRED" | "REJECTED" | "SUPERSEDED" | "CANCELLED" | string;
  label?: string;
}> = ({ status, label }) => {
  const s = status.toUpperCase();
  let bg = "bg-gymTextMuted/20 text-gymTextSecondary border-gymTextMuted/30";

  if (s === "ACTIVE" || s === "APPROVED" || s === "FULFILLED" || s === "CAPTURED") {
    bg = "bg-gymSuccess/15 text-gymSuccess border-gymSuccess/30";
  } else if (s === "PENDING" || s === "INITIALIZING" || s === "VERIFYING") {
    bg = "bg-gymWarning/15 text-gymWarning border-gymWarning/30";
  } else if (s === "EXPIRED" || s === "REJECTED" || s === "FAILED" || s === "SUSPENDED" || s === "CANCELLED") {
    bg = "bg-gymError/15 text-gymError border-gymError/30";
  } else if (s === "SUPERSEDED" || s === "ARCHIVED") {
    bg = "bg-gymTextMuted/15 text-gymTextMuted border-gymTextMuted/30";
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${bg} inline-flex items-center gap-1`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{label || status}</span>
    </span>
  );
};
