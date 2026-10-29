# Prompt 10 - Pilot acceptance and sign-off

Run in a fresh session. Read `build_prompts/README.md` protocol, all common references, every completed build-state entry, v3 Appendix D, and `docs/DELIVERY_PLAN.md`. This session proves the product works end to end; do not manufacture evidence or treat missing partner activity as a software pass.

## Job

1. Run a clean deployment/staging smoke test: new org, invite, template upload or seed, activity/indicator input, generation, source review, changes, approval, DOCX/PDF export, signed download, billing entitlement, and deletion. Repeat with two organizations to probe isolation across API, worker, vector, storage, and exports.
2. Run 10 consecutive generations without manual intervention using fixed qualified fixtures. Report successes, retries, failures, latency, and cost. Run the 30-pair golden set once complete, two independent blind raters, and the head-to-head plain-prompt comparison. Publish denominators and disagreement, not just percentages.
3. Inspect representative DOCX in Word, PDF visually, audit trail, watermark, approval invalidation, migration from empty DB, backup restore, and error/alert delivery. Confirm privacy/terms/DPA/subprocessor material has been reviewed and published before real pilot data.
4. Create `docs/PILOT_SIGNOFF.md` with each acceptance ID marked Pass/Fail/Blocked and links to evidence. List known limitations and which are release blocking. Capture actual design-partner cycles, paid conversion, time to first export, editing effort, and week-two retention when observable.

## Gate / stop

Mark the pilot release ready only when critical trust gates pass and three design partners have completed a full cycle. If partner counts or sample sizes are pending, state that precisely and leave the gate blocked. Update `docs/BUILD_STATE.md` and stop; do not equate implementation completion with pilot validation.
