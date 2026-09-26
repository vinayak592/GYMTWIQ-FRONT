import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-[#161910] border border-[#272E1B] flex items-center justify-center text-[#D4F447]">
        <Dumbbell className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white">404 — Page Not Found</h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          The fitness page or network route you are looking for does not exist or has been moved.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 bg-[#D4F447] text-black font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-[#c2e236] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};
