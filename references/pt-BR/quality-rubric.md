# Rubrica de qualidade

[English](../quality-rubric.md)
Avalie evidências do resultado implementado e do brief real. Para pesquisa estética humana opcional, escala 0–4:
0 ausente/quebrado; 1 defeitos graves; 2 utilizável com limitações materiais; 3 forte e justificado; 4 excelente, específico e bem fundamentado.

Pontue separadamente somente quando houver julgamento qualificado/evidência real:
1. Aderência ao brief: público, conteúdo e tarefa principal orientam decisões.
2. Especificidade visual: escolhas pertencem ao produto, incluindo estilos pedidos explicitamente.
3. Hierarquia e texto: ação principal, tipografia, leitura e palavras claras.
4. Interação e estados: fluxo, feedback e recuperação funcionam.
5. Coerência do sistema: tokens, componentes e responsividade consistentes.
6. Verificação visual: telas/estados pertinentes inspecionados e achados tratados.
7. Verificação de acessibilidade: checks observados de teclado/foco/semântica/contraste/movimento sustentam as afirmações.

Blocker: impede a tarefa principal, perde dados ou bloqueia acesso ao fluxo.
Major: confusão material, inacessibilidade ou falha em estado/viewport suportado.
Minor: acabamento localizado com impacto limitado.

Nesta entrega, validação operacional automatizada é o escopo de aceite local: integridade de pacote/vendor, comportamento real dos auxiliares, fallbacks limitados de preview/captura/teclado, tempo real dos estados, revisão exata e checks honestamente indisponíveis. Relate resultados reais e defeitos restantes; checks não observados não são aprovados. PNG/JPEG com metadados válidos não comprova inspeção visual. Siga a [validação de navegador](browser-validation.md). O limite padrão de reparo é duas rodadas, seguido de relato honesto das pendências.

Revisores humanos são opcionais e sua indisponibilidade não bloqueia entrega local. Não substitua julgamento humano por pontuações estéticas geradas pelo agente. Um estudo comparativo pode usar a meta de pesquisa média ≥3, todas as categorias ≥2 e nenhum blocker aberto, sem torná-la requisito de entrega. Checks automatizados limitados não comprovam conformidade completa WCAG ou com leitor de tela.
