# Prompt 00 - Recon and build decisions

Run this in a fresh session in `D:\PSec.io`. Read `AGENTS.md`, `CODING_STANDARDS.md`, `PSec-AI-Spec-v3.md`, `docs/ARCHITECTURE.md`, `docs/DELIVERY_PLAN.md`, `docs/DECISIONS.md`, `docs/ACCEPTANCE_MATRIX.md`, and `docs/BUILD_STATE.md`. Inspect git status first. This session is analysis and documentation only; do not change application code, infrastructure, or provider state.

## Job

1. Map the actual legacy client and server: entry points, routes, auth, user/tenant identifiers, data stores, upload/download, generation, export, billing, deployment files, tests, and live dependencies. Cite paths/lines. Do not print secrets or customer documents.
2. Classify each relevant component as reusable, rewrite, or remove for v3, with why and migration risk. Identify runtime breakages and security blockers, but do not assume old endpoints are safe.
3. Propose the target monorepo folder layout and incremental migration order. Specify how old routes remain isolated until replacement flows pass; include data migration/retention and rollback strategy if real data exists. Determine whether any real customer data is present without exposing it.
4. Resolve D01-D13 where evidence is available. For choices requiring Philip, present options with a recommendation and implications. Prioritize D04 (approval), D05 (budget inputs), D07 (pricing/scope), D09 (billing timing), and D10 (data residency).
5. Produce `docs/EXISTING_SYSTEM_ANALYSIS.md`, update `docs/DECISIONS.md`, and make `docs/BUILD_STATE.md` a concrete Prompt 01 handoff. List prerequisites and secrets as variable names only.

## Gate / stop

Show a route/data-flow map, reuse table, risk list, open decision list, migration sequence, and evidence that no app code was changed. Mark Prompt 00 complete only when the migration path and Prompt 01 scope are unambiguous. Stop for review. Do not start Prompt 01.
