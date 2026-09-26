import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { PrimaryButton } from "../../components/ui/Buttons";
import { ArrowRight, Lock, Mail, Sparkles, Eye, EyeOff } from "lucide-react";

export const Login: React.FC = () => {
  const { login, getRedirectForRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      navigate(getRedirectForRole(res.user.role));
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gymDark text-gymTextPrimary flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gymOrange blur-[140px] opacity-15 pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gymOrange/15 border border-gymOrange/30 text-gymOrange text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hybrid Gym Network Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gymTextPrimary">
            GYMT<span className="text-gymOrange">wiq</span>
          </h1>
          <p className="text-xs text-gymTextSecondary max-w-sm mx-auto">
            One network subscription for multi-city gym portability, automated metering, and verified facility operations.
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="card-3d-level2 p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-xl font-extrabold text-gymTextPrimary">Account Sign In</h2>
            <p className="text-xs text-gymTextMuted mt-1">Enter your credentials to access your portal</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-gymError/15 border border-gymError/30 text-gymError text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gymTextMuted mb-1.5">
                Email Address
              </label>
              <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5 focus-within:border-gymOrange transition-colors">
                <Mail className="w-4 h-4 text-gymTextMuted mr-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gymTextMuted mb-1.5">
                Password
              </label>
              <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5 focus-within:border-gymOrange transition-colors">
                <Lock className="w-4 h-4 text-gymTextMuted mr-2.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gymTextMuted hover:text-gymTextPrimary transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <PrimaryButton fullWidth isLoading={loading} type="submit" icon={<ArrowRight className="w-4 h-4" />}>
              Sign In to Portal
            </PrimaryButton>
          </form>

          <div className="pt-2 text-center text-xs text-gymTextMuted border-t border-gymBorder/40">
            New member?{" "}
            <Link to="/register" className="text-gymOrange hover:underline font-semibold">
              Create a GYMTwiq account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
