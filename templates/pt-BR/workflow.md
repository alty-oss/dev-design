# Artefatos do fluxo

[English](../workflow.md)

Grave estes artefatos em docs/design/<slug>/ do repositório alterado. Slug: letras minúsculas, números e hífens. Ajustes pequenos podem usar somente review.md e evidence.json. Artefatos são contexto, não autorização automática. Siga o [contrato de navegador](../../references/pt-BR/browser-validation.md); validação operacional é o escopo atual de aceite, com revisão humana opcional.

## brief.md
Produto:
Público:
Tarefa principal:
Sucesso observável:
Conteúdo real e amostras identificadas:
Sistema de design existente:
Restrições do usuário:
Referências e fonte:
Suposições:
Decisões materiais abertas:

## direction.md
Status da decisão: proposed | approved | delegated
Fonte da decisão: mensagem/instrução que sustenta o status
Direção escolhida e motivo:
Alternativas e trade-offs para produto novo/redesign:
Cores: 4–6 hex nomeados
Fontes, papéis, fallback e escala:
Conceito de layout, alinhamento e wireframe ASCII:
Princípios distintivos:
Revisão de especificidade: escolha genérica encontrada, revisão e motivo
Identidade existente preservada:
Dependências de assets/fontes:

## flows.md
Fluxo principal: entrada → ação → feedback → sucesso → recuperação
Matriz de estados: componente | loading | empty | error | success | disabled
Toda célula não aplicável inclui motivo.
Ordem, foco e restauração por teclado:
Comportamento estreito e prioridade do conteúdo:
Propósito, variantes e API do componente:
Vocabulário de ações e microcopy:

## tokens.json
Use schemaVersion 1 e papéis semânticos. Este exemplo é um formato, não recomendação de paleta:
{"schemaVersion":1,"color":{"surface":"#FFFFFF","text":"#182026","action":"#005EA8","focus":"#005EA8"},"typography":{"body":{"family":"system-ui","size":"1rem","lineHeight":1.5}},"spacing":{"unit":"0.25rem"},"radius":{"control":"0.25rem"},"motion":{"duration":"120ms","reduced":"none"}}
Se houver token aplicável, use sua referência e registre onde é definido.

## review.md
Tarefa e escopo:
Revisão do projeto: raiz alterada | ator/ferramenta/comando | commit observado ou motivo de indisponibilidade | SHA-256 dos arquivos alterados
Resolva Git pelo diretório do código alterado, inclusive em projetos aninhados no workspace do editor. Use `git -C <raiz-do-projeto> rev-parse --show-toplevel` e `git -C <raiz-do-projeto> rev-parse HEAD`, ou ferramentas documentadas equivalentes. Repositório do plugin e diretório atual do shell não substituem o repositório alterado. Registre saída real. Se Git, permissão ou consulta do commit não estiverem disponíveis, indique a limitação específica e registre hashes; consulta em outro diretório não comprova ausência de commit.
Achados: id | severidade (blocker/major/minor) | critério | problema observado | evidência | reparo | status
Checks: ator/ferramenta | comando/ação | resultado real | recordedAt do relógio | limitação
Preview: comando real | raiz | URL | PID | dono | encerramento
Calibração de captura: viewport/pixel ratio solicitados | dimensões medidas | alternativa suportada tentada | inspeção
Calibração de teclado: ação nativa | mudança observável | uma alternativa nativa | limitação
Tempo: estado/condições observados | timeout limitado | capturas transitórias indisponíveis
Rodadas de reparo:
Pendências:
Sem acesso a navegador ou execução do check, ele DEVE permanecer pending. Nunca invente aprovação.

## evidence.json
Use este registro inicial; substitua pending somente após observar.
{"schemaVersion":1,"projectRevision":{"commit":null,"files":{}},"captures":[],"checks":[{"id":"visual","result":"pending","reason":"Ainda não observado"}]}
projectRevision.files mapeia caminhos relativos do projeto a SHA-256. Em árvore alterada, inclua hashes mesmo com commit presente.
Cada captura: file, sha256, format (png|jpeg), mime (image/png|image/jpeg), dimensions (width,height), revision (commit exato e hashes alterados, ou hash da fonte), route, viewport (width,height), state, kind (viewport|full-page|clip), clip (x,y,width,height ou nulo), actor, tool, capturedAt (ISO-8601 da procedência real ou nulo), captureProvenance (recibo/fonte ou nulo), recordedAt (relógio real do coletor), notes.
Use record-capture.mjs conforme contrato para validar metadados PNG/JPEG existentes e inalterados pelos bytes reais; dimensões corretas não comprovam inspeção nem detectam faixas repetidas. Clip é evidência regional. Preserve recibos brutos e registre inspeção visual separada. Após mudanças, preserve capturas brutas históricas/SHA-256. Use arquivos por revisão para manter metadados históricos. Explique obsolescência nas notas atuais; checks afetados voltam a pending. Adicione evidência da revisão atual. Não adicione enum stale.
Cada check: id, result (passed|failed|pending), reason, evidence (caminho ou ação registrada).
Use checks condicionais no tempo real do produto, sem alterar temporizadores. Afirmações de teclado exigem foco/ativação observados; eventos sintéticos são somente diagnóstico. Referencie somente arquivos existentes. Screenshot não comprova teclado.

## handoff.md
Resultado e telas afetadas:
Como executar/revisar:
Decisões e motivos:
Caminhos de evidência e revisão testada:
Checks efetivamente concluídos:
Defeitos e checks pendentes:
Dependências/riscos materiais:
Próxima ação para check não executado:

## Exemplo de evidência por revisão
Antes de editar A, preserve evidence.json como evidence-revision-a.json inalterado e desktop-a.png com SHA-256, capturedAt e procedência originais. Após mudar para B, crie evidence.json atual com schemaVersion 1 e commit/hashes de B. Nas notes ou review.md, explique: "desktop-a.png pertence à revisão A e não valida B." Não reescreva metadados históricos para B.

Check atual afetado, antes da nova observação:
```json
{"id":"visual","result":"pending","reason":"O formulário mudou após a captura histórica; A não valida B.","evidence":"review.md"}
```
Somente após observar B, adicione captura nova, hash/procedência reais e resultado atual. Preserve evidence-revision-a.json e imagem bruta; arquivos futuros seguem o mesmo padrão por revisão. Horário de captura desconhecido fica nulo; nunca invente timestamp. Veja o [fluxo de uso](../../docs/pt-BR/usage.md#retomar-com-evidências-antigas).
