import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './app/providers/AuthContext';
import { ProtectedRoute } from './app/router/ProtectedRoute';

// Public Cloned Auth & Direct Member Claim Pages
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ClaimAccount } from './pages/auth/ClaimAccount';

// Role Application Portals
import { MemberDashboard } from './pages/member/MemberDashboard';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { AdminConsole } from './pages/admin/AdminConsole';
import { Dashboard } from './pages/Dashboard';

// Marketing Website Layout & Pages
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { Members } from './pages/Members';
import { Gyms } from './pages/Gyms';
import { Trainers } from './pages/Trainers';
import { Ai } from './pages/Ai';
import { Contact } from './pages/Contact';
import { Faq } from './pages/Faq';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { DeleteAccount } from './pages/DeleteAccount';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const MarketingLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[#0D0F0A] text-white selection:bg-[#FF6A00] selection:text-white">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Cloned Auth & Claim Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/claim/:token" element={<ClaimAccount />} />

            {/* Role Redirection Hub */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Member Experience (Network & Direct Members) */}
            <Route
              path="/member/*"
              element={
                <ProtectedRoute allowedRoles={["member", "owner", "admin"]}>
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />

            {/* Owner Dashboard */}
            <Route
              path="/owner/*"
              element={
                <ProtectedRoute allowedRoles={["owner", "admin"]}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Trainer Portal */}
            <Route
              path="/trainer/*"
              element={
                <ProtectedRoute allowedRoles={["trainer", "owner", "admin"]}>
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Console */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminConsole />
                </ProtectedRoute>
              }
            />

            {/* Marketing & Public Informational Pages */}
            <Route path="/" element={<MarketingLayout><Home /></MarketingLayout>} />
            <Route path="/about" element={<MarketingLayout><About /></MarketingLayout>} />
            <Route path="/how-it-works" element={<MarketingLayout><HowItWorks /></MarketingLayout>} />
            <Route path="/members" element={<MarketingLayout><Members /></MarketingLayout>} />
            <Route path="/gyms" element={<MarketingLayout><Gyms /></MarketingLayout>} />
            <Route path="/trainers" element={<MarketingLayout><Trainers /></MarketingLayout>} />
            <Route path="/ai" element={<MarketingLayout><Ai /></MarketingLayout>} />
            <Route path="/contact" element={<MarketingLayout><Contact /></MarketingLayout>} />
            <Route path="/faq" element={<MarketingLayout><Faq /></MarketingLayout>} />
            <Route path="/privacy-policy" element={<MarketingLayout><PrivacyPolicy /></MarketingLayout>} />
            <Route path="/terms-of-service" element={<MarketingLayout><TermsOfService /></MarketingLayout>} />
            <Route path="/delete-account" element={<MarketingLayout><DeleteAccount /></MarketingLayout>} />

            {/* 404 Fallback */}
            <Route path="*" element={<MarketingLayout><NotFound /></MarketingLayout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
