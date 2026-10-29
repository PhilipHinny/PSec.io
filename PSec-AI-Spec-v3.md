# PSec AI — Product Specification v3 (Build & Pilot Edition)

**Product:** PSec AI — the reporting secretary for your whole team
**Owner:** Philip
**Date:** 26 October 2026
**Status:** Build-ready. Supersedes the v2 spec and Supabase addendum.
**Goal of this version:** get a testable product in front of 5–10 Kenyan NGO design partners within 8 weeks.

---

## 1. Product definition

PSec AI is a multi-tenant web application that turns an organization's reporting standard into a repeatable drafting workflow.

An organization uploads either its **blank report template** or **3–10 approved past reports**. PSec builds a **Report Standard** (formerly "Style Profile"): the required sections, order, tone, terminology, formatting, and boilerplate. Employees then log what they did and what the numbers are; PSec drafts the report in that standard, section by section. A manager reviews, edits, approves, and exports a branded PDF or DOCX.

**One-liner:** Upload your donor template once. Your team logs activities. PSec drafts the quarterly report in that exact format, ready for review.

**Positioning statement:** For NGOs and donor-funded programs that spend weeks assembling recurring reports in donor-specific formats, PSec AI converts field activity and indicator data into a structured draft that matches the donor's required format—cutting drafting and review time without changing what the donor receives.

### What PSec is not

- Not a general chatbot or AI assistant
- Not a replacement for M&E judgment, finance verification, or sign-off
- Not a tool that invents indicator values, beneficiary counts, or budget figures
- Not a surveillance system for scoring staff output

## 2. Beachhead market

### Primary ICP

Mid-sized Kenyan NGO or donor-funded program:

- 10–100 staff
- 3+ active donors (e.g., USAID, FCDO, EU, UNICEF, Gates, Mastercard Foundation, UN agencies)
- Reports quarterly or monthly, each in a donor-mandated format
- An M&E manager or program manager who owns report quality
- Field staff who already log activities in sheets, WhatsApp, or a database

### Why this segment first

The reporting burden is documented and large: one study found **eight staff involved in preparing each donor report** and **40–50% of those staff members' time** going to reporting requirements. [web:109] Multi-country NGOs reported producing **45–65 reports a year for 10–12 donors** and perceived **40–59% of reporting as duplicative**. [web:115] Kenya alone has roughly **14,687 public benefit organizations** plus 70,000+ societies, with statutory annual reporting duties. [web:118]

### Secondary ICP

Audit, accounting, and consulting firms serving the same clients, with recurring management letters, audit findings, and advisory reports. Roughly **15,594 professional services firms** operate in East Africa. [web:122] Faster buying decisions, better budgets, more varied formats.

### Explicit anti-ICP for v1

- Individuals writing one-off documents
- Large INGOs with global procurement and security reviews
- Regulated clinical, legal, or financial-audit opinions
- Organizations wanting a general AI assistant

## 3. The three core flows

### Flow A — Template-first (most common)

1. Admin uploads a blank donor template (DOCX or PDF).
2. PSec parses headings, tables, and placeholder fields into a **Template Schema**.
3. Admin confirms the required inputs for each section.
4. Staff fill a report form: period, project, indicators, activities, challenges, lessons.
5. PSec generates a structured draft with narrative sections written and tables populated only from supplied data.
6. Manager reviews, edits, approves, exports.

### Flow B — Example-first (learning the house style)

1. Admin uploads 3–10 past approved reports.
2. PSec extracts a Report Standard: section order, tone, terminology, formatting, boilerplate, typical length per section.
3. Admin reviews and edits the standard.
4. Same generation flow as A.

### Flow C — Activity log (the habit)

1. Staff add short activity entries during the period (date, activity, location, beneficiaries, output, notes).
2. At period end, PSec groups entries by project and output indicator.
3. One click: draft the report from logged activities plus the standard and any imported indicator data.
4. This is the retention loop. If staff log weekly, the quarterly report is nearly free.

