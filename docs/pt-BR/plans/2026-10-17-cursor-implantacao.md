# Plano de implantação: instalação simples e uso validado no Cursor

[English](../../plans/2026-10-17-cursor-implantacao.md)

Registro histórico anterior à migração Alty e à reinicialização de versão; endereços do repositório anterior foram omitidos. Checks assinalados descrevem somente as execuções originais. A orientação de guias em português abaixo registra a política da época; a documentação mantida atualmente tem inglês como idioma principal e espelhos em pt-BR.

> Execução futura: realizar as tarefas em ordem, registrar os resultados nos checkboxes e revisar cada entrega antes de avançar. Este documento planeja a implantação; a criação do plano não significa que os recursos propostos já estejam disponíveis.

**Objetivo:** facilitar a instalação por uma pessoa nova e encerrar as pendências verificáveis do uso do Dev Design no Cursor.

**Arquitetura:** preservar o plugin de instruções e seus auxiliares. Adicionar um instalador local baseado nas APIs nativas do Node.js, reutilizar `verify(root)` e validar o comportamento do agente em projetos descartáveis. A distribuição pelo marketplace será uma frente posterior.

**Tecnologia:** Node.js 22+, ESM, `node:test`, Git e empacotamento existentes, sem dependências npm.

**Base:** versão `0.1.0`, commit `7be3178`, [mapa de pendências](2026-10-17-cursor-pendencias.md). O usuário não relatou dificuldades atuais; pediu facilidade de instalação. Os 46 testes e o verificador passaram durante o levantamento inicial.

## Restrições globais

- Preservar `design`, `/design`, as nove habilidades e as interfaces atuais de preview e captura.
- Manter versões iguais em `package.json` e `.cursor-plugin/plugin.json`, com metadados canônicos.
- Não alterar bytes, hashes, licenças ou procedência de `vendor/frontend-design/`.
- Artefatos de uso pertencem a `docs/design/<slug>/` do projeto descartável/usuário; planos pertencem a `docs/plans/` do plugin.
- Não distribuir caminhos pessoais, backups, credenciais, sessões privadas ou projetos de teste executados.
- Política histórica: manter guias públicos em português, links locais válidos e documentos necessários no ZIP.
- Não declarar descoberta, execução visual, teclado ou compatibilidade sem observação.
- Não publicar ou submeter o plugin como efeito automático da execução dos testes.

## Ordem e marcos

| Marco | Tarefas | Entrega | Dependência |
| --- | --- | --- | --- |
| A · início mais claro | 1 | Guia curto usando mecanismos disponíveis. | Nenhuma. |
| B · instalação assistida | 2–3 | Instalador, diagnóstico, testes e inclusão no ZIP. | A. |
| C · ambiente recuperado e piloto no Cursor | 4, 4A e 5 | Correções de automação/autenticação verificadas e descoberta/fluxos observados em macOS. | B; ambiente investigado em 4A antes das ações dependentes no editor. |
| D · retomada confiável | 6 | Exemplo coerente de evidências antigas e retomada observada. | C para a prova no editor. |
| E · expansão e distribuição | 7–8 | Matriz de sistemas e candidato de release; preparação para marketplace. | B–D; outros sistemas conforme acesso. |

É possível entregar A antes do instalador. Se Windows/Linux estiverem indisponíveis, manter essas células pendentes e limitar a declaração de suporte observado ao ambiente do piloto. Não estimar prazo de aprovação externa.

Os bloqueios de ambiente AMB-01–AMB-04 podem ser investigados em paralelo à preparação documental das tarefas 1–4. A descoberta S01 e os casos dependentes só recebem resultado aprovado após a recuperação da capacidade necessária. A tarefa 4A acrescenta uma etapa explícita às oito tarefas originais.

## Tarefa 1 — Encurtar o caminho da primeira instalação

**Resolve:** INS-01. **Responsabilidade:** manutenção/documentação.

**Arquivos:** alterar `README.md`, `docs/installation.md` e `docs/troubleshooting.md`.

