export default function AnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Score skeleton */}
      <div className="rounded-xl border border-zinc-200 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded bg-zinc-100" />
          <div className="h-10 w-16 animate-pulse rounded-full bg-zinc-100" />
        </div>
        <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
      </div>

      {/* Summary skeleton */}
      <div className="rounded-xl border border-zinc-200 bg-card p-6 shadow-xs">
        <div className="h-6 w-24 animate-pulse rounded bg-zinc-100" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>

      {/* Skills skeleton */}
      <div className="rounded-xl border border-zinc-200 bg-card p-6 shadow-xs">
        <div className="h-6 w-32 animate-pulse rounded bg-zinc-100" />
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <div className="h-4 w-20 animate-pulse rounded bg-zinc-100" />
              <div className="mt-2 flex flex-wrap gap-2">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-6 w-16 animate-pulse rounded-full bg-zinc-100"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gaps skeleton */}
      <div className="rounded-xl border border-zinc-200 bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 animate-pulse rounded bg-zinc-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-100" />
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-lg bg-zinc-50 p-4">
              <div className="h-5 w-32 animate-pulse rounded bg-zinc-100" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-zinc-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Seniority & Location skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-card p-6 shadow-xs">
            <div className="h-6 w-24 animate-pulse rounded bg-zinc-100" />
            <div className="mt-3 flex items-center gap-3">
              <div className="h-8 w-20 animate-pulse rounded-full bg-zinc-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
