---
name: ui-build
description: Use ao implementar UI a partir de brief, direção visual e contrato de interação estabelecidos.
---
# Implementação de UI

[English](SKILL.md)
Leia brief/direction/flows/tokens atuais pertinentes e os contratos de [adaptador do Cursor](../../references/pt-BR/cursor-adapter.md) e [validação de navegador](../../references/pt-BR/browser-validation.md).
Use stack, componentes e convenções existentes. Reutilize tokens e preserve restrições. Antes de aplicar nova direção, confirme status approved ou delegated.
Implemente fluxo principal e estados loading/empty/error/success/disabled. Use estrutura semântica, rótulos claros, foco visível, teclado e reduced-motion.
Use conteúdo real ou amostras identificadas. Confira especificidade CSS e conflitos de espaçamento. Mantenha carregamento resiliente de assets/fontes.
Execute checks existentes pertinentes. Não invente aprovação ou comando inexistente. Para HTML estático sem preview documentado, use o auxiliar loopback explícito conforme contrato de navegador; registre comando/URL/raiz/PID reais e dono. Implemente/verifique partes pequenas e coerentes.
Após mudanças, atualize evidência com commit/hashes dos arquivos alterados. Preserve capturas brutas, hashes e metadados históricos em arquivos por revisão conforme contrato. Anote obsolescência nas notas/revisão atuais; volte checks afetados a pending até nova observação. Preserve schemaVersion 1 e valores existentes; não invente horário de captura. Prossiga à revisão visual/acessibilidade do resultado.
