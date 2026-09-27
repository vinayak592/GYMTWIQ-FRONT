import React from "react";
import { Coins, ChevronRight, ShieldCheck, MapPin, Star, Award, ShoppingBag, ArrowUpRight } from "lucide-react";
import { PrimaryButton, SecondaryButton, StatusBadge } from "./Buttons";
import { Gym, TrainerProfile, Product, Subscription, Entitlement } from "../../types";

export const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}> = ({ children, className = "", elevated = false }) => {
  return (
    <div className={`${elevated ? "card-3d-level2" : "card-3d-level1"} p-5 ${className}`}>
      {children}
    </div>
  );
};

export const SectionCard: React.FC<{
  title: string;
  actionText?: string;
  onAction?: () => void;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}> = ({ title, actionText, onAction, children, className = "", icon }) => {
  return (
    <div className={`card-3d-level1 p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gymBorder/60">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gymOrange">{icon}</span>}
          <h2 className="text-base font-semibold text-gymTextPrimary tracking-wide">{title}</h2>
        </div>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className="text-xs font-semibold text-gymOrange hover:text-gymOrangeBright flex items-center gap-1 transition-colors"
          >
            <span>{actionText}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
};

export const CoinCard: React.FC<{
  balance: number;
  weeklyGain?: number;
  onTopUp: () => void;
}> = ({ balance, weeklyGain = 250, onTopUp }) => {
  return (
    <div className="card-3d-featured p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gymOrange/20 border border-gymOrange/40 text-gymOrange flex items-center justify-center text-xl shadow-lg">
            🪙
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gymTextMuted uppercase tracking-wider">
              GYMTwiq Coins
            </h3>
            <span className="text-xs font-medium text-gymSuccess flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +{weeklyGain} this week
            </span>
          </div>
        </div>
      </div>

      <div className="my-3">
        <div className="text-3xl font-extrabold text-gymTextPrimary tracking-tight">
          {balance.toLocaleString()} <span className="text-sm font-normal text-gymTextMuted">Coins</span>
        </div>
      </div>

      <PrimaryButton fullWidth size="md" onClick={onTopUp} icon={<Coins className="w-4 h-4" />}>
        Top Up Coins
      </PrimaryButton>
    </div>
  );
};

export const GymCard: React.FC<{
  gym: Gym;
  onSelect: (gym: Gym) => void;
}> = ({ gym, onSelect }) => {
  const lowestRate = gym.lowestDailyRate ?? 50;

  return (
    <div className="card-3d-level1 p-4 flex flex-col justify-between hover:border-gymOrange/40 transition-all">
      <div>
        <div className="h-32 rounded-xl bg-gymSurface relative overflow-hidden mb-3 border border-gymBorder">
          <img
            src={gym.coverImage || (gym.images && gym.images[0]) || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80"}
            alt={gym.name}
            className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 bg-gymDark/80 backdrop-blur-md border border-gymBorder px-2 py-0.5 rounded-full text-xs font-bold text-gymOrange flex items-center gap-1">
            <Star className="w-3 h-3 fill-gymOrange text-gymOrange" />
            {gym.rating || 4.8}
          </div>
        </div>

        <h3 className="text-sm font-bold text-gymTextPrimary truncate">{gym.name}</h3>
        <p className="text-xs text-gymTextSecondary flex items-center gap-1 mt-0.5 truncate">
          <MapPin className="w-3 h-3 text-gymOrange flex-shrink-0" />
          {gym.address || gym.city}
        </p>

        <div className="mt-3 pt-2 border-t border-gymBorder/40 flex items-center justify-between text-xs">
          <span className="text-gymTextMuted">Daily Rate</span>
          <span className="font-bold text-gymOrange">₹{lowestRate.toFixed(2)}/day</span>
        </div>
      </div>

      <div className="mt-3">
        <SecondaryButton fullWidth size="sm" onClick={() => onSelect(gym)}>
          View Details →
        </SecondaryButton>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<{
  product: Product;
  onBuy: (product: Product) => void;
}> = ({ product, onBuy }) => {
  return (
    <div className="card-3d-level1 p-4 flex flex-col justify-between hover:border-gymOrange/40 transition-all">
      <div>
        <div className="h-28 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-center mb-3">
          <ShoppingBag className="w-10 h-10 text-gymOrange/60" />
        </div>
        <h4 className="text-xs font-bold text-gymTextPrimary truncate">{product.name}</h4>
        <p className="text-[11px] text-gymTextMuted line-clamp-1 mt-0.5">{product.cat || "Fitness Gear"}</p>
      </div>

      <div className="mt-3">
        <div className="text-xs font-bold text-gymOrange mb-2">
          🪙 {product.coins} Coins
        </div>
        <PrimaryButton fullWidth size="sm" onClick={() => onBuy(product)}>
          Redeem Product
        </PrimaryButton>
      </div>
    </div>
  );
};