### Design rule

Every generated narrative claim must trace to an input: an activity entry, an indicator value, or an uploaded reference. If data is missing, the section is marked `needs_input` with a specific question—never filled with plausible prose.

## 4. Feature specification

### 4.1 v1 — Pilot release (build this)

**Workspace and access**
- Organization workspace, invite by email
- Roles: Owner, Admin, Manager, Contributor, Viewer
- Firebase Auth (Google + email/password), server-verified on every request
- One organization per user in v1

**Templates and standards**
- Upload DOCX/PDF template or 3–10 past reports
- Template Schema editor: sections, order, required/optional, input fields, table columns
- Report Standard editor: tone, terminology, banned phrases, boilerplate, length guidance
- Version history for templates and standards
- Three seeded NGO templates to speed onboarding: quarterly donor progress report, monthly activity report, annual PBO-style activity report

**Data capture**
- Activity log entries with date, project, location, activity, output indicator, beneficiaries, notes
- Manual indicator entry (indicator, target, achieved, period, disaggregation)
- CSV import for indicators and activity logs
- Report intake form generated from the Template Schema

**Generation**
- Section-by-section generation with JSON schema validation
- Per-section regenerate with instruction ("shorter," "more formal," "add lessons learned")
- `needs_input` state with specific follow-up questions
- Source panel: which activity entries and reference documents informed each section
- Draft autosave

**Editing and review**
- Structured editor (TipTap) with headings, bullets, numbered lists, tables
- Comments per section
- Status: Draft → In review → Changes requested → Approved
- Approval records reviewer identity and timestamp
- Version history with restore

**Export**
- DOCX with real Word styles matching the uploaded template where feasible
- PDF with organization logo, header/footer, page numbers
- Optional "Draft — not approved" watermark until approved
- Export log

**Admin**
- Usage dashboard: reports generated, documents stored, seats
- Audit log of uploads, generations, edits, approvals, exports, deletions
- Plan and quota display
- Data deletion with confirmation and cascade

**Billing**
- Paystack card subscription (monthly/annual)
- Paystack invoice for M-PESA and bank transfer customers
- Plan gating: pilot, team, annual

### 4.2 v1.1 — After 10 paying organizations

- Team analytics: report cycle time, revision counts, on-time submission
- Reviewer assignment and notification emails
- Branded cover pages and multiple export presets
- Reusable section library (boilerplate blocks: methodology, safeguarding, acronyms)
- Project and donor entities, so reports inherit project metadata
- WhatsApp/SMS reminders to log activities

### 4.3 Later

- SSO/SAML, SCIM
- Multi-organization membership
- Integrations: Google Drive, SharePoint, KoboToolbox, ODK, CommCare, Excel Online
- Donor format library shared across organizations (opt-in)
- API and webhooks
- Localization: Swahili, French

### 4.4 Removed from the roadmap

- Todo management
- Real-time activity feed as a headline feature
- Chat sessions / general assistant
- Employee productivity scoring
- Public template marketplace

## 5. Product rules that protect trust

1. **No invented numbers.** Indicator tables are rendered from data, never generated by the model.
2. **No invented names.** Beneficiary, partner, and location names must come from inputs or references.
3. **Human approval is mandatory** before an export is marked final.
4. **Draft watermark** by default until approved.
5. **Every section shows its sources.**
6. **Missing data becomes a question**, not filler.
7. **Customer documents are never used to train models.**

## 6. Tech stack

### 6.1 Frontend

| Concern | Choice |
|---|---|
| Framework | React 19 + Vite (keep) |
| Language | TypeScript (add) |
| Server state | TanStack Query |
| Forms | React Hook Form + Zod |
| Editor | TipTap (ProseMirror) |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Firebase Auth SDK |
| Charts | Recharts |
| Analytics | PostHog |
| PDF preview | PDF.js |

Remove client-side PDF/DOCX generation as the primary path. Preview only.

