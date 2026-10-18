# Solução de problemas

[English](../troubleshooting.md)

[Documentação](README.md) · [Instalação](installation.md) · [Validação](runtime-validation.md)

## O plugin não aparece

Confira se existe `.cursor-plugin/plugin.json` em `~/.cursor/plugins/local/design/`. Erros comuns são esquecer a pasta oculta ou deixar uma pasta extra, como `plugins/local/design/design/`.

Recarregue a janela e confira **Customize**. Se sua organização bloquear imports locais, a configuração depende do administrador; não contorne essa política. Os passos oficiais de descoberta estão na [documentação do Cursor](https://cursor.com/docs/plugins).

## `/design` carrega outra habilidade

Confira a origem mostrada pelo Cursor. Outra instalação com identificador `design`, especialmente uma instalação do marketplace, pode ter prioridade. Guarde backups fora de `plugins/local` e escolha a habilidade da instalação pretendida. Não exclua automaticamente plugins de terceiros para resolver o conflito.

## O checksum ou o verificador falhou

- **Checksum diferente:** baixe novamente ZIP e checksum da mesma release; não misture versões.
- **Versões divergentes:** substitua a instalação inteira, sem mesclar arquivos.
- **Integridade de terceiros ou da política:** restaure a cópia oficial. Não edite pins para aceitar bytes desconhecidos.
- **Referência quebrada:** confira se extraiu e copiou a pasta inteira, incluindo os documentos.
- **Clone modificado:** use uma cópia limpa da tag desejada. O repositório fixa LF para preservar os bytes de texto.

Ao reportar, inclua a mensagem exata e a versão. Não anexe credenciais, dados pessoais ou código privado.

## A instalação npm/npx falhou

Confira Node.js 22.14.0+ e npm/npx disponíveis. Confirme publicação de `dev-design` e da versão pedida; uma candidata de migração não torna o comando público. Separe falhas de registro/login/rede npm dos erros do instalador. A rota ZIP verificável continua disponível após sua publicação. Examine `--check` antes de escolher `--replace`.

## O preview não abre

Use primeiro o comando documentado no seu projeto. O auxiliar do plugin serve somente arquivos estáticos; não compila uma aplicação. Para usá-lo, forneça uma raiz existente e confira a URL `127.0.0.1` impressa pelo processo. Ele deve permanecer em execução durante a revisão.

Arquivos ocultos, caminhos fora da raiz e symlinks externos são recusados. Não amplie a raiz para incluir arquivos privados só para evitar uma recusa. Consulte [Desenvolvimento](development.md#auxiliares-locais) para os comandos.

## Não há capturas ou o teclado não funciona

Registre o check como pendente e o motivo observado. Se uma captura vier com dimensões erradas ou regiões repetidas, siga o limite de tentativas do [contrato de validação](../../references/pt-BR/browser-validation.md). Não recorte ou altere a imagem para aparentar um resultado válido.

O gravador de metadados não produz screenshots. Um evento de teclado sintético ou uma chamada de ferramenta sem mudança observada de foco não comprova navegação nativa.

## O empacotamento é recusado

Rode o comando em um clone do código com Git e unzip disponíveis. Um ZIP instalado é destinado ao uso do plugin e não contém os testes ou o construtor de releases. Faça commit das mudanças revisadas antes de empacotar; confira também versão, tag pretendida e lista de arquivos.

Para mais detalhes, veja [Releases](releasing.md). Para reportar um problema reproduzível, siga [Contribuir](../../CONTRIBUTING.pt-BR.md).

## O instalador falhou

- **Node ausente ou antigo:** confira `node --version` e instale Node.js 22.14.0+ pelo procedimento do seu sistema; depois repita na origem extraída.
- **Destino diferente:** examine `--check`, incluindo arquivos extras. Use `--replace` somente ao decidir substituir essa cópia; anote o backup retornado.
- **Permissão negada:** confira o acesso à origem e ao destino informado no erro. Corrija a permissão identificada antes de repetir; não execute com privilégios elevados por padrão.
- **Sobreposição ou symlink:** mantenha a origem fora do destino e use caminhos canônicos sem ancestrais symlink. Não contorne a recusa editando o instalador.
- **Instalou, mas Customize mostra outra origem:** confira o conflito conforme a seção de `/design` acima. Sucesso em disco não confirma a cópia carregada.

## Reproduzir bloqueios do ambiente

O [roteiro do Cursor](cursor-smoke-test.md) define AMB-01–AMB-04 e os retestes. Erros históricos precisam ser reproduzidos na versão atual antes de atribuir uma causa. Atualize a leitura da interface após cada mudança; IDs antigos não servem para a próxima ação. Para captura, registre o erro exato e investigue os requisitos da ferramenta antes de mudar permissões ou reiniciar componentes. Uma captura alternativa funcionando não encerra o problema original.

### Captura nativa intermitente e janela indisponível

No piloto em macOS, renovar a sessão de automação e ativar a janela pelo mecanismo documentado da ferramenta recuperou a digitação. Ativar a janela antes da captura também produziu imagens reais, mas `-3811` voltou em outra troca de conversa. Esse procedimento é uma recuperação observada, sem correção definitiva da causa.

1. Confira o aplicativo e o título da janela atual. Se o alvo ficou inválido, renove a sessão/seleção pelo mecanismo documentado da ferramenta.
2. Ative a janela pretendida antes de agir; obtenha uma leitura nova e use somente seus identificadores.
3. Após inserir o prompt, confira o texto efetivamente presente antes de enviar. Não repita a inserção quando a ação já ocorreu apesar de um erro na observação.
4. Capture a janela ativa e inspecione a imagem e suas dimensões. Uma imagem da janela inteira não comprova uma captura de viewport do produto.
5. Se o erro persistir no reteste limitado, guarde a reprodução e mantenha o check afetado pendente. Continue apenas as capacidades que permaneçam observáveis.

A Apple descreve [`internalError`](https://developer.apple.com/documentation/screencapturekit/scstreamerror/internalerror) como falha interna ao iniciar o stream; o código sozinho não identifica a causa. Há [relatos públicos de janelas inativas e Stage Manager](https://github.com/openai/codex/issues/38348), que servem como hipóteses de investigação. Não comprovam a causa deste ambiente nem justificam mudar permissões ou preferências automaticamente.

A CLI é opcional. Identifique sua versão com `cursor-agent --version` e o login com `cursor-agent status`; se exigir autenticação, o titular conclui o fluxo documentado. Não registre tokens ou cookies. Uma resposta da CLI não prova descoberta em Customize.
