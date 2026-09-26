import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('gymtwiq_access_token') || !!localStorage.getItem('token'));
  }, [location.pathname]);

  const navLinks = [
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'For Members', path: '/members' },
    { name: 'For Gyms', path: '/gyms' },
    { name: 'Trainers', path: '/trainers' },
    { name: 'AI Layer', path: '/ai' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0D0F0E]/90 backdrop-blur-md border-b border-[#3A403D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#FF6A00] flex items-center justify-center text-white font-extrabold shadow-lg shadow-[#FF6A00]/30 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#F2F4F3] flex items-center gap-1.5">
                GYMT<span className="text-[#FF6A00]">wiq</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#1C201E] text-[#FF6A00] border border-[#3A403D]">
                  Network
                </span>
              </span>
              <span className="text-[10px] text-[#A7AEAA] font-medium tracking-wide">
                Unified Gym Portability
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-[#FF6A00] bg-[#1C201E] border border-[#3A403D]'
                      : 'text-[#A7AEAA] hover:text-[#F2F4F3] hover:bg-[#1C201E]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-[#1C201E] hover:bg-[#232826] border border-[#3A403D] text-[#F2F4F3] font-semibold text-xs px-4 py-2 rounded-xl transition-all"
              >
                <User size={14} className="text-[#FF6A00]" />
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs text-[#A7AEAA] hover:text-[#F2F4F3] px-3 py-2 transition-colors font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="orange-glow-button text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  <span>Join GYMTwiq</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#A7AEAA] hover:text-white hover:bg-[#1C201E] focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#151817] border-b border-[#3A403D] px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive
                    ? 'text-[#FF6A00] bg-[#0D0F0E]'
                    : 'text-[#A7AEAA] hover:text-white hover:bg-[#0D0F0E]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-[#3A403D] flex flex-col space-y-2">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold text-[#FF6A00] px-3 py-2 bg-[#1C201E] rounded-lg border border-[#3A403D] flex items-center gap-2"
              >
                <User size={16} /> Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-base text-[#A7AEAA] hover:text-white px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="orange-glow-button text-base font-bold text-white px-3 py-2 rounded-lg text-center"
                >
                  Join GYMTwiq
                </Link>
              </>
            )}
            <Link
              to="/delete-account"
              onClick={() => setIsOpen(false)}
              className="text-sm text-[#737A76] hover:text-white px-3 py-1 mt-2"
            >
              Account Deletion / Privacy Support
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
