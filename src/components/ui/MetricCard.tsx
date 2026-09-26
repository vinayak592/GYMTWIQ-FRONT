import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtext,
  change,
  isPositive = true,
  icon,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`card-3d-level1 p-5 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:border-gymOrange/50" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gymOrange/10 border border-gymOrange/20 text-gymOrange flex items-center justify-center shadow-inner">
          {icon}
        </div>
        {change && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5 border ${
              isPositive
                ? "bg-gymSuccess/15 text-gymSuccess border-gymSuccess/30"
                : "bg-gymError/15 text-gymError border-gymError/30"
            }`}
          >
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>

      <div>
        <span className="text-xs font-medium text-gymTextMuted uppercase tracking-wider block mb-1">
          {title}
        </span>
        <div className="text-2xl lg:text-3xl font-bold text-gymTextPrimary tracking-tight">
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-gymTextSecondary mt-1 truncate">{subtext}</p>
        )}
      </div>
    </div>
  );
};
