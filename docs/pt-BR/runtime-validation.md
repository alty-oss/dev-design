# Validação e compatibilidade

[English](../runtime-validation.md)

Os resultados históricos abaixo pertencem ao projeto anterior à migração Alty e à reinicialização de versão. Não comprovam publicação, CI ou execução do pacote npm/ZIP atual em `alty-oss/dev-design`. Os endereços anteriores foram omitidos sem reatribuir suas evidências ao novo repositório.

A verificação de código e a execução do agente no editor são avaliações diferentes. Esta página identifica o que foi observado e o que ainda precisa ser executado.

## Candidata 0.2.0 — execução de 2026-10-17

A candidata foi implementada localmente, sem publicação. O instalador foi validado em destinos temporários e usado para criar uma cópia local real; o diagnóstico retornou `matching` para os 45 arquivos distribuídos. O resultado em disco não comprova a descoberta pelo editor.

| Verificação | Resultado observado | Limite/próxima ação |
| --- | --- | --- |
| macOS arm64, Node.js 24.21.0 | 56/56 testes e `package OK` | Execução local da candidata, incluindo instalador e ZIP extraído. |
| macOS arm64, Node.js 22.23.3 | 56/56 testes e `package OK` | Runtime temporário obtido da distribuição oficial, com SHA-256 conferido; nenhum downgrade global. |
| Instalação local | `installed`, depois `matching`; origem e destino com os mesmos bytes | Cópia candidata 0.2.0 instalada para o piloto. |
| Atualização/retorno | Testes reais em diretórios temporários passaram, incluindo falha de promoção e falha de restauração com backup preservado | Retorno confirmado pelos arquivos; retorno observado no editor continua pendente. |
| AMB-04 · CLI | Login concluído pelo titular; chamada de leitura retornou `CLI_OK` com saída zero | CLI 2026.10.16-e3cb207; modelo Auto. Login e resposta mínima comprovados, sem divulgação de credenciais. |
| S04 pela CLI | Função `sum(a, b)` explicada; árvore do projeto descartável intacta | Valida o controle sem UI nessa sessão CLI, não descoberta no IDE. |
| S02 pela CLI | Ajuste localizado no botão, revisão/evidências e checks visuais/teclado pendentes | Primeira tentativa interrompida por timeout após recusa de shell; nova sessão com revisão automática concluiu. Resultado de CLI separado do IDE. |
| AMB-01–AMB-03 · automação nativa | Sessão renovada e janela ativada permitiram digitação, seleção da habilidade e leitura das respostas. Capturas JPEG reais de Customize, diálogo e execução foram inspecionadas; `-3811`, janela indisponível e divergência entre imagem e árvore voltaram a ocorrer | Recuperação parcial. Ativação pelo menu Window também permitiu captura, sem estabilidade comprovada. Causa desconhecida; o erro original permanece aberto. Uma tentativa com ID antigo foi erro do controlador, refeita com o ID atual, e não evidência de falha com IDs novos. |
| S01 no IDE · descoberta | Nove habilidades, `design-router`, versão 0.2.0 e origem Local observados. `/design` selecionado no menu; seu chip abriu o arquivo da habilidade em `plugins/local/design/skills/design/SKILL.md`; resposta de ajuste observada | Origem local efetivamente confirmada, além da recarga manual informada pelo usuário. Não depende apenas da existência da pasta. |
| S02 no IDE · ajuste | Prompt com habilidade selecionada removeu somente `#send{margin-left:21px}`; bytes restantes, tokens e script preservados. Revisão, evidências e handoff escritos no projeto de teste | O próprio agente manteve captura de viewport e teclado pendentes após calibração/recusa. A revisão inicialmente declarou ausência de commit incorretamente; o reteste no IDE corrigiu a procedência e preservou os registros antigos byte a byte, sem mudar a fonte. Uma tentativa exploratória anterior com prefixo duplicado foi registrada separadamente e não substituiu o prompt canônico. |
| S04 no IDE · sem UI | Explicação correta de `sum(a, b)`; os três hashes da base permaneceram iguais e Git não mostrou alterações | Sessão independente, sem artefatos de design. |
| S03 pela CLI | Pedido de UI sem comando adotou o fluxo e alterou hierarquia preservando tokens e loading de 700ms | Contexto instalado, modelo Auto; identidade na fonte conferida, sem extrapolar para o IDE. |
| S05 pela CLI e no navegador integrado | Estados implementados; observados validação, loading, erro, nova tentativa e sucesso, com dados preservados | Primeira chamada atingiu timeout; retomada concluiu. Registro de código separado da observação no navegador. |
| S06 pela CLI | Duas direções propostas; fonte da tela permaneceu intacta enquanto aguardava escolha | Fase de aplicação após escolha não exercitada nessa chamada CLI; resultado do IDE registrado separadamente. |
| S09 pela CLI | Detectou alteração de estilo, voltou checks afetados a pending e preservou arquivo histórico byte a byte | Hash anterior confirmado contra o recibo original; novos hashes indisponíveis nessa sessão foram registrados como tal. |
| S03 no IDE · UI automática | Sem comando, adotou o fluxo e alterou hierarquia, preservando os cinco tokens existentes e o comportamento do envio | Revisão, evidências e handoff concluídos após retomar a mesma conversa interrompida por conexão. Commit e hashes conferidos; capturas desktop/mobile válidas. Teclado nativo e parte dos estados permanecem pendentes nessa sessão. |
| S05 no IDE · funcionalidade | Implementou validação por campo, loading, erro/retry/sucesso, `aria-busy`, preservação dos dados e temporizador de 700ms | Revisão, evidências e handoff concluídos na mesma conversa, sem nova alteração da fonte; commit, hashes e imagens conferidos. Checks próprios e observações do controlador têm autoria separada; o sucesso e o teclado foram confirmados pelo controlador no navegador independente. |
| S06 no IDE · redesign | Duas propostas materiais; os três arquivos da base permaneceram byte a byte intactos antes da escolha. Após escolha de teste pelo controlador, aplicou Bancada e registrou direção aprovada com a mensagem de origem | Revisão, evidências e handoff concluídos na mesma conversa; commit e hashes conferidos, imagens mobile válidas. Capturas desktop rejeitadas por corte/repetição; teclado nativo e medição temporal confiável ficaram pendentes. A escolha pertence à fixture descartável. |
| S09 no IDE · retomada | Detectou a mudança de superfície pelo diff e SHA-256, preservou o JSON histórico e as duas imagens byte a byte, registrou commit/hash atuais e repetiu interação, reflow e contraste sem editar a fonte | Imagens históricas não foram atribuídas à revisão nova; checks visuais voltaram a pending. Capturas atuais foram rejeitadas por corte/dimensões incorretas; teclado, zoom, reduced-motion e imagem de loading continuam pendentes. |
| S07 · resultado atual S05 em navegador independente | Validação vazia, loading real no DOM, erro, retry por Enter, sucesso e dados visíveis preservados. Tab/Shift+Tab/Enter/Escape e retorno de foco observados. Capturas JPEG originais inspecionadas em 390×844 e 1440×900, hashes/dimensões conferidos | Fonte da implementação do IDE conferida por commit e hash. A primeira imagem desktop ficou vazia após resize e foi rejeitada; um reteste após conferir o DOM produziu imagem válida. Sem captura transitória de loading, zoom ou ramo reduced-motion. Não encerra a captura nativa do Cursor. |
| S07 · navegador integrado | Capturas originais JPEG em 390×844 (erro) e 1440×900 (sucesso), pixel ratio 1, inspecionadas e registradas com SHA-256 | Formato conferido pelos bytes, apesar dos nomes com extensão `.png`. Capturas pertencem à revisão testada da fixture; capturedAt ficou nulo sem recibo de horário da captura. |
| S07 · estados e teclado | DOM mostrou disabled/aria-busy durante loading real; erro/retry/sucesso e validação observados. Tab, Shift+Tab, Enter e Escape mudaram foco/abertura do modal; Escape restaurou foco | Teclado do navegador integrado comprovado nesta sessão; não valida automação da janela nativa do Cursor. |
| S07 · reflow e contraste | A 320px, scrollWidth igual a innerWidth; contraste computado do botão opaco branco/azul de 6,63:1 | Escopo: estado e botão da fixture. Sem certificação global de acessibilidade ou zoom não exercitado. |
| S08/limitações restantes | Captura nativa do Cursor e screenshot transitória de loading permanecem pendentes | Loading foi observado no DOM; resultado no navegador integrado não encerra o erro ScreenCaptureKit. |
| CI Linux/macOS/Windows e Node.js 22/24 | Seis jobs aprovados no commit `ecac32b`, com Node.js 22.23.3 e 24.21.0; testes, verificador e ZIP executados | Execução remota 39083379637 (registro histórico; endereço anterior omitido). Windows/macOS: 56 aprovados; Linux: 55 aprovados e um caso de alias de caixa inaplicável ao volume sensível a caixa. Zero falhas. |
| Windows/PowerShell no CI | ZIP com checksum conferido e extraído por `Expand-Archive`; instalação, diagnóstico `matching`, substituição e restauração de backup executados nos dois runtimes | PowerShell 7 no runner Windows real. Os testes também exercitaram preview, registro de captura e falhas/restauração do instalador; não inclui Cursor gráfico. |
| Cursor gráfico no Windows e Linux | Não executado | CI comprova os auxiliares nesses sistemas; descoberta e prompts no editor exigem sessões gráficas próprias. |
| Marketplace | Dados/checklist preparados em [Marketplace](marketplace.md) | Não submetido; aprovação e instalação da listagem continuam externas. |