- [x] Colocar no topo do guia um caminho recomendado: baixar ZIP e checksum da mesma versão; conferir checksum; extrair/copiar conforme o sistema; recarregar e confirmar origem em Customize. Reutilizar os comandos existentes enquanto o instalador não existir.
- [x] Separar a primeira instalação de atualização/retorno, mantendo o clone como alternativa para quem já tem Git.
- [x] Explicar antes dos comandos quais ferramentas são necessárias e como identificar que a instalação deu certo: pasta íntegra, plugin descoberto e `/design` funcionando são três verificações distintas.
- [x] Encerrar com o pedido inicial copiável: `/design Corrija apenas o alinhamento deste botão. Preserve tipografia, cores e comportamento atuais. Registre o que conseguiu verificar.`
- [x] Conferir os comandos e links com `npm run verify`; executar `npm test` para conferir também a documentação no ZIP extraído.

**Aceite:** alguém consegue localizar o caminho recomendado, seus pré-requisitos, a confirmação e a recuperação de erro sem percorrer os guias de desenvolvimento. A duração de instalação só será registrada quando uma sessão real for observada.

## Tarefa 2 — Implementar instalação local com diagnóstico e retorno

**Resolve:** INS-02. **Responsabilidade:** manutenção do código.

**Arquivos:** criar `scripts/install.mjs` e `tests/install.test.mjs`; alterar `scripts/release-files.json`. Reutilizar `scripts/verify.mjs` sem afrouxar suas regras.

**Contrato proposto, a implementar nesta tarefa:**

| Exportação | Entrada | Responsabilidade |
| --- | --- | --- |
| `inspectInstallation(options)` | `{ sourceRoot: string, targetRoot: string }` | Conferir a origem e o destino sem criar arquivos. |
| `installPlugin(options, dependencies)` | `{ sourceRoot: string, targetRoot: string, replace?: boolean }`; segundo argumento opcional `{ fs }`, com operações nativas por padrão | Instalar/substituir; `replace` é falso por padrão. A substituição de operações de arquivo serve aos testes de falha. |

`sourceRoot` é a raiz da cópia extraída ou do clone. `targetRoot` é um destino explícito nos testes; a CLI resolve a pasta local do Cursor e usa sempre as operações nativas de arquivo.

O diagnóstico retorna `{status, sourceVersion, installedVersion, differences, nextSteps}`. `status` admite `missing`, `matching`, `different` ou `invalid`; `differences` contém caminhos relativos. A instalação retorna `{status, version, backupPath}`, com `status` igual a `installed`, `updated` ou `already-installed` e `backupPath` nulo quando não há backup. Erros de validação ou escrita geram erro legível e código de saída diferente de zero. Não afirmar que o editor carregou a cópia.

**Interface CLI proposta:**

```sh
node scripts/install.mjs --help
node scripts/install.mjs --dry-run
node scripts/install.mjs
node scripts/install.mjs --check
node scripts/install.mjs --replace
```

`--dry-run` descreve operações sem escrever; `--check` inspeciona fonte e destino sem escrever; `--replace` autoriza substituir uma cópia diferente após backup. Flags incompatíveis ou desconhecidas falham. O comando sem flags instala somente se o destino estiver livre, ou retorna `already-installed` se os bytes distribuídos forem iguais e não houver arquivos extras. Destinos divergentes ou com arquivos extras exigem `--replace`. Um destino que seja symlink é recusado.

- [x] Escrever primeiro testes em diretórios temporários cobrindo fonte inválida, destino ausente, cópia idêntica, cópia divergente e arquivos extras. Usar `targetRoot` temporário; nunca tocar a instalação real nos testes.
- [x] Implementar o diagnóstico: validar fonte com `verify`, ler a lista de distribuição, comparar versões/bytes e detectar extras sem seguir symlinks. Nenhum diagnóstico deve abrir o Cursor ou inspecionar dados de conta.
- [x] Validar cada entrada da lista com as restrições de caminhos já usadas pelo empacotamento: arquivo regular, caminho relativo dentro da raiz, sem symlink, duplicidade ou travessia. Rejeitar destino igual à fonte, contendo a fonte ou contido nela antes de qualquer mutação.
- [x] Copiar apenas a lista permitida para uma pasta temporária fora de `plugins/local`; verificar essa cópia antes de movê-la para `plugins/local/design`. Copiar a pasta oculta completa conforme a lista, sem incluir `.git` ou pesquisas.
- [x] Na substituição, mover a cópia antiga inteira para um backup fora de `plugins/local`, em `~/.cursor/plugins-backups/`, com nome único. Só então promover a cópia verificada. Em falha, restaurar a cópia anterior e informar o resultado; nunca apagar o backup como parte automática da instalação.
- [x] Cobrir checksum de arquivo copiado, paths com espaços, symlinks, origem/destino sobrepostos, flags inválidas, ausência de escrita em `--check`/`--dry-run`, falha de escrita e restauração da versão anterior. Testar a falha de promoção com uma dependência de operações de arquivo injetável no teste, mantendo a CLI sem essa opção.
- [x] Adicionar o próprio instalador e `scripts/release-files.json` à lista distribuída, para que funcione no ZIP sem depender do clone. Não adicionar `tests/` ao pacote de uso.
- [x] Rodar `node --test tests/install.test.mjs`, `npm test` e `npm run verify`. Conferir zero falhas e teste de pacote extraído funcionando.

