import Link from "next/link";
import { site } from "@/data/site";
import { projects as all } from "@/data/projects";

// Terminal shows the featured projects only; `npm test` lists those that
// state a test count in their first result.
const projects = all.filter((p) => p.featured);
const tested = projects.filter((p) => p.results?.[0]?.includes("teste"));

export function Hero() {
  const pad = Math.max(...projects.map((p) => p.slug.length)) + 4;

  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full px-6 pt-16 pb-20 sm:pt-24 sm:pb-24"
    >
      <div className="mx-auto grid w-full max-w-[980px] gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="text-ink-muted font-mono text-[12px]">
            <span className="text-sea">~</span> {site.role.toLowerCase()} ·{" "}
            {site.location.toLowerCase()}
          </p>

          <h1
            id="hero-heading"
            className="mt-4 text-[30px] leading-[1.2] sm:text-[38px]"
          >
            Sistemas de tempo real, IoT e fintech
            <span className="text-sea" aria-hidden>
              _
            </span>
          </h1>

          <p className="text-ink-muted mt-5 max-w-xl text-[15px] leading-relaxed">
            {site.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects"
              className="bg-sea hover:bg-navy text-bg inline-flex items-center rounded px-5 py-2 font-mono text-[13px] font-medium transition-colors"
            >
              ls projetos/
            </Link>
            <a
              href={site.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-ink hover:border-sea hover:text-sea inline-flex items-center rounded border px-5 py-2 font-mono text-[13px] transition-colors"
            >
              github/{site.githubUser}
            </a>
            <Link
              href="/contact"
              className="text-ink-muted hover:text-sea px-2 py-2 font-mono text-[13px] transition-colors"
            >
              contato →
            </Link>
          </div>
        </div>

        {/* Terminal window — every line comes from data/projects.ts. */}
        <div
          role="img"
          aria-label="Terminal listando os projetos, a categoria e a quantidade de testes"
          className="border-border bg-surface overflow-hidden rounded-md border font-mono text-[12px]"
        >
          <div className="border-border bg-surface-2 flex items-center gap-1.5 border-b px-3 py-2">
            <span className="bg-border-strong h-2.5 w-2.5 rounded-full" />
            <span className="bg-border-strong h-2.5 w-2.5 rounded-full" />
            <span className="bg-border-strong h-2.5 w-2.5 rounded-full" />
            <span className="text-ink-muted ml-2 text-[11px]">
              marcos@dev: ~/projetos
            </span>
          </div>
          <pre className="text-ink overflow-x-auto p-4 leading-[1.8]">
            <span className="text-sea">$</span> ls -l
            {"\n"}
            {projects.map((p) => (
              <span key={p.id}>
                {p.slug.padEnd(pad)}
                <span className="text-ink-muted">
                  {p.category?.toLowerCase()}
                </span>
                {"\n"}
              </span>
            ))}
            {"\n"}
            <span className="text-sea">$</span> npm test
            {"\n"}
            {tested.map((p) => (
              <span key={p.id}>
                <span className="text-sea">✓</span> {p.slug.padEnd(pad - 2)}
                <span className="text-ink-muted">{p.results?.[0]}</span>
                {"\n"}
              </span>
            ))}
            {"\n"}
            <span className="text-sea">$</span>{" "}
            <span className="bg-ink inline-block h-[14px] w-[7px] translate-y-[2px] animate-pulse" />
          </pre>
        </div>
      </div>
    </section>
  );
}
