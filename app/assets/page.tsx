import type { Metadata } from "next";
import { PageHeader } from "@/app/components/PageHeader";
import { AssetsGrid } from "@/app/components/AssetsGrid";
import { assetsByDate } from "@/data/assets";

export const metadata: Metadata = {
  title: "Assets",
  description:
    "Trechos de código selecionados, com o raciocínio por trás de cada um: o que faz, quando usar e por que fica guardado.",
};

export default function AssetsPage() {
  return (
    <main id="main" className="flex-1 px-6 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[980px]">
        <PageHeader
          title="Assets"
          description="Código que eu guardo e reaproveito. Cada um registra o que faz, quando se aplica e por que mereceu ficar — o critério importa mais que as linhas."
        />

        <div className="mt-12">
          <AssetsGrid assets={assetsByDate} />
        </div>
      </div>
    </main>
  );
}