O piloto também expôs uma lacuna de procedência: uma revisão afirmou “sem commit” para uma fixture aninhada que tinha commit. A causa da declaração incorreta não foi confirmada. O contrato de artefatos passou a exigir raiz do código alterado, comando, saída/limitação e hashes. Um agente em contexto novo localizou o commit correto e o hash da edição usando a orientação atual. Depois de instalar o ZIP atualizado, o reteste na conversa S02 do IDE também consultou a raiz correta, registrou o commit existente e o hash da fonte. Os dois registros antigos foram arquivados byte a byte; a fonte permaneceu intacta. Isso confirma o caso retestado, sem garantir todas as futuras respostas do modelo.

A primeira execução remota revelou três falhas de teste no Windows: a fixture usava uma representação do diretório temporário diferente da canonicalização nativa do instalador. A preparação passou a usar `realpathSync.native`, preservando as injeções de falha e as verificações de restauração. O primeiro CI (registro histórico; endereço anterior omitido) conserva a reprodução; a execução aprovada acima inclui a correção e o teste adicional em PowerShell.

As instruções operacionais agora exigem observação atual após cada ação/mudança de janela, uso de IDs atuais e interrupção do check quando estado acessível e imagem persistirem divergentes. Recusa de uma operação não deve ser contornada por outro agente/interface. Essas melhorias evitam alegações incorretas; não representam correção do provedor de automação ou do ScreenCaptureKit.

