"use client";

import { motion } from "framer-motion";
import { staggerParent, viewportOnce } from "./MotionWrapper";
import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

/** Landing teaser: featured projects only, capped at three. */
const featured = projects.filter((project) => project.featured).slice(0, 3);

export function FeaturedProjects() {
  if (featured.length === 0) return null;

  return (
    <motion.ul
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(0.1)}
    >
      {featured.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.ul>
  );
}
