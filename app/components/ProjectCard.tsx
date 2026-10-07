"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE, fadeUp } from "./MotionWrapper";
import type { Project, ProjectStatus } from "@/data/projects";

export const STATUS: Record<ProjectStatus, { label: string; className: string }> =
  {
    live: {
      label: "No ar",
      className: "text-status-live border-status-live/35 bg-status-live/8",
    },
    "in-progress": {
      label: "Em progresso",
      className:
        "text-status-progress border-status-progress/35 bg-status-progress/8",
    },
    "coming-soon": {
      label: "Em breve",
      className: "text-status-soon border-status-soon/35 bg-status-soon/8",
    },
  };

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = STATUS[status];
  return (
    <span
      className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${className}`}
    >
      {label}
    </span>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.li
      variants={fadeUp}
      transition={{ duration: 0.6, ease: EASE }}
      className="border-border bg-surface hover:border-gold relative flex flex-col overflow-hidden rounded-md border transition-colors"
    >
      <Thumbnail project={project} />

      <div className="flex flex-1 flex-col p-[22px]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[19px] leading-snug">
            {/*
              Stretched link: the ::after overlay makes the whole card clickable
              without nesting the Live/GitHub anchors inside another <a>.
              The action buttons below sit at z-10 to stay clickable.
            */}
            <Link
              href={`/projects/${project.slug}`}
              className="hover:text-sea transition-colors after:absolute after:inset-0 after:content-['']"
            >
              {project.name}
            </Link>
          </h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="text-ink-muted mt-1.5 text-[13px] leading-relaxed">
          {project.tagline}
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="border-border bg-bg text-ink-muted rounded border px-1.5 py-0.5 font-mono text-[10px]"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-5">
          {project.liveUrl ? (
            <CardLink href={project.liveUrl} variant="primary">
              Ver online
            </CardLink>
          ) : (
            <span
              aria-disabled="true"
              title="Ainda não publicado"
              className="border-border text-ink-muted inline-flex cursor-not-allowed items-center rounded border border-dashed px-3 py-1.5 font-mono text-[11px]"
            >
              Ver online
            </span>
          )}

          <CardLink href={project.githubUrl}>GitHub</CardLink>

          <Link
            href={`/projects/${project.slug}`}
            className="text-sea ml-auto font-mono text-[11px] hover:underline"
          >
            Estudo de caso →
          </Link>
        </div>
      </div>
    </motion.li>
  );
}

function CardLink({
  href,
  children,
  variant = "ghost",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const styles =
    variant === "primary"
      ? "bg-sea text-bg hover:bg-navy"
      : "border-border text-ink hover:border-sea hover:text-sea border";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded px-3 py-1.5 font-mono text-[11px] transition-colors ${styles}`}
    >
      {children}
    </a>
  );
}

function Thumbnail({ project }: { project: Project }) {
  if (project.thumbnail) {
    return (
      <div className="border-border bg-surface-2 relative h-[104px] w-full border-b">
        <Image
          src={project.thumbnail}
          alt={`Captura de tela — ${project.name}`}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    );
  }

  if (!project.diagram) return null;

  return (
    <pre
      aria-label={`Diagrama de arquitetura — ${project.name}`}
      className="border-border bg-bg text-ink-muted overflow-x-auto border-b px-[22px] py-4 font-mono text-[11px] leading-[1.6]"
    >
      {project.diagram}
    </pre>
  );
}