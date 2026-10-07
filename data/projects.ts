export type ProjectStatus = "live" | "in-progress" | "coming-soon";

export interface Project {
  id: string;
  /** URL identifier — powers /projects/[slug]. */
  slug: string;
  name: string;
  tagline: string;
  description: string;
  stack: string[];
  /** URL or /public path to a screenshot. Empty renders a placeholder tile. */
  thumbnail?: string;
  /** ASCII architecture diagram, shown on the card when there is no thumbnail. */
  diagram?: string;
  /** Deployed link. Empty renders "View Live" in a disabled state. */
  liveUrl?: string;
  githubUrl: string;
  caseStudyUrl?: string;
  status: ProjectStatus;
  /** Featured projects sort to the front of the grid. */
  featured: boolean;

  /** Full write-up for the case study page. Blank lines separate paragraphs. */
  longDescription?: string;
  /** Screenshot / GIF paths for the detail gallery. Empty shows a placeholder. */
  images?: string[];
  year?: number;
  /** e.g. "Real-time", "IoT", "Fintech". */
  category?: string;
  /** Concrete, verifiable outcomes. Omit rather than invent. */
  results?: string[];
  /** One sentence on the hardest or most interesting technical part. */
  highlight?: string;
}

export type SkillCategory =
  | "frontend"
  | "backend"
  | "hardware"
  | "fintech"
  | "devops";

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: string;
}

export type DemoType = "gif" | "video" | "youtube";

/**
 * A screen recording of a project running.
 * Distinct from the code snippets in `data/assets.ts`.
 */
export interface Demo {
  id: string;
  /** Links the demo back to a Project.id for the caption. */
  projectId: string;
  title: string;
  caption: string;
  type: DemoType;
  /**
   * Media source. For "youtube" this is the bare video id.
   * Empty renders the "Recording coming soon" fallback.
   */
  src?: string;
  /** Optional poster frame for "video" demos. */
  poster?: string;
}

