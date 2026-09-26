import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { AppShell } from "../../components/layout/AppShell";
import { MetricCard } from "../../components/ui/MetricCard";
import { GlassCard, SectionCard } from "../../components/ui/Cards";
import { PrimaryButton, SecondaryButton, StatusBadge } from "../../components/ui/Buttons";
import { LoadingSkeleton, EmptyState } from "../../components/ui/States";
import { Dumbbell, Calendar, User, FolderKanban, Activity, Sparkles, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { Gym, TrainerProfile, WorkoutPlan, TrainingSession, ProgressRecord, Entitlement } from "../../types";

export const DirectMemberView: React.FC = () => {
  const { user, latestDirectEntitlement } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // Dynamic tab switcher from URL path
  let activeTab = "dashboard";
  if (path.includes("/member/gym-access")) activeTab = "gym-access";
  else if (path.includes("/member/trainer")) activeTab = "trainer";
  else if (path.includes("/member/workouts")) activeTab = "workouts";
  else if (path.includes("/member/progress")) activeTab = "progress";
  else if (path.includes("/member/profile")) activeTab = "profile";

  const [gym, setGym] = useState<Gym | null>(null);
  const [trainerData, setTrainerData] = useState<{ assignmentId: string; trainer: TrainerProfile } | null>(null);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (latestDirectEntitlement?.gymId) {
          const gymRes = await api.getGym(latestDirectEntitlement.gymId).catch(() => null);
          setGym(gymRes);
        }
        const [trData, plansData, sessData, progData] = await Promise.all([
          api.getMyTrainer().catch(() => null),
          api.getMyWorkoutPlans().catch(() => []),
          api.getMySessions().catch(() => []),
          api.getMyProgress().catch(() => [])
        ]);
        setTrainerData(trData);
        setWorkoutPlans(plansData);
        setSessions(sessData);
        setProgress(progData);
      } catch (e) {
        console.error("Failed to load direct member data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [latestDirectEntitlement]);

  const daysRemaining = latestDirectEntitlement?.endDate
    ? Math.max(0, Math.ceil((new Date(latestDirectEntitlement.endDate).getTime() - Date.now()) / 86400000))
    : 0;

  return (
    <AppShell title="Direct Member Access">
      {/* 1. Upgrade to Network Pass Banner */}
      <div className="card-3d-featured p-6 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gymOrange/20 border border-gymOrange/40 text-gymOrange text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Direct Membership Active</span>
          </div>
          <h2 className="text-xl font-extrabold text-gymTextPrimary">
            Unlock 40+ Partner Gyms with GYMTwiq Network Pass
          </h2>
          <p className="text-xs text-gymTextSecondary mt-1 max-w-lg">
            Upgrade your membership to access all gyms across Bengaluru, Hyderabad, Mumbai & Pune while keeping your direct gym access.
          </p>
        </div>
        <PrimaryButton icon={<ArrowUpRight className="w-4 h-4" />}>
          Upgrade to GYMTwiq Network Pass
        </PrimaryButton>
      </div>

      {/* 2. Direct Gym Access Metrics */}
      {loading ? (
        <LoadingSkeleton count={1} height="h-32" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Assigned Gym"
            value={gym ? gym.name : "Direct Gym Access"}
            subtext={gym?.address || "Direct Membership"}
            icon={<Dumbbell className="w-5 h-5" />}
          />
          <MetricCard
            title="Days Remaining"
            value={`${daysRemaining} Days`}
            subtext={`Valid till ${latestDirectEntitlement?.endDate ? new Date(latestDirectEntitlement.endDate).toLocaleDateString() : "—"}`}
            icon={<Calendar className="w-5 h-5" />}
          />
          <MetricCard
            title="Membership Status"
            value={latestDirectEntitlement?.status || "ACTIVE"}
            subtext="Managed by Gym Owner"
            icon={<Activity className="w-5 h-5" />}
          />
        </div>
      )}

      {/* 3. DYNAMIC SUB-VIEWS FROM SIDEBAR */}

      {/* DASHBOARD / GYM ACCESS */}
      {(activeTab === "dashboard" || activeTab === "gym-access") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionCard title="Assigned Gym Facility" icon={<Dumbbell className="w-4 h-4" />}>
            <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-2 text-xs">
              <h4 className="text-sm font-bold text-gymTextPrimary">{gym?.name || "Direct Gym"}</h4>
              <p className="text-gymTextMuted">{gym?.address || "Direct Membership Location"}, {gym?.city || "Bengaluru"}</p>
              <div className="pt-2 border-t border-gymBorder/60 flex items-center justify-between">
                <span className="text-gymTextMuted">Pass Expiry:</span>
                <span className="font-semibold text-gymOrange">{latestDirectEntitlement?.endDate ? new Date(latestDirectEntitlement.endDate).toLocaleDateString() : "Active"}</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Assigned Trainer" icon={<User className="w-4 h-4" />}>
            {trainerData ? (
              <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-gymTextPrimary">{trainerData.trainer.name}</h4>
                  <p className="text-xs text-gymOrange font-medium">{trainerData.trainer.specialization}</p>
                  <p className="text-xs text-gymTextMuted mt-1">{trainerData.trainer.bio}</p>
                </div>
                <StatusBadge status="ACTIVE" label="Assigned" />
              </div>
            ) : (
              <EmptyState title="No trainer assigned yet" description="Your gym owner will assign a trainer for customized workout splits." />
            )}
          </SectionCard>
        </div>
      )}

      {/* ASSIGNED TRAINER */}
      {activeTab === "trainer" && (
        <SectionCard title="My Assigned Personal Trainer" icon={<User className="w-4 h-4" />}>
          {trainerData ? (
            <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-3 text-xs max-w-md">
              <h4 className="text-base font-bold text-gymTextPrimary">{trainerData.trainer.name}</h4>
              <p className="text-xs text-gymOrange font-semibold">{trainerData.trainer.specialization || "Fitness Coach"}</p>
              <p className="text-gymTextMuted leading-relaxed">{trainerData.trainer.bio || "Personal trainer assigned by your facility owner."}</p>
            </div>
          ) : (
            <EmptyState title="No trainer assigned yet" description="Your gym owner will assign a trainer for 1-on-1 coaching." />
          )}
        </SectionCard>
      )}

      {/* WORKOUT PLAN */}
      {activeTab === "workouts" && (
        <SectionCard title="My Workout Split & Routines" icon={<FolderKanban className="w-4 h-4" />}>
          {workoutPlans.length === 0 ? (
            <EmptyState title="No workout plan assigned" description="Your assigned trainer will build periodized splits here." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workoutPlans.map((plan) => (
                <div key={plan.id} className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-2">
                  <h4 className="text-xs font-bold text-gymTextPrimary">{plan.title}</h4>
                  <p className="text-[11px] text-gymTextMuted">{plan.description}</p>
                  <div className="text-[11px] font-semibold text-gymOrange">{plan.days?.length || 0} Workout Days</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* PROGRESS HISTORY */}
      {activeTab === "progress" && (
        <SectionCard title="My Progress History & Workout Logs" icon={<Activity className="w-4 h-4" />}>
          <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder text-xs text-gymTextMuted">
            Track your workout completion logs, weight progression, and strength history.
          </div>
        </SectionCard>
      )}

      {/* PROFILE */}
      {activeTab === "profile" && (
        <SectionCard title="Member Account Profile" icon={<User className="w-4 h-4" />}>
          <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-3 text-xs max-w-md">
            <div><span className="text-gymTextMuted block">Name:</span><span className="font-bold text-gymTextPrimary">{user?.name}</span></div>
            <div><span className="text-gymTextMuted block">Email:</span><span className="text-gymTextPrimary">{user?.email}</span></div>
            <div><span className="text-gymTextMuted block">Membership Type:</span><span className="font-bold text-gymOrange">Direct Member Pass</span></div>
          </div>
        </SectionCard>
      )}
    </AppShell>
  );
};