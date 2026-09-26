import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthContext";
import { api } from "../../api";
import { AppShell } from "../../components/layout/AppShell";
import { MetricCard } from "../../components/ui/MetricCard";
import { GlassCard, SectionCard } from "../../components/ui/Cards";
import { PrimaryButton, SecondaryButton, StatusBadge } from "../../components/ui/Buttons";
import { LoadingSkeleton, EmptyState, ErrorState } from "../../components/ui/States";
import {
  Users, Calendar, FolderKanban, Activity, Dumbbell, User, Plus, Clock,
  CheckCircle2, Sparkles, X, ChevronRight, BarChart2, ShieldAlert
} from "lucide-react";
import {
  TrainerProfile, TrainerClientAssignment, WorkoutPlan, TrainingSession, ProgressRecord
} from "../../types";

export const TrainerDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  // Dynamic tab switcher from URL path
  let activeTab = "dashboard";
  if (path.includes("/trainer/clients")) activeTab = "clients";
  else if (path.includes("/trainer/sessions")) activeTab = "sessions";
  else if (path.includes("/trainer/plans")) activeTab = "plans";
  else if (path.includes("/trainer/progress")) activeTab = "progress";
  else if (path.includes("/trainer/profile")) activeTab = "profile";

  const [profile, setProfile] = useState<TrainerProfile | null>(null);
  const [clients, setClients] = useState<TrainerClientAssignment[]>([]);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Workout Plan Modal State
  const [newPlanModalOpen, setNewPlanModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [submittingPlan, setSubmittingPlan] = useState(false);

  // New Session Modal State
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [sessionMemberId, setSessionMemberId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [submittingSession, setSubmittingSession] = useState(false);

  const fetchTrainerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profData, clientsData, sessData, plansData] = await Promise.all([
        api.getTrainerProfile().catch(() => null),
        api.getTrainerClients().catch(() => []),
        api.getTrainerSessions().catch(() => []),
        api.getTrainerWorkoutPlans().catch(() => [])
      ]);
      setProfile(profData);
      setClients(clientsData);
      setSessions(sessData);
      setWorkoutPlans(plansData);
    } catch (e: any) {
      setError(e.message || "Failed to load trainer data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainerData();
  }, []);

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !planTitle) return;
    setSubmittingPlan(true);
    try {
      await api.createWorkoutPlan({
        memberId: selectedMemberId,
        title: planTitle,
        description: planDesc,
        days: [
          {
            dayNumber: 1,
            name: "Day 1 - Push Focus",
            exercises: [{ name: "Barbell Bench Press", sets: 4, reps: "8-10", restSeconds: 90 }]
          }
        ]
      });
      setNewPlanModalOpen(false);
      setPlanTitle("");
      setPlanDesc("");
      fetchTrainerData();
    } catch (err: any) {
      alert(err.message || "Failed to create workout plan");
    } finally {
      setSubmittingPlan(false);
    }
  };

  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionMemberId || !scheduledAt) return;
    setSubmittingSession(true);
    try {
      await api.scheduleTrainingSession({
        memberId: sessionMemberId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        durationMinutes: 60,
        notes: sessionNotes
      });
      setNewSessionModalOpen(false);
      setScheduledAt("");
      setSessionNotes("");
      fetchTrainerData();
    } catch (err: any) {
      alert(err.message || "Failed to schedule session");
    } finally {
      setSubmittingSession(false);
    }
  };

  return (
    <AppShell title="Trainer Coaching Portal">
      {/* 1. Header Hero Card */}
      <div className="card-3d-featured p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gymOrange/20 border border-gymOrange/40 text-gymOrange text-xs font-extrabold">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Certified Elite Trainer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gymTextPrimary">
            {profile?.name || user?.name || "Personal Trainer Portal"}
          </h1>
          <p className="text-xs text-gymTextSecondary">
            Manage assigned member clients, design custom workout splits, and schedule 1-on-1 PT coaching sessions.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <PrimaryButton icon={<Plus className="w-4 h-4" />} onClick={() => setNewPlanModalOpen(true)}>
            Build Workout Plan
          </PrimaryButton>
          <SecondaryButton icon={<Calendar className="w-4 h-4" />} onClick={() => setNewSessionModalOpen(true)}>
            Schedule PT Session
          </SecondaryButton>
        </div>
      </div>

      {/* 2. KPI Metrics */}
      {loading ? (
        <LoadingSkeleton count={4} height="h-24" />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Assigned Clients"
            value={clients.length}
            subtext="Active Member Roster"
            icon={<Users className="w-5 h-5" />}
          />
          <MetricCard
            title="Scheduled Sessions"
            value={sessions.length}
            subtext="Upcoming PT Bookings"
            icon={<Calendar className="w-5 h-5" />}
          />
          <MetricCard
            title="Workout Splits"
            value={workoutPlans.length}
            subtext="Published Routines"
            icon={<FolderKanban className="w-5 h-5" />}
          />
          <MetricCard
            title="Client Rating"
            value={`${(profile as any)?.rating || 5.0} ★`}
            subtext="Member Satisfaction"
            icon={<Sparkles className="w-5 h-5" />}
          />
        </div>
      )}

      {/* 3. DYNAMIC SUB-VIEWS FROM SIDEBAR */}

      {/* DASHBOARD OVERVIEW */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-6">
            <SectionCard title="Assigned Member Clients" icon={<Users className="w-4 h-4" />}>
              {clients.length === 0 ? (
                <EmptyState title="No clients assigned" description="Assigned members will appear here when members select your coaching." />
              ) : (
                <div className="space-y-3">
                  {clients.slice(0, 5).map((c) => (
                    <div key={c.id} className="p-3.5 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gymTextPrimary">{c.memberName || "Member"}</h4>
                        <p className="text-[11px] text-gymTextMuted">{c.memberEmail}</p>
                      </div>
                      <StatusBadge status={c.status || "ACTIVE"} />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <div className="xl:col-span-6">
            <SectionCard title="Upcoming PT Sessions" icon={<Calendar className="w-4 h-4" />}>
              {sessions.length === 0 ? (
                <EmptyState title="No sessions scheduled" description="Use the button above to schedule 1-on-1 PT sessions." />
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="p-3.5 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-gymTextPrimary">{s.memberName || "Client Session"}</h4>
                        <p className="text-[11px] text-gymOrange font-medium">{new Date(s.scheduledAt).toLocaleString()}</p>
                      </div>
                      <StatusBadge status={s.status || "SCHEDULED"} />
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* ASSIGNED CLIENTS */}
      {activeTab === "clients" && (
        <SectionCard title="Assigned Clients Roster" icon={<Users className="w-4 h-4" />}>
          {clients.length === 0 ? (
            <EmptyState title="No clients assigned" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gymBorder">
              <table className="w-full text-left text-xs">
                <thead className="bg-gymSurface border-b border-gymBorder text-gymTextMuted font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Client Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Assigned Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gymBorder/60 text-gymTextPrimary">
                  {clients.map((c) => (
                    <tr key={c.id} className="hover:bg-gymSurface/50 transition-colors">
                      <td className="p-3 font-bold">{c.memberName || "Member"}</td>
                      <td className="p-3 text-gymTextMuted">{c.memberEmail}</td>
                      <td className="p-3 text-gymTextMuted">{c.assignedAt ? new Date(c.assignedAt).toLocaleDateString() : "Active"}</td>
                      <td className="p-3"><StatusBadge status={c.status || "ACTIVE"} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      )}

      {/* PT SESSIONS */}
      {activeTab === "sessions" && (
        <SectionCard title="PT Sessions Schedule" icon={<Calendar className="w-4 h-4" />}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Scheduled Bookings ({sessions.length})</h4>
            <SecondaryButton icon={<Calendar className="w-4 h-4" />} size="sm" onClick={() => setNewSessionModalOpen(true)}>
              Schedule New Session
            </SecondaryButton>
          </div>
          {sessions.length === 0 ? (
            <EmptyState title="No sessions scheduled" />
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="p-4 rounded-xl bg-gymSurface border border-gymBorder flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gymTextPrimary">Client: {s.memberName || "Member"}</h4>
                    <p className="text-[11px] text-gymOrange font-semibold">{new Date(s.scheduledAt).toLocaleString()}</p>
                    {s.notes && <p className="text-[10px] text-gymTextMuted mt-1">Notes: {s.notes}</p>}
                  </div>
                  <StatusBadge status={s.status || "SCHEDULED"} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* WORKOUT PLANS */}
      {activeTab === "plans" && (
        <SectionCard title="Published Workout Plans" icon={<FolderKanban className="w-4 h-4" />}>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-bold text-gymTextMuted uppercase tracking-wider">Routine Splits ({workoutPlans.length})</h4>
            <PrimaryButton icon={<Plus className="w-4 h-4" />} size="sm" onClick={() => setNewPlanModalOpen(true)}>
              Create Workout Plan
            </PrimaryButton>
          </div>
          {workoutPlans.length === 0 ? (
            <EmptyState title="No workout plans created" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workoutPlans.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-gymSurface border border-gymBorder space-y-2">
                  <h4 className="text-xs font-bold text-gymTextPrimary">{p.title}</h4>
                  <p className="text-[11px] text-gymTextMuted leading-relaxed">{p.description || "Custom Routine"}</p>
                  <div className="text-[10px] text-gymOrange font-semibold">Client ID: {p.memberId}</div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      )}

      {/* CLIENT PROGRESS */}
      {activeTab === "progress" && (
        <SectionCard title="Client Progress Records" icon={<Activity className="w-4 h-4" />}>
          <div className="p-4 rounded-xl bg-gymSurface border border-gymBorder text-xs text-gymTextMuted">
            Track client strength gains, body composition changes, and workout completion rates.
          </div>
        </SectionCard>
      )}

      {/* MY PROFILE */}
      {activeTab === "profile" && (
        <SectionCard title="Trainer Profile & Credentials" icon={<User className="w-4 h-4" />}>
          <div className="p-5 rounded-2xl bg-gymSurface border border-gymBorder space-y-3 text-xs max-w-md">
            <div>
              <span className="text-gymTextMuted block">Trainer Name:</span>
              <span className="font-bold text-gymTextPrimary">{profile?.name || user?.name}</span>
            </div>
            <div>
              <span className="text-gymTextMuted block">Specialization:</span>
              <span className="font-semibold text-gymOrange">{profile?.specialization || "General Fitness"}</span>
            </div>
            <div>
              <span className="text-gymTextMuted block">Rating:</span>
              <span className="font-semibold text-gymTextPrimary">{(profile as any)?.rating || 5.0} ★</span>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Modal: New Workout Plan */}
      {newPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-md w-full relative">
            <button onClick={() => setNewPlanModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gymTextPrimary mb-4">Build Workout Plan</h3>
            <form onSubmit={handleCreatePlan} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Select Member Client</label>
                <select value={selectedMemberId} onChange={(e) => setSelectedMemberId(e.target.value)} required className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary">
                  <option value="">-- Select Client --</option>
                  {clients.map((c) => (
                    <option key={c.memberId} value={c.memberId}>{c.memberName || c.memberEmail}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Plan Title</label>
                <input type="text" required value={planTitle} onChange={(e) => setPlanTitle(e.target.value)} placeholder="e.g. 4-Day Push Pull Legs" className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Description / Notes</label>
                <textarea value={planDesc} onChange={(e) => setPlanDesc(e.target.value)} placeholder="Focus on progressive overload..." className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary h-20" />
              </div>
              <PrimaryButton fullWidth isLoading={submittingPlan} type="submit">
                Publish Routine
              </PrimaryButton>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Session */}
      {newSessionModalOpen && (
        <div className="fixed inset-0 z-50 bg-gymDark/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-level2 p-6 max-w-md w-full relative">
            <button onClick={() => setNewSessionModalOpen(false)} className="absolute top-4 right-4 text-gymTextMuted hover:text-gymTextPrimary">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-gymTextPrimary mb-4">Schedule PT Session</h3>
            <form onSubmit={handleScheduleSession} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Select Member Client</label>
                <select value={sessionMemberId} onChange={(e) => setSessionMemberId(e.target.value)} required className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary">
                  <option value="">-- Select Client --</option>
                  {clients.map((c) => (
                    <option key={c.memberId} value={c.memberId}>{c.memberName || c.memberEmail}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Date & Time</label>
                <input type="datetime-local" required value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gymTextMuted block mb-1">Session Notes</label>
                <textarea value={sessionNotes} onChange={(e) => setSessionNotes(e.target.value)} placeholder="Form assessment & leg day..." className="w-full px-3 py-2 bg-gymSurface border border-gymBorder rounded-xl text-xs text-gymTextPrimary h-20" />
              </div>
              <PrimaryButton fullWidth isLoading={submittingSession} type="submit">
                Book Session
              </PrimaryButton>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
};
