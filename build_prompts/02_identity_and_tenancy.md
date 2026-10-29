# Prompt 02 - Identity, membership, and tenant isolation

Run in a fresh session. Read `build_prompts/README.md` protocol, the common references, Prompt 01 handoff, and current auth/data code. Resolve D04 and D12 before implementing affected transitions. This prompt owns the server trust boundary.

## Job

1. Verify Firebase ID tokens in FastAPI on every protected request; reject invalid/expired tokens. Map Firebase UID to user and exactly one active membership in v1. Implement organization creation and invite/accept flows with role enforcement. Never accept client-supplied `org_id`, role, or user ID as authority.
2. Write a role/action matrix and central authorization dependency. Apply it to organization, membership, project, and representative CRUD routes. Define consistent error responses. A missing membership denies by default.
3. Make repository operations take trusted organization context. Test two-org access for direct IDs, nested IDs, list filters, and mutation bodies. Include a worker task with missing/wrong context. Confirm RLS policies do not create false confidence while using the service role.
4. Audit sensitive membership changes. Document token refresh and invitation edge cases. Keep the browser auth integration minimal here; Prompt 08 owns the full UI.

## Gate / stop

Pass AUTH-01, TEN-01 for implemented endpoints, and the worker portion of TEN-02. CI must exercise a real database with two organizations. Record exactly which routes were covered and add new routes to the matrix later. Update `docs/BUILD_STATE.md`; stop before template work.
