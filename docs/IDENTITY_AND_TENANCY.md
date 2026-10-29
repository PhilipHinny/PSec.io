# Prompt 02 authorization contract

The API verifies every protected request with Firebase Admin `verify_id_token(..., check_revoked=True)` and derives the single active membership from Postgres. `GET /health` and `GET /ready` are operational exceptions. `POST /v1/orgs` and `POST /v1/invitations/accept` require a verified token but intentionally allow a user without a membership. No browser claim supplies a user ID, role, or organization ID. Path organization IDs are checked against the resolved membership. Request models reject extra body fields.

## Role/action matrix

| Action | Owner | Admin | Manager | Contributor | Viewer | Routes |
|---|---:|---:|---:|---:|---:|---|
| `org.read` | yes | yes | yes | yes | yes | `GET /v1/orgs/{org_id}` |
| `member.read` | yes | yes | yes | no | no | `GET /v1/orgs/{org_id}/members` |
| `member.invite` | yes | yes* | no | no | no | `POST /v1/orgs/{org_id}/invitations` |
| `member.manage` | yes | yes* | no | no | no | `PATCH /v1/orgs/{org_id}/members/{member_id}` |
| `project.read` | yes | yes | yes | yes | yes | `GET /v1/projects`, `GET /v1/projects/{project_id}` |
| `project.write` | yes | yes | yes | no | no | `POST /v1/projects`, `PATCH /v1/projects/{project_id}`, `DELETE /v1/projects/{project_id}` |
| `report.approve` | no | yes | yes | no | no | Reserved for Prompt 06; another human must own the report, approval binds to version/hash. |

* Admin cannot grant Admin or change another Admin. Neither Owner nor Admin can change the Owner's membership or their own membership. Owner cannot be granted by invitation or patch. `GET /v1/me` requires an active membership. Organization creation is the only route that creates an Owner.

Authorization dependencies deny by default. Missing or multiple active memberships produce 403. Unknown action names fail at route registration. Cross-organization IDs produce 404 to avoid disclosing existence. Errors use `{"error":{"code":"...","message":"..."}}`: invalid token 401, missing membership/forbidden 403, foreign or absent resource 404, existing membership or name conflict 409, invalid input 422, unexpected error 500.

Project lists use `limit` (1–100, default 50) and `offset` (default 0). A client `org_id` query filter is ignored; the repository always filters on the trusted membership. Create and patch bodies reject `org_id`, `role`, and `user_id`. Repository project and membership methods require a `Tenant` value and scope SQL by its organization. The worker `identity.check_project` task requires an organization ID and project ID and rejects absent or wrong context. Future jobs should resolve the organization from a stored job record instead of trusting arbitrary queue arguments.

Invitations expire after seven days, use a random one-time token stored only as a SHA-256 hash, and require a verified Firebase email matching the invitation. A user with any membership, even inactive, cannot create a second membership or accept an invitation in v1. Concurrent organization creation and acceptance for one Firebase UID are serialized with a transaction advisory lock. Acceptance locks the invitation row and is single use. The API returns the raw token once to the inviting Owner/Admin for controlled delivery; no email delivery exists in Prompt 02. Audit events record organization creation, invitation creation/acceptance, membership creation, and membership changes without token or email metadata. Changing a member's role or active state takes effect on the next API request because the database is queried on each request; a refreshed Firebase token cannot restore removed membership authority. Expired/revoked Firebase tokens require sign-in or token refresh. Firebase Admin revocation checks may require a live Firebase connection.

RLS is enabled on all foundation tables and invitations, with no `anon` or `authenticated` policies. The FastAPI service connection may bypass RLS, so these policies do not prove tenant isolation. The scoped repository and two-organization integration test are the actual guard. Any new route must add an action here and a cross-organization test before its prompt gate passes.

Firebase token verification follows the [Admin SDK reference](https://firebase.google.com/docs/reference/admin/python/firebase_admin.auth) and [session revocation guide](https://firebase.google.com/docs/auth/admin/manage-sessions).
