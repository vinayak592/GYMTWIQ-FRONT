import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { AppShell } from "../../components/layout/AppShell";
import { MetricCard } from "../../components/ui/MetricCard";
import { GlassCard, SectionCard } from "../../components/ui/Cards";
import { PrimaryButton, SecondaryButton, StatusBadge } from "../../components/ui/Buttons";
import { LoadingSkeleton, EmptyState } from "../../components/ui/States";
import {
  Dumbbell, ShieldCheck, Users, Activity, PieChart, CreditCard, Plus,
  UserCheck, AlertTriangle, FileText, CheckCircle2, X, RefreshCw, Calendar, Settings, MapPin,
  Camera, Image, ListPlus, Save, Trash2, Clock, QrCode, Printer, Maximize2, Download, Copy,
  Coins, Edit2, Check, Upload
} from "lucide-react";
import { Gym, TrainerProfile, GymActivity, PaymentRecord, GymEquipmentItem, GymQRCode, GymVisitAnalytics } from "../../types";

export const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Dynamic tab switcher from URL path
  let activeTab = "dashboard";
  if (path.includes("/owner/gym")) activeTab = "gym";
  else if (path.includes("/owner/qr")) activeTab = "qr";
  else if (path.includes("/owner/members")) activeTab = "members";
  else if (path.includes("/owner/trainers")) activeTab = "trainers";
  else if (path.includes("/owner/checkins")) activeTab = "checkins";
  else if (path.includes("/owner/pricing")) activeTab = "pricing";
  else if (path.includes("/owner/verification")) activeTab = "verification";
  else if (path.includes("/owner/payouts")) activeTab = "payouts";
  else if (path.includes("/owner/settings")) activeTab = "settings";

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<TrainerProfile[]>([]);
  const [activities, setActivities] = useState<GymActivity[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Permanent Gym QR State
  const [qrDoc, setQrDoc] = useState<GymQRCode | null>(null);
  const [qrAnalytics, setQrAnalytics] = useState<GymVisitAnalytics | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [displayModalOpen, setDisplayModalOpen] = useState(false);
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);
  const [regenerateReason, setRegenerateReason] = useState("");
  const [regeneratingQr, setRegeneratingQr] = useState(false);

  // Gym Profile Form State
  const [gymCoverImage, setGymCoverImage] = useState<string>("");
  const [gymInnerImages, setGymInnerImages] = useState<string[]>([]);
  const [newInnerImage, setNewInnerImage] = useState<string>("");
  const [gymEquipments, setGymEquipments] = useState<GymEquipmentItem[]>([]);
  const [gymOperatingHours, setGymOperatingHours] = useState<string>("06:00 AM - 10:00 PM");
  const [gymPhone, setGymPhone] = useState<string>("");
  const [gymAddress, setGymAddress] = useState<string>("");
  const [gymCity, setGymCity] = useState<string>("");
  const [savingGymProfile, setSavingGymProfile] = useState(false);
  const [gymSaveSuccess, setGymSaveSuccess] = useState<string | null>(null);

  // Invite Trainer Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [trainerName, setTrainerName] = useState("");
  const [trainerEmail, setTrainerEmail] = useState("");
  const [trainerSpec, setTrainerSpec] = useState("");
  const [inviting, setInviting] = useState(false);

  // Add Direct Member Modal State
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memName, setMemName] = useState("");
  const [memEmail, setMemEmail] = useState("");
  const [addingMember, setAddingMember] = useState(false);

  // Gym Activity Pricing Manager State
  const [actName, setActName] = useState("");
  const [actCategory, setActCategory] = useState<"CARDIO" | "STRENGTH" | "FUNCTIONAL" | "CLASSES" | "OTHER">("STRENGTH");
  const [actCoins, setActCoins] = useState<number | string>(100);
  const [actDesc, setActDesc] = useState("");
  const [creatingAct, setCreatingAct] = useState(false);
  const [editingActId, setEditingActId] = useState<string | null>(null);
  const [editActCoins, setEditActCoins] = useState<number | string>(100);
  const [savingEditPrice, setSavingEditPrice] = useState(false);
  const [actSuccessMsg, setActSuccessMsg] = useState<string | null>(null);
  const [actErrorMsg, setActErrorMsg] = useState<string | null>(null);

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actName.trim()) {
      setActErrorMsg("Please enter an activity name");
      return;
    }
    const coinsNum = Number(actCoins);
    if (isNaN(coinsNum) || coinsNum <= 0) {
      setActErrorMsg("Please enter a valid coin amount greater than 0");
      return;
    }

    setCreatingAct(true);
    setActErrorMsg(null);
    setActSuccessMsg(null);
    try {
      await api.createOwnerActivity({
        name: actName.trim(),
        category: actCategory,
        description: actDesc.trim(),
        priceInr: coinsNum,
      });
      setActName("");
      setActCoins(100);
      setActDesc("");
      setActSuccessMsg(`Activity '${actName.trim()}' successfully configured with fixed price of ${coinsNum} Coins.`);
      const updatedActs = await api.getOwnerActivities();
      setActivities(updatedActs);
    } catch (err: any) {
      setActErrorMsg(err.message || "Failed to create activity");
    } finally {
      setCreatingAct(false);
    }
  };

  const handleUpdatePrice = async (activityId: string) => {
    const coinsNum = Number(editActCoins);
    if (isNaN(coinsNum) || coinsNum <= 0) {
      setActErrorMsg("Please enter a valid coin amount");
      return;
    }
    setSavingEditPrice(true);
    setActErrorMsg(null);
    setActSuccessMsg(null);
    try {
      await api.setActivityPrice(activityId, coinsNum);
      setEditingActId(null);
      setActSuccessMsg(`Fixed price updated to ${coinsNum} Coins.`);
      const updatedActs = await api.getOwnerActivities();
      setActivities(updatedActs);
    } catch (err: any) {
      setActErrorMsg(err.message || "Failed to update price");
    } finally {
      setSavingEditPrice(false);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm("Are you sure you want to deactivate this activity?")) return;
    try {
      await api.updateOwnerActivity(activityId, { status: "INACTIVE" });
      const updatedActs = await api.getOwnerActivities();
      setActivities(updatedActs);
      setActSuccessMsg("Activity deactivated successfully.");
    } catch (err: any) {
      setActErrorMsg(err.message || "Failed to deactivate activity");
    }
  };

  const fetchOwnerData = async () => {
    setLoading(true);
    try {
      const [dash, mems, trs, acts, verif, qr, qrAna] = await Promise.all([
        api.getOwnerDashboard().catch(() => null),
        api.getOwnerMembers().catch(() => []),
        api.getOwnerTrainers().catch(() => []),
        api.getOwnerActivities().catch(() => []),
        api.getOwnerVerificationStatus().catch(() => null),
        api.getOwnerQrCode().catch(() => null),
        api.getOwnerQrAnalytics().catch(() => null)
      ]);
      setDashboardData(dash);
      setMembers(mems);
      setTrainers(trs);
      setActivities(acts);
      setVerificationStatus(verif);
      setQrDoc(qr);
      setQrAnalytics(qrAna);

      if (dash?.gym) {
        const g = dash.gym;
        setGymCoverImage(g.coverImage || (g.images && g.images[0]) || "");
        setGymInnerImages(g.innerViewImages || g.images || []);
        setGymEquipments(
          g.equipments && g.equipments.length > 0
            ? g.equipments
            : [
                { name: "Treadmills", count: 4 },
                { name: "Bench Press Racks", count: 3 },
                { name: "Dumbbell Sets", count: 10 },
                { name: "Squat Racks", count: 2 }
              ]
        );
        setGymOperatingHours(g.operatingHours || "06:00 AM - 10:00 PM");
        setGymPhone(g.phone || "");
        setGymAddress(g.address || "");
        setGymCity(g.city || "");
      }
    } catch (e) {
      console.error("Failed to load owner data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDoc) return;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrDoc.publicQrToken)}`;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `${dashboardData?.gym?.name || "GYMTwiq_Gym"}_QR_${qrDoc.qrId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRegenerateQrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegeneratingQr(true);
    try {
      const newQr = await api.regenerateOwnerQrCode(regenerateReason || "Owner manual regenerate request");
      setQrDoc(newQr);
      setRegenerateModalOpen(false);
      setRegenerateReason("");
      alert("Gym QR Code regenerated successfully! Previous QR token has been revoked.");
      fetchOwnerData();
    } catch (err: any) {
      alert(err.message || "Failed to regenerate QR code");
    } finally {
      setRegeneratingQr(false);
    }
  };


  useEffect(() => {
    fetchOwnerData();
  }, []);

  const handleAddEquipmentRow = () => {
    setGymEquipments((prev) => [...prev, { name: "", count: 1 }]);
  };

  const handleUpdateEquipment = (index: number, field: "name" | "count", val: string | number) => {
    setGymEquipments((prev) => {
      const copy = [...prev];
      if (field === "name") copy[index].name = String(val);
      if (field === "count") copy[index].count = Math.max(1, Number(val));
      return copy;
    });
  };

  const handleRemoveEquipment = (index: number) => {
    setGymEquipments((prev) => prev.filter((_, i) => i !== index));
  };

  // Helper to read and compress image file to Base64
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Selected file must be an image (JPEG, PNG, WebP)."));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          // Scale down if larger than 1200px for fast loading & compact storage
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await processImageFile(file);
      setGymCoverImage(dataUrl);
    } catch (err: any) {
      alert(err.message || "Failed to process selected image.");
    }
  };

  const handleInnerFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await processImageFile(files[i]);
        urls.push(dataUrl);
      }
      setGymInnerImages((prev) => [...prev, ...urls]);
    } catch (err: any) {
      alert(err.message || "Failed to process selected images.");
    }
  };

  const handleAddInnerImage = () => {
    if (!newInnerImage || !newInnerImage.trim()) return;
    if (newInnerImage.includes(":\\") || newInnerImage.startsWith("file://")) {
      alert("Local file paths (e.g. C:\\...) cannot be loaded by browsers. Please use the 'Upload from Computer' button instead.");
      return;
    }
    setGymInnerImages((prev) => [...prev, newInnerImage.trim()]);
    setNewInnerImage("");
  };

  const handleRemoveInnerImage = (index: number) => {
    setGymInnerImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveGymProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGymProfile(true);
    setGymSaveSuccess(null);
    try {
      await api.updateOwnerGym({
        coverImage: gymCoverImage,
        innerViewImages: gymInnerImages,
        images: gymInnerImages,
        equipments: gymEquipments.filter((e) => e.name.trim().length > 0),
        operatingHours: gymOperatingHours,
        phone: gymPhone,
        address: gymAddress,
        city: gymCity
      });
      setGymSaveSuccess("Gym photos, inner view images, and equipment counts saved successfully!");
      fetchOwnerData();
    } catch (err: any) {
      alert(err.message || "Failed to update gym profile");
    } finally {
      setSavingGymProfile(false);
    }
  };

  const handleInviteTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerEmail || !trainerName) return;
    setInviting(true);
    try {
      await api.inviteTrainer({
        name: trainerName,
        email: trainerEmail,
        specialization: trainerSpec
      });
      setInviteModalOpen(false);
      setTrainerName("");
      setTrainerEmail("");
      setTrainerSpec("");
      fetchOwnerData();
    } catch (err: any) {
      alert(err.message || "Trainer invitation failed");
    } finally {
      setInviting(false);
    }
  };

  const handleAddDirectMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memEmail || !memName) return;
    setAddingMember(true);
    try {
      await api.registerDirectMember({
        name: memName,
        email: memEmail,
        planName: "1 Month Direct Entry",
        durationDays: 30
      });
      setMemberModalOpen(false);
      setMemName("");
      setMemEmail("");
      fetchOwnerData();
    } catch (err: any) {
      alert(err.message || "Member registration failed");
    } finally {
      setAddingMember(false);
    }
  };

  const currentStatus = verificationStatus?.verificationStatus || verificationStatus?.status || user?.verificationStatus || "PENDING";

  return (
    <AppShell title="Gym Owner Portal">
      {/* 1. Header Hero Card */}
      <div className="card-3d-featured p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gymTextPrimary">
              {dashboardData?.gym?.name || "Partner Gym Facility"}
            </h1>
            <StatusBadge status={currentStatus} label={currentStatus === "APPROVED" ? "Verified Partner" : currentStatus} />
          </div>
          <p className="text-xs text-gymTextSecondary">
            Manage partner gym details, direct member enrollments, trainer roster, and footfall payouts.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <PrimaryButton
            disabled={currentStatus !== "APPROVED"}
            icon={<Plus className="w-4 h-4" />}
            onClick={() => currentStatus === "APPROVED" && setMemberModalOpen(true)}
            title={currentStatus !== "APPROVED" ? "Requires SuperAdmin Trade License Approval" : "Add Direct Member"}
          >
            Add Direct Member
          </PrimaryButton>
          <SecondaryButton
            disabled={currentStatus !== "APPROVED"}
            icon={<UserCheck className="w-4 h-4" />}
            onClick={() => currentStatus === "APPROVED" && setInviteModalOpen(true)}
            title={currentStatus !== "APPROVED" ? "Requires SuperAdmin Trade License Approval" : "Invite Trainer"}
          >
            Invite Trainer
          </SecondaryButton>
        </div>
      </div>

      {/* Verification Lock Banner for Unverified / Pending Owners */}
      {currentStatus !== "APPROVED" && (
        <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-4 shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-lg">
                ⏳
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  Trade License Verification Pending Admin Approval
                </h3>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Your gym owner application has been submitted and is undergoing verification by the GYMTwiq SuperAdmin team. Operational actions (adding members, inviting trainers, public network listing) will be unlocked once approved.
                </p>
              </div>
            </div>
            <StatusBadge status={currentStatus} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-500/20 text-xs">
            <div className="p-3 rounded-xl bg-gymDark/60 border border-amber-500/20">
              <span className="text-gymTextMuted block text-[10px] uppercase font-bold">Step 1</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-gymSuccess" /> Application Submitted
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gymDark/60 border border-amber-500/20">
              <span className="text-gymTextMuted block text-[10px] uppercase font-bold">Step 2</span>
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Compliance Review ({currentStatus})
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gymDark/60 border border-amber-500/20">
              <span className="text-gymTextMuted block text-[10px] uppercase font-bold">Step 3</span>
              <span className="font-semibold text-gymTextMuted flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Platform Activation & Public Listing
              </span>
            </div>
          </div>

          {currentStatus === "REJECTED" && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between gap-3">
              <div>
                <strong>Rejection Reason:</strong> {verificationStatus?.rejectionReason || "Trade license documentation requires revision."}
              </div>
              <SecondaryButton size="sm" onClick={() => navigate("/owner/verification")}>
                Resubmit License Document
              </SecondaryButton>
            </div>
          )}
        </div>
      )}

      {/* 2. Business KPI Metrics */}
      {loading ? (
        <LoadingSkeleton count={4} height="h-24" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Direct Members"
            value={members.length}
            subtext="Gym Managed Accounts"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            title="Active Trainers"
            value={trainers.length}
            subtext="Coaching Roster"
            icon={<UserCheck className="w-5 h-5" />}
          />
          <MetricCard
            title="Activities Offered"
            value={activities.length}
            subtext="Pay-per-activity items"
            icon={<Dumbbell className="w-5 h-5" />}
          />
          <MetricCard
            title="Network Check-ins"
            value={dashboardData?.checkinsCount || 0}
            subtext="Total footfall logged"
            icon={<Activity className="w-5 h-5" />}
          />
        </div>
      )}

      {/* PERMANENT GYMTwiq QR IDENTITY & VISIT ANALYTICS SECTION */}
      {(activeTab === "dashboard" || activeTab === "qr" || activeTab === "pricing") && qrDoc && (
        <div className="p-6 rounded-2xl bg-gymSurface border border-gymBorder space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gymBorder">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gymOrange" />
                <h2 className="text-lg font-bold text-gymTextPrimary">Permanent Gym QR Identity</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {qrDoc.status} ({qrDoc.qrId})
                </span>
              </div>
              <p className="text-xs text-gymTextMuted">
                Authoritative permanent QR code for <strong className="text-gymTextPrimary">{dashboardData?.gym?.name}</strong>. Members scan this QR code using the GYMTwiq App for instant check-in.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SecondaryButton size="sm" icon={<Download className="w-4 h-4" />} onClick={handleDownloadQr}>
                Download QR
              </SecondaryButton>
              <SecondaryButton size="sm" icon={<Printer className="w-4 h-4" />} onClick={() => setPrintModalOpen(true)}>
                Print Poster
              </SecondaryButton>
              <SecondaryButton size="sm" icon={<Maximize2 className="w-4 h-4" />} onClick={() => setDisplayModalOpen(true)}>
                Kiosk View
              </SecondaryButton>
              <SecondaryButton size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={() => setRegenerateModalOpen(true)}>
                Regenerate
              </SecondaryButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: QR Display Box */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-gymDark border border-gymBorder space-y-3 text-center">
              <div className="p-4 rounded-xl bg-white shadow-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDoc.publicQrToken)}`}
                  alt="GYMTwiq Permanent Gym QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-gymTextMuted uppercase tracking-widest font-bold block">Gym Identifier</span>
                <span className="font-mono text-sm font-extrabold text-gymOrange">{qrDoc.qrId}</span>
              </div>
            </div>

            {/* Right: Analytics & Details */}
            <div className="md:col-span-8 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-gymDark border border-gymBorder">
                  <span className="text-[10px] text-gymTextMuted uppercase font-bold block">Total Visits</span>
                  <span className="text-xl font-extrabold text-gymTextPrimary">{qrAnalytics?.totalVisits || 0}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gymDark border border-gymBorder">
                  <span className="text-[10px] text-gymTextMuted uppercase font-bold block">Unique Members</span>
                  <span className="text-xl font-extrabold text-gymOrange">{qrAnalytics?.uniqueMembers || 0}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gymDark border border-gymBorder">
                  <span className="text-[10px] text-gymTextMuted uppercase font-bold block">Coins Consumed</span>
                  <span className="text-xl font-extrabold text-amber-400">{qrAnalytics?.totalCoinsConsumed || 0}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gymDark border border-gymBorder">
                  <span className="text-[10px] text-gymTextMuted uppercase font-bold block">Payout Value</span>
                  <span className="text-xl font-extrabold text-gymSuccess">₹{(qrAnalytics?.totalPayoutAmount || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gymDark border border-gymBorder space-y-2 text-xs">
                <div className="flex items-center justify-between text-gymTextMuted">
                  <span>Public Token Payload</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrDoc.publicQrToken);
                      alert("QR Token payload copied to clipboard!");
                    }}
                    className="text-gymOrange hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Payload
                  </button>
                </div>
                <div className="font-mono p-2 rounded-lg bg-gymSurface border border-gymBorder text-gymTextSecondary break-all text-[11px]">
                  {qrDoc.publicQrToken}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* 3. DYNAMIC SUB-VIEWS FROM SIDEBAR */}

      {/* OVERVIEW / DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-6">
            <SectionCard title="Direct Members Overview" icon={<Users className="w-4 h-4" />}>
              {members.length === 0 ? (
                <EmptyState title="No direct members enrolled" description="Add direct members to issue gym passes managed by your staff." />
              ) : (
                <div className="space-y-3">
                  {members.slice(0, 5).map((m: any) => (
                    <div key={m.id || m._id} className="p-3.5 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gymTextPrimary">{m.name}</h4>
                        <p className="text-[11px] text-gymTextMuted">{m.email}</p>
                      </div>
                      <StatusBadge status={m.status || "ACTIVE"} />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="xl:col-span-6">
            <SectionCard title="Trainers Roster" icon={<UserCheck className="w-4 h-4" />}>
              {trainers.length === 0 ? (
                <EmptyState title="No trainers invited" description="Invite personal trainers to coach your members." />
              ) : (
                <div className="space-y-3">
                  {trainers.slice(0, 5).map((t) => (
                    <div key={t.id} className="p-3.5 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gymTextPrimary">{t.name || "Trainer"}</h4>
                        <p className="text-[11px] text-gymOrange font-medium">{t.specialization || "General Fitness"}</p>
                      </div>
                      <StatusBadge status={t.status || "ACTIVE"} />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* MY GYM FACILITY PROFILE & MEDIA & EQUIPMENT EDITOR */}
      {activeTab === "gym" && (
        <SectionCard title="Gym Profile, Photos & Equipment Inventory" icon={<Dumbbell className="w-4 h-4" />}>
          <form onSubmit={handleSaveGymProfile} className="space-y-6">
            {/* Header info */}
            <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-gymTextPrimary">{dashboardData?.gym?.name || "Partner Gym Facility"}</h3>
                <p className="text-xs text-gymTextMuted flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gymOrange" /> {gymAddress || "Main Street"}, {gymCity || "Bengaluru"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={currentStatus} label={currentStatus === "APPROVED" ? "Verified Partner" : currentStatus} />
                <PrimaryButton isLoading={savingGymProfile} type="submit" icon={<Save className="w-4 h-4" />}>
                  Save Changes
                </PrimaryButton>
              </div>
            </div>

            {gymSaveSuccess && (
              <div className="p-4 rounded-xl bg-gymSuccess/15 border border-gymSuccess/40 text-gymSuccess text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{gymSaveSuccess}</span>
              </div>
            )}

            {/* Section 1: Main Gym Cover Photo */}
            <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider flex items-center gap-2">
                  <Camera className="w-4 h-4 text-gymOrange" /> Main Gym Cover Photo
                </h4>
                {gymCoverImage && (
                  <button
                    type="button"
                    onClick={() => setGymCoverImage("")}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Photo
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                <div className="md:col-span-8 space-y-3">
                  {/* File Upload Option */}
                  <div>
                    <label className="text-xs font-semibold text-gymTextPrimary block mb-1">
                      Choose Photo from Your Computer
                    </label>
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-gymOrange hover:bg-gymOrange/90 text-white text-xs font-bold rounded-xl cursor-pointer shadow-lg shadow-gymOrange/20 transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Choose File from Computer</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleCoverFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-gymTextMuted mt-1">
                      Upload any image (JPG, PNG, WebP). It will be optimized and saved automatically.
                    </p>
                  </div>

                  {/* URL Input Option */}
                  <div className="pt-2 border-t border-gymBorder/60 space-y-1.5">
                    <label className="text-xs font-semibold text-gymTextMuted block">
                      Or paste an online web image URL:
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={gymCoverImage.startsWith("data:") ? "Image loaded from computer" : gymCoverImage}
                      disabled={gymCoverImage.startsWith("data:")}
                      onChange={(e) => setGymCoverImage(e.target.value)}
                      className="w-full px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-xs text-gymTextPrimary outline-none focus:border-gymOrange disabled:opacity-75 disabled:text-emerald-400"
                    />

                    {/* Warning if user typed a local Windows file path */}
                    {(gymCoverImage.includes(":\\") || gymCoverImage.startsWith("file://")) && (
                      <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                        <span>
                          <strong>Local File Path Detected:</strong> Web browsers cannot read files from <code className="bg-black/40 px-1 rounded text-amber-200">C:\...</code> directly. Please click the orange <strong>"Choose File from Computer"</strong> button above to upload this image!
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview Box */}
                <div className="md:col-span-4 h-40 rounded-xl bg-gymDark border border-gymBorder overflow-hidden relative flex flex-col items-center justify-center">
                  {gymCoverImage && !gymCoverImage.includes(":\\") && !gymCoverImage.startsWith("file://") ? (
                    <>
                      <img
                        src={gymCoverImage}
                        alt="Gym Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-emerald-400 font-mono">
                        Ready to Save
                      </span>
                    </>
                  ) : (
                    <div className="text-center p-3 space-y-1">
                      <Camera className="w-6 h-6 text-gymTextMuted mx-auto opacity-40" />
                      <div className="text-gymTextMuted text-xs">No valid cover image</div>
                      <div className="text-[10px] text-gymTextMuted/70">Click Choose File to pick an image</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Inner View Images Gallery */}
            <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider flex items-center gap-2">
                  <Image className="w-4 h-4 text-gymOrange" /> Gym Inner View Images & Gallery
                </h4>
                <span className="text-[11px] text-gymTextMuted">({gymInnerImages.length} uploaded)</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-2 bg-gymDark hover:bg-[#232826] border border-gymBorder hover:border-gymOrange text-white text-xs font-bold rounded-xl cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5 text-gymOrange" />
                  <span>Upload Photos from Computer</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleInnerFilesUpload}
                    className="hidden"
                  />
                </label>

                <div className="flex-1 min-w-[200px] flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Or paste online image URL..."
                    value={newInnerImage}
                    onChange={(e) => setNewInnerImage(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-xs text-gymTextPrimary outline-none focus:border-gymOrange"
                  />
                  <SecondaryButton type="button" icon={<Plus className="w-4 h-4" />} onClick={handleAddInnerImage}>
                    Add URL
                  </SecondaryButton>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {gymInnerImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-gymBorder h-28 group bg-gymDark">
                    <img src={imgUrl} alt={`Inner view ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveInnerImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-all shadow"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {gymInnerImages.length === 0 && (
                  <div className="col-span-full p-6 text-center text-gymTextMuted text-xs bg-gymDark rounded-xl border border-gymBorder/60">
                    No inner view photos added yet. Click <strong>Upload Photos from Computer</strong> above to add gym equipment and facility interior photos.
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Total Equipment Inventory & Counts */}
            <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider flex items-center gap-2">
                    <ListPlus className="w-4 h-4 text-gymOrange" /> Equipment Inventory & Total Counts
                  </h4>
                  <p className="text-[11px] text-gymTextMuted mt-0.5">Specify equipment names and available quantities for member transparency.</p>
                </div>
                <SecondaryButton
                  type="button"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleAddEquipmentRow}
                  size="sm"
                >
                  + Add More Equipment
                </SecondaryButton>
              </div>

              <div className="space-y-2.5">
                {gymEquipments.map((eq, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gymDark border border-gymBorder">
                    <div className="flex-1">
                      <label className="text-[10px] text-gymTextMuted block mb-0.5">Equipment Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Treadmill, Bench Press, Dumbbell Sets..."
                        value={eq.name}
                        onChange={(e) => handleUpdateEquipment(idx, "name", e.target.value)}
                        className="w-full px-3 py-1.5 bg-gymSurface border border-gymBorder rounded-lg text-xs text-gymTextPrimary outline-none focus:border-gymOrange"
                      />
                    </div>
                    <div className="w-28">
                      <label className="text-[10px] text-gymTextMuted block mb-0.5">Total Count</label>
                      <input
                        type="number"
                        min="1"
                        value={eq.count}
                        onChange={(e) => handleUpdateEquipment(idx, "count", Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-gymSurface border border-gymBorder rounded-lg text-xs text-gymTextPrimary outline-none focus:border-gymOrange font-bold text-gymOrange"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(idx)}
                      className="mt-4 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                      title="Remove equipment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-start">
                <SecondaryButton
                  type="button"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={handleAddEquipmentRow}
                >
                  + Add More Equipment
                </SecondaryButton>
              </div>
            </div>

            {/* Section 4: Operating Hours & Location Settings */}
            <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-4">
              <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Facility Operating Hours & Address</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-gymTextMuted block mb-1 font-semibold">Operating Hours</label>
                  <input
                    type="text"
                    value={gymOperatingHours}
                    onChange={(e) => setGymOperatingHours(e.target.value)}
                    placeholder="e.g. 06:00 AM - 10:00 PM"
                    className="w-full px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-gymTextPrimary outline-none focus:border-gymOrange"
                  />
                </div>
                <div>
                  <label className="text-gymTextMuted block mb-1 font-semibold">Phone Contact</label>
                  <input
                    type="text"
                    value={gymPhone}
                    onChange={(e) => setGymPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-gymTextPrimary outline-none focus:border-gymOrange"
                  />
                </div>
                <div>
                  <label className="text-gymTextMuted block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    value={gymCity}
                    onChange={(e) => setGymCity(e.target.value)}
                    className="w-full px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-gymTextPrimary outline-none focus:border-gymOrange"
                  />
                </div>
                <div>
                  <label className="text-gymTextMuted block mb-1 font-semibold">Address</label>
                  <input
                    type="text"
                    value={gymAddress}
                    onChange={(e) => setGymAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-gymTextPrimary outline-none focus:border-gymOrange"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <PrimaryButton
                disabled={currentStatus !== "APPROVED"}
                isLoading={savingGymProfile}
                type="submit"
                icon={<Save className="w-4 h-4" />}
              >
                {currentStatus === "APPROVED" ? "Save Gym Profile & Credentials" : "Verification Approval Required to Save"}
              </PrimaryButton>
            </div>
          </form>
        </SectionCard>
      )}

      {/* DIRECT MEMBERS */}
      {activeTab === "members" && (
        <SectionCard title="Direct Members Management" icon={<Users className="w-4 h-4" />}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Registered Direct Members ({members.length})</h4>
            <PrimaryButton icon={<Plus className="w-4 h-4" />} size="sm" onClick={() => setMemberModalOpen(true)}>
              Enroll New Member
            </PrimaryButton>
          </div>
          {members.length === 0 ? (
            <EmptyState title="No direct members enrolled" description="Click button above to add direct members." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gymBorder">
              <table className="w-full text-left text-xs">
                <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Member Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                  {members.map((m: any) => (
                    <tr key={m.id || m._id} className="hover:bg-gymSurface/50 transition-colors">
                      <td className="p-3 font-semibold">{m.name}</td>
                      <td className="p-3 text-gymTextMuted">{m.email}</td>
                      <td className="p-3 text-gymOrange font-medium">{m.planName || "Direct Membership"}</td>
                      <td className="p-3"><StatusBadge status={m.status || "ACTIVE"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* TRAINERS ROSTER */}
      {activeTab === "trainers" && (
        <SectionCard title="Coaching & Trainer Roster" icon={<UserCheck className="w-4 h-4" />}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Active Trainers ({trainers.length})</h4>
            <SecondaryButton icon={<UserCheck className="w-4 h-4" />} size="sm" onClick={() => setInviteModalOpen(true)}>
              Invite Trainer
            </SecondaryButton>
          </div>
          {trainers.length === 0 ? (
            <EmptyState title="No trainers invited" description="Click button above to invite personal trainers." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-2">
                  <h4 className="text-xs font-bold text-gymTextPrimary">{t.name || "Trainer"}</h4>
                  <p className="text-[11px] text-gymOrange font-medium">{t.specialization || "Strength & Conditioning"}</p>
                  <div className="pt-2 border-t border-gymBorder/60 flex items-center justify-between text-[11px]">
                    <span className="text-gymTextMuted">Status</span>
                    <StatusBadge status={t.status || "ACTIVE"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* CHECK-IN HISTORY */}
      {activeTab === "checkins" && (
        <SectionCard title="Gym Check-in Footfall Logs" icon={<Activity className="w-4 h-4" />}>
          <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder text-xs text-gymTextMuted">
            Total Logged Footfall: <span className="font-bold text-gymOrange">{dashboardData?.checkinsCount || 0} Check-ins</span>
          </div>
        </SectionCard>
      )}

      {/* PRICING & PLANS */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          {/* 1. INPUT BOX & FORM TO FIX ACTIVITY COINS */}
          <SectionCard title="Gym Activity Pricing Manager" icon={<CreditCard className="w-4 h-4" />}>
            <form onSubmit={handleCreateActivity} className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-gymBorder">
                <div>
                  <h4 className="text-sm font-bold text-gymTextPrimary flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-400" />
                    Configure Facility Entry & Activity Coin Pricing
                  </h4>
                  <p className="text-xs text-gymTextMuted mt-0.5">
                    Fix the exact coins for your gym sessions and turnstile entries. You receive 100% of this fixed rate on every check-in.
                  </p>
                </div>
              </div>

              {actSuccessMsg && (
                <div className="p-3 rounded-xl bg-gymSuccess/15 border border-gymSuccess/30 text-gymSuccess text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{actSuccessMsg}</span>
                </div>
              )}

              {actErrorMsg && (
                <div className="p-3 rounded-xl bg-gymError/15 border border-gymError/30 text-gymError text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{actErrorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-semibold text-gymTextMuted block">Activity / Session Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. General Workout / Entry, Cardio Zone, CrossFit"
                    value={actName}
                    onChange={(e) => setActName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gymDark border border-gymBorder rounded-xl text-xs text-gymTextPrimary outline-none focus:border-gymOrange transition-all"
                  />
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-gymTextMuted block">Category *</label>
                  <select
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gymDark border border-gymBorder rounded-xl text-xs text-gymTextPrimary outline-none focus:border-gymOrange transition-all"
                  >
                    <option value="STRENGTH">Strength Training</option>
                    <option value="CARDIO">Cardio Zone</option>
                    <option value="FUNCTIONAL">Functional / CrossFit</option>
                    <option value="CLASSES">Studio Classes</option>
                    <option value="OTHER">General Entry / Other</option>
                  </select>
                </div>

                <div className="md:col-span-3 space-y-1.5">
                  <label className="text-xs font-semibold text-gymTextMuted block">
                    Coins Fixed by Owner *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">🪙</span>
                    <input
                      type="number"
                      min="1"
                      required
                      placeholder="100"
                      value={actCoins}
                      onChange={(e) => setActCoins(e.target.value)}
                      className="w-full pl-9 pr-14 py-2.5 bg-gymDark border border-amber-500/40 rounded-xl text-sm font-extrabold text-gymTextPrimary outline-none focus:border-gymOrange transition-all"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gymTextMuted text-xs font-bold">Coins</span>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <PrimaryButton
                    type="submit"
                    fullWidth
                    isLoading={creatingAct}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Save Activity
                  </PrimaryButton>
                </div>
              </div>
            </form>

            {/* 2. CONFIGURED ACTIVITIES LIST */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">
                  Configured Gym Activities ({activities.length})
                </h4>
                <span className="text-[11px] text-gymTextMuted">
                  Your fixed amount is synced to the QR Turnstile Scanner.
                </span>
              </div>

              {activities.length === 0 ? (
                <EmptyState
                  title="No custom activities configured"
                  description="Use the input box above to set your first fixed coin activity (e.g. 100 Coins for General Gym Entry)."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activities.map((act) => {
                    const isEditing = editingActId === act.id;
                    const fixedPrice = act.ownerCoins || act.currentPrice;

                    return (
                      <div
                        key={act.id}
                        className="p-5 rounded-2xl bg-gymSurface border border-gymBorder hover:border-gymOrange/50 transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gymDark text-gymOrange border border-gymBorder">
                              {act.category}
                            </span>
                            <StatusBadge status={act.status} />
                          </div>
                          <h4 className="text-sm font-extrabold text-gymTextPrimary">{act.name}</h4>
                          {act.description && (
                            <p className="text-xs text-gymTextMuted line-clamp-2">{act.description}</p>
                          )}
                        </div>

                        {/* FIXED RATE BOX (ONLY SHOWS OWNER FIXED AMOUNT) */}
                        <div className="p-3.5 rounded-xl bg-gymDark border border-gymBorder space-y-1">
                          <span className="text-[10px] uppercase font-bold text-gymTextMuted block">
                            Coins Fixed by You (100% Payout)
                          </span>
                          {isEditing ? (
                            <div className="flex items-center gap-2 pt-1">
                              <div className="relative flex-1">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-400 text-xs">🪙</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={editActCoins}
                                  onChange={(e) => setEditActCoins(e.target.value)}
                                  className="w-full pl-7 pr-2 py-1.5 bg-gymSurface border border-gymOrange rounded-lg text-xs font-bold text-gymTextPrimary outline-none"
                                />
                              </div>
                              <button
                                onClick={() => handleUpdatePrice(act.id)}
                                disabled={savingEditPrice}
                                className="px-2.5 py-1.5 rounded-lg bg-gymSuccess text-white text-xs font-bold hover:brightness-110 flex items-center gap-1 transition-all"
                              >
                                <Check className="w-3.5 h-3.5" /> Save
                              </button>
                              <button
                                onClick={() => setEditingActId(null)}
                                className="px-2 py-1.5 rounded-lg bg-gymSurface text-gymTextMuted hover:text-gymTextPrimary text-xs transition-all"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-baseline justify-between pt-0.5">
                              <span className="text-xl font-black text-amber-400 flex items-center gap-1.5">
                                <span>🪙</span> {fixedPrice} <span className="text-xs font-bold text-gymTextMuted">Coins</span>
                              </span>
                              <span className="text-xs font-mono font-bold text-gymSuccess">₹{fixedPrice} / session</span>
                            </div>
                          )}
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center justify-between pt-1 border-t border-gymBorder/40 text-xs">
                          {!isEditing && (
                            <button
                              onClick={() => {
                                setEditingActId(act.id);
                                setEditActCoins(fixedPrice);
                              }}
                              className="text-gymOrange hover:text-gymOrange/80 font-bold flex items-center gap-1 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" /> Edit Coins
                            </button>
                          )}
                          {act.status === "ACTIVE" && (
                            <button
                              onClick={() => handleDeleteActivity(act.id)}
                              className="text-gymTextMuted hover:text-red-400 ml-auto flex items-center gap-1 transition-all text-[11px]"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Deactivate
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      )}

      {/* VERIFICATION STATUS */}
      {activeTab === "verification" && (
        <SectionCard title="Trade License Verification Status" icon={<ShieldCheck className="w-4 h-4" />}>
          <div className="p-5 rounded-xl bg-gymSurface border border-gymBorder space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gymTextPrimary">Verification Application Status</span>
              <StatusBadge status={currentStatus} />
            </div>
            <div className="text-gymTextMuted">
              License Number: <span className="font-mono text-gymOrange">{verificationStatus?.licenseNumber || "Submitted"}</span>
            </div>
          </div>
        </SectionCard>
      )}

      {/* PAYOUT LEDGER */}
      {activeTab === "payouts" && (
        <SectionCard title="Footfall Revenue & Payout Ledger" icon={<PieChart className="w-4 h-4" />}>
          <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gymBorder">
              <span className="text-gymTextMuted">Settlement Cycle:</span>
              <span className="font-semibold text-gymTextPrimary">Weekly T+2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gymTextMuted">Your Payout Rate:</span>
              <span className="font-bold text-gymSuccess">100% of Fixed Activity Rate</span>
            </div>
            <p className="text-[11px] text-gymTextMuted pt-1">
              All member check-ins are credited directly to your payout ledger at the exact coin rate you set with zero deductions.
            </p>
          </div>
        </SectionCard>
      )}

      {/* SETTINGS */}
      {activeTab === "settings" && (
        <SectionCard title="Facility Settings & Parameters" icon={<Settings className="w-4 h-4" />}>
          <div className="max-w-md space-y-3 text-xs">
            <div>
              <label className="text-gymTextMuted block mb-1">Gym Name</label>
              <input type="text" disabled value={dashboardData?.gym?.name || "Partner Gym Facility"} className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-gymTextPrimary" />
            </div>
          </div>
        </SectionCard>
      )}

      {/* Modal: Invite Trainer */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-md w-full relative">
            <button onClick={() => setInviteModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gymTextPrimary mb-4">Invite Certified Trainer</h3>
            <form onSubmit={handleInviteTrainer} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Trainer Full Name</label>
                <input type="text" required value={trainerName} onChange={(e) => setTrainerName(e.target.value)} placeholder="Alex Rivera" className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Trainer Email Address</label>
                <input type="email" required value={trainerEmail} onChange={(e) => setTrainerEmail(e.target.value)} placeholder="alex@gym.com" className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Specialization</label>
                <input type="text" value={trainerSpec} onChange={(e) => setTrainerSpec(e.target.value)} placeholder="Strength & Conditioning" className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary" />
              </div>
              <PrimaryButton fullWidth isLoading={inviting} type="submit">
                Send Invitation Token
              </PrimaryButton>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Direct Member */}
      {memberModalOpen && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-md w-full relative">
            <button onClick={() => setMemberModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gymTextPrimary mb-4">Enroll Direct Member</h3>
            <form onSubmit={handleAddDirectMember} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Member Full Name</label>
                <input type="text" required value={memName} onChange={(e) => setMemName(e.target.value)} placeholder="Jordan Smith" className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Member Email Address</label>
                <input type="email" required value={memEmail} onChange={(e) => setMemEmail(e.target.value)} placeholder="jordan@example.com" className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary" />
              </div>
              <PrimaryButton fullWidth isLoading={addingMember} type="submit">
                Create Direct Pass Link
              </PrimaryButton>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Print QR Poster */}
      {printModalOpen && qrDoc && (
        <div className="fixed inset-0 z-50 bg-gymDark/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-black p-8 rounded-3xl max-w-lg w-full relative shadow-2xl space-y-6 text-center">
            <button onClick={() => setPrintModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black print:hidden">
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-black font-extrabold rounded-full text-xs tracking-wider uppercase">
                GYMTwiq Official Partner Gym
              </div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">{dashboardData?.gym?.name || "Partner Gym"}</h2>
              <p className="text-sm font-medium text-gray-600">Scan QR Code Below For Instant Check-In</p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border-4 border-gray-900 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(qrDoc.publicQrToken)}`}
                alt="Permanent Gym QR Code Poster"
                className="w-64 h-64 mx-auto object-contain"
              />
              <div className="mt-3 pt-3 border-t border-gray-300">
                <span className="text-xs text-gray-500 block uppercase font-bold">Gym QR ID</span>
                <span className="font-mono text-lg font-black text-amber-600">{qrDoc.qrId}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-left bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs">
              <div>
                <span className="font-bold text-amber-900 block text-[10px]">STEP 1</span>
                <span className="text-gray-700">Open GYMTwiq App</span>
              </div>
              <div>
                <span className="font-bold text-amber-900 block text-[10px]">STEP 2</span>
                <span className="text-gray-700">Scan Desk QR</span>
              </div>
              <div>
                <span className="font-bold text-amber-900 block text-[10px]">STEP 3</span>
                <span className="text-gray-700">Show Active Pass</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4" /> Print Gym Poster
              </button>
              <button
                onClick={() => setPrintModalOpen(false)}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Front Desk Kiosk View */}
      {displayModalOpen && qrDoc && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-white text-center space-y-6">
          <button onClick={() => setDisplayModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 rounded-full bg-gray-900">
            <X className="w-8 h-8" />
          </button>

          <div className="space-y-2">
            <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500 text-black">
              GYMTwiq Check-In Kiosk
            </span>
            <h1 className="text-4xl md:text-5xl font-black">{dashboardData?.gym?.name}</h1>
            <p className="text-gray-400 text-lg">Scan this QR Code with your GYMTwiq mobile app</p>
          </div>

          <div className="p-8 bg-white rounded-3xl shadow-2xl border-8 border-amber-500">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=450x450&data=${encodeURIComponent(qrDoc.publicQrToken)}`}
              alt="Kiosk Display QR"
              className="w-72 h-72 sm:w-96 sm:h-96 object-contain"
            />
            <div className="mt-4 text-black font-mono text-2xl font-black tracking-widest">{qrDoc.qrId}</div>
          </div>

          <p className="text-sm text-gray-500 animate-pulse">Permanent Active QR Identity • Instant Entitlement Verification</p>
        </div>
      )}

      {/* Modal: Regenerate / Revoke QR */}
      {regenerateModalOpen && qrDoc && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-md w-full relative space-y-4">
            <button onClick={() => setRegenerateModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-gymTextPrimary">Regenerate Permanent QR</h3>
            </div>

            <p className="text-xs text-gymTextMuted leading-relaxed">
              Regenerating your QR code will immediately <strong className="text-red-400">revoke the current active QR token ({qrDoc.qrId})</strong>. Any physical flyers printed with the old QR token will no longer work for check-in.
            </p>

            <form onSubmit={handleRegenerateQrSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Reason for Regeneration</label>
                <input
                  type="text"
                  required
                  value={regenerateReason}
                  onChange={(e) => setRegenerateReason(e.target.value)}
                  placeholder="e.g. Printed poster compromised, routine security rotation"
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <SecondaryButton type="button" onClick={() => setRegenerateModalOpen(false)}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton isLoading={regeneratingQr} type="submit">
                  Revoke & Issue New QR
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );

};
