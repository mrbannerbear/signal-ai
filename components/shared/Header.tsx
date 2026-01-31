import { Bell, Menu } from "lucide-react";
import Link from "next/link";

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="h-16 border-b border-slate-200/60 flex items-center justify-between px-6 bg-white/70 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-slate-500 hover:text-slate-900"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        </button>

        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 group pl-4 border-l border-slate-100"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 group-hover:border-indigo-500/50 transition-all overflow-hidden">
            {/* Profile image placeholder */}
            <div className="w-full h-full bg-linear-to-br from-indigo-100 to-slate-200" />
          </div>
        </Link>
      </div>
    </header>
  );
}
