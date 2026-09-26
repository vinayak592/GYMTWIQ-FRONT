import React, { useState, useEffect } from "react";
import { Search, Bell, User, Coins, LogOut, ChevronDown, Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { CoinBalanceInfo } from "../../types";

export const Header: React.FC<{
  onToggleSidebar?: () => void;
  title?: string;
}> = ({ onToggleSidebar, title }) => {
  const { user, logout } = useAuth();
  const [coinsInfo, setCoinsInfo] = useState<CoinBalanceInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const role = user?.role || "member";
  const isMemberRole = role === "member";

  // Fetch Live Coin Balance ONLY for Member/Direct Member roles
  useEffect(() => {
    if (isMemberRole) {
      api.getCoinBalance()
        .then((res) => setCoinsInfo(res))
        .catch(() => setCoinsInfo(null));
    }
  }, [isMemberRole]);

  return (
    <header className="h-16 bg-gymDarkSecondary border-b border-gymBorder px-4 lg:px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile Toggle & Context Title / Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-xl bg-gymSurface text-gymTextSecondary hover:text-gymTextPrimary border border-gymBorder"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title ? (
          <h1 className="text-base lg:text-lg font-bold text-gymTextPrimary tracking-wide">
            {title}
          </h1>
        ) : (
          <div className="relative hidden sm:block w-64 lg:w-80">
            <Search className="w-4 h-4 text-gymTextMuted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gyms, trainers, activities..."
              className="w-full pl-9 pr-4 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary focus:outline-none focus:border-gymOrange/60 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Right: Actions, Coins Pill (Members Only), Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Live Coins Pill - Strict Role Rule (Member Only) */}
        {isMemberRole && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gymCard border border-gymBorder text-xs font-semibold">
            <span className="text-base">🪙</span>
            <span className="text-gymTextPrimary">
              {coinsInfo ? coinsInfo.coinBalance.toLocaleString() : "—"}
            </span>
            <span className="text-[10px] text-gymTextMuted uppercase hidden sm:inline">Coins</span>
          </div>
        )}

        {/* Notifications Icon */}
        <button className="p-2 rounded-xl bg-gymCard border border-gymBorder text-gymTextSecondary hover:text-gymOrange relative transition-colors">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-gymOrange absolute top-1.5 right-1.5 ring-2 ring-gymDarkSecondary" />
        </button>

        {/* Profile Avatar & Role Indicator Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-gymCard border border-gymBorder hover:border-gymOrange/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-gymOrange/20 border border-gymOrange/40 flex items-center justify-center font-bold text-gymOrange text-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-semibold text-gymTextPrimary block leading-tight truncate max-w-[100px]">
                {user?.name || "User Account"}
              </span>
              <span className="text-[10px] font-medium text-gymOrange block leading-tight uppercase">
                {role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gymTextMuted" />
          </button>

          {/* Menu Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gymCardElevated border border-gymBorder rounded-xl shadow-2xl p-1.5 z-50">
              <div className="px-3 py-2 border-b border-gymBorder/60 mb-1">
                <span className="text-xs font-bold text-gymTextPrimary block truncate">{user?.name}</span>
                <span className="text-[10px] text-gymTextMuted block truncate">{user?.email}</span>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full text-left px-3 py-2 text-xs font-medium text-gymError hover:bg-gymError/10 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
