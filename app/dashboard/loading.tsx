export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-700">
      <div className="size-10 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}