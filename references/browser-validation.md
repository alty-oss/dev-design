# Browser validation contract

[Português (Brasil)](pt-BR/browser-validation.md)

Use only documented tools exposed by the current host. Record the actor, host/tool/API, exact tested source revision (commit plus dirty-file SHA-256 hashes), real actions, observed results and limitations. Skill activation, a tool name or a metadata helper succeeding is not a passed UI check. Keep the user's product, stack, content, timing and scope constraints. Human review is optional; automated operational checks are the current local acceptance scope, not an aesthetic benchmark or complete WCAG audit.

## Preview and ownership

1. Inspect the project's documented preview command. If present and authorized, run that exact command and record the actual URL and process ownership.
2. For static HTML with local assets and no documented command, this plugin explicitly provides a fallback: `node <absolute-plugin-path>/scripts/preview.mjs <absolute-project-root>`. Resolve the plugin path from the loaded skill's location and use the actual project root. This is a bounded local static preview; it does not build applications or run arbitrary project commands.
3. The helper binds only `127.0.0.1`, asks the OS for a free port and prints JSON `{url,root,pid}`. Use that actual URL. Keep the terminal process alive for the review; record command, root, URL, PID and owner in evidence. When `file://` is blocked, attempt this loopback fallback once and continue checks. If it fails, record the concrete error and mark dependent checks pending; do not cycle through speculative servers.
4. Stop only the process this session started, using Ctrl-C or SIGTERM. An existing shared preview remains owned by its original session. The helper serves GET/HEAD, index.html and local assets; rejects hidden files, traversal and paths/symlinks outside the explicit root. Missing/invalid roots fail; there is no root fallback, installation, daemon, browser launch or public binding. Use a disposable/static project root appropriate for local review.

## Screenshot calibration and integrity

Set and record the requested CSS viewport, pixel ratio and actual route/state. Calibrate dimensions once by inspecting the tool's unchanged image and its measured PNG/JPEG width/height. A window screenshot may include browser chrome and may not equal the emulated viewport. Do not relabel it as viewport evidence. If the capture is faulty (wrong dimensions, repeated strips, missing regions), try one documented supported alternate capture method. If that also fails or is unavailable, mark capture unsupported/pending and continue DOM, semantic and interaction checks that work. No raw log scraping, undocumented CDP connection, image patching or cropping to hide artifacts. An explicitly declared tool clip is allowed and validates only that region, never the entire viewport.

Inspect actual images for layout and artifacts. The recorder below detects PNG or JPEG from bytes, measures encoded dimensions from PNG headers/chunks or JPEG SOF markers, and hashes original bytes; it does not render or decode image pixels, detect repeated strips, certify a true viewport or establish visual quality. Dimensions matching is metadata validation only. A structurally readable PNG or JPEG can still contain bad pixels. PNG chunk/CRC validation remains strict; JPEG segment bounds, frame/scan headers and end marker are checked without decoding compressed pixels. The file extension is not trusted, and no image conversion occurs. Record visual inspection separately with the actual observer/action and result.

Record existing unchanged PNG or JPEG images with:

```sh
node /absolute/plugin/scripts/record-capture.mjs /absolute/project docs/design/example/desktop.png \
  --revision 'COMMIT plus dirty-file hashes, or explicit source SHA-256' \
  --route / --state idle --viewport 1440x900 --kind viewport \
  --actor controller --tool 'documented screenshot API'
```

`--help` lists every flag. `--kind` accepts `viewport` (default), `full-page` or `clip`; `--clip X,Y,WIDTH,HEIGHT` is required for clip. Encoded PNG/JPEG pixel dimensions must equal requested viewport dimensions for viewport captures. Full-page width must equal viewport width and height must be at least the viewport height. Clip dimensions must equal declared width/height. This helper supports pixel ratio 1; otherwise obtain a supported pixel-ratio-1 capture or record the unsupported dimension check. Mismatches throw and must not be accepted as visual evidence. `recordCapture(options)` exports the same behavior for Node callers; root/file/revision/route/state/viewport/actor/tool are required, kind defaults to viewport.

The CLI emits one JSON record for the existing evidence.json captures array, without editing images or evidence files. It records `file`, `sha256`, `dimensions`, `format` (`png` or `jpeg`), `mime` (`image/png` or `image/jpeg`), `revision`, `route`, `state`, `viewport`, `kind`, `clip`, `actor`, `tool`, `capturedAt`, `captureProvenance`, `recordedAt`. The recorder uses its real clock for `recordedAt`. `capturedAt` and `captureProvenance` remain null unless a real screenshot-tool timestamp and its receipt/source are supplied through `--captured-at ISO-with-timezone --capture-provenance 'receipt/source'`. A model guess, shell time after capture or file mtime is not capture provenance. The helper checks supplied metadata syntax, not the truth of the caller's provenance. Preserve raw capture receipts when available. Source revisions are caller-supplied and must be independently matched to actual tested bytes.

## Native interaction and real state timing

Refresh the current accessible/DOM state after each action or window/panel change before choosing another element. Identifiers from an earlier observation may no longer select the same control. If the accessible state and screenshot disagree, reselect the actual target through a documented method and request one fresh complete observation. Persistent disagreement leaves the affected checks pending; do not guess identifiers or treat a successful API call as proof of a state change. Respect the capture retry budget above.

Before a keyboard claim, send supported native input and verify observable focus or activation changes (for example Tab changes the active element, then Escape closes the modal and restores focus). A named `press_key` API succeeding without changed behavior is insufficient. Try one documented native alternative if available. If neither works, report keyboard unsupported/pending. `dispatchEvent`, scripted `.focus()` or synthetic keyboard events are diagnostic aids only and never trusted keyboard evidence. A modal opened by click can still have separate verified click evidence.

Exercise real validation, loading, error/retry/success and disabled controls. Use condition-based checks against actual DOM state, within bounded timeouts. Keep real product timing; never monkey-patch timers or lengthen loading merely to obtain a screenshot. If a transient state's screenshot is unavailable, its capture remains pending while separately observed DOM state, native disabled properties and response behavior can be recorded. Do not turn successful DOM inspection into a screenshot pass.

For contrast on solid backgrounds, compute the ratio from actual computed foreground/background colors, accounting for opacity, inheritance and compositing. Pixel sampling is needed only where complex backgrounds prevent an adequate computed-color check. Record the method, colors, ratio, scope and applicable threshold. This scoped check does not establish full WCAG or screen-reader conformance.

## Revision and repair budget

After edits, old evidence for affected screens/states becomes stale. Preserve its historical files and observations; add a current revision record and new checks/captures. Do not rewrite old hashes to imply new validation. Default to two repair rounds; after bounded attempts, report remaining defects or unavailable checks with reproducible next steps. Continue independent checks and delivery without waiting for optional human reviewers. Respect explicit user approval requirements for material product decisions.
