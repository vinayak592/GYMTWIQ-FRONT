import React from 'react';
import { Check } from 'lucide-react';

export const Gyms: React.FC = () => {
  const plans = [
    {
      tier: 'BASE',
      name: 'Starter Facility',
      price: '₹199 / mo',
      desc: 'Essential facility profile listing and direct home member management.',
      features: [
        'Gym profile in city directory',
        'Direct member manual registration',
        'Single-use member claim links',
        'Basic check-in history',
      ],
    },
    {
      tier: 'NETWORK',
      name: 'Network Partner',
      price: '₹249 / mo',
      desc: 'Unlock network footfall, dynamic check-in metering, and automated settlement payouts.',
      features: [
        'Everything in Base plan',
        'Accept visiting network members',
        'Dynamic daily rate calculation',
        'Daily settlement payout ledger',
        'Activity-based zone access & pricing',
        '30-day footfall density analytics',
      ],
      highlight: true,
    },
    {
      tier: 'PRO',
      name: 'Enterprise Facility',
      price: '₹349 / mo',
      desc: 'Complete coaching ecosystem with staff trainers, workout builders, and AI recommendations.',
      features: [
        'Everything in Network plan',
        'Staff trainer roster & invitation links',
        'Client-to-coach assignment workflows',
        'Progressive workout routine builder',
        '1-on-1 coaching session scheduling',
        'Biometric progress & 1RM tracking',
      ],
    },
  ];

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Operator Monetization</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Partner With GYMTwiq</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Monetize excess capacity, welcome traveling athletes, and empower your coaching staff with our three-tier facility collaboration plans.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((p) => (
          <div
            key={p.tier}
            className={`rounded-3xl p-8 space-y-6 flex flex-col justify-between ${
              p.highlight
                ? 'bg-[#161910] border-2 border-[#D4F447] shadow-xl shadow-[#D4F447]/10'
                : 'bg-[#12140F] border border-[#272E1B]'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2.5 py-1 rounded bg-[#272E1B] text-[#D4F447]">
                  {p.tier}
                </span>
                {p.highlight && (
                  <span className="text-[11px] font-bold text-black bg-[#D4F447] px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <div className="text-2xl font-black text-white">{p.price}</div>
              <p className="text-xs text-gray-400 leading-relaxed">{p.desc}</p>
              <ul className="space-y-2 pt-2 border-t border-[#272E1B]">
                {p.features.map((f, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-[#D4F447] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="mailto:partners@gymtwiq.com?subject=Gym Partner Application"
              className={`w-full py-2.5 rounded-xl font-bold text-center text-xs transition-colors ${
                p.highlight
                  ? 'bg-[#D4F447] hover:bg-[#c2e236] text-black'
                  : 'bg-[#202518] hover:bg-[#2c3321] text-white border border-[#272E1B]'
              }`}
            >
              Apply as Facility
            </a>
          </div>
        ))}
      </div>

      {/* Operator Guarantees */}
      <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#D4F447]">Automated</div>
          <div className="text-xs font-semibold text-white">Daily Ledger Payouts</div>
          <div className="text-[11px] text-gray-400">Settled directly via verified check-ins</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#D4F447]">Zero</div>
          <div className="text-xs font-semibold text-white">Direct Member Canibalization</div>
          <div className="text-[11px] text-gray-400">Your direct home members stay free (₹0 debit)</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-black text-[#D4F447]">100%</div>
          <div className="text-xs font-semibold text-white">Authoritative Control</div>
          <div className="text-[11px] text-gray-400">Manage activities, operating hours, and staff</div>
        </div>
      </div>
    </div>
  );
};
