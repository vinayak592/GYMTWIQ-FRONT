import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import {
  ArrowRight, Lock, Mail, User, Phone, Sparkles, Building2,
  MapPin, FileText, UploadCloud, CheckCircle2, AlertCircle, Compass,
  Eye, EyeOff
} from "lucide-react";

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Account Type Selection
  const [accountType, setAccountType] = useState<"MEMBER" | "OWNER">("MEMBER");

  // Common Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  // Owner Specific - Gym Information
  const [gymName, setGymName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [country, setCountry] = useState("India");

  // Owner Specific - Coordinates & Location Confirmation
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locating, setLocating] = useState(false);
  const [locationConfirmed, setLocationConfirmed] = useState(true);

  // Owner Specific - License Information
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseType, setLicenseType] = useState("Trade License");
  const [availableLicenseTypes, setAvailableLicenseTypes] = useState<string[]>([
    "Trade License",
    "FSSAI / Health Trade License",
    "Commercial Establishment License",
    "Fitness Center Registration",
    "Other Official License"
  ]);
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  // Owner Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref);
    }
  }, [location]);

  useEffect(() => {
    if (accountType === "OWNER") {
      api.getSupportedLicenseTypes().then((types) => {
        if (Array.isArray(types) && types.length > 0) {
          setAvailableLicenseTypes(types);
        }
      }).catch(() => {});
    }
  }, [accountType]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude.toFixed(6)));
        setLongitude(String(pos.coords.longitude.toFixed(6)));
        setLocationConfirmed(true);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setError("Location permission denied or unavailable. Please enter coordinates manually.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (accountType === "OWNER") {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!declarationAccepted) {
        setError("You must acknowledge and accept the Owner Declaration to submit for verification.");
        return;
      }
      if (!licenseFile) {
        setError("Please upload a valid Gym License document (PDF, JPG, or PNG).");
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("accountType", "OWNER");
        formData.append("name", name.trim());
        formData.append("email", email.trim());
        formData.append("phone", phone.trim());
        formData.append("password", password);
        formData.append("gymName", gymName.trim());
        formData.append("address", address.trim());
        formData.append("city", city.trim());
        formData.append("state", state.trim());
        formData.append("pincode", pincode.trim());
        formData.append("country", country.trim());
        formData.append("latitude", latitude.trim() || "12.9716");
        formData.append("longitude", longitude.trim() || "77.5946");
        formData.append("locationConfirmed", "true");
        formData.append("licenseNumber", licenseNumber.trim());
        formData.append("licenseType", licenseType);
        formData.append("issuingAuthority", issuingAuthority.trim() || "Municipal Authority");
        formData.append("issueDate", issueDate || new Date().toISOString().split("T")[0]);
        formData.append("expiryDate", expiryDate || new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().split("T")[0]);
        formData.append("declarationAccepted", "true");
        formData.append("licenseDocument", licenseFile);

        await api.registerOwner(formData);
        await login(email, password);
        navigate("/owner");
      } catch (err: any) {
        setError(err.response?.data?.error?.message || err.message || "Owner registration failed");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        await api.register({ name, email, password, phone, role: "member", referredBy: referralCode.trim() || undefined });
        await login(email, password);
        navigate("/member");
      } catch (err: any) {
        setError(err.response?.data?.error?.message || err.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gymDark text-gymTextPrimary flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gymOrange blur-[140px] opacity-15 pointer-events-none" />

      <div className={`w-full ${accountType === "OWNER" ? "max-w-2xl" : "max-w-md"} card-3d-level2 p-6 sm:p-8 space-y-6 relative z-10 transition-all duration-300`}>
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gymOrange/15 border border-gymOrange/30 text-gymOrange text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Join GYMTwiq
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gymTextPrimary">
            {accountType === "OWNER" ? "Register Partner Gym Facility" : "Create Member Account"}
          </h1>
          <p className="text-xs text-gymTextMuted">
            {accountType === "OWNER"
              ? "Partner your gym with the GYMTwiq network (Admin verification required)"
              : "Unlock multi-city portable gym access"}
          </p>
        </div>

        {/* Account Type Selector Tabs */}
        <div className="p-1.5 rounded-2xl bg-gymSurface border border-gymBorder grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { setAccountType("MEMBER"); setError(null); }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              accountType === "MEMBER"
                ? "bg-gymOrange text-white shadow-md"
                : "text-gymTextMuted hover:text-gymTextPrimary"
            }`}
          >
            <User className="w-4 h-4" /> Member
          </button>
          <button
            type="button"
            onClick={() => { setAccountType("OWNER"); setError(null); }}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              accountType === "OWNER"
                ? "bg-gymOrange text-white shadow-md"
                : "text-gymTextMuted hover:text-gymTextPrimary"
            }`}
          >
            <Building2 className="w-4 h-4" /> Gym Owner
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-gymError/15 border border-gymError/30 text-gymError text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Credentials */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gymTextMuted mb-1">Full Name</label>
              <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5">
                <User className="w-4 h-4 text-gymTextMuted mr-2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marcus Vance"
                  className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Email Address</label>
                <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5">
                  <Mail className="w-4 h-4 text-gymTextMuted mr-2" />
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
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Phone Number</label>
                <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5">
                  <Phone className="w-4 h-4 text-gymTextMuted mr-2" />
                  <input
                    type="tel"
                    required={accountType === "OWNER"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                  />
                </div>
              </div>
            </div>

            <div className={`grid ${accountType === "OWNER" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"} gap-3`}>
              <div>
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Password</label>
                <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5 focus-within:border-gymOrange transition-colors">
                  <Lock className="w-4 h-4 text-gymTextMuted mr-2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gymTextMuted hover:text-gymTextPrimary transition-colors focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {accountType === "OWNER" && (
                <div>
                  <label className="block text-xs font-semibold text-gymTextMuted mb-1">Confirm Password</label>
                  <div className="flex items-center bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5 focus-within:border-gymOrange transition-colors">
                    <Lock className="w-4 h-4 text-gymTextMuted mr-2" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="bg-transparent outline-none flex-1 text-xs text-gymTextPrimary placeholder-gymTextMuted"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gymTextMuted hover:text-gymTextPrimary transition-colors focus:outline-none"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Owner Specific Gym & License Fields */}
          {accountType === "OWNER" && (
            <div className="space-y-4 pt-3 border-t border-gymBorder/60">
              <span className="text-xs font-bold text-gymOrange uppercase tracking-wider block">
                Gym Facility & Trade License Details
              </span>

              <div>
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Gym Name</label>
                <input
                  type="text"
                  required
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  placeholder="Apex Strength & Fitness Arena"
                  className="w-full bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5 text-xs text-gymTextPrimary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="100ft Road, 4th Block, Indiranagar"
                  className="w-full bg-gymSurface border border-gymBorder rounded-xl px-3 py-2.5 text-xs text-gymTextPrimary"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="bg-gymSurface border border-gymBorder rounded-xl px-2.5 py-2 text-xs text-gymTextPrimary" />
                <input type="text" required value={state} onChange={(e) => setState(e.target.value)} placeholder="State" className="bg-gymSurface border border-gymBorder rounded-xl px-2.5 py-2 text-xs text-gymTextPrimary" />
                <input type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="Pincode" className="bg-gymSurface border border-gymBorder rounded-xl px-2.5 py-2 text-xs text-gymTextPrimary" />
                <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="bg-gymSurface border border-gymBorder rounded-xl px-2.5 py-2 text-xs text-gymTextPrimary" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gymTextMuted mb-1">License Number</label>
                  <input type="text" required value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="BBMP-TL-2026-XXXX" className="w-full bg-gymSurface border border-gymBorder rounded-xl px-3 py-2 text-xs text-gymTextPrimary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gymTextMuted mb-1">License Type</label>
                  <select value={licenseType} onChange={(e) => setLicenseType(e.target.value)} className="w-full bg-gymSurface border border-gymBorder rounded-xl px-3 py-2 text-xs text-gymTextPrimary">
                    {availableLicenseTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gymTextMuted mb-1">Upload License Document (PDF/JPG/PNG)</label>
                <div className="border border-dashed border-gymBorder hover:border-gymOrange rounded-xl p-3 bg-gymSurface transition flex items-center gap-3">
                  <UploadCloud className="w-6 h-6 text-gymOrange flex-shrink-0" />
                  <input
                    type="file"
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setLicenseFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-gymTextMuted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gymCard file:text-gymOrange"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-gymSurface border border-gymBorder cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-0.5 accent-gymOrange h-4 w-4 rounded"
                />
                <span className="text-xs text-gymTextSecondary leading-relaxed">
                  I confirm that the provided gym license details are accurate and that I am authorized to register this facility.
                </span>
              </label>
            </div>
          )}

          <PrimaryButton fullWidth isLoading={loading} type="submit" icon={<ArrowRight className="w-4 h-4" />}>
            {accountType === "OWNER" ? "Submit Facility Verification" : "Create Account"}
          </PrimaryButton>
        </form>

        <div className="pt-2 text-center text-xs text-gymTextMuted border-t border-gymBorder/40">
          Already have an account?{" "}
          <Link to="/login" className="text-gymOrange hover:underline font-semibold">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
