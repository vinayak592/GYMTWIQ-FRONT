import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { AppShell } from "../../components/layout/AppShell";
import { DirectMemberView } from "./DirectMemberView";
import { MetricCard } from "../../components/ui/MetricCard";
import { GlassCard, SectionCard, CoinCard, GymCard, ProductCard } from "../../components/ui/Cards";
import { PrimaryButton, SecondaryButton, StatusBadge } from "../../components/ui/Buttons";
import { LoadingSkeleton, EmptyState, ErrorState } from "../../components/ui/States";
import { loadRazorpayScript } from "../../utils/razorpay";
import {
  Dumbbell, QrCode, MapPin, Sparkles, Flame, ShoppingBag,
  Coins, Check, ChevronRight, Activity, Calendar, Clock,
  Search, ShieldCheck, Zap, X, UserCheck, Star, ArrowUpRight,
  RefreshCw, CheckCircle2, AlertCircle, Plus, CreditCard, Ticket, Compass,
  User, LogOut
} from "lucide-react";
import {
  Gym, CoinBalanceInfo, CoinPackage, CoinLedgerEntry, Product, CheckIn,
  GymActivity, ActivityQuote, TrainerProfile, WorkoutPlan, TrainingSession, ProgressRecord
} from "../../types";

export const MemberDashboard: React.FC = () => {
  const { user, hasNetworkEntitlement, latestDirectEntitlement, dashboardState, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Sync active subtab dynamically from URL route
  let activeSubTab = "home";
  if (path.includes("/member/discovery")) activeSubTab = "discovery";
  else if (path.includes("/member/pass")) activeSubTab = "pass";
  else if (path.includes("/member/trainers")) activeSubTab = "trainers";
  else if (path.includes("/member/activity")) activeSubTab = "activity";
  else if (path.includes("/member/coins")) activeSubTab = "coins";
  else if (path.includes("/member/store")) activeSubTab = "store";
  else if (path.includes("/member/profile")) activeSubTab = "profile";

  const setActiveSubTab = (tab: string) => {
    navigate(tab === "home" ? "/member" : `/member/${tab}`);
  };

  // If user is strictly Direct-Only member (no active network entitlement), show Direct Member View
  if (dashboardState === "DIRECT_ACTIVE" || dashboardState === "DIRECT_EXPIRED") {
    return <DirectMemberView />;
  }

  const [selectedCity, setSelectedCity] = useState(user?.selectedCity || "Bengaluru");
  const [cities, setCities] = useState<string[]>(["Bengaluru", "Hyderabad", "Mumbai", "Pune"]);
  const [gymSearchQuery, setGymSearchQuery] = useState("");
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [coins, setCoins] = useState<CoinBalanceInfo | null>(null);
  const [coinLedger, setCoinLedger] = useState<CoinLedgerEntry[]>([]);
  const [coinPackages, setCoinPackages] = useState<CoinPackage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coin Top-Up Modal State
  const [coinModalOpen, setCoinModalOpen] = useState(false);
  const [purchasingCoin, setPurchasingCoin] = useState(false);

  // QR Check-in Modal State
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const [selectedGymForCheckin, setSelectedGymForCheckin] = useState<Gym | null>(null);
  const [qrTokenInput, setQrTokenInput] = useState("");
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkinResult, setCheckinResult] = useState<CheckIn | null>(null);
  const [checkinError, setCheckinError] = useState<string | null>(null);

  // Trainer & Sessions State
  const [myTrainer, setMyTrainer] = useState<{ assignmentId: string; trainer: TrainerProfile } | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  // Initial Data Fetching from Live Backend APIs
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        gymsData,
        coinsData,
        ledgerData,
        pkgData,
        prodData,
        checkinData,
        trainerData,
        sessData,
        citiesData
      ] = await Promise.all([
        api.getGyms(selectedCity).catch(() => []),
        api.getCoinBalance().catch(() => null),
        api.getCoinLedger().catch(() => []),
        api.getCoinPackages().catch(() => []),
        api.getProducts().catch(() => []),
        api.getUserCheckins().catch(() => []),
        api.getMyTrainer().catch(() => null),
        api.getMySessions().catch(() => []),
        api.getGymCities().catch(() => ["Bengaluru", "Hyderabad", "Mumbai", "Pune"])
      ]);

      setGyms(gymsData);
      setCoins(coinsData);
      setCoinLedger(ledgerData);
      setCoinPackages(pkgData);
      setProducts(prodData);
      setCheckins(checkinData);
      setMyTrainer(trainerData);
      setSessions(sessData);
      if (citiesData && citiesData.length > 0) setCities(citiesData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCity]);

  // Handle QR Checkin execution
  const handleCheckIn = async (gym: Gym) => {
    setSelectedGymForCheckin(gym);
    setCheckinModalOpen(true);
    setCheckinResult(null);
    setCheckinError(null);
    setQrTokenInput("");
  };

  const handleRedeemProduct = async (product: Product) => {
    if (!window.confirm(`Redeem "${product.name}" for 🪙${product.coins} Coins?`)) return;
    try {
      await api.redeemProduct(product.id);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to redeem product");
    }
  };

  const confirmCheckIn = async () => {
    setCheckingIn(true);
    setCheckinError(null);
    try {
      const idempotencyKey = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      let targetToken = qrTokenInput.trim();
      if (!targetToken && selectedGymForCheckin) {
        targetToken = selectedGymForCheckin.id;
      }
      if (!targetToken) {
        setCheckinError("Please scan or enter a gym QR token.");
        setCheckingIn(false);
        return;
      }

      const res = await api.processQrCheckin(targetToken, idempotencyKey, "FULL_GYM");
      setCheckinResult(res);
      fetchData(); // Refresh coins & checkins live data
    } catch (err: any) {
      setCheckinError(err.message || "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  };


  // Handle Coin Top-Up
  const handleTopUpCoins = async (pkg: CoinPackage) => {
    setPurchasingCoin(true);
    try {
      const order = await api.createCoinOrder(pkg.amountInr, pkg.id);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !(window as any).Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      const options = {
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "GYMTwiq Coins",
        description: `Purchase ${pkg.coins.toLocaleString()} GYMTwiq Coins`,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await api.verifyCoinPurchase({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });
            setCoinModalOpen(false);
            fetchData();
          } catch (e: any) {
            alert("Payment verification failed: " + e.message);
          }
        },
        theme: { color: "#FF6A00" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message || "Coin purchase failed");
    } finally {
      setPurchasingCoin(false);
    }
  };

  const filteredGyms = gyms.filter((g) => {
    if (!gymSearchQuery.trim()) return true;
    const q = gymSearchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.city.toLowerCase().includes(q) ||
      (g.address && g.address.toLowerCase().includes(q))
    );
  });

  // Render Right Utility Panel matching visual reference image
  const rightPanel = (
    <div className="space-y-6">
      {/* 1. GYMTwiq Coins Card */}
      <CoinCard
        balance={coins ? coins.coinBalance : 0}
        onTopUp={() => setCoinModalOpen(true)}
      />

      {/* 2. Active Network Subscription Status Card */}
      <GlassCard elevated className="border-gymOrange/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-gymOrange" />
            <h3 className="text-xs font-bold text-gymTextPrimary">Network Pass</h3>
          </div>
          <StatusBadge status={hasNetworkEntitlement ? "ACTIVE" : "EXPIRED"} label={hasNetworkEntitlement ? "Active" : "No Pass"} />
        </div>
        <div className="text-sm font-bold text-gymTextPrimary">
          {hasNetworkEntitlement ? "GYMTwiq All-Access Network Pass" : "No Active Network Pass"}
        </div>
        <p className="text-xs text-gymTextMuted mt-1 mb-3">
          {hasNetworkEntitlement ? "Access 40+ Verified Gyms Unlimited" : "Subscribe to unlock network access"}
        </p>
        <div className="w-full bg-gymSurface h-2 rounded-full overflow-hidden border border-gymBorder">
          <div className="bg-gymOrange h-full w-3/4 rounded-full" />
        </div>
      </GlassCard>

      {/* 3. Quick Actions Grid */}
      <SectionCard title="Quick Actions" icon={<Zap className="w-4 h-4" />}>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => gyms.length > 0 && handleCheckIn(gyms[0])}
            className="p-3 rounded-xl bg-gymSurface hover:bg-gymCardElevated border border-gymBorder hover:border-gymOrange/40 flex flex-col items-center justify-center gap-1.5 transition-all group text-center"
          >
            <QrCode className="w-5 h-5 text-gymOrange group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gymTextPrimary">Check-In</span>
          </button>
          <button
            onClick={() => setActiveSubTab("trainers")}
            className="p-3 rounded-xl bg-gymSurface hover:bg-gymCardElevated border border-gymBorder hover:border-gymOrange/40 flex flex-col items-center justify-center gap-1.5 transition-all group text-center"
          >
            <Calendar className="w-5 h-5 text-gymOrange group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gymTextPrimary">Book Session</span>
          </button>
          <button
            onClick={() => setActiveSubTab("discovery")}
            className="p-3 rounded-xl bg-gymSurface hover:bg-gymCardElevated border border-gymBorder hover:border-gymOrange/40 flex flex-col items-center justify-center gap-1.5 transition-all group text-center"
          >
            <MapPin className="w-5 h-5 text-gymOrange group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gymTextPrimary">Browse Gyms</span>
          </button>
          <button
            onClick={() => setActiveSubTab("store")}
            className="p-3 rounded-xl bg-gymSurface hover:bg-gymCardElevated border border-gymBorder hover:border-gymOrange/40 flex flex-col items-center justify-center gap-1.5 transition-all group text-center"
          >
            <ShoppingBag className="w-5 h-5 text-gymOrange group-hover:scale-110 transition-transform" />
            <span className="text-xs font-semibold text-gymTextPrimary">Buy Products</span>
          </button>
        </div>
      </SectionCard>

      {/* 4. Small Steps Motivation Widget */}
      <GlassCard className="bg-gradient-to-br from-gymCard to-gymSurface border-gymOrange/20 relative overflow-hidden">
        <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider mb-1">Small Steps.</h4>
        <h3 className="text-base font-extrabold text-gymTextPrimary mb-2">Big Results.</h3>
        <p className="text-xs text-gymTextSecondary leading-relaxed">
          Your fitness journey never stops. Every check-in rewards your health & wallet.
        </p>
      </GlassCard>
    </div>
  );

  return (
    <AppShell rightPanel={rightPanel}>
      {/* 1. DASHBOARD OVERVIEW */}
      {activeSubTab === "home" && (
        <div className="space-y-6">
          {/* Welcome Hero Banner */}
          <div className="card-3d-featured p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gymOrange/15 border border-gymOrange/30 text-gymOrange text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Welcome Back</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gymTextPrimary tracking-tight">
                Good Morning, <span className="text-gymOrange">{user?.name?.split(" ")[0] || "Member"}</span>!
              </h1>
              <p className="text-xs sm:text-sm text-gymTextSecondary leading-relaxed">
                Every Workout Brings You Closer to a Stronger You. Explore gyms, check-in, earn coins, and redeem rewards.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <PrimaryButton
                  icon={<Compass className="w-4 h-4" />}
                  onClick={() => setActiveSubTab("discovery")}
                >
                  Find a Gym →
                </PrimaryButton>
              </div>
            </div>

            <div className="hidden md:block w-72 h-44 rounded-2xl bg-gymSurface border border-gymBorder relative overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
                alt="Workout Motivation"
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gymDark via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs italic font-medium text-gymTextPrimary">
                "Discipline today, results tomorrow."
              </div>
            </div>
          </div>

          {/* Top Metrics Row */}
          {loading ? (
            <LoadingSkeleton count={4} height="h-24" />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Check-ins"
                value={checkins.length}
                subtext="This Month"
                change="+12%"
                isPositive
                icon={<CheckCircle2 className="w-5 h-5" />}
              />
              <MetricCard
                title="Gyms Explored"
                value={gyms.length}
                subtext={`Across ${selectedCity}`}
                change="+28%"
                isPositive
                icon={<MapPin className="w-5 h-5" />}
              />
              <MetricCard
                title="Workout Sessions"
                value={sessions.length}
                subtext="Scheduled & Completed"
                change="+16%"
                isPositive
                icon={<Dumbbell className="w-5 h-5" />}
              />
              <MetricCard
                title="Streak"
                value={`${user?.streakDays || 5} days`}
                subtext="Keep it going!"
                icon={<Flame className="w-5 h-5" />}
              />
            </div>
          )}

          {/* Main Dashboard Sections Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-7">
              <SectionCard
                title="Nearby Gyms"
                icon={<MapPin className="w-4 h-4" />}
                actionText="View All →"
                onAction={() => setActiveSubTab("discovery")}
              >
                {loading ? (
                  <LoadingSkeleton count={2} height="h-44" />
                ) : gyms.length === 0 ? (
                  <EmptyState
                    title="No gyms found in this city"
                    description={`Try selecting another city or browsing all gyms across the GYMTwiq network.`}
                    actionLabel="Explore All Cities"
                    onAction={() => setSelectedCity("Bengaluru")}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gyms.slice(0, 4).map((gym) => (
                      <GymCard key={gym.id} gym={gym} onSelect={handleCheckIn} />
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="xl:col-span-5">
              <SectionCard
                title="Upcoming Sessions"
                icon={<Calendar className="w-4 h-4" />}
                actionText="View All →"
                onAction={() => setActiveSubTab("trainers")}
              >
                {sessions.length === 0 ? (
                  <EmptyState
                    title="No upcoming PT sessions"
                    description="Book a session with certified strength trainers across partner gyms."
                    actionLabel="Find a Trainer"
                    onAction={() => setActiveSubTab("trainers")}
                  />
                ) : (
                  <div className="space-y-3">
                    {sessions.slice(0, 3).map((sess) => (
                      <div key={sess.id} className="p-3.5 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gymOrange/15 border border-gymOrange/30 text-gymOrange flex items-center justify-center font-bold text-xs">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gymTextPrimary">
                              {sess.notes || "Personal Training Session"}
                            </h4>
                            <p className="text-[11px] text-gymTextMuted">
                              {new Date(sess.scheduledAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={sess.status} />
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          </div>

          {/* Recent Activity Ledger & Store Recommendations */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-6">
              <SectionCard title="Recent Activity" icon={<Activity className="w-4 h-4" />}>
                {coinLedger.length === 0 ? (
                  <p className="text-xs text-gymTextMuted text-center py-4">No recent activity logged.</p>
                ) : (
                  <div className="space-y-2.5">
                    {coinLedger.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="p-3 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-gymTextPrimary block">{entry.type.replace(/_/g, " ")}</span>
                          <span className="text-[10px] text-gymTextMuted">{new Date(entry.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className={`font-bold ${entry.direction === "CREDIT" ? "text-gymSuccess" : "text-gymError"}`}>
                          {entry.direction === "CREDIT" ? "+" : "-"}{entry.amount} Coins
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>

            <div className="xl:col-span-6">
              <SectionCard title="Recommended Products" icon={<ShoppingBag className="w-4 h-4" />} actionText="Store →" onAction={() => setActiveSubTab("store")}>
                {products.length === 0 ? (
                  <EmptyState title="No products available" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {products.slice(0, 3).map((prod) => (
                      <ProductCard key={prod.id} product={prod} onBuy={handleRedeemProduct} />
                    ))}
                  </div>
                )}
              </SectionCard>
            </div>
          </div>
        </div>
      )}

      {/* 2. GYM DISCOVERY */}
      {activeSubTab === "discovery" && (
        <SectionCard title="Partner Gym Discovery" icon={<Compass className="w-4 h-4" />}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gymTextMuted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by gym name, location, or facility..."
                value={gymSearchQuery}
                onChange={(e) => setGymSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gymSurface border border-gymBorder text-xs text-gymTextPrimary focus:outline-none focus:border-gymOrange"
              />
            </div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="py-2.5 px-3 rounded-xl bg-gymSurface border border-gymBorder text-xs text-gymTextPrimary focus:outline-none focus:border-gymOrange font-medium"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} height="h-44" />
          ) : filteredGyms.length === 0 ? (
            <EmptyState
              title="No gyms match your search"
              description="Try adjusting your search query or city selection."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} onSelect={handleCheckIn} />
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* 3. NETWORK PASS */}
      {activeSubTab === "pass" && (
        <SectionCard title="GYMTwiq Network Membership Pass" icon={<Ticket className="w-4 h-4" />}>
          <div className="card-3d-featured p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-gymOrange font-bold tracking-wider uppercase block">Membership Entitlement</span>
                <h3 className="text-xl font-extrabold text-gymTextPrimary">All-Access GYMTwiq Network Pass</h3>
              </div>
              <StatusBadge status={hasNetworkEntitlement ? "ACTIVE" : "EXPIRED"} label={hasNetworkEntitlement ? "Active Member" : "Inactive"} />
            </div>
            <p className="text-xs text-gymTextSecondary leading-relaxed max-w-xl">
              Enjoy unlimited check-ins across 40+ verified fitness centers, boutique studios, and premium gyms with one unified digital pass.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 rounded-xl bg-gymSurface/60 border border-gymBorder text-xs">
                <span className="text-gymTextMuted block">Access Mode</span>
                <span className="font-bold text-gymTextPrimary">Dynamic QR Turnstile</span>
              </div>
              <div className="p-3 rounded-xl bg-gymSurface/60 border border-gymBorder text-xs">
                <span className="text-gymTextMuted block">Partner Cities</span>
                <span className="font-bold text-gymOrange">{cities.join(", ")}</span>
              </div>
              <div className="p-3 rounded-xl bg-gymSurface/60 border border-gymBorder text-xs">
                <span className="text-gymTextMuted block">Coin Rewards</span>
                <span className="font-bold text-gymSuccess">50 Coins / Visit</span>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* 4. TRAINERS & PT */}
      {activeSubTab === "trainers" && (
        <SectionCard title="Certified Personal Trainers & PT Sessions" icon={<UserCheck className="w-4 h-4" />}>
          {myTrainer ? (
            <div className="card-3d-level2 p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gymOrange/20 border border-gymOrange text-gymOrange flex items-center justify-center font-bold text-lg">
                  {myTrainer.trainer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gymTextPrimary">{myTrainer.trainer.name}</h4>
                  <p className="text-xs text-gymOrange font-medium">{myTrainer.trainer.specialization || "Personal Coach"}</p>
                </div>
              </div>
              <StatusBadge status="ACTIVE" label="Assigned Coach" />
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder text-xs text-gymTextMuted mb-6">
              You currently do not have a dedicated personal trainer assigned. Select a coach at your partner gym to unlock personalized workout routines.
            </div>
          )}

          <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider mb-3">Scheduled PT Sessions ({sessions.length})</h4>
          {sessions.length === 0 ? (
            <EmptyState title="No upcoming PT sessions scheduled" />
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-gymTextPrimary">{s.notes || "Personal Training Session"}</h5>
                    <p className="text-gymOrange font-medium mt-0.5">{new Date(s.scheduledAt).toLocaleString()}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* 5. MY ACTIVITY */}
      {activeSubTab === "activity" && (
        <SectionCard title="Check-In Activity & Access Logs" icon={<Activity className="w-4 h-4" />}>
          {checkins.length === 0 ? (
            <EmptyState title="No check-ins recorded yet" description="Scan QR code at any partner gym to log your activity." />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gymBorder">
              <table className="w-full text-left text-xs">
                <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Gym ID / Location</th>
                    <th className="p-3">Check-In Time</th>
                    <th className="p-3">Access Mode</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                  {checkins.map((chk) => (
                    <tr key={chk.id} className="hover:bg-gymSurface/50 transition-colors">
                      <td className="p-3 font-bold">{chk.gymId}</td>
                      <td className="p-3 text-gymTextMuted">{new Date(chk.timestamp || chk.createdAt || "").toLocaleString()}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded-full bg-gymOrange/15 text-gymOrange text-[10px] font-bold">{chk.accessMode}</span></td>
                      <td className="p-3"><StatusBadge status={chk.status || "COMPLETED"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* 6. GYMTWIQ COINS */}
      {activeSubTab === "coins" && (
        <SectionCard title="GYMTwiq Coins Balance & Ledger" icon={<Coins className="w-4 h-4" />}>
          <div className="card-3d-featured p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-gymTextMuted uppercase font-bold tracking-wider block mb-1">Available Coin Balance</span>
              <div className="text-3xl font-black text-gymOrange flex items-center gap-2">
                <span>🪙 {(coins?.coinBalance || 0).toLocaleString()}</span>
                <span className="text-xs text-gymTextMuted font-normal">Coins</span>
              </div>
            </div>
            <PrimaryButton icon={<Plus className="w-4 h-4" />} onClick={() => setCoinModalOpen(true)}>
              Top Up Coins
            </PrimaryButton>
          </div>

          <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider mb-3">Transaction History</h4>
          {coinLedger.length === 0 ? (
            <EmptyState title="No transactions recorded" />
          ) : (
            <div className="space-y-2.5">
              {coinLedger.map((entry) => (
                <div key={entry.id} className="p-3.5 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-gymTextPrimary block">{entry.type.replace(/_/g, " ")}</span>
                    <span className="text-[10px] text-gymTextMuted">{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                  <span className={`font-bold text-sm ${entry.direction === "CREDIT" ? "text-gymSuccess" : "text-gymError"}`}>
                    {entry.direction === "CREDIT" ? "+" : "-"}{entry.amount} Coins
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* 7. FITNESS STORE */}
      {activeSubTab === "store" && (
        <SectionCard title="Fitness & Rewards Store" icon={<ShoppingBag className="w-4 h-4" />}>
          <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder text-xs text-gymTextMuted mb-6 flex items-center justify-between">
            <span>Redeem earned GYMTwiq Coins for supplements, fitness gear, and partner vouchers.</span>
            <span className="font-bold text-gymOrange">Balance: 🪙 {(coins?.coinBalance || 0).toLocaleString()}</span>
          </div>

          {products.length === 0 ? (
            <EmptyState title="No products available in store right now" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} onBuy={handleRedeemProduct} />
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* 8. PROFILE */}
      {activeSubTab === "profile" && (
        <SectionCard title="My Account Profile" icon={<User className="w-4 h-4" />}>
          <div className="p-6 rounded-2xl bg-gymSurface border border-gymBorder max-w-lg space-y-4 text-xs">
            <div className="flex items-center gap-4 border-b border-gymBorder/60 pb-4">
              <div className="w-14 h-14 rounded-full bg-gymOrange/20 border border-gymOrange text-gymOrange flex items-center justify-center text-xl font-bold">
                {user?.name?.charAt(0) || "M"}
              </div>
              <div>
                <h3 className="text-base font-bold text-gymTextPrimary">{user?.name}</h3>
                <p className="text-gymTextMuted">{user?.email}</p>
                <StatusBadge status="ACTIVE" label={user?.role?.toUpperCase()} />
              </div>
            </div>

            <div>
              <span className="text-gymTextMuted block mb-1">Preferred City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-gymCard border border-gymBorder text-xs text-gymTextPrimary focus:outline-none focus:border-gymOrange font-medium"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={() => logout()}
                className="py-2 px-4 rounded-xl bg-gymCard hover:bg-gymError/20 text-gymTextSecondary hover:text-gymError border border-gymBorder text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </SectionCard>
      )}

      {/* 5. QR Check-In Modal */}
      {checkinModalOpen && selectedGymForCheckin && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-featured p-6 max-w-md w-full relative">
            <button onClick={() => setCheckinModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-gymOrange/20 border border-gymOrange/40 text-gymOrange flex items-center justify-center mx-auto">
                <QrCode className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gymTextPrimary">Check In at {selectedGymForCheckin.name}</h3>
              <p className="text-xs text-gymTextMuted">Present your dynamic QR pass at turnstile scanner or confirm instant access.</p>

              {checkinError && (
                <div className="p-3 rounded-xl bg-gymError/15 border border-gymError/30 text-gymError text-xs">
                  {checkinError}
                </div>
              )}

              {checkinResult ? (
                <div className="p-4 rounded-2xl bg-gymSuccess/15 border border-gymSuccess/30 text-gymSuccess space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto" />
                  <h4 className="font-bold text-sm">Check-In Successful!</h4>
                  <p className="text-xs text-gymTextPrimary">Enjoy your workout at {selectedGymForCheckin.name}.</p>
                  <PrimaryButton fullWidth onClick={() => setCheckinModalOpen(false)}>Done</PrimaryButton>
                </div>
              ) : (
                <PrimaryButton fullWidth isLoading={checkingIn} onClick={confirmCheckIn}>
                  Confirm QR Check-In
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. Coins Top-Up Modal */}
      {coinModalOpen && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-lg w-full relative">
            <button onClick={() => setCoinModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gymTextPrimary mb-2">Top Up GYMTwiq Coins</h3>
            <p className="text-xs text-gymTextMuted mb-4">Choose a coin package. Rate: ₹1 = 3 GYMTwiq Coins (configured by backend).</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {coinPackages.map((pkg) => (
                <div key={pkg.id || pkg.amountInr} className="p-4 rounded-xl bg-gymCard border border-gymBorder hover:border-gymOrange text-center space-y-2">
                  <div className="text-xl">🪙</div>
                  <div className="text-base font-bold text-gymTextPrimary">{pkg.coins.toLocaleString()} Coins</div>
                  <div className="text-xs font-semibold text-gymOrange">₹{pkg.amountInr}</div>
                  <PrimaryButton size="sm" fullWidth isLoading={purchasingCoin} onClick={() => handleTopUpCoins(pkg)}>
                    Buy Now
                  </PrimaryButton>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};
