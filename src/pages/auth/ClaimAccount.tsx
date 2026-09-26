import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { PrimaryButton } from "../../components/ui/Buttons";
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export const ClaimAccount: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claimedUser, setClaimedUser] = useState<any | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!token) {
      return setError("Claim token is missing from the URL");
    }

    setError(null);
    setLoading(true);
    try {
      const res = await api.claimAccount(token, password);
      const authData = res.data;
      localStorage.setItem("gymtwiq_access_token", authData.accessToken);
      localStorage.setItem("gymtwiq_refresh_token", authData.refreshToken);
      localStorage.setItem("gymtwiq_user", JSON.stringify(authData.user));
      setClaimedUser(authData.user);
      setTimeout(() => {
        navigate("/member");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to activate account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gymDark text-gymTextPrimary flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      <div className="w-full max-w-sm card-3d-level2 p-6 sm:p-8 space-y-5 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gymOrange/15 border border-gymOrange/30 text-gymOrange text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" /> Claim Token Verified
        </div>

        <div>
          <h1 className="text-xl font-extrabold text-gymTextPrimary">Activate Direct Pass</h1>
          <p className="text-xs text-gymTextMuted mt-1">
            Your gym owner registered you as a Direct Member. Set a password to activate your portal.
          </p>
        </div>

        {claimedUser ? (
          <div className="p-4 rounded-xl bg-gymSuccess/15 border border-gymSuccess/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-gymSuccess mx-auto" />
            <h2 className="text-sm font-bold text-gymTextPrimary">Account Successfully Claimed!</h2>
            <p className="text-xs text-gymTextMuted">Redirecting to your membership portal...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 rounded-xl bg-gymError/15 border border-gymError/30 text-gymError text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleClaim} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Create Password</label>
                <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5">
                  <Lock className="w-4 h-4 text-gymTextMuted mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="text-gymTextMuted hover:text-gymTextPrimary">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Confirm Password</label>
                <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5">
                  <Lock className="w-4 h-4 text-gymTextMuted mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                  />
                </div>
              </div>

              <PrimaryButton fullWidth isLoading={loading} type="submit" icon={<ArrowRight className="w-4 h-4" />}>
                Activate Account Portal
              </PrimaryButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