**Aceite:** nenhuma pasta oculta precisa ser copiada manualmente; uma atualização preserva backup e não mistura versões. O instalador usa apenas a cópia local extraída: não baixa nem executa código remoto, não instala Node.js e não reinicia o editor. O checksum do ZIP continua sendo verificado conforme o guia; `verify` da pasta extraída não substitui essa conferência.

## Tarefa 3 — Entregar o instalador pelo ZIP e atualizar o início rápido

**Resolve:** INS-01 e INS-02. **Arquivos:** alterar `tests/package.test.mjs`, `README.md`, `docs/installation.md`, `docs/troubleshooting.md` e `docs/development.md`.

- [x] Acrescentar ao teste de ZIP a execução de `node scripts/install.mjs --help` a partir da pasta extraída; esperar saída zero e as flags documentadas.
- [x] Exercitar a função exportada pelo instalador extraído com destino temporário, confirmando que todos os arquivos necessários estão no ZIP e que a instalação passa em `verify`.
- [x] Atualizar o guia curto somente após esses testes: baixar/conferir; extrair e abrir terminal na pasta `design`; executar `node scripts/install.mjs`; recarregar e confirmar no Cursor.
- [x] Mostrar atualização com `--check` e `--replace`, localização genérica do backup e recuperação. Documentar erros de Node ausente/antigo, destino alterado, permissão negada e origem diferente em Customize.
- [x] Manter uma alternativa manual para pessoas que não usarão o instalador; distinguir Node necessário ao instalador/auxiliares da descoberta das instruções pelo Cursor.
- [x] Executar `npm test` e `npm run verify` e revisar a saída inteira. Naquele estágio histórico, não fornecer comando de `npx`, instalador de extensão ou link de instalação de MCP como se instalassem este plugin.

**Aceite:** o procedimento publicado funciona usando apenas o ZIP e os pré-requisitos declarados. Confirmar em uma instalação nova e numa atualização, sem exigir Git do usuário do ZIP.

## Tarefa 4 — Padronizar o piloto e confirmar descoberta

**Resolve:** CUR-01 e CUR-07. **Arquivos:** criar `docs/cursor-smoke-test.md` e `templates/cursor-validation.md`; alterar `docs/README.md`, `docs/runtime-validation.md` e `scripts/release-files.json`.

- [x] Criar o roteiro e o registro por execução com: data real, sistema, versão do Cursor/plugin/Node, modelo, origem instalada, commit/hashes, ferramentas disponíveis, IDs dos casos, ações, resultado observado, limitação e próximo passo.
- [x] Preparar projeto descartável fora da instalação, com formulário de nome/e-mail, botão de envio, tokens existentes, modal, estados de validação/loading/erro/nova tentativa/sucesso e uma função `sum(a, b)` sem UI. Usar dados fictícios identificados e tempo real de loading fixo, sem alterá-lo para capturas.
- [x] Guardar uma base limpa e restaurá-la antes de cada cenário independente. Registrar também a revisão do projeto de teste, não só a do plugin.
- [x] Executar a tarefa 4A antes das ações dependentes de automação/captura; registrar separadamente capacidade recuperada, alternativa disponível e bloqueio ainda aberto.
- [x] Executar o caso S01: instalar a cópia candidata, recarregar, verificar origem e contar as nove habilidades e `design-router` em Customize. Conferir `/design` no projeto.
- [ ] Se houver outra origem com o mesmo nome, registrar e selecionar a pretendida sem remover plugins de terceiros automaticamente. Se imports locais estiverem bloqueados, registrar a política observada.
- [x] Colocar os dois novos documentos na lista do ZIP e conferir seus links com `npm test` e `npm run verify`.

