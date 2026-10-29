# Prompt 01 - Target foundation

Run in a fresh session. Read the session protocol in `build_prompts/README.md`, all common references, `docs/EXISTING_SYSTEM_ANALYSIS.md`, and the completed Prompt 00 handoff. Inspect current code and git status. Implement only the foundation selected in D01; preserve the legacy folders and user changes.

## Job

1. Establish the `apps/web`, `apps/api`, `apps/worker`, and optional `packages/shared` layout with documented local startup. Use the v3 stack and strict typing. Add env examples with names, no values. Keep provider access behind config and fail startup on missing required server secrets.
2. Set up Supabase/Postgres locally, Alembic migration baseline, pgvector extension, tenant-owned core tables, foreign keys, constraints, indexes, and private storage setup instructions. Model direct `org_id` on tenant child tables and parent consistency. Do not create production resources in this session unless already authorized.
3. Establish Redis/Celery wiring, health/readiness, structured logs with redaction, errors, lint/typecheck/test commands, CI skeleton, and migration check. Separate test/dev/prod configs and server-only keys.
4. Create a small documented fixture strategy for two organizations and redacted documents. Ensure the base migration can be applied to a new database and subsequent migration runs are stable. Record any deviation from v3 in `docs/DECISIONS.md`.

## Gate / stop

Pass FND-01/FND-02: local API/worker/web start, clean migration succeeds, repeat migration is stable, lint/typecheck/build/test skeleton passes, and no service key appears in web output or committed files. Record commands and evidence in `docs/BUILD_STATE.md`. Stop; Prompt 02 handles real auth and authorization.
