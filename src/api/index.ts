import { apiClient } from "./client";
import {
  User, Gym, PricingPlan, Subscription, Entitlement, DashboardState, CheckIn,
  WalletInfo, WalletLedgerEntry, CoinBalanceInfo, CoinPackage, CoinLedgerEntry,
  Product, Notification, AdminConfig, PartnerPlan, TrainerProfile,
  TrainerClientAssignment, WorkoutPlan, TrainingSession, ProgressRecord,
  GymActivity, GymActivityPricing, ActivityQuote,
  SubscriptionPlan, PlanVersionHistory, AdminAuditLog,
  OwnerSubscriptionInfo, PaymentReconciliationRecord, PaymentRecord,
  GymQRCode, PayoutLedger, GymVisitAnalytics, SettlementReconciliation
} from "../types";

export const api = {
  // Auth
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string; referredBy?: string }) =>
    apiClient.post("/auth/register", data).then((res) => res.data),

  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }).then((res) => res.data),

  logout: () => apiClient.post("/auth/logout").then((res) => res.data),

  claimAccount: (token: string, password: string) =>
    apiClient.post("/auth/claim", { token, password }).then((res) => res.data),

  // Users
  getMe: (): Promise<User> =>
    apiClient.get("/users/me").then((res) => res.data.data),

  updateMe: (data: Partial<User>): Promise<User> =>
    apiClient.patch("/users/me", data).then((res) => res.data.data),

  getReferral: (): Promise<any> =>
    apiClient.get("/users/me/referral").then((res) => res.data.data),

  // Gyms & New City Mode
  getGyms: (city?: string): Promise<Gym[]> =>
    apiClient.get(`/gyms${city ? `?city=${encodeURIComponent(city)}` : ""}`).then((res) => res.data.data),

  getGym: (id: string): Promise<Gym> =>
    apiClient.get(`/gyms/${id}`).then((res) => res.data.data),

  getGymActivities: (gymId: string): Promise<GymActivity[]> =>
    apiClient.get(`/gyms/${gymId}/activities`).then((res) => res.data.data),

  createGym: (data: any): Promise<Gym> =>
    apiClient.post("/gyms", data).then((res) => res.data.data),

  updateGym: (id: string, data: any): Promise<Gym> =>
    apiClient.patch(`/gyms/${id}`, data).then((res) => res.data.data),

  getGymCities: (): Promise<string[]> =>
    apiClient.get("/gyms/cities").then((res) => res.data.data),

  getGymCategories: (): Promise<string[]> =>
    apiClient.get("/gyms/categories").then((res) => res.data.data),

  getPartnerPlans: (): Promise<PartnerPlan[]> =>
    apiClient.get("/partner-plans").then((res) => res.data.data),

  addGymPricingPlan: (gymId: string, data: { name: string; price: number; durationDays: number }): Promise<PricingPlan> =>
    apiClient.post(`/gyms/${gymId}/plans`, data).then((res) => res.data.data),

  // Subscriptions
  getNetworkPlans: (planType?: string): Promise<SubscriptionPlan[]> =>
    apiClient.get(`/subscriptions/plans${planType ? `?planType=${planType}` : ""}`).then((res) => res.data.data),

  getMySubscription: (): Promise<Subscription | null> =>
    apiClient.get("/subscriptions/me").then((res) => res.data.data),

  subscribe: (data?: any): Promise<Subscription> =>
    apiClient.post("/subscriptions", data || {}).then((res) => res.data.data),

  purchaseSubscriptionWithCoins: (planId: string) =>
    apiClient.post("/subscriptions/purchase-with-coins", { planId }).then((res) => res.data.data),

  cancelSubscription: () =>
    apiClient.post("/subscriptions/cancel").then((res) => res.data),

  // Entitlements
  getMyEntitlements: (): Promise<{
    dashboardState: DashboardState;
    hasNetworkEntitlement: boolean;
    hasDirectEntitlement: boolean;
    hasExpiredDirectEntitlement: boolean;
    networkEntitlement: Entitlement | null;
    directEntitlements: Entitlement[];
    latestDirectEntitlement: Entitlement | null;
    primaryEntitlementType: "NETWORK" | "DIRECT" | "NONE";
  }> => apiClient.get("/entitlements/me").then((res) => res.data.data),

  // Checkins & Activity Quotes
  getActivityQuote: (gymId: string, activityIds: string[]): Promise<ActivityQuote> =>
    apiClient.post("/checkins/quote", { gymId, activityIds }).then((res) => res.data.data),

  checkIn: (gymId: string, idempotencyKey: string, accessMode: string = "FULL_GYM", activityIds?: string[]): Promise<CheckIn> =>
    apiClient.post("/checkins", { gymId, idempotencyKey, accessMode, activityIds }).then((res) => res.data.data),

  getUserCheckins: (): Promise<CheckIn[]> =>
    apiClient.get("/checkins").then((res) => res.data.data),

  // Wallet (Deprecated)
  getWallet: (): Promise<WalletInfo> =>
    apiClient.get("/wallet").then((res) => res.data.data),

  getWalletLedger: (): Promise<WalletLedgerEntry[]> =>
    apiClient.get("/wallet/ledger").then((res) => res.data.data),

  topUpWallet: (amount: number): Promise<any> =>
    apiClient.post("/wallet/topup", { amount }).then((res) => res.data),

  // Coins
  getCoinBalance: (): Promise<CoinBalanceInfo> =>
    apiClient.get("/coins/balance").then((res) => res.data.data),

  getCoinLedger: (): Promise<CoinLedgerEntry[]> =>
    apiClient.get("/coins/ledger").then((res) => res.data.data),

  getCoinPackages: (): Promise<CoinPackage[]> =>
    apiClient.get("/coins/packages").then((res) => res.data.data),

  spendCoins: (amount: number, itemId?: string, itemName?: string): Promise<any> =>
    apiClient.post("/coins/spend", { amount, itemId, itemName }).then((res) => res.data),

  purchaseCoins: (amount: number): Promise<any> =>
    apiClient.post("/coins/purchase", { amount }).then((res) => res.data),

  createCoinOrder: (amountInr: number, packageId?: string) =>
    apiClient.post("/coins/purchase/order", { amountInr, packageId }).then((res) => res.data.data),

  verifyCoinPurchase: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    apiClient.post("/coins/purchase/verify", {
      razorpay_order_id: data.razorpayOrderId,
      razorpay_payment_id: data.razorpayPaymentId,
      razorpay_signature: data.razorpaySignature,
    }).then((res) => res.data),

  // Reviews
  addReview: (data: { gymId: string; rating: number; comment: string; tags?: string[] }) =>
    apiClient.post("/reviews", data).then((res) => res.data),

  getGymReviews: (gymId: string) =>
    apiClient.get(`/reviews/gym/${gymId}`).then((res) => res.data.data),

  // Products
  getProducts: (): Promise<Product[]> =>
    apiClient.get("/products").then((res) => res.data.data),

  redeemProduct: (productId: string) =>
    apiClient.post("/products/redeem", { productId }).then((res) => res.data),

  // Notifications
  getNotifications: (): Promise<Notification[]> =>
    apiClient.get("/notifications").then((res) => res.data.data),

  markNotificationRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`).then((res) => res.data),

  // Owner
  getOwnerDashboard: () =>
    apiClient.get("/owner/dashboard").then((res) => res.data.data),

  getOwnerMembers: (type?: string) =>
    apiClient.get(`/owner/members${type ? `?type=${type}` : ""}`).then((res) => res.data.data),

  registerDirectMember: (data: { name: string; email: string; phone?: string; planName?: string; durationDays?: number }) =>
    apiClient.post("/owner/members", data).then((res) => res.data),

  getOwnerCheckins: () =>
    apiClient.get("/owner/checkins").then((res) => res.data.data),

  getOwnerPayouts: () =>
    apiClient.get("/owner/payouts").then((res) => res.data.data),

  getOwnerAnalytics: () =>
    apiClient.get("/owner/analytics").then((res) => res.data.data),

  getOwnerGym: (): Promise<Gym> =>
    apiClient.get("/owner/gym").then((res) => res.data.data),

  updateOwnerGym: (data: Partial<Gym>): Promise<Gym> =>
    apiClient.patch("/owner/gym", data).then((res) => res.data.data),

  // Owner - Partner Plan
  getPartnerPlan: (): Promise<{ currentPlan: PartnerPlan; availablePlans: PartnerPlan[] }> =>
    apiClient.get("/owner/partner-plan").then((res) => res.data.data),

  upgradePartnerPlan: (planName: string): Promise<PartnerPlan> =>
    apiClient.post("/owner/partner-plan/upgrade", { planName }).then((res) => res.data.data),

  // Owner - Authoritative Subscription & Billing
  getOwnerSubscription: (): Promise<OwnerSubscriptionInfo> =>
    apiClient.get("/owner/subscription").then((res) => res.data.data),

  cancelOwnerSubscription: (policy?: string): Promise<any> =>
    apiClient.post("/owner/subscription/cancel", { policy }).then((res) => res.data),

  getOwnerPlans: (): Promise<SubscriptionPlan[]> =>
    apiClient.get("/subscriptions/plans?planType=OWNER").then((res) => res.data.data),

  getOwnerPaymentHistory: (): Promise<PaymentRecord[]> =>
    apiClient.get("/payments/owner/history").then((res) => res.data.data),

  // Owner - Trainers
  getOwnerTrainers: (): Promise<TrainerProfile[]> =>
    apiClient.get("/owner/trainers").then((res) => res.data.data),

  inviteTrainer: (data: { name: string; email: string; phone?: string; specialization?: string; bio?: string }): Promise<any> =>
    apiClient.post("/owner/trainers/invite", data).then((res) => res.data),

  setTrainerStatus: (trainerId: string, status: string): Promise<TrainerProfile> =>
    apiClient.patch(`/owner/trainers/${trainerId}/status`, { status }).then((res) => res.data.data),

  getTrainerAssignments: (): Promise<TrainerClientAssignment[]> =>
    apiClient.get("/owner/trainer-assignments").then((res) => res.data.data),

  assignClientToTrainer: (data: { trainerId: string; memberId: string; notes?: string }): Promise<TrainerClientAssignment> =>
    apiClient.post("/owner/trainers/assign", data).then((res) => res.data.data),

  reassignClient: (data: { assignmentId: string; newTrainerId: string; notes?: string }): Promise<TrainerClientAssignment> =>
    apiClient.post("/owner/trainers/reassign", data).then((res) => res.data.data),

  endTrainerAssignment: (assignmentId: string): Promise<TrainerClientAssignment> =>
    apiClient.post(`/owner/trainers/assignments/${assignmentId}/end`).then((res) => res.data.data),

  // Owner - Activities & Versioned Pricing
  getOwnerActivities: (): Promise<GymActivity[]> =>
    apiClient.get("/owner/activities").then((res) => res.data.data),

  createOwnerActivity: (data: { category: string; name: string; description?: string; priceInr?: number }): Promise<GymActivity> =>
    apiClient.post("/owner/activities", data).then((res) => res.data.data),

  updateOwnerActivity: (activityId: string, data: Partial<GymActivity>): Promise<GymActivity> =>
    apiClient.patch(`/owner/activities/${activityId}`, data).then((res) => res.data.data),

  setActivityPrice: (activityId: string, priceInr: number): Promise<GymActivityPricing> =>
    apiClient.post(`/owner/activities/${activityId}/price`, { priceInr }).then((res) => res.data.data),

  getActivityPricingHistory: (activityId: string): Promise<GymActivityPricing[]> =>
    apiClient.get(`/owner/activities/${activityId}/pricing-history`).then((res) => res.data.data),

  getActivityAnalytics: (): Promise<{ totalActivityCheckins: number; activities: any[] }> =>
    apiClient.get("/owner/activities/analytics").then((res) => res.data.data),

  // Trainer Portal
  getTrainerProfile: (): Promise<TrainerProfile> =>
    apiClient.get("/trainers/me/profile").then((res) => res.data.data),

  updateTrainerProfile: (data: Partial<TrainerProfile>): Promise<TrainerProfile> =>
    apiClient.patch("/trainers/me/profile", data).then((res) => res.data.data),

  getTrainerClients: (): Promise<TrainerClientAssignment[]> =>
    apiClient.get("/trainers/me/clients").then((res) => res.data.data),

  getTrainerClientDetail: (memberId: string): Promise<{ client: User; recentCheckins: CheckIn[] }> =>
    apiClient.get(`/trainers/me/clients/${memberId}`).then((res) => res.data.data),

  getTrainerWorkoutPlans: (memberId?: string): Promise<WorkoutPlan[]> =>
    apiClient.get(`/trainers/me/workout-plans${memberId ? `?memberId=${memberId}` : ""}`).then((res) => res.data.data),

  createWorkoutPlan: (data: Partial<WorkoutPlan>): Promise<WorkoutPlan> =>
    apiClient.post("/trainers/me/workout-plans", data).then((res) => res.data.data),

  updateWorkoutPlan: (planId: string, data: Partial<WorkoutPlan>): Promise<WorkoutPlan> =>
    apiClient.patch(`/trainers/me/workout-plans/${planId}`, data).then((res) => res.data.data),

  getTrainerSessions: (memberId?: string): Promise<TrainingSession[]> =>
    apiClient.get(`/trainers/me/sessions${memberId ? `?memberId=${memberId}` : ""}`).then((res) => res.data.data),

  scheduleTrainingSession: (data: Partial<TrainingSession>): Promise<TrainingSession> =>
    apiClient.post("/trainers/me/sessions", data).then((res) => res.data.data),

  updateTrainingSession: (sessionId: string, status: string, notes?: string): Promise<TrainingSession> =>
    apiClient.patch(`/trainers/me/sessions/${sessionId}`, { status, notes }).then((res) => res.data.data),

  recordClientProgress: (data: { memberId: string; gymId?: string; metrics: any; notes?: string }): Promise<ProgressRecord> =>
    apiClient.post("/trainers/me/progress", data).then((res) => res.data.data),

  getTrainerClientProgress: (memberId: string): Promise<ProgressRecord[]> =>
    apiClient.get(`/trainers/me/progress/${memberId}`).then((res) => res.data.data),

  getAiWorkoutTemplate: (goal?: string): Promise<any> =>
    apiClient.get(`/trainers/me/ai-template${goal ? `?goal=${encodeURIComponent(goal)}` : ""}`).then((res) => res.data.data),

  // Member Trainer & AI Endpoints
  getEligibleTrainers: (gymId?: string): Promise<TrainerProfile[]> =>
    apiClient.get(`/trainers/eligible${gymId ? `?gymId=${encodeURIComponent(gymId)}` : ""}`).then((res) => res.data.data),

  selectTrainer: (trainerId: string, notes?: string): Promise<any> =>
    apiClient.post("/users/me/trainer/select", { trainerId, notes }).then((res) => res.data.data),

  getMyTrainer: (): Promise<{ assignmentId: string; assignedAt: string; notes?: string; trainer: TrainerProfile } | null> =>
    apiClient.get("/users/me/trainer").then((res) => res.data.data),

  getMyWorkoutPlans: (): Promise<WorkoutPlan[]> =>
    apiClient.get("/users/me/workout-plans").then((res) => res.data.data),

  getMySessions: (): Promise<TrainingSession[]> =>
    apiClient.get("/users/me/sessions").then((res) => res.data.data),

  getMyProgress: (): Promise<ProgressRecord[]> =>
    apiClient.get("/users/me/progress").then((res) => res.data.data),

  getAiActivityRecommendations: (gymId: string, fitnessGoal?: string, availableMinutes?: number): Promise<any> =>
    apiClient.post("/users/me/recommendations/activities", { gymId, fitnessGoal, availableMinutes }).then((res) => res.data.data),

  getMyReferral: (): Promise<{
    referralCode: string;
    referralLink: string;
    rewardCoins: number;
    rewardWalletInr: number;
    friendBonusInr: number;
    stats: { friendsInvited: number; coinsEarned: number; walletEarned: number };
  }> => apiClient.get("/users/me/referral").then((res) => res.data.data),

  // Admin
  getAdminDashboard: () =>
    apiClient.get("/admin/dashboard").then((res) => res.data.data),

  getAdminGyms: (): Promise<Gym[]> =>
    apiClient.get("/admin/gyms").then((res) => res.data.data),

  verifyGym: (id: string) =>
    apiClient.patch(`/admin/gyms/${id}/verify`).then((res) => res.data),

  updateGymStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/gyms/${id}/status`, { status }).then((res) => res.data),

  deleteGym: (id: string) =>
    apiClient.delete(`/admin/gyms/${id}`).then((res) => res.data),

  getAdminUsers: (): Promise<User[]> =>
    apiClient.get("/admin/users").then((res) => res.data.data),

  deleteUser: (id: string) =>
    apiClient.delete(`/admin/users/${id}`).then((res) => res.data),

  getAdminPayouts: () =>
    apiClient.get("/admin/payouts").then((res) => res.data.data),

  getAdminPayments: () =>
    apiClient.get("/admin/payments").then((res) => res.data.data),

  getAdminConfig: (): Promise<AdminConfig> =>
    apiClient.get("/admin/config").then((res) => res.data.data),

  updateAdminConfig: (updates: any): Promise<AdminConfig> =>
    apiClient.patch("/admin/config", updates).then((res) => res.data.data),

  addAdminProduct: (product: any) =>
    apiClient.post("/admin/products", product).then((res) => res.data),

  deleteAdminProduct: (id: string) =>
    apiClient.delete(`/admin/products/${id}`).then((res) => res.data),

  // Admin Subscription Plans
  getAdminSubscriptionPlans: (includeArchived: boolean = true, planType?: string): Promise<SubscriptionPlan[]> =>
    apiClient.get(`/admin/subscription-plans?includeArchived=${includeArchived}${planType ? `&planType=${planType}` : ""}`).then((res) => res.data.data),

  createAdminSubscriptionPlan: (data: any): Promise<SubscriptionPlan> =>
    apiClient.post("/admin/subscription-plans", data).then((res) => res.data.data),

  updateAdminSubscriptionPlan: (id: string, data: any): Promise<SubscriptionPlan> =>
    apiClient.patch(`/admin/subscription-plans/${id}`, data).then((res) => res.data.data),

  setAdminSubscriptionPlanStatus: (id: string, status: string): Promise<SubscriptionPlan> =>
    apiClient.patch(`/admin/subscription-plans/${id}/status`, { status }).then((res) => res.data.data),

  duplicateAdminSubscriptionPlan: (id: string, newCode?: string, newName?: string): Promise<SubscriptionPlan> =>
    apiClient.post(`/admin/subscription-plans/${id}/duplicate`, { code: newCode, name: newName }).then((res) => res.data.data),

  getAdminSubscriptionPlanHistory: (id: string): Promise<PlanVersionHistory[]> =>
    apiClient.get(`/admin/subscription-plans/${id}/history`).then((res) => res.data.data),

  getAdminSubscriptionPlanAuditLogs: (id: string): Promise<AdminAuditLog[]> =>
    apiClient.get(`/admin/subscription-plans/${id}/audit-logs`).then((res) => res.data.data),

  deleteAdminSubscriptionPlan: (id: string): Promise<any> =>
    apiClient.delete(`/admin/subscription-plans/${id}`).then((res) => res.data.data),

  getAdminPaymentsReconciliation: (params?: { planType?: string; status?: string; page?: number; limit?: number }): Promise<{ records: PaymentReconciliationRecord[]; total: number; page: number; pages: number }> => {
    const query = new URLSearchParams();
    if (params?.planType) query.set("planType", params.planType);
    if (params?.status) query.set("status", params.status);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    return apiClient.get(`/admin/payments/reconciliation?${query.toString()}`).then((res) => res.data.data);
  },

  retryAdminPaymentFulfillment: (paymentId: string): Promise<any> =>
    apiClient.post(`/admin/payments/${paymentId}/retry-fulfillment`).then((res) => res.data),

  // Razorpay Payments
  createRazorpayOrder: (planId: string) =>
    apiClient.post("/payments/razorpay/order", { planId }).then((res) => res.data.data),

  verifyRazorpayPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    apiClient.post("/payments/razorpay/verify", {
      razorpay_order_id: data.razorpayOrderId,
      razorpay_payment_id: data.razorpayPaymentId,
      razorpay_signature: data.razorpaySignature,
    }).then((res) => res.data),

  getPaymentHistory: () =>
    apiClient.get("/payments/history").then((res) => res.data.data),

  getAnalytics: () =>
    apiClient.get("/analytics").then((res) => res.data.data),

  // Owner Verification & Onboarding
  registerOwner: (formData: FormData) =>
    apiClient.post("/auth/register", formData).then((res) => res.data),

  getOwnerVerificationStatus: (): Promise<any> =>
    apiClient.get("/owner/verification-status").then((res) => res.data.data),

  resubmitOwnerVerification: (formData: FormData): Promise<any> =>
    apiClient.post("/owner/verification-resubmit", formData).then((res) => res.data.data),

  getSupportedLicenseTypes: (): Promise<string[]> =>
    apiClient.get("/gyms/license-types").then((res) => res.data.data),

  // Admin Owner Verifications Console
  getAdminOwnerVerifications: (params?: { status?: string; licenseExpiring?: boolean; search?: string }): Promise<any[]> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "ALL") query.set("status", params.status);
    if (params?.licenseExpiring) query.set("licenseExpiring", "true");
    if (params?.search) query.set("search", params.search);
    return apiClient.get(`/admin/owner-verifications?${query.toString()}`).then((res) => res.data.data);
  },

  getAdminOwnerVerificationMetrics: (): Promise<any> =>
    apiClient.get("/admin/owner-verifications/metrics").then((res) => res.data.data),

  getAdminOwnerVerificationDetail: (id: string): Promise<any> =>
    apiClient.get(`/admin/owner-verifications/${id}`).then((res) => res.data.data),

  reviewAdminOwnerVerification: (id: string, adminNotes?: string): Promise<any> =>
    apiClient.post(`/admin/owner-verifications/${id}/review`, { adminNotes }).then((res) => res.data.data),

  approveAdminOwnerVerification: (id: string, adminNotes?: string): Promise<any> =>
    apiClient.post(`/admin/owner-verifications/${id}/approve`, { adminNotes }).then((res) => res.data.data),

  rejectAdminOwnerVerification: (id: string, reason: string, adminNotes?: string): Promise<any> =>
    apiClient.post(`/admin/owner-verifications/${id}/reject`, { reason, adminNotes }).then((res) => res.data.data),

  suspendAdminOwnerVerification: (id: string, reason: string): Promise<any> =>
    apiClient.post(`/admin/owner-verifications/${id}/suspend`, { reason }).then((res) => res.data.data),

  getAdminOwnerVerificationLicenseBlob: async (id: string): Promise<{ blobUrl: string; mimeType: string; filename: string }> => {
    const token = localStorage.getItem("gymtwiq_access_token") || localStorage.getItem("accessToken");
    const baseURL = apiClient.defaults.baseURL || "/api";
    const response = await fetch(`${baseURL}/admin/owner-verifications/${id}/license`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("License document not found or access denied");
    }
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (data.success && data.data?.signedUrl) {
        return { blobUrl: data.data.signedUrl, mimeType: "image/jpeg", filename: "license" };
      }
    }
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return {
      blobUrl,
      mimeType: blob.type || contentType,
      filename: "license_document"
    };
  },

  // Permanent Gym QR Identity & Check-In
  resolveQr: (token: string): Promise<{
    gymId: string;
    gymName: string;
    city: string;
    address: string;
    dailyRate: number;
    requiredCoins: number;
    qrId: string;
    publicQrToken: string;
  }> =>
    apiClient.get("/checkins/resolve-qr", { params: { token } }).then((res) => res.data.data),

  processQrCheckin: (qrToken: string, idempotencyKey: string, accessMode = "FULL_GYM", activityIds?: string[]) =>
    apiClient.post("/checkins/qr", { qrToken, idempotencyKey, accessMode, activityIds }).then((res) => res.data),

  getOwnerQrCode: (): Promise<GymQRCode> =>
    apiClient.get("/owner/qr").then((res) => res.data.data),

  regenerateOwnerQrCode: (reason?: string): Promise<GymQRCode> =>
    apiClient.post("/owner/qr/regenerate", { reason }).then((res) => res.data.data),

  getOwnerQrAnalytics: (startDate?: string, endDate?: string): Promise<GymVisitAnalytics> =>
    apiClient.get("/owner/qr/analytics", { params: { startDate, endDate } }).then((res) => res.data.data),

  getAdminGymsAnalytics: (startDate?: string, endDate?: string): Promise<GymVisitAnalytics[]> =>
    apiClient.get("/admin/gyms/analytics", { params: { startDate, endDate } }).then((res) => res.data.data),

  getAdminSingleGymAnalytics: (gymId: string, startDate?: string, endDate?: string): Promise<GymVisitAnalytics> =>
    apiClient.get(`/admin/gyms/${gymId}/analytics`, { params: { startDate, endDate } }).then((res) => res.data.data),

  getAdminCheckins: (params?: { gymId?: string; userId?: string; entitlementType?: string; startDate?: string; endDate?: string }): Promise<CheckIn[]> =>
    apiClient.get("/admin/checkins", { params }).then((res) => res.data.data),

  getAdminSettlements: (params?: { gymId?: string; status?: string }): Promise<PayoutLedger[]> =>
    apiClient.get("/admin/settlements", { params }).then((res) => res.data.data),

  reconcileAdminSettlements: (params?: { gymId?: string; startDate?: string; endDate?: string }): Promise<SettlementReconciliation> =>
    apiClient.get("/admin/settlements/reconcile", { params }).then((res) => res.data.data),

  updateAdminSettlementStatus: (id: string, status: string): Promise<PayoutLedger> =>
    apiClient.patch(`/admin/settlements/${id}/status`, { status }).then((res) => res.data.data)
};

