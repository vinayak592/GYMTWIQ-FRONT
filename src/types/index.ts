export type UserRole = "member" | "owner" | "admin" | "trainer";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  verificationStatus?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
  streakDays?: number;
  coins?: number;
  walletBalance?: number;
  selectedCity?: string;
  gymId?: string;
  gymName?: string;
  createdAt?: string;
  currentSubscription?: {
    planName: string;
    pricePaid: number;
  };
}

export interface PricingPlan {
  id: string;
  gymId: string;
  name: string;
  price: number;
  durationDays: number;
  derivedDailyRate: number;
  status: "ACTIVE" | "INACTIVE";
}

export interface GymEquipmentItem {
  name: string;
  count: number;
}

export interface Gym {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  status: "Active" | "VERIFIED" | "Pending" | "PENDING" | "Suspended";
  verificationStatus?: "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";
  latitude?: number;
  longitude?: number;
  location?: { type: string; coordinates: [number, number] };
  rating?: number;
  reviewCount?: number;
  facilities?: string[];
  amenities?: string[];
  operatingHours?: string;
  lowestDailyRate?: number;
  lowestPlanName?: string;
  tier?: string;
  coverImage?: string;
  images?: string[];
  innerViewImages?: string[];
  equipments?: GymEquipmentItem[];
  pricingPlans?: PricingPlan[];
  currentSubscription?: {
    displayName?: string;
    monthlyPriceInr?: number;
    status?: string;
  };
}

export interface Subscription {
  id: string;
  userId: string;
  planName: string;
  pricePaid?: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "SUPERSEDED";
  autoRenew?: boolean;
}

export type DashboardState = "DIRECT_ACTIVE" | "DIRECT_EXPIRED" | "DIRECT_AND_NETWORK" | "NETWORK_ONLY" | "NONE";

export interface Entitlement {
  id: string;
  userId: string;
  gymId?: string;
  gymName?: string;
  gymAddress?: string;
  gymImage?: string;
  city?: string;
  type: "NETWORK" | "DIRECT";
  planName?: string;
  status: "ACTIVE" | "EXPIRING SOON" | "EXPIRED" | "CANCELLED" | "INACTIVE";
  startDate?: string;
  endDate?: string;
  daysLeft?: number;
  isActive?: boolean;
  claimToken?: string;
}

export interface CheckIn {
  id: string;
  userId: string;
  gymId: string;
  gymName: string;
  type: "NETWORK" | "DIRECT";
  accessMode?: "FULL_GYM" | "ACTIVITY_BASED";
  activities?: Array<{
    activityId: string;
    name: string;
    category: string;
    price: number;
  }>;
  totalAmount?: number;
  pricingVersion?: number;
  meteringRate?: number;
  dailyRate?: number;
  walletDebit?: number;
  walletBalance?: number;
  payoutAmount?: number;
  payoutCreated?: boolean;
  streakDays?: number;
  coinReward?: {
    rewardAmount?: number;
    creditedAmount?: number;
    overflowAmount?: number;
    finalBalance?: number;
  } | null;
  message?: string;
  timestamp?: string;
  status?: string;
  createdAt?: string;
}

export interface WalletInfo {
  balance: number;
  currency: string;
  maxNegativeLimit: number;
  isNegative: boolean;
  availableCreditRemaining: number;
}

export interface WalletLedgerEntry {
  id: string;
  userId: string;
  type: "TOPUP" | "NETWORK_CHECKIN_DEBIT" | "ADJUSTMENT" | "REFUND";
  direction: "CREDIT" | "DEBIT";
  amount: number;
  balanceAfter: number;
  referenceId?: string;
  description?: string;
  createdAt: string;
}

export interface CoinBalanceInfo {
  coinBalance: number;
  rawBalance?: number;
  maxCoinBalance: number;
  subscriptionActive: boolean;
  coinAccess: "ACTIVE" | "LOCKED";
  nextExpiryAt?: string | null;
  expiringSoonAmount?: number;
  isAtCap?: boolean;
}

