import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-surface-2/45 mt-auto border-t px-6 py-10">
      <div className="mx-auto flex w-full max-w-[980px] flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-ink-muted font-mono text-[11px]">
          © {year} {site.name}. Feito com Next.js.
        </p>

        <nav aria-label="Rodapé" className="flex flex-wrap items-center gap-5">
          <Link
            href="/assets"
            className="text-ink-muted hover:text-sea font-mono text-[11px] transition-colors"
          >
            Assets
          </Link>

          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-muted hover:text-sea font-mono text-[11px] transition-colors"
          >
            GitHub
          </a>

          {site.linkedinUrl ? (
            <a
              href={site.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-muted hover:text-sea font-mono text-[11px] transition-colors"
            >
              LinkedIn
            </a>
          ) : null}

          {/* #main exists on every route, so this works site-wide. */}
          <a
            href="#main"
            className="text-ink-muted hover:text-sea font-mono text-[11px] transition-colors"
          >
            Voltar ao topo ↑
          </a>
        </nav>
      </div>
    </footer>
  );
}
