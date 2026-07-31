import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import { codeToHtml } from "shiki";
import { CopyButton } from "@/app/components/CopyButton";
import { languageLabel, formatDate } from "@/lib/format";
import { assets, getAssetBySlug, assetCategories } from "@/data/assets";

export function generateStaticParams() {
  return assets.map((asset) => ({ slug: asset.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const asset = getAssetBySlug(slug);
  if (!asset) return { title: "Asset não encontrado" };
  return { title: asset.title, description: asset.description };
}

export default async function AssetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const asset = getAssetBySlug(slug);
  if (!asset) notFound();

  // Highlighting happens here, on the server, at build time — the rendered
  // page ships zero syntax-highlighting JavaScript.
  // `github-light-high-contrast`, not plain `github-light`: the standard theme's
  // orange (#E36209, 3.3:1) and red (#D73A49, 4.3:1) tokens fail WCAG AA against
  // this surface. The high-contrast variant clears 4.5:1 for every token.
  const highlighted = await codeToHtml(asset.code, {
    lang: asset.language,
    theme: "github-light-high-contrast",
  });

  const categoryLabel =
    assetCategories.find((c) => c.id === asset.category)?.label ??
    asset.category;

  const meta = [
    languageLabel(asset.language),
    categoryLabel,
    formatDate(asset.createdAt),
    asset.updatedAt ? `atualizado ${formatDate(asset.updatedAt)}` : null,
  ].filter(Boolean) as string[];

  return (
    <main id="main" className="flex-1 px-6 py-14 sm:py-20">
      <article className="mx-auto w-full max-w-[820px]">
        <Link
          href="/assets"
          className="text-ink-muted hover:text-sea font-mono text-xs transition-colors"
        >
          ← Voltar para assets
        </Link>

        <div aria-hidden className="bg-gold mt-8 h-[2px] w-12" />

        <header className="mt-6">
          <h1 className="text-[30px] leading-tight sm:text-[38px]">
            {asset.title}
          </h1>

          <p className="text-ink-muted mt-3 text-[15px] leading-relaxed">
            {asset.description}
          </p>

          <p className="text-ink-muted mt-4 font-mono text-[11px] tracking-wider uppercase">
            {meta.join(" · ")}
          </p>

          <ul className="mt-5 flex flex-wrap gap-1.5">
            {asset.tags.map((tag) => (
              <li
                key={tag}
                className="border-border bg-surface text-ink-muted rounded border px-2 py-0.5 font-mono text-[10px]"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <section aria-labelledby="code-heading" className="mt-12">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="code-heading" className="text-[20px]">
              O trecho
            </h2>
            <CopyButton text={asset.code} label="Copiar código" />
          </div>

          <div className="code-block border-border bg-surface overflow-hidden rounded-xl border">
            {/*
              Shiki output is generated server-side from local snippet data
              defined in data/assets.ts — never from user input.
            */}
            <div dangerouslySetInnerHTML={{ __html: highlighted }} />
          </div>
        </section>

        <section aria-labelledby="notes-heading" className="mt-12">
          <h2 id="notes-heading" className="text-[20px]">
            Notas
          </h2>
          <div className="prose-coastal mt-4 text-[15px]">
            <Markdown>{asset.explanation}</Markdown>
          </div>
        </section>

        <div className="border-border mt-16 border-t pt-8">
          <Link
            href="/assets"
            className="text-sea font-mono text-xs hover:underline"
          >
            ← Todos os assets
          </Link>
        </div>
      </article>
    </main>
  );
}
