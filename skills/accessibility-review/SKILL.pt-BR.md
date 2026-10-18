---
name: accessibility-review
description: Use ao revisar teclado, foco, nomes acessíveis, estrutura, contraste e movimento em interfaces.
---
# Revisão de acessibilidade

[English](SKILL.md)
Revise fluxo principal implementado e estados de recuperação pertinentes usando o [contrato de navegador](../../references/pt-BR/browser-validation.md).
Confira landmarks/headings semânticos, nomes claros, associações label/input/erro, foco visível, ordem/restauração, ativação/escape por teclado, contraste, zoom/reflow e reduced-motion.
Calibre teclado nativo com mudanças observáveis de foco/ativação. Sucesso de press_key sem mudança não basta. Tente uma alternativa nativa documentada e, se falhar, registre indisponibilidade; dispatchEvent/foco programado não são evidência confiável. Use ações reais para afirmações de teclado. Inspecione overlays/validação. Screenshot sozinha não comprova ordem de foco ou tecnologia assistiva.
Em fundos sólidos, calcule contraste de cores computadas reais, incluindo opacidade/herança/composição; analise pixels quando fundos complexos exigirem. Registre método, cores, razão e escopo.
Execute automação de acessibilidade existente quando disponível, registrando escopo/resultado. Não adicione dependência somente para declarar cobertura.
Classifique blocker/major/minor com evidência e reparo; reteste comportamento afetado.
Checks não suportados ficam pending. Scans e checks limitados não comprovam WCAG completa. Não declare conformidade global sem o escopo de auditoria exigido.
