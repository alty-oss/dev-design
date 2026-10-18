# Guia para agentes e colaboradores

[English](AGENTS.md)

Dev Design é um plugin de fluxo UI/UX para o Cursor, mantido em `alty-oss/dev-design`. O pacote npm é `dev-design`; o identificador do plugin permanece `design`; `/design` e os nomes das nove habilidades são interfaces existentes.

## Comece aqui

| Documento | Finalidade |
| --- | --- |
| [README](README.pt-BR.md) | Apresentação e início rápido |
| [Índice](docs/pt-BR/README.md) | Navegação dos guias |
| [Arquitetura](docs/pt-BR/architecture.md) | Componentes e limites |
| [Desenvolvimento](docs/pt-BR/development.md) | Ambiente, comandos e testes |
| [Contribuição](CONTRIBUTING.pt-BR.md) | Convenções e propostas |
| [Validação](docs/pt-BR/runtime-validation.md) | Evidências atuais e pendências |

## Trabalhar no código

- Respeite as instruções e o escopo definidos pelo usuário. Não transforme um ajuste de documentação em uma reformulação do fluxo.
- Use Node.js 22.14.0 ou superior e as APIs nativas existentes; não há dependências npm para instalar.
- Preserve as interfaces das habilidades e auxiliares, salvo quando a tarefa aprovada exigir alteração.
- Mantenha as versões de `package.json` e `.cursor-plugin/plugin.json` consistentes e os metadados no endereço canônico do repositório.
- Preserve os bytes do material em `vendor/frontend-design/`, as licenças, avisos e procedência. Não altere hashes para contornar falhas.
- Mantenha caminhos de máquina, backups, pesquisas e credenciais fora da distribuição.
- Ao adicionar um documento usado pelos guias, confira os links e a lista `scripts/release-files.json` para que a navegação funcione também no ZIP.
- Mantenha a documentação canônica em inglês e suas traduções `pt-BR`, com links recíprocos de idioma. Preserve material legal, de procedência e de terceiros.
- Escreva planos em `docs/plans/`, separados dos guias de uso. Registre somente evidências observadas; checks indisponíveis ficam pendentes.

## Verificar e entregar

```sh
npm test
npm run verify
```

Para gerar uma distribuição, siga [Releases](docs/pt-BR/releasing.md) sobre um commit limpo. Relate resultado, verificações executadas e limitações. Os artefatos produzidos pelo plugin no trabalho de um usuário pertencem ao projeto desse usuário, em `docs/design/<slug>/`, e não à instalação do plugin.
