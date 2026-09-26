import React from 'react';
import { Sparkles, Shield, Lock, CheckCircle2 } from 'lucide-react';

export const Ai: React.FC = () => {
  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Intelligence Architecture</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">The Gemini AI Boundary</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          AI recommendations paired with deterministic, server-authoritative financial and access control.
        </p>
      </div>

      <div className="bg-[#161910] border border-[#272E1B] rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="inline-flex items-center space-x-2 text-xs font-bold px-3 py-1 rounded bg-[#272E1B] text-[#D4F447]">
          <Shield className="w-3.5 h-3.5" />
          <span>Fundamental Invariant</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          "AI Recommends. Backend Decides."
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          At GYMTwiq, we strictly compartmentalize artificial intelligence as an advisory copilot. While Large Language Models excel at synthesizing workout plans and matching athlete goals to available equipment, they must never touch transactional ledgers.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#12140F] border border-[#272E1B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-[#D4F447]">
            <Sparkles className="w-4 h-4" />
            <span>What Gemini AI Does</span>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4F447] shrink-0 mt-0.5" />
              <span>Suggests workout splits based on user fitness level (Hypertrophy, Strength, Cardio).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4F447] shrink-0 mt-0.5" />
              <span>Recommends activity zone pairings (e.g. 30min Functional Turf + 20min Recovery Saunas).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4F447] shrink-0 mt-0.5" />
              <span>Assists coaches with exercise variation templates and rest interval cues.</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#12140F] border border-[#272E1B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-red-400">
            <Lock className="w-4 h-4" />
            <span>What AI Never Touches (Authoritative Backend)</span>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <span>Never authorizes gym check-ins or turnstile access.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <span>Never calculates wallet debits, metering rates, or gym payouts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <span>Never modifies coin balances, maximum caps, or subscription statuses.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
              <span>Never grants administrative or trainer role permissions.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
