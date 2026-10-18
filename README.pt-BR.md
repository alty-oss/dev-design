# Dev Design

[English](README.md)

Um fluxo de UI/UX para o Cursor: transforme um pedido de interface em decisões claras, componentes consistentes e uma implementação revisada.

[![Checks](https://github.com/alty-oss/dev-design/actions/workflows/ci.yml/badge.svg)](https://github.com/alty-oss/dev-design/actions/workflows/ci.yml)

[Instalar](docs/pt-BR/installation.md) · [Como usar](docs/pt-BR/usage.md) · [Documentação](docs/pt-BR/README.md) · [Contribuir](CONTRIBUTING.pt-BR.md) · [Downloads](https://github.com/alty-oss/dev-design/releases)

## O que você pode fazer

- Criar telas a partir de um brief, com direção visual, fluxos e estados definidos.
- Melhorar interfaces existentes preservando os tokens, componentes e identidade do projeto.
- Revisar responsividade, interação e acessibilidade com evidências dos checks executados.
- Entregar decisões, limitações e próximos passos em arquivos dentro do seu projeto.

O fluxo combina **nove habilidades** e uma regra de roteamento. Ajustes pequenos usam apenas as etapas necessárias; tarefas sem relação com interfaces seguem normalmente.

## Comece aqui

Após a publicação no npm, com Node.js **22.14.0 ou superior**, instale com:

```sh
npx dev-design
```

Para fixar a versão, use `npx dev-design@0.1.0`. Confira `npx dev-design --check` antes de atualizar com `--replace`, que preserva backup.

A rota verificável continua disponível: baixe ZIP e checksum da mesma versão em [Releases](https://github.com/alty-oss/dev-design/releases), confira SHA-256, extraia a pasta `design` e execute nela:

```sh
node scripts/install.mjs
```

A migração prepara a versão **0.1.0** no repositório Alty; confirme a publicação do pacote, tag e release antes de usar os comandos e downloads públicos. Os registros anteriores de validação são históricos e anteriores à migração.

Depois, execute **Developer: Reload Window**, abra **Customize**, confira a origem do plugin, suas nove habilidades e `design-router`, e selecione `/design` no seu projeto:

> /design Corrija apenas o alinhamento deste botão. Preserve tipografia, cores e comportamento atuais. Registre o que conseguiu verificar.

**Requisitos:** Cursor com plugins locais permitidos; Node.js **22.14.0 ou superior** para o instalador e auxiliares. Não há dependências npm para instalar. Integridade da pasta, descoberta no editor e execução de `/design` são confirmações distintas. Veja [Instalação](docs/pt-BR/installation.md) para npm, ZIP, clone, atualização e retorno.

## Como funciona

Brief → direção visual → interações e estados → tokens e componentes → implementação → revisão → entrega.

O agente usa a stack existente e registra o contexto em `docs/design/<slug>/` **do seu projeto**. A [visão do fluxo](docs/pt-BR/usage.md) explica quando cada habilidade entra e quais arquivos ela produz.

| Nome | Onde aparece |
| --- | --- |
| **Dev Design** | Apresentação do projeto |
| `dev-design` | Repositório no GitHub, pacote npm e comando no terminal |
| `design` | Identificador do plugin, pasta instalada e habilidade `/design` |

## Documentação

| Você quer… | Leia |
| --- | --- |
| Instalar, atualizar ou remover | [Instalação](docs/pt-BR/installation.md) |
| Escolher um fluxo e escrever um pedido | [Como usar](docs/pt-BR/usage.md) |
| Resolver problemas de descoberta ou ferramentas | [Solução de problemas](docs/pt-BR/troubleshooting.md) |
| Entender a estrutura e os limites do plugin | [Arquitetura](docs/pt-BR/architecture.md) |
| Alterar e testar o código | [Desenvolvimento](docs/pt-BR/development.md) |
| Gerar e publicar uma versão | [Releases](docs/pt-BR/releasing.md) |
| Conferir evidências e limitações atuais | [Validação](docs/pt-BR/runtime-validation.md) |

## Estado do projeto

O projeto está em evolução. Os testes de código, integridade e distribuição são automatizados. A descoberta e a execução do fluxo no editor ainda têm checks pendentes, documentados em [Validação](docs/pt-BR/runtime-validation.md). A qualidade do resultado depende do modelo e das ferramentas disponíveis; o fluxo não certifica conformidade completa de acessibilidade.

## Contribuir e licença

Veja [CONTRIBUTING.md](CONTRIBUTING.pt-BR.md). Para agentes trabalhando no código, comece por [AGENTS.md](AGENTS.pt-BR.md).

Distribuído sob [Apache-2.0](LICENSE), com [avisos de terceiros](THIRD_PARTY_NOTICES.md) e registros de origem preservados. Consulte o [changelog](CHANGELOG.pt-BR.md) para as mudanças de cada versão.
