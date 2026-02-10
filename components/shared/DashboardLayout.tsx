"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { usePathname, useSearchParams } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNewProfile = pathname.includes("/dashboard/profile") && searchParams.get("editing") === "new";
  if (isNewProfile) {
    return children;
  }

  return (
    <div className="flex h-screen bg-[#fafaf9] text-zinc-900 overflow-hidden selection:bg-emerald-100 selection:text-emerald-900">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        toggle={() => setIsCollapsed(!isCollapsed)}
        closeMobile={() => setIsMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 px-4 md:p-8 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
          <div className="max-w-6xl mx-auto flex flex-col min-h-full">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
