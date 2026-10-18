# Mapa de pendências de uso no Cursor

[English](../../plans/2026-10-17-cursor-pendencias.md)

Registro histórico anterior à migração Alty e à reinicialização de versão; endereços do repositório anterior foram omitidos. Checks assinalados descrevem somente as execuções originais.

Data: 2026-10-17. Base examinada: commit `7be3178`, plugin `design` versão `0.1.0`.

O pedido é verificar as pendências e planejar sua implantação. O usuário informou não ter encontrado dificuldades e pediu uma forma mais fácil de instalar o plugin. Portanto, facilidade de instalação é uma melhoria solicitada; as limitações de validação abaixo não são relatos de falhas atuais do usuário.

## Evidências desta revisão

| Verificação | Resultado observado | Alcance |
| --- | --- | --- |
| Árvore Git antes do trabalho | Sem alterações locais | Base do levantamento. |
| Ambiente Node.js | `v24.21.0` | Atende ao requisito mínimo 22. |
| `npm test` | 46 testes passaram, zero falhas | Inclui testes reais dos auxiliares e empacotamento em repositórios temporários. |
| `npm run verify` | `package OK` | Identidade, versões, referências locais e integridade. |
| Diretório local de plugins do ambiente | `~/.cursor/plugins/local` existe e estava vazio | Nenhuma cópia local disponível para comparar com o código. Não comprova ausência de instalação por marketplace ou outro escopo. |
| Execução no Cursor nesta revisão | Não realizada | Descoberta, prompts, teclado e screenshots permanecem pendentes. |
| CI remoto e download público nesta revisão | Não consultados | Os testes locais não comprovam o estado da release pública. |