**Aceite:** S01 observado e associado à versão real. Pasta presente ou instalador bem-sucedido não encerra S01. O registro de execução fica no projeto descartável; somente um resumo sem dados pessoais entra em `docs/runtime-validation.md`.

## Tarefa 4A — Corrigir os bloqueios conhecidos do ambiente

**Resolve:** CUR-05, subitens AMB-01–AMB-04; prepara AMB-05. **Prioridade:** P0 para os bloqueios que impedem observar o editor. A CLI é uma via alternativa e sua recuperação não bloqueia o fluxo principal quando este funciona.

**Responsabilidade:** executor da validação; titular da sessão para login ou permissões que exijam interação humana; mantenedor da ferramenta quando a causa for externa ao plugin.

**Arquivos:** registrar antes/depois em `docs/runtime-validation.md`; acrescentar procedimentos reproduzidos a `docs/troubleshooting.md` e ao futuro `docs/cursor-smoke-test.md`. Alterar `references/cursor-adapter.md` somente se houver uma correção comprovada na sequência operacional do plugin. Não modificar o plugin para ocultar falhas do host.

- [ ] **AMB-01 — Estado de acessibilidade:** registrar a versão atual do Cursor, sistema e ferramenta de automação; reproduzir uma mudança simples e observar se a leitura a acompanha. Renovar a leitura pelo mecanismo documentado após mudar janela, painel ou conteúdo. Corrigir a sequência que reutiliza estado antigo; se o próprio provedor permanecer desatualizado, registrar reprodução mínima para correção no provedor. Retestar duas mudanças sucessivas e conferir a atualização observada em ambas.
- [ ] **AMB-02 — Identificadores:** registrar ação e erro originais; selecionar a janela/painel correto e obter o identificador de uma leitura atual. Não reutilizar identificadores após mudanças que os invalidem. Repetir seleção e ação antes/depois de uma mudança da interface. Se identificadores recém-obtidos falharem, isolar o problema no provedor em vez de adivinhar IDs ou repetir ações às cegas.
- [ ] **AMB-03 — ScreenCaptureKit:** reproduzir uma captura mínima e guardar o erro exato. Conferir os requisitos documentados da ferramenta e seu acesso à captura na sessão atual, incluindo permissões e compatibilidade de versões como hipóteses, sem atribuir previamente a causa ao macOS ou ao Cursor. Corrigir somente a causa identificada; reiniciar/reautorizar apenas o componente necessário quando indicado pelo diagnóstico. Repetir a captura, conferir dimensões e inspecionar a imagem. Uma alternativa documentada pode permitir S07, mas a ocorrência original continua aberta até haver prova de recuperação ou resolução externa confirmada.
- [x] **AMB-04 — Autenticação da CLI:** identificar executável, versão e estado de autenticação usando a interface documentada dessa CLI. Concluir o login exigido com o titular da conta e executar uma chamada mínima de leitura em projeto descartável. Registrar resposta e revisão, sem tokens, cookies ou credenciais. Se o login depender de ação humana, manter esse subitem aberto com a ação exata; não simular autenticação nem transformar CLI em requisito de instalação.
- [ ] Para cada subitem, registrar sintoma anterior, reprodução atual, causa confirmada ou ainda desconhecida, ação aplicada, versão afetada, resultado do reteste e responsável pela próxima ação. Se não reproduzir no ambiente atual, registrar a sequência bem-sucedida e a diferença de ambiente observada; não inventar uma causa histórica.
- [ ] Reexecutar S01 após recuperar leitura/ações e S07 após recuperar captura/teclado. Executar S02–S06 para encerrar AMB-05, sem usar um teste de metadados ou resposta da CLI como prova de descoberta no editor.

**Aceite:** AMB-01–AMB-04 têm prova de recuperação ou permanecem explicitamente abertos. Documentação de fallback, explicação do erro ou capacidade ausente não recebe status de correção concluída. Trabalho independente pode prosseguir, mantendo rastreáveis os bloqueios externos.

## Tarefa 5 — Executar fluxos e avaliar ferramentas disponíveis

**Resolve:** CUR-02, CUR-03, CUR-04, CUR-05 e CUR-07. **Arquivos:** detalhar os casos em `docs/cursor-smoke-test.md`; registrar resultados em `docs/runtime-validation.md`; corrigir `docs/troubleshooting.md` apenas com diagnósticos reproduzidos.

