import type { Metadata } from "next";
import { PageHeader } from "@/app/components/PageHeader";
import { Contact } from "@/app/components/Contact";
import { ContactForm } from "@/app/components/ContactForm";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { contact } from "@/data/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Envie uma proposta por email ou fale direto no WhatsApp. GitHub, LinkedIn e email também.",
};

export default function ContactPage() {
  return (
    <main id="main" className="flex-1 px-6 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[820px]">
        <PageHeader
          title="Contato"
          description="Aberto a trabalhos de backend, IoT e fintech — remoto ou híbrido. Manda os detalhes pelo formulário que eu respondo no seu email."
        />

        <section aria-labelledby="form-heading" className="mt-12">
          <h2 id="form-heading" className="text-[22px]">
            Enviar uma proposta
          </h2>
          <p className="text-ink-muted mt-2 text-[15px] leading-relaxed">
            Quanto mais contexto sobre o problema, melhor a primeira resposta.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>

        <section aria-labelledby="whatsapp-heading" className="mt-14">
          <h2 id="whatsapp-heading" className="text-[22px]">
            Prefere WhatsApp?
          </h2>
          <p className="text-ink-muted mt-2 text-[15px] leading-relaxed">
            Abre uma conversa comigo já com a mensagem escrita — é só você
            enviar.
          </p>
          <div className="mt-5">
            <WhatsAppButton
              text={contact.defaultWhatsappMessage}
              label="Falar no WhatsApp"
            />
          </div>
        </section>

        <section aria-labelledby="channels-heading" className="mt-14">
          <h2 id="channels-heading" className="text-[22px]">
            Outros canais
          </h2>
          <div className="mt-6">
            <Contact />
          </div>
        </section>
      </div>
    </main>
  );
}
