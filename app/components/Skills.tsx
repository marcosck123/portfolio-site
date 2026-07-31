"use client";

import { motion } from "framer-motion";
import { EASE, fadeUp, staggerParent, viewportOnce } from "./MotionWrapper";
import { skills, skillCategories } from "@/data/projects";

export function Skills() {
  return (
    <div className="flex flex-col gap-8">
      {skillCategories.map((category) => {
        const items = skills.filter((skill) => skill.category === category.id);
        if (items.length === 0) return null;

        return (
          <div
            key={category.id}
            className="grid gap-3 sm:grid-cols-[160px_1fr] sm:gap-8"
          >
            <h3 className="text-ink-muted font-mono text-[11px] tracking-[0.2em] uppercase sm:pt-1.5">
              {category.label}
            </h3>

            <motion.ul
              className="flex flex-wrap gap-2"
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={staggerParent(0.06)}
            >
              {items.map((skill) => (
                <motion.li
                  key={skill.name}
                  variants={fadeUp}
                  transition={{ duration: 0.4, ease: EASE }}
                  whileHover={{ y: -2 }}
                  className="border-border bg-surface text-ink hover:border-gold inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors"
                >
                  {skill.icon ? (
                    <span aria-hidden className="text-[13px] leading-none">
                      {skill.icon}
                    </span>
                  ) : null}
                  <span className="font-mono text-[11px]">{skill.name}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        );
      })}
    </div>
  );
}
