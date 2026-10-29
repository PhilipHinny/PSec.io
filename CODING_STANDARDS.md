# PSec AI coding standards

These standards apply when build sessions begin. `AGENTS.md` owns product and trust rules; this file owns implementation practice.

## Stack and boundaries

- Web: React 19, Vite, TypeScript strict, TanStack Query, React Hook Form/Zod, TipTap, Tailwind and shadcn/ui. Keep Firebase SDK in the web client only for sign-in and token acquisition. The browser calls FastAPI for product data.
- API: Python 3.12, FastAPI, Pydantic v2. Thin routers, services for authorization and workflow, repositories for storage. Use one consistent error shape and explicit response models.
- Worker: Celery with Redis for extract, embed, generate, and export. Jobs carry record IDs; resolve organization and authorization-relevant state from the database. Idempotency keys and bounded retries protect expensive actions.
- Data: Supabase Postgres, pgvector, private Storage. Alembic owns schema changes. Use small pooled connections and transaction boundaries. Never edit production schema through the dashboard.
- Keep secrets server-side. `.env.example` contains names only. Do not log tokens, raw source documents, prompts containing customer text, webhook secrets, or signed URLs.

## Structure and style

- Organize by product feature and ownership boundary. TypeScript and Python type checks must pass. Prefer explicit types over `any` or unvalidated dictionaries.
- Validate at the HTTP, CSV, file, queue, and model-output boundaries. Normalize dates and periods explicitly. Store timestamps in UTC and display them in the user's locale.
- Use structured parsers for DOCX, PDF, CSV, JSON, and model responses. Preserve source offsets or stable source IDs for traceability. Do not derive authoritative figures from generated prose.
- Keep model/provider routing and prices in server configuration with an allowlist and versioned evaluation record. Do not hardcode a model name as an eternal product promise.
- Avoid broad refactors while migrating the legacy app. Port a component or behavior only after its dependencies and security assumptions are understood.

## Data and authorization

- All tenant-owned tables have `org_id`, including child and event tables where useful for direct queries and policy checks. Enforce parent/child organization consistency with schema constraints or transactional checks.
- Repository methods take a trusted organization context. No unscoped `get_by_id`, including exports, comments, versions, approvals, and documents. Recheck ownership at object storage download and worker execution.
- Define a role/action matrix before endpoints. Server checks actions; UI hiding is convenience only. Owner/Admin manage workspace; Manager reviews/approves; Contributor drafts and logs; Viewer reads only, subject to document visibility policy.
- If service-role access is retained, acknowledge it bypasses RLS. Test the service authorization layer with two organizations. Use RLS policies for future lower-privilege access and defense in depth.
- Audit uploads, edits, status transitions, approvals, exports, billing changes, deletions, and administrative actions with actor, organization, target, timestamp, and safe metadata.

## Generation and export

- Use versioned Template Schema and Report Standard snapshots on each report. Source IDs must resolve to records in the same organization and period where applicable.
- Generate one section at a time with Pydantic validation. One repair attempt is allowed; further failure produces an explicit partial/failed state. Never silently drop sections or fabricate a value to pass validation.
- Treat model output as untrusted. Sanitize rendered HTML and DOCX content. Numeric tables are assembled by deterministic code from confirmed data.
- Save immutable report versions at review milestones. Autosave uses optimistic concurrency to prevent overwriting a newer edit. Approval binds to a report version/hash.
- Signed URLs are short-lived and issued after authorization. Draft exports are visibly marked; the export log records version, format, approval state, and actor.

## Tests and delivery

- Unit tests cover pure validation, table rendering, status transitions, and source checks. Integration tests use real Postgres and storage/queue adapters where authorization or transaction behavior matters.
- CI runs lint, type checks, migrations, API tests, cross-organization tests, web build, and security/secret checks. Test at least one real DOCX and PDF round trip and a restore drill before real pilot data.
- Every change has a narrow gate in `docs/ACCEPTANCE_MATRIX.md`. Report the command, result, and remaining limitations. Do not weaken a test to pass a gate.
- Keep changes reviewable. Record migration and rollback steps for schema or external-service changes.
