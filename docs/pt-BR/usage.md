# Como usar

[English](../usage.md)

[Documentação](README.md) · [Instalação](installation.md) · [Validação](runtime-validation.md)

Use `/design` como entrada principal. Explique o trabalho, o que precisa ser preservado e os estados importantes. O agente deve inspecionar o projeto antes de escolher as etapas.

## Escolha o tamanho do fluxo

| Trabalho | Comportamento esperado |
| --- | --- |
| Ajuste pequeno | Preservar a direção existente, fazer a menor mudança justificada e registrar a revisão necessária. |
| Funcionalidade de interface | Entender o objetivo, reutilizar a identidade, definir estados e componentes e implementar. |
| Produto novo ou redesign | Preparar o brief, comparar direções visuais e resolver decisões materiais antes de implementar. |
| Tarefa sem UI | Seguir o trabalho normal, sem iniciar etapas de design desnecessárias. |

Quando uma decisão material estiver em aberto, o agente deve perguntar. Se você delegar escolhas, ele pode decidir e registrar essa delegação. Um arquivo criado não equivale à sua aprovação.

## Exemplos de pedidos

**Preservar um sistema existente**

> /design Melhore o checkout usando nossos tokens e componentes atuais. Inclua pagamento recusado, nova tentativa e sucesso. Preserve os dados preenchidos e revise a navegação por teclado.

**Criar uma tela nova**

> /design Crie uma página para inscrições em oficinas de leitura. O público inclui pessoas idosas. A ação principal é escolher uma oficina e registrar interesse. Use conteúdo fictício identificado como amostra; proponha a direção antes de implementar.

**Fazer um ajuste pequeno**

> /design Corrija apenas o alinhamento deste botão. Preserve tipografia, cores e comportamento atuais. Registre o que conseguiu verificar.

**Retomar trabalho**

> /design Continue usando os artefatos já salvos em docs/design/checkout. Confira se as decisões e evidências ainda correspondem ao código atual.

## As nove habilidades

| Habilidade | Responsabilidade |
| --- | --- |
| [`design`](../../skills/design/SKILL.pt-BR.md) | Classificar a tarefa e coordenar o fluxo. |
| [`design-brief`](../../skills/design-brief/SKILL.pt-BR.md) | Registrar público, tarefa principal, conteúdo e restrições. |
| [`art-direction`](../../skills/art-direction/SKILL.pt-BR.md) | Definir direção visual específica para o contexto. |
| [`interaction-design`](../../skills/interaction-design/SKILL.pt-BR.md) | Organizar fluxos, estados, foco e recuperação de falhas. |
| [`design-system`](../../skills/design-system/SKILL.pt-BR.md) | Definir ou reutilizar tokens e componentes. |
| [`ui-build`](../../skills/ui-build/SKILL.pt-BR.md) | Implementar na stack existente do projeto. |
| [`visual-review`](../../skills/visual-review/SKILL.pt-BR.md) | Inspecionar o resultado e registrar achados sustentados por evidências. |
| [`accessibility-review`](../../skills/accessibility-review/SKILL.pt-BR.md) | Revisar os aspectos de acessibilidade que as ferramentas permitem observar. |
| [`design-handoff`](../../skills/design-handoff/SKILL.pt-BR.md) | Entregar decisões, execução, evidências e pendências. |

A regra `design-router` orienta o agente a usar o fluxo em tarefas de interface. O comportamento depende do modelo e do host; confira os checks ainda pendentes no [registro de validação](runtime-validation.md).

## Arquivos produzidos no seu projeto

O contexto fica em `docs/design/<slug>/` do projeto que está sendo alterado, separado da instalação do plugin.

| Arquivo | Conteúdo |
| --- | --- |
| `brief.md` | Problema, público, tarefa, conteúdo e restrições. |
| `direction.md` | Direção escolhida, alternativas e status da decisão. |
| `flows.md` | Fluxos, estados, interações e foco. |
| `tokens.json` | Tokens semânticos ou referências ao sistema existente. |
| `review.md` | Achados, verificações, evidências e limitações. |
| `evidence.json` | Revisões, capturas e checks com sua procedência. |
| `handoff.md` | Resultado, como executar e próximos passos. |

Ajustes pequenos podem usar apenas `review.md` e `evidence.json`. Os [templates](../../templates/pt-BR/workflow.md) definem os detalhes. Após mudanças no código, evidências afetadas precisam ser reavaliadas; capturas antigas não comprovam o estado novo.

## Ferramentas e evidências

O plugin usa as capacidades disponíveis na sessão. Para HTML estático e registro de PNG/JPEG, veja [Desenvolvimento — auxiliares](development.md#auxiliares-locais) e o [contrato de validação](../../references/pt-BR/browser-validation.md).

Sem uma ferramenta de navegador ou teclado confiável, o agente deve registrar o check como pendente e continuar o trabalho independente. Metadados válidos de imagem não comprovam inspeção visual, e eventos sintéticos não comprovam navegação nativa por teclado.

## Retomar com evidências antigas

Mantenha `schemaVersion: 1` e os resultados `passed`, `failed` e `pending`. “Obsoleta” descreve a relação da evidência com a revisão atual; não é um novo valor de `result`.

1. Antes de alterar a revisão A, preserve o registro como `evidence-revision-a.json`, sem mudar seu conteúdo, e mantenha a captura bruta `desktop-a.png` e seu SHA-256.
2. Ao mudar o estilo na revisão B, crie o `evidence.json` atual com commit e hashes reais de B. Em `review.md` e nas `notes` pertinentes, explique que a captura de A ficou obsoleta para B. O arquivo histórico continua com sua revisão, hash, data e procedência originais.
3. No registro atual, volte o check afetado para `pending`, por exemplo `{"id":"visual","result":"pending","reason":"O formulário mudou após a captura anterior; a imagem histórica não valida a revisão atual.","evidence":"review.md"}`.
4. Repita os checks afetados. Se conseguir capturar B, use um novo arquivo e registre seu hash e tempo real; se não conseguir, mantenha a pendência e a próxima ação. Não reescreva o hash antigo nem invente `capturedAt` (use nulo quando desconhecido).

Os [templates do fluxo](../../templates/pt-BR/workflow.md) detalham o contrato. O caso S09 do [roteiro](cursor-smoke-test.md) verifica essa retomada numa sessão nova.
