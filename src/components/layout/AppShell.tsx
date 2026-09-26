import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AppShellProps {
  children: React.ReactNode;
  rightPanel?: React.ReactNode;
  title?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ children, rightPanel, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gymDark flex text-gymTextPrimary relative">
      {/* Mobile Drawer Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gymDark/80 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Role-Aware Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} title={title} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1880px] w-full mx-auto">
          {rightPanel ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                {children}
              </div>
              <div className="lg:col-span-4 xl:col-span-3 space-y-6 sticky top-20">
                {rightPanel}
              </div>
            </div>
          ) : (
            <div className="space-y-6">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
};
