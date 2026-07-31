import Link from "next/link";

/** Shared header for the non-landing routes: gold stroke, h1, lead paragraph. */
export function PageHeader({
  title,
  description,
  backHref,
  backLabel,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header>
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className="text-ink-muted hover:text-sea font-mono text-xs transition-colors"
        >
          {backLabel}
        </Link>
      ) : null}

      {/* Gold is ornament only — never text. */}
      <div
        aria-hidden
        className={`bg-gold h-[2px] w-12 ${backHref ? "mt-8" : ""}`}
      />

      <h1 className="mt-6 text-[32px] leading-tight sm:text-[42px]">{title}</h1>

      {description ? (
        <p className="text-ink-muted mt-3 max-w-2xl text-[15px] leading-relaxed">
          {description}
        </p>
      ) : null}
    </header>
  );
}
