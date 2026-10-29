# Prompt 08 - Complete web workflow

Run in a fresh session. Read `build_prompts/README.md` protocol, common references, Prompt 07 handoff, and v3 sections 3, 4.1, 10, Appendix C/D. Inspect existing client components and design references before replacing or reusing them. Keep the first screen a usable signed-in workflow.

## Job

1. Wire Firebase sign-in, organization creation/invitation, role-aware navigation, and API token refresh. Remove or hide obsolete chat/todo/productivity surfaces in the target app. Keep the browser limited to FastAPI product data.
2. Build the happy path: choose seeded or uploaded template -> confirm schema/standard -> log/import activities/indicators -> fill intake -> generate -> inspect sources/questions -> edit -> submit -> approve -> export/download. Support both template-first and example-first onboarding.
3. Give every long-running step a visible status, retry path, and useful error. Handle empty states and `needs_input` without dead ends. Use accessible forms, keyboard navigation, responsive layouts, clear source references, and no invented numbers in previews.
4. Connect usage/plan status and audit views where backend APIs already exist; leave Prompt 09-only areas as honest pending states until implemented. Test roles, mobile/desktop viewports, navigation, autosave conflicts, and signed download behavior.

## Gate / stop

Pass WEB-01 in a staging/local walkthrough with a new organization and a seeded template. Record time to first export and where help was needed. The release target is under 30 minutes, but report actual time. Run web typecheck/build and targeted browser tests. Update build state and stop.
