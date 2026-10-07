"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASE, fadeUp } from "./MotionWrapper";
import { languageLabel, formatDate } from "@/lib/format";
import type { CodeAsset } from "@/data/assets";

export function AssetCard({ asset }: { asset: CodeAsset }) {
  return (
    <motion.li
      variants={fadeUp}
      transition={{ duration: 0.6, ease: EASE }}
      className="border-border bg-surface hover:border-gold relative flex flex-col rounded-md border p-[22px] transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[19px] leading-snug">
          {/* Stretched link — whole card is clickable, no nested anchors. */}
          <Link
            href={`/assets/${asset.slug}`}
            className="hover:text-sea transition-colors after:absolute after:inset-0 after:content-['']"
          >
            {asset.title}
          </Link>
        </h3>
        <span className="border-border bg-bg text-ink-muted shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px]">
          {languageLabel(asset.language)}
        </span>
      </div>

      <p className="text-ink-muted mt-2 text-[13px] leading-relaxed">
        {asset.description}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {asset.tags.map((tag) => (
          <li
            key={tag}
            className="border-border bg-bg text-ink-muted rounded border px-1.5 py-0.5 font-mono text-[10px]"
          >
            {tag}
          </li>
        ))}
      </ul>

      <p className="text-ink-muted mt-4 pt-1 font-mono text-[10px]">
        {formatDate(asset.createdAt)}
      </p>
    </motion.li>
  );
}
