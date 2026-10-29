# PSec AI build prompts

Run these in order, one fresh coding-agent session per prompt. Start in `D:\PSec.io` on a working branch. Paste the entire prompt file into the new session. Every prompt is self-contained and points to its required references. `docs/BUILD_STATE.md` is the handoff between sessions. Do not skip a gate; a failed gate belongs to the same prompt until fixed.

| Order | Prompt | Main result |
|---|---|---|
| 00 | `00_recon_and_decisions.md` | Legacy inventory and approved migration/decision record |
| 01 | `01_foundation.md` | Target project skeleton and migrations |
| 02 | `02_identity_and_tenancy.md` | Auth, roles, two-org isolation |
| 03 | `03_templates_and_standards.md` | Upload, parse, edit, version |
| 04 | `04_activity_and_indicators.md` | Reliable input capture and import |
| 05 | `05_generation_and_evaluation.md` | Evidence-bound drafting and quality harness |
| 06 | `06_editor_and_review.md` | Draft editing and human approval |
| 07 | `07_exports.md` | DOCX/PDF and signed downloads |
| 08 | `08_web_workflow.md` | Complete usable web flow |
| 09 | `09_billing_and_operations.md` | Billing, quotas, audit, retention, observability |
| 10 | `10_pilot_acceptance.md` | End-to-end sign-off and pilot evidence |

## Session protocol

At the start, read `AGENTS.md`, `CODING_STANDARDS.md`, `PSec-AI-Spec-v3.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/ACCEPTANCE_MATRIX.md`, and `docs/BUILD_STATE.md`, then the active prompt's other references. Inspect the current files and git status. Do the active prompt only. Run its gate and record commands/results. Update `docs/BUILD_STATE.md` with precise handoff notes. Stop after the gate; do not roll into the next prompt. If a product decision blocks implementation, document options and the effect, then ask Philip for the decision.

Provider prices, model IDs, legal claims, and external limits can change. Verify them with primary provider material in the relevant session before relying on them. The `[web:n]` markers in v3 are not usable citations.
