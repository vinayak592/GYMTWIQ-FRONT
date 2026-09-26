import React from 'react';
import { QrCode, Smartphone, CreditCard, Dumbbell } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Get Your Network Pass',
      desc: 'Subscribe to an active GYMTwiq Network Pass. Your plan provides dynamic multi-city access, starter wallet balance, and bonus loyalty coins.',
      icon: CreditCard,
    },
    {
      num: '02',
      title: 'Discover Nearby Gyms',
      desc: 'Open the GYMTwiq mobile app. Filter gyms by city, browse operating hours, examine available equipment zones, and check amenities.',
      icon: Smartphone,
    },
    {
      num: '03',
      title: 'Scan QR at Entrance',
      desc: 'Walk in and scan the facility QR code. Choose Full Gym or specific Activity Zones (Cardio, Strength, Recovery).',
      icon: QrCode,
    },
    {
      num: '04',
      title: 'Train & Earn Rewards',
      desc: 'The backend verifies your pass in milliseconds and debits your wallet fairly. Build daily workout streaks to earn redeemable GYMTwiq Coins.',
      icon: Dumbbell,
    },
  ];

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Seamless User Journey</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">
          How GYMTwiq Works
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          From downloading the app to turning the turnstile, gym portability is streamlined into four simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="bg-[#161910] border border-[#272E1B] rounded-2xl p-8 space-y-4 relative overflow-hidden"
            >
              <div className="text-4xl font-black text-[#272E1B] absolute top-4 right-6 select-none">
                {step.num}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Precedence Rule Explainer */}
      <div className="bg-[#12140F] border border-[#272E1B] rounded-2xl p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Home Gym vs. Network Precedence Rule</span>
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed">
          If you hold a direct membership with a gym, that entitlement always takes precedence: your check-in debits ₹0.00 from your wallet. When visiting partner network gyms outside your home base, your network wallet is debited according to the gym’s automated daily rate.
        </p>
      </div>
    </div>
  );
};
