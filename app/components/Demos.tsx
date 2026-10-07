"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, scaleIn, staggerParent, viewportOnce } from "./MotionWrapper";
import type { Demo } from "@/data/projects";

/** Recordings for a single project, rendered on its case study page. */
export function Demos({ demos: all }: { demos: Demo[] }) {
  // Recordings that do not exist yet are not shown: no "coming soon" tiles.
  const demos = all.filter((d) => d.src);
  if (demos.length === 0) return null;

  return (
    <motion.ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(0.1)}
    >
      {demos.map((demo) => (
        <motion.li
          key={demo.id}
          variants={scaleIn}
          transition={{ duration: 0.5, ease: EASE }}
          className="border-border bg-surface hover:border-gold overflow-hidden rounded-md border transition-colors"
        >
          <Media demo={demo} />
          <div className="p-[22px]">
            <h3 className="text-[17px]">{demo.title}</h3>
            <p className="text-ink-muted mt-1.5 text-[13px] leading-relaxed">
              {demo.caption}
            </p>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function Media({ demo }: { demo: Demo }) {
  // Never autoplay looping footage at people who asked for less motion —
  // give them a paused clip with controls instead.
  // `useReducedMotion` is null until the media query resolves on the client.
  const reduceMotion = useReducedMotion() ?? false;

  if (!demo.src) {
    return (
      <div className="border-border bg-surface-2 flex aspect-video w-full items-center justify-center border-b">
        <span className="text-ink-muted font-mono text-[10px] tracking-widest uppercase">
          Gravação em breve
        </span>
      </div>
    );
  }

  if (demo.type === "youtube") {
    return (
      <div className="border-border aspect-video w-full border-b">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${demo.src}`}
          title={demo.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    );
  }

  if (demo.type === "video") {
    return (
      <video
        src={demo.src}
        poster={demo.poster}
        autoPlay={!reduceMotion}
        loop={!reduceMotion}
        controls={reduceMotion}
        muted
        playsInline
        aria-label={demo.title}
        className="border-border aspect-video w-full border-b object-cover"
      />
    );
  }

  // GIFs are served as-is: next/image would strip the animation.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={demo.src}
      alt={demo.title}
      loading="lazy"
      className="border-border aspect-video w-full border-b object-cover"
    />
  );
}
