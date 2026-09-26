import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Compass, Ticket, Users, Activity, Coins, ShoppingBag,
  MessageSquare, Bell, User, HelpCircle, ShieldCheck, Dumbbell, Calendar,
  FileText, Award, CreditCard, PieChart, Settings, LogOut, CheckSquare, Sparkles, FolderKanban
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthContext";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = false, onClose }) => {
  const { user, logout, dashboardState } = useAuth();
  const location = useLocation();

  const role = user?.role || "member";
  const isDirectOnly = dashboardState === "DIRECT_ACTIVE" || dashboardState === "DIRECT_EXPIRED";

  // Role-based navigation dynamic generator
  const getNavItems = (): NavItem[] => {
    if (role === "admin") {
      return [
        { label: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "Users Directory", path: "/admin/users", icon: <Users className="w-4 h-4" /> },
        { label: "Owner Verifications", path: "/admin/verifications", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "Partner Gyms", path: "/admin/gyms", icon: <Dumbbell className="w-4 h-4" /> },
        { label: "Subscription Plans", path: "/admin/plans", icon: <Ticket className="w-4 h-4" /> },
        { label: "Coins Economy", path: "/admin/coins", icon: <Coins className="w-4 h-4" /> },
        { label: "Payments & Payouts", path: "/admin/payments", icon: <CreditCard className="w-4 h-4" /> },
        { label: "Audit Logs", path: "/admin/audit", icon: <FileText className="w-4 h-4" /> },
        { label: "System Settings", path: "/admin/settings", icon: <Settings className="w-4 h-4" /> },
      ];
    }

    if (role === "owner") {
      return [
        { label: "Dashboard", path: "/owner", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "My Gym", path: "/owner/gym", icon: <Dumbbell className="w-4 h-4" /> },
        { label: "Direct Members", path: "/owner/members", icon: <Users className="w-4 h-4" /> },
        { label: "Trainers Roster", path: "/owner/trainers", icon: <User className="w-4 h-4" /> },
        { label: "Check-in History", path: "/owner/checkins", icon: <Activity className="w-4 h-4" /> },
        { label: "Pricing & Plans", path: "/owner/pricing", icon: <CreditCard className="w-4 h-4" /> },
        { label: "Verification Status", path: "/owner/verification", icon: <ShieldCheck className="w-4 h-4" /> },
        { label: "Payout Ledger", path: "/owner/payouts", icon: <PieChart className="w-4 h-4" /> },
        { label: "Settings", path: "/owner/settings", icon: <Settings className="w-4 h-4" /> },
      ];
    }

    if (role === "trainer") {
      return [
        { label: "Dashboard", path: "/trainer", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "Assigned Clients", path: "/trainer/clients", icon: <Users className="w-4 h-4" /> },
        { label: "PT Sessions", path: "/trainer/sessions", icon: <Calendar className="w-4 h-4" /> },
        { label: "Workout Plans", path: "/trainer/plans", icon: <FolderKanban className="w-4 h-4" /> },
        { label: "Client Progress", path: "/trainer/progress", icon: <Activity className="w-4 h-4" /> },
        { label: "My Profile", path: "/trainer/profile", icon: <User className="w-4 h-4" /> },
      ];
    }

    // Direct Only Member
    if (isDirectOnly) {
      return [
        { label: "Dashboard", path: "/member", icon: <LayoutDashboard className="w-4 h-4" /> },
        { label: "My Gym Access", path: "/member/gym-access", icon: <Dumbbell className="w-4 h-4" /> },
        { label: "Assigned Trainer", path: "/member/trainer", icon: <User className="w-4 h-4" /> },
        { label: "Workout Plan", path: "/member/workouts", icon: <FolderKanban className="w-4 h-4" /> },
        { label: "Progress History", path: "/member/progress", icon: <Activity className="w-4 h-4" /> },
        { label: "My Profile", path: "/member/profile", icon: <User className="w-4 h-4" /> },
      ];
    }

    // Default: Network Member
    return [
      { label: "Dashboard", path: "/member", icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: "Gym Discovery", path: "/member/discovery", icon: <Compass className="w-4 h-4" /> },
      { label: "Network Pass", path: "/member/pass", icon: <Ticket className="w-4 h-4" /> },
      { label: "Trainers & PT", path: "/member/trainers", icon: <Users className="w-4 h-4" /> },
      { label: "My Activity", path: "/member/activity", icon: <Activity className="w-4 h-4" /> },
      { label: "GYMTwiq Coins", path: "/member/coins", icon: <Coins className="w-4 h-4" /> },
      { label: "Fitness Store", path: "/member/store", icon: <ShoppingBag className="w-4 h-4" /> },
      { label: "Profile", path: "/member/profile", icon: <User className="w-4 h-4" /> },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`w-64 bg-gymDarkSecondary border-r border-gymBorder flex flex-col justify-between h-screen fixed inset-y-0 left-0 z-40 md:sticky md:top-0 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-gymBorder/60 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gymOrange flex items-center justify-center font-extrabold text-white text-lg shadow-lg">
              GT
            </div>
            <div>
              <span className="font-extrabold text-lg text-gymTextPrimary tracking-tight block leading-tight">
                GYMT<span className="text-gymOrange">wiq</span>
              </span>
              <span className="text-[10px] text-gymTextMuted uppercase tracking-widest block font-medium">
                {role.toUpperCase()} PORTAL
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/member" && item.path !== "/owner" && item.path !== "/trainer" && item.path !== "/admin" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "sidebar-active-item bg-gymCardElevated text-gymTextPrimary shadow-md"
                    : "text-gymTextSecondary hover:text-gymTextPrimary hover:bg-gymCard/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-gymOrange" : "text-gymTextMuted"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge ? (
                  <span className="bg-gymOrange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Promotional Card & User Quick Action */}
      <div className="p-4 border-t border-gymBorder/60">
        <div className="card-3d-level1 p-3.5 mb-3 text-xs">
          <div className="flex items-center gap-2 mb-1.5 text-gymOrange font-bold">
            <Sparkles className="w-4 h-4" />
            <span>Stronger Together</span>
          </div>
          <p className="text-[11px] text-gymTextMuted leading-relaxed mb-2">
            One Network. Endless Possibilities.
          </p>
          <button
            onClick={() => logout()}
            className="w-full py-1.5 px-3 rounded-lg bg-gymSurface hover:bg-gymCard text-gymTextSecondary hover:text-gymError border border-gymBorder text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};