A [documentação oficial do Cursor](https://cursor.com/docs/plugins), consultada em 2026-10-17, confirma o caminho de plugins locais, a recarga do editor e a conferência em Customize. A instalação pelo marketplace depende de distribuição nesse canal; publicação exige revisão do Cursor. Isso sustenta duas frentes: simplificar a instalação local agora e preparar a submissão posteriormente. Não foi estabelecida uma listagem pública deste plugin durante a revisão.

## Inventário priorizado

P0: primeira entrega de usabilidade ou pré-requisito da validação. P1: próxima entrega. P2: expansão posterior. Cada status descreve evidência disponível, e não severidade de um bug.

| ID | Prioridade e natureza | Pendência e impacto | Evidência | Critério para encerrar |
| --- | --- | --- | --- | --- |
| INS-01 | P0 · solicitação do usuário | Tornar o início da instalação mais curto e claro para uma pessoa nova. Hoje é necessário acompanhar download, checksum, extração, pasta oculta, destino e recarga. | [Instalação](../installation.md) e pedido do usuário nesta revisão. | Caminho recomendado com passos numerados, requisitos claros, comando copiável e primeiro uso confirmado em uma sessão nova. |
| INS-02 | P1 · melhoria proposta | Automatizar a cópia e a conferência da instalação local, incluindo atualização com backup. Não existe instalador no conjunto atual. | [Scripts disponíveis](../../../package.json), lista `scripts/release-files.json` no clone e operações manuais do guia. | Instalador sem dependências npm, testado em destinos temporários, sem mesclar versões e com diagnóstico que distingue disco de descoberta no editor. |
| INS-03 | P2 · canal externo | Preparar distribuição pelo marketplace para instalação pela interface do Cursor. | Canal descrito na documentação oficial; publicação não comprovada nesta revisão. | Pacote candidato validado, submissão registrada e, somente após aprovação, instalação da listagem observada. |
| CUR-01 | P0 · ambiente/validação | Confirmar a instalação usada, nove habilidades, regra e origem de `/design`. Sem isso, não sabemos qual cópia o editor executa. | Diretório local vazio; [validação registrada](../runtime-validation.md) ainda pendente. | Customize mostra a origem e os dez componentes esperados; `/design` corresponde à versão testada. |
| CUR-02 | P0 · validação | Executar ajuste pequeno, roteamento automático de UI e controle sem UI em sessões separadas. | [Roteiro atual](../runtime-validation.md), [regra](../../../rules/design-router.mdc) e [habilidade principal](../../../skills/design/SKILL.pt-BR.md). | Ajuste preserva o sistema existente; pedido de UI segue o fluxo; tarefa sem UI não inicia etapas ou artefatos de design. |
| CUR-03 | P1 · validação | Verificar funcionalidade nova, redesign e escolhas delegadas sem impor o fluxo completo a todo ajuste. | Contratos em [design](../../../skills/design/SKILL.pt-BR.md), [art-direction](../../../skills/art-direction/SKILL.pt-BR.md) e [uso](../usage.md). | Execuções observadas preservam identidade, dimensionam as etapas e registram a fonte de aprovação/delegação. |
| CUR-04 | P1 · validação | Observar preview, capturas, responsividade, estados reais e teclado nativo. Os auxiliares testados não substituem essas observações. | [Contrato de navegador](../../../references/pt-BR/browser-validation.md), [revisão visual](../../../skills/visual-review/SKILL.pt-BR.md) e [acessibilidade](../../../skills/accessibility-review/SKILL.pt-BR.md). | Evidências atuais distinguem metadados, imagem inspecionada, interação, DOM e checks indisponíveis. |
| CUR-05 | P0 · correção do ambiente de validação | Reproduzir e corrigir os bloqueios de automação, captura e autenticação; depois validar descoberta e prompts. | Registro histórico: Cursor 3.25.6/macOS, estados de acessibilidade desatualizados, identificadores inválidos, ScreenCaptureKit `-3811` e CLI sem autenticação em [Validação](../runtime-validation.md). | Subitens AMB-01–AMB-05 encerrados com evidências de antes/depois; fallback ou diagnóstico isolado não equivale a correção. |
| CUR-06 | P1 · documentação/validação | Esclarecer como representar evidência antiga na retomada. O contrato manda marcar evidência como `stale`, mas o exemplo de check admite apenas `passed`, `failed` e `pending` e não mostra uma retomada completa. | [Template](../../../templates/pt-BR/workflow.md) e [handoff](../../../skills/design-handoff/SKILL.pt-BR.md). | Exemplo preserva o histórico, marca o check atual como `pending`, explica a revisão divergente e não altera silenciosamente o schema. |
| CUR-07 | P1 · repetibilidade | Ampliar o smoke test atual com casos, prompts e registro padronizado, permitindo comparar versões. | O roteiro atual tem seis passos; os [testes existentes](../development.md) cobrem código/auxiliares/pacote, não conversas no editor. | Casos identificados, entradas reproduzíveis, critérios observáveis e um registro por execução/ambiente. |
| CUR-08 | P1 · compatibilidade e runtime | Comprovar execução em Node.js 22 e 24; executar instalação e fluxo em Windows e Linux; observar atualização e retorno à versão anterior. | [Limitações atuais](../runtime-validation.md), execução local observada em Node 24 e CI configurado para Linux/Node 22 em `.github/workflows/ci.yml` no clone. | AMB-06–AMB-07 e matriz de sistemas com resultados reais; não transformar configuração de CI ou teste de CRLF em execução comprovada. |

## Correções e verificações do ambiente citadas pelo usuário

Os itens abaixo detalham CUR-05 e CUR-08, sem alterar a contagem de 11 pendências principais. O inventário abaixo descreve o estado inicial; o acompanhamento da implementação está na seção de estado atual ao final. Os erros do editor são históricos; é necessário reproduzir ou comprovar sua resolução no ambiente atual antes de escolher a correção.

| Subitem | Ação necessária | Critério de encerramento | Onde executar no plano |
| --- | --- | --- | --- |
| AMB-01 · acessibilidade desatualizada | Investigar a atualização do estado da ferramenta, renovar a leitura após mudanças na interface e corrigir a sequência de automação. | A leitura acompanha mudanças observadas na janela; o fluxo não depende de estado antigo. | Tarefa 4A. |
| AMB-02 · identificadores inválidos | Obter identificadores da leitura atual e corrigir seleção/contexto antes da ação. | Seleção e ação funcionam com identificadores atuais, inclusive após uma mudança da interface. | Tarefa 4A. |
| AMB-03 · ScreenCaptureKit `-3811` | Reproduzir captura mínima; investigar permissões, sessão e compatibilidade da ferramenta; aplicar a correção da causa identificada e repetir. | Captura real pelo mecanismo afetado, com dimensões conferidas e imagem inspecionada. Uma alternativa funcionando não encerra o erro original. | Tarefa 4A e S07. |
| AMB-04 · CLI sem autenticação | Conferir a CLI efetivamente usada, concluir seu fluxo documentado de autenticação e repetir a chamada mínima. | Sessão autenticada e resposta observada, sem credenciais no repositório. CLI continua opcional para o plugin. | Tarefa 4A. |
| AMB-05 · descoberta/prompts sem evidência | Após recuperar o ambiente, repetir descoberta das nove habilidades/regra e execução dos prompts. | S01–S06 com evidências da cópia e revisão realmente executadas. | Tarefas 4–5. |
| AMB-06 · Node.js 22/24 | Executar a suíte e o verificador em ambos os runtimes; conferir a execução do CI vinculada ao commit candidato. Corrigir diferenças reproduzidas preservando o piso 22. | Resultado registrado por versão e commit; configuração do workflow sozinha não conta como teste. | Tarefa 7. |
| AMB-07 · Windows/PowerShell | Executar instalação, auxiliares e fluxo numa máquina/VM Windows real e corrigir as incompatibilidades observadas. | Instalação, atualização/retorno, descoberta e uso registrados em Windows; teste de CRLF permanece evidência separada. | Tarefa 7. |

Diagnosticar uma causa ou documentar uma alternativa permite continuar tarefas independentes, mas não fecha uma correção. Dependências externas sem solução ficam abertas com responsável, evidência, próxima ação e condição de retomada.

## O que já existe

As instruções já contemplam fluxo proporcional à tarefa, preservação de tokens, aprovação ou delegação da direção, artefatos no projeto do usuário, fallback de preview estático, capturas PNG/JPEG, integridade de evidências, calibração de teclado e tentativas limitadas. A implantação deve validar esses comportamentos antes de propor uma reescrita.

O gravador de capturas registra uma imagem existente; não há pendência implícita de transformá-lo em um gerador de screenshots. O preview continua sendo estático. Ausência de ferramentas do host deve produzir uma pendência explícita, conforme os contratos existentes.

## Alternativas para facilitar a instalação

| Alternativa | Benefício | Limite | Decisão proposta |
| --- | --- | --- | --- |
| Guia curto sobre o ZIP/clone atual | Entrega rápida, preserva os caminhos existentes. | Cópia, atualização e diagnóstico continuam manuais. | Primeira tarefa, com texto preparado para o instalador futuro. |
| Instalador local incluído no ZIP | Elimina a escolha manual do destino, a cópia de pastas ocultas e a mistura de versões; permite conferir e atualizar. | Exige Node.js 22+ e extração prévia; não confirma o que o Cursor carregou. | Frente principal de melhoria. |
| Marketplace do Cursor | Permite instalar pela interface do editor. | Depende de submissão, revisão e observação da listagem aprovada. | Frente posterior; não bloquear a melhoria local. |

O [plano de implantação](2026-10-17-cursor-implantacao.md) detalha entregas, dependências e critérios. O levantamento original não executava essas mudanças; a implementação posterior está registrada abaixo.

## Estado após a implementação local

A candidata 0.2.0 inclui instalador, diagnóstico, backup/restauração, guias, roteiro S01–S09, template de execução e exemplo de evidências por revisão. Os resultados completos e os limites estão em [Validação](../runtime-validation.md).

| Itens | Estado observado | O que permanece aberto |
| --- | --- | --- |
| INS-01/INS-02 | Guia e instalador implementados; instalação local e testes de substituição/retorno executados | Primeira experiência completa observada no editor. |
| INS-03 | Dados e checklist do marketplace preparados | Submissão, revisão e instalação da listagem. |
| CUR-01/AMB-05 | Nove habilidades, regra, versão, seleção de `/design`, origem local e S02–S06 observados no IDE; revisões/evidências/handoff conferidos | Checks de ferramentas ainda indisponíveis permanecem separados em Validação. |
| CUR-02/CUR-03 | Controle sem UI, ajuste, roteamento automático e funcionalidade observados no IDE; S06 aguardou escolha e depois aplicou Bancada | Homologação dos checks visuais/teclado ainda indisponíveis em cada caso. |
| CUR-04/AMB-03 | Estados, capturas 390×844/1440×900 e teclado observados no navegador independente, inclusive sobre o resultado do IDE; captura nativa recuperou intermitentemente e voltou a falhar | Causa/correção estável do ScreenCaptureKit e screenshot transitória de loading. |
| CUR-05/AMB-01–AMB-04 | Login da CLI testado; renovação de sessão/ativação da janela permitiram ações e capturas reais; procedimento de recuperação documentado | Automação nativa ainda apresenta estado inconsistente e `-3811`; causa não confirmada. |
| CUR-06 | S09 no IDE detectou revisão divergente, preservou JSON/imagens históricos byte a byte e repetiu checks disponíveis sem editar a fonte | Capturas atuais e demais checks indisponíveis permanecem pendentes, sem reaproveitar aprovação visual antiga. |
| CUR-07 | Roteiro, template e registros dos casos executados entregues | Completar checks indisponíveis conforme o ambiente necessário em Validação. |
| CUR-08/AMB-06–AMB-07 | CI remoto aprovado em Windows/Linux/macOS com Node.js 22.23.3 e 24.21.0; ZIP e instalação/atualização/restauração observados em PowerShell | Descoberta e fluxo no Cursor gráfico Windows/Linux. AMB-06 encerrado na revisão `ecac32b`; AMB-07 parcial. |
