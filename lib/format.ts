/**
 * Shared formatting helpers. Deliberately not a client module: these are
 * called from both server components (asset detail) and client components
 * (asset cards).
 */

const LANGUAGE_LABEL: Record<string, string> = {
  ts: "TypeScript",
  tsx: "TypeScript",
  js: "JavaScript",
  python: "Python",
  bash: "Bash",
  sql: "SQL",
  css: "CSS",
};

export const languageLabel = (lang: string) =>
  LANGUAGE_LABEL[lang] ?? lang.toUpperCase();

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Locale-independent, so server and client render an identical string. */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
}
