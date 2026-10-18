# Preparação para o marketplace do Cursor

[English](../marketplace.md)

[Documentação](README.md) · [Releases](releasing.md) · [Validação](runtime-validation.md)

Estado: preparação local da candidata `0.1.0`. Este documento não registra submissão, aprovação ou uma listagem pública do Dev Design no marketplace.

## Dados do pacote

| Campo | Valor preparado |
| --- | --- |
| Apresentação | Dev Design |
| Identificador | `design` |
| Pacote npm | `dev-design` |
| Versão candidata | `0.1.0` |
| Repositório | [alty-oss/dev-design](https://github.com/alty-oss/dev-design) |
| Descrição | Fluxo de UI/UX para criar, melhorar e revisar interfaces no Cursor usando a stack e a identidade do projeto. |
| Componentes | Nove habilidades e regra `design-router`. |
| Entrada | `/design` |
| Licença | Apache-2.0, com [avisos de terceiros](../../THIRD_PARTY_NOTICES.md). |
| Dependências de uso | Node.js 22.14.0+ para instalador e auxiliares; sem dependências npm, MCP obrigatório ou serviços externos. |
| Distribuição alternativa | npm/npx e ZIP com checksum e instalador local. |

## Checklist de submissão

- [ ] Identificar o commit candidato e anexar os resultados de testes, integridade e ZIP extraído.
- [ ] Conferir o diagnóstico e a instalação a partir do ZIP candidato.
- [ ] Registrar S01–S06 e S09 no editor; separar os resultados e limites de navegador/teclado de S07–S08.
- [ ] Conferir nome/origem para evitar confusão com outra instalação `design`; registrar eventual conflito sem renomear interfaces automaticamente.
- [ ] Revisar metadados e os requisitos vigentes na [referência oficial de plugins](https://cursor.com/docs/reference/plugins).
- [ ] Com autorização para a submissão, enviar pelo canal indicado na [documentação de plugins](https://cursor.com/docs/plugins) e registrar data/status/retorno.
- [ ] Após aprovação, conferir a instalação da listagem em Customize e a origem de `/design`.
- [ ] Somente então incluir o link verificado da listagem no início rápido e registrar a aprovação no changelog.

As observações da CLI não encerram a descoberta no editor. Erros de captura ou automação externa continuam abertos até seus retestes, conforme [Validação](runtime-validation.md). Os documentos locais e o pacote candidato podem ser preparados antes da aprovação externa.