Cada linha abaixo usa uma sessão nova, salvo S09 que retoma a execução indicada. S02–S06 partem da base restaurada. S07 usa a implementação observada de S05; S08 usa uma sessão separada com a limitação de ferramenta efetivamente identificada.

| Caso | Entrada/ação | Resultado observável exigido |
| --- | --- | --- |
| S02 · ajuste explícito | `/design Corrija apenas o alinhamento do botão de envio. Preserve tokens e comportamento.` | Alteração pequena, sem impor brief completo ou alternativas; revisão/evidências no projeto de teste. |
| S03 · UI sem comando | `Melhore a hierarquia visual deste formulário preservando nossos tokens.` | Adoção observável do fluxo de UI; não contar mera menção à habilidade como execução. |
| S04 · sem UI | `Explique a função sum(a, b), sem alterar arquivos.` | Explicação sem etapas nem artefatos de design. |
| S05 · funcionalidade | `/design Inclua validação, loading, erro com nova tentativa e sucesso; preserve os dados preenchidos e a identidade.` | Estados pertinentes e recuperação implementados, reutilização de tokens, checks e limitações registrados. |
| S06 · redesign | `/design Proponha duas direções para este formulário. Aguarde minha escolha antes de aplicar uma nova direção.` Depois, escolher explicitamente uma direção ou delegar a decisão. | Alternativas materiais e status/fonte da decisão registrados; antes da resposta, nenhuma aplicação da nova direção. |
| S07 · navegador e teclado | Abrir preview, observar estados, capturar 390×844 e 1440×900, verificar Tab/Shift+Tab/Enter/Escape e foco do modal. | URL/raiz/PID/dono reais; imagens íntegras inspecionadas; foco/ativação observados; resultados separados por capacidade. |
| S08 · ferramenta indisponível | Repetir revisão numa sessão em que captura ou teclado esteja realmente indisponível. | Check correspondente `pending`, motivo, tentativa alternativa limitada se disponível, próximos passos e continuidade de checks independentes. |

- [x] Registrar cada execução como `passed`, `failed` ou `pending`, com evidência e revisão. Registrar estado não aplicável com justificativa, sem marcar sucesso global.
- [x] Para S07, seguir calibração e limite de tentativas do contrato existente; capturas transitórias indisponíveis não invalidam uma observação DOM separada nem viram screenshots aprovadas.
- [x] Para S08, distinguir limitação atual de ferramenta dos erros históricos. Não presumir que ScreenCaptureKit ou autenticação de CLI continuam falhando. Não tornar a CLI autenticada um requisito do plugin.
- [x] Se qualquer caso revelar bug, registrar reprodução mínima antes de corrigir. Localizar a causa: descoberta/manifesto, roteamento, habilidade específica, auxiliar ou ferramenta externa. Criar teste de regressão comportamental quando a falha for de código; para instruções, repetir o caso no editor. Não escolher um patch antes da reprodução.
- [x] Após correção, repetir o caso afetado e os dependentes; executar `npm test` e `npm run verify` quando mudar o repositório. Encerrar apenas o preview iniciado pela execução.

**Aceite:** S02–S06 observados sem bloqueadores; S07–S08 com resultado por capacidade e limitações reproduzíveis. Na ausência de host funcional, não declarar esses casos concluídos; as tarefas independentes de documentação e instalador podem avançar.

## Tarefa 6 — Esclarecer retomada e evidências antigas

**Resolve:** CUR-06. **Arquivos:** alterar `templates/workflow.md`, `docs/usage.md`, `docs/cursor-smoke-test.md` e, se necessário para manter a mesma explicação, `skills/ui-build/SKILL.md` e `skills/design-handoff/SKILL.md`.

- [x] Manter `schemaVersion: 1` e os valores existentes de `result`. Documentar que evidência antiga fica preservada no histórico e que o check da revisão atual volta a `pending` quando a alteração invalida a evidência anterior.
- [x] Acrescentar exemplo concreto: manter captura antiga e seu SHA-256; registrar em `notes` sua obsolescência em relação à revisão atual; adicionar o novo registro/check, sem reescrever o hash ou atribuir um timestamp de captura inventado.

Exemplo de check atual após mudança na tela:

```json
{
  "id": "visual",
  "result": "pending",
  "reason": "O formulário mudou após a captura anterior; a imagem histórica não valida a revisão atual.",
  "evidence": "review.md"
}
```

