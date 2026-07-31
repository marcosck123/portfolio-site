import Link from "next/link";
import { Hero } from "./components/Hero";
import { Section } from "./components/Section";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { AssetsTeaser } from "./components/AssetsTeaser";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />

      <Section
        id="projetos"
        index="01"
        eyebrow="Trabalho"
        title="Projetos em destaque"
        description="Sistemas de tempo real e plataformas ligadas a hardware, construídos de ponta a ponta — camada de protocolo, API, dashboard e testes."
        action={
          <Link
            href="/projects"
            className="text-sea font-mono text-xs hover:underline"
          >
            Ver todos os projetos →
          </Link>
        }
      >
        <FeaturedProjects />
      </Section>

      <Section
        id="assets"
        index="02"
        eyebrow="Snippets"
        title="Assets recentes"
        alt
        description="Código que eu guardo e reaproveito, com o raciocínio por trás de cada um."
        action={
          <Link
            href="/assets"
            className="text-sea font-mono text-xs hover:underline"
          >
            Ver todos os assets →
          </Link>
        }
      >
        <AssetsTeaser />
      </Section>

      <section
        aria-labelledby="cta-heading"
        className="border-border border-t px-6 py-20 sm:py-24"
      >
        <div className="mx-auto w-full max-w-[980px]">
          <div aria-hidden className="bg-gold h-[2px] w-12" />
          <h2 id="cta-heading" className="mt-6 text-[28px] sm:text-[34px]">
            Vamos conversar?
          </h2>
          <p className="text-ink-muted mt-3 max-w-2xl text-[15px] leading-relaxed">
            Aberto a trabalhos de backend, IoT e fintech — remoto ou híbrido.
          </p>
          <Link
            href="/contact"
            className="bg-sea hover:bg-navy mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 font-mono text-[13px] text-white transition-colors"
          >
            Entrar em contato
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
