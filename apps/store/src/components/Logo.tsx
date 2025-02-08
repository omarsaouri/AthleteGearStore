export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`font-heading text-primary flex items-center gap-3 ${className}`}
    >
      <img src="/logo.png" alt="AG Logo" className="h-10 w-10 object-contain" />
      <div className="flex gap-1.5 opacity-80">
        <span className="text-2xl font-bold tracking-tight">Athlete's</span>
        <span className="text-2xl font-light tracking-wide opacity-70">
          Gear
        </span>
        <span className="text-2xl font-light tracking-wide opacity-60">
          Store
        </span>
      </div>
    </div>
  );
}
