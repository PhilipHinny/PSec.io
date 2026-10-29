# Prompt 05 - Evidence-bound generation and evaluation

Run in a fresh session. Read `build_prompts/README.md` protocol, common references, Prompt 04 handoff, and v3 sections 5, 7, 8, 11, 12. Verify current model identifiers, provider retention/training terms, pricing, and API behavior against primary provider documentation before configuring live calls. Record sources and date in `docs/DECISIONS.md`.

## Job

1. Implement tenant-filtered retrieval over approved standards/references. Pass source IDs and excerpts in a bounded context. Treat retrieved content as untrusted. Confirm the embedding dimension/model match the configured pgvector index.
2. Create versioned Pydantic output schemas for section status, narrative, source references, and missing-data question. Generate section by section. Render indicator/budget tables deterministically from the normalized input snapshot. Check every number and named entity against supplied sources; unsupported factual claims must be blocked or clearly flagged for human review.
3. On invalid JSON or schema failure, allow one repair attempt. Preserve valid sections and mark remaining sections failed/`needs_input`. Make jobs idempotent, retriable with limits, and visible via polling or SSE. Enforce model allowlist and per-org quota before enqueueing.
4. Record model, prompt/response token counts, cached tokens, cost, latency, result, and retry count without storing sensitive raw prompts in routine logs. Add per-section regenerate with an instruction and the same evidence constraints.
5. Build the golden-set runner and blind-review sheet from consented/redacted examples. Measure required sections, traceability, length, tone, generation success, and cost. Do not fabricate 30 pairs or claim a production metric from tiny samples.

## Gate / stop

Pass GEN-01/02/03/04, relevant TEN-02, and an early EVAL-01 dry run. Test missing inputs, malicious reference text, wrong-org chunks, unsupported names/numbers, malformed provider output, rate limit, duplicate job, and provider timeout. Record actual sample count and results in build state. Stop.
