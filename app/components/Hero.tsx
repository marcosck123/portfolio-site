"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE } from "./MotionWrapper";
import { site } from "@/data/site";

const rise = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0 },
};

// Created once at module scope — building it inside render would remount the
// anchor on every re-render.
const MotionAnchor = motion.create(Link);

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="w-full px-6 pt-20 pb-24 sm:pt-28 sm:pb-28"
    >
      <motion.div
        className="mx-auto w-full max-w-[980px]"
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* Short gold stroke — ornament only, never text. */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scaleX: 0 },
            visible: { opacity: 1, scaleX: 1 },
          }}
          transition={{ duration: 0.6, ease: EASE }}
          aria-hidden
          className="bg-gold h-[2px] w-12 origin-left"
        />

        <motion.p
          variants={rise}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-ink-muted mt-6 font-mono text-[11px] tracking-[0.25em] uppercase"
        >
          {site.role} · {site.location}
        </motion.p>

        <motion.h1
          id="hero-heading"
          variants={rise}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-5 max-w-3xl text-[34px] leading-[1.15] text-balance sm:text-[46px] md:text-[54px]"
        >
          Sou Marcos. Construo{" "}
          <span className="text-sea italic">sistemas de tempo real</span>, IoT e
          fintech.
        </motion.h1>

        <motion.p
          variants={rise}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-ink-muted mt-6 max-w-2xl text-[15px] leading-relaxed sm:text-base"
        >
          {site.tagline}
        </motion.p>

        <motion.div
          variants={rise}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <MotionLink href="/projects" primary>
            Ver projetos <span aria-hidden>→</span>
          </MotionLink>
          <MotionLink href="/contact">Entrar em contato</MotionLink>
        </motion.div>
      </motion.div>
    </section>
  );
}

function MotionLink({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <MotionAnchor
      href={href}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={
        primary
          ? "bg-sea hover:bg-navy inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-mono text-[13px] text-white transition-colors"
          : "border-border text-ink hover:border-sea hover:text-sea inline-flex items-center rounded-full border px-6 py-2.5 font-mono text-[13px] transition-colors"
      }
    >
      {children}
    </MotionAnchor>
  );
}
