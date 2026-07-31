export type AssetCategory =
  | "utils"
  | "hooks"
  | "patterns"
  | "algorithms"
  | "devops"
  | "hardware";

export interface CodeAsset {
  /** Unique — used in the URL. */
  slug: string;
  title: string;
  /** Short, for the card. */
  description: string;
  /** Shiki language id: "ts" | "python" | "bash" | "sql" | "css" | ... */
  language: string;
  code: string;
  /** Markdown: what it does, when to use, why it's kept. */
  explanation: string;
  tags: string[];
  category: AssetCategory;
  /** YYYY-MM-DD */
  createdAt: string;
  updatedAt?: string;
}

/**
 * Every snippet here is lifted from real project code, lightly trimmed of
 * app-specific branches. Identifiers are left as they were written.
 */
export const assets: CodeAsset[] = [
  {
    slug: "websocket-reconnect-backoff",
    title: "Reconexão de WebSocket com backoff exponencial",
    description:
      "Ciclo de vida da conexão de um dashboard ao vivo: reconexão automática com backoff exponencial limitado e nenhum setState depois de desmontar.",
    language: "ts",
    category: "hooks",
    tags: ["React", "WebSocket", "real-time", "cleanup"],
    createdAt: "2026-07-26",
    code: `const BACKOFF_INICIAL_MS = 1000;
const BACKOFF_MAXIMO_MS = 15000;

export function useLiveSocket(url: string, onMessage: (m: WsMessage) => void) {
  const [status, setStatus] = useState<ConnectionStatus>("conectando");

  const socketRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = useRef(BACKOFF_INICIAL_MS);
  const desmontadoRef = useRef(false);

  useEffect(() => {
    desmontadoRef.current = false;

    function agendarReconexao() {
      const espera = backoffRef.current;
      backoffRef.current = Math.min(espera * 2, BACKOFF_MAXIMO_MS);
      timerRef.current = setTimeout(conectar, espera);
    }

    function conectar() {
      if (desmontadoRef.current) return;

      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        if (desmontadoRef.current) return;
        // Only a *successful* connection resets the backoff.
        backoffRef.current = BACKOFF_INICIAL_MS;
        setStatus("conectado");
      };

      socket.onmessage = (evento) => {
        if (desmontadoRef.current) return;
        try {
          onMessage(JSON.parse(evento.data as string) as WsMessage);
        } catch {
          // Unexpected payload: drop the message, keep the connection alive.
        }
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (desmontadoRef.current) return;
        setStatus("reconectando");
        agendarReconexao();
      };

      // Never reconnect from onerror — let it close and reconnect once.
      socket.onerror = () => socket.close();
    }

    conectar();

    return () => {
      desmontadoRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [url, onMessage]);

  return status;
}`,
    explanation: `Mantém uma conexão WebSocket viva durante todo o ciclo de vida do componente, reconectando sozinha quando o servidor some e recuando para não martelar um backend morto.

## O que faz

- Reconecta no \`close\` com **backoff exponencial**, dobrando a partir de 1s e limitado em 15s.
- Reseta o backoff **só depois que a conexão realmente abre** — não quando ela é tentada. Esse é o detalhe fácil de errar: resetar na tentativa transforma o backoff em um retry fixo de 1s.
- Encaminha o \`onerror\` para \`close()\` em vez de reconectar direto, então uma falha gera exatamente uma reconexão, e não duas correndo em paralelo.
- Protege todos os callbacks com \`desmontadoRef\` e limpa o timer pendente no cleanup, então um componente desmontado nunca chama \`setState\` e nenhum socket órfão sobrevive a um fast refresh.

## Quando usar

Qualquer dashboard sempre ligado alimentado por um stream de push — telemetria, alertas, progresso de job. Se você precisa de entrega garantida ou replay depois de uma janela offline, essa é a camada errada: reconexão devolve um socket vivo, não as mensagens que você perdeu.

## Por que fica guardado

Escrito para o dashboard do tank-telemetry, onde o backend reinicia o tempo todo durante o desenvolvimento. A proteção de desmontagem e a regra "resetar o backoff no open, não na tentativa" são dois bugs que eu já escrevi antes — aqui os dois estão corrigidos.`,
  },
  {
    slug: "mqtt-publish-loop",
    title: "Loop de publicação MQTT para simulador de dispositivo",
    description:
      "Loop assíncrono que publica leituras de sensor do jeito que um ESP32 ou um medidor automático de tanque publicaria, reconectando quando o broker cai.",
    language: "python",
    category: "hardware",
    tags: ["MQTT", "asyncio", "ESP32", "IoT", "aiomqtt"],
    createdAt: "2026-07-26",
    code: `RECONEXAO_MQTT_S = 5.0


async def mqtt_loop() -> None:
    while True:
        try:
            async with aiomqtt.Client(
                hostname=settings.mqtt_host, port=settings.mqtt_port
            ) as client:
                log_evento(
                    logging.INFO,
                    "mqtt_conectado",
                    host=settings.mqtt_host,
                    port=settings.mqtt_port,
                )
                while True:
                    # Publish on the simulation tick, not on a timer of our own.
                    await simulator.new_reading_event.wait()
                    simulator.new_reading_event.clear()

                    for leitura in list(simulator.latest.values()):
                        topico = (
                            f"telemetria/{settings.posto_id}"
                            f"/tanque/{leitura.tank_id}/leitura"
                        )
                        await client.publish(
                            topico,
                            payload=leitura.model_dump_json(),
                            qos=1,
                            retain=False,
                        )
        except aiomqtt.MqttError as exc:
            log_evento(
                logging.WARNING,
                "mqtt_erro",
                detalhe=exc,
                nova_tentativa_em=f"{RECONEXAO_MQTT_S}s",
            )
            await asyncio.sleep(RECONEXAO_MQTT_S)`,
    explanation: `Publica leituras de sensor em um broker MQTT usando tópico hierárquico, no formato que um dispositivo real usaria — serve para substituir o hardware físico durante o desenvolvimento.

## O que faz

- Envolve o cliente inteiro em \`async with\`, então um restart do broker levanta \`MqttError\`, desmonta o contexto, dorme e reconecta. O \`while True\` externo transforma queda de broker em não-evento.
- Publica a partir de um \`asyncio.Event\` disparado pelo loop de simulação, e não de um timer próprio, então a taxa de publicação segue o tick do sensor e nenhuma leitura é publicada duas vezes.
- Usa tópico hierárquico — \`telemetria/{posto}/tanque/{tank}/leitura\` — para o consumidor assinar por posto ou por tanque com wildcard, em vez de filtrar do lado do cliente.
- Publica em **QoS 1** com \`retain=False\`: a leitura precisa chegar pelo menos uma vez, mas uma leitura velha reentregue a um novo assinante seria pior do que leitura nenhuma.

## Quando usar

Qualquer publicador do lado do dispositivo, real ou simulado. A mesma estrutura funciona sem mudanças em um gateway de verdade; em um ESP32 rodando MicroPython a API muda, mas o esquema de tópicos, a escolha de QoS e o loop de reconexão se aplicam igual.

## Por que fica guardado

Foi essa peça que permitiu construir e testar todo o backend do tank-telemetry sem possuir um medidor automático de tanque. O raciocínio sobre QoS e retain é a parte que vale lembrar — é uma decisão que costumam copiar sem pensar, e errar com \`retain=True\` significa que novos assinantes veem imediatamente níveis de tanque velhos como se fossem atuais.`,
  },
  {
    slug: "websocket-broadcast-hub",
    title: "Hub de broadcast WebSocket que descarta conexões mortas",
    description:
      "Fan-out para todos os clientes conectados, coletando os sockets que falharam durante o envio e descartando depois — sem nunca mutar o set no meio da iteração.",
    language: "python",
    category: "patterns",
    tags: ["FastAPI", "WebSocket", "broadcast", "asyncio"],
    createdAt: "2026-07-27",
    code: `class ConnectionHub:
    """Holds the set of live WebSockets and broadcasts events to them."""

    def __init__(self) -> None:
        self._conexoes: set[WebSocket] = set()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._conexoes.add(websocket)

    def disconnect(self, websocket: WebSocket) -> None:
        # discard(), not remove() — disconnect may fire twice for one socket.
        self._conexoes.discard(websocket)

    async def broadcast(self, evento: dict) -> None:
        if not self._conexoes:
            return

        # Serialise once, not once per connection.
        payload = json.dumps(evento, default=str)

        mortas: list[WebSocket] = []
        # Iterate a copy: a send failure must not mutate the set we're walking.
        for websocket in list(self._conexoes):
            try:
                await websocket.send_text(payload)
            except Exception as exc:
                logger.warning(
                    json.dumps({"evento": "ws_envio_falhou", "erro": str(exc)})
                )
                mortas.append(websocket)

        for websocket in mortas:
            self._conexoes.discard(websocket)`,
    explanation: `Um hub pub/sub mínimo para empurrar eventos do servidor para todos os navegadores conectados, com o tratamento de falha que impede a degradação ao longo do tempo.

## O que faz

- Serializa o payload **uma vez** antes do loop, e não por conexão — o custo do JSON é pago uma vez, independentemente de quantos clientes estão ligados.
- Itera sobre \`list(self._conexoes)\` para que uma falha de envio não mute o set que está sendo percorrido, o que levantaria \`RuntimeError: Set changed size during iteration\`.
- Junta os sockets com falha em \`mortas\` e os descarta *depois* do loop. Um cliente que fechou sem handshake limpo cai no próximo broadcast em vez de acumular para sempre.
- Usa \`discard()\` em vez de \`remove()\` em todo lugar, porque uma desconexão pode chegar duas vezes para o mesmo socket e \`remove()\` levantaria \`KeyError\`.
- Retorna cedo quando não há conexões, então a serialização é pulada inteira em um sistema ocioso.

## Quando usar

Fan-out de push do servidor em que todo cliente vê o mesmo stream: dashboards ao vivo, feeds de alerta, logs de build. Para filtro por cliente ou salas, você quer uma chave de assinatura junto de cada socket; para garantia de entrega entre reconexões, você quer um broker de verdade, não isto.

## Por que fica guardado

Cada um dos quatro detalhes acima é um bug que eu peguei construindo isso. São cerca de trinta linhas, e é a peça que eu senão reescreveria — um pouco pior — em todo projeto novo de tempo real.`,
  },
  {
    slug: "mqtt-ingest-validate-persist",
    title: "Ingestão MQTT que valida antes de persistir",
    description:
      "Loop consumidor que rejeita payloads malformados com log estruturado, persiste os válidos e nunca deixa uma falha downstream derrubar o stream.",
    language: "python",
    category: "hardware",
    tags: ["MQTT", "FastAPI", "pydantic", "asyncpg", "observability"],
    createdAt: "2026-07-27",
    updatedAt: "2026-07-29",
    code: `async def _processar_mensagem(payload: bytes, pool, state, hub, motor) -> None:
    try:
        dados = json.loads(payload)
    except json.JSONDecodeError as exc:
        _log(logging.WARNING, "payload_invalido",
             motivo="json_invalido", erro=str(exc))
        return

    try:
        leitura = LeituraIn.model_validate(dados)
    except ValidationError as exc:
        _log(logging.WARNING, "payload_invalido",
             motivo="schema_invalido", erros=exc.errors())
        return

    await inserir_leitura(pool, leitura)
    state.ultimas_leituras[leitura.tank_id] = leitura

    # The alert engine is best-effort: a bug in it must not stop ingestion.
    try:
        await motor.processar(leitura, hub, pool)
    except Exception as exc:
        _log(logging.ERROR, "motor_alertas_falhou",
             tank_id=leitura.tank_id, erro=str(exc))

    await hub.broadcast(
        {"type": "leitura", "payload": leitura.model_dump(mode="json")}
    )


async def run_consumer(host, port, topic, pool, state, hub, motor) -> None:
    while True:
        try:
            async with aiomqtt.Client(hostname=host, port=port) as client:
                await client.subscribe(topic, qos=1)
                _log(logging.INFO, "mqtt_conectado",
                     host=host, port=port, topic=topic)
                async for message in client.messages:
                    await _processar_mensagem(
                        message.payload, pool, state, hub, motor
                    )
        except aiomqtt.MqttError as exc:
            _log(logging.INFO, "mqtt_reconectando",
                 erro=str(exc), backoff_s=RECONNECT_BACKOFF_S)
            await asyncio.sleep(RECONNECT_BACKOFF_S)`,
    explanation: `A metade consumidora de um pipeline IoT: assinar, validar, persistir, avaliar alertas, transmitir — com cada modo de falha tratado no nível a que ele pertence.

## O que faz

- Separa as duas formas de um payload de dispositivo estar errado — **JSON malformado** e **JSON válido que não bate com o schema** — e registra cada uma com um \`motivo\` diferente. Quando um equipamento começa a se comportar mal em campo, essa distinção é a diferença entre cinco minutos e uma tarde inteira.
- Retorna em vez de levantar exceção em payload ruim. Um dispositivo mandando lixo não pode derrubar a ingestão de todos os outros.
- Envolve o motor de alertas no próprio \`try\`, então um bug na inferência degrada o sistema para "ainda gravando dados, sem alertar", em vez de "silenciosamente não gravando nada".
- Registra eventos JSON estruturados (\`evento\`, mais campos) em vez de strings formatadas, então o log é consultável sem parsing.
- Persiste **antes** de transmitir, então um cliente que reconecta e refaz a busca nunca vê um evento que não está no banco.

## Quando usar

Qualquer caminho de ingestão alimentado por dispositivos que você não controla. A regra de ordem — validar, persistir, derivar, notificar — vale muito além de MQTT.

## Por que fica guardado

O que importa é a estrutura, não o código. Dispositivos em campo mandam payload malformado, e o instinto é deixar a exceção subir e consertar o equipamento. É assim que se perde um dia de telemetria de trinta tanques saudáveis porque um medidor mandou um null.`,
  },
];

/** Newest first, by createdAt. */
export const assetsByDate = [...assets].sort((a, b) =>
  b.createdAt.localeCompare(a.createdAt),
);

export const assetCategories: { id: AssetCategory; label: string }[] = [
  { id: "hooks", label: "Hooks" },
  { id: "patterns", label: "Padrões" },
  { id: "hardware", label: "Hardware" },
  { id: "utils", label: "Utilitários" },
  { id: "algorithms", label: "Algoritmos" },
  { id: "devops", label: "DevOps" },
];

export function getAssetBySlug(slug: string): CodeAsset | undefined {
  return assets.find((asset) => asset.slug === slug);
}
