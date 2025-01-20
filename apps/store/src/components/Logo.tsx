export function Logo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`font-heading text-copy-lighter flex items-center gap-1 ${className}`}
    >
      <span className="text-2xl font-bold tracking-tight">Athlete's</span>
      <span className="text-2xl font-light tracking-wide">Gear</span>
      <span className="text-2xl font-light tracking-wide">Store</span>
    </div>
  );
}
