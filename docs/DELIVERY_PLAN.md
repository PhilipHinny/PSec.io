# Eight-week delivery plan

The v3 eight-week target is a planning constraint, not a guaranteed date. Start date and partner availability must be confirmed. Every prompt has a gate; if a gate fails, fix it before moving on. Run partner recruitment and golden-set collection in parallel with implementation, with consent and redaction.

| Window | Prompts | Deliverable | Critical gate |
|---|---|---|---|
| Pre-build / Week 1 | 00-02 | Inventory, decisions, monorepo baseline, DB/auth/tenant boundary | Two-org isolation suite and migration test |
| Weeks 2-3 | 03 | Upload, parsing, schema and standard editors, seed templates | Both template-first and example-first path yield editable versioned standards |
| Weeks 3-4 | 04 | Activity/indicator capture, CSV, report intake | Data import errors and period/source ownership tested |
| Weeks 4-5 | 05 | Section generation, source trace, cost ledger, golden-set harness | Unsupported claims/numbers are blocked or flagged; explicit `needs_input` |
| Weeks 5-6 | 06-07 | Editor, review, approvals, DOCX/PDF exports | Approval invalidation, watermark, real Word/PDF inspection |
| Weeks 6-7 | 08-09 | Connected web workflow, billing, audit, quotas, operations | New org completes workflow; webhook and quota tests |
| Week 8 | 10 | End-to-end pilot gate and three design partner cycles | Definition of done evidence, restore drill, quality numbers |

## Parallel non-code work

1. Recruit 40 prospects and ask for consent to use redacted reports. Do not upload donor documents until data handling and subprocessor terms are agreed.
2. Build the 30-pair golden set across four donors and three report types. Track whether each pair is synthetic, consented, or real/redacted. A smaller set can support early iteration; do not claim the full harness is complete until all 30 qualify.
3. Define the blind scoring sheet and two independent reviewers. Evaluate the same input using PSec and a plain prompt for an honest comparison.
4. Prepare privacy policy, terms, DPA, and subprocessor list for legal review. Verify source claims and provider pricing before publication.
5. Schedule full-cycle walkthroughs with three design partners. Capture actual time-to-export, edit distance, missing-data questions, and defects.

## Dependencies and critical path

- Decisions D04/D05 precede review and budget rendering. D07/D09 precede commercial launch. D10 precedes real donor data.
- Foundation auth/tenant model precedes uploads and jobs. Versioned template/standard contracts precede generation. Data capture precedes evaluation. Approval state precedes final export and billing entitlement tests.
- A polished UI cannot replace missing evidence for Word style fidelity, tenant isolation, or traceability. These are release gates.

## Scope control

The pilot must support the three core flows and the v3 definition of done. v1.1 analytics, notification assignments, reusable section library, and integrations remain deferred. The Organization and Consultant plan descriptions are provisional until D07 resolves their mismatch with v1 scope. Document any accepted deferral and its effect on the pilot in `docs/BUILD_STATE.md`.
