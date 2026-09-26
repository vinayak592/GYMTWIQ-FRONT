import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, ShieldCheck, CheckCircle2, Trash2, ArrowRight, HelpCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const DeleteAccount: React.FC = () => {
  const [step, setStep] = useState<'request' | 'confirm' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultMsg, setResultMsg] = useState('');

  // Step 1: Request Deletion Token
  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}/users/delete-request`, { email, password });
      if (res.data.success && res.data.data?.token) {
        setToken(res.data.data.token);
        setStep('confirm');
      } else {
        setError(res.data.error?.message || 'Failed to authenticate deletion request.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Confirm Deletion
  const handleConfirmDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post(`${API_BASE}/users/delete-confirm`, { token });
      if (res.data.success) {
        setResultMsg(res.data.message || 'Account successfully deleted.');
        setStep('success');
      } else {
        setError(res.data.error?.message || 'Failed to confirm account deletion.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Deletion token expired or invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-gray-300">
      {/* Header */}
      <div className="space-y-3 text-center border-b border-[#272E1B] pb-8">
        <div className="inline-flex items-center space-x-2 text-xs font-bold text-red-400 bg-red-950/40 border border-red-800/50 px-3 py-1 rounded-full">
          <Trash2 className="w-3.5 h-3.5" />
          <span>Account Erasure & Right to be Forgotten</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Delete Your GYMTwiq Account</h1>
        <p className="text-gray-400 text-xs max-w-xl mx-auto leading-relaxed">
          We respect your privacy and right to erase personal data. Please review the implications below before proceeding with account deletion.
        </p>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-5 space-y-2">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#D4F447]" />
            <span>What Will Be Erased Immediately</span>
          </h3>
          <ul className="list-disc pl-4 space-y-1 text-gray-400">
            <li>Full Name, Email Address, and Phone Number</li>
            <li>Hashed Passwords and Session Tokens</li>
            <li>Active Subscriptions and Turnstile QR Access</li>
            <li>Trainer Coaching Relationships & Workouts</li>
            <li>Biometric Progress Logs and Notification History</li>
          </ul>
        </div>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-5 space-y-2">
          <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>What Must Be Retained (Statutory)</span>
          </h3>
          <ul className="list-disc pl-4 space-y-1 text-gray-400">
            <li>Historical check-in and transaction logs</li>
            <li>Financial ledgers for tax and audit compliance</li>
            <li><strong>Note:</strong> All retained records are completely anonymized; personal identifiers are unlinked.</li>
            <li>Unspent wallet or coin balances are forfeit.</li>
          </ul>
        </div>
      </div>

      {/* Interactive Deletion Flow */}
      <div className="bg-[#161910] border border-[#272E1B] rounded-3xl p-8 space-y-6">
        {error && (
          <div className="bg-red-950/40 border border-red-800/50 rounded-xl p-4 text-xs text-red-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleRequestToken} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Step 1: Authenticate Account Deletion</h3>
              <p className="text-xs text-gray-400">
                Enter your account email and password to generate a secure single-use verification token.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Account Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. member@example.com"
                  className="w-full bg-[#0D0F0A] border border-[#272E1B] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your current account password"
                  className="w-full bg-[#0D0F0A] border border-[#272E1B] rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-red-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-red-600/20 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Generate Deletion Token'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {step === 'confirm' && (
          <form onSubmit={handleConfirmDeletion} className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white text-red-400">
                Step 2: Permanent Deletion Confirmation
              </h3>
              <p className="text-xs text-gray-300">
                A verification token has been generated. This action is <strong>irreversible</strong>. Once confirmed, all your personal information will be permanently scrubbed.
              </p>
            </div>

            <div className="bg-[#0D0F0A] border border-red-900/40 rounded-xl p-4 text-[11px] text-gray-400 font-mono break-all">
              Verification Token: {token}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50"
              >
                {loading ? 'Erasing Data...' : 'Confirm & Permanently Delete Account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setError(null);
                }}
                className="text-xs text-gray-400 hover:text-white px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-green-950/40 border border-green-800 text-green-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Personal Data Erased</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              {resultMsg || 'Your account credentials and personal profile have been completely deleted. Any historical check-in ledgers have been preserved anonymously for legal accounting records.'}
            </p>
            <div className="pt-2">
              <a
                href="/"
                className="inline-block text-xs font-bold text-[#D4F447] hover:underline"
              >
                Return to Homepage
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Support & Processing Timeline */}
      <div className="bg-[#12140F] border border-[#272E1B] rounded-2xl p-6 space-y-3 text-xs">
        <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#D4F447]" />
          <span>Processing Timeline & Manual Support</span>
        </h4>
        <p className="text-gray-400">
          Automated web and in-app account deletions are processed immediately in real-time. If you do not remember your password or require assistance from a human privacy officer, please email our Data Protection Desk directly at{' '}
          <a href="mailto:privacy@gymtwiq.com" className="text-[#D4F447] hover:underline font-semibold">
            privacy@gymtwiq.com
          </a>
          . Manual requests are fulfilled within 48 hours following identity verification.
        </p>
      </div>
    </div>
  );
};
