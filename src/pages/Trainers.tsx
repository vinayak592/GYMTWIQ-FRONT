import React from 'react';
import { Users, Calendar, ClipboardList, TrendingUp } from 'lucide-react';

export const Trainers: React.FC = () => {
  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Coaching Collaboration</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">The Trainer Ecosystem</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Modern personal training management for certified coaches at GYMTwiq partner facilities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Scoped Client Roster</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Strict IDOR security ensures trainers access only members explicitly assigned to them by facility operators or member confirmation. No arbitrary user data leaks.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <ClipboardList className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Multi-Day Workout Builder</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Create structured workout routines with sets, target reps, weight kg, rest intervals, and coaching cues. Members immediately see assigned plans in their app.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Session Scheduling</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Track 1-on-1 coaching appointments with clear lifecycle states: Scheduled, Completed, Cancelled, or No-Show.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Biometric Progress Tracking</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Log client weight, body fat %, bench press 1RM, and squat progress over time to objectively validate coaching outcomes.
          </p>
        </div>
      </div>
    </div>
  );
};
