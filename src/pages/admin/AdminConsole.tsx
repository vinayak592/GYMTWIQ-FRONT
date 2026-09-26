import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { AppShell } from "../../components/layout/AppShell";
import { MetricCard } from "../../components/ui/MetricCard";
import { GlassCard, SectionCard } from "../../components/ui/Cards";
import { PrimaryButton, SecondaryButton, DangerButton, StatusBadge } from "../../components/ui/Buttons";
import { LoadingSkeleton, EmptyState } from "../../components/ui/States";
import {
  ShieldCheck, Users, Dumbbell, Ticket, Coins, CreditCard, FileText,
  CheckCircle2, XCircle, AlertTriangle, Plus, Eye, RefreshCw, X, ShieldAlert, Lock, Settings, Search, ArrowUpRight,
  Trash2, Pencil, LayoutGrid, List, BarChart3, Download, FileSpreadsheet, CheckSquare, QrCode
} from "lucide-react";
import { User, Gym, SubscriptionPlan, AdminConfig, GymVisitAnalytics, PayoutLedger, SettlementReconciliation, CheckIn } from "../../types";

export const AdminConsole: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // Determine active view from URL subpath
  let activeTab = "dashboard";
  if (path.includes("/admin/users")) activeTab = "users";
  else if (path.includes("/admin/verifications")) activeTab = "verifications";
  else if (path.includes("/admin/gyms")) activeTab = "gyms";
  else if (path.includes("/admin/plans")) activeTab = "plans";
  else if (path.includes("/admin/coins")) activeTab = "coins";
  else if (path.includes("/admin/payments")) activeTab = "payments";
  else if (path.includes("/admin/settlements") || path.includes("/admin/analytics")) activeTab = "settlements";
  else if (path.includes("/admin/audit")) activeTab = "audit";
  else if (path.includes("/admin/settings")) activeTab = "settings";

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [gymsList, setGymsList] = useState<Gym[]>([]);
  const [configData, setConfigData] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Settlement & Gym Analytics State
  const [gymAnalyticsList, setGymAnalyticsList] = useState<GymVisitAnalytics[]>([]);
  const [settlementsList, setSettlementsList] = useState<PayoutLedger[]>([]);
  const [reconcileData, setReconcileData] = useState<SettlementReconciliation | null>(null);
  const [settlementGymFilter, setSettlementGymFilter] = useState<string>("");
  const [settlementStatusFilter, setSettlementStatusFilter] = useState<string>("");
  const [reconciling, setReconciling] = useState<boolean>(false);

  // Users & Gyms View Switchers & Action State
  const [userViewMode, setUserViewMode] = useState<"cards" | "table">("cards");
  const [gymViewMode, setGymViewMode] = useState<"cards" | "table">("cards");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Users Tab Search & Filter
  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Verification Review Modal State
  const [selectedVerif, setSelectedVerif] = useState<any | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [licenseBlobUrl, setLicenseBlobUrl] = useState<string | null>(null);
  const [licenseMimeType, setLicenseMimeType] = useState<string>("");
  const [licenseLoading, setLicenseLoading] = useState(false);
  const [licenseError, setLicenseError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedVerif) {
      const verifId = selectedVerif.id || selectedVerif._id;
      if (verifId) {
        setLicenseLoading(true);
        setLicenseError(null);
        setLicenseBlobUrl(null);
        api.getAdminOwnerVerificationLicenseBlob(verifId)
          .then((res) => {
            setLicenseBlobUrl(res.blobUrl);
            setLicenseMimeType(res.mimeType || "");
          })
          .catch((err) => {
            setLicenseError(err.message || "License document preview unavailable");
          })
          .finally(() => {
            setLicenseLoading(false);
          });
      }
    } else {
      setLicenseBlobUrl(null);
      setLicenseError(null);
    }
  }, [selectedVerif]);

  // Subscription Plan Modal States (Create & Edit)
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState(1999);
  const [planDuration, setPlanDuration] = useState(30);
  const [creatingPlan, setCreatingPlan] = useState(false);

  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editPlanName, setEditPlanName] = useState("");
  const [editPlanPrice, setEditPlanPrice] = useState<number>(1999);
  const [editPlanDuration, setEditPlanDuration] = useState<number>(30);
  const [editPlanCoins, setEditPlanCoins] = useState<number>(500);
  const [updatingPlan, setUpdatingPlan] = useState(false);

  // Selected Gym for Admin Details Modal
  const [selectedAdminGym, setSelectedAdminGym] = useState<Gym | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [dash, verifs, plansRes, usersRes, cfgRes, gymsRes, anaRes, setRes, recRes] = await Promise.all([
        api.getAdminDashboard().catch(() => null),
        api.getAdminOwnerVerifications().catch(() => []),
        api.getAdminSubscriptionPlans(true).catch(() => []),
        api.getAdminUsers().catch(() => []),
        api.getAdminConfig().catch(() => null),
        api.getAdminGyms().then(async (res) => {
          if (Array.isArray(res) && res.length > 0) return res;
          const fallback = await api.getGyms().catch(() => []);
          return fallback;
        }).catch(async () => {
          return await api.getGyms().catch(() => []);
        }),
        api.getAdminGymsAnalytics().catch(() => []),
        api.getAdminSettlements().catch(() => []),
        api.reconcileAdminSettlements().catch(() => null)
      ]);
      setDashboardData(dash);
      setVerifications(verifs);
      setPlans(plansRes);
      setUsersList(usersRes);
      setConfigData(cfgRes);
      setGymsList(gymsRes || []);
      setGymAnalyticsList(anaRes || []);
      setSettlementsList(setRes || []);
      setReconcileData(recRes);
    } catch (e) {
      console.error("Failed to load admin data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRunReconciliation = async () => {
    setReconciling(true);
    try {
      const res = await api.reconcileAdminSettlements({ gymId: settlementGymFilter || undefined });
      setReconcileData(res);
      const updatedSettlements = await api.getAdminSettlements({ gymId: settlementGymFilter || undefined, status: settlementStatusFilter || undefined });
      setSettlementsList(updatedSettlements);
      alert(`Settlement reconciliation completed. Status: ${res.status}`);
    } catch (err: any) {
      alert(err.message || "Reconciliation failed");
    } finally {
      setReconciling(false);
    }
  };

  const handleUpdateSettlementStatus = async (id: string, newStatus: string) => {
    try {
      await api.updateAdminSettlementStatus(id, newStatus);
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to update settlement status");
    }
  };

  const handleExportSettlementsCsv = async () => {
    try {
      const baseURL = "/api";
      const token = localStorage.getItem("gymtwiq_access_token") || localStorage.getItem("accessToken");
      let url = `${baseURL}/admin/settlements/export`;
      const params = new URLSearchParams();
      if (settlementGymFilter) params.append("gymId", settlementGymFilter);
      if (settlementStatusFilter) params.append("status", settlementStatusFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to export settlements CSV");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `settlements_report_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert(err.message || "Export failed");
    }
  };


  useEffect(() => {
    fetchAdminData();
  }, [location.pathname]);

  const handleApproveVerification = async (id: string) => {
    setReviewing(true);
    try {
      await api.approveAdminOwnerVerification(id, reviewNotes || "Approved by SuperAdmin");
      setSelectedVerif(null);
      setReviewNotes("");
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Approval failed");
    } finally {
      setReviewing(false);
    }
  };

  const handleRejectVerification = async (id: string) => {
    setReviewing(true);
    try {
      await api.rejectAdminOwnerVerification(id, reviewNotes || "License documentation non-compliant", reviewNotes);
      setSelectedVerif(null);
      setReviewNotes("");
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Rejection failed");
    } finally {
      setReviewing(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planName) return;
    setCreatingPlan(true);
    try {
      await api.createAdminSubscriptionPlan({
        name: planName,
        tier: "STANDARD",
        price: Number(planPrice),
        durationDays: Number(planDuration),
        walletFunding: 0,
        coinGrant: 500,
        features: ["All Network Gyms", "500 Coins"]
      });
      setPlanModalOpen(false);
      setPlanName("");
      fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Plan creation failed");
    } finally {
      setCreatingPlan(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName || 'this user'}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(userId);
    try {
      await api.deleteUser(userId);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to delete user account");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteGym = async (gymId: string, gymName: string) => {
    if (!window.confirm(`Are you sure you want to remove partner gym "${gymName}" from GYMTwiq network?`)) {
      return;
    }
    setDeletingId(gymId);
    try {
      await api.deleteGym(gymId);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to delete partner gym");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    if (!window.confirm(`Are you sure you want to delete subscription plan "${planName}"?`)) {
      return;
    }
    setDeletingId(planId);
    try {
      await api.deleteAdminSubscriptionPlan(planId);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to delete subscription plan");
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditPlanName(plan.name || "");
    setEditPlanPrice(plan.price || 0);
    setEditPlanDuration(plan.durationDays || 30);
    setEditPlanCoins(plan.coinGrant || 500);
  };

  const handleSaveEditedPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan || !editPlanName) return;
    setUpdatingPlan(true);
    try {
      await api.updateAdminSubscriptionPlan(editingPlan.id, {
        name: editPlanName,
        price: Number(editPlanPrice),
        durationDays: Number(editPlanDuration),
        coinGrant: Number(editPlanCoins),
      });
      setEditingPlan(null);
      await fetchAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to update subscription plan");
    } finally {
      setUpdatingPlan(false);
    }
  };

  // Filter Users
  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role?.toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AppShell title="Platform SuperAdmin Console">
      {/* 1. Header Hero */}
      <div className="card-3d-featured p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gymOrange/20 border border-gymOrange/40 text-gymOrange text-xs font-extrabold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SuperAdmin Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gymTextPrimary capitalize">
            {activeTab === "dashboard" && "Executive Ecosystem Overview"}
            {activeTab === "users" && "User Directory & Account Roles"}
            {activeTab === "verifications" && "Trade License Verification Queue"}
            {activeTab === "gyms" && "Partner Gym Directory"}
            {activeTab === "plans" && "Subscription Tiers & Pricing"}
            {activeTab === "coins" && "GYMTwiq Coins Economy"}
            {activeTab === "payments" && "Financial Settlements & Revenue"}
            {activeTab === "audit" && "Platform Audit Logs"}
            {activeTab === "settings" && "System Configuration & Controls"}
          </h1>
          <p className="text-xs text-gymTextSecondary">
            Authoritative platform management, verified facility compliance, coins economy parameters, and user roles.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <PrimaryButton icon={<Plus className="w-4 h-4" />} onClick={() => setPlanModalOpen(true)}>
            Create Subscription Plan
          </PrimaryButton>
        </div>
      </div>

      {/* 2. Executive KPI Metrics */}
      {loading ? (
        <LoadingSkeleton count={4} height="h-24" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Users"
            value={usersList.length}
            subtext="Platform Registrations"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            title="Pending Verifications"
            value={verifications.filter((v) => v.status === "PENDING").length}
            subtext="Trade License Submissions"
            icon={<ShieldCheck className="w-5 h-5" />}
          />
          <MetricCard
            title="Subscription Tiers"
            value={plans.length}
            subtext="Active Network Plans"
            icon={<Ticket className="w-5 h-5" />}
          />
          <MetricCard
            title="Platform Commission"
            value={`${configData?.network?.platformCommissionPct || 18.0}%`}
            subtext="Configured System Rate"
            icon={<CreditCard className="w-5 h-5" />}
          />
        </div>
      )}

      {/* 3. DYNAMIC TAB CONTENT */}

      {/* TABS 1: DASHBOARD OVERVIEW */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7">
            <SectionCard title="Gym Owner Verification Queue" icon={<ShieldCheck className="w-4 h-4" />}>
              {verifications.length === 0 ? (
                <EmptyState title="No pending owner verifications" description="All partner gym applications reviewed." />
              ) : (
                <div className="space-y-3">
                  {verifications.slice(0, 4).map((v) => (
                    <div key={v.id || v._id} className="p-4 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gymTextPrimary">{v.gymName || "Partner Gym"}</h4>
                        <p className="text-[11px] text-gymTextMuted">Owner: {v.ownerName} ({v.ownerEmail})</p>
                        <p className="text-[10px] text-gymOrange mt-0.5">License: {v.licenseNumber} ({v.licenseType})</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={v.status} />
                        <SecondaryButton size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setSelectedVerif(v)}>
                          Review
                        </SecondaryButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="xl:col-span-5">
            <SectionCard title="Network Subscription Plans" icon={<Ticket className="w-4 h-4" />}>
              {plans.length === 0 ? (
                <EmptyState title="No subscription plans configured" />
              ) : (
                <div className="space-y-3">
                  {plans.map((p) => (
                    <div key={p.id} className="p-3.5 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gymTextPrimary">{p.name}</h4>
                        <p className="text-[11px] text-gymOrange font-semibold">₹{p.price} / {p.durationDays} Days</p>
                      </div>
                      <StatusBadge status={p.status || "ACTIVE"} />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* TAB 2: USERS DIRECTORY */}
      {activeTab === "users" && (
        <SectionCard title="Users Directory & Accounts" icon={<Users className="w-4 h-4" />}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gymTextMuted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary placeholder-gymTextMuted outline-none focus:border-gymOrange"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 flex-wrap">
                {["ALL", "MEMBER", "OWNER", "TRAINER", "ADMIN"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      roleFilter === role ? "bg-gymOrange text-white shadow" : "bg-gymSurface text-gymTextMuted border border-gymBorder hover:text-gymTextPrimary"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-gymDark border border-gymBorder rounded-xl p-1 gap-1">
                <button
                  onClick={() => setUserViewMode("cards")}
                  className={`p-1.5 rounded-lg transition-all ${userViewMode === "cards" ? "bg-gymOrange text-white" : "text-gymTextMuted hover:text-gymTextPrimary"}`}
                  title="Card Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setUserViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all ${userViewMode === "table" ? "bg-gymOrange text-white" : "text-gymTextMuted hover:text-gymTextPrimary"}`}
                  title="Table View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {userViewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gymTextMuted bg-gymSurface border border-gymBorder rounded-2xl">
                  No user accounts found matching query.
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <div key={u.id || u.email} className="p-4 rounded-2xl bg-gymSurface border border-gymBorder hover:border-gymOrange/50 transition-all flex flex-col justify-between gap-3 shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gymOrange/10 border border-gymOrange/30 text-gymOrange font-bold flex items-center justify-center text-sm">
                          {(u.name || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-gymTextPrimary">{u.name || "User"}</h4>
                          <p className="text-xs text-gymTextMuted truncate max-w-[160px]">{u.email}</p>
                        </div>
                      </div>
                      <StatusBadge status={u.status || "ACTIVE"} />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gymBorder/40">
                      <span className="font-bold uppercase text-[10px] px-2 py-0.5 rounded bg-gymDark border border-gymBorder text-gymOrange">
                        {u.role}
                      </span>
                      <span className="font-mono text-gymTextMuted">🪙 {u.coins || 0} Coins</span>
                    </div>

                    <div className="pt-2">
                      <DangerButton
                        fullWidth
                        size="sm"
                        disabled={u.role === "admin" || deletingId === (u.id || (u as any)._id)}
                        isLoading={deletingId === (u.id || (u as any)._id)}
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        onClick={() => handleDeleteUser(u.id || (u as any)._id, u.name)}
                      >
                        Delete User
                      </DangerButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gymBorder">
              <table className="w-full text-left text-xs">
                <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Coins Balance</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gymTextMuted">No user accounts found matching query.</td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id || u.email} className="hover:bg-gymSurface/50 transition-colors">
                        <td className="p-3 font-semibold">{u.name || "User"}</td>
                        <td className="p-3 text-gymTextMuted">{u.email}</td>
                        <td className="p-3 font-bold uppercase text-[10px] text-gymOrange">{u.role}</td>
                        <td className="p-3 font-mono">🪙 {u.coins || 0}</td>
                        <td className="p-3"><StatusBadge status={u.status || "ACTIVE"} /></td>
                        <td className="p-3 text-right">
                          <button
                            disabled={u.role === "admin" || deletingId === (u.id || (u as any)._id)}
                            onClick={() => handleDeleteUser(u.id || (u as any)._id, u.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            title={u.role === "admin" ? "Cannot delete superadmin" : "Delete user"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* TAB 3: OWNER VERIFICATIONS */}
      {activeTab === "verifications" && (
        <SectionCard title="Gym Owner Verification Applications" icon={<ShieldCheck className="w-4 h-4" />}>
          {verifications.length === 0 ? (
            <EmptyState title="No pending verifications" description="All trade license submissions reviewed." />
          ) : (
            <div className="space-y-3">
              {verifications.map((v) => (
                <div key={v.id || v._id} className="p-4 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gymTextPrimary">{v.gymName || "Partner Gym"}</h4>
                    <p className="text-[11px] text-gymTextMuted">Owner: {v.ownerName} ({v.ownerEmail})</p>
                    <p className="text-[10px] text-gymOrange mt-0.5">License #: {v.licenseNumber} | Authority: {v.issuingAuthority || "Municipal"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={v.status} />
                    <SecondaryButton size="sm" icon={<Eye className="w-3.5 h-3.5" />} onClick={() => setSelectedVerif(v)}>
                      Review License
                    </SecondaryButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* TAB 4: PARTNER GYMS */}
      {activeTab === "gyms" && (
        <SectionCard title="Partner Gym Network Directory" icon={<Dumbbell className="w-4 h-4" />}>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h3 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Registered Network Gyms</h3>
            <div className="flex items-center bg-gymDark border border-gymBorder rounded-xl p-1 gap-1">
              <button
                onClick={() => setGymViewMode("cards")}
                className={`p-1.5 rounded-lg transition-all ${gymViewMode === "cards" ? "bg-gymOrange text-white" : "text-gymTextMuted hover:text-gymTextPrimary"}`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setGymViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${gymViewMode === "table" ? "bg-gymOrange text-white" : "text-gymTextMuted hover:text-gymTextPrimary"}`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {gymViewMode === "cards" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gymsList.length === 0 ? (
                <div className="col-span-full p-8 text-center text-gymTextMuted bg-gymSurface border border-gymBorder rounded-2xl">
                  No registered gyms found.
                </div>
              ) : (
                gymsList.map((g) => (
                  <div key={g.id || (g as any)._id} className="p-4 rounded-2xl bg-gymSurface border border-gymBorder hover:border-gymOrange/50 transition-all flex flex-col justify-between gap-3 shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gymOrange/10 border border-gymOrange/30 text-gymOrange font-bold flex items-center justify-center">
                          <Dumbbell className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-gymTextPrimary">{g.name}</h4>
                          <p className="text-xs text-gymTextMuted">{g.city} • {g.address || "Main Branch"}</p>
                        </div>
                      </div>
                      <StatusBadge status={g.status} />
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gymBorder/40">
                      <span className="text-gymTextMuted">Daily Access Rate</span>
                      <span className="font-extrabold text-gymOrange">₹{g.lowestDailyRate || 50}/day</span>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <SecondaryButton
                        fullWidth
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setSelectedAdminGym(g)}
                      >
                        View Creds & Details
                      </SecondaryButton>
                      <DangerButton
                        size="sm"
                        disabled={deletingId === (g.id || (g as any)._id)}
                        isLoading={deletingId === (g.id || (g as any)._id)}
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                        onClick={() => handleDeleteGym(g.id || (g as any)._id, g.name)}
                      >
                        Delete
                      </DangerButton>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gymBorder">
              <table className="w-full text-left text-xs">
                <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Gym Facility</th>
                    <th className="p-3">City</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Daily Rate</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                  {gymsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-gymTextMuted">No registered gyms.</td>
                    </tr>
                  ) : (
                    gymsList.map((g) => (
                      <tr key={g.id || (g as any)._id} className="hover:bg-gymSurface/50 transition-colors">
                        <td className="p-3 font-bold">{g.name}</td>
                        <td className="p-3 text-gymTextMuted">{g.city}</td>
                        <td className="p-3 text-gymTextMuted">{g.address || "Main Branch"}</td>
                        <td className="p-3 text-gymOrange font-semibold">₹{g.lowestDailyRate || 50}/day</td>
                        <td className="p-3"><StatusBadge status={g.status} /></td>
                        <td className="p-3 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAdminGym(g)}
                            className="p-1.5 rounded-lg bg-gymSurface hover:bg-gymOrange/20 text-gymOrange border border-gymBorder transition-all"
                            title="View Gym Creds & Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={deletingId === (g.id || (g as any)._id)}
                            onClick={() => handleDeleteGym(g.id || (g as any)._id, g.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                            title="Delete partner gym"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* TAB 5: SUBSCRIPTION PLANS */}
      {activeTab === "plans" && (
        <SectionCard title="Network Subscription Tiers" icon={<Ticket className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {plans.map((p) => (
              <div key={p.id || (p as any)._id} className="p-5 rounded-2xl bg-gymSurface border border-gymBorder hover:border-gymOrange transition-all space-y-3 flex flex-col justify-between shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-gymTextPrimary">{p.name}</h4>
                    <StatusBadge status={p.status || "ACTIVE"} />
                  </div>
                  <div className="text-xl font-extrabold text-gymOrange">
                    ₹{p.price} <span className="text-xs font-normal text-gymTextMuted">/ {p.durationDays} Days</span>
                  </div>
                  <div className="text-xs text-gymTextMuted space-y-1">
                    <div>🪙 {p.coinGrant || 500} Bonus Coins Granted</div>
                    <div>⚡ All Partner Network Gym Access</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gymBorder/40">
                  <SecondaryButton
                    fullWidth
                    size="sm"
                    icon={<Pencil className="w-3.5 h-3.5" />}
                    onClick={() => handleOpenEditPlan(p)}
                  >
                    Edit
                  </SecondaryButton>
                  <DangerButton
                    fullWidth
                    size="sm"
                    disabled={deletingId === (p.id || (p as any)._id)}
                    isLoading={deletingId === (p.id || (p as any)._id)}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => handleDeletePlan(p.id || (p as any)._id, p.name)}
                  >
                    Delete
                  </DangerButton>
                </div>
              </div>
            ))}
          </div>
          <PrimaryButton icon={<Plus className="w-4 h-4" />} onClick={() => setPlanModalOpen(true)}>
            Add New Subscription Tier
          </PrimaryButton>
        </SectionCard>
      )}

      {/* TAB 6: COINS ECONOMY */}
      {activeTab === "coins" && (
        <SectionCard title="GYMTwiq Coins Economy Settings" icon={<Coins className="w-4 h-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-1">
              <div className="text-xs text-gymTextMuted font-medium">Monthly Coin Grant</div>
              <div className="text-xl font-extrabold text-gymOrange">1,000 Coins</div>
              <div className="text-[10px] text-gymTextMuted">Per Network Subscription</div>
            </div>
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-1">
              <div className="text-xs text-gymTextMuted font-medium">Inactivity Expiry</div>
              <div className="text-xl font-extrabold text-gymTextPrimary">90 Days</div>
              <div className="text-[10px] text-gymTextMuted">Unused Lot Expiration</div>
            </div>
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-1">
              <div className="text-xs text-gymTextMuted font-medium">Daily Streak Reward</div>
              <div className="text-xl font-extrabold text-gymOrange">+100 Coins</div>
              <div className="text-[10px] text-gymTextMuted">Every 5 Consecutive Check-ins</div>
            </div>
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-1">
              <div className="text-xs text-gymTextMuted font-medium">Maximum Coin Cap</div>
              <div className="text-xl font-extrabold text-gymTextPrimary">100,000 Coins</div>
              <div className="text-[10px] text-gymTextMuted">Account Holding Ceiling</div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* TAB 7: PAYMENTS & PAYOUTS */}
      {activeTab === "payments" && (
        <SectionCard title="Financial Settlements & Payouts" icon={<CreditCard className="w-4 h-4" />}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-1">
              <div className="text-xs text-gymTextMuted font-medium">Platform Commission</div>
              <div className="text-xl font-extrabold text-gymOrange">{configData?.network?.platformCommissionPct || 18.0}%</div>
              <div className="text-[10px] text-gymTextMuted">Deducted from checkin settlements</div>
            </div>
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-1">
              <div className="text-xs text-gymTextMuted font-medium">Payment Gateway</div>
              <div className="text-xl font-extrabold text-gymTextPrimary">Razorpay Active</div>
              <div className="text-[10px] text-gymTextMuted">HMAC SHA256 Webhook Protected</div>
            </div>
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-1">
              <div className="text-xs text-gymTextMuted font-medium">Payout Cycle</div>
              <div className="text-xl font-extrabold text-gymTextPrimary">Weekly T+2</div>
              <div className="text-[10px] text-gymTextMuted">Automated Gym Settlements</div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeTab === "audit" && (
        <SectionCard title="Platform Security & System Audit Trail" icon={<FileText className="w-4 h-4" />}>
          <div className="overflow-x-auto rounded-xl border border-gymBorder">
            <table className="w-full text-left text-xs">
              <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action Event</th>
                  <th className="p-3">Actor Role</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                <tr className="hover:bg-gymSurface/50 transition-colors">
                  <td className="p-3 text-gymTextMuted">{new Date().toLocaleDateString()}</td>
                  <td className="p-3 font-semibold">Trade License Verification Approved</td>
                  <td className="p-3 text-gymOrange font-bold">SUPERADMIN</td>
                  <td className="p-3"><StatusBadge status="VERIFIED" /></td>
                </tr>
                <tr className="hover:bg-gymSurface/50 transition-colors">
                  <td className="p-3 text-gymTextMuted">{new Date().toLocaleDateString()}</td>
                  <td className="p-3 font-semibold">Subscription Plan Created</td>
                  <td className="p-3 text-gymOrange font-bold">SUPERADMIN</td>
                  <td className="p-3"><StatusBadge status="ACTIVE" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* TAB: GYM VISIT ANALYTICS & SETTLEMENT RECONCILIATION */}
      {activeTab === "settlements" && (
        <div className="space-y-6">
          <SectionCard title="Gym Visit Analytics & Settlement Manager" icon={<BarChart3 className="w-4 h-4" />}>
            {/* 1. Header Metrics & Reconciliation Summary */}
            <div className="p-6 rounded-2xl bg-gymSurface border border-gymBorder space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gymBorder">
                <div>
                  <h3 className="text-base font-extrabold text-gymTextPrimary flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gymOrange" /> Settlement Reconciliation Ledger
                  </h3>
                  <p className="text-xs text-gymTextMuted mt-0.5">
                    Authoritative server-checked reconciliation of member check-ins, coin deductions, platform commissions, and net gym payouts.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <SecondaryButton
                    size="sm"
                    icon={<FileSpreadsheet className="w-4 h-4" />}
                    onClick={handleExportSettlementsCsv}
                  >
                    Export Ledger (CSV)
                  </SecondaryButton>
                  <PrimaryButton
                    size="sm"
                    isLoading={reconciling}
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={handleRunReconciliation}
                  >
                    Run Reconciliation
                  </PrimaryButton>
                </div>
              </div>

              {/* Reconciliation Status Card */}
              {reconcileData && (
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs ${
                  reconcileData.status === "HEALTHY"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">
                        Reconciliation Status: {reconcileData.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gymDark text-gymTextMuted border border-gymBorder">
                        {reconcileData.reconciledAt ? new Date(reconcileData.reconciledAt).toLocaleTimeString() : "Just now"}
                      </span>
                    </div>
                    <p className="text-[11px] text-gymTextMuted">
                      Total Check-ins: {reconcileData.totalCheckins} ({reconcileData.networkCheckins} Network / {reconcileData.directCheckins} Direct) | Ledgers: {reconcileData.totalPayoutLedgerRecords}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 font-mono font-bold text-xs">
                    <div>
                      <span className="text-[10px] text-gymTextMuted uppercase block font-sans font-normal">Pending Settlement</span>
                      <span className="text-gymOrange">₹{reconcileData.pendingSettlementAmount.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gymTextMuted uppercase block font-sans font-normal">Settled Amount</span>
                      <span className="text-gymSuccess">₹{reconcileData.settledAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Gym Analytics Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Gym Footfall"
                  value={gymAnalyticsList.reduce((acc, curr) => acc + (curr.totalVisits || 0), 0)}
                  subtext="Check-ins logged"
                  icon={<BarChart3 className="w-5 h-5" />}
                />
                <MetricCard
                  title="Unique Visitors"
                  value={gymAnalyticsList.reduce((acc, curr) => acc + (curr.uniqueMembers || 0), 0)}
                  subtext="COUNT(DISTINCT memberId)"
                  icon={<Users className="w-5 h-5" />}
                />
                <MetricCard
                  title="Coins Spent at Gyms"
                  value={gymAnalyticsList.reduce((acc, curr) => acc + (curr.totalCoinsConsumed || 0), 0)}
                  subtext="🪙 Coins consumed"
                  icon={<Coins className="w-5 h-5" />}
                />
                <MetricCard
                  title="Net Gym Payouts"
                  value={`₹${gymAnalyticsList.reduce((acc, curr) => acc + (curr.totalPayoutAmount || 0), 0).toFixed(2)}`}
                  subtext="Payable to partner gyms"
                  icon={<CreditCard className="w-5 h-5" />}
                />
              </div>

              {/* 3. Partner Gym Visit Analytics Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Partner Gym Visit Analytics & QR Status</h4>
                <div className="overflow-x-auto rounded-xl border border-gymBorder">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Partner Gym</th>
                        <th className="p-3">City</th>
                        <th className="p-3">Active QR ID</th>
                        <th className="p-3 text-center">Total Visits</th>
                        <th className="p-3 text-center">Unique Members</th>
                        <th className="p-3 text-center">Coins Consumed</th>
                        <th className="p-3 text-right">Net Payout (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                      {gymAnalyticsList.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-gymTextMuted">No partner gym analytics data available.</td>
                        </tr>
                      ) : (
                        gymAnalyticsList.map((ana) => (
                          <tr key={ana.gymId} className="hover:bg-gymSurface/50 transition-colors">
                            <td className="p-3 font-bold text-gymTextPrimary">{ana.gymName || "Partner Gym"}</td>
                            <td className="p-3 text-gymTextMuted">{ana.city || "Bengaluru"}</td>
                            <td className="p-3 font-mono text-gymOrange font-bold">{ana.qrId || "GYM-ACTIVE"}</td>
                            <td className="p-3 text-center font-bold">{ana.totalVisits}</td>
                            <td className="p-3 text-center font-bold text-gymOrange">{ana.uniqueMembers}</td>
                            <td className="p-3 text-center font-mono text-amber-400">🪙 {ana.totalCoinsConsumed}</td>
                            <td className="p-3 text-right font-bold text-gymSuccess">₹{ana.totalPayoutAmount.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Settlement Ledger Table */}
              <div className="space-y-3 pt-4 border-t border-gymBorder">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">
                    Settlement Ledgers ({settlementsList.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <select
                      value={settlementStatusFilter}
                      onChange={(e) => setSettlementStatusFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-gymDark border border-gymBorder text-xs text-gymTextPrimary"
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="SETTLED">SETTLED</option>
                      <option value="PAID">PAID</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-gymBorder">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Ledger ID / Check-in ID</th>
                        <th className="p-3">Gym ID</th>
                        <th className="p-3">Member ID</th>
                        <th className="p-3 font-mono">Coins</th>
                        <th className="p-3 font-mono">Metering Rate</th>
                        <th className="p-3 font-mono">Commission</th>
                        <th className="p-3 font-mono">Net Payout</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                      {settlementsList.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="p-6 text-center text-gymTextMuted">No settlement ledger entries found.</td>
                        </tr>
                      ) : (
                        settlementsList.map((s) => (
                          <tr key={s.id || (s as any)._id} className="hover:bg-gymSurface/50 transition-colors">
                            <td className="p-3 font-mono text-[11px]">
                              <div className="font-bold text-gymTextPrimary">{(s.id || (s as any)._id).substring(0, 10)}...</div>
                              <div className="text-gymTextMuted text-[10px]">Chk: {s.checkinId?.substring(0, 10)}...</div>
                            </td>
                            <td className="p-3 text-gymTextMuted font-mono text-[11px]">{s.gymId}</td>
                            <td className="p-3 text-gymTextMuted font-mono text-[11px]">{s.memberId || "Member"}</td>
                            <td className="p-3 font-mono text-amber-400 font-bold">🪙 {s.coinAmount}</td>
                            <td className="p-3 font-mono">₹{s.walletDebit}</td>
                            <td className="p-3 font-mono text-gymOrange">₹{s.commissionAmount} ({s.commissionPct}%)</td>
                            <td className="p-3 font-mono font-bold text-gymSuccess">₹{s.payoutAmount}</td>
                            <td className="p-3">
                              <StatusBadge status={s.status} />
                            </td>
                            <td className="p-3 text-right">
                              {s.status === "PENDING" && (
                                <button
                                  onClick={() => handleUpdateSettlementStatus(s.id || (s as any)._id, "SETTLED")}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold transition-all"
                                >
                                  Mark Settled
                                </button>
                              )}
                              {s.status === "SETTLED" && (
                                <button
                                  onClick={() => handleUpdateSettlementStatus(s.id || (s as any)._id, "PAID")}
                                  className="px-2.5 py-1 rounded-lg bg-blue-500/15 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 text-[11px] font-bold transition-all"
                                >
                                  Mark Paid
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      )}

      {/* TAB 9: SYSTEM SETTINGS */}

      {activeTab === "settings" && (
        <SectionCard title="System Configuration & Controls" icon={<Settings className="w-4 h-4" />}>
          <div className="max-w-xl space-y-4">
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-2">
              <label className="text-xs font-bold text-gymTextPrimary block">Platform Commission Rate (%)</label>
              <input
                type="number"
                disabled
                value={configData?.network?.platformCommissionPct || 18.0}
                className="w-full px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
              />
              <p className="text-[10px] text-gymTextMuted">Default rate deducted from check-in settlement payouts to partner gyms.</p>
            </div>

            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-2">
              <label className="text-xs font-bold text-gymTextPrimary block">Payment Gateway Mode</label>
              <input
                type="text"
                disabled
                value="Razorpay Test Mode"
                className="w-full px-3 py-2 bg-gymDark border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* Modal: Review Verification Document */}
      {selectedVerif && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-lg w-full relative">
            <button onClick={() => setSelectedVerif(null)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gymTextPrimary mb-2">Review Trade License Verification</h3>
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-2 text-xs mb-4">
              <div><span className="text-gymTextMuted">Gym Name:</span> <span className="font-bold text-gymTextPrimary">{selectedVerif.gymName}</span></div>
              <div><span className="text-gymTextMuted">Owner:</span> <span className="font-bold text-gymTextPrimary">{selectedVerif.ownerName} ({selectedVerif.ownerEmail})</span></div>
              <div><span className="text-gymTextMuted">License Number:</span> <span className="font-mono text-gymOrange">{selectedVerif.licenseNumber}</span></div>
              <div><span className="text-gymTextMuted">Authority:</span> <span className="text-gymTextPrimary">{selectedVerif.issuingAuthority || "BBMP"}</span></div>
            </div>

            {/* Uploaded License Photo / Document Preview */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gymTextMuted">
                <span>Uploaded Trade License Document</span>
                {licenseBlobUrl && (
                  <a
                    href={licenseBlobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`license_${(selectedVerif.gymName || "gym").replace(/\s+/g, '_')}`}
                    className="text-gymOrange hover:underline flex items-center gap-1 font-semibold text-[11px]"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Open / Download File
                  </a>
                )}
              </div>

              <div className="p-3 rounded-xl bg-gymSurface border border-gymBorder overflow-hidden max-h-72 flex flex-col items-center justify-center relative min-h-[160px]">
                {licenseLoading ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-6 text-gymTextMuted text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin text-gymOrange" />
                    <span>Loading uploaded license document...</span>
                  </div>
                ) : licenseBlobUrl ? (
                  licenseMimeType.includes("pdf") ? (
                    <div className="text-center p-4 space-y-2">
                      <FileText className="w-12 h-12 text-gymOrange mx-auto" />
                      <div className="text-xs font-bold text-gymTextPrimary">PDF License Document Uploaded</div>
                      <p className="text-[11px] text-gymTextMuted">Official trade registration certificate submitted by owner.</p>
                      <a
                        href={licenseBlobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gymOrange text-white text-xs font-bold shadow-md hover:bg-gymOrange/90 transition-all mt-2"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View PDF License
                      </a>
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center">
                      <img
                        src={licenseBlobUrl}
                        alt="Uploaded Trade License Document"
                        className="max-h-56 max-w-full object-contain rounded-lg border border-gymBorder/60 shadow-lg"
                      />
                      <span className="text-[10px] text-gymTextMuted mt-1.5">Verified License Proof Image</span>
                    </div>
                  )
                ) : (
                  <div className="text-center p-4 text-gymTextMuted text-xs space-y-1">
                    <ShieldCheck className="w-8 h-8 text-gymOrange/60 mx-auto" />
                    <p className="font-semibold text-gymTextPrimary">License No: {selectedVerif.licenseNumber}</p>
                    <p className="text-[11px] text-gymTextMuted">
                      {licenseError || "No license image uploaded for this registration."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-gymTextMuted block mb-1">Admin Audit Notes / Rejection Reason</label>
              <textarea
                placeholder="Enter review findings..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary h-20"
              />
            </div>

            <div className="flex items-center gap-3">
              <PrimaryButton fullWidth isLoading={reviewing} onClick={() => handleApproveVerification(selectedVerif.id || selectedVerif._id)}>
                Approve Partner
              </PrimaryButton>
              <DangerButton fullWidth isLoading={reviewing} onClick={() => handleRejectVerification(selectedVerif.id || selectedVerif._id)}>
                Reject Partner
              </DangerButton>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Subscription Plan */}
      {planModalOpen && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-md w-full relative">
            <button onClick={() => setPlanModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gymTextPrimary mb-4">Create Subscription Tier</h3>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Plan Name</label>
                <input
                  type="text"
                  placeholder="e.g. Audit Elite Pass"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Price (INR)</label>
                <input
                  type="number"
                  value={planPrice}
                  onChange={(e) => setPlanPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={planDuration}
                  onChange={(e) => setPlanDuration(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <PrimaryButton fullWidth isLoading={creatingPlan} type="submit">
                Create Network Plan
              </PrimaryButton>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Subscription Plan */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-md w-full relative">
            <button onClick={() => setEditingPlan(null)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gymTextPrimary mb-4">Edit Subscription Tier</h3>
            <form onSubmit={handleSaveEditedPlan} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Plan Name</label>
                <input
                  type="text"
                  value={editPlanName}
                  onChange={(e) => setEditPlanName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Price (INR)</label>
                <input
                  type="number"
                  value={editPlanPrice}
                  onChange={(e) => setEditPlanPrice(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={editPlanDuration}
                  onChange={(e) => setEditPlanDuration(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Bonus Coins Grant</label>
                <input
                  type="number"
                  value={editPlanCoins}
                  onChange={(e) => setEditPlanCoins(Number(e.target.value))}
                  required
                  className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <SecondaryButton fullWidth onClick={() => setEditingPlan(null)} type="button">
                  Cancel
                </SecondaryButton>
                <PrimaryButton fullWidth isLoading={updatingPlan} type="submit">
                  Save Changes
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Partner Gym Credentials & Full Details */}
      {selectedAdminGym && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto space-y-4">
            <button onClick={() => setSelectedAdminGym(null)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gymOrange/10 border border-gymOrange/30 text-gymOrange font-bold flex items-center justify-center">
                <Dumbbell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-gymTextPrimary">{selectedAdminGym.name}</h3>
                <p className="text-xs text-gymTextMuted">{selectedAdminGym.city} • {selectedAdminGym.address || "Main Address"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={selectedAdminGym.status} />
              {selectedAdminGym.operatingHours && (
                <span className="px-2.5 py-1 rounded-lg bg-gymDark border border-gymBorder text-xs text-gymTextMuted">
                  ⏰ {selectedAdminGym.operatingHours}
                </span>
              )}
            </div>

            {/* Photos & Inner View Gallery */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Gym Cover & Inner View Images</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {selectedAdminGym.coverImage && (
                  <div className="relative rounded-xl overflow-hidden border border-gymOrange/50 h-28 group">
                    <img src={selectedAdminGym.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-gymOrange text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">COVER</span>
                  </div>
                )}
                {(selectedAdminGym.innerViewImages || selectedAdminGym.images || []).map((imgUrl, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-gymBorder h-28">
                    <img src={imgUrl} alt={`Inner view ${idx+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                {!selectedAdminGym.coverImage && (!selectedAdminGym.images || selectedAdminGym.images.length === 0) && (!selectedAdminGym.innerViewImages || selectedAdminGym.innerViewImages.length === 0) && (
                  <div className="col-span-full p-4 rounded-xl bg-gymSurface border border-gymBorder text-center text-xs text-gymTextMuted">
                    No gym photos uploaded yet by owner.
                  </div>
                )}
              </div>
            </div>

            {/* Total Equipment Counts */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Equipment Inventory & Counts</h4>
              {selectedAdminGym.equipments && selectedAdminGym.equipments.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedAdminGym.equipments.map((eq, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between text-xs">
                      <span className="font-semibold text-gymTextPrimary">{eq.name}</span>
                      <span className="font-extrabold text-gymOrange px-2 py-0.5 rounded bg-gymDark border border-gymBorder">
                        x{eq.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder text-center text-xs text-gymTextMuted">
                  Standard gym equipment roster available.
                </div>
              )}
            </div>

            {/* Facilities & Amenities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Facilities Offered</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedAdminGym.facilities || ["Free Weights", "Cardio Zone", "Lockers"]).map((f, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-gymSurface border border-gymBorder text-[11px] text-gymTextPrimary font-medium">
                      ⚡ {f}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedAdminGym.amenities || ["Parking", "WiFi", "Water Refill"]).map((a, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-lg bg-gymSurface border border-gymBorder text-[11px] text-gymTextPrimary font-medium">
                      ✨ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gymBorder/60 flex items-center justify-between">
              <span className="text-xs text-gymTextMuted">Daily Access Rate: <strong className="text-gymOrange">₹{selectedAdminGym.lowestDailyRate || 50}/day</strong></span>
              <SecondaryButton onClick={() => setSelectedAdminGym(null)}>Close Details</SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};