Os testes de CLI usaram o modelo Auto e foram executados em projetos descartáveis independentes, com revisões e recibos locais preservados fora da distribuição. Limitações de shell, hash ou navegador são registradas separadamente; nenhuma ausência de ferramenta foi convertida em aprovação. O preview da execução CLI anterior foi encerrado e sua URL deixou de responder. Os cinco previews iniciais do piloto do IDE foram encerrados pelos respectivos agentes; uma conferência independente confirmou ausência dos PIDs e recusa de conexão nas cinco portas. O preview próprio de S09 também foi encerrado. Consulte o [roteiro S01–S09](cursor-smoke-test.md) e o [modelo por execução](../../templates/pt-BR/cursor-validation.md).

## Histórico — versão 0.1.0

A distribuição **Dev Design v0.1** reúne o código e os guias públicos mais recentes no repositório anterior. A versão interna é `0.1.0`; a numeração foi consolidada sem reverter funcionalidades. O identificador do plugin continua `design` e as nove habilidades são preservadas. Os auxiliares de preview e captura não mudaram.

Na preparação desta versão, `npm test` passou em **46/46 testes** e `npm run verify` retornou **package OK**. A revisão dos guias conferiu os links relativos distribuídos, incluindo âncoras.

| Área | Como verificar | Limite da evidência |
| --- | --- | --- |
| Código e auxiliares | `npm test` | Testa código e operações reais dos auxiliares; não executa o agente no editor. |
| Identidade, licenças e links | `npm run verify` | Valida arquivos e referências locais, incluindo o ZIP extraído. |
| Distribuição | Gerar o ZIP e conferir seu SHA-256 | Valida bytes e conteúdo, sem comprovar descoberta pelo Cursor. |
| CI da versão | Execuções vinculadas ao commit/tag no GitHub Actions | O resultado se aplica ao commit da execução. |
| Nove habilidades e regra no editor | Conferir Customize após recarregar | Pendente de observação confiável nesta versão. |
| `/design`, roteamento de UI e tarefa sem UI | Sessões separadas em projeto descartável | Pendente de execução no editor nesta versão. |
| Capturas, teclado e estados do produto | Observar com ferramentas disponíveis | Pendente; não decorre dos testes de código. |