### 6.2 Backend

| Concern | Choice |
|---|---|
| API | FastAPI + Pydantic v2 |
| Runtime | Python 3.12 |
| DB | Supabase Postgres |
| Vectors | pgvector (HNSW, 1,536 dims) |
| Storage | Supabase Storage, private buckets, signed URLs |
| Queue | Celery + Redis (Upstash or Render Redis) |
| Auth | Firebase Admin SDK token verification |
| Extraction | PyMuPDF (PDF), python-docx (DOCX), mammoth (HTML) |
| DOCX export | docx (Node) or python-docx with style mapping |
| PDF export | WeasyPrint (HTML/CSS → PDF) |
| Observability | Sentry + structured JSON logs |
| Hosting | Render/Fly.io (API + worker), Vercel or Firebase Hosting (web) |
| Local dev | Supabase CLI + Docker Compose |

### 6.3 Why Supabase for v1

Postgres, pgvector, and file storage in one project with one bill. pgvector supports HNSW indexes up to 2,000 dimensions, sufficient for 1,536-dimension embeddings. [web:51][web:58] Firebase Auth can be registered as a third-party auth provider later if browser-direct access is ever needed. [web:49]

**Access pattern for v1:** browser talks only to FastAPI. FastAPI verifies the Firebase token, resolves `org_id` from membership, and accesses Supabase with the service role key held server-side. RLS is enabled and written, but the service layer is the enforcement boundary. Never expose the service role key to the client.

### 6.4 Supabase limits to plan around

- Free: 50 MB max file per bucket, 1 GB storage, 5 GB egress [web:57][web:48]
- Pro: 100 GB storage, 250 GB egress, then $0.0213/GB storage and $0.09/GB uncached egress [web:55][web:59]
- Egress is the constraint: cache exports, avoid re-rendering previews
- Use the Supavisor pooler connection string; small per-process pools
- Alembic migrations only; no dashboard schema edits

## 7. LLM strategy

### 7.1 Access

Use **OpenRouter** for v1. Provider list price plus 5.5% when buying credits, no per-request markup, and one integration for testing multiple models. [web:73][web:77] Consumer Claude and ChatGPT subscriptions cannot serve application traffic—API billing is separate. [web:71][web:72]

Migrate the high-volume drafting path to a direct Anthropic key once monthly inference is material; keep OpenRouter for cheap side tasks.

### 7.2 Model routing

| Task | Model | Why |
|---|---|---|
| Template parsing, section tagging, document classification | Gemini 2.5 Flash | Cheap, fast, high volume: $0.30/M input, $2.50/M output [web:45] |
| Report Standard extraction | Claude Sonnet 5.5 | Long-context structure adherence |
| Narrative section drafting | Claude Sonnet 5.5 | Tone and instruction-following; $2/M input, $10/M output [web:43] |
| Section rewrite / inline edit | Claude Sonnet 5.5 (short context) | Quality consistency |
| Rubric quality check | Claude Sonnet 5.5 | Structured scoring |
| Embeddings | text-embedding-3-small (1,536 dims) | Cheap, adequate for section retrieval |

### 7.3 Cost model

Typical quarterly report: 18k input tokens (standard, retrieved references, inputs), 4k output.

- Input: 18k × $2/M = $0.036
- Output: 4k × $10/M = $0.040
- Total: **≈ $0.076 per report**, about **KES 10**
- With prompt caching on the Report Standard, input cost drops materially on repeat runs

At KES 10,000/month per organization with 20 reports, inference is roughly KES 200. Gross margin is not the risk; wasted generations and oversized context are.

### 7.4 Cost controls

- Hard credit limit per OpenRouter key, per environment
- Model allowlist in code
- Per-org monthly generation quota
- Prompt caching for standards and templates
- Log model, tokens, cached tokens, cost, latency, and validation result for every call
- Alert if cost per report exceeds $0.25

### 7.5 Prompt contract

