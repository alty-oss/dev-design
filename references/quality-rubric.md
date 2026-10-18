# Quality rubric

[Português (Brasil)](pt-BR/quality-rubric.md)
Judge evidence from the implemented result and actual brief. For optional human aesthetic research, scale 0–4:
0 absent/broken; 1 major defects; 2 usable with material limitations; 3 strong and justified; 4 excellent, specific and thoroughly evidenced.

Score each separately only when actual qualified judgment/evidence exists:
1. Brief fit: audience, content and primary job drive decisions.
2. Visual specificity: choices belong to this product, including explicit requested styles.
3. Hierarchy and copy: primary action, type, reading order and words are clear.
4. Interaction and states: main flow, feedback and recovery work.
5. System coherence: tokens, components and responsive behavior are consistent.
6. Visual verification: actual relevant screens/states were inspected and findings addressed.
7. Accessibility verification: observed keyboard/focus/semantics/contrast/motion checks support the claims.

Blocker: prevents primary job, loses data or blocks access to the flow.
Major: materially confusing, inaccessible or broken under a supported state/viewport.
Minor: local polish issue with limited impact.

For this release, operational automated validation is the current local acceptance scope: verify package/vendor integrity, real helper behavior, bounded preview/capture/keyboard fallbacks, real state timing, exact revision evidence and honest unsupported checks. Report actual outcomes and remaining defects; no unobserved check counts as pass. A metadata-valid PNG or JPEG is not visual inspection. Follow [browser validation](browser-validation.md). Default repair budget is two rounds, then an honest report of remaining issues.

Human reviewers are optional, and their availability does not block local delivery. Do not substitute agent-generated aesthetic scores for human judgments. A comparative study may use the research target of mean ≥3, every category ≥2, and no open blocker, without treating it as a delivery gate. No full WCAG or screen-reader conformance follows from scoped automated checks.
