"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { EASE, fadeUp, staggerParent, viewportOnce } from "./MotionWrapper";
import { CopyButton } from "./CopyButton";
import { site } from "@/data/site";

export function Contact() {
  return (
    <motion.div
      className="border-border bg-surface flex flex-col items-start gap-6 rounded-md border p-[22px] sm:flex-row sm:items-center sm:gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(0.1)}
    >
      <motion.div variants={fadeUp} transition={{ duration: 0.5, ease: EASE }}>
        <a
          href={site.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${site.name} no GitHub`}
          className="block"
        >
          <Image
            src={`https://github.com/${site.githubUser}.png`}
            alt={`Foto de perfil de ${site.name} no GitHub`}
            width={80}
            height={80}
            className="border-border hover:border-gold rounded-full border-2 transition-colors"
          />
        </a>
      </motion.div>

      <motion.div
        variants={fadeUp}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex-1"
      >
        <p className="text-ink text-[15px]">
          Aberto a trabalhos de backend, IoT e fintech — remoto ou híbrido.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <ContactLink href={site.githubUrl}>GitHub</ContactLink>

          {site.linkedinUrl ? (
            <ContactLink href={site.linkedinUrl}>LinkedIn</ContactLink>
          ) : (
            <span
              aria-disabled="true"
              title="Link do LinkedIn ainda não configurado"
              className="border-border text-ink-muted inline-flex cursor-not-allowed items-center rounded border border-dashed px-3 py-1.5 font-mono text-[11px]"
            >
              LinkedIn
            </span>
          )}

          <CopyButton
            text={site.email}
            label={site.email}
            copiedLabel="Copiado!"
            announcement="E-mail copiado para a área de transferência"
            className="bg-sea hover:bg-navy inline-flex items-center gap-1.5 rounded px-3 py-1.5 font-mono text-[11px] text-bg transition-colors"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ContactLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="border-border text-ink hover:border-sea hover:text-sea inline-flex items-center rounded border px-3 py-1.5 font-mono text-[11px] transition-colors"
    >
      {children}
    </motion.a>
  );
}
