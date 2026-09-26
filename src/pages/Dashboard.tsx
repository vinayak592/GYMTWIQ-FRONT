import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../app/providers/AuthContext";

export const Dashboard: React.FC = () => {
  const { user, loading, getRedirectForRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate(getRedirectForRole(user.role), { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    }
  }, [user, loading, navigate, getRedirectForRole]);

  return (
    <div className="min-h-screen bg-gymDark flex items-center justify-center text-gymTextPrimary">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gymOrange" />
    </div>
  );
};

export default Dashboard;
