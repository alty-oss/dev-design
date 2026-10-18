# Desenvolvimento

[English](../development.md)

[Documentação](README.md) · [Arquitetura](architecture.md) · [Contribuir](../../CONTRIBUTING.pt-BR.md) · [Releases](releasing.md)

## Preparar o ambiente

Use Node.js **22.14.0 ou superior**, Git e `unzip`. O projeto não possui dependências npm para instalar. Git e unzip também são usados pelos testes de empacotamento.

```sh
git clone https://github.com/alty-oss/dev-design.git
cd dev-design
npm test
npm run verify
```

O CI está configurado para Linux, macOS e Windows com Node.js 22 e 24. Essa matriz descreve a configuração; resultados observados e execuções ainda pendentes ficam no [registro de validação](runtime-validation.md). O teste de clone com `core.autocrlf=true` verifica terminações de linha; não substitui a execução de todos os testes em Windows.

O teste de encerramento do preview confirma que o processo termina e a porta HTTP deixa de responder em todos os sistemas. Em POSIX também exige saída graciosa com código zero. No Windows, `SIGTERM` encerra o processo abruptamente, sem executar o tratador de sinais POSIX.

## Verificações disponíveis

| Comando | Cobertura |
| --- | --- |
| `npm test` | Verificador, identidade, preview, PNG/JPEG, clone e empacotamento. |
| `npm pack --dry-run --json` | Inspeciona os arquivos npm sem publicar. |
| `npm run verify` | Nomes e metadados, versões, nove habilidades, links locais e hashes preservados. |
| `node --test tests/verify.test.mjs tests/identity.test.mjs` | Regras de integridade e identidade. |
| `node --test tests/install.test.mjs` | Instalador em destinos temporários, diagnóstico, backup e falhas. |
| `node --test tests/runtime.test.mjs` | Auxiliares com HTTP, arquivos e processos reais. |
| `node --test tests/package.test.mjs` | ZIP real, documentos distribuídos, checksum e extração. |

Rode a suíte completa e o verificador antes de publicar. Para alterações apenas de texto, confira os links e se a documentação continua disponível no pacote extraído. Uma mudança nos auxiliares ou no fluxo exige também as verificações pertinentes ao comportamento alterado.

## Atualizar documentação

- README: apresentação, início rápido e caminhos para os guias.
- `docs/`: instalação, uso, referência de arquitetura, manutenção e limitações.
- `references/` e `templates/`: contratos técnicos consumidos pelas habilidades.
- `skills/`: instruções operacionais, com nomes e frontmatter estáveis.
- `docs/plans/`: decisões e planos, separados dos guias atuais.

Use inglês nos documentos canônicos e mantenha versões em português brasileiro. Arquivos da raiz usam `*.pt-BR.md`; guias ficam em `docs/pt-BR/`; referências e templates têm árvores `pt-BR/`; habilidades usam `SKILL.pt-BR.md`, sem mudar os pontos de entrada. Acrescente links recíprocos de idioma e navegação na língua do leitor. Licenças, procedência e material de terceiros permanecem canônicos e inalterados. Escreva caminhos relativos em links e evite duplicar procedimentos: cada instrução detalhada deve ter uma fonte principal.

Se um documento passa a ser necessário para navegar a partir do README, inclua-o na lista `scripts/release-files.json` e na allowlist npm. O verificador do ZIP deve conseguir resolver seus links sem depender de arquivos exclusivos do clone.

## Auxiliares locais

Prefira o comando de preview documentado no projeto. Para HTML estático sem um comando existente:

```sh
node /caminho/absoluto/do/plugin/scripts/preview.mjs /caminho/absoluto/do/projeto
```

Registre a URL, raiz e PID informados pelo auxiliar. Encerre o processo da sua sessão com Ctrl-C quando terminar.

Para registrar uma captura existente e sem alterar seus bytes:

```sh
node /caminho/absoluto/do/plugin/scripts/record-capture.mjs /caminho/absoluto/do/projeto docs/design/exemplo/desktop.png \
  --revision 'commit real e hashes dos arquivos alterados' \
  --route / --state idle --viewport 1440x900 --kind viewport \
  --actor controller --tool 'ferramenta de captura utilizada'
```

Ambos aceitam `--help`. No Windows, use caminhos absolutos do sistema e coloque caminhos com espaços entre aspas. A continuação com `\` acima é um exemplo para shell POSIX; no PowerShell, coloque o comando em uma única linha.

O [contrato de validação](../../references/pt-BR/browser-validation.md) é a referência completa de flags, limites, procedência, teclado e estados.

## Conteúdo preservado e evidências

Não altere os arquivos em `vendor/frontend-design/` para contornar uma falha de hash. Os pins independentes do verificador, a licença e o registro de procedência precisam permanecer coerentes. Uma atualização real de conteúdo licenciado exige revisão explícita de origem, licença, bytes e avisos.

Não transforme uma verificação de arquivo em um resultado de UI. Registre revisões, ferramentas e limitações no [documento de validação](runtime-validation.md), mantendo observações antigas como histórico.

O ZIP com instalador permite `node scripts/install.mjs --help` e instalação local sem Git; a suíte de pacote exercita o instalador extraído. Isso não comprova descoberta no editor. Para validar conversas, use o [roteiro manual](cursor-smoke-test.md) e o [registro por execução](../../templates/pt-BR/cursor-validation.md) no projeto descartável.