- [x] Executar S09: após S05/S07, alterar um estilo do formulário e iniciar nova sessão com `/design Retome docs/design/formulario e confira se as evidências ainda correspondem ao código atual.`
- [x] Conferir que a retomada recupera as decisões existentes, detecta a revisão divergente, preserva o histórico e repete os checks afetados, ou os mantém pendentes com motivo.
- [x] Rodar `npm test` e `npm run verify` e revisar os links entre uso, template e roteiro.

**Aceite:** não há novo enum de check ou quebra dos consumidores existentes; uma captura anterior não aparece como validação da tela alterada.

## Tarefa 7 — Ampliar a matriz e verificar retorno de versão

**Resolve:** CUR-08, AMB-06–AMB-07 e cobertura de INS-02. **Prioridade:** P1 para Node.js 22/24 e Windows; Linux no editor continua na expansão de compatibilidade. **Arquivos:** atualizar `docs/runtime-validation.md`, `docs/installation.md` e `docs/troubleshooting.md` conforme resultados. Avaliar `.github/workflows/ci.yml` somente após verificar as ferramentas exigidas pelos testes em cada runner.

- [x] **Execução local de AMB-06:** suíte e verificador passaram em Node.js 22.23.3 e 24.21.0 no macOS.
- [x] **AMB-06 — CI remoto:** executar `node --version`, `npm test` e `npm run verify` em ambientes isolados com Node.js 22 e 24, sobre a mesma revisão candidata. Registrar as versões exatas e saídas; reproduzir/corrigir qualquer divergência preservando Node.js 22 como piso. Conferir também o resultado real do CI do commit candidato; se estiver indisponível, essa conferência continua pendente. Não considerar o alvo configurado no YAML uma execução aprovada.
- [ ] **AMB-07 — Windows:** disponibilizar uma máquina/VM Windows com PowerShell, Cursor e Node.js 22+. Executar primeira instalação por ZIP, atualização, retorno ao backup, preview estático e registro de captura existente; depois observar descoberta e S02–S09 conforme as capacidades disponíveis. Corrigir problemas reproduzidos de caminhos, processos ou comandos nos arquivos responsáveis e repetir o caso que falhou. Registrar falta de ferramenta separadamente de incompatibilidade do plugin.
- [ ] Usar matriz com macOS, Windows/PowerShell e Linux, registrando separadamente Node, instalação ZIP/clone, primeira instalação, atualização, retorno, descoberta e casos S02–S09.
- [x] Nos sistemas disponíveis, executar o instalador em paths com espaços, conferir `--check`, atualizar com `--replace` e restaurar o backup conforme o guia.
- [ ] Recarregar e conferir a versão/origem no editor após cada instalação/retorno. Não basta comparar arquivos.
- [x] Rodar os testes de código em cada sistema acessível; identificar dependências de Git/unzip dos testes de pacote antes de ampliar o CI. Não adicionar matriz que apenas pula os checks relevantes.
- [x] Manter células sem execução como pendentes, com ambiente necessário e responsável pela próxima tentativa. Não extrapolar resultado de Linux CI para o editor Linux, nem de `core.autocrlf=true` para Windows real.

**Aceite:** resumo de compatibilidade reflete exatamente a matriz observada. Bugs de código reproduzidos recebem regressão; ausência de ambiente não é registrada como bug.

## Tarefa 8 — Preparar distribuição e caminho para marketplace

**Resolve:** INS-03 e entrega das etapas anteriores. **Arquivos:** revisar `CHANGELOG.md`, `docs/releasing.md`, `README.md`, `.cursor-plugin/plugin.json`, `package.json` e `scripts/release-files.json`; seguir o procedimento de release existente.

