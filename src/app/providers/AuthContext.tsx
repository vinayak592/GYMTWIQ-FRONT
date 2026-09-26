import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Entitlement, DashboardState } from "../../types";
import { api } from "../../api";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  error: string | null;
  hasNetworkEntitlement: boolean;
  hasDirectEntitlement: boolean;
  hasExpiredDirectEntitlement: boolean;
  directEntitlements: Entitlement[];
  latestDirectEntitlement: Entitlement | null;
  dashboardState: DashboardState;
  primaryEntitlementType: "NETWORK" | "DIRECT" | "NONE";
  login: (email: string, pass: string) => Promise<any>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  getRedirectForRole: (role: string, entitlementType?: string) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const ROLE_PATHS: Record<string, string> = {
  admin: "/admin",
  owner: "/owner",
  trainer: "/trainer",
  member: "/member",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("gymtwiq_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [hasNetworkEntitlement, setHasNetworkEntitlement] = useState(false);
  const [hasDirectEntitlement, setHasDirectEntitlement] = useState(false);
  const [hasExpiredDirectEntitlement, setHasExpiredDirectEntitlement] = useState(false);
  const [directEntitlements, setDirectEntitlements] = useState<Entitlement[]>([]);
  const [latestDirectEntitlement, setLatestDirectEntitlement] = useState<Entitlement | null>(null);
  const [dashboardState, setDashboardState] = useState<DashboardState>("NONE");
  const [primaryEntitlementType, setPrimaryEntitlementType] = useState<"NETWORK" | "DIRECT" | "NONE">("NONE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntitlements = async () => {
    try {
      const data = await api.getMyEntitlements();
      setHasNetworkEntitlement(data.hasNetworkEntitlement);
      setHasDirectEntitlement(data.hasDirectEntitlement);
      setHasExpiredDirectEntitlement(data.hasExpiredDirectEntitlement);
      setDirectEntitlements(data.directEntitlements || []);
      setLatestDirectEntitlement(data.latestDirectEntitlement || null);
      setDashboardState(data.dashboardState || "NONE");
      setPrimaryEntitlementType(data.primaryEntitlementType);
    } catch (e) {
      console.warn("Could not fetch entitlements", e);
    }
  };

  const refreshProfile = async () => {
    try {
      const u = await api.getMe();
      setUser(u);
      localStorage.setItem("gymtwiq_user", JSON.stringify(u));
      await fetchEntitlements();
    } catch (e: any) {
      console.warn("Could not refresh profile", e);
      if (e?.status === 401 || e?.message?.includes("Invalid token") || e?.message?.includes("Signature verification failed")) {
        setUser(null);
        localStorage.removeItem("gymtwiq_access_token");
        localStorage.removeItem("gymtwiq_refresh_token");
        localStorage.removeItem("gymtwiq_user");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("gymtwiq_access_token");
    if (token) {
      refreshProfile();
    }
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, pass);
      const authData = res.data;
      localStorage.setItem("gymtwiq_access_token", authData.accessToken);
      localStorage.setItem("gymtwiq_refresh_token", authData.refreshToken);
      localStorage.setItem("gymtwiq_user", JSON.stringify(authData.user));
      setUser(authData.user);
      await fetchEntitlements();
      return authData;
    } catch (err: any) {
      setError(err.message || "Failed to log in");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      api.logout();
    } catch {}
    setUser(null);
    setHasNetworkEntitlement(false);
    setHasDirectEntitlement(false);
    setHasExpiredDirectEntitlement(false);
    setDirectEntitlements([]);
    setLatestDirectEntitlement(null);
    setDashboardState("NONE");
    setPrimaryEntitlementType("NONE");
    localStorage.removeItem("gymtwiq_access_token");
    localStorage.removeItem("gymtwiq_refresh_token");
    localStorage.removeItem("gymtwiq_user");
  };

  const getRedirectForRole = (role: string, entType?: string) => {
    if (role === "admin") return "/admin";
    if (role === "owner") return "/owner";
    if (role === "trainer") return "/trainer";
    return "/member";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        error,
        hasNetworkEntitlement,
        hasDirectEntitlement,
        hasExpiredDirectEntitlement,
        directEntitlements,
        latestDirectEntitlement,
        dashboardState,
        primaryEntitlementType,
        login,
        logout,
        refreshProfile,
        getRedirectForRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
