import type { Metadata } from "next";
import { PageHeader } from "@/app/components/PageHeader";
import { ProjectsGrid } from "@/app/components/ProjectsGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Sistemas de tempo real e plataformas ligadas a hardware, construídos de ponta a ponta.",
};

export default function ProjectsPage() {
  return (
    <main id="main" className="flex-1 px-6 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[980px]">
        <PageHeader
          title="Projetos"
          description="Sistemas de tempo real e plataformas ligadas a hardware, construídos de ponta a ponta — camada de protocolo, API, dashboard e testes."
        />

        <div className="mt-12">
          <ProjectsGrid projects={projects} />
        </div>
      </div>
    </main>
  );
}
