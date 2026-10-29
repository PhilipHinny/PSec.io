# Prompt 04 - Activity, indicator, and intake data

Run in a fresh session. Read `build_prompts/README.md` protocol, common references, Prompt 03 handoff, and v3 sections 3, 4.1, 5, 9, 10, Appendix A. Resolve D05 before implementing the budget table path.

## Job

1. Implement activity entries and indicators with project, period, ownership, and audit metadata. Define units, target/achieved distinction, disaggregation validation, and handling of missing versus zero values. Reject cross-org project and indicator references.
2. Add CSV import with preview/validation, column mapping for the documented format, row errors, duplicate behavior, and a transaction policy. Record source file provenance without putting sensitive row data in logs.
3. Generate report intake fields from a published Template Schema. Let a user select scoped activities and indicators for a specific period/project. Require explicit finance/budget inputs if D05 chooses them; otherwise mark the finance section `needs_input`.
4. Define the normalized input snapshot passed to generation. It must retain source IDs and exact numeric values. Add period boundary and timezone tests.

## Gate / stop

Pass DAT-01/DAT-02 and TEN-01 for activities, indicators, imports, and intake. Show malformed CSV, duplicate row, empty value, and cross-org ID behavior. Record the import contract and tests in build state; stop before generation.
