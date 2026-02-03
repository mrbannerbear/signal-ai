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
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-700">
      <Sidebar
        isCollapsed={isCollapsed}
        toggle={() => setIsCollapsed(!isCollapsed)}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        <Header onMenuClick={() => setIsMobileOpen(!isMobileOpen)} />

        <main className="flex-1 overflow-y-auto p-6 px-2 md:p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto flex flex-col min-h-full">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
