export function Footer() {
  return (
    <footer className="mt-auto pt-16 pb-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © 2026 Signal Engine
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] text-slate-400 uppercase font-medium">
            Neural Node Active
          </span>
        </div>
      </div>

      <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        <a href="#" className="hover:text-indigo-600 transition-colors">
          Safety
        </a>
        <a href="#" className="hover:text-indigo-600 transition-colors">
          API
        </a>
        <a href="#" className="hover:text-indigo-600 transition-colors">
          Changelog
        </a>
      </div>
    </footer>
  );
}
