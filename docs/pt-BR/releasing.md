# Publicar uma versão

[English](../releasing.md)

[Documentação](README.md) · [Desenvolvimento](development.md) · [Validação](runtime-validation.md)

Guia para mantenedores de `alty-oss/dev-design`. Pacote/executável npm: `dev-design`; plugin: `design`. Artefatos verificáveis: `design-<versão>.zip` e `design-<versão>.zip.sha256`.

## Preparar

1. Atualize `package.json` e `.cursor-plugin/plugin.json` para o mesmo SemVer.
2. Atualize changelog nos dois idiomas, notas de release, exemplos de download/instalação e validação. Preserve resultados históricos.
3. Confira allowlists ZIP/npm: todos os arquivos necessários, sem caminhos de máquina, credenciais, testes ou workflows.
4. Rode `npm test`, `npm run verify` e `npm pack --dry-run --json`; revise conteúdo npm exato.
5. Revise diff e faça commit. ZIP exige árvore limpa, inclusive sem novos arquivos não ignorados.

Repositório/manifesto devem apontar para `https://github.com/alty-oss/dev-design`. Conteúdo de terceiros e avisos acompanham ambas as distribuições. Navegação inglês/português deve funcionar nos pacotes extraídos.

## Gerar e inspecionar localmente

Com Git, unzip e Node.js 22.14.0+:

```sh
node scripts/package.mjs --output ../dev-design-artifacts --tag v0.1.0
npm pack --dry-run --json
```

O ZIP usa `git archive` no commit atual, raiz `design/` e lista explícita. Extrai, confere a lista, roda verificador e compara bytes com a fonte antes de gravar ZIP/checksum. `--tag` deve concordar com a versão; valida o nome sem criar tag.

Inspecione tarball real de `npm pack` e rode CLI com home/cache descartáveis antes de publicar. Executável npm e `node scripts/install.mjs` compartilham comportamento. Árvore alterada, divergência de versão, arquivo ausente, entrada insegura, link quebrado ou hash diferente precisam de correção na fonte. Não edite ZIP/checksum para esconder falha.

## Primeira publicação npm e publicação confiável

A primeira release pública npm exige mantenedor autorizado e fluxo de login/2FA da conta. Confirme disponibilidade do nome para essa conta antes de publicar o tarball revisado como `dev-design@0.1.0` público.

Após publicar, configure trusted publisher GitHub para pacote `dev-design`, proprietário `alty-oss`, repositório `dev-design` e workflow `release.yml`. Com CLI compatível:

```sh
npm trust github dev-design --repo alty-oss/dev-design --file release.yml --allow-publish
```

Use as configurações npm se a preparação exigir interação. Exija publicação por 2FA/OIDC conforme suporte da conta/pacote; não adicione token npm ao repositório. Publicação confiável usa OIDC GitHub e runner hospedado GitHub com `id-token: write`. Confira requisitos atuais de CLI/runtime na [orientação npm](https://docs.npmjs.com/trusted-publishers/). Verifique configuração/procedência após primeira publicação automatizada; até observação, mantenha pendente.

## Publicar no GitHub e npm

Envie `main`, confira **Checks**, depois crie/envie tag aprovada:

```sh
git push origin main
git tag -a v0.1.0 -m 'Dev Design 0.1.0'
git push origin v0.1.0
```

**Release** usa Node.js 24 hospedado GitHub, roda testes, verificação e empacotamento, e publica no npm via trusted publishing somente se a versão exata não existir. Falha de registro/autenticação é erro, não ausência da versão. A versão inicial pode já existir; o workflow ainda gera ZIP/checksum GitHub.

O título usa major/minor quando patch é zero: `v0.1.0` gera **Dev Design v0.1**, mantendo `0.1.0` nos metadados/ZIP. O job precisa de `contents: write` para anexos e `id-token: write` para OIDC. Confira [Actions](https://github.com/alty-oss/dev-design/actions), [Releases](https://github.com/alty-oss/dev-design/releases) e npm. Publicação GitHub/npm não submete ao marketplace Cursor.

## Validar downloads públicos

1. Baixe ZIP/checksum da mesma release sem autenticação.
2. Confira SHA-256 pelo [procedimento de instalação](installation.md).
3. Extraia em pasta vazia e rode `node scripts/verify.mjs` em `design`.
4. Compare lista/bytes extraídos com a fonte publicada.
5. Inspecione metadados, versão, conteúdo tarball e procedência npm. Com home descartável, execute comando publicado fixado e `--check`.
6. Na instalação de teste, confirme descoberta/execução no Cursor. Checks indisponíveis continuam pendentes.

Compressão ZIP pode variar entre ferramentas. Checksum comprova o artefato baixado; comparação extraída comprova conteúdo.

## Falhas e versões anteriores

Consulte primeiro passo com erro. Antes de publicação/tag, corrija commit e repita. Depois de versão pública, publique correção em versão nova; não substitua anexos nem mova tags silenciosamente.

Após interrupção parcial, confira estado e complete anexos verificados da mesma versão sem sobrescrever os públicos existentes. Versões npm são imutáveis; não republique versão existente. Para problemas no produto, ofereça versão anterior e publique correção com changelog.

## Condição para migração de repositório

Exporte arquivos rastreados e revisados para histórico novo `main` em `alty-oss/dev-design`, excluindo `.git` anterior e artefatos privados/ignorados. Não atribua CI/releases anteriores ao repositório novo. Exclua o repositório pessoal somente após sucesso registrado do repositório Alty, pacote npm público, release ZIP/checksum e verificações de instalação.
