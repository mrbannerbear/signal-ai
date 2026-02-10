export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-background animate-in fade-in duration-700">
      <div className="size-10 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
    </div>
  );
}
