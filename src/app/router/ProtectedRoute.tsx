import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth, ROLE_PATHS } from "../providers/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredEntitlement?: "NETWORK" | "DIRECT";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requiredEntitlement,
}) => {
  const { user, loading, hasNetworkEntitlement, directEntitlements } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#12140F] flex items-center justify-center text-[#F7F5EE]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4F447]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallbackPath = ROLE_PATHS[user.role] || "/login";
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
