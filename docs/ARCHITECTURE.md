# PSec AI v1 architecture and contracts

This is a planning contract for Prompt 00 onward, derived from `PSec-AI-Spec-v3.md`. It is not a claim that the current code implements it.

## Runtime

`apps/web` obtains a Firebase ID token and calls `apps/api` over HTTPS. The API verifies the token, resolves one active organization membership, checks the action, and operates on Postgres/Storage. `apps/worker` processes extract, embed, generate, and export jobs from Redis. `packages/shared` may hold versioned JSON schemas/types where sharing removes drift; avoid coupling Python to generated TypeScript implementation.

The browser does not call Supabase directly in v1. Service-role credentials stay in the API/worker. Every service query includes trusted `org_id`, and workers re-resolve it from a stored job/report ID. Storage objects use organization-prefixed keys and private buckets. Signed URLs are issued after current authorization checks. Redis keys include environment and organization.

## Core records

- Organization, user, membership, invitation, project.
- Document upload with type, checksum, validation/scanning state, parse state, storage key, and source provenance.
- Template and immutable template versions; Report Standard and immutable standard versions; section/input/table schema.
- Activity and indicator records with period and source metadata. Add explicit budget/finance input only after D05 is decided.
- Report with selected template/standard versions and input snapshot; sections with content, status, question, source IDs, revision, and validation result.
- Comments, immutable report versions, approval bound to version/hash, export bound to version/hash, generation/cost ledger, audit event, subscription/entitlement, usage counter.

All tenant-owned child records should carry `org_id` even when their parent does. Database constraints or transactional checks must reject mismatched parent/child organizations. Use Alembic migrations for every schema change. Define uniqueness and foreign keys before endpoints. Store source references as stable typed IDs, not free-form model citations.

## Report lifecycle

1. Create: validate selected template/standard versions, period, and referenced inputs. `queued` report created with a snapshot of accepted input IDs and versions.
2. Worker: `generating`; validate source ownership, retrieve tenant-scoped excerpts, draft sections. Mark insufficient sections `needs_input` with a question. On partial failure, keep visible partial state.
3. Review: `draft` -> `in_review` -> `changes_requested` or `approved`. Any edit after approval creates a new version and returns to `draft` or `in_review` per the final state-policy decision. Approval is human, server authorized, timestamped, and bound to exact version.
4. Export: an approved version can be final; any other version is a visibly watermarked draft. Retry does not duplicate export records/files. Download checks the current user's organization and permission.

Version history must preserve the previous content. Autosave uses revision/ETag checks, returning a conflict when another edit wins. Deletion and retention policy follow D08.

## Trust boundary and failure behavior

- Token valid but no active membership: deny product access. Client-provided `org_id` is ignored or rejected. One organization per user in v1.
- Malformed, unsupported, oversized, encrypted, or suspicious file: reject or quarantine with a clear status. A parse failure allows manual schema entry.
- Missing activity/indicator/finance values: `needs_input`; do not generate plausible substitutes. A retrieved document may support prose only when its source is visible and authorized.
- Prompt injection in documents: treat as content, not instructions. Output passes schema, source, numeric/entity, and rubric checks. One repair attempt; then explicit failure/partial draft.
- External provider outage: bounded retries with backoff and idempotency. The UI shows a recoverable error, and costs/attempts are recorded.
- Payment webhook: verify signature on raw body, match provider reference and server-owned price/plan, process idempotently; never grant entitlement from a browser callback.

## API contract preparation

The v3 endpoint list is a route inventory, not a complete OpenAPI contract. Prompt 02 must define authentication, role/action matrix, pagination, error format, and tenant ID behavior. Subsequent prompts add request/response models and generated OpenAPI. Review state transitions and `If-Match`/revision semantics before editor work. Any new endpoint must have a named authorization action and cross-tenant denial test.

## Environments and operations

Local development uses the Supabase CLI and Docker Compose with test Firebase credentials/emulator strategy. Separate dev, staging, and production provider keys and buckets. CI runs migration from an empty database and validates rollback strategy. Before real pilot data: private storage, signed URL expiry, secret scanning, audit coverage, documented backup/restore, observability, incident owner, and retention/deletion procedure.
