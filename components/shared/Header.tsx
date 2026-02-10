import { Menu } from "lucide-react";
import Link from "next/link";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 border-b border-zinc-200/60 flex items-center justify-between px-6 bg-white/70 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-zinc-500 hover:text-zinc-900 -ml-2 p-2"
        >
          <Menu size={20} />
        </button>

        {/* Mobile Branding */}
        <div className="md:hidden flex items-center gap-2">
          <div className="size-7 rounded-md bg-zinc-900 flex shrink-0 items-center justify-center">
            <div className="w-0.5 h-3 bg-white/40 rounded-full mx-px animate-pulse" />
            <div className="w-0.5 h-1.5 bg-white rounded-full mx-px" />
          </div>
          <span className="font-semibold tracking-tight text-zinc-900 text-lg">
            Signal
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 group pl-4 border-l border-zinc-100"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 group-hover:border-emerald-500/50 transition-all overflow-hidden">
            {/* Profile image placeholder */}
            <div className="w-full h-full bg-linear-to-br from-stone-200 to-emerald-100" />
          </div>
        </Link>
      </div>
    </header>
  );
}
