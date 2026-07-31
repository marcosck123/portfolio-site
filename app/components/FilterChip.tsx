"use client";

/** Shared filter pill for the /projects and /assets grids. */
export function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors ${
        active
          ? "border-sea bg-sea text-white"
          : "border-border bg-surface text-ink-muted hover:border-sea hover:text-sea"
      }`}
    >
      {children}
    </button>
  );
}