As execuções de CI e releases históricas pertencem ao repositório anterior à migração. As rotas de CI e publicação do novo repositório precisam ser conferidas de forma independente após a migração. Os testes de empacotamento verificam o conjunto exato de documentos e arquivos distribuídos, links internos, checksum, versões e rejeição de uma árvore alterada.

## Ambiente e limitações conhecidas

A tentativa histórica anterior à candidata usou Cursor 3.25.6 em macOS. A automação retornou estados de acessibilidade desatualizados, identificadores inválidos e erro ScreenCaptureKit (-3811). Não houve evidência suficiente para certificar a descoberta das habilidades ou a execução dos prompts. A alternativa de CLI não estava autenticada. Esses resultados não são uma declaração de incompatibilidade com o editor.

Na versão histórica 0.1.0, Node.js 22 era o alvo de CI; as verificações locais também foram executadas em Node.js v24.21.0. O teste com `core.autocrlf=true` verifica preservação de bytes em clones, mas não representa execução completa em uma máquina Windows. A documentação incluía instalação por PowerShell; uma sessão real nesse sistema ainda precisava ser observada naquele estágio.

Essas limitações estão detalhadas como AMB-01–AMB-07 no [mapa de pendências](plans/2026-10-17-cursor-pendencias.md). O [plano de implantação](plans/2026-10-17-cursor-implantacao.md) prevê recuperação do ambiente na tarefa 4A, confirmação de descoberta/prompts nas tarefas 4–5 e execução em Node.js 22/24 e Windows na tarefa 7. O estado atual de cada item está no registro da candidata acima; registrar um diagnóstico ou fallback não comprova a correção.

## Roteiro de smoke test

O [mapa de pendências](plans/2026-10-17-cursor-pendencias.md) registra a revisão local de 2026-10-17. O [plano de implantação](plans/2026-10-17-cursor-implantacao.md) propõe facilitar a instalação e ampliar os cenários abaixo. A existência desses documentos não encerra os checks pendentes no editor.

1. Use um projeto descartável com uma tela simples, tokens conhecidos e uma função sem relação com UI.
2. Instale a versão a testar e confirme a origem `design` em Customize.
3. Em uma sessão nova, execute `/design` para um ajuste pequeno e confira arquivos alterados e evidências.
4. Em outra sessão, peça uma melhoria de interface sem mencionar habilidades e observe o roteamento.
5. Em uma terceira sessão, peça uma explicação da função sem UI e confirme a ausência de etapas de design.
6. Registre versão do plugin/editor, modelo, ferramentas, revisão e resultados realmente observados. Marque checks indisponíveis como pendentes.

## Histórico de validação

O histórico anterior e seus anexos foram guardados em backup local antes da consolidação do repositório. As observações do editor descritas acima continuam sendo limitações conhecidas, sem certificação de execução na versão migrada atual.
