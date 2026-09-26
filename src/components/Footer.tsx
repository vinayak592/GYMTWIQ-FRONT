import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0C08] border-t border-[#272E1B] text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & Statement */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4F447] flex items-center justify-center text-black font-black">
              <Dumbbell className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">GYMTwiq</span>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed">
            The unified gym portability platform. One subscription unlocks verified fitness facilities across multiple cities with instant QR check-in and dynamic daily metering.
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-gray-500">
            <Shield className="w-3.5 h-3.5 text-[#D4F447]" />
            <span>Cryptographically Verified & IDOR Protected</span>
          </div>
        </div>

        {/* Product Navigation */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Product & Portability</h3>
          <ul className="space-y-1.5 text-xs">
            <li><Link to="/how-it-works" className="hover:text-white transition-colors">How GYMTwiq Works</Link></li>
            <li><Link to="/members" className="hover:text-white transition-colors">Member Experience</Link></li>
            <li><Link to="/gyms" className="hover:text-white transition-colors">Gym Partner Plans</Link></li>
            <li><Link to="/trainers" className="hover:text-white transition-colors">Trainer Ecosystem</Link></li>
            <li><Link to="/ai" className="hover:text-white transition-colors">Gemini AI Intelligence</Link></li>
          </ul>
        </div>

        {/* Company & Support */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Company & Help</h3>
          <ul className="space-y-1.5 text-xs">
            <li><Link to="/about" className="hover:text-white transition-colors">About GYMTwiq</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Partner Team</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
            <li><a href="mailto:support@gymtwiq.com" className="hover:text-white transition-colors">support@gymtwiq.com</a></li>
          </ul>
        </div>

        {/* Legal & Governance */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Privacy & Governance</h3>
          <ul className="space-y-1.5 text-xs">
            <li><Link to="/privacy-policy" className="hover:text-[#D4F447] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className="hover:text-[#D4F447] transition-colors">Terms of Service</Link></li>
            <li><Link to="/delete-account" className="text-[#D4F447] hover:underline font-medium">Delete / Manage Account</Link></li>
          </ul>
          <p className="text-[11px] text-gray-500 pt-2">
            Ledger transactions and check-in records are preserved strictly for tax and audit compliance following personal data anonymization.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#272E1B] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} GYMTwiq Technologies. All rights reserved.</p>
        <p className="mt-2 sm:mt-0 flex items-center space-x-1">
          <span>Decentralized facility network</span>
          <span>•</span>
          <span>Transparent daily metering</span>
        </p>
      </div>
    </footer>
  );
};
