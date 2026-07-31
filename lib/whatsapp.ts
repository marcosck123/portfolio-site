/**
 * wa.me deep links.
 *
 * This opens the *visitor's* WhatsApp with a message pre-addressed to Marcos —
 * the visitor still taps send. Automatic delivery to Marcos's WhatsApp would
 * require the Meta WhatsApp Cloud API (business account, dedicated number,
 * template approval), which is out of scope. Email is the automatic channel.
 */
export function whatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function proposalText({
  name,
  message,
}: {
  name: string;
  message: string;
}): string {
  return `Olá! Sou ${name}.\n\n${message}`;
}
