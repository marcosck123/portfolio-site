"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerParent, viewportOnce } from "./MotionWrapper";
import { ProjectCard } from "./ProjectCard";
import { FilterChip } from "./FilterChip";
import type { Project } from "@/data/projects";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string>("all");

  // Featured first, original order preserved within each group.
  const ordered = [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  );

  const categories = [
    ...new Set(
      ordered
        .map((project) => project.category)
        .filter((c): c is string => Boolean(c)),
    ),
  ];

  const visible =
    active === "all"
      ? ordered
      : ordered.filter((project) => project.category === active);

  return (
    <div>
      {categories.length > 1 ? (
        <div
          role="group"
          aria-label="Filtrar por categoria"
          className="mb-8 flex flex-wrap gap-2"
        >
          <FilterChip active={active === "all"} onClick={() => setActive("all")}>
            Todos ({ordered.length})
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category}
              active={active === category}
              onClick={() => setActive(category)}
            >
              {category} (
              {ordered.filter((p) => p.category === category).length})
            </FilterChip>
          ))}
        </div>
      ) : null}

      <motion.ul
        // Re-keying on the filter replays the stagger for the new set.
        key={active}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerParent(0.1)}
      >
        {visible.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.ul>

      {visible.length === 0 ? (
        <p className="text-ink-muted font-mono text-sm">
          Nada nesta categoria ainda.
        </p>
      ) : null}
    </div>
  );
}
