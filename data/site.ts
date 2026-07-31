export interface SiteProfile {
  name: string;
  role: string;
  location: string;
  intro: string;
  tagline: string;
  /** Paragraphs for the /about page. */
  bio: string[];
  /** Short line on why this toolset — rendered under the skills. */
  stackRationale: string;
  githubUser: string;
  githubUrl: string;
  /** Empty renders the LinkedIn button in a disabled state. */
  linkedinUrl: string;
  email: string;
}

export const site: SiteProfile = {
  name: "Marcos",
  role: "Engenheiro full-stack",
  location: "Brasil",
  intro: "Sou Marcos. Construo sistemas de tempo real, IoT e fintech.",
  tagline:
    "Simuladores de protocolo TCP, pipelines de telemetria e integrações de pagamento para o mercado brasileiro — entregues com testes, Docker e observabilidade.",
  bio: [
    "Sou engenheiro full-stack e trabalho na fronteira entre software e hardware: sistemas que precisam responder em tempo real, falar com equipamentos físicos e continuar de pé quando a rede cai.",
    "Boa parte do que construo nasce do varejo de combustíveis brasileiro — concentradores de pista, medição automática de tanques, conciliação de transações. São ambientes em que não dá para “tentar de novo depois”: o dado chega uma vez, o equipamento não responde a HTTP, e o erro aparece no caixa do posto.",
    "Na prática isso significa protocolos binários e de texto sobre TCP, MQTT saindo de sensores e ESP32, séries temporais em TimescaleDB, e APIs REST/WebSocket alimentando dashboards em Next.js. Quando o hardware não está disponível, eu escrevo o simulador — fiel o suficiente para o backend não perceber a diferença.",
    "Do lado financeiro, trabalho com o ecossistema brasileiro de pagamentos: Pix, Open Finance e integrações com adquirentes. É o mesmo problema de sempre — consistência sob falha parcial —, só que com dinheiro no meio.",
  ],
  stackRationale:
    "A escolha é sempre a mesma: tipagem forte na borda, async no meio, e um banco que entenda o formato do dado. TypeScript e Python cobrem os dois lados, Docker garante que roda igual na minha máquina e na sua, e os testes existem porque hardware falha de formas criativas.",
  githubUser: "marcosck123",
  githubUrl: "https://github.com/marcosck123",
  linkedinUrl: "https://www.linkedin.com/in/marcos-eduardo-1ba561337",
  email: "marcoseduardock@gmail.com",
};

/**
 * Public contact config — these values ship to the client.
 * Secrets (RESEND_API_KEY, CONTACT_EMAIL) live in env and are read only inside
 * the API route. Never import them here.
 */
export const contact = {
  /**
   * Digits only, international format: 55 + DDD + number (no "+", spaces or dashes).
   * e.g. DDD 69 -> "5569XXXXXXXXX".
   * TODO: preencher. Enquanto estiver vazio, os botões de WhatsApp aparecem
   * desabilitados em vez de gerarem um link wa.me quebrado.
   */
  whatsappNumber: "",
  /** Pre-filled text for the standing "Falar no WhatsApp" button. */
  defaultWhatsappMessage:
    "Olá! Vi seu portfólio e gostaria de conversar sobre uma proposta.",
};
