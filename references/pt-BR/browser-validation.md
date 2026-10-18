# Contrato de validação de navegador

[English](../browser-validation.md)

Use somente ferramentas documentadas expostas pelo host atual. Registre ator, host/ferramenta/API, revisão exata testada (commit e SHA-256 dos arquivos modificados), ações reais, resultados observados e limitações. Ativação de habilidade, nome de ferramenta ou sucesso de auxiliar de metadados não aprova UI. Preserve produto, stack, conteúdo, tempo e escopo definidos pelo usuário. Revisão humana é opcional; checks operacionais automatizados são o escopo atual de aceite local, sem representar benchmark estético ou auditoria WCAG completa.

## Preview e propriedade

1. Inspecione o comando de preview documentado no projeto. Se existir e estiver autorizado, execute exatamente esse comando e registre URL real e propriedade do processo.
2. Para HTML estático com assets locais e sem comando documentado, o plugin oferece fallback explícito: `node <caminho-absoluto-do-plugin>/scripts/preview.mjs <raiz-absoluta-do-projeto>`. Resolva o plugin pelo local da habilidade carregada e use a raiz real. Esse preview estático local é limitado; não compila aplicações nem executa comandos arbitrários do projeto.
3. O auxiliar escuta somente em `127.0.0.1`, pede porta livre ao sistema e imprime JSON `{url,root,pid}`. Use essa URL real. Mantenha o terminal ativo durante a revisão; registre comando, raiz, URL, PID e dono. Se `file://` estiver bloqueado, tente esse fallback uma vez e continue. Se falhar, registre erro concreto e checks dependentes pending; não tente servidores especulativos em sequência.
4. Encerre somente o processo iniciado pela sessão, com Ctrl-C ou SIGTERM. Preview compartilhado existente permanece do dono original. O auxiliar serve GET/HEAD, index.html e assets locais; rejeita arquivos ocultos, traversal e caminhos/symlinks fora da raiz explícita. Raiz ausente/inválida falha; não há fallback de raiz, instalação, daemon, abertura de navegador ou exposição pública. Use raiz descartável/estática adequada à revisão.

## Calibração e integridade de screenshots

Defina e registre viewport CSS solicitado, pixel ratio e rota/estado reais. Calibre dimensões uma vez inspecionando a imagem inalterada da ferramenta e sua largura/altura PNG/JPEG medidas. Captura de janela pode conter chrome do navegador e diferir da viewport emulada; não a reclassifique como evidência de viewport. Se houver dimensões erradas, faixas repetidas ou regiões ausentes, tente uma alternativa documentada e suportada. Se também falhar ou não existir, captura fica unsupported/pending; continue DOM, semântica e interação funcionais. Não extraia logs brutos, conecte CDP não documentado, repare imagens ou recorte para esconder artefatos. Clip declarado explicitamente pela ferramenta é permitido e valida somente aquela região, nunca a viewport inteira.

Inspecione imagens reais quanto a layout/artefatos. O gravador detecta PNG/JPEG pelos bytes, mede dimensões codificadas por cabeçalhos/chunks PNG ou marcadores SOF JPEG e calcula hash original; não renderiza/decodifica pixels, detecta faixas repetidas, certifica viewport real nem qualidade visual. Dimensões correspondentes validam somente metadados. PNG/JPEG estruturalmente legível ainda pode ter pixels inválidos. PNG mantém validação estrita de chunks/CRC; JPEG verifica limites de segmentos, cabeçalhos de quadro/scan e marcador final sem decodificar pixels comprimidos. Extensão não é confiável e não ocorre conversão. Registre inspeção visual separadamente, com observador/ação reais e resultado.

Registre PNG/JPEG existente e inalterado com:

```sh
node /caminho/absoluto/plugin/scripts/record-capture.mjs /caminho/absoluto/projeto docs/design/exemplo/desktop.png \
  --revision 'COMMIT e hashes dos arquivos modificados, ou SHA-256 explícito da fonte' \
  --route / --state idle --viewport 1440x900 --kind viewport \
  --actor controller --tool 'API de screenshot documentada'
```

