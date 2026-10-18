# Piloto manual no Cursor

[English](../cursor-smoke-test.md)

[Documentação](README.md) · [Instalação](installation.md) · [Resultados observados](runtime-validation.md)

Este roteiro não registra execução. Copie o [modelo em branco](../../templates/pt-BR/cursor-validation.md) para `docs/design/formulario/cursor-validation.md` de um projeto descartável, fora da instalação do plugin. Registre data/hora reais, versões e revisões antes dos casos; não publique dados pessoais.

## Preparar uma base reproduzível

Crie uma pasta de teste fora de `plugins/local`, inicialize Git e prepare HTML/CSS/JavaScript ou a stack existente. Inclua formulário com nome e e-mail, botão de envio inicialmente desalinhado, tokens de cor/tipografia/espaçamento existentes e um modal com abertura, fechamento e retorno do foco. Use nome e e-mail fictícios explicitamente marcados como amostra. Inclua `sum(a, b)` que retorna a soma, sem UI.

Defina na fixture um atraso real e fixo de 1500 ms para envio e um controle de falha simulada identificado como amostra. Prepare os caminhos de validação, loading, erro, nova tentativa e sucesso para implementação/inspeção em S05. Não altere o tempo para conseguir capturas. Faça commit da base e registre o hash. Antes de cada cenário independente, restaure apenas os arquivos da fixture a essa base, preservando os registros fora dos arquivos restaurados. Registre commit e SHA-256 dos arquivos modificados em cada caso.

Use sessão nova para cada caso, exceto S09. S02–S06 partem da base restaurada; S07 usa o resultado S05. Registre separadamente revisão do plugin, origem instalada e revisão da fixture. Não execute reset destrutivo num projeto do usuário.

## Recuperar capacidades antes dos casos dependentes

Para cada AMB, registre sintoma histórico, reprodução atual, causa confirmada ou desconhecida, ação, versão, reteste, limitação e responsável/próxima ação. Faça uma reprodução inicial e no máximo um reteste após uma correção fundamentada; se persistir, preserve o erro e mantenha `pending`. Para calibração de captura e teclado, valem os limites específicos do [contrato de navegador](../../references/pt-BR/browser-validation.md).

| Item | Procedimento e aceite observável |
| --- | --- |
| AMB-01 · leitura desatualizada | Registre sistema, Cursor e ferramenta. Faça uma mudança simples, renove a leitura pelo mecanismo documentado e compare com a janela. Repita com segunda mudança. Ambas devem aparecer na leitura. Se o provedor continuar antigo, registre reprodução mínima; não invente uma causa histórica. |
| AMB-02 · identificadores | Selecione janela/painel e obtenha IDs de leitura atual. Execute a ação, mude a interface, leia novamente e repita com novos IDs. Se IDs recém-obtidos falharem, registre o erro do provedor; não adivinhe IDs. |
| AMB-03 · captura | Faça captura mínima e guarde o erro exato. Confira requisitos documentados, permissões e versões da ferramenta como hipóteses. Corrija somente a causa identificada; reautorize/reinicie componente apenas se o diagnóstico indicar. Reteste, confira dimensões e inspecione a imagem. Alternativa documentada pode liberar S07, mas não fecha a ocorrência original. |
| AMB-04 · CLI opcional | Identifique executável, `cursor-agent --version` e `cursor-agent status`. Se necessário, o titular conclui o login documentado. Faça chamada mínima de leitura na fixture e registre resposta/revisão, sem credenciais. Login humano pendente mantém este item aberto; não bloqueia o editor funcional. |

Se usar a opção documentada `cursor-agent --plugin-dir <caminho-do-plugin>` numa sessão CLI isolada, registre comando, origem e resposta como evidência de CLI. Não transforme esse resultado em descoberta ou execução no IDE. Depois de recuperar leitura/ações, repita S01; depois de recuperar captura/teclado, repita as capacidades afetadas de S07.

## Casos

Use `passed`, `failed` ou `pending` por caso e por capacidade. Algo não aplicável exige justificativa, sem aprovação global. Mera menção a uma habilidade não prova execução do fluxo.

| Caso | Prompt/ação exata | Aceite observável |
| --- | --- | --- |
| S01 · descoberta | Instale a candidata; execute Developer: Reload Window; abra Customize e confira origem. No projeto: `/design Corrija apenas o alinhamento deste botão. Preserve tipografia, cores e comportamento atuais. Registre o que conseguiu verificar.` | Origem/revisão pretendidas, nove habilidades e `design-router` visíveis; `/design` selecionável e resposta observada. Pasta ou instalador não encerram o caso. Registre origem concorrente e selecione a pretendida, sem remover terceiros. Política de imports bloqueados fica explícita. |
| S02 · ajuste | `/design Corrija apenas o alinhamento do botão de envio. Preserve tokens e comportamento.` | Mudança pequena, tokens/comportamento preservados, sem exigir brief completo/alternativas; revisão no projeto. |
| S03 · UI automática | `Melhore a hierarquia visual deste formulário preservando nossos tokens.` | Fluxo de UI observável nas ações/artefatos pertinentes, identidade preservada. |
| S04 · sem UI | `Explique a função sum(a, b), sem alterar arquivos.` | Explicação correta sem etapas ou artefatos de design, arquivos intactos. |
| S05 · funcionalidade | `/design Inclua validação, loading, erro com nova tentativa e sucesso; preserve os dados preenchidos e a identidade.` | Estados e recuperação implementados, dados preservados, tokens reutilizados, checks/limitações registrados. |
| S06 · redesign | `/design Proponha duas direções para este formulário. Aguarde minha escolha antes de aplicar uma nova direção.` Depois: `Escolho a primeira direção apresentada. Pode aplicá-la.` | Alternativas materiais, nenhuma nova direção aplicada antes da escolha; decisão/status/fonte registrados. |
| S07 · navegador/teclado | `Abra o preview do resultado S05. Observe os estados, capture 390×844 e 1440×900 e verifique Tab, Shift+Tab, Enter, Escape e foco do modal.` | URL/raiz/PID/dono reais, imagens íntegras e inspecionadas; foco, ativação e retorno observados. Separe resultados de DOM, captura e teclado. Calibre conforme contrato; mantenha indisponibilidades pendentes. |
| S08 · capacidade ausente | Em sessão separada com captura ou teclado realmente indisponível: `/design Revise este formulário com as ferramentas disponíveis e registre o que não conseguir verificar.` | Check afetado `pending`, motivo real, alternativa limitada se disponível, próxima ação e continuidade dos checks independentes. Não presuma erro histórico nem simule indisponibilidade como observação real. |
| S09 · retomada | Após S05/S07, altere um estilo e registre a nova revisão. Em nova sessão: `/design Retome docs/design/formulario e confira se as evidências ainda correspondem ao código atual.` | Decisões recuperadas, divergência detectada, captura/hash históricos preservados e checks afetados repetidos ou `pending` com motivo. Use o [exemplo de retomada](usage.md#retomar-com-evidências-antigas). |

Registre ação exata, horário, saída/evidência, revisão, limitação e próxima ação. Em falha, preserve reprodução mínima antes de corrigir; repita caso afetado e dependentes depois. Encerre apenas o preview iniciado pela execução. O registro detalhado pertence à fixture; o resumo público deve omitir dados privados e distinguir IDE, CLI e testes de código.