```
SYSTEM
You draft organizational reports. Follow the Report Standard exactly.
Do not invent facts, numbers, names, dates, or locations.
Every factual statement must trace to the provided inputs or references.
Return JSON matching the output schema. No text outside JSON.

REPORT STANDARD
{standard_json}

TEMPLATE SCHEMA
{sections with required fields, tables, length limits}

REFERENCE EXCERPTS
[ref_1] {section_label} — {content}
[ref_2] ...

INPUTS
activities: [...]
indicators: [...]
period, project, donor, narrative notes

OUTPUT RULES
- Required section with insufficient input → status "needs_input" + one specific question
- Indicator tables rendered from data only
- No superlatives, no beneficiary numbers not in inputs
```

Validate with Pydantic. On failure, one repair pass with the validation error. Then partial draft with a visible warning—never silent degradation.

## 8. Architecture

```
Browser (React 19 + TS + TipTap)
   │ HTTPS + Firebase ID token
   ▼
FastAPI (auth, orgs, templates, reports, review, billing)
   ├── Supabase Postgres (+ pgvector)
   ├── Supabase Storage (private buckets)
   ├── Redis (queue, rate limits, cache)
   └── Celery workers
         ├── extract   (parse template / past reports)
         ├── embed     (chunk + embeddings)
         ├── generate  (retrieval + LLM + validation)
         └── export    (DOCX/PDF render to storage)
   │
   ├── OpenRouter (LLMs, embeddings)
   ├── Firebase Admin (token verification)
   └── Paystack (subscriptions, invoices, webhooks)
```

### Generation sequence

1. Contributor submits intake form + selected activities.
2. API creates `report` row, status `queued`, enqueues job.
3. Worker retrieves top-k chunks from the org's standards and approved references, filtered by `org_id`.
4. Worker assembles prompt, calls OpenRouter, validates JSON.
5. Rubric check runs; one repair pass if needed.
6. Sections saved; report status `draft`; UI updates via polling or SSE.
7. Reviewer edits and approves.
8. Export worker renders DOCX/PDF to storage; signed URL returned.

### Multi-tenancy

- `org_id` on every table
- Authorization in the service layer, with Postgres RLS as defense in depth
- Storage paths namespaced by `org_id`
- Vector queries always filtered by `org_id`
- Explicit cross-organization access tests in CI

## 9. Data model

```sql
organizations (id, name, slug, country, plan, created_at)
users (id, firebase_uid, email, name, created_at)
memberships (id, org_id, user_id, role, status)
projects (id, org_id, name, donor, start_date, end_date, code)
templates (id, org_id, name, source_type, schema_json, status, version)
report_standards (id, org_id, template_id, version, standard_json, created_by)
documents (id, org_id, uploaded_by, filename, storage_key, doc_type, status, page_count)
document_chunks (id, org_id, document_id, section_label, content, embedding, token_count)
activities (id, org_id, project_id, user_id, activity_date, location, activity, output, beneficiaries, notes)
indicators (id, org_id, project_id, name, unit, target, period, achieved, disaggregation_json)
reports (id, org_id, project_id, template_id, created_by, status, title, period_start, period_end)
report_sections (id, report_id, section_key, order_index, content_json, status, sources_json)
report_versions (id, report_id, version, snapshot_json, created_by, created_at)
comments (id, report_id, section_key, author_id, body, resolved_at)
approvals (id, report_id, reviewer_id, decision, comment, created_at)
generations (id, org_id, report_id, section_key, model, prompt_tokens, completion_tokens, cached_tokens, cost_usd, latency_ms, status)
exports (id, report_id, format, storage_key, watermark, created_at)
audit_events (id, org_id, actor_id, action, target_type, target_id, metadata, created_at)
subscriptions (id, org_id, provider, plan, status, current_period_end)
usage_counters (id, org_id, period, generations_used, documents_stored)
```

Indexes: `(org_id)` on every table, `document_chunks (org_id, document_id)`, HNSW on `embedding`, `reports (org_id, status, period_end)`.

