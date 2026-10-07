"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * The only client-side JS on the asset detail pages.
 * Mirrors the clipboard behaviour used by the contact email button.
 */
export function CopyButton({
  text,
  label = "Copiar",
  copiedLabel = "Copiado!",
  announcement = "Copiado para a área de transferência",
  className = "",
}: {
  text: string;
  label?: string;
  copiedLabel?: string;
  announcement?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Clipboard API can be blocked (insecure origin, denied permission).
      // Fall back to a manual selection prompt rather than failing silently.
      window.prompt("Copie para a área de transferência:", text);
    }
  }

  return (
    <motion.button
      type="button"
      onClick={copy}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={
        className ||
        "border-border bg-surface text-ink hover:border-sea hover:text-sea inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-mono text-xs transition-colors"
      }
    >
      <span aria-hidden>{copied ? "✓" : "⧉"}</span>
      {copied ? copiedLabel : label}
      <span aria-live="polite" className="sr-only">
        {copied ? announcement : ""}
      </span>
    </motion.button>
  );
}