- [x] Revisar as evidências dos marcos A–D e as limitações de E; atualizar changelog com comportamentos entregues, sem promover itens do plano a funcionalidades existentes.
- [x] Definir a versão candidata pelo escopo final e atualizá-la nos dois manifestos. Não alterar a tag pública `v0.1.0` nem seus anexos para distribuir o instalador.
- [x] Executar `npm test` e `npm run verify`; depois do commit revisado, gerar pacote com `node scripts/package.mjs --output dist`. O resultado esperado é ZIP/checksum com lista e bytes verificados; árvore suja deve continuar sendo recusada.
- [ ] Extrair o candidato em pasta vazia, conferir checksum, rodar o verificador e exercitar o instalador extraído. Repetir S01 e S02 com essa cópia antes da distribuição.
- [x] Preparar informações para submissão ao marketplace a partir da [referência oficial](https://cursor.com/docs/reference/plugins): identidade, descrição, repositório, licença, componentes e evidências. Registrar aprovação/listagem como dependência externa.
- [ ] Quando a submissão for autorizada e aceita, observar instalação pela interface e origem de `/design`; só então atualizar o início rápido com um link verificado para a listagem. Manter o ZIP como alternativa.

**Aceite:** candidato reproduzível e reviewável; limitações conhecidas explícitas. Publicação e submissão são ações posteriores ao preparo do candidato, dentro da autorização da execução futura.

## Critérios de conclusão do programa

- [ ] Caminho de instalação reduzido e observado com uma pessoa/sessão nova; registrar passos, tempo real e erros, sem meta de tempo apresentada como resultado.
- [x] Instalador e atualização testados, backup restaurável, diagnóstico separado da descoberta.
- [x] S01–S06 e S09 observados no piloto; S07–S08 com capacidades e pendências explícitas.
- [ ] AMB-01–AMB-04 retestados individualmente; nenhum bloqueio de automação, captura ou login declarado corrigido apenas por existir um fallback.
- [ ] AMB-05 comprovado no editor; AMB-06 com execução real em Node.js 22/24; AMB-07 com sessão Windows observada ou dependência de ambiente ainda aberta.
- [ ] Matriz de sistemas publicada com o escopo real, sem células vazias apresentadas como sucesso.
- [x] Links e distribuição conferidos; testes apropriados e verificador passando.
- [ ] Marketplace tratado separadamente: preparação, submissão e aprovação têm estados próprios.

## Verificação da entrega deste plano

Este plano e o mapa foram adicionados ao índice e à lista de distribuição. Os checkboxes concluídos indicam ações efetivamente executadas; aceites que dependem de observação no editor continuam separados. A validação da alteração documental deve rodar `npm test`, `npm run verify` e `git diff --check`. Os resultados executados estão no acompanhamento abaixo; caixas abertas preservam os aceites que ainda não foram integralmente observados.

## Acompanhamento da implantação — 2026-10-17

| Entrega | Estado | Evidência/limitação |
| --- | --- | --- |
| Tarefas 1–3 | Código e guias entregues | Instalador/ZIP, backup e rollback em testes; instalação real criou cópia 0.2.0 íntegra. Experiência completa no editor continua sendo outro aceite. |
| Tarefa 4 | Descoberta e origem local observadas no IDE | Nove habilidades, regra, versão, seleção de `/design`, arquivo de origem e resposta observados. |
| Tarefa 4A | Recuperação parcial | Sessão renovada e ativação da janela permitiram prompts e capturas reais; `-3811` e divergência de estado voltaram. Recuperação documentada, sem causa/correção definitiva comprovada. |
| Tarefa 5 | Prompts executados no IDE; conclusão por caso em Validação | S02 ajustou só o CSS; S04 manteve a base intacta; S03/S05/S06 concluíram revisão, evidências e handoff após retomadas por falha de conexão, sem novas mudanças de fonte. S06 preservou a espera pela escolha; checks indisponíveis continuam explícitos. Resultado S05 também observado no navegador independente, com capturas e teclado. |
| Tarefa 6 | Contrato/exemplo e retomada observados no IDE; orientação de raiz/revisão reforçada | S02 retestou commit/hash corretos com registros anteriores preservados. S09 detectou estilo alterado, preservou JSON/imagens históricos byte a byte e repetiu checks disponíveis; visuais atuais ficaram pendentes. Fontes intactas nos dois retestes. |
| Tarefa 7 | CI remoto aprovado nas seis combinações de SO/Node; ZIP/instalação/atualização/restauração também observados em PowerShell | Commit `ecac32b`, execução 39083379637 (registro histórico; endereço anterior omitido). Cursor gráfico no Windows/Linux ainda pendente. |
| Tarefa 8 | ZIP/checksum da candidata 0.2.0 gerados sobre commit limpo e verificados; dados de marketplace preparados | Sem publicação/submissão; prompts no IDE e resultados remotos permanecem separados do pacote local. |

Consulte [Validação](../runtime-validation.md) para resultados e próximos passos dos itens ainda abertos.