export const projects: Project[] = [
  {
    id: "forecourt-concentrator",
    slug: "forecourt-concentrator",
    name: "Simulador de Concentrador de Pista",
    tagline: "Simulador de protocolo TCP em tempo real para postos brasileiros",
    description:
      "Monorepo TypeScript que simula o concentrador de bombas com broadcast via WebSocket, conciliação e alertas de queda. Testes: 60/60 passando.",
    stack: ["TypeScript", "Node.js", "WebSocket", "TCP", "Docker", "Vitest"],
    thumbnail: "",
    diagram: [`bombas ──TCP──▶ concentrador ──WS──▶ dashboard`, `                     │`, `        conciliação · alerta de queda`].join("\n"),
    liveUrl: "",
    githubUrl: "https://github.com/marcosck123/forecourt-concentrator-simulator",
    status: "in-progress",
    featured: true,
    year: 2026,
    category: "Tempo real",
    longDescription: `Todo posto de combustível no Brasil tem um "concentrador" — uma caixa na pista que fala um protocolo serial/TCP proprietário com cada bomba e repassa as transações para o sistema de frente de caixa. É a peça de infraestrutura à qual você não consegue acesso sem estar fisicamente em um posto, o que torna quase impossível desenvolver ou testar contra ela.

Este projeto é um simulador fiel desse concentrador. Ele implementa o protocolo TCP baseado em linhas ASCII que o hardware real fala, modela a máquina de estados de cada bomba (ociosa, bico retirado, abastecendo, transação fechada) e transmite cada mudança de estado para os clientes conectados via WebSocket.

Sobre a camada de protocolo existe uma rotina de conciliação, que compara o que as bombas reportaram com o que foi de fato persistido, e um ciclo de detecção de queda, que abre e fecha alertas quando uma bomba para de responder. A stack inteira sobe com Docker Compose, então ela substitui o hardware real em um ambiente de integração.`,
    highlight:
      "Reconstruir o protocolo TCP baseado em linhas ASCII e a semântica de conciliação sem acesso ao hardware físico — a máquina de estados precisa continuar correta mesmo com conexões caindo e frames lidos pela metade.",
    results: [
      "60/60 testes passando",
      "docker compose validado de ponta a ponta",
      "broadcast WebSocket + ciclo de alerta de queda",
    ],
    images: [],
  },
  {
    id: "tank-telemetry",
    slug: "tank-telemetry",
    name: "Plataforma de Telemetria de Tanques",
    tagline: "Telemetria IoT para postos brasileiros com alertas em tempo real",
    description:
      "Plataforma IoT em camadas: simulador FastAPI + TimescaleDB + API REST/WebSocket + dashboard Next.js. 26 testes passando.",
    stack: ["Python/FastAPI", "TimescaleDB", "Next.js", "WebSocket", "Docker"],
    thumbnail: "",
    diagram: [`simulador ─MQTT▶ FastAPI ─▶ TimescaleDB`, `                    │`, `            alertas ─WS▶ dashboard Next.js`].join("\n"),
    liveUrl: "",
    githubUrl: "https://github.com/marcosck123/tank-telemetry",
    status: "in-progress",
    featured: true,
    year: 2026,
    category: "IoT",
    longDescription: `Tanques subterrâneos de combustível são monitorados por medidores automáticos (ATGs) que reportam volume, nível, temperatura e contaminação por água. Ter um ambiente de desenvolvimento que se comporte como uma pista real significa ou possuir o hardware, ou simulá-lo de forma convincente.

Esta plataforma faz o segundo, de ponta a ponta. Um simulador em Python gera leituras fisicamente plausíveis e as publica via MQTT exatamente como um ATG Veeder-Root ou um sensor baseado em ESP32 publicaria — incluindo cenários operacionais como descarga, vazamento lento ou entrada de água, que podem ser disparados ao vivo por um painel para demonstração.

Um serviço FastAPI consome esse stream MQTT de forma assíncrona, valida cada payload, persiste em TimescaleDB como série temporal e passa a leitura por um motor de alertas que abre e resolve alertas de limite. Leituras e eventos de alerta são empurrados para um dashboard Next.js via WebSocket, então a interface reflete o estado do tanque no mesmo tick em que o sensor reportou.`,
    highlight:
      "Usar hypertables do TimescaleDB para a parte de série temporal mantendo o caminho de ingestão totalmente assíncrono, e construir um simulador de dispositivo fiel o bastante para o backend não distinguir do hardware real.",
    results: [
      "26 testes passando",
      "stack completa via docker compose",
      "REST + WebSocket + inferência de alertas",
    ],
    images: [],
  },
  {
    id: "delivery-route-optimizer",
    slug: "delivery-route-optimizer",
    name: "Delivery Route Optimizer",
    tagline: "Otimização de rotas de entrega com TSP + OSRM e integração J&T",
    description:
      "Aplicação full-stack que ordena entregas com TSP (nearest-neighbor) e traça a rota real via OSRM. Auth JWT, geocodificação com cache, importação de endereços por foto (OCR) e sincronização de pedidos da J&T Express.",
    stack: ["Next.js", "FastAPI", "SQLAlchemy", "PostgreSQL", "Leaflet", "OSRM", "JWT"],
    thumbnail: "",
    diagram: [
      "endereços ─▶ geocodificação (cache) ─▶ TSP ─▶ OSRM",
      "    ▲                                          │",
      "CSV · OCR · J&T                          mapa Leaflet",
    ].join("\n"),
    liveUrl: "https://delivery-route-optimizer-web.vercel.app",
    githubUrl: "https://github.com/marcosck123/delivery-route-optimizer",
    status: "live",
    featured: true,
    year: 2026,
    category: "Full-stack",
    highlight:
      "Cache de endereços em que a correção manual vira a verdade: o mesmo endereço nunca é geocodificado (e cobrado) duas vezes.",
    results: [
      "152 + 37 testes (pytest, Vitest)",
      "frontend na Vercel, backend em Fly.io",
    ],
    images: [],
  },
  {
    id: "nodewatch",
    slug: "nodewatch",
    name: "NodeWatch",
    tagline: "Dashboard self-hosted de operações de VPS com probes ao vivo",
    description:
      "Lê a tabela de processos real do host, testa serviços por TCP e HTTP, inspeciona containers Docker e guarda histórico de disponibilidade em SQLite. Estados online, degraded, offline e error.",
    stack: ["React 19", "TypeScript", "Fastify 5", "SQLite", "Docker Compose", "Nginx"],
    thumbnail: "",
    diagram: [
      "host (ps · df) ──┐",
      "probes TCP/HTTP ─┼─▶ Fastify ─▶ SQLite ─▶ dashboard React",
      "Docker API ──────┘",
    ].join("\n"),
    liveUrl: "",
    githubUrl: "https://github.com/marcosck123/nodewatch",
    status: "in-progress",
    featured: true,
    year: 2026,
    category: "DevOps",
    highlight:
      "Telemetria real do host em vez de JSON mockado, com histórico que sobrevive a reinícios.",
    results: [
      "inventário Docker com restarts, containers unhealthy e indícios de OOM",
      "demo em GIF e MP4 no repositório",
    ],
    images: [],
  },
  {
    id: "agenda-casal",
    slug: "agenda-casal",
    name: "AgendaCasal",
    tagline: "PWA de agenda compartilhada para casais, com push e notas de voz",
    description:
      "Calendário, lembretes, chat e notas de voz em um espaço privado para duas pessoas, pareadas por código de convite. PWA instalável com notificações web push.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Firebase", "Web Push", "PWA"],
    thumbnail: "",
    liveUrl: "https://agenda-casal-i6b6-olive.vercel.app",
    githubUrl: "https://github.com/marcosck123/AgendaCasal",
    status: "live",
    featured: false,
    year: 2026,
    category: "Full-stack",
    results: ["no ar na Vercel", "PWA instalável com cache offline"],
    images: [],
  },
  {
    id: "prioritybar",
    slug: "prioritybar",
    name: "PriorityBar",
    tagline: "Overlay para Windows que mostra só as notificações prioritárias",
    description:
      "Lê toasts do Windows (com permissão explícita), filtra localmente por app e conteúdo e exibe uma barra compacta no topo da tela. Roda na bandeja do sistema; as configurações ficam locais.",
    stack: ["C#", ".NET 8", "Windows"],
    thumbnail: "",
    liveUrl: "",
    githubUrl: "https://github.com/marcosck123/prioritybar",
    status: "in-progress",
    featured: false,
    year: 2026,
    category: "Desktop",
    results: ["filtragem 100% local", "demo em GIF no repositório"],
    images: [],
  },
  {
    id: "script-zap",
    slug: "script-zap",
    name: "script-zap",
    tagline: "Automação de prospecção via WhatsApp com Evolution API",
    description:
      "Importa leads, monta mensagens personalizadas, agenda os envios ao longo do dia e dispara via Evolution API self-hosted. Inclui painel local que consulta o status remoto por SSH.",
    stack: ["Python", "Evolution API", "Docker Compose", "PostgreSQL", "Redis"],
    thumbnail: "",
    liveUrl: "",
    githubUrl: "https://github.com/marcosck123/script-zap",
    status: "in-progress",
    featured: false,
    year: 2026,
    category: "Automação",
    images: [],
  },
  {
    id: "farol-leads",
    slug: "farol-leads",
    name: "Farol Leads",
    tagline: "Coletor de leads via Google Places API para prospecção manual",
    description:
      "Coleta clínicas por bairro e termo de busca na Google Places API (New), aplica filtros de qualidade e teto de chamadas e gera um CSV de trabalho, com painel HTML de prospecção.",
    stack: ["Node.js", "TypeScript", "Google Places API"],
    thumbnail: "",
    liveUrl: "",
    githubUrl: "https://github.com/marcosck123/Farol-leads",
    status: "in-progress",
    featured: false,
    year: 2026,
    category: "Automação",
    images: [],
  },
  {
    id: "farol-site",
    slug: "farol-site",
    name: "Farol — site institucional",
    tagline: "Site estático institucional a partir da identidade visual FAROL",
    description:
      "HTML, CSS e JavaScript puros: menu mobile, animações, formulário por e-mail e botão de WhatsApp.",
    stack: ["HTML", "CSS", "JavaScript"],
    thumbnail: "",
    liveUrl: "https://farol-site-gamma.vercel.app",
    githubUrl: "https://github.com/marcosck123/farol-site",
    status: "live",
    featured: false,
    year: 2026,
    category: "Web",
    images: [],
  },
];