## 10. API surface

```
POST   /v1/auth/session
GET    /v1/me

POST   /v1/orgs
GET    /v1/orgs/{id}/members
PATCH  /v1/orgs/{id}/members/{member_id}

POST   /v1/projects
GET    /v1/projects

POST   /v1/templates                 (upload template or examples)
GET    /v1/templates
GET    /v1/templates/{id}
PATCH  /v1/templates/{id}            (edit schema)
POST   /v1/templates/{id}/publish

GET    /v1/report-standards/{id}
PATCH  /v1/report-standards/{id}

POST   /v1/documents/presign
POST   /v1/documents
GET    /v1/documents
DELETE /v1/documents/{id}

POST   /v1/activities
GET    /v1/activities?project_id=&from=&to=
POST   /v1/activities/import         (CSV)

POST   /v1/indicators
POST   /v1/indicators/import

POST   /v1/reports                   (create + enqueue generation)
GET    /v1/reports
GET    /v1/reports/{id}
PATCH  /v1/reports/{id}/sections/{key}
POST   /v1/reports/{id}/sections/{key}/regenerate
POST   /v1/reports/{id}/submit
POST   /v1/reports/{id}/approve
POST   /v1/reports/{id}/request-changes

POST   /v1/exports
GET    /v1/exports/{id}              (signed URL)

GET    /v1/analytics/usage
GET    /v1/audit-events

POST   /v1/billing/checkout
POST   /v1/billing/webhook
```

All endpoints verify the Firebase ID token. `org_id` comes from membership, never from the request body.

## 11. Quality harness

### 11.1 Golden set (build before generation code)

- 30 real report pairs: inputs plus approved output, redacted
- Cover 4 donors and 3 report types
- Rubric per report: required sections present, all numbers traceable, tone match, length within bounds, no invented entities, no unsupported claims

### 11.2 Blind review

- Two raters not on the build, scoring 1–5 per dimension
- Report mean and inter-rater disagreement
- Run on every prompt or model change

### 11.3 Head-to-head

For each design partner: generate the same report with PSec and with a plain ChatGPT/Claude prompt using the same inputs. Ask the manager which they would send. This is the honest test and the sales asset.

### 11.4 Production metrics

| Metric | Target |
|---|---|
| First-draft acceptance (approved with minor edits) | 60%+ |
| Median edit distance per section | Falling release over release |
| Section regeneration rate | Under 25% |
| Factual traceability failures | Under 2% |
| Draft → export time | Under 20 minutes |
| Generation success rate | 99%+ |
| Cost per report | Under $0.25 |

## 12. Security and data handling

- Verify Firebase ID tokens server-side; never trust client-supplied identity
- Service role key server-side only; rotate on suspicion
- Private buckets, signed URLs expiring in 60–300 seconds
- File type, size, and malware checks on upload
- Rate limits per user and per organization
- Audit log on every state-changing action
- Encryption in transit and at rest
- Backups tested with a restore drill before onboarding real data

**Data commitments to publish:**

- Customer documents are not used to train models
- Configurable retention (default: retain until deleted by the organization)
- Deletion removes file, text, chunks, embeddings, and derived caches
- Data processing agreement available on request
- Subprocessor list published (Supabase, OpenRouter, model providers, hosting, Paystack)

## 13. Pricing

| Plan | Price | Includes |
|---|---|---|
| Pilot | KES 20,000 one-off | One report cycle, done with you, 5 users, 1 template |
| Team | KES 12,000/month or KES 120,000/year | 10 users, 5 templates, unlimited reports (fair use 40/month), DOCX + PDF, approvals, audit log |
| Organization | KES 30,000/month | 30 users, unlimited templates, team analytics, priority support, DPA |
| Consultant / firm | KES 25,000/month | Multi-client workspaces, per-client standards, white-label export |

Rules:

