import { whatsappUrl } from "@/lib/whatsapp";
import { contact } from "@/data/site";

/**
 * Outline style rather than WhatsApp brand green: #25D366 on white is ~1.9:1
 * and cannot pass AA. Sea-green outline keeps it distinct and on-palette.
 * Renders disabled while `contact.whatsappNumber` is empty — never a broken
 * wa.me link.
 */
export function WhatsAppButton({
  text,
  label,
  className = "",
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[13px] transition-colors";

  if (!contact.whatsappNumber) {
    return (
      <span
        aria-disabled="true"
        title="Número de WhatsApp ainda não configurado"
        className={`border-border text-ink-muted cursor-not-allowed border-dashed ${base} ${className}`}
      >
        <span aria-hidden>◈</span>
        {label}
      </span>
    );
  }

  return (
    <a
      href={whatsappUrl(contact.whatsappNumber, text)}
      target="_blank"
      rel="noopener noreferrer"
      className={`border-sea text-sea hover:bg-sea hover:text-white ${base} ${className}`}
    >
      <span aria-hidden>◈</span>
      {label}
    </a>
  );
}
