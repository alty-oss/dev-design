# Arquitetura

[English](../architecture.md)

[Documentação](README.md) · [Desenvolvimento](development.md)

Dev Design é um pacote de instruções e auxiliares para o agente do Cursor. Não mantém um serviço de aplicação, conta própria ou backend. O trabalho e seus artefatos são produzidos dentro do repositório do usuário.

## Componentes e responsabilidades

| Componente | Localização | Responsabilidade |
| --- | --- | --- |
| Manifesto | `.cursor-plugin/plugin.json` | Identificar o plugin `design` e indicar habilidades e regras. |
| Roteamento | `rules/design-router.mdc` | Orientar a escolha do fluxo para trabalhos de interface. |
| Habilidades | `skills/<nome>/SKILL.md` | Instruções por etapa; `design` é a entrada principal. |
| Referências | `references/` | Contratos de ferramentas, revisão e procedência. |
| Templates | `templates/workflow.md` | Estrutura dos artefatos escritos no projeto do usuário. |
| Material de terceiros | `vendor/frontend-design/` | Orientação visual e licença preservadas, com hashes fixados. |
| Auxiliares | `scripts/preview.mjs`, `scripts/record-capture.mjs` | Preview estático local e metadados de uma captura já existente. |
| Verificação | `scripts/verify.mjs` | Identidade, versões, links, conjunto de habilidades e integridade. |
| Instalação | `bin/dev-design.mjs`, `scripts/install.mjs` | Conferir/copiar a lista distribuída, preparar a cópia fora de `plugins/local` e substituir com backup recuperável. Não comprova descoberta no editor. |
| Distribuição | `scripts/package.mjs`, `scripts/release-files.json` | Construir e validar o ZIP a partir de um commit limpo. Disponíveis no clone de código. |

## Fluxo de execução

1. O Cursor descobre o manifesto e seus componentes.
2. O usuário seleciona `/design`, ou o agente considera a regra para uma tarefa de UI.
3. A habilidade principal inspeciona o projeto e classifica a mudança.
4. As habilidades necessárias leem o contexto e os contratos de ferramentas.
5. O agente altera o projeto e grava decisões e evidências em `docs/design/<slug>/` desse projeto.
6. A revisão registra o que foi observado, os reparos e as limitações; o handoff explica como continuar.

As instruções guiam o modelo; não constituem um mecanismo determinístico de execução. A descoberta e o roteamento precisam de [validação no editor](runtime-validation.md).

## Limites de ferramentas

O preview atende somente uma raiz explícita em `127.0.0.1`, com uma porta escolhida pelo sistema. Não compila, instala dependências nem publica o projeto. A sessão deve encerrar apenas o processo que iniciou.

O registro de captura lê uma imagem PNG/JPEG existente, valida estrutura e dimensões e calcula SHA-256. Não gera imagens, altera bytes ou certifica qualidade visual. Os detalhes estão no [contrato de validação](../../references/pt-BR/browser-validation.md).

## Código e pacote instalado

O clone contém testes, workflows e ferramentas de release. O ZIP contém apenas a lista explícita de arquivos distribuíveis, com uma raiz `design/`. Documentos necessários à navegação acompanham o ZIP; arquivos de pesquisa, backups e Git ficam fora dele.

A validação compara arquivos extraídos com o commit e executa novamente o verificador. O material de terceiros e sua procedência seguem os [avisos de terceiros](../../THIRD_PARTY_NOTICES.md); a mudança de apresentação não altera essa origem.

O executável npm `dev-design` usa o mesmo instalador do ZIP, com a lista de arquivos que pode copiar; o plugin instalado continua em `plugins/local/design`. npm/npx obtém o pacote antes de invocar o instalador. A preparação fica em `~/.cursor/plugins-staging/`, e os backups em `~/.cursor/plugins-backups/`; somente uma cópia verificada é promovida a `plugins/local/design`. O instalador não baixa arquivos, inicia o editor ou altera permissões do sistema. Veja [Instalação](installation.md) para conferir a versão, atualizar e retornar ao backup.