export const skills: Skill[] = [
  { name: "React", category: "frontend", icon: "⚛️" },
  { name: "Next.js", category: "frontend", icon: "▲" },
  { name: "TypeScript", category: "frontend", icon: "📘" },
  { name: "Tailwind CSS", category: "frontend", icon: "🎨" },
  { name: "Framer Motion", category: "frontend", icon: "✨" },

  { name: "Node.js", category: "backend", icon: "🟢" },
  { name: "FastAPI", category: "backend", icon: "🐍" },
  { name: "PostgreSQL", category: "backend", icon: "🐘" },
  { name: "Redis", category: "backend", icon: "🔴" },
  { name: "WebSocket/TCP", category: "backend", icon: "🔌" },

  { name: "ESP32", category: "hardware", icon: "🔌" },
  { name: "E-ink Display", category: "hardware", icon: "📱" },
  { name: "MQTT", category: "hardware", icon: "📡" },

  { name: "Pix/Open Finance", category: "fintech", icon: "💳" },
  { name: "Payment Integration", category: "fintech", icon: "💰" },

  { name: "Docker", category: "devops", icon: "🐳" },
  { name: "Vercel", category: "devops", icon: "▲" },
  { name: "Railway", category: "devops", icon: "🚂" },
];

/** Display order and labels for the Skills section. */
export const skillCategories: { id: SkillCategory; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "hardware", label: "Hardware" },
  { id: "fintech", label: "Fintech BR" },
  { id: "devops", label: "Ferramentas / DevOps" },
];