export interface CoinPackage {
  id?: string;
  amountInr: number;
  coins: number;
  multiplier?: number;
  validityDays?: number;
  popular?: boolean;
  label?: string;
}

export interface CoinLedgerEntry {
  id: string;
  userId: string;
  type: "SUBSCRIPTION_COIN_GRANT" | "STREAK_REWARD" | "COIN_PURCHASE" | "SPEND" | "EXPIRY" | "ADMIN_ADJUSTMENT" | "REFUND";
  direction: "CREDIT" | "DEBIT";
  amount: number;
  creditedAmount?: number;
  overflowAmount?: number;
  balanceAfter: number;
  expiresAt?: string;
  sourceReference?: string;
  description?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  cat: "Equipment" | "Apparel" | "Accessories";
  price: number;
  coins: number;
  icon?: string;
  vendor?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AdminConfig {
  wallet: {
    maxNegativeBalance: number;
  };
  coins: {
    enabled: boolean;
    spendingEnabled: boolean;
    maxBalance?: number; // Optional since it's removed but might still be used in UI safely
    defaultValidityDays: number;
    streakRewards: Record<string, number>;
    coinPackages?: CoinPackage[];
  };
  network: {
    platformCommissionPct: number;
  };
}

// ==========================================
// PARTNER PLANS
// ==========================================
export interface PartnerPlan {
  name: "BASE" | "NETWORK" | "PRO";
  displayName: string;
  monthlyPriceInr: number;
  tagline: string;
  capabilities: string[];
  gymId?: string;
  status?: string;
  activatedAt?: string;
}

// ==========================================
// TRAINER ECOSYSTEM
// ==========================================
export interface TrainerProfile {
  id: string;
  userId: string;
  name?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  phone?: string;
  gymIds: string[];
  bio?: string;
  specialization?: string;
  certifications?: string[];
  experience?: string;
  availability?: string;
  status: "ACTIVE" | "SUSPENDED";
  activeClientsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainerClientAssignment {
  id: string;
  trainerId: string;
  trainerUserId?: string;
  trainerName?: string;
  memberId: string;
  memberName?: string;
  memberEmail?: string;
  memberPhone?: string;
  gymId: string;
  status: "ACTIVE" | "ENDED";
  assignedAt: string;
  endedAt?: string | null;
  notes?: string;
  streakDays?: number;
  lastCheckin?: CheckIn | null;
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string | number;
  weightKg?: number | string;
  duration?: string;
  intensity?: string;
  restSeconds?: number;
  notes?: string;
}

export interface WorkoutDay {
  dayNumber: number;
  name: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  trainerId?: string;
  trainerUserId?: string;
  memberId: string;
  gymId: string;
  title: string;
  description?: string;
  goal?: string;
  daysPerWeek?: number;
  days: WorkoutDay[];
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface TrainingSession {
  id: string;
  trainerId?: string;
  trainerUserId?: string;
  memberId: string;
  memberName?: string;
  gymId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressRecord {
  id: string;
  trainerId?: string;
  trainerUserId?: string;
  memberId: string;
  gymId: string;
  weightKg?: number | null;
  bodyFatPct?: number | null;
  benchPressKg?: number | null;
  squatKg?: number | null;
  deadliftKg?: number | null;
  metrics?: any;
  notes?: string;
  recordedAt: string;
  createdAt: string;
}

// ==========================================
// GYM ACTIVITIES & PRICING
// ==========================================
export interface GymActivity {
  id: string;
  gymId: string;
  category: "CARDIO" | "STRENGTH" | "FUNCTIONAL" | "CLASSES" | "OTHER";
  name: string;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
  currentPrice: number;
  ownerCoins?: number;
  pricingId?: string | null;
  pricingVersion?: number;
  createdAt: string;
  updatedAt: string;
}

export interface GymActivityPricing {
  id: string;
  gymId: string;
  activityId: string;
  priceInr: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  status: "ACTIVE" | "SUPERSEDED";
  version: number;
  createdBy?: string;
  createdAt: string;
}

export interface ActivityQuoteItem {
  activityId: string;
  name: string;
  category: string;
  price: number;
}

export interface ActivityQuote {
  gymId: string;
  accessMode: "ACTIVITY_BASED";
  activities: ActivityQuoteItem[];
  totalAmount: number;
  pricingVersion: number;
  validAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: "CREATED" | "AUTHORIZED" | "CAPTURED" | "FAILED" | "REFUNDED";
  type: string;
  planId?: string;
  planName?: string;
  durationDays?: number;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  errorDescription?: string;
}

// ==========================================
// OWNER & ADMIN SUBSCRIPTION MANAGEMENT TYPES
// ==========================================
export interface OwnerFeatures {
  gymManagement: boolean;
  trainerManagement: boolean;
  memberManagement: boolean;
  pricingManagement: boolean;
  analytics: boolean;
  advancedAnalytics: boolean;
  apiAccess?: boolean;
  prioritySupport?: boolean;
}

export interface OwnerLimits {
  maxGyms: number;
  maxTrainers: number;
  maxDirectMembers: number;
}

export interface SubscriptionPlan {
  id: string;
  _id?: string;
  code: string;
  name: string;
  planType: "MEMBER_NETWORK" | "OWNER";
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  version: number;
  price: number;
  currency: string;
  durationDays: number;
  description?: string;
  tier?: string;
  walletFunding?: number;
  coinGrant?: number;
  coinValidityDays?: number;
  networkAccess?: {
    allGyms: boolean;
    tierAccess: string[];
  };
  features?: OwnerFeatures;
  limits?: OwnerLimits;
  renewalPolicy?: "EXTEND_END_DATE" | "SUPERSEDE" | "NONE";
  upgradePolicy?: "PRORATE" | "IMMEDIATE" | "PERIOD_END";
  downgradePolicy?: "PERIOD_END" | "IMMEDIATE";
  cancellationPolicy?: "PERIOD_END" | "IMMEDIATE";
  gracePeriodDays?: number;
  expiringThresholdDays?: number;
  displayOrder?: number;
  activeSubscribers?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlanVersionHistory {
  id: string;
  planId: string;
  code: string;
  version: number;
  planType: "MEMBER_NETWORK" | "OWNER";
  name: string;
  price: number;
  currency: string;
  durationDays: number;
  description?: string;
  status: string;
  walletFunding?: number;
  coinGrant?: number;
  features?: OwnerFeatures;
  limits?: OwnerLimits;
  archivedAt: string;
  archivedBy?: string;
  supersededByVersion?: number;
}

export interface AdminAuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  adminId: string;
  previousVersion?: number;
  newVersion?: number;
  changedFields?: string[];
  details?: any;
  createdAt: string;
}

export interface OwnerSubscriptionInfo {
  hasSubscription?: boolean;
  isActive: boolean;
  isExpiring: boolean;
  isExpired: boolean;
  status: "ACTIVE" | "EXPIRING" | "EXPIRED" | "NONE" | "CANCELLED" | "PAYMENT_FAILED";
  daysRemaining: number;
  endDate?: string;
  plan?: SubscriptionPlan | null;
  subscription?: any;
  entitlement?: any;
  features: OwnerFeatures;
  limits: OwnerLimits;
  usage: {
    maxGyms: { used: number; limit: number; remaining: number };
    maxTrainers: { used: number; limit: number; remaining: number };
    maxDirectMembers: { used: number; limit: number; remaining: number };
  };
}

export interface PaymentReconciliationRecord {
  id: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  planType?: string;
  planId?: string;
  planName?: string;
  planVersion?: number;
  fulfillmentStatus: "PENDING" | "FULFILLED" | "FAILED";
  fulfillmentError?: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  updatedAt?: string;
  signatureVerified?: boolean;
}

export type OwnerVerificationStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "SUSPENDED";

export interface OwnerVerificationRecord {
  id: string;
  userId: string;
  gymId: string;
  gymName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude: number;
  longitude: number;
  location?: { type: string; coordinates: [number, number] };
  licenseNumber: string;
  licenseType: string;
  issuingAuthority: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  licenseDocumentRef: {
    storageProvider: string;
    objectKey: string;
    originalFilename: string;
    mimeType: string;
    fileSize: number;
    sha256?: string;
    uploadedAt: string;
    status: "ACTIVE" | "SUPERSEDED";
  };
  status: OwnerVerificationStatus;
  declarationAccepted: boolean;
  declarationTimestamp: string;
  duplicateWarnings?: Array<{
    type: string;
    existingGymId?: string;
    existingGymName?: string;
    distanceMeters?: number;
    message: string;
  }>;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  rejectionReason?: string | null;
  adminNotes?: string | null;
  isLicenseExpiring?: boolean;
  isLicenseExpired?: boolean;
  history?: Array<{
    id: string;
    verificationId: string;
    actorId: string;
    actorRole: string;
    action: string;
    previousStatus?: string | null;
    newStatus: string;
    timestamp: string;
    details?: any;
  }>;
  gymDetails?: Gym;
  ownerDetails?: User;
  createdAt: string;
  updatedAt: string;
}

export interface OwnerVerificationMetrics {
  total: number;
  pending: number;
  underReview: number;
  approved: number;
  rejected: number;
  suspended: number;
  licenseExpiring: number;
}

export interface OwnerVerificationStatusResponse {
  verificationId?: string | null;
  verificationStatus: OwnerVerificationStatus;
  gymName: string;
  gymId?: string | null;
  gymVerificationStatus: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  licenseNumber?: string;
  licenseType?: string;
  issuingAuthority?: string;
  licenseIssueDate?: string;
  licenseExpiryDate?: string;
  isLicenseExpiring?: boolean;
  isLicenseExpired?: boolean;
  licenseSubmitted: boolean;
  locationSubmitted: boolean;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
}

// ==========================================
// PERMANENT GYM QR & SETTLEMENT TYPES
// ==========================================
export interface GymQRCode {
  id: string;
  gymId: string;
  gymName?: string;
  qrId: string;
  publicQrToken: string;
  status: "ACTIVE" | "REVOKED";
  version: number;
  createdById?: string;
  revokedAt?: string | null;
  revokedBy?: string | null;
  revokeReason?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface PayoutLedger {
  id: string;
  gymId: string;
  checkinId: string;
  memberId?: string;
  coinAmount: number;
  walletDebit: number;
  commissionPct: number;
  commissionAmount: number;
  payoutAmount: number;
  status: "PENDING" | "APPROVED" | "SETTLED" | "PAID" | "CANCELLED";
  settlementPeriod: string;
  settledBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface GymVisitAnalytics {
  gymId: string;
  gymName?: string;
  city?: string;
  verificationStatus?: string;
  totalVisits: number;
  uniqueMembers: number;
  totalCoinsConsumed: number;
  totalWalletDebit: number;
  totalPayoutAmount: number;
  qrId?: string;
  qrStatus?: string;
  recentCheckins?: CheckIn[];
}

export interface SettlementReconciliation {
  status: "HEALTHY" | "DISCREPANCY_DETECTED";
  totalCheckins: number;
  networkCheckins: number;
  directCheckins: number;
  totalPayoutLedgerRecords: number;
  missingLedgerCount: number;
  orphanLedgerCount: number;
  duplicateLedgerCount: number;
  totalWalletDebit: number;
  totalCommissionAmount: number;
  totalPayoutPayable: number;
  pendingSettlementAmount: number;
  settledAmount: number;
  discrepancies: string[];
  reconciledAt: string;
}



