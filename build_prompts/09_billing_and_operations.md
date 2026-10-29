# Prompt 09 - Billing, quota, audit, and operations

Run in a fresh session. Read `build_prompts/README.md` protocol, common references, Prompt 08 handoff, and v3 sections 4.1, 6.4, 12-14, 19. Resolve D07/D09/D10 and verify current Paystack, provider, and legal requirements against primary sources before publishing claims or charging customers.

## Job

1. Implement server-owned plan catalog and prices. Add Paystack card checkout and invoice workflow for the supported methods. Verify webhook signatures using raw request body, reconcile provider references, handle duplicates/out-of-order events, and derive entitlements server-side. The browser never grants paid status.
2. Enforce seats, templates, storage, and generation/fair-use quotas at the API/worker boundary. Define period rollover and race handling. Show accurate usage/plan data in the UI. Reconcile the Organization/Consultant marketing copy with actually shipped capabilities.
3. Complete audit events for every sensitive state change, organization data deletion with confirmation and cascade, storage/text/chunk/embedding/cache cleanup, and export retention behavior per D08. Protect audit metadata from carrying document contents.
4. Add Sentry, structured logs, alert thresholds, status/help links, environment separation, backup schedule and a restore drill. Prepare privacy policy, terms, DPA template, and subprocessor list for review; do not publish unverified guarantees. Perform a targeted security review of secrets, auth, tenant access, upload, LLM, billing, and deployment.

## Gate / stop

Pass BIL-01, OPS-01/02 and remaining relevant TEN cases. Demonstrate tampered client price rejection, forged/replayed webhook rejection/idempotency, quota race handling, deletion cascade, and a documented restore. Record provider verification dates, policy review status, and exact gate evidence in build state. Stop.