`--help` lista todas as flags. `--kind` aceita `viewport` (padrão), `full-page` ou `clip`; `--clip X,Y,WIDTH,HEIGHT` é obrigatório para clip. Dimensões PNG/JPEG devem corresponder à viewport nas capturas viewport. Full-page exige largura igual à viewport e altura pelo menos igual. Clip deve corresponder à largura/altura declaradas. O auxiliar suporta pixel ratio 1; caso contrário, obtenha captura suportada com ratio 1 ou registre check de dimensões indisponível. Divergências geram erro e não são evidência visual aceitável. `recordCapture(options)` exporta o mesmo comportamento para Node; root/file/revision/route/state/viewport/actor/tool são obrigatórios, kind tem padrão viewport.

A CLI emite um registro JSON para o array captures do evidence.json existente, sem editar imagens/evidências. Registra `file`, `sha256`, `dimensions`, `format` (`png`/`jpeg`), `mime` (`image/png`/`image/jpeg`), `revision`, `route`, `state`, `viewport`, `kind`, `clip`, `actor`, `tool`, `capturedAt`, `captureProvenance`, `recordedAt`. Usa relógio real para `recordedAt`. `capturedAt` e `captureProvenance` ficam nulos sem timestamp real da captura e recibo/fonte fornecidos por `--captured-at ISO-com-fuso --capture-provenance 'recibo/fonte'`. Palpite do modelo, horário do shell após captura ou mtime não são procedência. O auxiliar verifica sintaxe, não veracidade da procedência informada. Preserve recibos brutos disponíveis. Revisões fornecidas pelo chamador devem ser conferidas independentemente contra os bytes testados.

## Interação nativa e tempo real dos estados

Renove estado acessível/DOM após cada ação ou mudança de janela/painel antes de escolher outro elemento. IDs anteriores podem apontar a outro controle. Se estado acessível e screenshot divergirem, selecione novamente o alvo real por método documentado e peça uma observação completa nova. Divergência persistente mantém checks afetados pending; não adivinhe IDs nem trate chamada bem-sucedida como prova de mudança. Respeite limite de capturas acima.

Antes de afirmar teclado, envie input nativo suportado e confira mudança de foco/ativação observável (Tab muda elemento ativo; Escape fecha modal e restaura foco). API `press_key` sem mudança não basta. Tente uma alternativa nativa documentada, se disponível. Se nenhuma funcionar, teclado fica unsupported/pending. `dispatchEvent`, `.focus()` por script e eventos sintéticos são diagnósticos, nunca evidência confiável de teclado. Modal aberto por clique pode ter evidência separada de clique.

Exercite validação, loading, erro/retry/sucesso e disabled reais. Use checks condicionais sobre DOM real com timeouts limitados. Preserve o tempo do produto; nunca altere temporizadores ou prolongue loading só para screenshot. Captura transitória indisponível fica pending enquanto DOM, disabled nativo e resposta observados são registrados separadamente. Não converta inspeção DOM em aprovação de screenshot.

Para contraste em fundos sólidos, calcule razão das cores computadas reais, considerando opacidade, herança e composição. Amostragem de pixels é necessária somente quando fundos complexos impedem cálculo adequado. Registre método, cores, razão, escopo e limiar aplicável. Esse check não estabelece conformidade completa WCAG ou leitor de tela.

## Revisão e limite de reparos

Após mudanças, evidências afetadas ficam obsoletas. Preserve arquivos/observações históricos; adicione revisão atual e novos checks/capturas. Não reescreva hashes antigos para sugerir nova validação. Use duas rodadas de reparo por padrão; após tentativas limitadas, relate defeitos/checks indisponíveis com próximos passos reproduzíveis. Continue checks independentes e entrega sem esperar revisores humanos opcionais. Respeite aprovações explícitas para decisões materiais de produto.