- Price per organization, not per seat, at pilot stage
- Annual prepay at ~17% discount
- Card subscription via Paystack; M-PESA and bank transfer via Paystack invoice, renewed manually because subscriptions charge cards only [web:94]
- Kenya card payments ~2.9%, M-PESA ~1.5%, international cards ~3.8% [web:103]
- Fair-use generation cap protects inference cost without punishing normal use

## 14. Support model

Do not promise 24/7 human support as a solo founder. Publish what you can keep:

- Self-serve help center and in-app guidance at any hour
- Instant AI-assisted first response for common questions
- Human response within 4 business hours, 08:00–18:00 EAT, Monday–Saturday
- WhatsApp escalation line for Team and Organization plans during those hours
- Documented status page for incidents

## 15. Pilot plan: first 10 organizations

### Target criteria

- Nairobi-based or Nairobi-headquartered
- 10–100 staff, 3+ active donors
- Quarterly or monthly donor reporting
- A named M&E or program manager
- Willing to share two redacted past reports

### Outreach sequence

1. Build a list of 40 organizations from the PBO register, LinkedIn, and donor-funded program pages.
2. Identify the M&E Manager, Program Manager, or Country Director by name.
3. First touch: short LinkedIn message or email asking for two redacted past reports, not a demo.
4. Within 48 hours of receiving them, send a side-by-side: their last report vs a PSec draft of the same period.
5. Offer a paid pilot at KES 20,000 for one cycle.
6. Convert to Team plan if the manager used the draft with light edits.

### Message template

> Hi {name} — I'm building a tool that drafts donor reports in your exact format from your field activity data. Not a generic AI writer. Could you share two redacted past reports for the same donor? I'll send back a draft of your next quarter in that format, free, so you can judge the quality yourself.

### Pilot success criteria

- 3 of 5 approached organizations pay for a pilot
- 60%+ of generated sections survive review with light edits
- Manager exports at least one report without rebuilding it
- Median draft-to-export under 20 minutes
- At least one organization asks to add colleagues

If fewer than 3 of 5 convert, pivot the wedge to audit/consulting firms before expanding the feature set.

## 16. Build plan

### Phase 1 — Foundation (week 1)

- Monorepo: `apps/web`, `apps/api`, `apps/worker`, `packages/shared`
- Supabase project, schema, Alembic migrations, pgvector
- Firebase Admin verification middleware
- Org, membership, role model
- Presigned upload flow

### Phase 2 — Template and standard (weeks 2–3)

- DOCX/PDF upload and parsing
- Template Schema extraction and editor
- Report Standard extraction from examples
- Three seeded NGO templates
- Versioning

### Phase 3 — Data capture and generation (weeks 3–5)

- Activity log CRUD and CSV import
- Indicator entry and CSV import
- Intake form generated from schema
- Retrieval over references
- Section-by-section generation with validation
- Regeneration and `needs_input` handling
- Draft editor with autosave

### Phase 4 — Review and export (weeks 5–6)

- Comments, statuses, approvals
- Version history
- DOCX export with style mapping
- PDF export with branding and watermark
- Signed download URLs

### Phase 5 — Commercial and pilot-ready (weeks 7–8)

- Paystack subscriptions and invoices
- Plan gating and quotas
- Audit log and usage dashboard
- Onboarding wizard: create org → upload template → log activities → generate → export
- Help center, privacy policy, terms, DPA template
- Sentry, PostHog, error budgets
- Golden-set evaluation run and published quality numbers

## 17. Migration from the existing PSec build

| Existing | Action |
|---|---|
| Flask app | Port routes to FastAPI; keep business logic where sound |
| `user_id` in request bodies | Replace with verified Firebase UID |
| MongoDB collections | Migrate to Postgres schema; keep raw text in `documents` if useful |
| `vector_db.py` | Replace with pgvector queries filtered by `org_id` |
| Client-side PDF/DOCX generation | Move to export workers |
| Markdown report blobs | Convert to `report_sections` JSON |
| "AI learns your style" copy | Replace with Report Standard |
| Firebase Storage | Move to Supabase Storage private buckets |
| Todo, chat, activity feed | Remove from navigation |
| Paystack routes | Keep, extend for subscriptions and invoices |
| CORS hardcoded | Environment-driven allowlist |

