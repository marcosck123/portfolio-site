"use client";

import { motion } from "framer-motion";
import { staggerParent, viewportOnce } from "./MotionWrapper";
import { AssetCard } from "./AssetCard";
import { assetsByDate } from "@/data/assets";

/** The three most recent snippets; the full set lives at /assets. */
const recent = assetsByDate.slice(0, 3);

export function AssetsTeaser() {
  if (recent.length === 0) return null;

  return (
    <motion.ul
      className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(0.1)}
    >
      {recent.map((asset) => (
        <AssetCard key={asset.slug} asset={asset} />
      ))}
    </motion.ul>
  );
}
