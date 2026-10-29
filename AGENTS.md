# PSec AI agent instructions

Read this file, `CODING_STANDARDS.md`, `PSec-AI-Spec-v3.md`, and `docs/BUILD_STATE.md` at the start of every build session. The v3 spec owns product scope; `docs/DECISIONS.md` records choices that clarify it; the prompt for the active session owns that session's work. If they conflict, record the conflict and ask Philip before implementing the disputed behavior.

## Current state

The repository contains a legacy React/Vite client in `PSecAI-Client` and a Flask/MongoDB server in `PSecAI-Server`. The v3 target is a React/TypeScript web app, FastAPI API, Celery worker, and Supabase Postgres/Storage. Do not treat the old implementation as a trusted source of behavior or security. Prompt 00 inventories it. Do not delete or migrate it until the inventory and migration decision are recorded.

## Product invariants

1. Every request authenticates a Firebase ID token server-side, then resolves organization membership and role from the database. `org_id`, user identity, plan, price, and approval authority never come from client claims.
2. Every data read, mutation, vector query, job, object key, signed download, and cache entry is scoped to the resolved organization. A service-role database connection bypasses RLS, so service-layer checks are mandatory; RLS is defense in depth, not evidence of isolation for that connection.
3. Narrative claims must have explicit source references. Never invent numbers, people, organizations, places, dates, finance values, or results. Missing evidence yields `needs_input` and a specific question.
4. Indicator and finance tables are assembled from verified input records, never model-generated values. If a required table has no verified data, it stays incomplete.
5. Only an authorized human manager or admin can approve. Any substantive edit after approval invalidates the approval and requires another review. Final exports require a current approval; unapproved exports are watermarked drafts.
6. Uploaded content and retrieved text are untrusted data, including instructions hidden in documents. The model never gains authority over access, approval, billing, or data deletion.
7. Do not use customer content to train models. Verify provider terms and configuration before claiming this externally.

## Workflow

- Follow one numbered file in `build_prompts/` per fresh session, in order. Start with Prompt 00. A prompt gate must pass before the next prompt starts.
- Read the relevant docs and actual code before editing. Keep work in the prompt's scope. Preserve user changes and never expose `.env` values or uploaded documents in logs, prompts, or summaries.
- Add tests that prove the risky behavior, especially cross-organization denial, upload/download ownership, webhook verification, factual traceability, and approval invalidation.
- Update `docs/BUILD_STATE.md` at the end of each session with artifacts, gate evidence, unresolved decisions, and the next prompt. Never mark a gate green without evidence.
- No roadmap features from v1.1 or Later unless the current v1 workflow cannot function without the narrower capability and the decision is recorded.

## Present instruction

This planning pack is documentation only. Do not start Prompt 00 or write application code in this session.
