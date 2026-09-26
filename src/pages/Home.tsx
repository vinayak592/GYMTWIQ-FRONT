import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, MapPin, Wallet, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="space-y-24 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto pt-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#161910] border border-[#272E1B] text-xs font-semibold text-[#D4F447]">
          <Sparkles className="w-3.5 h-3.5 text-[#D4F447]" />
          <span>One Network • Multiple Gyms • Multi-City Portability</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Work out anywhere. <br />
          <span className="text-[#D4F447]">One unified network pass.</span>
        </h1>

        <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          GYMTwiq replaces restrictive single-gym contracts with a decentralized fitness network. Travel between cities, scan the gym QR at the entrance, and unlock instant workout access with dynamic metering.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#D4F447] hover:bg-[#c2e236] text-black font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-[#D4F447]/20 transition-all text-sm"
          >
            <span>See How It Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/members"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#161910] hover:bg-[#202518] text-white border border-[#272E1B] font-semibold px-7 py-3.5 rounded-xl transition-all text-sm"
          >
            <span>Explore Member Pass</span>
          </Link>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3 hover:border-[#D4F447]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">New City Mode</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            When traveling, switch your active city with one tap. GYMTwiq dynamically surfaces verified partner facilities with accurate operating hours and amenity catalogs.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3 hover:border-[#D4F447]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Instant QR Check-In</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Scan the gym QR at the turnstile. The backend validates your subscription in milliseconds, derives the fair daily metering rate, and settles attendance securely.
          </p>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-3 hover:border-[#D4F447]/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#D4F447]/10 flex items-center justify-center text-[#D4F447]">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Fair Wallet & Rewards</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your network pass funds your wallet. Only pay for the days you actually train. Earn activity streak coins to unlock fitness gear and supplements.
          </p>
        </div>
      </section>

      {/* Ecosystem Architecture */}
      <section className="bg-[#161910]/60 border border-[#272E1B] rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="max-w-2xl space-y-3">
          <div className="text-xs uppercase font-bold text-[#D4F447] tracking-wider">The GYMTwiq Ecosystem</div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Built for members, facility operators, and personal coaches.
          </h2>
          <p className="text-sm text-gray-400">
            A three-sided collaborative platform aligning member flexibility with gym operator profitability and coach growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="space-y-3 border-l-2 border-[#D4F447] pl-4">
            <h4 className="text-base font-bold text-white">For Members</h4>
            <p className="text-xs text-gray-400">
              True workout flexibility. Full-gym access or itemized activity zones (Cardio, Strength, Recovery) across partner gyms with streak reward milestones.
            </p>
            <Link to="/members" className="text-xs text-[#D4F447] hover:underline font-semibold inline-flex items-center gap-1">
              <span>Member Details</span> &rarr;
            </Link>
          </div>

          <div className="space-y-3 border-l-2 border-[#D4F447] pl-4">
            <h4 className="text-base font-bold text-white">For Gym Partners</h4>
            <p className="text-xs text-gray-400">
              Monetize off-peak hours and traveling footfall. Three subscription tiers (Base, Network, Pro) with automated daily payouts and footfall analytics.
            </p>
            <Link to="/gyms" className="text-xs text-[#D4F447] hover:underline font-semibold inline-flex items-center gap-1">
              <span>Gym Partner Plans</span> &rarr;
            </Link>
          </div>

          <div className="space-y-3 border-l-2 border-[#D4F447] pl-4">
            <h4 className="text-base font-bold text-white">For Staff Trainers</h4>
            <p className="text-xs text-gray-400">
              Manage client assignments, schedule 1-on-1 coaching sessions, build progressive workout plans, and track biometric progress without spreadsheets.
            </p>
            <Link to="/trainers" className="text-xs text-[#D4F447] hover:underline font-semibold inline-flex items-center gap-1">
              <span>Trainer Workflows</span> &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* AI Advisory Boundary Callout */}
      <section className="bg-[#12140F] border border-[#272E1B] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#D4F447]">
            <ShieldCheck className="w-4 h-4" />
            <span>Architectural Integrity</span>
          </div>
          <h3 className="text-xl font-bold text-white">AI Recommends. Backend Decides.</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            GYMTwiq uses Google Gemini to recommend workout routines and equipment zones based on user goals. Financial transactions, access entitlement, and metering rates remain strictly authoritative in the backend.
          </p>
        </div>
        <Link
          to="/ai"
          className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-[#202518] hover:bg-[#2a321f] text-white border border-[#272E1B] text-xs font-semibold transition-colors"
        >
          Read AI Boundary Spec
        </Link>
      </section>
    </div>
  );
};
