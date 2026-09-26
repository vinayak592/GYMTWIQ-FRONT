import React from "react";
import { AlertCircle, RefreshCw, Layers } from "lucide-react";
import { PrimaryButton } from "./Buttons";

export const LoadingSkeleton: React.FC<{ count?: number; height?: string }> = ({
  count = 3,
  height = "h-24",
}) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} bg-gymCard rounded-2xl border border-gymBorder`} />
      ))}
    </div>
  );
};

export const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}> = ({
  title,
  description,
  icon = <Layers className="w-8 h-8 text-gymTextMuted" />,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="card-3d-level1 p-8 text-center flex flex-col items-center justify-center my-4">
      <div className="w-14 h-14 rounded-2xl bg-gymSurface border border-gymBorder flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-gymTextPrimary mb-1">{title}</h3>
      {description && <p className="text-xs text-gymTextSecondary max-w-md mb-4">{description}</p>}
      {actionLabel && onAction && (
        <PrimaryButton size="sm" onClick={onAction}>
          {actionLabel}
        </PrimaryButton>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  message: string;
  onRetry?: () => void;
}> = ({ title = "Unable to load data", message, onRetry }) => {
  return (
    <div className="card-3d-level1 p-6 border-gymError/30 bg-gymError/5 flex flex-col items-center text-center my-4">
      <AlertCircle className="w-8 h-8 text-gymError mb-2" />
      <h3 className="text-sm font-semibold text-gymTextPrimary">{title}</h3>
      <p className="text-xs text-gymTextSecondary mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gymError/20 text-gymError hover:bg-gymError/30 border border-gymError/30 flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  );
};
