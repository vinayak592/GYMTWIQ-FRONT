import React, { useState } from "react";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { OwnerVerificationStatusResponse } from "../../types";
import {
  ShieldAlert, Clock, CheckCircle2, XCircle, AlertTriangle,
  MapPin, FileText, Building2, RefreshCw, ArrowRight, UploadCloud,
  LogOut, Shield, ChevronRight
} from "lucide-react";

interface OwnerPendingViewProps {
  statusData: OwnerVerificationStatusResponse;
  onRefresh: () => void;
}

export const OwnerPendingView: React.FC<OwnerPendingViewProps> = ({ statusData, onRefresh }) => {
  const { user, logout } = useAuth();
  const [resubmitOpen, setResubmitOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Resubmission Form State
  const [gymName, setGymName] = useState(statusData.gymName || "");
  const [address, setAddress] = useState(statusData.address || "");
  const [city, setCity] = useState(statusData.city || "");
  const [state, setState] = useState(statusData.state || "");
  const [pincode, setPincode] = useState(statusData.pincode || "");
  const [latitude, setLatitude] = useState(String(statusData.latitude || ""));
  const [longitude, setLongitude] = useState(String(statusData.longitude || ""));
  const [licenseNumber, setLicenseNumber] = useState(statusData.licenseNumber || "");
  const [licenseType, setLicenseType] = useState(statusData.licenseType || "Trade License");
  const [issuingAuthority, setIssuingAuthority] = useState(statusData.issuingAuthority || "");
  const [expiryDate, setExpiryDate] = useState(statusData.licenseExpiryDate || "");
  const [newFile, setNewFile] = useState<File | null>(null);

  const status = statusData.verificationStatus;

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("gymName", gymName);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("pincode", pincode);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("licenseNumber", licenseNumber);
      formData.append("licenseType", licenseType);
      formData.append("issuingAuthority", issuingAuthority);
      formData.append("expiryDate", expiryDate);
      if (newFile) {
        formData.append("licenseDocument", newFile);
      }

      await api.resubmitOwnerVerification(formData);
      setSuccessMsg("Updated application submitted successfully. Status is now Under Review.");
      setResubmitOpen(false);
      onRefresh();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || "Resubmission failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "PENDING":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-mono font-semibold">
            <Clock size={13} /> PENDING VERIFICATION
          </div>
        );
      case "UNDER_REVIEW":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
            <RefreshCw size={13} className="animate-spin" /> UNDER REVIEW
          </div>
        );
      case "REJECTED":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono font-semibold">
            <XCircle size={13} /> VERIFICATION REJECTED
          </div>
        );
      case "SUSPENDED":
        return (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/20 border border-red-700/50 text-red-300 text-xs font-mono font-semibold">
            <ShieldAlert size={13} /> ACCESS SUSPENDED
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#12140F] text-[#F7F5EE] p-4 sm:p-8 flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full max-w-3xl flex items-center justify-between py-4 border-b border-[#2D3624] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#20241C] border border-[#2D3624] flex items-center justify-center text-[#D4F447]">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-tight">GYMTwiq Owner Portal</h2>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1E16] border border-[#2D3624] text-xs text-gray-300 hover:text-white hover:border-[#3E4A32] transition"
          >
            <RefreshCw size={12} /> Refresh Status
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-900/50 text-xs text-red-400 hover:bg-red-900/40 transition"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Status Container */}
      <div className="w-full max-w-3xl space-y-6">
        {successMsg && (
          <div className="bg-emerald-950/50 border border-emerald-800/80 rounded-2xl p-4 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

        {/* Primary Status Card */}
        <div className="bg-[#1A1E16] border border-[#2D3624] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                Account Status
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Owner Verification</h1>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Status Message */}
          <div className="bg-[#12140F] border border-[#2D3624] rounded-2xl p-5 mb-6">
            <p className="text-sm text-gray-300 leading-relaxed">
              {status === "PENDING" &&
                "Your gym registration has been submitted for verification. Your account credentials, gym location, and license documentation are currently being reviewed by the GYMTwiq administrative team. You will receive full dashboard access once verification is completed."}
              {status === "UNDER_REVIEW" &&
                "A GYMTwiq compliance administrator is actively reviewing your facility coordinates and license credentials. Please allow up to 24 hours for official verification."}
              {status === "REJECTED" &&
                "Your gym owner registration was not approved during initial inspection. Please review the specific feedback below, update the required information or documentation, and resubmit for review."}
              {status === "SUSPENDED" &&
                "Your gym owner account and facility status have been suspended. Please contact support@gymtwiq.com for verification assistance."}
            </p>
          </div>

          {/* Rejection Alert Box */}
          {status === "REJECTED" && (
            <div className="bg-red-950/40 border border-red-800/70 rounded-2xl p-5 mb-6 text-red-200">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
                <AlertTriangle size={18} /> REASON FOR REJECTION
              </div>
              <p className="text-xs sm:text-sm bg-[#12140F]/80 p-3.5 rounded-xl border border-red-900/60 font-mono text-red-300">
                {statusData.rejectionReason || "Documentation or location information could not be verified."}
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setResubmitOpen(true)}
                  className="bg-[#D4F447] hover:bg-[#c2e236] text-[#12140F] font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg"
                >
                  <RefreshCw size={14} /> Update & Resubmit Application
                </button>
              </div>
            </div>
          )}

          {/* Submitted Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#12140F] border border-[#2D3624] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[#D4F447] text-xs font-bold mb-2">
                <Building2 size={15} /> Facility Information
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Gym Name:</span>
                  <span className="text-white font-medium">{statusData.gymName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Address:</span>
                  <span className="text-gray-300 text-right max-w-[180px] truncate">{statusData.address || "Submitted"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">City / State:</span>
                  <span className="text-white">{statusData.city || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Pincode:</span>
                  <span className="text-white">{statusData.pincode || "—"}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#12140F] border border-[#2D3624] rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[#D4F447] text-xs font-bold mb-2">
                <FileText size={15} /> License & Coordinates
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">License Number:</span>
                  <span className="text-white font-mono">{statusData.licenseNumber || "Submitted"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">License Type:</span>
                  <span className="text-white">{statusData.licenseType || "Trade License"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expiry Date:</span>
                  <span className="text-white font-mono">{statusData.licenseExpiryDate || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location Coordinates:</span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {statusData.latitude && statusData.longitude
                      ? `${Number(statusData.latitude).toFixed(4)}, ${Number(statusData.longitude).toFixed(4)}`
                      : "Confirmed"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-6 pt-5 border-t border-[#2D3624]/60 flex flex-wrap items-center justify-between text-xs text-gray-500">
            <span>Submitted: {statusData.submittedAt ? new Date(statusData.submittedAt).toLocaleDateString() : "Recently"}</span>
            <span className="flex items-center gap-1 text-gray-400">
              <Shield size={12} className="text-[#D4F447]" /> Private Storage Encrypted
            </span>
          </div>
        </div>

        {/* Subscription Notice */}
        <div className="bg-[#1A1E16]/70 border border-[#2D3624] rounded-2xl p-4 text-xs text-gray-400 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#20241C] text-[#D4F447] mt-0.5">
            <Shield size={16} />
          </div>
          <div>
            <span className="font-bold text-gray-200 block mb-0.5">Two-Stage Onboarding Notice</span>
            Upon administrative license approval, your facility will be unlocked and you will be directed to select an Owner Subscription plan with Razorpay checkout to activate business operations.
          </div>
        </div>
      </div>

      {/* Resubmission Modal */}
      {resubmitOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1A1E16] border border-[#2D3624] rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#2D3624]">
              <div>
                <h3 className="text-lg font-black text-white">Update & Resubmit Application</h3>
                <p className="text-xs text-gray-400">Correct your gym and license details for re-review</p>
              </div>
              <button
                onClick={() => setResubmitOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#20241C]"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 mb-4 text-xs text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleResubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                  Gym Name
                </label>
                <input
                  type="text"
                  required
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    Latitude (-90 to +90)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    Longitude (-180 to +180)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  required
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full bg-[#12140F] border border-[#2D3624] rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase font-mono tracking-wider text-gray-400 mb-1">
                  Replace License Document (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setNewFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#20241C] file:text-[#D4F447] hover:file:bg-[#2A3123]"
                />
                <p className="text-[10px] text-gray-500 mt-1">Accepted: PDF, JPG, PNG (Max 10 MB)</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResubmitOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#2D3624] text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D4F447] hover:bg-[#c2e236] text-[#12140F] font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
                >
                  {loading ? "Submitting..." : "Submit for Re-Review"} <ArrowRight size={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
