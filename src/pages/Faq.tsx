import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const Faq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is GYMTwiq and how is it different from a regular gym membership?',
      a: 'A conventional membership restricts you to one gym brand or specific branch. GYMTwiq provides a portable network pass that unlocks hundreds of independent verified partner facilities across multiple cities. Your wallet is dynamically metered only on the days you train.',
    },
    {
      q: 'How does New City Mode work when I travel?',
      a: 'Whenever you travel to another city, you can change your active city with one tap in the mobile app. GYMTwiq surfaces nearby partner gyms with active operating hours, available equipment zones, and verified check-in rates.',
    },
    {
      q: 'What is the Precedence Rule for Direct Home Members?',
      a: 'If you bought your membership directly through a specific partner gym, that direct entitlement takes absolute precedence. Whenever you check in at that home facility, your wallet debit is ₹0.00. Visiting any other network facility will utilize your standard network wallet balance.',
    },
    {
      q: 'What happens if my wallet balance is low or zero?',
      a: 'GYMTwiq includes a configured safety credit floor of -₹500.00. This ensures you are never stranded outside a gym turnstile if your wallet is momentarily empty. You can top up your wallet anytime via UPI, card, or net banking.',
    },
    {
      q: 'What are GYMTwiq Coins and how do I earn them?',
      a: 'Coins are earned through workout consistency streaks (e.g. 3, 7, 14, 30 days). Each lot of coins has an independent validity period and is spent on a FIFO basis. Coins can be redeemed in the Store for merchandise and accessories, but cannot be cashed out or transferred.',
    },
    {
      q: 'How do Gym Owners receive payouts?',
      a: 'Every time a network member checks in at a partner gym, the backend derives the daily rate and calculates the operator settlement (wallet debit minus platform commission). Payouts are recorded into an append-only ledger and disbursed automatically to the gym’s registered account.',
    },
    {
      q: 'Can personal trainers use GYMTwiq to manage clients?',
      a: 'Yes. On our Pro facility tier, gym operators invite staff trainers with secure claim links. Trainers can build progressive workout plans, schedule coaching sessions, and record client biometric progress with strict member data isolation.',
    },
    {
      q: 'How do I request account deletion?',
      a: 'You can request account deletion directly from the mobile app profile screen or via our web portal at /delete-account. Personal data (name, email, phone) is permanently anonymized, while financial ledgers are retained immutably for tax audit compliance.',
    },
  ];

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="space-y-4 text-center">
        <div className="text-xs uppercase font-bold text-[#D4F447] tracking-widest">Common Questions</div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Frequently Asked Questions</h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
          Clear answers about network portability, check-in metering, partner economics, and data security.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-[#161910] border border-[#272E1B] rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#D4F447] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-xs text-gray-400 leading-relaxed border-t border-[#272E1B]/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
