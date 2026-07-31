import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center px-6 py-24">
      <div className="mx-auto w-full max-w-[820px]">
        <div aria-hidden className="bg-gold h-[2px] w-12" />
        <p className="text-ink-muted mt-6 font-mono text-[11px] tracking-[0.25em] uppercase">
          404
        </p>
        <h1 className="mt-3 text-[32px] leading-tight sm:text-[42px]">
          Esta página não existe.
        </h1>
        <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">
          O link pode estar desatualizado, ou a página pode ter mudado de lugar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="bg-sea hover:bg-navy inline-flex items-center rounded-full px-5 py-2.5 font-mono text-xs text-white transition-colors"
          >
            Voltar para a home
          </Link>
          <Link
            href="/projects"
            className="border-border text-ink hover:border-sea hover:text-sea inline-flex items-center rounded-full border px-5 py-2.5 font-mono text-xs transition-colors"
          >
            Ver projetos
          </Link>
        </div>
      </div>
    </main>
  );
}
