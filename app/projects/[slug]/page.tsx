import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/app/components/ProjectCard";
import { Demos } from "@/app/components/Demos";
import { projects, getProjectBySlug, getDemosForProject } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Projeto não encontrado" };
  return { title: project.name, description: project.tagline };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const demos = getDemosForProject(project.id);

  const meta = [
    project.year?.toString(),
    project.category,
    `${project.stack.length} tecnologias`,
  ].filter(Boolean) as string[];

  return (
    <main id="main" className="flex-1 px-6 py-14 sm:py-20">
      <article className="mx-auto w-full max-w-[820px]">
        <Link
          href="/projects"
          className="text-ink-muted hover:text-sea font-mono text-xs transition-colors"
        >
          ← Voltar para projetos
        </Link>

        <div aria-hidden className="bg-gold mt-8 h-[2px] w-12" />

        <header className="mt-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[32px] leading-tight sm:text-[42px]">
              {project.name}
            </h1>
            <StatusBadge status={project.status} />
          </div>

          <p className="text-ink-muted mt-3 text-[15px] leading-relaxed sm:text-base">
            {project.tagline}
          </p>

          <p className="text-ink-muted mt-4 font-mono text-[11px] tracking-wider uppercase">
            {meta.join(" · ")}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sea hover:bg-navy inline-flex items-center rounded px-4 py-2 font-mono text-xs text-bg transition-colors"
              >
                Ver online
              </a>
            ) : (
              <span
                aria-disabled="true"
                title="Ainda não publicado"
                className="border-border text-ink-muted inline-flex cursor-not-allowed items-center rounded border border-dashed px-4 py-2 font-mono text-xs"
              >
                Ver online
              </span>
            )}

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-border text-ink hover:border-sea hover:text-sea inline-flex items-center rounded border px-4 py-2 font-mono text-xs transition-colors"
            >
              GitHub
            </a>
          </div>
        </header>

        {project.longDescription ? (
          <section aria-labelledby="overview-heading" className="mt-14">
            <h2 id="overview-heading" className="text-[22px]">
              Visão geral
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              {project.longDescription.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-ink text-[15px] leading-[1.75]">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ) : null}

        {project.highlight ? (
          <aside
            aria-label="Desafio técnico mais interessante"
            className="border-gold bg-surface-2/60 mt-10 border-l-2 py-4 pr-4 pl-5"
          >
            <p className="text-ink-muted font-mono text-[10px] tracking-[0.2em] uppercase">
              Parte mais difícil
            </p>
            <p className="text-ink mt-2 text-[15px] leading-relaxed">
              {project.highlight}
            </p>
          </aside>
        ) : null}

        {project.results && project.results.length > 0 ? (
          <section aria-labelledby="results-heading" className="mt-12">
            <h2 id="results-heading" className="text-[22px]">
              Resultados
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {project.results.map((result) => (
                <li key={result} className="flex items-start gap-3">
                  <span className="text-sea mt-px" aria-hidden>
                    ✓
                  </span>
                  <span className="text-ink font-mono text-[13px] leading-relaxed">
                    {result}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.diagram ? (
          <section aria-labelledby="arch-heading" className="mt-12">
            <h2 id="arch-heading" className="text-[22px]">
              Arquitetura
            </h2>
            <pre className="border-border bg-surface text-ink mt-4 overflow-x-auto rounded-md border p-5 font-mono text-[12px] leading-[1.7]">
              {project.diagram}
            </pre>
          </section>
        ) : null}

        {project.images && project.images.length > 0 ? (
        <section aria-labelledby="gallery-heading" className="mt-12">
          <h2 id="gallery-heading" className="text-[22px]">
            Telas
          </h2>
          <Gallery images={project.images} name={project.name} />
        </section>
        ) : null}

        {demos.some((d) => d.src) ? (
          <section aria-labelledby="demos-heading" className="mt-12">
            <h2 id="demos-heading" className="text-[22px]">
              Demonstrações
            </h2>
            <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">
              Capturas curtas do sistema rodando.
            </p>
            <div className="mt-6">
              <Demos demos={demos} />
            </div>
          </section>
        ) : null}

        <section aria-labelledby="stack-heading" className="mt-12">
          <h2 id="stack-heading" className="text-[22px]">
            Stack
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="border-border bg-surface text-ink rounded border px-3 py-1.5 font-mono text-[11px]"
              >
                {tech}
              </li>
            ))}
          </ul>
        </section>

        <div className="border-border mt-16 border-t pt-8">
          <Link
            href="/projects"
            className="text-sea font-mono text-xs hover:underline"
          >
            ← Todos os projetos
          </Link>
        </div>
      </article>
    </main>
  );
}

function Gallery({ images, name }: { images?: string[]; name: string }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((src, i) => (
        <li
          key={src}
          className="border-border bg-surface-2 relative aspect-video overflow-hidden rounded-md border"
        >
          <Image
            src={src}
            alt={`Captura de tela ${i + 1} — ${name}`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </li>
      ))}
    </ul>
  );
}
