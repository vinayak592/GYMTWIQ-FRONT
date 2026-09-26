import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="space-y-12 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-gray-300 text-xs leading-relaxed">
      <div className="space-y-3 text-center border-b border-[#272E1B] pb-8">
        <div className="inline-flex items-center space-x-1 text-xs font-bold text-[#D4F447]">
          <ShieldCheck className="w-4 h-4" />
          <span>Production Data Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
        <p className="text-gray-400 text-xs max-w-xl mx-auto">
          Last updated: September 2026. This policy describes how GYMTwiq collects, processes, and protects your data across our mobile application, website, and partner services.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">1. Architectural Commitment</h2>
        <p>
          GYMTwiq Technologies operates on a principle of data minimization and strict multi-tenant authorization. We process personal data strictly to deliver network gym portability, verify facility turnstile check-ins, settle partner payouts, and provide workout tracking.
        </p>
      </section>

      {/* Data Categories */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">2. Information We Actually Handle</h2>
        <p>Based on our transactional architecture, GYMTwiq handles the following categories of information:</p>

        <div className="bg-[#161910] border border-[#272E1B] rounded-2xl p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">A. Account & Profile Information</h3>
            <p className="text-gray-400 text-xs mt-1">
              Name, email address, phone number (optional), role (member, gym owner, coach), and hashed passwords stored via 12-round salted bcrypt. Passwords are never stored in plaintext and password hashes are automatically redacted from API serialization layers.
            </p>
          </div>

          <div className="border-t border-[#272E1B] pt-3">
            <h3 className="text-sm font-bold text-white">B. Facility Check-In & Portability Telemetry</h3>
            <p className="text-gray-400 text-xs mt-1">
              Timestamp of check-in, facility identifier, selected access mode (Full Gym or itemized activity zones), resulting wallet debit, and daily metering snapshot. This data is required to authorize entrance and execute daily operator settlement payouts.
            </p>
          </div>

          <div className="border-t border-[#272E1B] pt-3">
            <h3 className="text-sm font-bold text-white">C. Subscription & Financial Ledgers</h3>
            <p className="text-gray-400 text-xs mt-1">
              Active network pass status, plan tier, price paid, wallet balances, transaction audit entries, and coin lot issuances with individual expiration timestamps. All currency is recorded using Decimal128 precision for immutable bookkeeping.
            </p>
          </div>

          <div className="border-t border-[#272E1B] pt-3">
            <h3 className="text-sm font-bold text-white">D. Coaching, Workouts & Biometrics</h3>
            <p className="text-gray-400 text-xs mt-1">
              Assigned trainer relationships, structured multi-day workout routines (sets, reps, weight kg), scheduled session appointments, and voluntary biometric logs (weight kg, body fat %, 1RM performance metrics).
            </p>
          </div>

          <div className="border-t border-[#272E1B] pt-3">
            <h3 className="text-sm font-bold text-white">E. Gemini AI Advisory Context</h3>
            <p className="text-gray-400 text-xs mt-1">
              When requesting workout routine suggestions or activity zone pairings, the user’s selected fitness goal and available workout minutes are sent as context to the Gemini AI advisory endpoint. <strong>AI outputs are strictly informative; AI never accesses user financial records, payment methods, or passwords.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">3. How Your Information Is Used</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
          <li>To authenticate your identity and issue time-limited JSON Web Tokens (JWT).</li>
          <li>To validate your network pass and calculate check-in wallet debits authoritatively on the server.</li>
          <li>To disburse automated settlement payouts to verified gym operators.</li>
          <li>To maintain workout streak loyalty rewards and process merchandise redemptions.</li>
          <li>To facilitate communication between certified staff coaches and their assigned clients.</li>
        </ul>
      </section>

      {/* Security */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">4. Security & Access Isolation</h2>
        <p>
          We employ strict Insecure Direct Object Reference (IDOR) guards. Gym owners cannot access other gyms' members or payouts; trainers can only inspect clients explicitly assigned to them; and public registration endpoints reject unauthorized administrative role escalations.
        </p>
      </section>

      {/* Account Deletion */}
      <section className="space-y-3 bg-[#12140F] border border-[#272E1B] rounded-2xl p-6">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">5. Right to Erasure & Account Deletion</h2>
        <p>
          You have the right to permanently erase your personal data at any time. When an account deletion is executed:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-400 pt-1">
          <li>Your name, email address, phone number, and password credentials are immediately scrubbed and anonymized.</li>
          <li>All active subscriptions, network entitlements, and trainer coaching relationships are terminated.</li>
          <li>Personal biometric progress logs and notifications are purged.</li>
          <li><strong>Statutory Financial Records:</strong> Historical ledger transactions and check-in audit records are retained in an anonymized format for statutory tax and financial accounting requirements.</li>
        </ul>
        <p className="pt-2">
          To delete your account, visit our dedicated <Link to="/delete-account" className="text-[#D4F447] font-semibold hover:underline">Account Deletion Portal</Link> or initiate the request in the mobile app settings.
        </p>
      </section>
    </div>
  );
};
