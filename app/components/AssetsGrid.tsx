"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { staggerParent, viewportOnce } from "./MotionWrapper";
import { AssetCard } from "./AssetCard";
import { FilterChip } from "./FilterChip";
import {
  assetCategories,
  type AssetCategory,
  type CodeAsset,
} from "@/data/assets";

export function AssetsGrid({ assets }: { assets: CodeAsset[] }) {
  const [active, setActive] = useState<AssetCategory | "all">("all");

  // Only offer filters for categories that actually have snippets.
  const available = assetCategories.filter((category) =>
    assets.some((asset) => asset.category === category.id),
  );

  const visible =
    active === "all"
      ? assets
      : assets.filter((asset) => asset.category === active);

  return (
    <div>
      {available.length > 1 ? (
        <div
          role="group"
          aria-label="Filtrar por categoria"
          className="mb-8 flex flex-wrap gap-2"
        >
          <FilterChip active={active === "all"} onClick={() => setActive("all")}>
            Todos ({assets.length})
          </FilterChip>
          {available.map((category) => (
            <FilterChip
              key={category.id}
              active={active === category.id}
              onClick={() => setActive(category.id)}
            >
              {category.label} (
              {assets.filter((a) => a.category === category.id).length})
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
        variants={staggerParent(0.08)}
      >
        {visible.map((asset) => (
          <AssetCard key={asset.slug} asset={asset} />
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
