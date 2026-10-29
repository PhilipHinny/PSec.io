# Pilot acceptance matrix

Every ID needs a test or documented manual evidence. Mark `Pass`, `Fail`, or `Blocked` in the build-state handoff; never infer pass from an implemented screen. These checks map to the v3 definition of done and trust rules.

| ID | Acceptance evidence | Prompt |
|---|---|---|
| FND-01 | Empty DB migrates cleanly; repeat migration is stable; rollback/recovery documented. | 01 |
| FND-02 | API and worker run locally from documented environment variables; no secret in client bundle or repository. | 01 |
| TEN-01 | Two organizations: users cannot read/write each other's projects, templates, documents, activities, indicators, reports, comments, exports, or billing state by changing IDs. | 02 onward |
| TEN-02 | Worker, vector retrieval, private object download, and signed URL issuance deny cross-org access and missing tenant context. | 03/05/07 |
| AUTH-01 | Invalid/expired Firebase tokens and inactive membership fail; role/action matrix covers every endpoint. | 02 |
| TMP-01 | DOCX and PDF blank template parse headings/tables/placeholders; admin can correct schema and publish a version. | 03 |
| TMP-02 | 3-10 examples yield an editable standard; version changes do not alter reports already created. | 03 |
| TMP-03 | Three seeded NGO templates work from first signup. | 03 |
| DAT-01 | Activity and indicator CRUD, CSV import validation, period filters, and selected-source intake work. | 04 |
| DAT-02 | No supplied indicator/finance figure is silently transformed or model-created; missing budget data is visible. | 04/05 |
| GEN-01 | Required section with insufficient evidence becomes `needs_input` with one concrete question. | 05 |
| GEN-02 | Every factual sentence has an accessible, same-org source reference; entity/number mismatch is rejected or visibly flagged. | 05 |
| GEN-03 | Invalid model JSON gets one repair attempt then an explicit partial/failed result; no silent section loss. | 05 |
| GEN-04 | Model, token usage, cost, latency, validation, quota, and retry attempts are recorded. | 05/09 |
| EVAL-01 | Golden set has 30 qualified pairs; blind two-rater rubric and disagreement report exist; factual traceability failures below 2%. | 05/10 |
| REV-01 | Autosave conflict, comments, transitions, immutable versions, restore, and approval identity/time work. | 06 |
| REV-02 | Edit after approval invalidates final status; only authorized human can approve. | 06 |
| EXP-01 | DOCX opens in Word/LibreOffice with real headings/tables and representative template style mapping. | 07 |
| EXP-02 | PDF has logo, header/footer, page numbers; unapproved exports show draft watermark; signed URL expires. | 07 |
| WEB-01 | New org completes signup -> template -> data -> generate -> review -> approve -> export without help; first export under 30 minutes in usability trial. | 08/10 |
| BIL-01 | Client cannot set price, plan, or paid state; signed duplicate/replayed webhooks are idempotent; quota gating is server-side. | 09 |
| OPS-01 | Upload, edit, approval, export, billing, delete audits exist; deletion removes source file/text/chunks/embedding/cache per policy. | 09 |
| OPS-02 | Backup restore drill succeeds; error tracking and alerts work; privacy/terms/DPA/subprocessors reviewed and published before live data. | 09/10 |
| PILOT-01 | Ten consecutive generations without intervention; generation success >=99% over observed pilot attempts, with denominator and exclusions stated. | 10 |
| PILOT-02 | Three design partners complete full cycle; first-draft acceptance >=60%, median draft-to-export <20 minutes, cost/report <$0.25. | 10 |

## Rubric for narrative evaluation

Score each section 1-5 for required structure, factual support, tone, length, and usefulness. Raters work independently and record exact unsupported claims and source IDs. A traceability failure is a factual claim with no accessible source or a number/entity that disagrees with its cited source. Count failures per factual claim and also per report; publish both denominators. Editorial quality cannot excuse an unsupported claim. Track inter-rater disagreement and adjudicate disagreements before reporting the final rate.

## Release rule

All critical trust gates (`TEN`, `AUTH`, `DAT-02`, `GEN-01` to `GEN-03`, `REV-02`, `EXP-02`, `BIL-01`, `OPS-02`) must pass before real customer data or paid self-serve launch. `PILOT` metrics require observed usage; if sample size is too small, report the count and uncertainty rather than claiming the target was met.