/**
 * Recordings of the projects running. Entries with an empty `src` render the
 * "Recording coming soon" fallback, so they can be listed before capture.
 */
export const demos: Demo[] = [
  {
    id: "forecourt-pump-flow",
    projectId: "forecourt-concentrator",
    title: "Fluxo de uma transação de bomba",
    caption:
      "Frames TCP entrando, broadcast WebSocket saindo, ao vivo no dashboard.",
    type: "gif",
    src: "",
  },
  {
    id: "forecourt-offline-alert",
    projectId: "forecourt-concentrator",
    title: "Alerta de queda e conciliação",
    caption:
      "O concentrador cai, o alerta dispara, e as transações conciliam na reconexão.",
    type: "gif",
    src: "",
  },
  {
    id: "tank-telemetry-dashboard",
    projectId: "tank-telemetry",
    title: "Dashboard de telemetria",
    caption: "Níveis de tanque ao vivo, vindos do simulador FastAPI.",
    type: "video",
    src: "",
  },
  {
    id: "tank-telemetry-alerts",
    projectId: "tank-telemetry",
    title: "Alertas de limite",
    caption:
      "Limites de nível de água e volume disparando alertas em tempo real.",
    type: "gif",
    src: "",
  },
];

/** Recordings belonging to a given project, for its case study page. */
export function getDemosForProject(projectId: string): Demo[] {
  return demos.filter((demo) => demo.projectId === projectId);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
