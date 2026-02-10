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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/account";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileOpen?: boolean;
  toggle: () => void;
  closeMobile?: () => void;
}

export function Sidebar({ isCollapsed, isMobileOpen, toggle, closeMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
    { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-white border-r border-zinc-200 flex flex-col transition-all duration-300 ease-in-out md:relative",
        // Mobile behavior
        isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0 md:shadow-none",
        // Width behavior (desktop only affects width, mobile is always fixed width)
        isCollapsed ? "md:w-20" : "md:w-72",
        "w-72" // Mobile width
      )}
    >
      {/* Signal Branding */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 mb-4 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 flex shrink-0 items-center justify-center">
            <div className="w-1 h-4 bg-white/40 rounded-full mx-0.5 animate-pulse" />
            <div className="w-1 h-2 bg-white rounded-full mx-0.5" />
          </div>
          <span className={cn(
            "ml-3 font-semibold tracking-tight text-zinc-900 text-lg transition-opacity duration-300",
            isCollapsed ? "md:opacity-0 md:w-0 md:overflow-hidden" : "opacity-100"
          )}>
            Signal
          </span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={closeMobile}
          className="md:hidden text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* The Analyze CTA */}
      <div className="px-4 mb-6">
        <Link href={"/dashboard/jobs?analysis=true"}>
          <Button
            className={cn(
              "w-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all duration-300 shadow-sm",
              isCollapsed && "md:p-0 md:h-10 md:w-10 md:rounded-lg md:justify-center",
              !isCollapsed && "h-10 rounded-lg px-4 justify-start"
            )}
            size={isCollapsed ? "icon" : "default"}
          >
            <Sparkles
              className={cn("w-4 h-4 text-emerald-400", (!isCollapsed || isMobileOpen) && "mr-2")}
            />
            {(!isCollapsed || isMobileOpen) && (
              <span className={cn(
                "font-medium text-sm transition-opacity duration-200",
                isCollapsed && "md:hidden" 
              )}>Analyze Job</span>
            )}
          </Button>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-100">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg transition-colors relative",
                isCollapsed ? "md:justify-center md:h-10 md:w-10 md:mx-auto" : "px-4 h-10",
                "px-4 h-10", // Mobile style
                isActive
                  ? "bg-zinc-100 text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50",
              )}
            >
              <item.icon
                size={18}
                className={cn(
                  isActive
                    ? "text-emerald-600"
                    : "text-zinc-400 group-hover:text-zinc-600",
                )}
              />
              <div className={cn(
                "ml-3 flex-1 flex items-center justify-between whitespace-nowrap overflow-hidden transition-all duration-300",
                isCollapsed ? "md:w-0 md:opacity-0" : "w-auto opacity-100"
              )}>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              
              {/* Tooltip for collapsed mode (Desktop only) */}
              {isCollapsed && (
                <div className="hidden md:group-hover:block absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded-md whitespace-nowrap z-50 animate-in fade-in slide-in-from-left-1">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-zinc-100 mt-auto">
        <Button
          onClick={async () => {
            await signOut();
          }}
          variant="ghost"
          className={cn(
            "flex items-center justify-start text-zinc-500 hover:text-zinc-900 rounded-xl transition-all bg-transparent w-full cursor-pointer hover:bg-zinc-50",
            isCollapsed ? "md:justify-center md:h-10 md:px-0" : "px-4 h-10",
          )}
        >
          <LogOut size={18} />
          <span className={cn(
            "ml-3 font-medium text-sm transition-all duration-300",
             isCollapsed ? "md:hidden" : "block"
          )}>Log Out</span>
        </Button>
      </div>

      {/* Toggle Button (Desktop Only) */}
      <button
        onClick={toggle}
        className="absolute -right-3 top-14 bg-white text-zinc-400 rounded-full p-1 border border-zinc-200 shadow-sm hover:text-zinc-900 transition-colors hidden md:flex items-center justify-center h-6 w-6 z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
