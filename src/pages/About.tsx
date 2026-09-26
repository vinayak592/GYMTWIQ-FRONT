import React from 'react';
import { Shield, Target, Cpu } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title */}
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Our Mission</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          Rethinking Fitness Access for a Mobile World
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Traditional gym memberships lock you into a single zip code. GYMTwiq was built to deliver uncompromised portability without sacrificing gym operator economics.
        </p>
      </div>

      {/* Narrative */}
      <div className="bg-[#161910] border border-[#272E1B] rounded-3xl p-8 sm:p-10 space-y-6 text-sm text-gray-300 leading-relaxed">
        <h2 className="text-xl font-bold text-white">The Core Philosophy</h2>
        <p>
          Fitness should not stop because of a business trip, weekend travel, or changing routines. Before GYMTwiq, athletes and everyday fitness enthusiasts had two bad options when away from home: pay exorbitant single-day guest fees or skip their workout altogether.
        </p>
        <p>
          Meanwhile, independent gym owners frequently operate at sub-optimal capacity during mid-day and off-peak hours, with no efficient mechanism to capture visiting members.
        </p>
        <p>
          GYMTwiq bridges this gap by creating an interconnected network where members hold a single subscription with portability, and gym partners receive transparent, automated payouts for every check-in.
        </p>
      </div>

      {/* Architectural Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <Target className="w-6 h-6 text-[#D4F447]" />
          <h3 className="font-bold text-white text-base">Portability First</h3>
          <p className="text-xs text-gray-400">
            One network pass works across all verified partner locations with New City Mode and instant QR access.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <Shield className="w-6 h-6 text-[#D4F447]" />
          <h3 className="font-bold text-white text-base">Mathematical Fairness</h3>
          <p className="text-xs text-gray-400">
            Precision daily rate derivation and Decimal128 ledgers prevent rounding drift and ensure transparent operator payouts.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <Cpu className="w-6 h-6 text-[#D4F447]" />
          <h3 className="font-bold text-white text-base">Grounded Technology</h3>
          <p className="text-xs text-gray-400">
            A hardened Flask and MongoDB transactional engine paired with an advisory Gemini AI recommendation boundary.
          </p>
        </div>
      </div>
    </div>
  );
};
