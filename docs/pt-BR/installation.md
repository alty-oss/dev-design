# Instalação

[English](../installation.md)

[Documentação](README.md) · [Como usar](usage.md) · [Solução de problemas](troubleshooting.md)

## Requisitos e nomes

- Cursor com suporte a plugins locais e imports locais permitidos pela organização.
- Node.js **22.14.0 ou superior** para instalador, preview, registro de capturas e verificações do código. A descoberta das instruções pelo Cursor é separada.
- npm/npx para instalação npm; Git somente se escolher a rota de clone.

Repositório, pacote npm e executável são **dev-design**. Identificador do plugin e pasta instalada continuam **design**:

```text
~/.cursor/plugins/local/design/
  .cursor-plugin/plugin.json
  skills/
  rules/
  references/
  scripts/
```

A migração prepara a versão Alty `0.1.0`; confirme publicação no npm ou em [Releases](https://github.com/alty-oss/dev-design/releases) antes de usar comandos/downloads públicos. Validações anteriores não comprovam disponibilidade no repositório novo.

## Caminho recomendado — npm/npx

```sh
npx dev-design
```

Fixe uma versão com `npx dev-design@0.1.0` para reprodução. npm obtém o pacote e executa `dev-design`. O instalador compartilhado valida a origem e copia somente arquivos aprovados para `~/.cursor/plugins/local/design`.

| Comando npm | Efeito |
| --- | --- |
| `npx dev-design --help` | Exibe a interface. |
| `npx dev-design --check` | Diagnóstico sem escrita. |
| `npx dev-design --dry-run` | Inspeção e próximos passos sem escrita. |
| `npx dev-design` | Instala se ausente; reconhece cópia idêntica. |
| `npx dev-design --replace` | Substitui destino diferente após backup completo. |

Depois recarregue o Cursor e faça a confirmação em Customize abaixo. O instalador não abre navegador nem reinicia o editor.

## Rota verificável — ZIP + SHA-256

Baixe `design-0.1.0.zip` e `design-0.1.0.zip.sha256` da mesma [release](https://github.com/alty-oss/dev-design/releases). Use os nomes exatos e confira antes de extrair/instalar. Verificar a pasta não substitui o checksum do ZIP.

### macOS e Linux

Na pasta do download:

```sh
# macOS
shasum -a 256 -c design-0.1.0.zip.sha256
# Linux
sha256sum -c design-0.1.0.zip.sha256
```

Após resultado válido, extraia em pasta vazia fora de `plugins/local`, entre em `design` e instale:

```sh
unzip design-0.1.0.zip -d dev-design-download
cd dev-design-download/design
node scripts/install.mjs
```

### Windows — PowerShell

```powershell
$expected = ((Get-Content .\design-0.1.0.zip.sha256).Trim() -split '\s+')[0]
$actual = (Get-FileHash .\design-0.1.0.zip -Algorithm SHA256).Hash
if ($actual -ine $expected) { throw 'Checksum diferente. Baixe o arquivo novamente.' }
Expand-Archive .\design-0.1.0.zip -DestinationPath .\dev-design-download
Set-Location .\dev-design-download\design
node scripts/install.mjs
```

A origem extraída aceita as mesmas opções: `node scripts/install.mjs --help`, `--check`, `--dry-run` e `--replace`. Ambas as rotas emitem JSON e erros com código diferente de zero. O diagnóstico informa `status` (`missing`, `matching`, `different` ou `invalid`), versões, `differences` com caminhos relativos e `nextSteps`. A instalação informa `installed`, `updated` ou `already-installed`, versão e `backupPath` (nulo sem backup). Arquivos extras tornam o destino diferente; sem `--replace`, ele é preservado.

Backup: `~/.cursor/plugins-backups/<nome-único>/design`, fora das cópias descobertas; staging: `~/.cursor/plugins-staging/`. Sobreposição, symlinks e ancestrais symlink são recusados. Se a origem foi aberta por alias, use o caminho canônico real, sem desativar a proteção.

### Alternativa de cópia manual

Após conferir SHA-256, veja se o destino existe. Guarde instalação anterior inteira **fora de `plugins/local`** e retire-a desse diretório. Copie a pasta inteira `design`, incluindo `.cursor-plugin`, para `~/.cursor/plugins/local/design`. Não mescle versões. Se o checksum falhar, baixe novamente os dois arquivos da mesma release.

## Alternativa — clone com versão fixa

O destino deve estar livre. Após confirmar que a tag existe, fixe-a para reprodução/retorno.

macOS/Linux:

```sh
mkdir -p "$HOME/.cursor/plugins/local"
git clone --branch v0.1.0 --depth 1 https://github.com/alty-oss/dev-design.git "$HOME/.cursor/plugins/local/design"
```

PowerShell:

```powershell
$pluginRoot = Join-Path $HOME '.cursor\plugins\local'
New-Item -ItemType Directory -Force $pluginRoot | Out-Null
git clone --branch v0.1.0 --depth 1 https://github.com/alty-oss/dev-design.git (Join-Path $pluginRoot 'design')
```

`detached HEAD` é esperado ao usar uma tag. A regra de terminações de linha preserva os bytes necessários à integridade.

## Ativar e confirmar

1. Reinicie o Cursor ou execute **Developer: Reload Window**.
2. Abra **Customize** e localize `design`.
3. Confira nove habilidades e `design-router`.
4. No projeto, procure `/design` e confirme sua origem antes de selecionar.

A descoberta local segue a [documentação do Cursor](https://cursor.com/docs/plugins). Uma instalação de marketplace com mesmo identificador pode ter prioridade. Symlinks com destino fora de `plugins/local` não substituem cópia completa.

Se não aparecer, siga [Solução de problemas](troubleshooting.md). Confirmação em disco não comprova descoberta.

## Atualizar, voltar e remover

Para npm, examine `npx dev-design@<versão> --check` e use `npx dev-design@<versão> --replace` na versão publicada escolhida. Para ZIP, baixe a versão, confira checksum e extraia fora da instalação. Execute `node scripts/install.mjs --check` na origem nova, revise diferenças e use `--replace`. Guarde `backupPath`. Falhas tentam restaurar a cópia anterior; leia o erro e confira destino antes de repetir.

Na rota manual, confira o checksum novo, guarde instalação anterior fora de `plugins/local`, substitua a pasta inteira e recarregue. Para clone, use a tag desejada.

Para voltar, use o caminho exato do backup: retire a cópia atual de `plugins/local`, restaure o backup completo e recarregue. Não altere arquivos de uma versão para passar no verificador de outra.

Para remover, mova `~/.cursor/plugins/local/design` para fora de `plugins/local` e recarregue. Artefatos `docs/design/` dos seus projetos permanecem disponíveis.
