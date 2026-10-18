---
name: visual-review
description: Use após mudanças de UI para inspecionar telas renderizadas, comparar com o brief e corrigir defeitos visuais ou de interação.
---
# Revisão visual

[English](SKILL.md)
Leia [contrato de navegador](../../references/pt-BR/browser-validation.md), [rubrica de qualidade](../../references/pt-BR/quality-rubric.md), brief/direction e fluxo implementado. Inspecione renderização real quando houver ferramentas.
Capture 390×844 e 1440×900; acrescente 768×1024 para layouts densos. Confira 320 CSS px e zoom para overflow/legibilidade quando suportado. Use estados reais loading/empty/error/success e observações condicionais sem alterar temporizadores. Captura transitória indisponível fica pending; registre DOM observado separadamente.
Calibre dimensões uma vez; se falhar, tente uma alternativa suportada e depois registre indisponibilidade, continuando checks independentes. Registre ator/ferramenta, caminho, SHA-256, formato/MIME detectados, dimensões, kind (viewport/full-page/clip declarado), rota, viewport, estado e revisão exata em evidence.json. O gravador valida metadados, não qualidade visual. capturedAt fica nulo sem procedência real; recordedAt usa relógio real. Inspecione imagens inalteradas. Não repare/recorte para esconder artefatos nem use CDP/logs não documentados. Clip valida somente a região declarada.
Compare hierarquia, alinhamento, tipografia, espaçamento, identidade, ação principal, conteúdo e responsividade com o brief. Exercite ação principal e recuperação.
Escreva achados concretos com local, impacto, evidência e reparo. Corrija blockers/major, marque evidências afetadas como obsoletas e recapture.
Use duas rodadas de reparo por padrão. Se persistirem defeitos, relate corretamente e continue trabalho independente autorizado; registre decisões abertas/checks indisponíveis sem ciclos ou espera por revisores opcionais.
Sem renderização/captura, check visual pending, limitação e reprodução. Não declare UI verificada sem observar.
