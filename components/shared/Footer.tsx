export function Footer() {
  return (
    <footer className="mt-auto pt-16 pb-8 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-xs font-medium text-zinc-500">
          © 2026 Signal AI Inc.
        </span>
        <div className="flex items-center gap-1.5">
          <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-zinc-500 font-medium">
            System Operational
          </span>
        </div>
      </div>

      <nav className="flex gap-6 text-xs text-zinc-500 font-medium">
        <a href="#" className="hover:text-zinc-900 transition-colors">
          Privacy
        </a>
        <a href="#" className="hover:text-zinc-900 transition-colors">
          Terms
        </a>
        <a href="#" className="hover:text-zinc-900 transition-colors">
          Help
        </a>
      </nav>
    </footer>
  );
}