Reuse: auth UI, dashboard shell, Paystack integration, document upload UX, existing AI service wrapper (rewritten around routing and validation).

## 18. Metrics that decide the next move

| Stage | Metric | Threshold to proceed |
|---|---|---|
| Pilot recruitment | Organizations agreeing to share reports | 5 of 40 contacted |
| Pilot conversion | Paid pilots | 3 of 5 |
| Quality | First-draft acceptance | 60%+ |
| Activation | First export within 48h of signup | 50%+ |
| Retention | Still generating in month 2 | 70% of pilots |
| Expansion | Seats added in 90 days | 30% of accounts |
| Unit economics | Cost per report | Under $0.25 |
| Reliability | Generation success | 99%+ |

## 19. Risks and mitigations

| Risk | Mitigation |
|---|---|
| NGOs stall on budget or procurement | Paid pilot at a low fixed price; fallback to consulting firms |
| Donor data cannot leave the org | Private storage, no training, DPA, deletion, optional on-prem later |
| Model invents numbers | Tables rendered from data; traceability check; `needs_input` |
| Template parsing fails on complex DOCX | Seed formats first, human confirmation step, manual schema editor as fallback |
| Egress and inference costs creep | Prompt caching, quotas, export caching, cost alerts |
| Solo founder support load | Published hours, help center, AI first response |
| Copycats | Standards library, approval history, donor-specific depth, distribution |
| Service role key leak | Server-only env var, rotation, secret scanning in CI |
| Free plan abuse | Pilot is paid; quotas per org |

## Appendix A — Template Schema example

```json
{
  "name": "Quarterly Donor Progress Report",
  "donor": "Example Donor",
  "sections": [
    {"key": "cover", "label": "Cover Page", "required": true, "type": "static"},
    {"key": "summary", "label": "Executive Summary", "required": true, "max_words": 300},
    {"key": "context", "label": "Project Context", "required": true, "max_words": 400},
    {"key": "results", "label": "Results Against Indicators", "required": true, "type": "table",
     "columns": ["Indicator", "Target", "Achieved", "Variance", "Comment"]},
    {"key": "activities", "label": "Key Activities", "required": true, "style": "narrative"},
    {"key": "challenges", "label": "Challenges & Mitigation", "required": true},
    {"key": "lessons", "label": "Lessons Learned", "required": true},
    {"key": "finance", "label": "Budget Utilisation", "required": true, "type": "table"},
    {"key": "next", "label": "Next Quarter Plan", "required": true},
    {"key": "annex", "label": "Annexes", "required": false}
  ],
  "inputs": [
    {"key": "period", "type": "date_range", "required": true},
    {"key": "project", "type": "project_ref", "required": true},
    {"key": "activities", "type": "activity_refs", "required": true},
    {"key": "indicators", "type": "indicator_refs", "required": true}
  ]
}
```

## Appendix B — Seed templates to ship

1. Quarterly donor progress report (narrative + indicator table + budget table)
2. Monthly activity report (activities, outputs, challenges, next month)
3. Annual organizational activity report (PBO-style governance and program summary)

## Appendix C — Onboarding target

New organization reaches first exported report in **under 30 minutes**, with the first template seeded rather than built from scratch.

## Appendix D — Definition of done for the pilot release

- A new org can sign up, upload a template, log activities, generate, review, approve, and export without help
- Cross-org access is impossible and tested
- 10 consecutive generations succeed without manual intervention
- A report exported to DOCX opens correctly in Word with styles intact
- Cost per report is visible internally
- Privacy policy, terms, and DPA are published
- Three design partners have completed a full cycle

---

*All provider pricing and model figures should be re-verified before commercial launch.*
