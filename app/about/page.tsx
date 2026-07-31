import type { Metadata } from "next";
import { PageHeader } from "@/app/components/PageHeader";
import { Skills } from "@/app/components/Skills";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Sobre",
  description: site.tagline,
};

export default function AboutPage() {
  return (
    <main id="main" className="flex-1 px-6 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[820px]">
        <PageHeader title="Sobre" />

        <section aria-labelledby="bio-heading" className="mt-12">
          <h2 id="bio-heading" className="sr-only">
            Biografia
          </h2>
          <div className="flex flex-col gap-4">
            {site.bio.map((paragraph, i) => (
              <p key={i} className="text-ink text-[15px] leading-[1.75]">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section aria-labelledby="skills-heading" className="mt-16">
          <h2 id="skills-heading" className="text-[22px]">
            Stack
          </h2>
          <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">
            Agrupado por onde cada coisa fica no sistema.
          </p>
          <div className="mt-8">
            <Skills />
          </div>
        </section>

        <section aria-labelledby="rationale-heading" className="mt-14">
          <h2 id="rationale-heading" className="sr-only">
            Por que essas ferramentas
          </h2>
          <div className="border-gold bg-surface-2/60 border-l-2 py-4 pr-4 pl-5">
            <p className="text-ink-muted font-mono text-[10px] tracking-[0.2em] uppercase">
              Por que essas ferramentas
            </p>
            <p className="text-ink mt-2 text-[15px] leading-relaxed">
              {site.stackRationale}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
