# Cursor adapter

[Português (Brasil)](pt-BR/cursor-adapter.md)
Inspect capabilities actually exposed by the current session before planning tool calls. Use the [browser validation contract](browser-validation.md) for preview, capture calibration, native keyboard, state timing and evidence integrity.
- Repository context: file search/read, manifests, components, tokens and styles.
- Implementation: normal file edits using the project's existing stack and checks.
- Preview: use the documented project command. For static HTML without one, the plugin's explicit `node <absolute-plugin-path>/scripts/preview.mjs <project-root>` fallback is allowed. Resolve the absolute plugin path from the loaded skill. When file:// is blocked, try loopback once, record actual command/URL/root/PID/owner, and stop only this session's process.
- Visual inspection: inspect unchanged images through documented screenshot tools. Calibrate once; try one supported alternate capture if faulty, then report unsupported and continue other checks. No undocumented CDP/log fallback or screenshot repair.
- Interaction: calibrate native keyboard with an observable focus/activation change. One documented native alternative is allowed; synthetic events or script focus do not establish trusted keyboard behavior.
- UI state: obtain a current observation after each action or window/panel change before using element identifiers. Use identifiers only from that observation. If accessible state and the unchanged screenshot disagree, reselect the target with a documented host method and obtain one fresh complete observation; if disagreement persists, mark affected automation/capture checks pending rather than guessing identifiers or reporting success.
- States: observe real timing and DOM conditions without altering timers. Record unavailable transient captures separately from observed state behavior.
- Assets: existing licensed/local assets first; install or fetch only within user authorization. Do not silently require a font service or image generator.
- Review: inline by default. Optional separate reviewers receive brief, decisions, relevant source paths and evidence; they remain read-only. Human review is not a gate for local operational acceptance.
- Missing tool: mark the corresponding check pending with reason and a reproducible next step. Never fabricate a result.
- Denied operation: respect the refusal; do not retry the same operation through another agent or interface to evade it. Record unavailable hashes or commands as pending and continue independent work. CLI authentication and command approval are separate capabilities; a successful login does not establish shell availability.
- Evidence: actor/tool, tested revision/dirty hashes, capturedAt provenance or null, actual recordedAt; affected evidence becomes stale after edits. A helper metadata result is not visual inspection.
- Paths: resolve references relative to this skill/plugin; write project deliverables inside the user's repository, not the installed plugin.
Use only capabilities exposed by the current host session. Resolve the plugin's skills, files, and helper scripts from their installed paths.
