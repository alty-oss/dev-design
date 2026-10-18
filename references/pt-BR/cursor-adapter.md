# Adaptador do Cursor

[English](../cursor-adapter.md)
Inspecione as capacidades realmente expostas pela sessão antes de planejar chamadas. Use o [contrato de validação de navegador](browser-validation.md) para preview, calibração de captura, teclado nativo, tempo dos estados e integridade de evidências.
- Contexto do repositório: busca/leitura, manifestos, componentes, tokens e estilos.
- Implementação: edições normais usando a stack e os checks existentes do projeto.
- Preview: use o comando documentado no projeto. Para HTML estático sem um comando, o fallback explícito `node <caminho-absoluto-do-plugin>/scripts/preview.mjs <raiz-do-projeto>` é permitido. Resolva o caminho pelo local da habilidade carregada. Se file:// estiver bloqueado, tente loopback uma vez, registre comando/URL/raiz/PID/dono reais e encerre apenas o processo desta sessão.
- Inspeção visual: inspecione imagens inalteradas com ferramentas documentadas. Calibre uma vez; tente uma alternativa suportada se a captura falhar, depois registre indisponibilidade e continue outros checks. Não use CDP/logs não documentados nem repare screenshots.
- Interação: calibre teclado nativo com mudança observável de foco/ativação. Uma alternativa nativa documentada é permitida; eventos sintéticos e foco via script não comprovam comportamento de teclado confiável.
- Estado da UI: obtenha observação atual após cada ação ou mudança de janela/painel antes de usar identificadores. Use somente IDs dessa observação. Se acessibilidade e screenshot inalterada divergirem, selecione novamente o alvo por um mecanismo documentado e obtenha uma observação completa nova; se persistir, mantenha checks afetados de automação/captura pendentes, sem adivinhar IDs ou declarar sucesso.
- Estados: observe tempo real e condições DOM sem alterar temporizadores. Registre capturas transitórias indisponíveis separadamente do comportamento observado.
- Assets: priorize assets existentes, licenciados e locais; instale/baixe somente com autorização. Não exija silenciosamente serviço de fontes ou gerador de imagens.
- Revisão: inline por padrão. Revisores opcionais separados recebem brief, decisões, caminhos e evidências; permanecem somente leitura. Revisão humana não é requisito para aceite operacional local.
- Ferramenta ausente: check correspondente pendente, com motivo e próxima ação reproduzível. Nunca fabrique resultados.
- Operação negada: respeite a recusa; não repita por outro agente/interface para contorná-la. Registre hashes/comandos indisponíveis como pendentes e continue trabalho independente. Autenticação da CLI e aprovação de comandos são capacidades separadas; login não comprova shell disponível.
- Evidência: ator/ferramenta, revisão/hashes, procedência de capturedAt ou nulo e recordedAt real; evidências afetadas ficam obsoletas após mudanças. Metadados válidos não são inspeção visual.
- Caminhos: resolva referências pelo local da habilidade/plugin; escreva entregáveis no repositório do usuário, não na instalação.
Use somente capacidades expostas pelo host atual. Resolva habilidades, arquivos e scripts do plugin pelos caminhos instalados.
