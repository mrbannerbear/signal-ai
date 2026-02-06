"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import {
  LayoutDashboard,
  UserCircle,
  Briefcase,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/account";

interface SidebarProps {
  isCollapsed: boolean;
  toggle: () => void;
}

export function Sidebar({ isCollapsed, toggle }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
    { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs", badge: "New" },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-20" : "w-72",
      )}
    >
      {/* Signal Branding */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex shrink-0 items-center justify-center">
          <div className="w-1 h-4 bg-white/40 rounded-full mx-0.5 animate-pulse" />
          <div className="w-1 h-2 bg-white rounded-full mx-0.5" />
        </div>
        {!isCollapsed && (
          <span className="ml-3 font-bold tracking-tight text-slate-900 text-lg">
            Signal
          </span>
        )}
      </div>

      {/* The Analyze CTA */}
      <div className="px-4 mb-6">
        <Link href={"/dashboard/jobs?analysis=true"}>
          <Button
            className={cn(
              "w-full bg-slate-900 text-white hover:bg-indigo-600 transition-all duration-300 shadow-sm",
              isCollapsed ? "p-0 h-12 w-12 rounded-xl" : "h-11 rounded-xl px-4",
            )}
          >
            <Sparkles className={cn("w-4 h-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && (
              <span className="font-semibold text-sm">Analyze</span>
            )}
          </Button>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl transition-colors",
                isCollapsed ? "justify-center h-12 w-12 mx-auto" : "px-4 h-11",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <item.icon
                size={20}
                className={cn(
                  isActive
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-600",
                )}
              />
              {!isCollapsed && (
                <div className="ml-3 flex-1 flex items-center justify-between">
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center text-slate-500 hover:text-slate-900 rounded-xl transition-all",
            isCollapsed ? "justify-center h-12" : "px-4 h-11 hover:bg-slate-50",
          )}
        >
          <Settings size={20} />
          {!isCollapsed && (
            <span className="ml-3 font-medium text-sm">Settings</span>
          )}
        </Link>

        <Button
          onClick={async () => {
            await signOut();
          }}
          className={cn(
            "flex items-center justify-start text-slate-500 hover:text-slate-900 rounded-xl transition-all mt-2 bg-transparent w-full cursor-pointer hover:bg-slate-50",
            isCollapsed ? "justify-center h-12" : "px-4 h-11 hover:bg-slate-50",
          )}
        >
          <LogOut />
          {!isCollapsed && (
            <span className="ml-3 font-medium text-sm">Log Out</span>
          )}
        </Button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-20 bg-white text-slate-400 rounded-full p-1.5 border border-slate-200 shadow-sm hover:text-slate-900 transition-colors hidden md:block"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
