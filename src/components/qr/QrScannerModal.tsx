import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Building2,
  MapPin,
  Coins,
  Sparkles,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { api } from "../../api";
import { PrimaryButton, SecondaryButton } from "../ui/Buttons";
import { Gym } from "../../types";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckInSuccess: (result: any) => void;
  presetGym?: Gym | null;
  availableGyms?: Gym[];
  userCoins?: number;
}

interface ResolvedGymData {
  gymId: string;
  gymName: string;
  city: string;
  address: string;
  dailyRate: number;
  requiredCoins: number;
  qrId: string;
  publicQrToken: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  onCheckInSuccess,
  presetGym,
  availableGyms = [],
  userCoins = 0
}) => {
  const [activeTab, setActiveTab] = useState<"camera" | "upload" | "manual">("camera");
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualToken, setManualToken] = useState<string>("");
  const [resolving, setResolving] = useState<boolean>(false);
  const [resolvedData, setResolvedData] = useState<ResolvedGymData | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [checkinResult, setCheckinResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "gymtwiq-qr-reader";

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setResolvedData(null);
      setCheckinResult(null);
      setErrorMessage(null);
      setCameraError(null);
      setManualToken("");

      if (presetGym) {
        // If gym was preset from card click, resolve its ID directly from DB
        handleResolve(presetGym.id);
      }
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen, presetGym]);

  // Handle camera start/stop when tab changes
  useEffect(() => {
    if (isOpen && activeTab === "camera" && !resolvedData && !checkinResult) {
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, activeTab, resolvedData, checkinResult]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      // Wait for DOM element
      await new Promise((resolve) => setTimeout(resolve, 150));
      const element = document.getElementById(scannerContainerId);
      if (!element) return;

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(scannerContainerId);
      }

      if (scannerRef.current.isScanning) {
        return;
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.0
        },
        (decodedText) => {
          // Successfully scanned QR!
          handleScanSuccess(decodedText);
        },
        () => {
          // Frame scan error (normal during camera movement, ignore)
        }
      );
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Camera start failed:", err);
      setCameraActive(false);
      setCameraError(
        err.message ||
          "Camera access was blocked or not found. You can upload a QR image or enter code below."
      );
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        console.warn("Error stopping scanner", e);
      }
    }
    setCameraActive(false);
  };

  const handleScanSuccess = async (scannedText: string) => {
    await stopCamera();
    handleResolve(scannedText);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setResolving(true);
    try {
      const html5QrCode = new Html5Qrcode("gymtwiq-qr-file-scratch");
      const decodedText = await html5QrCode.scanFile(file, true);
      html5QrCode.clear();
      handleResolve(decodedText);
    } catch (err: any) {
      setErrorMessage("Could not detect a valid QR code in the uploaded image. Please try again.");
      setResolving(false);
    }
  };

  const handleResolve = async (tokenOrId: string) => {
    const raw = tokenOrId.trim();
    if (!raw) {
      setErrorMessage("Please enter or scan a valid QR code.");
      return;
    }

    setResolving(true);
    setErrorMessage(null);

    try {
      const data = await api.resolveQr(raw);
      setResolvedData(data);
    } catch (err: any) {
      console.error("Resolve QR error", err);
      setErrorMessage(
        err.message ||
          "QR code could not be resolved from the database. Please scan a valid GYMTwiq partner QR code."
      );
    } finally {
      setResolving(false);
    }
  };

  const handleConfirmCheckin = async () => {
    if (!resolvedData) return;

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const idempotencyKey = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const token = resolvedData.publicQrToken || resolvedData.qrId || resolvedData.gymId;

      const res = await api.processQrCheckin(token, idempotencyKey, "FULL_GYM");
      setCheckinResult(res.data || res);
      onCheckInSuccess(res.data || res);
    } catch (err: any) {
      setErrorMessage(
        err.message || "Check-in failed. Please verify your coin balance or subscription."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      {/* Hidden container for file scan */}
      <div id="gymtwiq-qr-file-scratch" className="hidden" />

      <div className="card-3d-featured p-6 max-w-lg w-full relative bg-gymDark border border-gymOrange/40 rounded-3xl shadow-2xl space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gymSurface flex items-center justify-center text-gymTextMuted hover:text-gymTextPrimary hover:bg-gymCard transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gymOrange/20 border border-gymOrange/40 text-gymOrange flex items-center justify-center">
            <QrCode className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gymTextPrimary">Gym QR Pass Check-In</h3>
            <p className="text-xs text-gymTextMuted">
              Instant turnstile scan • Live DB verification • Real-time Owner & Admin alert
            </p>
          </div>
        </div>

        {/* SUCCESS STATE */}
        {checkinResult ? (
          <div className="space-y-4 py-2">
            <div className="p-6 rounded-2xl bg-gymSuccess/15 border border-gymSuccess/40 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-gymSuccess/20 border border-gymSuccess/50 text-gymSuccess flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold text-gymTextPrimary">Check-In Confirmed!</h4>
              <p className="text-xs text-gymTextSecondary max-w-sm mx-auto">
                Access granted at <span className="font-bold text-gymTextPrimary">{resolvedData?.gymName || checkinResult.gymName}</span>.
              </p>

              <div className="pt-2 pb-1 bg-gymDark/60 rounded-xl p-3 border border-gymBorder/40 text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gymTextMuted">Check-In ID:</span>
                  <span className="font-mono text-gymTextPrimary">{checkinResult.id || "CONFIRMED"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gymTextMuted">Daily Pricing Rate:</span>
                  <span className="font-bold text-gymOrange">
                    ₹{resolvedData?.dailyRate ?? checkinResult.meteringRate ?? checkinResult.dailyRate ?? 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gymTextMuted">Coins Deducted:</span>
                  <span className="font-semibold text-gymTextPrimary">
                    🪙 {checkinResult.coinAmount ?? (resolvedData?.requiredCoins || 0)} Coins
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gymTextMuted">Streak Days:</span>
                  <span className="font-bold text-[#D4F447]">🔥 {checkinResult.streakDays ?? 1} Days</span>
                </div>
              </div>

              {/* Confirmation Notification Alert Note */}
              <div className="p-2.5 rounded-xl bg-gymOrange/10 border border-gymOrange/30 text-gymOrange text-[11px] text-left flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  <strong>Confirmation Dispatched:</strong> Gym Owner & Platform Admins have been notified with the member name and daily rate.
                </span>
              </div>
            </div>

            <PrimaryButton fullWidth onClick={onClose}>
              Done & Start Workout
            </PrimaryButton>
          </div>
        ) : resolvedData ? (
          /* RESOLVED GYM CONFIRMATION VIEW */
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gymSurface/80 border border-gymBorder space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gymOrange bg-gymOrange/10 px-2 py-0.5 rounded-full border border-gymOrange/20">
                  QR Verified
                </span>
                <span className="text-[10px] font-mono text-gymTextMuted">
                  ID: {resolvedData.qrId || resolvedData.gymId.slice(0, 10)}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-gymTextPrimary flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gymOrange" />
                  {resolvedData.gymName}
                </h4>
                <p className="text-xs text-gymTextMuted flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {resolvedData.city} {resolvedData.address ? `• ${resolvedData.address}` : ""}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gymBorder/40">
                <div className="p-2.5 rounded-xl bg-gymCard border border-gymBorder/60">
                  <span className="text-[10px] text-gymTextMuted block">Daily Pricing</span>
                  <span className="text-base font-bold text-gymOrange">₹{resolvedData.dailyRate}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gymCard border border-gymBorder/60">
                  <span className="text-[10px] text-gymTextMuted block">Required Coins</span>
                  <span className="text-base font-bold text-gymTextPrimary flex items-center gap-1">
                    🪙 {resolvedData.requiredCoins}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs px-1 text-gymTextMuted">
                <span>Your Coin Balance:</span>
                <span className={`font-bold ${userCoins >= resolvedData.requiredCoins ? "text-gymSuccess" : "text-gymError"}`}>
                  🪙 {userCoins} Coins
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-gymError/15 border border-gymError/30 text-gymError text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex gap-2">
              <SecondaryButton
                fullWidth
                onClick={() => {
                  setResolvedData(null);
                  setErrorMessage(null);
                }}
              >
                Scan Another
              </SecondaryButton>
              <PrimaryButton
                fullWidth
                isLoading={submitting}
                onClick={handleConfirmCheckin}
              >
                Confirm Check-In
              </PrimaryButton>
            </div>
          </div>
        ) : (
          /* SCANNER INTERFACE (CAMERA / UPLOAD / MANUAL) */
          <div className="space-y-4">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-gymSurface rounded-xl border border-gymBorder text-xs font-semibold">
              <button
                onClick={() => setActiveTab("camera")}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "camera"
                    ? "bg-gymOrange text-white shadow-md font-bold"
                    : "text-gymTextMuted hover:text-gymTextPrimary"
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                Camera
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "upload"
                    ? "bg-gymOrange text-white shadow-md font-bold"
                    : "text-gymTextMuted hover:text-gymTextPrimary"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === "manual"
                    ? "bg-gymOrange text-white shadow-md font-bold"
                    : "text-gymTextMuted hover:text-gymTextPrimary"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                Enter Code
              </button>
            </div>

            {/* TAB 1: LIVE CAMERA VIEW */}
            {activeTab === "camera" && (
              <div className="space-y-3">
                <div className="relative w-full aspect-square max-h-64 mx-auto rounded-2xl overflow-hidden bg-black border border-gymOrange/40 flex items-center justify-center">
                  <div id={scannerContainerId} className="w-full h-full" />

                  {cameraError && (
                    <div className="absolute inset-0 p-4 bg-gymDark/95 flex flex-col items-center justify-center text-center space-y-2">
                      <AlertTriangle className="w-8 h-8 text-gymWarning" />
                      <p className="text-xs text-gymTextSecondary">{cameraError}</p>
                      <button
                        onClick={startCamera}
                        className="py-1.5 px-3 rounded-lg bg-gymOrange text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-gymOrange/50 rounded-2xl flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-gymOrange rounded-xl relative animate-pulse">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gymOrange shadow-[0_0_8px_#FF6A00] animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-center text-gymTextMuted">
                  Point camera directly at the gym's permanent QR code poster or screen.
                </p>
              </div>
            )}

            {/* TAB 2: UPLOAD IMAGE */}
            {activeTab === "upload" && (
              <div className="space-y-3">
                <label className="block p-8 border-2 border-dashed border-gymBorder hover:border-gymOrange rounded-2xl bg-gymSurface/40 hover:bg-gymSurface/70 text-center cursor-pointer transition-all">
                  <Upload className="w-8 h-8 text-gymOrange mx-auto mb-2" />
                  <span className="text-xs font-bold text-gymTextPrimary block">
                    Choose QR Code Image or Screenshot
                  </span>
                  <span className="text-[11px] text-gymTextMuted">
                    Supports PNG, JPG, WebP from camera roll
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* TAB 3: MANUAL INPUT */}
            {activeTab === "manual" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gymTextMuted block mb-1">
                    Enter Gym QR Token, QR ID (e.g. GYM-XXXX), or Deep Link:
                  </label>
                  <input
                    type="text"
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    placeholder="e.g. GYM-8F42K9X2 or gt_qr_..."
                    className="w-full py-2.5 px-3 rounded-xl bg-gymCard border border-gymBorder text-xs text-gymTextPrimary focus:outline-none focus:border-gymOrange font-mono"
                  />
                </div>
                <PrimaryButton
                  fullWidth
                  isLoading={resolving}
                  onClick={() => handleResolve(manualToken)}
                >
                  Verify QR Code
                </PrimaryButton>
              </div>
            )}

            {/* QUICK TEST SELECTOR (Available Gyms) */}
            {availableGyms.length > 0 && (
              <div className="pt-2 border-t border-gymBorder/40">
                <span className="text-[11px] text-gymTextMuted block mb-2">
                  Or select a registered gym to verify & check in:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {availableGyms.slice(0, 6).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleResolve(g.id)}
                      className="py-1 px-2.5 rounded-lg bg-gymSurface hover:bg-gymCard border border-gymBorder text-[11px] text-gymTextSecondary hover:text-gymOrange flex items-center gap-1 transition-all"
                    >
                      <Building2 className="w-3 h-3 text-gymOrange" />
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ERROR DISPLAY */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-gymError/15 border border-gymError/30 text-gymError text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {resolving && (
              <div className="text-center py-2 text-xs text-gymOrange flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Resolving Gym details from database...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
