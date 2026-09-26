import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, ROLE_PATHS } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { Notification } from "../../types";
import { LogOut, ChevronDown, Shield, Dumbbell, User, Ticket, MapPin, Bell } from "lucide-react";

export const UserBanner: React.FC = () => {
  const { user, logout, dashboardState } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then((data) => setNotifications(data || []))
        .catch(() => {});
    }
  }, [user]);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch {}
  };

  if (!user) return null;

  const isDirect = dashboardState === "DIRECT_ACTIVE" || dashboardState === "DIRECT_EXPIRED";
  const isDual = dashboardState === "DIRECT_AND_NETWORK";

  const roleConfigs: Record<string, { title: string; bg: string; text: string; border: string; icon: any }> = {
    admin: {
      title: "SuperAdmin",
      bg: "#12140F",
      text: "#D4F447",
      border: "#D4F447",
      icon: Shield,
    },
    owner: {
      title: "Gym Owner",
      bg: "#20241C",
      text: "#FFFFFF",
      border: "#9DB423",
      icon: Dumbbell,
    },
    trainer: {
      title: "Fitness Trainer",
      bg: "#1C2420",
      text: "#47F4C8",
      border: "#23B48F",
      icon: Dumbbell,
    },
    member: {
      title: isDual ? "Network + Direct" : isDirect ? "Direct Member" : "Network Member",
      bg: isDual ? "#1C2A18" : isDirect ? "#2B1D0E" : "#1A2238",
      text: isDual ? "#D4F447" : isDirect ? "#FF9A3C" : "#8EA4FF",
      border: isDual ? "#D4F447" : isDirect ? "#FF9A3C" : "#4F5DFF",
      icon: isDirect ? Ticket : User,
    },
  };

  const currentConfig = roleConfigs[user.role] || roleConfigs.member;
  const RoleIcon = currentConfig.icon;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#12140F]/95 backdrop-blur border-b border-[#232920] px-4 sm:px-6 lg:px-8 xl:px-10 py-2.5 shadow-md text-xs">
      <div className="w-full max-w-[1880px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROLE_PATHS[user.role] || "/login")}>
            <div className="w-6 h-6 rounded-lg bg-[#D4F447] flex items-center justify-center text-[#12140F] font-black text-sm">
              T
            </div>
            <span className="font-extrabold tracking-tight text-sm text-[#FFFFFF]">GYMTwiq</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#20241C] text-[#8A9C6E] font-mono border border-[#2D3525]">
              NETWORK
            </span>
          </div>

          {user.selectedCity && (
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#A0AEC0] bg-[#1E2319] px-2 py-0.5 rounded-full border border-[#2D3525]">
              <MapPin size={10} className="text-[#D4F447]" />
              <span>{user.selectedCity}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full border transition-all hover:opacity-90"
              style={{
                backgroundColor: currentConfig.bg,
                borderColor: currentConfig.border,
                color: currentConfig.text,
              }}
            >
              <RoleIcon size={12} />
              <span className="font-semibold text-[11px]">{currentConfig.title}</span>
              <span className="text-gray-400 text-[10px] hidden md:inline">({user.name})</span>
              <ChevronDown size={11} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-[#1E2319] border border-[#2F3725] rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                <div className="px-3 py-2 border-b border-[#2B3323]">
                  <p className="font-semibold text-white text-xs truncate">{user.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(ROLE_PATHS[user.role] || "/member");
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#283020] hover:text-white transition-colors"
                >
                  Dashboard Home
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-[#283020] transition-colors border-t border-[#2B3323]"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>

          {/* Real Dynamic Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              title="Notifications"
              className="p-1.5 rounded-full bg-[#1A1E16] border border-[#2D3624] text-gray-400 hover:text-white transition-colors relative"
            >
              <Bell size={13} />
              {notifications.filter((n) => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#D4F447] text-[#12140F] font-bold text-[9px] rounded-full flex items-center justify-center">
                  {notifications.filter((n) => !n.read).length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-1.5 w-72 bg-[#1E2319] border border-[#2F3725] rounded-2xl shadow-2xl overflow-hidden py-2 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#8A9C6E] border-b border-[#2B3323] flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-[#D4F447]">{notifications.filter((n) => !n.read).length} Unread</span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-[#2B3323]/50">
                  {notifications.length === 0 ? (
                    <div className="px-3 py-4 text-center text-gray-500 text-[11px]">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleMarkRead(n.id)}
                        className={`px-3 py-2 text-xs hover:bg-[#283020] transition-colors cursor-pointer ${
                          !n.read ? "bg-[#202819]" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`font-semibold text-[11px] ${!n.read ? "text-white" : "text-gray-400"}`}>
                            {n.title || "Alert"}
                          </span>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4F447] shrink-0 mt-1" />
                          )}
                        </div>
                        {n.message && <p className="text-[10px] text-gray-400 mt-0.5">{n.message}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-gray-400 hover:text-white hover:bg-[#20241C] transition-colors"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline text-[11px]">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
