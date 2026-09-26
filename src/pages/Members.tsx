import React from 'react';
import { QrCode, Coins, MapPin, Activity } from 'lucide-react';

export const Members: React.FC = () => {
  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Built For Athletes & Enthusiasts</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">The Member Experience</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Everything you need to maintain consistency on the road: one-tap discovery, instant QR entry, itemized activity access, and streak rewards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">QR Check-In Engine</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            No front-desk paperwork or manual sign-in logs. Point your mobile camera at the GYMTwiq QR stand to unlock immediate access.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Activity-Based Access</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Only want a quick cardio run or functional turf session? Select specific zones during check-in for dynamic micro-metering instead of full-day passes.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">GYMTwiq Coins & Streaks</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Earn coins for hitting consecutive training day milestones. Spend them on fitness accessories, shaker bottles, and partner brand discounts in the Store.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">New City Mode</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Touchdown in a new city and GYMTwiq automatically adjusts your gym radar, showing nearby partner locations, peak hour footfall, and available equipment.
          </p>
        </div>
      </div>
    </div>
  );
};
