# Contribuir com o Dev Design

[English](CONTRIBUTING.md)

Obrigado por ajudar a melhorar o fluxo, os exemplos e a documentação.

## Reportar um problema

Abra uma [issue](https://github.com/alty-oss/dev-design/issues) com versão do plugin e do Cursor, sistema operacional, passos para reproduzir, resultado esperado e resultado observado. Se envolver o agente, informe o modelo e as ferramentas disponíveis. Use um exemplo mínimo com dados fictícios; remova credenciais e informações privadas de capturas e logs.

Diga quando uma checagem não pôde ser executada. Não apresente uma limitação de ferramenta como falha confirmada do plugin sem evidência que permita distinguir as causas.

## Propor mudanças

1. Leia [Arquitetura](docs/pt-BR/architecture.md) e [Desenvolvimento](docs/pt-BR/development.md).
2. Crie uma branch com uma mudança focada. Para trabalho maior, descreva primeiro o problema e a proposta em uma issue.
3. Preserve o identificador `design`, os nomes das habilidades e as interfaces dos auxiliares, salvo quando a mudança aprovada exigir migração.
4. Atualize o guia que corresponde à alteração e os testes pertinentes a comportamento novo ou corrigido.
5. Execute `npm test` e `npm run verify` antes de abrir o pull request.

No pull request, explique o problema, o resultado da alteração, como foi verificado e quais limitações permanecem. Para documentação, revise links, comandos e disponibilidade dos arquivos no ZIP e pacote npm.

## Convenções

- Nome público: **Dev Design**. Repositório, pacote npm e CLI: **dev-design**. Plugin e comando no editor: **design**.
- Inglês é o idioma canônico. Mantenha versões em português brasileiro, links recíprocos de idioma e navegação correspondente em documentos, referências, templates e habilidades.
- Documentos de usuário ficam em `docs/`; contratos das habilidades ficam em `references/` e `templates/`.
- Use recursos nativos do Node.js e mantenha o requisito Node.js 22.14.0 ou superior. Uma nova dependência precisa de justificativa na proposta.
- Preserve licenças, atribuições e os bytes do material de terceiros. Veja [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Registre evidências reais; não afirme testes visuais, teclado ou acessibilidade que não foram observados.

## Releases

Mantenedores seguem [Publicar uma versão](docs/pt-BR/releasing.md). Correções de uma versão pública são distribuídas em uma nova versão, mantendo as tags anteriores.
