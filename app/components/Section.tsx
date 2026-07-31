import { MotionWrapper } from "./MotionWrapper";

/**
 * Consistent section shell: anchor id, reading-width container, eyebrow +
 * heading. Server component — only the heading block animates.
 */
export function Section({
  id,
  index,
  eyebrow,
  title,
  description,
  action,
  alt = false,
  children,
}: {
  id: string;
  /** Mono-styled ordinal shown before the eyebrow, e.g. "01". */
  index: string;
  /** Short kicker above the heading, e.g. "Selected work". */
  eyebrow: string;
  title: string;
  description?: string;
  /** Optional right-aligned link, e.g. "View all assets →". */
  action?: React.ReactNode;
  /** Alternating background band. */
  alt?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`border-border border-t px-6 py-20 sm:py-24 ${
        alt ? "bg-surface-2/45" : ""
      }`}
    >
      <div className="mx-auto w-full max-w-[980px]">
        <MotionWrapper>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase">
                {index} — {eyebrow}
              </p>
              <h2
                id={`${id}-heading`}
                className="mt-2 text-[28px] sm:text-[34px]"
              >
                {title}
              </h2>
            </div>
            {action}
          </div>
          {description ? (
            <p className="text-ink-muted mt-3 max-w-2xl text-[15px] leading-relaxed">
              {description}
            </p>
          ) : null}
        </MotionWrapper>

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
